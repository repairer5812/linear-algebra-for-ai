import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

await import(new URL('../../assets/diagnostic-config.js', import.meta.url));
await import(new URL('../../assets/diagnostic-stats.js', import.meta.url));

const {
  STATS_SCHEMA,
  median,
  aggregateDiagnostics,
  formatAnalysisPrompt,
} = globalThis.LINALG_STATS;
const { QUESTION_COUNT, AXES } = globalThis.LINALG_DIAG;

const TWO_AXES = [
  { name: '벡터', detail: '노름' },
  { name: '행렬', detail: 'LU' },
];

function record(totalScore, axisScores, answers, correct) {
  return { totalScore, axisScores, answers, correct };
}

const EVEN_RECORDS = [
  record(10, [10, 0], ['a', 'b'], [true, false]),
  record(20, [20, 0], ['a', 'b'], [true, false]),
  record(30, [30, 0], ['a', 'b'], [false, true]),
  record(40, [40, 0], ['c', 'd'], [false, true]),
];

function legacyUpperMedian(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(values.length / 2)];
}

test('짝수 개 중앙값은 두 중앙의 평균이고, 워커가 쓰던 상위 중앙값이 아니다', () => {
  assert.equal(median([10, 20, 30, 40]), 25);
  assert.equal(legacyUpperMedian([10, 20, 30, 40]), 30);
  assert.equal(median([10, 5]), 7.5);
  assert.equal(median([10, 20, 30]), 20);

  const agg = aggregateDiagnostics(EVEN_RECORDS, { questionCount: 2, axes: TWO_AXES });
  assert.equal(agg.total.median, 25);
  assert.equal(agg.axes[0].median, 25);
  assert.notEqual(agg.total.median, legacyUpperMedian([10, 20, 30, 40]));
});

test('10점은 [10, 20) 칸이고 100점만 마지막 칸이다', () => {
  const records = [0, 9, 10, 99, 100, -3, 110].map((score) => record(score, [0], ['a'], [false]));
  const agg = aggregateDiagnostics(records, {
    questionCount: 1,
    axes: [{ name: '축', detail: '설명' }],
  });
  const { counts, labels, edges } = agg.histogram;
  assert.deepEqual(edges, [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
  assert.equal(labels.length, counts.length);
  assert.equal(labels[0], '[0, 10)');
  assert.equal(labels[1], '[10, 20)');
  assert.equal(labels[9], '[90, 100)');
  assert.equal(labels[10], '100');
  assert.equal(labels[0].includes('0-10'), false);
  assert.equal(counts[0], 3);
  assert.equal(counts[1], 1);
  assert.equal(counts[9], 1);
  assert.equal(counts[10], 2);
  assert.equal(counts.reduce((sum, n) => sum + n, 0), records.length);
});

test('집계 결과 키는 스키마 하나와 같고, 화면·워커가 각자 쓰던 필드명은 없다', () => {
  const agg = aggregateDiagnostics(EVEN_RECORDS, { questionCount: 2, axes: TWO_AXES });
  assert.deepEqual(Object.keys(agg), [...STATS_SCHEMA.fields]);
  assert.deepEqual(Object.keys(agg.total), [...STATS_SCHEMA.total]);
  assert.deepEqual(Object.keys(agg.axes[0]), [...STATS_SCHEMA.axis]);
  assert.deepEqual(Object.keys(agg.questions[0]), [...STATS_SCHEMA.question]);
  assert.deepEqual(Object.keys(agg.histogram), [...STATS_SCHEMA.histogram]);
  assert.equal(agg.questions[0].correctRate, 0.5);
  assert.deepEqual(agg.questions[0].choices, { a: 3, b: 0, c: 1, d: 0 });
  assert.deepEqual(agg.questions[1].choices, { a: 0, b: 3, c: 0, d: 1 });
  assert.equal(agg.total.mean, 25);
  assert.equal(agg.total.min, 10);
  assert.equal(agg.total.max, 40);
  for (const legacy of ['avgScore', 'medianScore', 'maxScore', 'axisAvg', 'correctRate', 'optionDist', 'histBins', 'questionStats', 'axisStats', 'totalScoreMean', 'totalScoreDistribution']) {
    assert.equal(Object.hasOwn(agg, legacy), false);
  }
});

test('프롬프트는 집계 객체의 숫자만 쓰고, 예전 문장 형식을 유지한다', () => {
  const agg = aggregateDiagnostics(EVEN_RECORDS, { questionCount: 2, axes: TWO_AXES });
  const prompt = formatAnalysisPrompt(agg, { axes: TWO_AXES });
  const expected = `당신은 선형대수 강좌의 강사를 돕는 데이터 분석 어시스턴트입니다.
다음은 선형대수 진단 테스트의 익명 응답 집계입니다.

[응답 수] 4명
[총점] 평균 25.0점, 최저 10점, 최고 40점

[2 핵심역량 축별 점수]
  축1 벡터 (노름): 평균 25.0, 최저 10, 최고 40
  축2 행렬 (LU): 평균 0.0, 최저 0, 최고 0

[2개 문항별 정답률·보기 분포]
  Q1: 정답률 50% | a:3 b:0 c:1 d:0
  Q2: 정답률 50% | a:0 b:3 c:0 d:1

위 결과를 바탕으로 강사에게 다음 4가지를 한국어로 분석해주세요:

1. 학생 그룹의 강점 영역과 약점 영역 (구체적 축 이름과 점수 인용)
2. 가장 어려워한 문항 3개와 학생들이 어떤 오개념을 가지고 있을 가능성 (보기 분포 패턴 활용)
3. 강의에서 보강해야 할 주차 영역: Part 1 (축 1-3: 벡터, 내적, 선형방정식, 역행렬, LU, 부분공간, rank) 또는 Part 2 (축 4-6: 직교성, 정사영, 최소제곱, QR, 행렬식, 고윳값, SVD, 선형변환) 중 어디?
4. 흥미로운 패턴이나 outlier (있는 경우만)

답변 형식:
- 각 항목 3-5문장 이내로 간결하게
- 응답 수가 4명임을 고려하여 일반화 한계를 명시
- 추측은 "~로 추정됩니다" 식으로 표시
- 이모지·과장 표현 금지`;
  assert.equal(prompt, expected);
  assert.equal(prompt.includes('중앙값'), false);
});

test('비어 있거나 손상된 레코드는 화면이 세던 방식으로 0으로 보고, 입력 배열은 바꾸지 않는다', () => {
  assert.equal(aggregateDiagnostics([], { questionCount: 1, axes: TWO_AXES }), null);
  assert.equal(aggregateDiagnostics(null, { questionCount: 1, axes: [{ name: '축' }] }), null);
  const records = [{}, { totalScore: '40', axisScores: [null], answers: ['A', 'a'], correct: null }];
  const snapshot = JSON.stringify(records);
  const agg = aggregateDiagnostics(records, { questionCount: 2, axes: [{ name: '축', detail: 'd' }] });
  assert.equal(JSON.stringify(records), snapshot);
  assert.equal(agg.count, 2);
  assert.equal(agg.total.mean, 20);
  assert.equal(agg.total.median, 20);
  assert.equal(agg.axes[0].mean, 0);
  assert.equal(agg.questions[0].correctRate, 0);
  assert.deepEqual(agg.questions[1].choices, { a: 1, b: 0, c: 0, d: 0 });
});

test('설정 파일의 12문항·6축 길이로 한 응답을 집계한다', () => {
  const one = record(
    100,
    AXES.map(() => 100),
    Array.from({ length: QUESTION_COUNT }, () => 'b'),
    Array.from({ length: QUESTION_COUNT }, () => true),
  );
  const agg = aggregateDiagnostics([one], { questionCount: QUESTION_COUNT, axes: AXES });
  assert.equal(agg.axes.length, AXES.length);
  assert.equal(agg.questions.length, QUESTION_COUNT);
  assert.equal(agg.questions.every((q) => q.correctRate === 1 && q.choices.b === 1), true);
  assert.equal(agg.histogram.counts[10], 1);
  assert.equal(agg.axes[0].name, AXES[0].name);
  const prompt = formatAnalysisPrompt(agg, { axes: AXES });
  assert.match(prompt, /\[6 핵심역량 축별 점수\]/);
  assert.match(prompt, /\[12개 문항별 정답률·보기 분포\]/);
  assert.match(prompt, new RegExp('축1 ' + AXES[0].name + ' \\(' + AXES[0].detail + '\\)'));
});

test('워커와 강사 화면은 집계 함수 하나를 쓰고, 제출 본문 신뢰와 토큰·CORS·레이트리밋은 그대로다', () => {
  const worker = readFileSync(new URL('../src/index.js', import.meta.url), 'utf8');
  const admin = readFileSync(new URL('../../admin.html', import.meta.url), 'utf8');
  assert.match(worker, /import '\.\.\/\.\.\/assets\/diagnostic-stats\.js'/);
  assert.match(worker, /aggregateDiagnostics/);
  assert.match(worker, /formatAnalysisPrompt/);
  assert.equal(worker.includes('questionStats'), false);
  assert.equal(worker.includes('totalScoreDistribution'), false);
  assert.equal(worker.includes('scores.reduce'), false);
  assert.match(worker, /correct: body\.correct/);
  assert.match(worker, /axisScores: body\.axisScores/);
  assert.match(worker, /totalScore: body\.totalScore/);
  assert.match(worker, /answers must be array of/);
  assert.match(worker, /'Access-Control-Allow-Origin': '\*'/);
  assert.match(worker, /searchParams\.get\('token'\)/);
  assert.match(worker, /RATE_LIMIT_WINDOW_MS/);
  assert.match(worker, /응답 없음/);

  assert.match(admin, /assets\/diagnostic-stats\.js/);
  assert.match(admin, /aggregateDiagnostics\(records/);
  assert.equal(admin.includes('function computeFromAdmin'), false);
  assert.equal(admin.includes('function median('), false);
  assert.equal(admin.includes('stats.avgScore'), false);
  assert.equal(admin.includes('authFetch(\'/stats\''), false);
  assert.match(admin, /authFetch\('\/admin'/);
  assert.match(admin, /agg\.histogram\.labels/);
  assert.match(admin, /q\.correctRate \* 100/);
  assert.equal(admin.includes('Authorization'), true);
  assert.equal(admin.includes('rememberToken'), true);
});
