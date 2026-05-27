/* ==========================================================================
   진단 테스트 — 20문제 SPA 로직
   - 6축 매핑, 채점, radar chart, PNG/PDF 다운로드, 익명 통계 전송, localStorage
   ========================================================================== */

const WORKER_URL = "https://linalg-diagnostic.repairer5812.workers.dev";
const STORAGE_KEY = "linalg_diag_state_v1";

const AXIS_NAMES = [
  "벡터·내적공간",
  "선형방정식·행렬",
  "벡터공간·부분공간",
  "직교성·정사영",
  "행렬식·고윳값",
  "SVD·선형변환"
];

// 20 questions. axis: 1-6. answer: 'a'|'b'|'c'|'d'.
const QUESTIONS = [
  {
    n: 1, axis: 1, level: "입문",
    text: "두 벡터 $\\mathbf{u}, \\mathbf{v} \\in \\mathbb{R}^n$의 내적(inner product) $\\mathbf{u} \\cdot \\mathbf{v}$의 정의로 옳은 것은?",
    options: {
      a: "$\\sum_{i=1}^{n} (u_i + v_i)$",
      b: "$\\sum_{i=1}^{n} u_i v_i$",
      c: "$\\prod_{i=1}^{n} u_i v_i$",
      d: "$\\sum_{i=1}^{n} (u_i - v_i)^2$"
    },
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
    text: "벡터 $\\mathbf{v}_1, \\mathbf{v}_2, \\dots, \\mathbf{v}_k$의 span (생성공간) $\\mathrm{span}\\{\\mathbf{v}_1, \\dots, \\mathbf{v}_k\\}$의 정의는?",
    options: {
      a: "그 벡터들의 집합 $\\{\\mathbf{v}_1, \\dots, \\mathbf{v}_k\\}$ 자체",
      b: "그 벡터들의 노름의 곱",
      c: "그 벡터들의 모든 가능한 일차결합(linear combination)의 집합",
      d: "그 벡터들 사이의 모든 내적 값의 집합"
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
    text: "선형방정식 $A\\mathbf{x} = \\mathbf{b}$가 해를 가질 <strong>필요충분조건</strong>은? ($A \\in \\mathbb{R}^{m \\times n}$)",
    options: {
      a: "$A$가 정방행렬",
      b: "$A$가 가역(invertible)",
      c: "$\\mathbf{b}$가 $A$의 열공간 $C(A)$에 속함",
      d: "$\\mathbf{b}$가 $A$의 영공간 $N(A)$에 속함"
    },
    answer: "c"
  },
  {
    n: 7, axis: 2, level: "학부",
    text: "정방행렬 $A \\in \\mathbb{R}^{n \\times n}$가 가역(invertible)일 필요충분조건이 <strong>아닌</strong> 것은?",
    options: {
      a: "$\\det(A) \\ne 0$",
      b: "$A\\mathbf{x} = \\mathbf{0}$의 유일한 해가 $\\mathbf{x} = \\mathbf{0}$",
      c: "$A$의 RREF(기약 행 사다리꼴)가 단위행렬 $I$",
      d: "$A$의 한 행이 다른 행들의 일차결합으로 표현됨"
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
    text: "벡터 $\\mathbf{v}_1, \\mathbf{v}_2, \\dots, \\mathbf{v}_k \\in \\mathbb{R}^n$이 <strong>일차독립(linearly independent)</strong>일 필요충분조건은?",
    options: {
      a: "모든 $\\mathbf{v}_i$가 단위벡터",
      b: "모든 $\\mathbf{v}_i$가 서로 직교",
      c: "$c_1\\mathbf{v}_1 + c_2\\mathbf{v}_2 + \\dots + c_k\\mathbf{v}_k = \\mathbf{0}$의 유일한 해가 $c_1 = c_2 = \\dots = c_k = 0$",
      d: "모든 $\\mathbf{v}_i$의 노름이 같음"
    },
    answer: "c"
  },
  // 축 3: 벡터공간·부분공간 (Q11 신규 — 4 기본 부분공간 직교성)
  {
    n: 11, axis: 3, level: "응용",
    text: "$A \\in \\mathbb{R}^{m \\times n}$의 4 기본 부분공간 중 <strong>항상 직교</strong>하는 두 공간 쌍은? (Strang의 선형대수 기본정리)",
    options: {
      a: "$C(A) \\perp C(A^\\top)$ (열공간 ⊥ 행공간)",
      b: "$C(A) \\perp N(A)$ (열공간 ⊥ 영공간)",
      c: "$N(A) \\perp N(A^\\top)$ (영공간 ⊥ 좌영공간)",
      d: "$C(A^\\top) \\perp N(A)$ (행공간 ⊥ 영공간)"
    },
    answer: "d"
  },

  // 축 4: 직교성·정사영 (Q12-Q14)
  {
    n: 12, axis: 4, level: "입문",
    text: "벡터 $\\mathbf{b}$를 부분공간 $C(A)$ 위로 정사영(orthogonal projection)한 결과를 $\\mathbf{p}$라 할 때, 잔차 $\\mathbf{e} = \\mathbf{b} - \\mathbf{p}$의 핵심 성질은?",
    options: {
      a: "$\\mathbf{e}$의 노름이 1",
      b: "$\\mathbf{e}$가 $\\mathbf{b}$와 평행",
      c: "$\\mathbf{e}$가 $C(A)$ 안의 어떤 벡터",
      d: "$\\mathbf{e}$가 $C(A)$와 직교 ($A^\\top \\mathbf{e} = \\mathbf{0}$)"
    },
    answer: "d"
  },
  {
    n: 13, axis: 4, level: "학부",
    text: "최소제곱(least squares)법의 정규방정식(normal equation)은?",
    options: {
      a: "$A^\\top A \\hat{\\mathbf{x}} = A^\\top \\mathbf{b}$",
      b: "$A \\hat{\\mathbf{x}} = \\mathbf{b}$",
      c: "$AA^\\top \\hat{\\mathbf{x}} = \\mathbf{b}$",
      d: "$\\hat{\\mathbf{x}} = A^{-1} \\mathbf{b}$"
    },
    answer: "a"
  },
  {
    n: 14, axis: 4, level: "응용",
    text: "<strong>Gram-Schmidt 직교화</strong>에서 새 기저 벡터 $\\mathbf{q}_2'$ (정규화 전)를 $\\mathbf{a}_2$로부터 만드는 식은? ($\\mathbf{q}_1$은 이미 단위벡터)",
    options: {
      a: "$\\mathbf{q}_2' = \\mathbf{a}_2$",
      b: "$\\mathbf{q}_2' = \\mathbf{a}_2 + (\\mathbf{q}_1^\\top \\mathbf{a}_2) \\, \\mathbf{q}_1$",
      c: "$\\mathbf{q}_2' = \\mathbf{a}_2 - (\\mathbf{q}_1^\\top \\mathbf{a}_2) \\, \\mathbf{q}_1$",
      d: "$\\mathbf{q}_2' = \\mathbf{a}_2 \\times \\mathbf{q}_1$ (외적)"
    },
    answer: "c"
  },

  // 축 5: 행렬식·고윳값 (Q15-Q17)
  {
    n: 15, axis: 5, level: "입문",
    text: "$A\\mathbf{v} = \\lambda\\mathbf{v}, \\mathbf{v} \\neq \\mathbf{0}$의 정의에서 $\\lambda$를 무엇이라 부르는가?",
    options: { a: "고윳값", b: "특잇값", c: "행렬식", d: "대각합" },
    answer: "a"
  },
  {
    n: 16, axis: 5, level: "학부",
    text: "정방행렬 $A \\in \\mathbb{R}^{n \\times n}$의 <strong>모든 고윳값의 합</strong>은 어떤 양과 같은가?",
    options: {
      a: "$\\det(A)$",
      b: "$\\mathrm{trace}(A) = \\sum_{i=1}^{n} a_{ii}$ (대각 성분의 합)",
      c: "$\\mathrm{rank}(A)$",
      d: "$\\|A\\|_F$ (Frobenius 노름)"
    },
    answer: "b"
  },
  {
    n: 17, axis: 5, level: "응용",
    text: "실대칭(symmetric) 행렬 $A = A^\\top$에 대한 <strong>스펙트럼 정리(spectral theorem)</strong>의 진술로 옳은 것은?",
    options: {
      a: "모든 고윳값이 실수이고, 직교 대각화 가능 ($A = Q\\Lambda Q^\\top$, $Q$ 직교)",
      b: "모든 고윳값이 양수이고, $A$는 항상 가역",
      c: "$A$는 항상 단위행렬과 닮음(similar)",
      d: "$\\det(A) = \\mathrm{trace}(A)$"
    },
    answer: "a"
  },

  // 축 6: SVD·선형변환 (Q18-Q20)
  {
    n: 18, axis: 6, level: "입문",
    text: "SVD $A = U\\Sigma V^\\top$에서 $A \\in \\mathbb{R}^{m\\times n}$일 때 $U$, $V$의 차원(full SVD)은?",
    options: {
      a: "$U \\in \\mathbb{R}^{n\\times n}, V \\in \\mathbb{R}^{m\\times m}$",
      b: "$U \\in \\mathbb{R}^{m\\times n}, V \\in \\mathbb{R}^{n\\times m}$",
      c: "$U \\in \\mathbb{R}^{n\\times m}, V \\in \\mathbb{R}^{m\\times n}$",
      d: "$U \\in \\mathbb{R}^{m\\times m}, V \\in \\mathbb{R}^{n\\times n}$"
    },
    answer: "d"
  },
  {
    n: 19, axis: 6, level: "학부",
    text: "Eckart-Young 정리: 행렬 $A$의 rank-$k$ 근사 중 Frobenius 노름 의미에서 <strong>최적</strong>인 것은?",
    options: {
      a: "$A$의 RREF의 상위 $k$ 행으로 만든 행렬",
      b: "임의의 직교 행렬",
      c: "SVD 상위 $k$ 항만 남긴 $A_k = \\sum_{i=1}^{k} \\sigma_i \\mathbf{u}_i \\mathbf{v}_i^\\top$",
      d: "$A$의 처음 $k$개 행과 열만 남긴 부분행렬"
    },
    answer: "c"
  },
  {
    n: 20, axis: 6, level: "응용",
    text: "두 정방행렬 $A, B$가 <strong>닮음(similar)</strong>이라는 것의 정의는?",
    options: {
      a: "$A = B$",
      b: "어떤 가역 행렬 $P$가 존재하여 $A = P^{-1} B P$ (같은 고윳값을 가짐)",
      c: "어떤 직교 행렬 $Q$가 존재하여 $A = Q^\\top B Q$ (대각화)",
      d: "$\\det(A) = \\det(B)$"
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
      <p>진단 결과 6축 중 대부분에서 70% 이상을 기록하셨습니다. 본 강좌는 학부 Linear Algebra(선형대수)의 표준 분량을 차분히 다루는 흐름으로 설계되어 있어, 현재 수준에서는 Part 1 전반(1-9회차)이 복습에 가깝습니다.</p>
      <p>다음을 권해드립니다.</p>
      <ul>
        <li><strong>더 심화된 주제</strong>: 텐서대수, 미분기하, 정보이론, 무한차원 함수해석, 작용소이론 등 후속 주제가 본인 연구와 더 직접적으로 연결될 수 있습니다.</li>
        <li><strong>본 강좌 청강은 환영합니다</strong>: 다만 과제 부담을 새로 지시기보다, 다음 두 부분만 선별 청강하시는 방식이 효율적입니다.
          <ul>
            <li>Part 2 7-8회차 (행렬미분) + Part 3 6-7회차 (AI<small style="display:inline-block;font-size:0.78em;color:#6b7280;margin-left:0.3em;">(Artificial Intelligence, 인공지능)</small> 모듈 환원) — attention의 row-stochastic·convex combination 분해, conv1d의 토플리츠 환원 등 표준 LA<small style="display:inline-block;font-size:0.78em;color:#6b7280;margin-left:0.3em;">(Linear Algebra, 선형대수)</small> 교과서에 잘 정리되지 않은 응용</li>
            <li>Part 3 Case Study (1회차 주제 결정, 9회차 발표) — 임의 AI 모델 한 모듈을 표준 LA 객체로 분해·재구현. 본인 연구 코드의 LA 검토를 동시에 수행 가능</li>
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
        <li><strong>강점 축</strong>: 해당 회차는 빠르게 통과하며 응용에 집중하시면 됩니다.</li>
        <li><strong>약점 축</strong>: 해당 회차의 사전 reading(Strang<small style="display:inline-block;font-size:0.78em;color:#6b7280;margin-left:0.3em;">(Introduction to Linear Algebra, 메인 교재)</small> 본문 + EoLA<small style="display:inline-block;font-size:0.78em;color:#6b7280;margin-left:0.3em;">(Essence of Linear Algebra, 3Blue1Brown 시각 자료)</small> 시각 자료)을 1-2회차 먼저 읽어두시면 강의가 훨씬 수월합니다.</li>
      </ul>
      <p><strong>축별 사전 reading 가이드</strong> (약점 축에 해당하는 행만 우선 학습하시기 바랍니다):</p>
      <div class="table-wrap"><table>
        <thead><tr><th>축</th><th>우선 학습 회차</th><th>사전 reading</th></tr></thead>
        <tbody>
          <tr><td>1. 벡터·내적</td><td>Part 1 1-2회차</td><td>Strang Ch.1 / EoLA Ch.1-2, 9</td></tr>
          <tr><td>2. 행렬연산</td><td>Part 1 3-5회차</td><td>Strang Ch.2 / EoLA Ch.3-4</td></tr>
          <tr><td>3. 부분공간·계수</td><td>Part 1 7-9회차</td><td>Strang Ch.3 / MML §2.4-§2.7</td></tr>
          <tr><td>4. 직교성·정사영</td><td>Part 1 10-11회차</td><td>Strang Ch.4 / MML §3.6-§3.8</td></tr>
          <tr><td>5. 분해·고윳값</td><td>Part 2 1-5회차</td><td>Strang Ch.6-7 / MML §4.2, §4.5</td></tr>
          <tr><td>6. AI 응용·코딩</td><td>Part 2 7-8 · Part 3 6-8회차</td><td>(강의 진행 중 보충, 사전 reading은 NumPy 튜토리얼)</td></tr>
        </tbody>
      </table></div>
      <p><strong>이 강좌에서 얻으실 수 있는 것</strong>: 약점 축의 정의·정리를 정확히 진술 가능한 수준까지 끌어올리고, 강점 축은 AI 응용 맥락에서 재해석되어 본인의 연구·코드 작성 시 LA 객체 식별 속도가 빨라집니다.</p>
    `
  },
  C: {
    headline: "본 강좌의 표준 대상이십니다. Part 1부터 차근차근 따라가시면 됩니다.",
    body: `
      <p>진단 결과 6축 중 다수에서 50% 미만을 기록하셨습니다. 본 강좌는 정확히 이 출발점을 가정하고 설계되었습니다. 정의에서 출발해 정리·증명·코딩 실습을 매 회차 반복하므로, Part를 따라가시면 자연스럽게 6축 전체가 채워집니다.</p>
      <p><strong>이 강좌에서 얻으실 수 있는 것</strong>:</p>
      <ul>
        <li>Part 종료 시 Vector(벡터)·Matrix(행렬)·선형방정식·Subspace(부분공간)·Orthogonal projection(정사영)·Determinant(행렬식)의 정의·정리를 직관과 함께 자기 것으로 소화</li>
        <li>$Ax = b$의 해 존재·유일성을 네 가지 기본 부분공간으로 즉석 판별</li>
        <li>NumPy로 가우스 소거·LU<small style="display:inline-block;font-size:0.78em;color:#6b7280;margin-left:0.3em;">(LU Decomposition, LU 분해)</small>·그람-슈미트·Normal equation(정규방정식)·행렬식을 직접 구현</li>
        <li>Part 2까지 이수 시 SVD<small style="display:inline-block;font-size:0.78em;color:#6b7280;margin-left:0.3em;">(Singular Value Decomposition, 특이값 분해)</small>·PCA<small style="display:inline-block;font-size:0.78em;color:#6b7280;margin-left:0.3em;">(Principal Component Analysis, 주성분 분석)</small>·행렬미분으로 Neural Network(신경망) forward·backward를 분해, 임의 AI 모델 한 부분의 LA 구조를 보고서로 작성 가능</li>
      </ul>
      <p>처음에 어렵게 느껴지시더라도 매 회차 자가진단 체크리스트로 진도를 점검하시면 막힘 없이 따라오실 수 있도록 설계되어 있습니다.</p>
    `
  },
  D: {
    headline: "특정 영역 깊이는 좋으나 다른 영역이 부족하십니다. 본 강좌의 통합 흐름이 도움이 될 수 있습니다.",
    body: `
      <p>진단 결과 가장 높은 축과 가장 낮은 축의 점수 차가 40점을 넘습니다. 한 영역에서는 깊이 있는 학습이 되어 있으나, 인접 영역과의 연결이 비어 있을 가능성이 높습니다. 본 강좌는 6축이 어떻게 서로 연결되는지 매 회차 명시적으로 보여주는 구조로 설계되어 있습니다.</p>
      <p>전형적인 편차 패턴은 다음과 같습니다.</p>
      <ul>
        <li><strong>(Eigenvalue(고윳값)·SVD<small style="display:inline-block;font-size:0.78em;color:#6b7280;margin-left:0.3em;">(Singular Value Decomposition, 특이값 분해)</small>는 알지만 부분공간·정사영이 약함)</strong> — 분해의 결과는 알지만 그것이 "어느 부분공간으로의 사영"인지 해석이 안 되는 경우. Part 1 10-11회차가 이 빈틈을 채웁니다.</li>
        <li><strong>(코드는 작성하지만 정의가 약함)</strong> — <code>np.linalg.svd</code>는 호출하지만 SVD의 존재 정리·기하학적 의미를 진술하지 못하는 경우. 매 회차 정의·증명 부분이 도움이 됩니다.</li>
        <li><strong>(정의는 알지만 AI<small style="display:inline-block;font-size:0.78em;color:#6b7280;margin-left:0.3em;">(Artificial Intelligence, 인공지능)</small> 응용 매핑이 안 됨)</strong> — 행렬곱 정의는 정확하지만 attention의 $QK^\\top$이 내적·정사영 구조임을 즉석에서 보지 못하는 경우. Part 2 7-8·Part 3 6-7회차가 이 매핑을 명시화합니다.</li>
      </ul>
      <p><strong>이 강좌에서 얻으실 수 있는 것</strong>: 6축이 별개 영역이 아니라 하나의 큰 그림 — "$Ax=b$의 해 → 부분공간 분류 → 직교 분해 → 고유 분해 → SVD → AI 모듈 환원"이라는 단일 흐름 — 임을 Part 내내 반복적으로 보시게 됩니다. 강점 축은 더 깊어지고, 약점 축은 강점 축과의 연결 속에서 빠르게 채워집니다.</p>
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
