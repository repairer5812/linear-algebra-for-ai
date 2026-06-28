/* ==========================================================================
   진단 테스트 — 12문제 SPA 로직
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

// 12 questions (pure LA, 6 axes × 2). axis: 1-6. answer: 'a'|'b'|'c'|'d'.
const QUESTIONS = [
  // 축 1: 벡터·내적공간
  {
    n: 1, axis: 1, level: "입문",
    text: "두 벡터 $\\mathbf{u}, \\mathbf{v} \\in \\mathbb{R}^n$의 내적(inner product)이 $\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\|\\,\\|\\mathbf{v}\\|\\cos\\theta$로 주어질 때, 두 벡터가 <strong>직교(orthogonal)</strong>일 필요충분조건은?",
    options: {
      a: "$\\|\\mathbf{u}\\| = \\|\\mathbf{v}\\|$ (노름이 같음)",
      b: "$\\mathbf{u} + \\mathbf{v} = \\mathbf{0}$ (합이 영벡터)",
      c: "$\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\|\\,\\|\\mathbf{v}\\|$ (내적이 최대)",
      d: "$\\mathbf{u} \\cdot \\mathbf{v} = 0$ (내적이 0)"
    },
    answer: "d"
  },
  {
    n: 2, axis: 1, level: "학부",
    text: "임의의 $\\mathbf{u}, \\mathbf{v} \\in \\mathbb{R}^n$에 대해 항상 성립하는 <strong>코시-슈바르츠 부등식(Cauchy-Schwarz inequality)</strong>은?",
    options: {
      a: "$|\\mathbf{u} \\cdot \\mathbf{v}| \\le \\|\\mathbf{u}\\|\\,\\|\\mathbf{v}\\|$",
      b: "$|\\mathbf{u} \\cdot \\mathbf{v}| \\ge \\|\\mathbf{u}\\|\\,\\|\\mathbf{v}\\|$",
      c: "$\\|\\mathbf{u} + \\mathbf{v}\\| \\ge \\|\\mathbf{u}\\| + \\|\\mathbf{v}\\|$",
      d: "$\\mathbf{u} \\cdot \\mathbf{v} \\le \\|\\mathbf{u}\\| + \\|\\mathbf{v}\\|$"
    },
    answer: "a"
  },
  // 축 2: 선형방정식·행렬
  {
    n: 3, axis: 2, level: "입문",
    text: "$A = \\begin{pmatrix}2 & 1 \\\\ 0 & 3\\end{pmatrix}, \\ \\mathbf{x} = \\begin{pmatrix}1 \\\\ 2\\end{pmatrix}$ 일 때 $A\\mathbf{x}$는?",
    options: {
      a: "$(2, 6)^\\top$",
      b: "$(3, 5)^\\top$",
      c: "$(4, 6)^\\top$",
      d: "$(4, 5)^\\top$"
    },
    answer: "c"
  },
  {
    n: 4, axis: 2, level: "심화",
    text: "정방행렬 $A \\in \\mathbb{R}^{n \\times n}$가 <strong>가역(invertible)</strong>일 필요충분조건이 <strong>아닌</strong> 것은?",
    options: {
      a: "$\\det(A) \\ne 0$",
      b: "$A$의 $n$개 열이 일차독립",
      c: "$A$가 대칭(symmetric)이다 ($A = A^\\top$)",
      d: "$A\\mathbf{x} = \\mathbf{0}$의 유일한 해가 $\\mathbf{x} = \\mathbf{0}$"
    },
    answer: "c"
  },
  // 축 3: 벡터공간·부분공간
  {
    n: 5, axis: 3, level: "학부",
    text: "$A \\in \\mathbb{R}^{m \\times n}$, $\\mathrm{rank}(A) = r$일 때 <strong>차원 정리(rank-nullity theorem)</strong>가 주는 영공간 $N(A)$의 차원은?",
    options: {
      a: "$n - r$",
      b: "$r$",
      c: "$m - r$",
      d: "$\\min(m, n) - r$"
    },
    answer: "a"
  },
  {
    n: 6, axis: 3, level: "심화",
    text: "$A \\in \\mathbb{R}^{m \\times n}$의 4대 기본 부분공간 중, 선형대수 기본정리에 의해 $\\mathbb{R}^n$ 안에서 <strong>서로 직교 여공간(orthogonal complement)</strong>을 이루는 쌍은?",
    options: {
      a: "열공간 $C(A)$ 와 행공간 $C(A^\\top)$",
      b: "열공간 $C(A)$ 와 좌영공간 $N(A^\\top)$",
      c: "영공간 $N(A)$ 와 좌영공간 $N(A^\\top)$",
      d: "행공간 $C(A^\\top)$ 와 영공간 $N(A)$"
    },
    answer: "d"
  },
  // 축 4: 직교성·정사영
  {
    n: 7, axis: 4, level: "학부",
    text: "열이 일차독립인 $A$에 대해, $\\mathbf{b}$를 열공간 $C(A)$로 정사영하는 <strong>정사영 행렬(projection matrix)</strong> $P$ ($\\mathbf{p} = P\\mathbf{b}$)는?",
    options: {
      a: "$P = A A^\\top$",
      b: "$P = A (A^\\top A)^{-1} A^\\top$",
      c: "$P = (A^\\top A)^{-1}$",
      d: "$P = A^\\top (A A^\\top)^{-1} A$"
    },
    answer: "b"
  },
  {
    n: 8, axis: 4, level: "학부",
    text: "열이 일차독립인 $A$에 대해 $A\\mathbf{x} = \\mathbf{b}$가 정확한 해를 갖지 않을 때, 잔차 $\\|\\mathbf{b} - A\\mathbf{x}\\|$를 최소로 하는 <strong>최소제곱(least squares)</strong> 해 $\\hat{\\mathbf{x}}$가 만족하는 <strong>정규방정식(normal equation)</strong>은?",
    options: {
      a: "$A\\hat{\\mathbf{x}} = \\mathbf{b}$",
      b: "$A^\\top A\\,\\hat{\\mathbf{x}} = A^\\top \\mathbf{b}$",
      c: "$A A^\\top \\hat{\\mathbf{x}} = \\mathbf{b}$",
      d: "$A^\\top \\hat{\\mathbf{x}} = \\mathbf{b}$"
    },
    answer: "b"
  },
  // 축 5: 행렬식·고윳값
  {
    n: 8, axis: 5, level: "입문",
    text: "$A = \\begin{pmatrix}3 & 1 \\\\ 2 & 4\\end{pmatrix}$의 행렬식 $\\det(A)$는?",
    options: {
      a: "$7$",
      b: "$14$",
      c: "$10$",
      d: "$2$"
    },
    answer: "c"
  },
  {
    n: 9, axis: 5, level: "학부",
    text: "정방행렬 $A \\in \\mathbb{R}^{n \\times n}$의 고윳값을 $\\lambda_1, \\dots, \\lambda_n$이라 할 때 항상 옳은 것은?",
    options: {
      a: "$\\sum_i \\lambda_i = \\det(A)$ 이고 $\\prod_i \\lambda_i = \\mathrm{trace}(A)$",
      b: "$\\sum_i \\lambda_i = \\mathrm{trace}(A)$ 이고 $\\prod_i \\lambda_i = \\det(A)$",
      c: "$\\sum_i \\lambda_i = \\mathrm{rank}(A)$",
      d: "모든 $\\lambda_i$가 항상 실수이다"
    },
    answer: "b"
  },
  // 축 6: SVD·선형변환
  {
    n: 10, axis: 6, level: "학부",
    text: "<strong>Eckart-Young 정리</strong>: 행렬 $A$를 rank $k$로 근사할 때 Frobenius(또는 스펙트럼) 노름 의미에서 오차를 최소로 하는 근사 $A_k$는?",
    options: {
      a: "SVD에서 큰 특잇값 상위 $k$개만 남긴 $A_k = \\sum_{i=1}^{k} \\sigma_i \\mathbf{u}_i \\mathbf{v}_i^\\top$",
      b: "$A$의 처음 $k$개 행과 열만 잘라낸 부분행렬",
      c: "$A$의 RREF에서 추축(pivot) $k$개에 해당하는 행",
      d: "$A$의 고윳값 중 가장 작은 $k$개로 만든 행렬"
    },
    answer: "a"
  },
  {
    n: 12, axis: 6, level: "학부",
    text: "임의의 행렬 $A \\in \\mathbb{R}^{m \\times n}$의 특이값 분해 $A = U\\Sigma V^\\top$에서 <strong>특잇값(singular value)</strong> $\\sigma_i$에 대해 옳은 것은?",
    options: {
      a: "$\\sigma_i$는 $A^\\top A$의 고윳값과 같다",
      b: "$\\sigma_i$는 $A^\\top A$ 고윳값의 음이 아닌 제곱근이다",
      c: "$\\sigma_i$는 음수가 될 수 있다",
      d: "SVD는 정방행렬에만 존재한다"
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
        <input type="radio" name="q${currentIdx}" value="${letter}"
          ${answers[currentIdx] === letter ? "checked" : ""}>
        <span class="diag-option__text">
          <span class="diag-option__letter">(${letter})</span>${q.options[letter]}
        </span>
      </label>
    </li>
  `).join("");

  container.innerHTML = `
    <div class="diag-question">
      <div class="diag-question__num">문항 ${currentIdx + 1} / ${TOTAL_Q} · 난이도 ${q.level}</div>
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
  // 축당 2문항이라 각 축 점수는 0·50·100 중 하나. 측정된 6축 점수만으로 분류한다.
  const strong = axisScores.filter((s) => s >= 70).length;  // 거의 만점인 축
  const weak   = axisScores.filter((s) => s < 50).length;   // 거의 0점인 축

  if (strong >= 5) return "A";                // 대부분 강함 → 복습용
  if (strong >= 2 && weak >= 2) return "D";   // 강한 축과 빈 축이 함께 뚜렷 → 편중(통합 흐름)
  if (weak >= 3) return "C";                  // 약한 축 다수 → 처음부터
  return "B";                                 // 그 외 → 적합(약점 축 위주 보완)
}

const CASE_TEXT = {
  A: {
    headline: "본 강좌는 복습용으로 활용하시는 것이 좋겠습니다.",
    body: `
      <p>6축 대부분에서 70% 이상을 기록하셨습니다. 위 레이더에서 약한 축이 있으면 그 회차만 골라 들으시면 되고, 그 외 Part 1·2는 복습에 가깝습니다.</p>
      <p>표준 교과서에 잘 없는 응용 위주로 보시길 권합니다: Part 3 1-2회차(행렬미분), Part 4 6-7회차(AI 모듈 환원), Part 4 Case Study(임의 AI 모델 한 모듈을 LA 객체로 분해).</p>
    `
  },
  B: {
    headline: "본 강좌가 적합합니다. 약점 축 위주로 학습하시면 효율적입니다.",
    body: `
      <p>축마다 강약이 갈립니다. 위 레이더에서 <strong>약한 축</strong>을 확인하고, 그 회차를 중심으로 따라오시면 됩니다. 본 강좌는 6축을 모두 다뤄 약점 축 보완에 직접 도움이 됩니다.</p>
    `
  },
  C: {
    headline: "본 강좌의 표준 대상이십니다. Part 1부터 차근차근 따라가시면 됩니다.",
    body: `
      <p>6축 다수에서 50% 미만을 기록하셨습니다. 본 강좌는 정확히 이 출발점을 가정해, 정의에서 출발해 정리·증명·코딩 실습을 매 회차 반복합니다. Part 1부터 따라가시면 6축 전체가 자연스럽게 채워집니다.</p>
      <p>처음엔 어렵게 느껴지셔도 매 회차 자가진단 체크리스트로 점검하시면 막힘 없이 따라오실 수 있습니다.</p>
    `
  },
  D: {
    headline: "축별 점수 편차가 큽니다. 6축을 잇는 통합 흐름이 도움이 됩니다.",
    body: `
      <p>6축 점수의 편차가 큽니다. 강하게 나온 축이 있는 반면, 거의 비어 있는 축도 있습니다. 위 레이더에서 <strong>강한 축과 약한 축</strong>을 먼저 확인하세요.</p>
      <p>본 강좌는 6축을 별개로 두지 않고 <strong>하나의 흐름</strong>으로 매 회차 연결해 보여줍니다.</p>
      <p style="color:#6b7280;font-size:0.93em;margin:0.4rem 0;">$Ax=b$의 해 → 부분공간 분류 → 직교 분해 → 고유 분해 → SVD → AI 모듈 환원</p>
      <p>그래서 강한 축은 더 깊어지고, 비어 있는 축은 인접한 강한 축과의 연결 속에서 빠르게 채워집니다. <strong>약한 축에 해당하는 회차부터</strong> 우선 보시길 권합니다(축별 회차는 진도표를 참고하세요).</p>
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
