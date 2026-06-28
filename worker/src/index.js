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
//
// 무료 한도 보호 설계 (2026-06-08):
//   - Rate limit 마커를 KV가 아니라 Cache API(edge)에 저장한다. 그래서 /submit 1건당
//     KV 작업은 응답 저장 put 1회뿐(이전엔 rl get 1 + rl put 1이 더 붙어 reads·writes를
//     2배로 잡아먹었다). KV writes 1,000/일 한도를 가장 아끼는 변경.
//   - /admin·/stats·/analyze가 매번 list()+키별 get()으로 전체를 훑던 것을 loadResponses()
//     하나로 합치고 결과를 Cache API에 60초 캐싱한다. 관리자가 새로고침을 반복해도 KV
//     list/get이 콜로당 60초에 1회로 묶여 reads 100k·lists 1,000/일 한도를 보호한다.
//   - list()를 cursor로 페이지네이션해 응답이 1,000건을 넘어도 누락 없이 집계한다(잠재 버그 수정).

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

// 관리자 토큰 추출: Authorization: Bearer <token> 우선, 구버전 클라이언트 호환으로 ?token= 폴백.
// 토큰을 URL 쿼리스트링에 노출하지 않기 위해 헤더 방식을 권장한다.
function getToken(request, url) {
  const auth = request.headers.get('Authorization') || '';
  const m = /^Bearer\s+(.+)$/i.exec(auth);
  if (m) return m[1].trim();
  return url.searchParams.get('token');
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/submit') {
      return await handleSubmit(request, env, ctx);
    }
    if (request.method === 'GET' && url.pathname === '/admin') {
      return await handleAdmin(request, url, env, ctx);
    }
    if (request.method === 'GET' && url.pathname === '/stats') {
      return await handleStats(request, url, env, ctx);
    }
    if (request.method === 'GET' && url.pathname === '/analyze') {
      return await handleAnalyze(request, url, env, ctx);
    }
    if (request.method === 'GET' && url.pathname === '/') {
      return new Response('linear-algebra-for-ai diagnostic API\n', {
        headers: CORS_HEADERS,
      });
    }
    return jsonResponse({ error: 'not found' }, 404);
  },
};

// === 한도 보호 설정 ===
const CACHE_BASE = 'https://linalg.cache';     // Cache API 합성 키 베이스(외부로 안 나감)
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;    // 한 IP 당 5분 1회
const RATE_LIMIT_WINDOW_SEC = 300;
const RESP_CACHE_TTL_SEC = 60;                 // 관리자 집계용 응답 스냅샷 캐시 수명

// Rate limit: Cache API 기반(KV 작업 0). IP는 보통 한 콜로에 고정되므로 교실 단위 진단엔 충분.
async function rateLimitRemainingSec(ip) {
  const hit = await caches.default.match(new Request(`${CACHE_BASE}/rl/${encodeURIComponent(ip)}`));
  if (!hit) return 0;
  const until = parseInt(await hit.text(), 10) || 0;
  const remaining = Math.ceil((until - Date.now()) / 1000);
  return remaining > 0 ? remaining : 0;
}
function markRateLimit(ip, ctx) {
  const until = Date.now() + RATE_LIMIT_WINDOW_MS;
  ctx.waitUntil(caches.default.put(
    new Request(`${CACHE_BASE}/rl/${encodeURIComponent(ip)}`),
    new Response(String(until), { headers: { 'Cache-Control': `max-age=${RATE_LIMIT_WINDOW_SEC}` } }),
  ));
}

// 전체 응답을 한 번만 모아서 Cache API에 60초 캐싱. list는 cursor로 끝까지 페이지네이션.
async function loadResponses(env, ctx) {
  const key = new Request(`${CACHE_BASE}/responses`);
  const hit = await caches.default.match(key);
  if (hit) return await hit.json();

  const responses = [];
  let cursor;
  do {
    const page = await env.DIAGNOSTICS.list({ prefix: 'resp:', cursor });
    for (const k of page.keys) {
      const v = await env.DIAGNOSTICS.get(k.name);
      if (v) responses.push(JSON.parse(v));
    }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  ctx.waitUntil(caches.default.put(key, new Response(JSON.stringify(responses), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': `max-age=${RESP_CACHE_TTL_SEC}` },
  })));
  return responses;
}

async function handleSubmit(request, env, ctx) {
  // === Rate limit 체크 (IP 기반, Cache API) ===
  const ip = request.headers.get('CF-Connecting-IP')
          || request.headers.get('X-Forwarded-For')
          || 'unknown';
  const retryAfter = await rateLimitRemainingSec(ip);
  if (retryAfter > 0) {
    return new Response(
      JSON.stringify({
        error: 'rate_limited',
        message: '한 IP 당 5분에 1회 제출만 가능합니다. 잠시 후 다시 시도해주세요.',
        retry_after_sec: retryAfter,
      }),
      {
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Retry-After': String(retryAfter), ...CORS_HEADERS },
      },
    );
  }

  // === 본문 검증 ===
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: 'invalid json' }, 400);
  }

  if (!Array.isArray(body.answers) || body.answers.length !== 10) {
    return jsonResponse({ error: 'answers must be array of 10' }, 400);
  }
  if (!Array.isArray(body.axisScores) || body.axisScores.length !== 6) {
    return jsonResponse({ error: 'axisScores must be array of 6' }, 400);
  }

  // === 응답 저장 (KV write 1회만) + Rate limit 마커(Cache API) ===
  const id = crypto.randomUUID();
  // 개인 식별 가능 정보(IP·User-Agent)는 저장하지 않는다. IP는 위 rate limit 판정에만
  // 일시적으로(Cache API) 쓰이고 KV 레코드에는 남기지 않아 "식별 정보 미저장" 고지와 일치시킨다.
  const record = {
    id,
    timestamp: Date.now(),
    answers: body.answers,
    correct: body.correct,
    axisScores: body.axisScores,
    totalScore: body.totalScore,
  };

  await env.DIAGNOSTICS.put(`resp:${id}`, JSON.stringify(record));
  markRateLimit(ip, ctx);

  return jsonResponse({ ok: true, id });
}

async function handleAdmin(request, url, env, ctx) {
  const token = getToken(request, url);
  if (!token || token !== env.ADMIN_TOKEN) {
    return jsonResponse({ error: 'unauthorized' }, 401);
  }

  const responses = await loadResponses(env, ctx);
  return jsonResponse({ count: responses.length, responses });
}

async function handleStats(request, url, env, ctx) {
  const token = getToken(request, url);
  if (!token || token !== env.ADMIN_TOKEN) {
    return jsonResponse({ error: 'unauthorized' }, 401);
  }

  const responses = await loadResponses(env, ctx);

  if (responses.length === 0) {
    return jsonResponse({ count: 0, message: '응답 없음' });
  }

  // 문항별 정답률 + 보기별 분포
  const questionStats = [];
  for (let q = 0; q < 10; q++) {
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
async function handleAnalyze(request, url, env, ctx) {
  const token = getToken(request, url);
  if (!token || token !== env.ADMIN_TOKEN) {
    return jsonResponse({ error: 'unauthorized' }, 401);
  }
  if (!env.UPSTAGE_API_KEY) {
    return jsonResponse({ error: 'UPSTAGE_API_KEY not configured' }, 500);
  }

  // 응답 수집 + 집계 (loadResponses 로 캐시 공유)
  const responses = await loadResponses(env, ctx);
  if (responses.length === 0) {
    return jsonResponse({ error: '응답 없음 — 분석할 데이터 부족' }, 400);
  }

  const axisNames = [
    '벡터·내적공간 (노름·내적·span·직교)',
    '선형방정식·행렬 (LU·역행렬·가역 동치·Ax=b 해 조건)',
    '벡터공간·부분공간 (영공간·열공간·rank·4 기본 부분공간)',
    '직교성·정사영 (잔차 직교·정규방정식·QR·정규직교 기저)',
    '행렬식·고윳값 (고유분해·대각화·스펙트럼 정리)',
    'SVD·선형변환 (SVD·Eckart-Young·닮음·기저 변환)',
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
  for (let q = 0; q < 10; q++) {
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

[10개 문항별 정답률·보기 분포]
${qLines.join('\n')}

위 결과를 바탕으로 강사에게 다음 4가지를 한국어로 분석해주세요:

1. 학생 그룹의 강점 영역과 약점 영역 (구체적 축 이름과 점수 인용)
2. 가장 어려워한 문항 3개와 학생들이 어떤 오개념을 가지고 있을 가능성 (보기 분포 패턴 활용)
3. 강의에서 보강해야 할 주차 영역 — Part 1 (벡터·행렬·부분공간·정사영·QR·행렬식) 또는 Part 2 (고윳값·SVD·선형변환) 중 어디?
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
