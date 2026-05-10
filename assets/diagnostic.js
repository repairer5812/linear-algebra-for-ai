/* ==========================================================================
   진단 테스트 — 20문제 SPA 로직
   - 6축 매핑, 채점, radar chart, PNG/PDF 다운로드, 익명 통계 전송, localStorage
   ========================================================================== */

const WORKER_URL = "https://linalg-diagnostic.repairer5812.workers.dev";
const STORAGE_KEY = "linalg_diag_state_v1";

const AXIS_NAMES = [
  "벡터·내적",
  "행렬연산",
  "부분공간·계수",
  "직교성·정사영",
  "분해·고윳값",
  "AI 응용·코딩"
];

// 20 questions. axis: 1-6. answer: 'a'|'b'|'c'|'d'.
const QUESTIONS = [
  {
    n: 1, axis: 1, level: "입문",
    text: "$\\mathbf{v} = (3, -4)^\\top$의 $\\ell_2$ 노름은?",
    options: { a: "1", b: "5", c: "7", d: "25" },
    answer: "b"
  },
  {
    n: 2, axis: 1, level: "입문",
    text: "두 벡터 $\\mathbf{u}, \\mathbf{v}$가 직교일 필요충분조건은?",
    options: {
      a: "$\\|\\mathbf{u}\\| = \\|\\mathbf{v}\\|$",
      b: "$\\mathbf{u} = \\mathbf{v}$",
      c: "$\\mathbf{u} + \\mathbf{v} = \\mathbf{0}$",
      d: "$\\mathbf{u} \\cdot \\mathbf{v} = 0$"
    },
    answer: "d"
  },
  {
    n: 3, axis: 1, level: "학부",
    text: "$\\mathbf{u} = (1, 0, 0), \\mathbf{v} = (1, 1, 0)$의 코사인 유사도는?",
    options: {
      a: "0",
      b: "$\\dfrac{1}{2}$",
      c: "$\\dfrac{1}{\\sqrt{2}}$",
      d: "1"
    },
    answer: "c"
  },
  {
    n: 4, axis: 2, level: "입문",
    text: "$A = \\begin{pmatrix}1 & 2 \\\\ 3 & 4\\end{pmatrix}, \\mathbf{x} = \\begin{pmatrix}1 \\\\ 1\\end{pmatrix}$ 일 때 $A\\mathbf{x}$는?",
    options: {
      a: "$(3, 7)^\\top$",
      b: "$(3, 4)^\\top$",
      c: "$(4, 6)^\\top$",
      d: "$(1, 4)^\\top$"
    },
    answer: "a"
  },
  {
    n: 5, axis: 2, level: "입문",
    text: "행렬 곱에 대해 항상 성립하지 않는 것은?",
    options: {
      a: "$(AB)C = A(BC)$",
      b: "$AB = BA$",
      c: "$A(B+C) = AB + AC$",
      d: "$(AB)^\\top = B^\\top A^\\top$"
    },
    answer: "b"
  },
  {
    n: 6, axis: 2, level: "학부",
    text: "$n \\times n$ 행렬에 대한 가우스 소거(부분 피벗팅 포함)의 시간 복잡도는?",
    options: {
      a: "$O(n)$",
      b: "$O(n^2)$",
      c: "$O(n^3)$",
      d: "$O(2^n)$"
    },
    answer: "c"
  },
  {
    n: 7, axis: 2, level: "학부",
    text: "$A = LU$ 분해를 한 번 수행한 후 다중 우변 $A\\mathbf{x}_i = \\mathbf{b}_i \\ (i=1,\\dots,k)$을 푸는 비용은? (각 $\\mathbf{b}_i$는 별도)",
    options: {
      a: "매번 $O(n^3)$",
      b: "총 $O(n^3 k)$",
      c: "총 $O(n^4)$",
      d: "1회 $O(n^3)$ + 매 우변 $O(n^2)$"
    },
    answer: "d"
  },
  {
    n: 8, axis: 3, level: "입문",
    text: "$\\mathbb{R}^3$의 부분공간이 <strong>될 수 없는</strong> 집합은?",
    options: {
      a: "$\\{(x, y, z) : x + y + z = 0\\}$",
      b: "$\\{(x, y, z) : x + y + z = 1\\}$",
      c: "$\\{(x, y, 0) : x, y \\in \\mathbb{R}\\}$",
      d: "$\\{(0, 0, 0)\\}$"
    },
    answer: "b"
  },
  {
    n: 9, axis: 3, level: "학부",
    text: "$A \\in \\mathbb{R}^{m \\times n}$, $\\mathrm{rank}(A) = r$일 때 영공간 $N(A)$의 차원은?",
    options: {
      a: "$n - r$",
      b: "$m - r$",
      c: "$r$",
      d: "$\\min(m, n) - r$"
    },
    answer: "a"
  },
  {
    n: 10, axis: 3, level: "학부",
    text: "$A = \\begin{pmatrix}1 & 2 & 3 \\\\ 2 & 4 & 6\\end{pmatrix}$의 rank는?",
    options: { a: "0", b: "3", c: "1", d: "2" },
    answer: "c"
  },
  {
    n: 11, axis: 4, level: "입문",
    text: "정사영 행렬 $P$가 항상 만족하는 성질은?",
    options: {
      a: "$P$는 가역이다",
      b: "$P^{-1} = P^\\top$",
      c: "$\\det(P) = 1$",
      d: "$P^2 = P$ (멱등성)"
    },
    answer: "d"
  },
  {
    n: 12, axis: 4, level: "학부",
    text: "최소제곱 정규방정식은?",
    options: {
      a: "$A^\\top A \\hat{\\mathbf{x}} = A^\\top \\mathbf{b}$",
      b: "$A \\hat{\\mathbf{x}} = \\mathbf{b}$",
      c: "$AA^\\top \\hat{\\mathbf{x}} = \\mathbf{b}$",
      d: "$\\hat{\\mathbf{x}} = A^{-1} \\mathbf{b}$"
    },
    answer: "a"
  },
  {
    n: 13, axis: 4, level: "응용",
    text: "Self-attention $\\mathrm{softmax}(QK^\\top/\\sqrt{d}) V$ 에서 $QK^\\top$ 의 각 성분이 의미하는 것은?",
    options: {
      a: "query·key 간의 유클리드 거리",
      b: "query·key 간의 코사인 유사도 (정확히)",
      c: "query·key 간의 (스케일링되지 않은) 내적",
      d: "query·key의 외적"
    },
    answer: "c"
  },
  {
    n: 14, axis: 5, level: "입문",
    text: "$A\\mathbf{v} = \\lambda\\mathbf{v}, \\mathbf{v} \\neq \\mathbf{0}$ 의 정의에서 $\\lambda$를 무엇이라 부르는가?",
    options: { a: "고윳값", b: "특잇값", c: "행렬식", d: "대각합" },
    answer: "a"
  },
  {
    n: 15, axis: 5, level: "학부",
    text: "$A = \\begin{pmatrix}2 & 0 \\\\ 0 & 3\\end{pmatrix}$의 고윳값은?",
    options: {
      a: "0과 1",
      b: "2와 3",
      c: "5와 6",
      d: "1과 6"
    },
    answer: "b"
  },
  {
    n: 16, axis: 5, level: "응용",
    text: "SVD $A = U\\Sigma V^\\top$ 에서 $A \\in \\mathbb{R}^{m\\times n}$ 일 때 $U$, $V$의 차원은?",
    options: {
      a: "$U \\in \\mathbb{R}^{n\\times n}, V \\in \\mathbb{R}^{m\\times m}$",
      b: "$U \\in \\mathbb{R}^{m\\times n}, V \\in \\mathbb{R}^{n\\times m}$",
      c: "$U \\in \\mathbb{R}^{n\\times m}, V \\in \\mathbb{R}^{m\\times n}$",
      d: "$U \\in \\mathbb{R}^{m\\times m}, V \\in \\mathbb{R}^{n\\times n}$"
    },
    answer: "d"
  },
  {
    n: 17, axis: 5, level: "응용",
    text: "PCA를 데이터 행렬 $X \\in \\mathbb{R}^{n\\times d}$ (행이 샘플)에 적용할 때 주성분의 방향은 어디서 나오는가?",
    options: {
      a: "$X$의 좌측 특이벡터",
      b: "$X$의 영공간 기저",
      c: "$X^\\top X$ (또는 공분산 행렬)의 고유벡터",
      d: "$X$의 행공간의 임의 기저"
    },
    answer: "c"
  },
  {
    n: 18, axis: 6, level: "입문",
    text: "NumPy에서 행렬 곱 $A B$ 를 올바르게 계산하는 코드는?",
    options: {
      a: "<code>A * B</code>",
      b: "<code>A.dot.B</code>",
      c: "<code>np.cross(A, B)</code>",
      d: "<code>A @ B</code>"
    },
    answer: "d"
  },
  {
    n: 19, axis: 6, level: "학부",
    text: "신경망 한 층 $\\mathbf{y} = W\\mathbf{x} + \\mathbf{b}$ 에서 $W \\in \\mathbb{R}^{m\\times n}$ 일 때 $\\mathbf{x}$, $\\mathbf{y}$의 차원은?",
    options: {
      a: "$\\mathbf{x} \\in \\mathbb{R}^n, \\mathbf{y} \\in \\mathbb{R}^m$",
      b: "$\\mathbf{x} \\in \\mathbb{R}^m, \\mathbf{y} \\in \\mathbb{R}^n$",
      c: "$\\mathbf{x}, \\mathbf{y} \\in \\mathbb{R}^n$",
      d: "$\\mathbf{x}, \\mathbf{y} \\in \\mathbb{R}^m$"
    },
    answer: "a"
  },
  {
    n: 20, axis: 6, level: "응용",
    text: "$1\\times 1$ 컨볼루션이 본질적으로 무엇과 동치인가?",
    options: {
      a: "푸리에 변환",
      b: "채널 차원의 행렬 곱(linear projection)",
      c: "평균 풀링",
      d: "ReLU 활성화"
    },
    answer: "b"
  }
];

const TOTAL_Q = QUESTIONS.length;

// State
let answers = new Array(TOTAL_Q).fill(null);
let currentIdx = 0;
let radarChart = null;

// DOM helpers
const $ = (id) => document.getElementById(id);

function renderKatex(el) {
  if (window.renderMathInElement) {
    window.renderMathInElement(el, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false }
      ],
      throwOnError: false
    });
  }
}

function renderQuestion() {
  const q = QUESTIONS[currentIdx];
  const container = $("diagQuestion");

  const optionsHtml = ["a", "b", "c", "d"].map((letter) => `
    <li class="diag-option">
      <label>
        <input type="radio" name="q${q.n}" value="${letter}"
          ${answers[currentIdx] === letter ? "checked" : ""}>
        <span class="diag-option__text">
          <span class="diag-option__letter">(${letter})</span>${q.options[letter]}
        </span>
      </label>
    </li>
  `).join("");

  container.innerHTML = `
    <div class="diag-question">
      <div class="diag-question__num">문항 ${q.n} / ${TOTAL_Q} · 난이도 ${q.level}</div>
      <div class="diag-question__axis">축 ${q.axis}: ${AXIS_NAMES[q.axis - 1]}</div>
      <div class="diag-question__text">${q.text}</div>
      <ul class="diag-options">${optionsHtml}</ul>
    </div>
  `;

  // bind radio change
  container.querySelectorAll("input[type=radio]").forEach((input) => {
    input.addEventListener("change", (e) => {
      answers[currentIdx] = e.target.value;
      saveState();
      updateNav();
    });
  });

  // progress
  $("diagProgressLabel").textContent = `${currentIdx + 1} / ${TOTAL_Q}`;
  $("diagProgressFill").style.width = `${((currentIdx + 1) / TOTAL_Q) * 100}%`;

  renderKatex(container);
  updateNav();
}

function updateNav() {
  $("btnPrev").disabled = currentIdx === 0;

  const isLast = currentIdx === TOTAL_Q - 1;
  const allAnswered = answers.every((a) => a !== null);

  if (isLast) {
    $("btnNext").style.display = "none";
    $("btnSubmit").style.display = "inline-flex";
    $("btnSubmit").disabled = !allAnswered;
    $("btnSubmit").title = allAnswered ? "" : "모든 문제에 답해야 결과를 볼 수 있습니다.";
  } else {
    $("btnNext").style.display = "inline-flex";
    $("btnSubmit").style.display = "none";
    $("btnNext").disabled = answers[currentIdx] === null;
  }
}

function go(delta) {
  const next = currentIdx + delta;
  if (next < 0 || next >= TOTAL_Q) return;
  currentIdx = next;
  saveState();
  renderQuestion();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function computeScores() {
  // axis 1..6, count correct & total per axis
  const correctByAxis = [0, 0, 0, 0, 0, 0];
  const totalByAxis = [0, 0, 0, 0, 0, 0];
  const correctArr = [];

  QUESTIONS.forEach((q, i) => {
    const idx = q.axis - 1;
    totalByAxis[idx] += 1;
    const isCorrect = answers[i] === q.answer;
    correctArr.push(isCorrect);
    if (isCorrect) correctByAxis[idx] += 1;
  });

  const axisScores = correctByAxis.map((c, i) =>
    totalByAxis[i] === 0 ? 0 : Math.round((c / totalByAxis[i]) * 1000) / 10
  );
  const totalCorrect = correctArr.filter(Boolean).length;
  const totalScore = Math.round((totalCorrect / TOTAL_Q) * 1000) / 10;

  return { axisScores, totalScore, correctArr, totalCorrect };
}

function classifyCase(axisScores) {
  const above70 = axisScores.filter((s) => s >= 70).length;
  const below50 = axisScores.filter((s) => s < 50).length;
  const range = Math.max(...axisScores) - Math.min(...axisScores);

  if (above70 >= 5) return "A";
  if (below50 >= 3) return "C";
  // B 조건: 70%이상 3-4개 + 50-70% 다수
  const between5070 = axisScores.filter((s) => s >= 50 && s < 70).length;
  if (above70 >= 3 && above70 <= 4 && between5070 >= 1) return "B";
  if (range > 40) return "D";
  // fallback: closest case (use B as default for moderate ranges)
  return "B";
}

const CASE_TEXT = {
  A: {
    headline: "본 강좌는 복습용으로 활용하시는 것이 좋겠습니다.",
    body: `
      <p>진단 결과 6축 중 대부분에서 70% 이상을 기록하셨습니다. 본 강좌는 학부 선형대수의 표준 분량을 차분히 다루는 흐름으로 설계되어 있어, 현재 수준에서는 Part 1 전반(W1-W10)이 복습에 가깝습니다.</p>
      <p>다음을 권해드립니다.</p>
      <ul>
        <li><strong>더 심화된 주제</strong>: 텐서대수, 미분기하, 정보이론, 무한차원 함수해석, 작용소이론 등 후속 주제가 본인 연구와 더 직접적으로 연결될 수 있습니다.</li>
        <li><strong>본 강좌 청강은 환영합니다</strong>: 다만 과제 부담을 새로 지시기보다, 다음 두 부분만 선별 청강하시는 방식이 효율적입니다.
          <ul>
            <li>Part 2 W12-W14 (행렬미분 / 텐서대수 / AI 모듈 환원) — multi-head attention의 Kronecker 분해, conv1d의 토플리츠 환원 등 표준 LA 교과서에 잘 정리되지 않은 응용</li>
            <li>Part 2 텀 프로젝트 (W12-W16) — 임의 AI 모델 한 모듈을 표준 LA 객체로 분해·재구현. 본인 연구 코드의 LA 검토를 동시에 수행 가능</li>
          </ul>
        </li>
      </ul>
      <p>본 강좌의 목적이 "정의·정리에서 출발해 AI 모듈 분해까지"인 만큼, 이미 정의·정리가 익숙하시다면 응용 후반부에 집중하시는 것이 가장 효율적입니다.</p>
    `
  },
  B: {
    headline: "본 강좌가 적합합니다. 약점 축 위주로 학습하시면 효율적입니다.",
    body: `
      <p>진단 결과 일부 축은 견고하나 다른 축에서 50-70% 범위로 떨어집니다. 본 강좌는 6축을 모두 다루도록 설계되어 있어 약점 축 보완에 직접적인 도움이 됩니다.</p>
      <ul>
        <li><strong>강점 축</strong>: 해당 주차는 빠르게 통과하며 응용에 집중하시면 됩니다.</li>
        <li><strong>약점 축</strong>: 해당 주차의 사전 reading(MML 본문 + EoLA 시각 자료)을 1-2주 먼저 읽어두시면 강의가 훨씬 수월합니다.</li>
      </ul>
      <p><strong>축별 사전 reading 가이드</strong> (약점 축에 해당하는 행만 우선 학습하시기 바랍니다):</p>
      <div class="table-wrap"><table>
        <thead><tr><th>축</th><th>우선 학습 주차</th><th>사전 reading</th></tr></thead>
        <tbody>
          <tr><td>1. 벡터·내적</td><td>Part 1 W1</td><td>MML §2.1, §3.1, §3.2 / EoLA Ch.1-2</td></tr>
          <tr><td>2. 행렬연산</td><td>Part 1 W2-W5</td><td>MML §2.2-§2.3 / EoLA Ch.3-4</td></tr>
          <tr><td>3. 부분공간·계수</td><td>Part 1 W6-W10</td><td>MML §2.4-§2.7 / Strang Ch.3</td></tr>
          <tr><td>4. 직교성·정사영</td><td>Part 1 W11-W14</td><td>MML §3.6-§3.8 / Strang Ch.4</td></tr>
          <tr><td>5. 분해·고윳값</td><td>Part 2 W1-W7</td><td>MML §4.2, §4.5, §10 / Strang Ch.6-7</td></tr>
          <tr><td>6. AI 응용·코딩</td><td>Part 2 W12-W14</td><td>(강의 진행 중 보충, 사전 reading은 NumPy 튜토리얼)</td></tr>
        </tbody>
      </table></div>
      <p><strong>이 강좌에서 얻으실 수 있는 것</strong>: 약점 축의 정의·정리를 정확히 진술 가능한 수준까지 끌어올리고, 강점 축은 AI 응용 맥락에서 재해석되어 본인의 연구·코드 작성 시 LA 객체 식별 속도가 빨라집니다.</p>
    `
  },
  C: {
    headline: "본 강좌의 표준 대상이십니다. Part 1부터 차근차근 따라가시면 됩니다.",
    body: `
      <p>진단 결과 6축 중 다수에서 50% 미만을 기록하셨습니다. 본 강좌는 정확히 이 출발점을 가정하고 설계되었습니다. 정의에서 출발해 정리·증명·코딩 실습을 매 주차 반복하므로, 학기를 따라가시면 자연스럽게 6축 전체가 채워집니다.</p>
      <p><strong>이 강좌에서 얻으실 수 있는 것</strong>:</p>
      <ul>
        <li>학기 종료 시 벡터·행렬·선형방정식·부분공간·정사영·행렬식의 정의·정리를 자신의 언어로 진술 가능</li>
        <li>$Ax = b$의 해 존재·유일성을 네 가지 기본 부분공간으로 즉석 판별</li>
        <li>NumPy로 가우스 소거·LU 분해·그람-슈미트·정규방정식·행렬식을 직접 구현</li>
        <li>Part 2까지 이수 시 SVD·PCA·행렬미분으로 신경망 forward·backward를 분해, 임의 AI 모델 한 부분의 LA 구조를 보고서로 작성 가능</li>
      </ul>
      <p>처음에 어렵게 느껴지시더라도 매 주차 자가진단 체크리스트로 진도를 점검하시면 막힘 없이 따라오실 수 있도록 설계되어 있습니다.</p>
    `
  },
  D: {
    headline: "특정 영역 깊이는 좋으나 다른 영역이 부족하십니다. 본 강좌의 통합 흐름이 도움이 될 수 있습니다.",
    body: `
      <p>진단 결과 가장 높은 축과 가장 낮은 축의 점수 차가 40점을 넘습니다. 한 영역에서는 깊이 있는 학습이 되어 있으나, 인접 영역과의 연결이 비어 있을 가능성이 높습니다. 본 강좌는 6축이 어떻게 서로 연결되는지 매 주차 명시적으로 보여주는 구조로 설계되어 있습니다.</p>
      <p>전형적인 편차 패턴은 다음과 같습니다.</p>
      <ul>
        <li><strong>(고윳값·SVD는 알지만 부분공간·정사영이 약함)</strong> — 분해의 결과는 알지만 그것이 "어느 부분공간으로의 사영"인지 해석이 안 되는 경우. Part 1 W11-W14가 이 빈틈을 채웁니다.</li>
        <li><strong>(코드는 작성하지만 정의가 약함)</strong> — <code>np.linalg.svd</code>는 호출하지만 SVD의 존재 정리·기하학적 의미를 진술하지 못하는 경우. 매 주차 정의·증명 부분이 도움이 됩니다.</li>
        <li><strong>(정의는 알지만 AI 응용 매핑이 안 됨)</strong> — 행렬곱 정의는 정확하지만 attention의 $QK^\\top$이 내적·정사영 구조임을 즉석에서 보지 못하는 경우. Part 2 W12-W14가 이 매핑을 명시화합니다.</li>
      </ul>
      <p><strong>이 강좌에서 얻으실 수 있는 것</strong>: 6축이 별개 영역이 아니라 하나의 큰 그림 — "$Ax=b$의 해 → 부분공간 분류 → 직교 분해 → 고유 분해 → SVD → AI 모듈 환원"이라는 단일 흐름 — 임을 학기 내내 반복적으로 보시게 됩니다. 강점 축은 더 깊어지고, 약점 축은 강점 축과의 연결 속에서 빠르게 채워집니다.</p>
    `
  }
};

function showResult() {
  const { axisScores, totalScore, correctArr } = computeScores();
  const caseKey = classifyCase(axisScores);
  const caseInfo = CASE_TEXT[caseKey];

  // Hide quiz, show result
  $("quizSection").hidden = true;
  $("resultSection").hidden = false;

  // Headline + score
  $("resultHeadline").textContent = caseInfo.headline;
  $("resultScoreValue").textContent = totalScore.toFixed(1);
  $("resultCaseTag").textContent = `Case ${caseKey}`;
  $("resultBody").innerHTML = caseInfo.body;

  // Axis list (strength/weakness)
  const sortedIdx = axisScores
    .map((s, i) => ({ s, i }))
    .sort((a, b) => b.s - a.s);
  const topIdxSet = new Set(sortedIdx.slice(0, 2).map((o) => o.i));
  const bottomIdxSet = new Set(sortedIdx.slice(-2).map((o) => o.i));

  const axisListHtml = AXIS_NAMES.map((name, i) => {
    let cls = "";
    if (topIdxSet.has(i) && axisScores[i] >= 70) cls = "is-strength";
    else if (bottomIdxSet.has(i) && axisScores[i] < 50) cls = "is-weakness";
    return `<li class="${cls}">
      <span class="axis-name">${i + 1}. ${name}</span>
      <span class="axis-score">${axisScores[i].toFixed(1)}%</span>
    </li>`;
  }).join("");
  $("axisList").innerHTML = axisListHtml;

  // Radar chart
  drawRadar(axisScores);

  // Render KaTeX in body
  renderKatex($("resultBody"));

  // Persist final state
  saveState();

  // Send anonymous stats
  submitAnonymous(axisScores, totalScore, correctArr);
}

function drawRadar(axisScores) {
  const ctx = $("radarChart").getContext("2d");
  if (radarChart) radarChart.destroy();
  radarChart = new Chart(ctx, {
    type: "radar",
    data: {
      labels: AXIS_NAMES.map((n, i) => `${i + 1}. ${n}`),
      datasets: [
        {
          label: "내 점수 (%)",
          data: axisScores,
          backgroundColor: "rgba(220, 20, 60, 0.18)",
          borderColor: "#dc143c",
          borderWidth: 2,
          pointBackgroundColor: "#dc143c",
          pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: { stepSize: 20, color: "#6b7280", backdropColor: "transparent" },
          pointLabels: { font: { size: 13, family: "Noto Sans KR" }, color: "#1f2937" },
          grid: { color: "#e5e7eb" },
          angleLines: { color: "#e5e7eb" }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function submitAnonymous(axisScores, totalScore, correctArr) {
  const payload = {
    answers: answers.slice(),
    correct: correctArr,
    axisScores,
    totalScore
  };
  fetch(`${WORKER_URL}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true
  }).catch(() => {
    // silent fail — UX 영향 없음
  });
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      answers,
      currentIdx,
      ts: Date.now()
    }));
  } catch (_) {}
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const obj = JSON.parse(raw);
    if (Array.isArray(obj.answers) && obj.answers.length === TOTAL_Q) {
      answers = obj.answers;
      currentIdx = Math.min(Math.max(0, obj.currentIdx | 0), TOTAL_Q - 1);
      return true;
    }
  } catch (_) {}
  return false;
}

function reset() {
  if (!confirm("진단 결과와 응답을 모두 삭제하고 다시 시작합니다. 진행하시겠습니까?")) return;
  localStorage.removeItem(STORAGE_KEY);
  answers = new Array(TOTAL_Q).fill(null);
  currentIdx = 0;
  if (radarChart) { radarChart.destroy(); radarChart = null; }
  $("resultSection").hidden = true;
  $("quizSection").hidden = false;
  renderQuestion();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function downloadPNG() {
  const target = $("resultCapture");
  const canvas = await html2canvas(target, {
    backgroundColor: "#ffffff",
    scale: 2,
    useCORS: true
  });
  const link = document.createElement("a");
  link.download = `linalg-diagnostic-${new Date().toISOString().slice(0, 10)}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

async function downloadPDF() {
  const target = $("resultCapture");
  const canvas = await html2canvas(target, {
    backgroundColor: "#ffffff",
    scale: 2,
    useCORS: true
  });
  const imgData = canvas.toDataURL("image/png");
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 24;
  const imgW = pageW - margin * 2;
  const imgH = (canvas.height * imgW) / canvas.width;

  if (imgH <= pageH - margin * 2) {
    pdf.addImage(imgData, "PNG", margin, margin, imgW, imgH);
  } else {
    // multi-page
    let position = margin;
    let remaining = imgH;
    let srcY = 0;
    const pageContentH = pageH - margin * 2;
    const pxPerPt = canvas.width / imgW;
    while (remaining > 0) {
      const sliceH = Math.min(pageContentH, remaining);
      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = sliceH * pxPerPt;
      const sliceCtx = sliceCanvas.getContext("2d");
      sliceCtx.fillStyle = "#ffffff";
      sliceCtx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
      sliceCtx.drawImage(canvas, 0, srcY, canvas.width, sliceCanvas.height,
        0, 0, canvas.width, sliceCanvas.height);
      pdf.addImage(sliceCanvas.toDataURL("image/png"), "PNG", margin, position, imgW, sliceH);
      remaining -= sliceH;
      srcY += sliceCanvas.height;
      if (remaining > 0) {
        pdf.addPage();
        position = margin;
      }
    }
  }
  pdf.save(`linalg-diagnostic-${new Date().toISOString().slice(0, 10)}.pdf`);
}

function init() {
  loadState();

  $("btnPrev").addEventListener("click", () => go(-1));
  $("btnNext").addEventListener("click", () => go(1));
  $("btnSubmit").addEventListener("click", showResult);
  $("btnReset").addEventListener("click", reset);
  $("btnDownloadPNG").addEventListener("click", downloadPNG);
  $("btnDownloadPDF").addEventListener("click", downloadPDF);

  // If all answered AND user previously hit submit on last page, just show quiz from current
  renderQuestion();
}

document.addEventListener("DOMContentLoaded", init);
