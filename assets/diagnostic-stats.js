/* ==========================================================================
   진단 응답 집계. 강사 화면과 워커가 이 파일 하나만 쓴다.
   - admin.html: diagnostic-config.js 다음에 <script src="assets/diagnostic-stats.js">
   - worker/src/index.js: import "../../assets/diagnostic-stats.js"
   반환 객체의 키는 STATS_SCHEMA.fields 와 같다.

   중앙값: 홀수 개는 한가운데, 짝수 개는 가운데 둘의 평균.
   강사 화면이 그려 온 정의다. 워커가 잠시 쓰던 상위 중앙값(짝수에서 큰 쪽)은
   화면에 쓰이지 않았으므로 규격에서 뺐다.

   히스토그램 11칸. edges[i]..edges[i+1] 는 오른쪽을 뺀 구간이고,
   마지막 칸은 100점(그보다 큰 값은 100칸으로 자른다). 0 미만은 첫 칸.
   예: 10점은 [10, 20), 100점만 마지막 칸.

   correctRate 는 0 이상 1 이하 비율이다. 퍼센트는 화면·프롬프트가 표시할 때 곱한다.
   ========================================================================== */
(function (root) {
  const HISTOGRAM_EDGES = Object.freeze([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
  const CHOICE_KEYS = Object.freeze(['a', 'b', 'c', 'd']);

  const STATS_SCHEMA = Object.freeze({
    id: 'diagnostic-stats/1',
    correctRate: 'fraction',
    median: 'mean-of-two-central-values',
    fields: Object.freeze(['count', 'total', 'axes', 'questions', 'histogram']),
    total: Object.freeze(['mean', 'median', 'min', 'max']),
    axis: Object.freeze(['axis', 'name', 'mean', 'median', 'min', 'max']),
    question: Object.freeze(['question', 'correctRate', 'choices']),
    choices: CHOICE_KEYS,
    histogram: Object.freeze(['edges', 'counts', 'labels']),
    edges: HISTOGRAM_EDGES,
  });

  function asNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  function median(values) {
    if (!values.length) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = sorted.length >> 1;
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  function histogramLabels(edges) {
    const labels = [];
    for (let i = 0; i < edges.length - 1; i++) {
      labels.push('[' + edges[i] + ', ' + edges[i + 1] + ')');
    }
    labels.push(String(edges[edges.length - 1]));
    return labels;
  }

  function histogramCounts(scores) {
    const counts = new Array(HISTOGRAM_EDGES.length).fill(0);
    for (const score of scores) {
      let bin = Math.floor(score / 10);
      if (bin < 0) bin = 0;
      if (bin > 10) bin = 10;
      counts[bin] += 1;
    }
    return counts;
  }

  function emptyChoices() {
    return { a: 0, b: 0, c: 0, d: 0 };
  }

  function aggregateDiagnostics(records, options) {
    if (!options || !Number.isInteger(options.questionCount) || options.questionCount < 0) {
      throw new TypeError('aggregateDiagnostics: options.questionCount (integer >= 0) is required');
    }
    if (!options.axes || !Array.isArray(options.axes)) {
      throw new TypeError('aggregateDiagnostics: options.axes is required');
    }
    if (!Array.isArray(records) || records.length === 0) return null;

    const questionCount = options.questionCount;
    const axes = options.axes;
    const n = records.length;
    const totals = records.map((r) => asNumber(r && r.totalScore));
    const totalSum = totals.reduce((sum, value) => sum + value, 0);

    const axisStats = axes.map((axis, index) => {
      const scores = records.map((r) => {
        const row = r && Array.isArray(r.axisScores) ? r.axisScores : [];
        return asNumber(row[index]);
      });
      const sum = scores.reduce((acc, value) => acc + value, 0);
      return {
        axis: index + 1,
        name: axis && axis.name ? axis.name : '',
        mean: sum / n,
        median: median(scores),
        min: Math.min(...scores),
        max: Math.max(...scores),
      };
    });

    const questions = [];
    for (let q = 0; q < questionCount; q++) {
      const choices = emptyChoices();
      let correctCount = 0;
      for (const record of records) {
        const answers = record && Array.isArray(record.answers) ? record.answers : [];
        const choice = answers[q];
        if (choice === 'a' || choice === 'b' || choice === 'c' || choice === 'd') choices[choice] += 1;
        const correct = record && Array.isArray(record.correct) ? record.correct : [];
        if (correct[q]) correctCount += 1;
      }
      questions.push({
        question: q + 1,
        correctRate: correctCount / n,
        choices,
      });
    }

    return {
      count: n,
      total: {
        mean: totalSum / n,
        median: median(totals),
        min: Math.min(...totals),
        max: Math.max(...totals),
      },
      axes: axisStats,
      questions,
      histogram: {
        edges: HISTOGRAM_EDGES.slice(),
        counts: histogramCounts(totals),
        labels: histogramLabels(HISTOGRAM_EDGES),
      },
    };
  }

  // /analyze 프롬프트. 집계 객체만 문장으로 바꾼다. 응답 배열을 다시 세지 않는다.
  function formatAnalysisPrompt(agg, options) {
    const axes = options && options.axes;
    if (!agg || !Array.isArray(axes) || axes.length !== agg.axes.length) {
      throw new TypeError('formatAnalysisPrompt: axes length must match the aggregate');
    }
    if (!Array.isArray(agg.questions)) {
      throw new TypeError('formatAnalysisPrompt: aggregate.questions is required');
    }

    const axisLines = axes.map((axis, index) => {
      const stat = agg.axes[index];
      const name = axis.name + ' (' + axis.detail + ')';
      return '  축' + (index + 1) + ' ' + name + ': 평균 ' + stat.mean.toFixed(1) + ', 최저 ' + stat.min + ', 최고 ' + stat.max;
    }).join('\n');

    const qLines = agg.questions.map((question) => {
      const rate = (question.correctRate * 100).toFixed(0);
      const choices = question.choices;
      return '  Q' + question.question + ': 정답률 ' + rate + '% | a:' + choices.a + ' b:' + choices.b + ' c:' + choices.c + ' d:' + choices.d;
    });

    return `당신은 선형대수 강좌의 강사를 돕는 데이터 분석 어시스턴트입니다.
다음은 선형대수 진단 테스트의 익명 응답 집계입니다.

[응답 수] ${agg.count}명
[총점] 평균 ${agg.total.mean.toFixed(1)}점, 최저 ${agg.total.min}점, 최고 ${agg.total.max}점

[${axes.length} 핵심역량 축별 점수]
${axisLines}

[${agg.questions.length}개 문항별 정답률·보기 분포]
${qLines.join('\n')}

위 결과를 바탕으로 강사에게 다음 4가지를 한국어로 분석해주세요:

1. 학생 그룹의 강점 영역과 약점 영역 (구체적 축 이름과 점수 인용)
2. 가장 어려워한 문항 3개와 학생들이 어떤 오개념을 가지고 있을 가능성 (보기 분포 패턴 활용)
3. 강의에서 보강해야 할 주차 영역: Part 1 (축 1-3: 벡터, 내적, 선형방정식, 역행렬, LU, 부분공간, rank) 또는 Part 2 (축 4-6: 직교성, 정사영, 최소제곱, QR, 행렬식, 고윳값, SVD, 선형변환) 중 어디?
4. 흥미로운 패턴이나 outlier (있는 경우만)

답변 형식:
- 각 항목 3-5문장 이내로 간결하게
- 응답 수가 ${agg.count}명임을 고려하여 일반화 한계를 명시
- 추측은 "~로 추정됩니다" 식으로 표시
- 이모지·과장 표현 금지`;
  }

  root.LINALG_STATS = Object.freeze({
    STATS_SCHEMA,
    HISTOGRAM_EDGES,
    median,
    histogramLabels,
    aggregateDiagnostics,
    formatAnalysisPrompt,
  });
})(typeof globalThis !== 'undefined' ? globalThis : this);
