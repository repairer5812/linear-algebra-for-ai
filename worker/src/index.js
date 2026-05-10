// Cloudflare Worker — 진단 테스트 익명 응답 수집 + 관리자 조회 + AI 분석
//
// Endpoints:
//   POST /submit             — 익명 진단 응답 제출 (CORS open)
//   GET  /admin?token=XXX    — 모든 응답 raw 반환 (관리자 토큰 필요)
//   GET  /stats?token=XXX    — 집계 통계 (문항별·축별·점수 분포)
//   GET  /analyze?token=XXX  — Upstage Solar로 AI 분석 (관리자 토큰 필요)
//
// KV: DIAGNOSTICS namespace
// Env vars (wrangler secret):
//   ADMIN_TOKEN       — 관리자 인증 토큰
//   UPSTAGE_API_KEY   — Upstage Solar API 키

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/submit') {
      return await handleSubmit(request, env);
    }
    if (request.method === 'GET' && url.pathname === '/admin') {
      return await handleAdmin(url, env);
    }
    if (request.method === 'GET' && url.pathname === '/stats') {
      return await handleStats(url, env);
    }
    if (request.method === 'GET' && url.pathname === '/analyze') {
      return await handleAnalyze(url, env);
    }
    if (request.method === 'GET' && url.pathname === '/') {
      return new Response('linear-algebra-for-ai diagnostic API\n', {
        headers: CORS_HEADERS,
      });
    }
    return jsonResponse({ error: 'not found' }, 404);
  },
};

// Rate limit 설정: 한 IP 당 5분 1회
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;   // 5분
const RATE_LIMIT_TTL_SEC = 600;               // KV 자동 만료 10분

async function handleSubmit(request, env) {
  // === Rate limit 체크 (IP 기반) ===
  const ip = request.headers.get('CF-Connecting-IP')
          || request.headers.get('X-Forwarded-For')
          || 'unknown';
  const rlKey = `rl:${ip}`;
  const lastSubmitStr = await env.DIAGNOSTICS.get(rlKey);
  const now = Date.now();

  if (lastSubmitStr) {
    const elapsed = now - parseInt(lastSubmitStr, 10);
    if (elapsed < RATE_LIMIT_WINDOW_MS) {
      const retryAfter = Math.ceil((RATE_LIMIT_WINDOW_MS - elapsed) / 1000);
      return new Response(
        JSON.stringify({
          error: 'rate_limited',
          message: '한 IP 당 5분에 1회 제출만 가능합니다. 잠시 후 다시 시도해주세요.',
          retry_after_sec: retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(retryAfter),
            ...CORS_HEADERS,
          },
        },
      );
    }
  }

  // === 본문 검증 ===
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: 'invalid json' }, 400);
  }

  if (!Array.isArray(body.answers) || body.answers.length !== 20) {
    return jsonResponse({ error: 'answers must be array of 20' }, 400);
  }
  if (!Array.isArray(body.axisScores) || body.axisScores.length !== 6) {
    return jsonResponse({ error: 'axisScores must be array of 6' }, 400);
  }

  // === 응답 저장 + Rate limit 마커 갱신 ===
  const id = crypto.randomUUID();
  const record = {
    id,
    timestamp: now,
    ip,                              // 익명 통계용 (외부 노출 X, /admin 토큰으로만 조회)
    answers: body.answers,
    correct: body.correct,
    axisScores: body.axisScores,
    totalScore: body.totalScore,
    userAgent: request.headers.get('User-Agent') || '',
  };

  await Promise.all([
    env.DIAGNOSTICS.put(`resp:${id}`, JSON.stringify(record)),
    env.DIAGNOSTICS.put(rlKey, String(now), { expirationTtl: RATE_LIMIT_TTL_SEC }),
  ]);

  return jsonResponse({ ok: true, id });
}

async function handleAdmin(url, env) {
  const token = url.searchParams.get('token');
  if (!token || token !== env.ADMIN_TOKEN) {
    return jsonResponse({ error: 'unauthorized' }, 401);
  }

  const list = await env.DIAGNOSTICS.list({ prefix: 'resp:' });
  const responses = [];
  for (const k of list.keys) {
    const v = await env.DIAGNOSTICS.get(k.name);
    if (v) responses.push(JSON.parse(v));
  }
  return jsonResponse({ count: responses.length, responses });
}

async function handleStats(url, env) {
  const token = url.searchParams.get('token');
  if (!token || token !== env.ADMIN_TOKEN) {
    return jsonResponse({ error: 'unauthorized' }, 401);
  }

  const list = await env.DIAGNOSTICS.list({ prefix: 'resp:' });
  const responses = [];
  for (const k of list.keys) {
    const v = await env.DIAGNOSTICS.get(k.name);
    if (v) responses.push(JSON.parse(v));
  }

  if (responses.length === 0) {
    return jsonResponse({ count: 0, message: '응답 없음' });
  }

  // 문항별 정답률 + 보기별 분포
  const questionStats = [];
  for (let q = 0; q < 20; q++) {
    const choices = { a: 0, b: 0, c: 0, d: 0 };
    let correctCount = 0;
    for (const r of responses) {
      const ans = r.answers[q];
      if (ans && choices[ans] !== undefined) choices[ans]++;
      if (r.correct && r.correct[q]) correctCount++;
    }
    questionStats.push({
      question: q + 1,
      correctRate: correctCount / responses.length,
      choiceDistribution: choices,
    });
  }

  // 축별 평균·분포
  const axisStats = [];
  for (let a = 0; a < 6; a++) {
    const scores = responses.map(r => r.axisScores[a]);
    const mean = scores.reduce((s, v) => s + v, 0) / scores.length;
    const sorted = [...scores].sort((x, y) => x - y);
    const median = sorted[Math.floor(scores.length / 2)];
    axisStats.push({
      axis: a + 1,
      mean: Number(mean.toFixed(1)),
      median: Number(median.toFixed(1)),
      min: Math.min(...scores),
      max: Math.max(...scores),
    });
  }

  // 총점 분포 (10점 단위 bin)
  const totalBins = new Array(11).fill(0);
  for (const r of responses) {
    const bin = Math.min(10, Math.floor(r.totalScore / 10));
    totalBins[bin]++;
  }

  const totalScores = responses.map(r => r.totalScore);
  const totalMean = totalScores.reduce((s, v) => s + v, 0) / totalScores.length;

  return jsonResponse({
    count: responses.length,
    questionStats,
    axisStats,
    totalScoreDistribution: totalBins,
    totalScoreMean: Number(totalMean.toFixed(1)),
  });
}

// AI 분석: Upstage Solar API로 진단 결과 해석
async function handleAnalyze(url, env) {
  const token = url.searchParams.get('token');
  if (!token || token !== env.ADMIN_TOKEN) {
    return jsonResponse({ error: 'unauthorized' }, 401);
  }
  if (!env.UPSTAGE_API_KEY) {
    return jsonResponse({ error: 'UPSTAGE_API_KEY not configured' }, 500);
  }

  // 응답 수집 + 집계 (handleStats 와 동일 로직)
  const list = await env.DIAGNOSTICS.list({ prefix: 'resp:' });
  const responses = [];
  for (const k of list.keys) {
    const v = await env.DIAGNOSTICS.get(k.name);
    if (v) responses.push(JSON.parse(v));
  }
  if (responses.length === 0) {
    return jsonResponse({ error: '응답 없음 — 분석할 데이터 부족' }, 400);
  }

  const axisNames = [
    '벡터·내적 (노름·코사인 유사도)',
    '행렬연산 (가우스 소거·LU·BLAS)',
    '부분공간·계수 (영공간·차원 정리)',
    '직교성·정사영 (QR·최소제곱·attention)',
    '분해·고윳값 (SVD·PCA·LoRA)',
    'AI 응용·코딩 (NumPy·신경망 분해)',
  ];

  // 축별 평균
  const axisLines = axisNames.map((name, a) => {
    const scores = responses.map(r => r.axisScores[a]);
    const mean = scores.reduce((s, v) => s + v, 0) / scores.length;
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    return `  축${a + 1} ${name}: 평균 ${mean.toFixed(1)}, 최저 ${min}, 최고 ${max}`;
  }).join('\n');

  // 문항별 정답률 + 보기 분포
  const qLines = [];
  for (let q = 0; q < 20; q++) {
    const choices = { a: 0, b: 0, c: 0, d: 0 };
    let correct = 0;
    for (const r of responses) {
      const ans = r.answers[q];
      if (ans && choices[ans] !== undefined) choices[ans]++;
      if (r.correct && r.correct[q]) correct++;
    }
    const rate = (correct / responses.length * 100).toFixed(0);
    qLines.push(`  Q${q + 1}: 정답률 ${rate}% | a:${choices.a} b:${choices.b} c:${choices.c} d:${choices.d}`);
  }

  // 총점
  const totalScores = responses.map(r => r.totalScore);
  const totalMean = totalScores.reduce((s, v) => s + v, 0) / totalScores.length;
  const totalMin = Math.min(...totalScores);
  const totalMax = Math.max(...totalScores);

  const prompt = `당신은 선형대수 강좌의 강사를 돕는 데이터 분석 어시스턴트입니다.
다음은 선형대수 진단 테스트의 익명 응답 집계입니다.

[응답 수] ${responses.length}명
[총점] 평균 ${totalMean.toFixed(1)}점, 최저 ${totalMin}점, 최고 ${totalMax}점

[6 핵심역량 축별 점수]
${axisLines}

[20개 문항별 정답률·보기 분포]
${qLines.join('\n')}

위 결과를 바탕으로 강사에게 다음 4가지를 한국어로 분석해주세요:

1. 학생 그룹의 강점 영역과 약점 영역 (구체적 축 이름과 점수 인용)
2. 가장 어려워한 문항 3개와 학생들이 어떤 오개념을 가지고 있을 가능성 (보기 분포 패턴 활용)
3. 강의에서 보강해야 할 주차 영역 — Part 1 (벡터·행렬·부분공간·정사영·QR) 또는 Part 2 (고윳값·SVD·PCA·AI 모듈) 중 어디?
4. 흥미로운 패턴이나 outlier (있는 경우만)

답변 형식:
- 각 항목 3-5문장 이내로 간결하게
- 응답 수가 ${responses.length}명임을 고려하여 일반화 한계를 명시
- 추측은 "~로 추정됩니다" 식으로 표시
- 이모지·과장 표현 금지`;

  try {
    const upstageRes = await fetch('https://api.upstage.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.UPSTAGE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'solar-pro',
        messages: [{ role: 'user', content: prompt }],
        stream: false,
      }),
    });

    if (!upstageRes.ok) {
      const errText = await upstageRes.text();
      return jsonResponse({
        error: `Upstage API error ${upstageRes.status}`,
        detail: errText.slice(0, 500),
      }, 502);
    }

    const data = await upstageRes.json();
    const analysis = data.choices?.[0]?.message?.content || '분석 결과 없음';

    return jsonResponse({
      count: responses.length,
      analysis,
      model: data.model || 'solar-pro',
      timestamp: Date.now(),
    });
  } catch (err) {
    return jsonResponse({
      error: 'Upstage API 호출 실패',
      detail: String(err).slice(0, 500),
    }, 502);
  }
}
