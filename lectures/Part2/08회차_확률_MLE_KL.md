---
marp: true
theme: default
paginate: true
header: '인공지능 전공자를 위한 선형대수학'
footer: 'Part 2 8회차 — Probability · MLE · KL · Cross Entropy · MVN'
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

# Part 2 8회차

## Probability · MLE · KL divergence · Cross Entropy · Multivariate Gaussian

MML §6 (메인) · §8.3 일부
**확률을 LA의 언어로**: 분포·기대값·MLE·KL·Cross entropy·다변량 가우시안을 도구로 정리한다. LLM의 토큰 예측 손실이 cross entropy 한 줄임을 본다.

> Conjugacy·Exponential Family는 본 회차 본문에서 다루지 않고 자율 학습으로 둔다 (E 섹션 안내 참조).

---

<!-- _class: exercise -->

# Review: 지난 회차 (Part 2 7회차) 마무리 문제

> **(1)** $f(x_1, x_2) = x_1^4 + x_2^4 - 4 x_1 x_2$의 임계점과 성격.
> **(2)** Logistic 손실 $\log(1 + \exp(-\mathbf{w}^\top \mathbf{x}))$의 Hessian이 PSD임 증명.
> **(3)** 이차형식 GD 수렴이 condition number $\kappa$에 의존.

---

<!-- _class: exercise -->

# Review: 답

- **(1)** $\nabla f = (4 x_1^3 - 4 x_2, 4 x_2^3 - 4 x_1)^\top = \mathbf{0}$에서 $x_2 = x_1^3$, $x_1 = x_2^3 = x_1^9$. $x_1 \in \{-1, 0, 1\}$. 임계점 $(0,0), (1,1), (-1,-1)$. $H = \begin{pmatrix} 12 x_1^2 & -4 \\ -4 & 12 x_2^2 \end{pmatrix}$. $(0,0)$에서 $H = \begin{pmatrix} 0 & -4 \\ -4 & 0 \end{pmatrix}$ 고유값 $\pm 4$, **saddle**. $(\pm 1, \pm 1)$에서 $H = \begin{pmatrix} 12 & -4 \\ -4 & 12 \end{pmatrix}$ 고유값 $8, 16$ 양수, **min**.

- **(2)** $H = \sigma(t)(1 - \sigma(t)) \cdot \mathbf{x} \mathbf{x}^\top$, $t = -\mathbf{w}^\top \mathbf{x}$. $\sigma(1 - \sigma) > 0$, $\mathbf{x}\mathbf{x}^\top$은 rank 1 PSD. 따라서 $H$도 PSD.

- **(3)** 한 스텝의 오차 감쇠율이 $(1 - \eta \lambda_{\min}) \cdots (1 - \eta \lambda_{\max})$ 사이. 가장 느린 좌표 (작은 $\lambda$) 가 전체 수렴 속도를 결정, 비율 $\kappa = \lambda_{\max}/\lambda_{\min}$.

---

## 본 회차 핵심 질문

> ### 데이터의 불확실성을 어떻게 분포로 모델링하고, 그 모델을 "가장 그럴듯하게" 학습하는 객체는 무엇인가?

이 질문에 답하려면 다섯 단계가 필요하다.

1. **확률 분포**의 두 형태 (이산·연속) 와 기대값·분산
2. **결합·주변·조건부 분포** + 베이즈 정리
3. **MLE (Maximum Likelihood Estimation)**, 모수 추정의 표준
4. **KL divergence**와 **Cross entropy**, 두 분포 비교
5. **Multivariate Gaussian (MVN)**, LA가 가장 잘 다루는 분포

---

## 학습 목표

본 회차가 끝나면 학생은 다음을 답할 수 있어야 한다.

1. **확률 분포**·기대값·분산·공분산의 정의와 LA 표기를 설명할 수 있다.
2. **베이즈 정리**의 식과 prior·likelihood·posterior·marginal 의미를 구별할 수 있다.
3. **MLE**가 데이터의 log-likelihood를 최대화하는 최적화 문제임을 알고 정규 (Gaussian) MLE를 손으로 유도할 수 있다.
4. **KL divergence**의 정의와 cross entropy와의 관계 (분류 손실의 정체) 를 설명할 수 있다.
5. **MVN**의 정의 + 공분산 행렬의 의미 + 등밀도 등고선이 타원임을 설명할 수 있다.

---

## 본 회차 개념 사슬

| 질문 | 답 | 도구 |
|---|---|---|
| 데이터의 불확실성을? | **확률 분포** $p(\mathbf{x})$ | 이산 PMF, 연속 PDF |
| 분포의 요약? | **기대값·분산·공분산** | $\mathbb{E}, \mathrm{Var}, \mathrm{Cov}$ |
| 관측 후 분포 갱신? | **베이즈 정리** | $p(\theta\mid \mathbf{x}) \propto p(\mathbf{x}\mid\theta) p(\theta)$ |
| 데이터로 모수 추정? | **MLE / MAP** | $\arg\max$ likelihood |
| 두 분포의 차이? | **KL divergence·Cross entropy** | LLM·분류 손실 |
| LA 친화적 연속 분포? | **MVN** | $\mathcal{N}(\boldsymbol{\mu}, \Sigma)$ |

---

## 수업 흐름

| 순서 | 블록 | 내용 |
|:---:|:---:|---|
| ① | A | Review + 본 회차 사슬 |
| ② | **B** | 확률 분포·기대값·분산·공분산 |
| ③ | **C** | 베이즈 정리·MLE·MAP |
| ④ | **C2** | KL divergence·Cross entropy |
| ⑤ | **D** | Multivariate Gaussian + AI 응용 (LLM·VAE 직관) |
| ⑥ | E | 코딩 실습 + 마무리 문제 + 자율 학습 박스 |

> **C·C2·D가 본 회차의 심장이다.**

---

# B. 확률 분포: 정의·기대값·분산

## B-1. 분포의 두 형태

### 정의 8.1 (이산 PMF)
이산 확률변수 $X$의 **Probability Mass Function (PMF)**:
$$p(x) = P(X = x), \quad p(x) \geq 0, \quad \sum_{x} p(x) = 1.$$

### 정의 8.2 (연속 PDF)
연속 확률변수 $X$의 **Probability Density Function (PDF)**:
$$p(x) \geq 0, \quad \int_{-\infty}^{\infty} p(x)\, dx = 1, \quad P(a \leq X \leq b) = \int_a^b p(x)\, dx.$$

연속 PDF의 값 $p(x)$는 확률이 아니라 **밀도**임에 주의 ($p(x) > 1$도 가능).

---

## B-2. 기대값·분산

### 정의 8.3 (기대값·분산)
- 기대값: $\mathbb{E}[X] = \sum_x x p(x)$ (이산) 또는 $\int x p(x) dx$ (연속).
- 분산: $\mathrm{Var}(X) = \mathbb{E}[(X - \mathbb{E}[X])^2] = \mathbb{E}[X^2] - (\mathbb{E}[X])^2$.
- 함수의 기대값: $\mathbb{E}[g(X)] = \sum g(x) p(x)$.

### 기대값의 선형성
$\mathbb{E}[a X + b Y + c] = a \mathbb{E}[X] + b \mathbb{E}[Y] + c$. **항상 성립** (독립 가정 없이).

### 분산은 선형 X
$\mathrm{Var}(a X) = a^2 \mathrm{Var}(X)$. $\mathrm{Var}(X + Y) = \mathrm{Var}(X) + \mathrm{Var}(Y) + 2 \mathrm{Cov}(X, Y)$.

---

## B-3. 결합·주변·조건부 분포

확률변수 두 개 $X, Y$일 때:
- **결합 (joint)**: $p(x, y)$
- **주변 (marginal)**: $p(x) = \sum_y p(x, y)$ (또는 적분)
- **조건부 (conditional)**: $p(y \mid x) = p(x, y) / p(x)$, 단 $p(x) > 0$.
- **독립**: $p(x, y) = p(x) p(y) \Leftrightarrow p(y \mid x) = p(y)$.

### 곱셈 법칙
$p(x, y) = p(y \mid x) p(x) = p(x \mid y) p(y).$

이 한 줄에서 **베이즈 정리**가 나온다.

---

## B-4. 공분산 행렬 (LA 친화 표기)

Vector valued 확률변수 $\mathbf{X} = (X_1, \ldots, X_n)^\top$에 대해
- 평균 Vector: $\boldsymbol{\mu} = \mathbb{E}[\mathbf{X}] \in \mathbb{R}^n$
- 공분산 행렬: $\Sigma = \mathbb{E}[(\mathbf{X} - \boldsymbol{\mu})(\mathbf{X} - \boldsymbol{\mu})^\top] \in \mathbb{R}^{n \times n}$

$(i, j)$ 성분 $\Sigma_{ij} = \mathrm{Cov}(X_i, X_j)$. 대각 $\Sigma_{ii} = \mathrm{Var}(X_i)$.

### 핵심 사실
- $\Sigma$는 **symmetric, positive semidefinite** (Part 2 3회차 정리 적용).
- 선형 변환 $\mathbf{Y} = A \mathbf{X} + \mathbf{b}$의 공분산: $\mathrm{Cov}(\mathbf{Y}) = A \Sigma A^\top$.

> Part 2 3회차의 양정치 (positive definite, 양정성·동차성·자기수반) 가 확률에서도 다시 등장한다.

---

# C. 베이즈 정리·MLE·MAP

## C-1. 베이즈 정리

### 정리 8.1 (Bayes)
$p(x) > 0$, $p(y) > 0$일 때
$$p(y \mid x) \;=\; \frac{p(x \mid y) p(y)}{p(x)}.$$

모수 $\theta$ 추정 맥락에서:
$$\underbrace{p(\theta \mid \mathcal{D})}_{\text{posterior}} \;=\; \frac{\overbrace{p(\mathcal{D} \mid \theta)}^{\text{likelihood}} \overbrace{p(\theta)}^{\text{prior}}}{\underbrace{p(\mathcal{D})}_{\text{evidence}}}.$$

- **Prior $p(\theta)$**: 데이터 보기 전 우리의 믿음.
- **Likelihood $p(\mathcal{D} \mid \theta)$**: 모수 $\theta$에서 데이터가 관측될 가능성.
- **Posterior $p(\theta \mid \mathcal{D})$**: 데이터를 본 뒤 갱신된 믿음.
- **Evidence $p(\mathcal{D})$**: 정규화 상수.

---

## C-2. MLE: Maximum Likelihood Estimation

### 정의 8.4 (MLE)
관측 데이터 $\mathcal{D} = \{\mathbf{x}_1, \ldots, \mathbf{x}_N\}$이 i.i.d.일 때 likelihood는
$$p(\mathcal{D} \mid \theta) = \prod_{i=1}^{N} p(\mathbf{x}_i \mid \theta).$$

**MLE**:
$$\theta_{\text{MLE}} = \arg\max_{\theta} \log p(\mathcal{D} \mid \theta) = \arg\max_{\theta} \sum_{i=1}^{N} \log p(\mathbf{x}_i \mid \theta).$$

곱을 log로 합으로 바꾸면 수치 안정성·미분 계산 모두 쉬워진다.

---

## C-3. MLE 예: 정규 (Gaussian) 분포

데이터 $x_1, \ldots, x_N \stackrel{\text{i.i.d.}}{\sim} \mathcal{N}(\mu, \sigma^2)$.

Log-likelihood:
$$\log p(\mathcal{D} \mid \mu, \sigma^2) = -\frac{N}{2} \log(2\pi \sigma^2) - \frac{1}{2\sigma^2} \sum_{i=1}^{N} (x_i - \mu)^2.$$

$\partial / \partial \mu = 0$:
$$\hat{\mu}_{\text{MLE}} = \frac{1}{N} \sum_i x_i \quad (\text{표본 평균}).$$

$\partial / \partial \sigma^2 = 0$:
$$\hat{\sigma}^2_{\text{MLE}} = \frac{1}{N} \sum_i (x_i - \hat{\mu})^2 \quad (\text{표본 분산, biased}).$$

> MLE 분산은 $N$으로 나누어 약간 biased이다. 불편 추정량은 $N - 1$이다 (자율 학습).

---

## C-4. MAP: Maximum A Posteriori

### 정의 8.5 (MAP)
$$\theta_{\text{MAP}} = \arg\max_{\theta} p(\theta \mid \mathcal{D}) = \arg\max_{\theta} \log p(\mathcal{D} \mid \theta) + \log p(\theta).$$

MLE에 **prior 로그항**이 더해진 형태.

### Ridge 회귀로의 연결 (Part 3 1회차 미리보기)
선형 회귀 + 정규 prior $\theta \sim \mathcal{N}(\mathbf{0}, \sigma_p^2 I)$ → MAP의 추가항 $\propto -\Vert \theta \Vert^2$, 즉 **L2 정규화 = MAP**이다.

<div class="analogy">

**직관 (시험 채점 비유)**: MLE는 **답안만 보고 채점**입니다. MAP는 **답안 + 평소 실력 (prior)** 을 함께 봅니다. 답안이 한 번 잘 나왔어도 평소 실력이 낮으면 (낮은 prior) 운이라고 보아 점수를 깎습니다 (정규화).

</div>

---

<!-- _class: exercise -->

# 잠깐 풀어보기: MLE

### 문제 1 (베르누이 MLE)
동전 던지기 $N$회 중 $k$번 앞면이 나왔다. 앞면 확률 $p$의 MLE를 유도하시오.

### 문제 2 (정규 평균만 MLE)
$x_1, \ldots, x_N \sim \mathcal{N}(\mu, \sigma_0^2)$, $\sigma_0^2$은 알려진 상수, $\mu$만 추정한다. MLE를 손으로 유도하시오.

---

<!-- _class: exercise -->

## 잠깐 풀어보기: 답

### 문제 1 (베르누이)
$L(p) = p^k (1-p)^{N-k}$. $\log L = k \log p + (N-k) \log(1-p)$.
$\partial / \partial p = k/p - (N-k)/(1-p) = 0$ → $\hat{p}_{\text{MLE}} = k/N$ (관측 빈도).

### 문제 2 (정규 평균)
$\log L = -\frac{1}{2\sigma_0^2} \sum (x_i - \mu)^2 + \text{const}$. $\partial / \partial \mu$: $\sum (x_i - \mu) = 0$, $\hat{\mu}_{\text{MLE}} = \bar{x}$.

> **메시지**: 두 경우 모두 MLE는 직관적인 통계량 (빈도·평균) 과 일치한다. 이것이 "가장 그럴듯한" 추정의 정식 형태.

---

# C2. KL divergence와 Cross Entropy

> 분포 두 개의 차이를 어떻게 잴 것인가.

## C2-1. KL divergence: 정의

### 정의 8.6 (Kullback-Leibler divergence)
두 분포 $p(\mathbf{x}), q(\mathbf{x})$ 사이의 **KL divergence**:
$$\mathrm{KL}(p \,\Vert\, q) = \mathbb{E}_{\mathbf{x} \sim p}\!\left[ \log \frac{p(\mathbf{x})}{q(\mathbf{x})} \right] = \sum_x p(x) \log \frac{p(x)}{q(x)}.$$

### 핵심 성질
- $\mathrm{KL}(p \Vert q) \geq 0$ (**Gibbs 부등식**, 증명은 Jensen 부등식).
- $\mathrm{KL}(p \Vert q) = 0 \Leftrightarrow p = q$.
- **Asymmetric**: 일반적으로 $\mathrm{KL}(p \Vert q) \neq \mathrm{KL}(q \Vert p)$ (거리가 아니다).

> Gibbs 부등식 (Gibbs inequality, $\log$의 오목성에서 유도) 은 KL의 비음 (non-negativity) 의 정식 근거.

---

## C2-2. Cross Entropy

### 정의 8.7 (Cross Entropy)
$$H(p, q) = -\mathbb{E}_{\mathbf{x} \sim p}[\log q(\mathbf{x})] = -\sum_x p(x) \log q(x).$$

### KL과의 관계
$$\mathrm{KL}(p \Vert q) = H(p, q) - H(p),$$
여기서 $H(p) = -\sum p \log p$는 **엔트로피** (분포 $p$ 자신의 불확실성, 상수).

→ $q$를 학습할 때 **KL 최소화 = Cross entropy 최소화** ($H(p)$가 상수이므로).

---

## C2-3. 분류 손실의 정체

$N$개 데이터 $\{(\mathbf{x}_i, y_i)\}$, $y_i \in \{1, \ldots, K\}$ (one-hot $\mathbf{y}_i$로 표현). 모델 $q_\theta(\mathbf{x})$가 $K$개 클래스에 확률을 부여한다 (softmax 출력).

**경험적 분포** $\hat{p}(\mathbf{x}, y) = \tfrac{1}{N} \sum_i \delta(\mathbf{x} - \mathbf{x}_i) \delta(y - y_i)$를 $q$에 fitting:
$$\arg\min_\theta \mathrm{KL}(\hat{p} \,\Vert\, q_\theta) = \arg\min_\theta -\frac{1}{N} \sum_{i=1}^{N} \log q_\theta(y_i \mid \mathbf{x}_i).$$

**음의 log-likelihood = Cross entropy 손실**이다. MLE와 cross entropy 최소화는 같은 문제.

### LLM의 토큰 예측 손실 (한 줄)
다음 토큰 분포 $q_\theta(\cdot \mid \text{context})$를 학습:
$$\mathcal{L} = -\frac{1}{T} \sum_{t=1}^{T} \log q_\theta(w_t \mid w_{1:t-1}).$$

GPT 학습은 cross entropy MLE 한 줄이다.

---

# D. Multivariate Gaussian과 AI 응용

## D-1. Multivariate Gaussian (MVN): 정의

### 정의 8.8 (MVN, MML §6.5)
평균 $\boldsymbol{\mu} \in \mathbb{R}^n$, 공분산 $\Sigma \in \mathbb{R}^{n \times n}$ (positive definite) 인 MVN의 PDF:
$$p(\mathbf{x}) = \frac{1}{(2\pi)^{n/2} (\det \Sigma)^{1/2}} \exp\!\left( -\tfrac{1}{2} (\mathbf{x} - \boldsymbol{\mu})^\top \Sigma^{-1} (\mathbf{x} - \boldsymbol{\mu}) \right).$$

표기: $\mathbf{x} \sim \mathcal{N}(\boldsymbol{\mu}, \Sigma)$.

### 핵심 성질
- **닫혀 있다**: 선형 변환·주변·조건부 모두 다시 MVN.
- **등밀도 등고선이 타원** ($(\mathbf{x} - \boldsymbol{\mu})^\top \Sigma^{-1} (\mathbf{x} - \boldsymbol{\mu}) = $ 상수).
- $\Sigma$의 고유분해 (Part 2 1·2회차) 가 곧 타원의 주축.

---

## D-2. MVN 타원의 기하 (LA 직접 연결)

$\Sigma = Q \Lambda Q^\top$ (spectral theorem, Part 2 2회차).

- 타원의 **주축 방향** = $\Sigma$의 고유벡터 (열 of $Q$).
- 주축의 **반지름** = $\sqrt{\lambda_i}$ (고유값의 제곱근).
- $\Sigma = \sigma^2 I$이면 등밀도가 **원** (등방향).

### 표준화 (whitening)
$\mathbf{z} = \Sigma^{-1/2} (\mathbf{x} - \boldsymbol{\mu})$로 변환하면 $\mathbf{z} \sim \mathcal{N}(\mathbf{0}, I)$. 모든 MVN은 LA 변환으로 표준 정규로 환원된다.

> $\Sigma^{-1/2}$는 Cholesky 또는 spectral decomposition로 구한다 (Part 2 3회차 연결).

---

## D-3. AI 응용: VAE의 ELBO 직관

**Variational AutoEncoder (VAE)** 의 잠재변수 $\mathbf{z}$ 모델:
- Prior: $p(\mathbf{z}) = \mathcal{N}(\mathbf{0}, I)$.
- Encoder: $q_\phi(\mathbf{z} \mid \mathbf{x}) = \mathcal{N}(\boldsymbol{\mu}_\phi(\mathbf{x}), \Sigma_\phi(\mathbf{x}))$.

VAE의 학습 목표 **Evidence Lower Bound (ELBO)**:
$$\mathcal{L} = \mathbb{E}_{q_\phi}[\log p_\theta(\mathbf{x} \mid \mathbf{z})] - \mathrm{KL}(q_\phi(\mathbf{z} \mid \mathbf{x}) \,\Vert\, p(\mathbf{z})).$$

- 첫 항: **reconstruction** (MLE, cross entropy).
- 둘째 항: **KL divergence**, posterior가 prior에서 너무 벗어나지 못하게 함.

두 MVN의 KL은 **닫힌 형태**로 풀린다 (Part 3 영역).

<div class="analogy">

**직관 (학생 모범답안 비유)**: ELBO는 학생에게 두 가지를 요구합니다, (1) **정답을 잘 맞춰라 (reconstruction)**, (2) **너무 튀는 답을 내지 마라 (KL이 prior와 가까이)**. 두 항의 균형이 곧 학습의 균형입니다.

</div>

---

## D-4. AI 응용: LLM의 토큰 MLE (한 슬라이드)

GPT 류 LLM의 학습:
$$\theta^* = \arg\max_\theta \sum_{(x_{1:T}) \in \mathcal{D}} \sum_{t=1}^{T} \log q_\theta(x_t \mid x_{1:t-1}).$$

이것은 **autoregressive likelihood의 MLE**이다. 모델 출력 $q_\theta(\cdot \mid \text{context})$는 vocabulary 크기 $V$의 softmax 분포이고, 손실은 그 분포와 다음 토큰 one-hot 사이의 cross entropy이다.

### 한 줄 정리
**LLM 학습 = 토큰 단위 cross entropy MLE.** 본 회차 C2의 식이 그대로 LLM 손실이다.

---

## D-5. 분포의 LA 표기 요약

| 객체 | LA 형태 |
|---|---|
| 평균 | Vector $\boldsymbol{\mu} \in \mathbb{R}^n$ |
| 공분산 | symmetric PSD Matrix $\Sigma$ |
| 정밀도 (precision) | $\Sigma^{-1}$ |
| 표준화 | $\mathbf{z} = \Sigma^{-1/2}(\mathbf{x} - \boldsymbol{\mu})$ |
| 마할라노비스 거리 제곱 | $(\mathbf{x} - \boldsymbol{\mu})^\top \Sigma^{-1} (\mathbf{x} - \boldsymbol{\mu})$ |
| MVN 선형 변환 | $A \mathbf{x} + \mathbf{b} \sim \mathcal{N}(A \boldsymbol{\mu} + \mathbf{b}, A \Sigma A^\top)$ |

확률을 다루는 일은 결국 **공분산 행렬을 다루는 일**이다.

---

## E-1. 코딩 실습: MLE + Cross entropy

```python
import numpy as np

# Gaussian MLE
np.random.seed(0)
x = np.random.normal(loc=3.0, scale=2.0, size=1000)
print("MLE mu:", x.mean(), "MLE sigma^2:", x.var())  # biased

# Cross entropy 손실 (분류)
def cross_entropy(p_true_onehot, q_pred):
    return -np.sum(p_true_onehot * np.log(q_pred + 1e-12))

y = np.array([0, 0, 1, 0])  # 정답 클래스
q = np.array([0.1, 0.2, 0.6, 0.1])  # 모델 예측
print("CE:", cross_entropy(y, q))  # = -log(0.6)
```

CE = $-\log q_y$ = "정답 클래스의 예측 확률의 음의 로그" 한 줄이다.

---

## E-2. 코딩 실습: MVN 등고선 시각화

```python
import numpy as np
import matplotlib.pyplot as plt

mu = np.array([0, 0])
Sigma = np.array([[2.0, 1.0], [1.0, 1.0]])
Sigma_inv = np.linalg.inv(Sigma)

xx, yy = np.meshgrid(np.linspace(-4, 4, 200), np.linspace(-4, 4, 200))
pts = np.stack([xx - mu[0], yy - mu[1]], axis=-1)
quad = np.einsum('...i,ij,...j->...', pts, Sigma_inv, pts)
density = np.exp(-0.5 * quad) / (2 * np.pi * np.sqrt(np.linalg.det(Sigma)))

plt.contour(xx, yy, density, levels=10)
# 주축 표시 (eigenvectors)
vals, vecs = np.linalg.eigh(Sigma)
for v, lam in zip(vecs.T, vals):
    plt.plot([0, np.sqrt(lam)*v[0]], [0, np.sqrt(lam)*v[1]], 'r-')
plt.axis('equal'); plt.show()
```

타원의 주축이 $\Sigma$의 고유벡터, 반지름이 $\sqrt{\lambda_i}$임을 눈으로 확인.

---

## E-3. 본 회차 핵심 5개

1. **확률 분포·기대값·공분산**: 이산 PMF·연속 PDF·기대값의 선형성·공분산 행렬은 symmetric PSD.
2. **베이즈 정리**: posterior $\propto$ likelihood $\times$ prior. MAP는 prior 정보를 더한 MLE.
3. **MLE**: log-likelihood 최대화. 정규 평균 MLE = 표본 평균, 분산 MLE = 표본 분산 (biased).
4. **KL · Cross entropy**: $\mathrm{KL}(p\Vert q) = H(p, q) - H(p)$. **분류·LLM 손실 = cross entropy MLE**.
5. **MVN**: 평균 $\boldsymbol{\mu}$ + 공분산 $\Sigma$로 결정. 등밀도가 타원이고 주축이 $\Sigma$의 고유벡터.

---

## E-4. 자기 점검 질문

- 기대값의 선형성은 독립 가정이 필요한가? 분산의 합 공식은?
- 베이즈 정리의 4 객체 (prior·likelihood·posterior·evidence) 의 의미를 한 줄씩.
- 정규 분포의 평균 MLE 유도를 손으로.
- KL divergence가 거리가 아닌 이유 (비대칭) 와 비음인 이유 (Gibbs).
- MVN의 공분산 행렬과 등밀도 타원의 관계 (주축·반지름)를 한 줄로.

---

<!-- _class: exercise -->

# 본 회차 마무리 문제

본 회차 사슬을 한 문제로 종합한다.

이진 분류 데이터 $\{(\mathbf{x}_i, y_i)\}_{i=1}^N$, $y_i \in \{0, 1\}$. 모델은 logistic:
$$q_\theta(y = 1 \mid \mathbf{x}) = \sigma(\mathbf{w}^\top \mathbf{x} + b), \quad \sigma(t) = \frac{1}{1 + e^{-t}}.$$

- **(a)** 한 데이터 $(\mathbf{x}_i, y_i)$의 likelihood $q_\theta(y_i \mid \mathbf{x}_i)$를 한 식으로 적으시오 (베르누이 형태).
- **(b)** 전체 데이터 log-likelihood를 적고, 그 음수 (NLL) 가 cross entropy 손실 $\mathcal{L}(\theta)$임을 확인.
- **(c)** $\nabla_{\mathbf{w}} \mathcal{L}$을 Chain rule로 유도. (힌트: $\sigma'(t) = \sigma(t)(1-\sigma(t))$, Part 2 7회차 Review)
- **(d)** MAP로 prior $\mathbf{w} \sim \mathcal{N}(\mathbf{0}, \alpha^{-1} I)$를 더하면 추가되는 항은? 어떤 정규화에 해당하는가?

---

<!-- _class: exercise -->

## 본 회차 마무리 문제: 답

- **(a)** $q_\theta(y_i \mid \mathbf{x}_i) = q_i^{y_i} (1 - q_i)^{1 - y_i}$, $q_i = \sigma(\mathbf{w}^\top \mathbf{x}_i + b)$.

- **(b)** $\log L = \sum_i [y_i \log q_i + (1 - y_i) \log(1 - q_i)]$.
  $\mathcal{L}(\theta) = -\log L = -\sum_i [y_i \log q_i + (1 - y_i) \log(1 - q_i)]$. = **베르누이 cross entropy**.

- **(c)** 한 항의 미분: $\partial / \partial \mathbf{w} [-y_i \log q_i - (1-y_i)\log(1-q_i)]$를 Chain rule로 풀면 $(q_i - y_i) \mathbf{x}_i$.
  $\nabla_{\mathbf{w}} \mathcal{L} = \sum_i (q_i - y_i) \mathbf{x}_i$. ("오차 × 입력" 한 줄, 선형 회귀와 같은 형태)

- **(d)** $-\log p(\mathbf{w}) = \tfrac{\alpha}{2} \Vert \mathbf{w} \Vert^2 + \text{const}$. **L2 정규화 (ridge)** 가 추가된다. MAP = MLE + L2.

> **핵심**: MLE + Gaussian prior = Ridge 정규화. Part 3 1회차의 정규방정식 + Ridge 가 본 회차로부터 자연스럽게 나온다.

---

<!-- _class: exercise -->

## 다음 회차 Review용 숙제

- **(1)** 정규 분포 평균 MAP을 prior $\mu \sim \mathcal{N}(\mu_0, \tau_0^2)$로 유도하시오. MLE와 어떻게 다른가? ($N \to \infty$일 때 MAP $\to$ MLE인 이유를 한 줄로)
- **(2)** Cross entropy 손실 $\mathcal{L} = -\log q_y$이고 $q = \mathrm{softmax}(\mathbf{z})$일 때 $\partial \mathcal{L} / \partial \mathbf{z}$를 구하시오. (힌트: Part 2 7회차 Review의 softmax Jacobian)
- **(3)** 2D MVN $\Sigma = \begin{pmatrix} 4 & 2 \\ 2 & 3 \end{pmatrix}$의 등밀도 타원의 주축과 반지름을 구하시오.

9회차 (Optimization·Part 2 종합) Review에서 다룬다.

---

## E-5. 자율 학습·부록

> **자율 학습·부록**: 본 회차 본문에서 제외한 심화 주제
> - **Conjugate prior (켤레 사전분포)**: prior와 posterior가 같은 분포 family에 속하는 경우 (예: 베르누이 likelihood + Beta prior → Beta posterior). 닫힌 형태 베이즈 추론의 기반. MML §6.6.1 참조.
> - **Exponential Family (지수족)**: $p(\mathbf{x} \mid \theta) = h(\mathbf{x}) \exp(\eta(\theta)^\top T(\mathbf{x}) - A(\theta))$ 꼴로 통합되는 분포의 일반 family. Gaussian·베르누이·포아송 등이 모두 포함. MML §6.6.2 참조.

본 회차에서는 다루지 않고 흥미 있는 학생의 자율 학습으로 둔다. 본 강의의 후속 (Part 3) 진도엔 영향이 없다.

---

## E-6. 다음 회차 (Part 2 9회차) 예고

**주제**: Continuous Optimization (Gradient Descent · Lagrange · KKT · Convexity) + **Part 2 종합 문제 풀기**

**연결**: 본 회차까지 다룬 MLE·MAP는 모두 최적화 문제이다. 9회차에서 그 최적화의 표준 도구 (GD·Lagrange·KKT) 와 convex 조건을 정리하고, **Part 2 (Eigenvalue → SVD → Calculus → Probability → Optimization) 전체를 종합 문제로 묶는다**.

**사전 reading**:
- MML §7.1-7.3 (Optimization Using Gradient Descent · Constrained Optimization · Convex Optimization)

---

<!-- _class: lead -->

# Q & A

본 회차 사슬:
**확률 분포 → 베이즈·MLE·MAP → KL·Cross entropy → MVN → LLM·VAE 직관**

핵심 한 줄: **분포의 차이는 KL로 재고, 데이터로 모델을 학습하는 일은 결국 cross entropy MLE이다.** LLM의 한 줄 손실이 본 회차에 들어 있다.

다음 회차의 출발 문제:
> MLE를 풀기 위한 최적화의 표준 도구 (GD·Lagrange·KKT) 는 무엇이고, **볼록 (convex)** 이라는 조건이 왜 그렇게 중요한가?

`HANDOUT`: 본 PDF + 9회차 사전 reading (MML §7.1-7.3)
