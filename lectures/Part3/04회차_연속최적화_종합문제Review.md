---
marp: true
theme: default
paginate: true
header: '인공지능 전공자를 위한 선형대수학'
footer: 'Part 3 4회차 — Continuous Optimization · Part 3 (VC + Probability) 종합 문제 Review'
math: mathjax
size: 16:9
style: |
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
  section { font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
            font-size: 22px; padding: 50px 60px 70px 60px; color: #111827; letter-spacing: -0.011em; }
  section.lead { padding: 100px 60px; }
  h1 { color: #1E40AF; margin-top: 0; font-weight: 700; letter-spacing: -0.02em; }
  h2 { color: #111827; border-bottom: 2px solid #E5E7EB; padding-bottom: 4px; margin-top: 0; font-weight: 700; }
  table { font-size: 17px; border-collapse: collapse; }
  th { background: #F9FAFB; border: 1px solid #E5E7EB; }
  td { border: 1px solid #E5E7EB; }
  code { font-size: 17px; background: #F3F4F6; color: #BE185D; padding: 2px 6px; border-radius: 6px;
         font-family: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace; }
  blockquote { font-size: 19px; border-left: 4px solid #3B82F6; color: #1E40AF;
               background: #DBEAFE; padding: 8px 14px; border-radius: 0 8px 8px 0; }
  section.exercise { background: #FFFBEB; }
  section.exercise h1 { color: #B45309; }
  section.exercise h2 { color: #92400E; border-bottom-color: #FDE68A; }
  .analogy { background: #D1FAE5; border-left: 4px solid #10B981; padding: 10px 16px; margin: 12px 0;
             font-size: 19px; color: #065F46; border-radius: 0 8px 8px 0; }
  .analogy strong { color: #047857; }
---

<!-- _class: lead -->
<!-- _paginate: false -->

# Part 3 4회차

## Continuous Optimization + Part 3 (VC + Probability) 종합 문제 Review

MML §7.1-7.3 (메인) · Part 3 (VC + Probability)
**Part 3 (VC + Probability) 의 마지막 회차**: GD·Lagrange·KKT·Convexity의 표준 도구를 정리하고, **Part 3 학습 흐름 (Calculus → Probability → Optimization)** 을 Part 2 (Eigen·SVD) 도구와 함께 한 문제 풀이 세션으로 묶는다.

> Part 4 (Linear Regression·PCA·GMM·SVM·CNN·Attention) 의 모든 학습이 본 회차에서 정리한 최적화 문제로 환원된다.

---

<!-- _class: exercise -->

# Review: 지난 회차 (Part 3 3회차) 마무리 문제

> **(1)** 정규 평균 MAP 유도 ($\mu \sim \mathcal{N}(\mu_0, \tau_0^2)$).
> **(2)** Cross entropy + softmax의 $\partial \mathcal{L} / \partial \mathbf{z}$.
> **(3)** 2D MVN 등밀도 타원 주축·반지름.

---

<!-- _class: exercise -->

# Review: 답

- **(1)** Posterior $\propto \exp\!\left(-\frac{N}{2\sigma_0^2}(\bar{x} - \mu)^2 - \frac{1}{2\tau_0^2}(\mu - \mu_0)^2\right)$. 정리하면
  $\hat{\mu}_{\text{MAP}} = \dfrac{N/\sigma_0^2 \cdot \bar{x} + 1/\tau_0^2 \cdot \mu_0}{N/\sigma_0^2 + 1/\tau_0^2}$. **데이터 평균과 prior 평균의 정밀도 가중 평균**. $N \to \infty$일 때 데이터 항이 우세 → MAP → MLE.

- **(2)** $\partial \mathcal{L} / \partial \mathbf{z} = \mathbf{q} - \mathbf{y}_{\text{one-hot}}$. 매우 깔끔한 형태 ("예측 − 정답"). 이 결과 때문에 softmax + cross entropy 조합이 표준이다.

- **(3)** $\Sigma = \begin{pmatrix} 4 & 2 \\ 2 & 3 \end{pmatrix}$. $\mathrm{tr} = 7$, $\det = 8$. 고유값 $\lambda^2 - 7\lambda + 8 = 0$, $\lambda = (7 \pm \sqrt{17})/2 \approx 5.56, 1.44$. 주축은 각 고유벡터, 반지름은 $\sqrt{\lambda_i} \approx 2.36, 1.20$.

---

## 본 회차 핵심 질문

> ### 제약이 있는·없는 연속 최적화를 어떻게 풀고, **볼록 (convex)** 이라는 조건이 그 풀이에 어떤 보장을 주는가?

이 질문에 답하려면 네 단계가 필요하다.

1. **Gradient Descent (GD)** 의 update와 수렴 조건
2. **Lagrange 승수법**, 등식 제약의 표준 풀이
3. **KKT 조건**, 부등식 제약을 포함한 일반 최적화의 필요조건
4. **Convex 함수·집합**, 그리고 convex 최적화의 보장 (local = global)

---

## 학습 목표

본 회차가 끝나면 학생은 다음을 답할 수 있어야 한다.

1. **GD update**와 학습률 조건 ($\eta < 2 / L$, $L$ = Lipschitz 상수) 을 설명할 수 있다.
2. **Lagrange 승수법**으로 등식 제약 최적화를 풀 수 있다.
3. **KKT 조건** 네 가지 (stationarity·primal feasibility·dual feasibility·complementary slackness) 를 적고 SVM 형태의 문제에 적용할 수 있다.
4. **Convex 함수**의 정의와 일계 (gradient) ·이계 (Hessian PSD) 특성화를 설명할 수 있다.
5. **Part 2 + Part 3 학습 흐름** (Eigenvalue · SVD · Vector calculus · Probability · Optimization) 의 모든 도구를 한 문제 풀이에서 사용할 수 있다.

---

## 본 회차 학습 흐름

| 질문 | 답 | 도구 |
|---|---|---|
| 제약 없는 최적화의 표준? | **Gradient Descent** | $\mathbf{x} - \eta \nabla f$ |
| 등식 제약의 풀이? | **Lagrange 승수법** | $\nabla f = \lambda \nabla g$ |
| 부등식 제약을 포함하면? | **KKT 조건** | 4 조건 |
| 풀이가 global인 조건? | **Convexity** | $f''$ PSD or epigraph convex |
| 본 강의 LA 도구의 정점? | **Part 3 (VC + Probability) 종합 문제** | 모든 도구 동원 |

---

## 수업 흐름

| 순서 | 블록 | 내용 |
|:---:|:---:|---|
| ① | A | Review + 본 회차 학습 흐름 |
| ② | **B** | GD update·수렴 조건·convex와의 관계 |
| ③ | **C** | Lagrange 승수법·KKT 조건 |
| ④ | **D** | Convex 함수·집합·convex 최적화의 보장 |
| ⑤ | **E** | **사전 공개된 Part 3 (VC + Probability) 종합 문제, 함께 Review** (60분 세션, 3-4 문제) |

> **본 회차의 정점은 E의 함께 Review 세션이다.** 학생은 4회차 전에 사전 공개된 종합 문제를 본인 페이스로 풀어 와서, 4회차에 모두 함께 풀이를 짚는다. B·C·D는 그 풀이에 필요한 도구 정리이다.

---

# B. Gradient Descent (제약 없는 최적화)

## B-1. GD update와 학습률 조건

### Update 식
$$\mathbf{x}_{k+1} = \mathbf{x}_k - \eta \nabla f(\mathbf{x}_k).$$

$\eta > 0$: 학습률 (step size).

### 수렴 조건 (smooth + convex)
$\nabla f$가 **L-Lipschitz** (즉 $\Vert \nabla f(\mathbf{x}) - \nabla f(\mathbf{y}) \Vert \leq L \Vert \mathbf{x} - \mathbf{y} \Vert$) 이고 $f$가 convex이면 $\eta \leq 1/L$에서 수렴.

- **이차형식** $f = \tfrac{1}{2}\mathbf{x}^\top A \mathbf{x} - \mathbf{b}^\top \mathbf{x}$: $L = \lambda_{\max}(A)$. $\eta < 2 / \lambda_{\max}$.
- 수렴 속도는 **condition number $\kappa = \lambda_{\max}/\lambda_{\min}$** 에 의존 (Part 3 2회차 Review).

### 변형
- **SGD**: 한 batch 미분으로 근사 ($\mathbb{E}[\hat{\nabla}] = \nabla f$).
- **Momentum**: $\mathbf{v}_{k+1} = \beta \mathbf{v}_k + \nabla f$, $\mathbf{x}_{k+1} = \mathbf{x}_k - \eta \mathbf{v}_{k+1}$.
- **Adam**: 모멘트 + 좌표별 학습률 (Part 3 2회차).

---

## B-2. 수렴 속도와 condition number

<div class="analogy">

**직관 (Condition number의 영향)**: 이차형식 손실 $f(\mathbf{x}) = \tfrac{1}{2}\mathbf{x}^\top A \mathbf{x}$의 등위면은 $A$의 Eigenvalue로 결정되는 축비를 가지는 타원이다. $\lambda_{\max} \gg \lambda_{\min}$이면 타원이 매우 길쭉해지고 (큰 condition number $\kappa = \lambda_{\max}/\lambda_{\min}$), Gradient descent는 가파른 방향에서 진동하고 완만한 방향에서 느리게 진행한다. $\kappa$가 클수록 수렴이 느려지는 본 효과가 학습 효율의 핵심 제약이다.

</div>

### 완화 방법
- **Preconditioning**: $\mathbf{x} \to P^{-1/2} \mathbf{x}$로 변환해 $\kappa$를 줄임.
- **Adam·RMSprop**: 좌표별 학습률로 $\kappa$의 영향을 완화.
- **Newton**: $\kappa$ 영향 없음 (한 스텝 quadratic).

> Part 4 1회차 (Linear Regression) 의 condition number $\kappa(A)$ 와 수치 안정성 논의가 직접 이어진다.

---

# C. 제약 최적화: Lagrange와 KKT

## C-1. Lagrange 승수법 (등식 제약)

### 정의 9.1 (등식 제약 최적화)
$$\min_{\mathbf{x}} f(\mathbf{x}) \quad \text{s.t.} \quad g_i(\mathbf{x}) = 0, \;\; i = 1, \ldots, m.$$

### 정리 9.1 (Lagrange 필요조건)
국소 최소점 $\mathbf{x}^*$에서 $\nabla g_i(\mathbf{x}^*)$가 일차독립이면 승수 $\lambda_1, \ldots, \lambda_m$이 존재하여
$$\nabla f(\mathbf{x}^*) + \sum_{i=1}^{m} \lambda_i \nabla g_i(\mathbf{x}^*) = \mathbf{0}.$$

Lagrangian $\mathcal{L}(\mathbf{x}, \boldsymbol{\lambda}) = f(\mathbf{x}) + \sum_i \lambda_i g_i(\mathbf{x})$로 정의하면 위 조건은 $\nabla_{\mathbf{x}} \mathcal{L} = \mathbf{0}$, $\nabla_{\boldsymbol{\lambda}} \mathcal{L} = \mathbf{0}$.

### 기하 직관
$\nabla f$가 모든 $\nabla g_i$의 선형결합 → 제약 표면의 **법선 방향**으로 정렬, 즉 제약 표면을 따라 갈 곳이 없다는 뜻.

---

## C-2. Lagrange 예제 (제약 최적화)

### 문제
$f(\mathbf{x}) = x_1^2 + x_2^2$를 최소화 (단, $x_1 + x_2 = 2$).

### 풀이
$\mathcal{L} = x_1^2 + x_2^2 + \lambda (x_1 + x_2 - 2)$.
$\partial / \partial x_1 = 2 x_1 + \lambda = 0$, $\partial / \partial x_2 = 2 x_2 + \lambda = 0$ → $x_1 = x_2 = -\lambda/2$.
$\partial / \partial \lambda = x_1 + x_2 - 2 = 0$ → $-\lambda = 2$, $\lambda = -2$, $x_1 = x_2 = 1$.

**최소값** $f(1, 1) = 2$.

기하적으로 원점에서 가장 가까운 $x_1 + x_2 = 2$ 직선의 점 = $(1, 1)^\top$.

---

## C-3. KKT 조건 (등식 + 부등식 제약)

### 정의 9.2 (일반 제약 최적화)
$$\min_{\mathbf{x}} f(\mathbf{x}) \quad \text{s.t.} \quad g_i(\mathbf{x}) \leq 0, \;\; h_j(\mathbf{x}) = 0.$$

### 정리 9.2 (KKT 필요조건, MML §7.2)
적당한 제약 자격 (regularity) 아래 국소 최소점 $\mathbf{x}^*$에 대해 승수 $\boldsymbol{\mu} \geq \mathbf{0}, \boldsymbol{\lambda}$가 존재하여

1. **Stationarity**: $\nabla f(\mathbf{x}^*) + \sum \mu_i \nabla g_i + \sum \lambda_j \nabla h_j = \mathbf{0}$
2. **Primal feasibility**: $g_i(\mathbf{x}^*) \leq 0$, $h_j(\mathbf{x}^*) = 0$
3. **Dual feasibility**: $\mu_i \geq 0$
4. **Complementary slackness**: $\mu_i \cdot g_i(\mathbf{x}^*) = 0$ (각 부등식 제약)

조건 4가 의미하는 것: **부등식 제약이 strict이면 ($g_i < 0$) 승수가 $0$이고, 승수가 양수이면 제약이 활성 ($g_i = 0$)** 이다.

---

## C-4. KKT 직관: SVM 미리보기 (Part 4 4회차)

Hard margin SVM:
$$\min_{\mathbf{w}, b} \tfrac{1}{2} \Vert \mathbf{w} \Vert^2 \quad \text{s.t.} \quad y_i(\mathbf{w}^\top \mathbf{x}_i + b) \geq 1.$$

KKT의 complementary slackness: $\mu_i > 0 \Leftrightarrow y_i(\mathbf{w}^\top \mathbf{x}_i + b) = 1$ ($\mathbf{x}_i$가 margin 위, **support vector**).

→ **support vector만 $\mathbf{w}$ 형성에 기여** (다른 점은 $\mu_i = 0$이라 영향 없음). KKT가 SVM의 "support vector" 명칭의 정확한 근거이다.

> 정식 SVM 분해는 Part 4 4·5회차.

---

# D. Convexity: 풀이가 global인 보장

## D-1. Convex 집합·함수: 정의

### 정의 9.3 (Convex set)
집합 $\mathcal{C} \subseteq \mathbb{R}^n$이 **convex**이면 모든 $\mathbf{x}, \mathbf{y} \in \mathcal{C}$, $\alpha \in [0, 1]$에 대해
$$\alpha \mathbf{x} + (1 - \alpha) \mathbf{y} \in \mathcal{C}.$$

### 정의 9.4 (Convex function)
$f: \mathcal{C} \to \mathbb{R}$ ($\mathcal{C}$ convex) 이 **convex**이면
$$f(\alpha \mathbf{x} + (1 - \alpha) \mathbf{y}) \leq \alpha f(\mathbf{x}) + (1 - \alpha) f(\mathbf{y}).$$

기하적으로 두 점을 잇는 직선 (코드) 이 함수 위에 있다. "사발 모양".

---

## D-2. Convex 함수의 특성화

### 정리 9.3 (Convex 특성화)
$f$가 미분 가능하면 다음이 동치:
1. $f$ convex.
2. $f(\mathbf{y}) \geq f(\mathbf{x}) + \nabla f(\mathbf{x})^\top (\mathbf{y} - \mathbf{x})$ (선형 근사가 항상 함수 아래).
3. $H(\mathbf{x}) = \nabla^2 f(\mathbf{x}) \succeq 0$ ($H$가 PSD) [2차 미분 가능 시].

### Strictly convex
부등식이 strict ($<$, $\preceq \to \prec$) 이면 **strictly convex** → 최소점이 유일.

---

## D-3. Convex 최적화의 보장

### 정리 9.4 (Convex 최적화의 정리)
$f$가 convex이고 제약 집합이 convex이면:
- **Local minimum = global minimum**.
- KKT 조건이 **충분조건**이기도 함 (필요조건만이 아니라).
- 듀얼 갭이 0 (strong duality 성립, 적당한 자격 아래).

이 정리가 "Convex 최적화는 풀린다"는 표어의 정식 근거이다.

<div class="analogy">

**직관 (Convex의 의미)**: Convex 함수는 위로 열린 사발 모양 (그래프 위에서 두 점을 잇는 선분이 그래프 위쪽에 위치) 이다. **임의의 초기값에서 시작해도 Gradient descent가 같은 한 점에 수렴**하며, 그 점이 곧 유일한 전역 최솟값이다. Non-convex 함수는 여러 local minimum을 가질 수 있어 초기값에 따라 다른 점에 수렴할 수 있다.

</div>

---

## D-4. AI 모델의 convex·non-convex

| 모델 | 손실 함수 | Convex? |
|---|---|---|
| 선형 회귀 (MSE) | $\Vert A\mathbf{x} - \mathbf{b} \Vert^2$ | **Convex** (이차형식 PSD) |
| Ridge 회귀 | $\Vert A\mathbf{x} - \mathbf{b} \Vert^2 + \lambda \Vert \mathbf{x} \Vert^2$ | **Strictly convex** |
| Logistic 회귀 | $\sum \log(1 + \exp(-y_i \mathbf{w}^\top \mathbf{x}_i))$ | **Convex** (8회차 Review) |
| SVM (hinge) | $\sum \max(0, 1 - y_i \cdot \mathrm{score})$ | **Convex** (convex 함수의 max) |
| **신경망** | Cross entropy | **Non-convex** |

→ 본 강의 Part 4 1·4회차 (회귀·SVM) 까지는 convex, CNN·Attention (Part 4 6·7) 부터 non-convex. **non-convex라도 SGD가 잘 동작하는 경험적 사실**이 deep learning의 핵심 발견.

---

<!-- _class: exercise -->

# 잠깐 풀어보기: Lagrange와 Convexity

### 문제 1 (Lagrange)
$f(\mathbf{x}) = x_1^2 + 4 x_2^2$를 최소화 (단, $x_1 + x_2 = 1$).

### 문제 2 (Convex 판정)
다음 함수가 convex인지 판정하시오.
- (i) $f(x_1, x_2) = x_1^2 + x_2^2 - 2 x_1 x_2$
- (ii) $f(x_1, x_2) = x_1 x_2$
- (iii) $f(\mathbf{x}) = \Vert A\mathbf{x} - \mathbf{b}\Vert^2 + \lambda \Vert \mathbf{x}\Vert^2$ ($\lambda > 0$)

---

<!-- _class: exercise -->

## 잠깐 풀어보기: 답

### 문제 1
$\mathcal{L} = x_1^2 + 4 x_2^2 + \lambda(x_1 + x_2 - 1)$. $2 x_1 + \lambda = 0$, $8 x_2 + \lambda = 0$ → $x_1 = -\lambda/2$, $x_2 = -\lambda/8$, $-\lambda/2 - \lambda/8 = 1$, $\lambda = -8/5$, $x_1 = 4/5$, $x_2 = 1/5$. 최소값 $= 16/25 + 4 \cdot 1/25 = 20/25 = 4/5$.

### 문제 2
- (i) $H = \begin{pmatrix} 2 & -2 \\ -2 & 2 \end{pmatrix}$, 고유값 $4, 0$, **PSD**, convex. ($(x_1 - x_2)^2$이므로 직관 확인)
- (ii) $H = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}$, 고유값 $\pm 1$, **indefinite**, non-convex (saddle).
- (iii) $H = 2 A^\top A + 2 \lambda I$. $A^\top A \succeq 0$이고 $\lambda > 0$이라 $H \succ 0$, **strictly convex**.

---

# E. Part 3 (VC + Probability) 종합 문제 Review (60분 세션)

> Part 2 + Part 3의 모든 도구 (Eigenvalue·SVD·Vector calculus·Probability·Optimization) 를 동원하는 문제다. **종합 문제는 4회차 전에 사전 공개되었으며**, 학생은 본인 페이스로 미리 풀어 와서 본 세션에 모두 함께 풀이를 짚는다. 본인 풀이에서 막혔던 단계를 강사·동료와 함께 검토한다.

---

<!-- _class: exercise -->

## 종합 문제 1: PCA를 두 방법으로

데이터 행렬 $X \in \mathbb{R}^{N \times d}$ ($N$개 데이터, $d$차원, 평균 0으로 centered).

- **(a)** 분산 최대화 방향 (1st PC) $\mathbf{w} \in \mathbb{R}^d$ ($\Vert \mathbf{w} \Vert = 1$) 를 Lagrange 승수법으로 유도하시오. 즉
$$\max_{\mathbf{w}} \mathbf{w}^\top S \mathbf{w} \quad \text{s.t.} \quad \Vert \mathbf{w} \Vert^2 = 1, \;\; S = \tfrac{1}{N} X^\top X.$$
이 문제의 해가 **$S$의 최대 고유값에 대응하는 고유벡터** 임을 보이시오.

- **(b)** 같은 1st PC가 **$X$의 SVD $X = U \Sigma V^\top$의 첫 번째 right singular vector $V_1$** 임을 확인. (Part 2 8-9회차 + 본 회차 KKT)

- **(c)** 두 방법 (분산 최대화 + SVD) 이 같은 답을 주는 LA 이유를 한 줄로.

---

<!-- _class: exercise -->

## 종합 문제 1: 풀이 흐름

### (a) Lagrange
$\mathcal{L}(\mathbf{w}, \lambda) = \mathbf{w}^\top S \mathbf{w} - \lambda (\mathbf{w}^\top \mathbf{w} - 1)$.
$\nabla_{\mathbf{w}} = 2 S \mathbf{w} - 2 \lambda \mathbf{w} = \mathbf{0}$ → **$S \mathbf{w} = \lambda \mathbf{w}$**, $\mathbf{w}$는 고유벡터.

목적값 $\mathbf{w}^\top S \mathbf{w} = \lambda \mathbf{w}^\top \mathbf{w} = \lambda$ → **$\lambda$가 최대인 고유벡터**가 1st PC.

### (b) SVD
$S = \tfrac{1}{N} X^\top X = \tfrac{1}{N} V \Sigma^\top \Sigma V^\top = V \cdot \mathrm{diag}(\sigma_i^2 / N) \cdot V^\top$. $S$의 고유분해와 $X$의 SVD의 right singular vector가 일치.

$S$의 가장 큰 고유값 = $\sigma_1^2 / N$, 대응 고유벡터 = $V_1$ (1st right singular vector).

### (c) 한 줄
**Symmetric PSD $S = X^\top X / N$의 고유분해와 $X$의 SVD가 동치**이기 때문 (Part 2 8·9회차 정리).

---

<!-- _class: exercise -->

## 종합 문제 2: Logistic 회귀의 convex 최적화

이진 분류 $\{(\mathbf{x}_i, y_i)\}_{i=1}^N$, $y_i \in \{0, 1\}$. Logistic + L2:
$$\mathcal{L}(\mathbf{w}) = -\sum_{i=1}^N [y_i \log \sigma(\mathbf{w}^\top \mathbf{x}_i) + (1-y_i) \log (1 - \sigma(\mathbf{w}^\top \mathbf{x}_i))] + \tfrac{\alpha}{2} \Vert \mathbf{w} \Vert^2.$$

- **(a)** $\mathcal{L}$이 strictly convex임을 Hessian으로 보이시오.
- **(b)** $\nabla \mathcal{L}$을 유도하시오 (벡터화).
- **(c)** GD ($\eta < 2 / L$) 가 global minimum으로 수렴하는 이유 두 가지.
- **(d)** $\alpha \to \infty$의 극한에서 $\mathbf{w}^* \to ?$

---

<!-- _class: exercise -->

## 종합 문제 2: 풀이 흐름

### (a) Strictly convex
한 항의 Hessian: 8회차 Review·7회차 → $\sigma(\mathbf{w}^\top \mathbf{x}_i)(1 - \sigma) \cdot \mathbf{x}_i \mathbf{x}_i^\top$ (PSD).
$\mathcal{L}$의 Hessian: $\sum_i \sigma(1-\sigma) \mathbf{x}_i \mathbf{x}_i^\top + \alpha I \succeq \alpha I \succ 0$ ($\alpha > 0$). → **strictly convex**.

### (b) Gradient
$\nabla \mathcal{L}(\mathbf{w}) = \sum_i (\sigma(\mathbf{w}^\top \mathbf{x}_i) - y_i) \mathbf{x}_i + \alpha \mathbf{w}$. = **$X^\top (\boldsymbol{\sigma} - \mathbf{y}) + \alpha \mathbf{w}$** (행렬 표기).

### (c) 두 이유
- $\mathcal{L}$ strictly convex → local = global, 유일한 최소점 존재.
- $\nabla \mathcal{L}$이 $L$-Lipschitz, $L = \lambda_{\max}(H) \leq \tfrac{1}{4}\Vert X \Vert_{\text{op}}^2 + \alpha$. $\eta < 1/L$에서 수렴.

### (d) $\alpha \to \infty$
$\mathcal{L}$의 정규화 항이 압도 → $\mathbf{w}^* \to \mathbf{0}$.

---

<!-- _class: exercise -->

## 종합 문제 3: 행렬 미분 (이차형식 + L2)

$f(\mathbf{x}) = \tfrac{1}{2} \Vert A\mathbf{x} - \mathbf{b}\Vert^2 + \tfrac{\lambda}{2} \Vert \mathbf{x}\Vert^2$ ($\lambda > 0$).

- **(a)** $\nabla f(\mathbf{x})$와 $H = \nabla^2 f$를 구하시오.
- **(b)** $\nabla f = \mathbf{0}$을 풀어 최소점 $\mathbf{x}^*$의 닫힌 형태를 구하시오 (Ridge 정규방정식).
- **(c)** $H$의 condition number와 $A^\top A$의 condition number의 관계를 비교하시오 ($\lambda$가 어떻게 $\kappa$를 줄이는가).
- **(d)** $\lambda = 0$일 때 $A$가 rank-deficient ($A^\top A$ 비가역) 이어도 (b) 의 해가 유일한 조건.

---

<!-- _class: exercise -->

## 종합 문제 3: 풀이 흐름

### (a) Gradient·Hessian
$\nabla f = A^\top (A\mathbf{x} - \mathbf{b}) + \lambda \mathbf{x}$.
$H = A^\top A + \lambda I$ (점에 무관, 이차형식).

### (b) Ridge 정규방정식
$(A^\top A + \lambda I) \mathbf{x}^* = A^\top \mathbf{b}$.
$\mathbf{x}^* = (A^\top A + \lambda I)^{-1} A^\top \mathbf{b}$.

$\lambda > 0$이면 $A^\top A + \lambda I \succ 0$ 항상 가역, 해 유일.

### (c) Condition number
$A^\top A$의 고유값을 $\mu_1 \geq \cdots \geq \mu_n \geq 0$. $H$의 고유값 $\mu_i + \lambda$.
$\kappa(H) = \dfrac{\mu_1 + \lambda}{\mu_n + \lambda}$. $\lambda$가 커질수록 분자·분모가 같이 커지지만 비율은 줄어든다.
$\lambda \gg \mu_1$이면 $\kappa(H) \to 1$ (잘 조건화).

### (d) $\lambda = 0$일 때 유일성
$A^\top A$가 가역 ($A$가 full column rank) → $\mathbf{x}^* = (A^\top A)^{-1} A^\top \mathbf{b}$ 유일.

> Part 4 1회차 (Linear Regression·Ridge·조건수·수치 안정성) 의 핵심이 본 문제에 들어 있다.

---

## E-1. Part 2 + Part 3 학습 흐름 정리 (한 슬라이드)

| 회차 | 도구 | Part 3 (VC + Probability) 종합 문제에서의 위치 |
|---|---|---|
| Part 2 5-6 | Eigenvalue·Diagonalization·Spectral | 문제 1 (PCA·$S$의 고유분해) |
| Part 2 7 | Positive definite | 문제 2·3 (Hessian PSD) |
| Part 2 8-9 | SVD·Eckart-Young | 문제 1 (PCA와 SVD 동치) |
| Part 3 1-2 | Vector calculus (Gradient·Jacobian·Hessian·Newton) | 문제 2·3 (Gradient·Hessian 유도) |
| Part 3 3 | Probability·MLE·KL·Cross entropy | 문제 2 (Logistic = NLL = cross entropy) |
| Part 3 4 | Lagrange·KKT·Convexity·GD | 모든 문제의 풀이 도구 |

**Part 2 + Part 3 전체가 한 학습 곡선** 위에 있다. Part 4의 모든 모델이 본 학습 흐름을 도구로 사용한다.

---

## E-2. 본 회차 핵심 5개

1. **Gradient Descent**: $\mathbf{x} - \eta \nabla f$. 학습률 $\eta < 1/L$ (Lipschitz) 에서 수렴, 속도는 condition number 의존.
2. **Lagrange 승수법**: 등식 제약 → $\nabla f = \sum \lambda_i \nabla g_i$. Lagrangian의 정류 조건.
3. **KKT 조건**: 부등식 포함 일반 제약 → 4조건 (stationarity·primal·dual·complementary slackness). Complementary slackness가 SVM의 support vector 정체.
4. **Convexity**: 함수가 convex ($\nabla^2 f \succeq 0$) 이면 local = global, KKT 충분조건. Strictly convex이면 해 유일.
5. **Part 2 + Part 3 종합 학습 흐름**: Eigen·SVD·Calculus·Probability·Optimization이 한 풀이에 다 들어가는 문제들을 풀 수 있다.

---

## E-3. 자기 점검 질문

- GD의 수렴 속도가 condition number에 의존하는 이유를 한 줄로.
- Lagrange 승수법이 등식 제약을 어떻게 자유 변수 풀이로 환원하는가?
- KKT 조건 4개를 적고, complementary slackness의 SVM 응용 (support vector) 을 설명.
- $f$가 convex인 세 가지 동치 조건은?
- 손실이 strictly convex이면 학습의 무엇이 보장되는가?

---

<!-- _class: exercise -->

# 본 회차 마무리 문제 (Part 3 (VC + Probability) 종합)

본 회차와 Part 2 + Part 3 전체를 한 문제로 종합한다.

데이터 $X \in \mathbb{R}^{N \times d}$ (centered), $\mathbf{y} \in \mathbb{R}^N$. Ridge 회귀 + 차원축소를 결합한 모델:
$$\min_{\mathbf{w} \in \mathbb{R}^k} \Vert X V_k \mathbf{w} - \mathbf{y} \Vert^2 + \alpha \Vert \mathbf{w} \Vert^2,$$
여기서 $V_k \in \mathbb{R}^{d \times k}$는 $X$의 SVD에서 top $k$ right singular vectors (PCA 차원축소).

- **(a)** 새 design matrix $Z = X V_k$의 SVD를 $X$의 SVD에서 유도하시오.
- **(b)** $\mathcal{L}(\mathbf{w}) = \Vert Z \mathbf{w} - \mathbf{y} \Vert^2 + \alpha \Vert \mathbf{w}\Vert^2$의 Gradient·Hessian과 최적해 $\mathbf{w}^*$의 닫힌 형태.
- **(c)** $Z^\top Z$가 대각 행렬이 되는 이유와 그 결과 $\mathbf{w}^*$가 좌표별 분리 형태가 됨을 보이시오.
- **(d)** 이 모델이 (i) convex인 이유, (ii) condition number $\kappa(Z^\top Z + \alpha I)$의 상한이 $X$의 condition number $\kappa(X)$로 어떻게 제한되는지.

---

<!-- _class: exercise -->

## 본 회차 마무리 문제: 답

- **(a)** $X = U \Sigma V^\top$, $Z = X V_k = U \Sigma V^\top V_k = U \Sigma_k$ (여기서 $\Sigma_k$는 첫 $k$개 열만, 나머지 0). $Z$의 SVD는 $U_k \Sigma_k I_k$, 즉 $Z$의 left singular vectors = $U_k$, singular values = $\sigma_1, \ldots, \sigma_k$.

- **(b)** $\nabla \mathcal{L} = 2 Z^\top (Z\mathbf{w} - \mathbf{y}) + 2\alpha \mathbf{w}$. $H = 2(Z^\top Z + \alpha I)$.
  $\mathbf{w}^* = (Z^\top Z + \alpha I)^{-1} Z^\top \mathbf{y}$.

- **(c)** $Z^\top Z = \Sigma_k U_k^\top U_k \Sigma_k = \Sigma_k^2 = \mathrm{diag}(\sigma_1^2, \ldots, \sigma_k^2)$ (대각). 따라서
  $\mathbf{w}^* = \mathrm{diag}\!\left( \frac{1}{\sigma_i^2 + \alpha} \right) \cdot \Sigma_k U_k^\top \mathbf{y} = \left( \frac{\sigma_i}{\sigma_i^2 + \alpha} \, U_{\cdot,i}^\top \mathbf{y} \right)_{i=1}^k$.
  **좌표별 분리**: 각 PC 방향이 독립적으로 풀린다.

- **(d)**
  - (i) $H = 2(Z^\top Z + \alpha I) \succeq 2\alpha I \succ 0$ (strictly convex).
  - (ii) $\kappa(Z^\top Z + \alpha I) = \dfrac{\sigma_1^2 + \alpha}{\sigma_k^2 + \alpha}$. $X$의 condition number $\kappa(X) = \sigma_1 / \sigma_d$이고 $\sigma_k \leq \sigma_d^{-1}$ 가 아니라 $\sigma_k \geq \sigma_d$ (top $k$이므로). 따라서 $\kappa$가 원본 $X$의 condition number보다 **항상 작거나 같다** (top-$k$만 사용 + 정규화).

> **핵심**: 본 문제 한 개에 SVD (Part 2 8-9) + Gradient·Hessian (Part 3 1-2) + MLE 직관 (Part 3 3) + Lagrange·KKT·Convexity·Condition number (Part 3 4) 가 모두 들어 있다.

---

<!-- _class: exercise -->

## 다음 회차 (Part 4 1회차) Review용 숙제

본 회차의 도구를 직접 사용한다.

- **(1)** $f(\mathbf{x}) = \Vert A\mathbf{x} - \mathbf{b}\Vert^2$의 정규방정식 $A^\top A \mathbf{x} = A^\top \mathbf{b}$의 유도를 Lagrange 없이 (Gradient = 0) 만으로 적으시오.
- **(2)** Ridge 회귀의 닫힌 해 $\mathbf{x}^* = (A^\top A + \lambda I)^{-1} A^\top \mathbf{b}$를 $A$의 SVD를 사용해 좌표별로 적으시오 (본 회차 마무리 문제 (c) 와 유사).
- **(3)** Condition number $\kappa(A^\top A) = \kappa(A)^2$임을 SVD로 보이시오. (FP16 환경에서 수치 안정성 문제의 출발점)

Part 4 1회차 (Linear Regression) Review에서 다룬다.

---

## E-4. 다음 회차 (Part 4 1회차) 예고

**주제**: Linear Regression (정규방정식 · MLE 해석 · Ridge · Condition number · 수치 안정성)

**연결**: 본 회차의 GD·Lagrange·Convexity가 그대로 Linear Regression의 최적화 풀이로 이어진다. Part 4는 **본 강의 LA 도구를 AI 모델 학습에 직접 적용**하는 영역이다.

> Bayesian Linear Regression은 본 강의 본문에서 다루지 않고 자율 학습으로 둔다 (Part 4 1회차 안내 참조).

**사전 reading**:
- MML §9.1-9.2 (Problem Formulation · Parameter Estimation)

---

<!-- _class: lead -->

# Q & A

본 회차 학습 흐름:
**GD → Lagrange → KKT → Convexity → Part 2 + Part 3 종합 학습 흐름**

핵심 한 줄: **Convex 최적화는 풀린다. Non-convex (신경망) 도 SGD가 잘 동작한다는 경험적 사실 위에 deep learning이 서 있다.**

Part 4의 출발 문제:
> Linear Regression의 정규방정식을 정확히, 그리고 수치적으로 안정하게 푸는 방법은 무엇인가? 데이터가 collinear이면 어떤 문제가 생기는가?

`HANDOUT`: 본 PDF + Part 4 1회차 사전 reading (MML §9.1-9.2)
