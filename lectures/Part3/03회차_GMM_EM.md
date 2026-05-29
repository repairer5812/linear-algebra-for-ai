---
marp: true
theme: default
paginate: true
header: '인공지능 전공자를 위한 선형대수학'
footer: 'Part 3 3회차 — Gaussian Mixture Models · EM Algorithm'
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

# Part 3 3회차

## Gaussian Mixture Models (GMM) · EM Algorithm

MML Ch 11 (메인)
**여러 가우시안의 혼합**: 데이터가 한 mode가 아니라 여러 군집을 형성할 때의 표준 확률 모델. **EM 알고리즘**으로 학습하며, K-means가 그 특수 극한임을 본다.

> Part 3 1·2회차의 단일 모델 (회귀·PCA) 을 다중 mode로 일반화하는 첫 단계이다.

---

<!-- _class: exercise -->

# Review: 지난 회차 (Part 3 2회차) 마무리 문제

> **(1)** PCA 결과 두 군집의 중심을 어떻게 알아낼 수 있는가?
> **(2)** 여러 가우시안의 혼합 데이터엔 어떤 모델이 필요한가?
> **(3)** Top-$k$ 절단 노이즈 제거의 한계.

---

<!-- _class: exercise -->

# Review: 답

- **(1)** PCA 자체는 평균만 잡는다. 군집 중심을 찾으려면 **클러스터링** (K-means·GMM) 이 필요. 본 회차의 핵심.

- **(2)** **Gaussian Mixture Model**. 각 가우시안 mode마다 (평균·공분산·가중치) 를 학습.

- **(3)** 신호와 노이즈가 **같은 PC 방향**에 놓이면 분리 불가. 비선형 다양체엔 autoencoder 등이 필요.

---

## 본 회차 핵심 질문

> ### 데이터가 여러 가우시안의 혼합으로 생성되었다고 가정할 때, 그 가우시안들의 모수 (평균·공분산·가중치) 와 각 데이터가 어느 mode 출신인지를 어떻게 동시에 추정하는가?

이 질문에 답하려면 네 단계가 필요하다.

1. **GMM 모델**: $K$개 가우시안의 가중 합
2. **잠재변수** $z_i \in \{1, \ldots, K\}$, "i번째 데이터가 어느 mode에서 왔는가"
3. **EM 알고리즘**: E-step (잠재변수 분포 추정) + M-step (모수 갱신)
4. **K-means**: GMM의 특수 극한 (등방 분산, hard assignment)

---

## 학습 목표

본 회차가 끝나면 학생은 다음을 답할 수 있어야 한다.

1. **GMM의 정의** (혼합 가중치 · 평균 · 공분산) 와 likelihood 식을 적을 수 있다.
2. **잠재변수 $z_i$** 의 의미와 EM의 동기 (직접 MLE 어려움) 를 설명할 수 있다.
3. **E-step**에서 **responsibility** $\gamma_{ik} = p(z_i = k \mid \mathbf{x}_i)$를 베이즈 정리로 계산할 수 있다.
4. **M-step**에서 가중 평균·가중 공분산·가중치 갱신 식을 적을 수 있다.
5. **K-means가 GMM의 특수 극한** ($\sigma^2 \to 0$, hard assignment) 임을 설명할 수 있다.

---

## 본 회차 개념 사슬

| 질문 | 답 | 도구 |
|---|---|---|
| 여러 mode의 분포? | **GMM** $p(\mathbf{x}) = \sum_k \pi_k \mathcal{N}(\boldsymbol{\mu}_k, \Sigma_k)$ | 혼합 분포 |
| 어느 mode 출신? | **잠재변수** $z_i$ | E-step responsibility |
| 직접 MLE 가능? | X (log 안에 sum) | **EM 알고리즘** |
| E-step? | **Responsibility** | $\gamma_{ik}$ 베이즈 |
| M-step? | **가중 평균·공분산·가중치** | 닫힌 형태 |
| Hard assignment 극한? | **K-means** | $\sigma^2 \to 0$ |

---

## 수업 흐름

| 순서 | 블록 | 내용 |
|:---:|:---:|---|
| ① | A | Review + 본 회차 사슬 |
| ② | **B** | GMM 모델·잠재변수 |
| ③ | **C** | EM 알고리즘 (E·M 두 step) |
| ④ | **C2** | EM의 수렴 직관 + K-means 극한 |
| ⑤ | **D** | 2D 시연 + 응용 |
| ⑥ | E | 코딩 실습 + 마무리 문제 |

> **C·C2가 본 회차의 심장이다.**

---

# B. GMM 모델

## B-1. 정의

### 정의 3.1 (Gaussian Mixture Model)
$K$개 가우시안의 가중 합:
$$p(\mathbf{x}) = \sum_{k=1}^{K} \pi_k \, \mathcal{N}(\mathbf{x} \mid \boldsymbol{\mu}_k, \Sigma_k),$$
- $\pi_k \geq 0$: 혼합 가중치 (mixing weight), $\sum_k \pi_k = 1$.
- $\boldsymbol{\mu}_k \in \mathbb{R}^d, \Sigma_k \in \mathbb{R}^{d \times d}$ (positive definite): 각 mode의 평균·공분산.

모수: $\theta = \{\pi_k, \boldsymbol{\mu}_k, \Sigma_k\}_{k=1}^K$.

### 생성 절차 (sampling)
1. $k \sim \text{Categorical}(\pi_1, \ldots, \pi_K)$.
2. $\mathbf{x} \sim \mathcal{N}(\boldsymbol{\mu}_k, \Sigma_k)$.

각 데이터는 어느 mode에서 추출되었지만, 우리는 그 mode 라벨을 보지 못한다 (잠재변수).

---

## B-2. 잠재변수 $z_i$

### 정의 3.2 (Latent variable)
각 데이터 $\mathbf{x}_i$에 잠재변수 $z_i \in \{1, \ldots, K\}$를 부여, "i번째 데이터가 어느 mode에서 왔는가".

- Prior: $p(z_i = k) = \pi_k$.
- Likelihood (mode $k$ 주어졌을 때): $p(\mathbf{x}_i \mid z_i = k) = \mathcal{N}(\mathbf{x}_i \mid \boldsymbol{\mu}_k, \Sigma_k)$.
- Marginal: $p(\mathbf{x}_i) = \sum_k \pi_k \mathcal{N}(\mathbf{x}_i \mid \boldsymbol{\mu}_k, \Sigma_k)$ (정의식).

### 완전 데이터 log-likelihood (latent를 안다면)
$$\log p(\mathcal{D}, \mathbf{z} \mid \theta) = \sum_i \log \pi_{z_i} + \log \mathcal{N}(\mathbf{x}_i \mid \boldsymbol{\mu}_{z_i}, \Sigma_{z_i}).$$

→ 각 mode별로 분리, MLE가 쉬움 (각 mode의 가우시안 MLE).

---

## B-3. 직접 MLE의 어려움

관측 데이터만의 log-likelihood:
$$\log p(\mathcal{D} \mid \theta) = \sum_i \log \left( \sum_k \pi_k \mathcal{N}(\mathbf{x}_i \mid \boldsymbol{\mu}_k, \Sigma_k) \right).$$

**$\log$ 안에 합이 있어** $\partial / \partial \theta = 0$을 닫힌 형태로 풀 수 없다.

<div class="analogy">

**직관 (학생 답안 채점 비유)**: 답안만 보고 누가 어느 반 (mode) 인지 모르는 채로 반별 평균을 추정해야 합니다. **반 라벨이 잠재변수**입니다. 직접 풀이 어렵지만, "라벨을 가정해 추정 → 추정 결과로 라벨을 갱신"의 반복 (EM) 이 해를 줍니다.

</div>

---

# C. EM 알고리즘

## C-1. EM의 두 step

### E-step (Expectation)
현재 모수 $\theta^{(t)}$에서 잠재변수의 **posterior** (responsibility) 를 계산:
$$\gamma_{ik}^{(t)} = p(z_i = k \mid \mathbf{x}_i, \theta^{(t)}) = \frac{\pi_k^{(t)} \mathcal{N}(\mathbf{x}_i \mid \boldsymbol{\mu}_k^{(t)}, \Sigma_k^{(t)})}{\sum_j \pi_j^{(t)} \mathcal{N}(\mathbf{x}_i \mid \boldsymbol{\mu}_j^{(t)}, \Sigma_j^{(t)})}.$$

**$\gamma_{ik}$ = 데이터 $\mathbf{x}_i$가 mode $k$에서 왔을 확률**. $\sum_k \gamma_{ik} = 1$.

### M-step (Maximization)
잠재변수의 분포를 고정한 채 **모수를 갱신**:
$$N_k = \sum_i \gamma_{ik}, \quad \pi_k^{(t+1)} = \frac{N_k}{N},$$
$$\boldsymbol{\mu}_k^{(t+1)} = \frac{1}{N_k} \sum_i \gamma_{ik} \mathbf{x}_i, \quad \Sigma_k^{(t+1)} = \frac{1}{N_k} \sum_i \gamma_{ik} (\mathbf{x}_i - \boldsymbol{\mu}_k^{(t+1)})(\mathbf{x}_i - \boldsymbol{\mu}_k^{(t+1)})^\top.$$

E·M을 수렴할 때까지 반복.

---

## C-2. M-step 식 유도 흐름 (한 슬라이드)

**완전 데이터 log-likelihood의 기대값**:
$$Q(\theta \mid \theta^{(t)}) = \sum_i \sum_k \gamma_{ik}^{(t)} \left[ \log \pi_k + \log \mathcal{N}(\mathbf{x}_i \mid \boldsymbol{\mu}_k, \Sigma_k) \right].$$

각 모수에 대해 미분 = 0:
- $\partial Q / \partial \boldsymbol{\mu}_k$: $\sum_i \gamma_{ik} \Sigma_k^{-1}(\mathbf{x}_i - \boldsymbol{\mu}_k) = \mathbf{0}$ → $\boldsymbol{\mu}_k = \sum_i \gamma_{ik} \mathbf{x}_i / N_k$ (가중 평균).
- $\partial Q / \partial \Sigma_k$: 가우시안 분산 MLE의 가중 버전 → $\Sigma_k = \sum_i \gamma_{ik} (\mathbf{x}_i - \boldsymbol{\mu}_k)(\mathbf{x}_i - \boldsymbol{\mu}_k)^\top / N_k$.
- $\partial / \partial \pi_k$ (Lagrange $\sum \pi_k = 1$): $\pi_k = N_k / N$.

→ M-step은 "가중 가우시안 MLE" 한 줄.

---

## C-3. EM 알고리즘 (수도코드)

```
input: data X = {x_1, ..., x_N}, K (모드 수)
initialize: μ_k (random or K-means++), Σ_k = I, π_k = 1/K

repeat until convergence:
    E-step:
        γ_ik = π_k N(x_i | μ_k, Σ_k) / Σ_j π_j N(x_i | μ_j, Σ_j)
    
    M-step:
        N_k = Σ_i γ_ik
        π_k = N_k / N
        μ_k = (1/N_k) Σ_i γ_ik x_i
        Σ_k = (1/N_k) Σ_i γ_ik (x_i - μ_k)(x_i - μ_k)^T

return θ = {π_k, μ_k, Σ_k}
```

수렴 판정: log-likelihood $\log p(\mathcal{D} \mid \theta^{(t)})$의 증분이 임계값 이하.

---

# C2. EM의 수렴 + K-means 극한

## C2-1. EM의 수렴 보장

### 정리 3.1 (Monotonic improvement)
EM의 매 반복에서 **observed log-likelihood가 단조 증가**:
$$\log p(\mathcal{D} \mid \theta^{(t+1)}) \geq \log p(\mathcal{D} \mid \theta^{(t)}).$$

→ **유한 (또는 무한) iteration 후 local maximum에 수렴**.

### 증명 흐름 (ELBO 관점)
$$\log p(\mathcal{D} \mid \theta) = \mathcal{Q}(\theta \mid \theta^{(t)}) + H(\gamma^{(t)}) + \mathrm{KL}(\gamma^{(t)} \,\Vert\, p(\mathbf{z} \mid \mathcal{D}, \theta)).$$

E-step에서 KL을 0으로 (responsibility = exact posterior), M-step에서 $\mathcal{Q}$를 올림. 두 step 모두 log-likelihood를 깎지 않음.

> 정식 증명은 MML §11.3 또는 Bishop *PRML* 9.4.

---

## C2-2. EM의 한계

- **Local maximum**에 수렴 (global 보장 X). 초기화 의존성 큼.
- **모드 수 $K$** 를 사전 지정해야 함 (Dirichlet process로 일반화 가능, 자율).
- **공분산 $\Sigma_k$ 가 singular** 가 되는 degenerate solution 위험 (한 데이터에 mode 하나 붙어 분산 0). → regularization 또는 tied covariance.

### 초기화 표준
- **K-means++**: 좋은 $\boldsymbol{\mu}_k$ 시작점.
- 여러 random restart 후 best log-likelihood 선택.

---

## C2-3. K-means가 GMM의 특수 극한

### 가정
- 모든 $\Sigma_k = \sigma^2 I$ (등방, 같은 분산).
- $\sigma^2 \to 0$의 극한.

### Responsibility 극한
$\gamma_{ik} = \pi_k \exp(-\Vert \mathbf{x}_i - \boldsymbol{\mu}_k \Vert^2 / 2 \sigma^2) / Z$. $\sigma^2 \to 0$이면 가장 가까운 $\boldsymbol{\mu}_k$가 압도 → **$\gamma_{ik} = 1$ if k = nearest, else 0** (hard assignment).

### M-step 극한
가중 평균이 단순 **cluster centroid**가 됨:
$$\boldsymbol{\mu}_k = \text{mean of points assigned to cluster } k.$$

→ **K-means = GMM with isotropic Σ, σ² → 0, hard assignment**.

> K-means는 EM의 한 줄 버전. 더 일반적인 GMM이 soft assignment·다른 공분산을 허용.

---

## C2-4. GMM vs K-means: 비교

| 항목 | K-means | GMM |
|---|---|---|
| Assignment | Hard (0 or 1) | Soft (확률) |
| 분산 모델 | 등방, 같은 분산 | 임의 (anisotropic, mode별 다름) |
| 모드 가중치 | 동일 (1/K) | $\pi_k$ 학습 |
| 클러스터 모양 | **구** (sphere) | **타원** (covariance) |
| 수렴 보장 | 단조 (코스트 감소) | 단조 (likelihood 증가) |
| 초기화 민감 | 매우 | 매우 |
| 비용 | 빠름 | 느림 |

→ GMM이 더 유연하지만 비용 증가. 실용은 데이터·자원에 따라 선택.

---

<!-- _class: exercise -->

# 잠깐 풀어보기: EM 한 step

### 문제 1 (1D GMM E-step)
1D 데이터 $x = 1$이 주어졌다. 현재 모수: $K = 2$, $\pi = (0.5, 0.5)$, $\mu = (0, 2)$, $\sigma^2 = (1, 1)$.

- $\gamma_1, \gamma_2$ (responsibility) 를 계산하시오.

### 문제 2 (M-step 가중 평균)
3개 데이터 $x_1 = 0, x_2 = 1, x_3 = 3$. Responsibility $\gamma_1 = (0.9, 0.7, 0.1)$.

- $N_1 = \sum \gamma_{i1}$, $\mu_1^{\text{new}} = \sum \gamma_{i1} x_i / N_1$을 구하시오.

---

<!-- _class: exercise -->

## 잠깐 풀어보기: 답

### 문제 1
$\mathcal{N}(1 \mid 0, 1) = (1/\sqrt{2\pi}) e^{-1/2} \approx 0.2420$.
$\mathcal{N}(1 \mid 2, 1) = (1/\sqrt{2\pi}) e^{-1/2} \approx 0.2420$.
분자 동일 ($\pi$도 동일). $\gamma_1 = \gamma_2 = 0.5$.

> $x = 1$이 두 mode 정확히 중간에 있어 어느 mode에서 왔는지 모른다. 가장 불확실한 데이터.

### 문제 2
$N_1 = 0.9 + 0.7 + 0.1 = 1.7$.
$\mu_1^{\text{new}} = (0.9 \cdot 0 + 0.7 \cdot 1 + 0.1 \cdot 3) / 1.7 = 1.0 / 1.7 \approx 0.588$.

> 첫 두 점 (책임도 0.9, 0.7) 이 우세하고 셋째 점 (0.1) 은 거의 무시. 가중 평균이 cluster center 직관.

---

# D. 2D 시연과 응용

## D-1. 2D 시연: 두 가우시안 혼합

데이터 생성:
$\mathbf{x} \sim 0.6 \cdot \mathcal{N}((-2, 0)^\top, I) + 0.4 \cdot \mathcal{N}((3, 1)^\top, \begin{pmatrix} 1 & 0.5 \\ 0.5 & 1 \end{pmatrix})$.

### 학습 결과
- 추정 $\boldsymbol{\mu}_1 \approx (-2, 0)^\top$, $\boldsymbol{\mu}_2 \approx (3, 1)^\top$.
- 추정 $\Sigma_1 \approx I$ (등방), $\Sigma_2 \approx$ 상관 있는 타원 (Part 2 8회차 MVN 타원).
- $\pi \approx (0.6, 0.4)$.

각 데이터의 responsibility로 soft cluster 라벨 부여. 두 mode가 겹치는 경계에서 $\gamma_{i1}, \gamma_{i2}$가 비슷.

---

## D-2. 응용

| 응용 | 사용 방식 |
|---|---|
| **클러스터링** | $K$개 mode로 분리. 두 PC + GMM이 표준 EDA |
| **밀도 추정** | 임의 위치 $\mathbf{x}$의 $p(\mathbf{x})$ 직접 추정 |
| **이상치 탐지** | $p(\mathbf{x}_{\text{new}})$가 너무 낮으면 이상 |
| **음성 인식 (GMM-HMM)** | 음향 특징 분포를 GMM, 시퀀스 구조를 HMM (자율) |
| **VAE의 prior** | 잠재변수에 GMM prior (자율) |

→ GMM은 **확률적 클러스터링·밀도 추정의 표준**이다.

---

## D-3. GMM의 한계와 후속

- **모드 수 $K$ 선택**: BIC·AIC로 모델 선택, 또는 Dirichlet process (nonparametric).
- **고차원 데이터** ($d \gg N$): $\Sigma_k$가 너무 큼. 대각 ·tied·factor 공분산 등으로 단순화.
- **비가우시안 모양**: GMM은 가우시안 합이라 별 모양·반달 모양 같은 비가우시안 군집은 잘 잡지 못함. → spectral clustering, deep clustering.

> 본 강의는 GMM·EM의 표준 사이클까지를 본문으로 한다.

---

## E-1. 코딩 실습: scikit-learn GMM

```python
import numpy as np
from sklearn.mixture import GaussianMixture
import matplotlib.pyplot as plt

# 데이터 생성
np.random.seed(0)
X1 = np.random.randn(120, 2) + np.array([-2, 0])
X2 = np.random.randn(80, 2) @ np.array([[1, 0.5], [0.5, 1]]) + np.array([3, 1])
X = np.vstack([X1, X2])

# GMM 학습
gmm = GaussianMixture(n_components=2, covariance_type='full', random_state=0)
gmm.fit(X)
print("pi:", gmm.weights_)
print("mu:", gmm.means_)
print("Sigma:", gmm.covariances_)

# Responsibility
gamma = gmm.predict_proba(X)
plt.scatter(X[:, 0], X[:, 1], c=gamma[:, 0], cmap='RdBu', s=10)
plt.title("Responsibility γ_1")
plt.show()
```

학습된 $\pi, \boldsymbol{\mu}, \Sigma$ 가 생성 모수와 가까운지 확인. Responsibility 시각화에서 경계 영역이 보임.

---

## E-2. 코딩 실습: EM 직접 구현 (1D)

```python
import numpy as np

def gmm_em_1d(X, K, n_iter=50):
    N = len(X)
    mu = np.random.choice(X, size=K, replace=False).astype(float)
    sigma2 = np.ones(K) * X.var()
    pi = np.ones(K) / K

    for t in range(n_iter):
        # E-step
        probs = np.array([pi[k] / np.sqrt(2*np.pi*sigma2[k]) *
                          np.exp(-0.5 * (X - mu[k])**2 / sigma2[k])
                          for k in range(K)])  # (K, N)
        gamma = probs / probs.sum(axis=0, keepdims=True)
        # M-step
        Nk = gamma.sum(axis=1)
        pi = Nk / N
        mu = (gamma * X).sum(axis=1) / Nk
        sigma2 = (gamma * (X - mu[:, None])**2).sum(axis=1) / Nk
    return pi, mu, sigma2

np.random.seed(0)
X = np.concatenate([np.random.normal(-2, 1, 300),
                    np.random.normal(3, 0.5, 200)])
pi, mu, sigma2 = gmm_em_1d(X, K=2)
print("pi:", pi); print("mu:", mu); print("sigma2:", sigma2)
```

직접 구현으로 EM의 E·M 두 줄이 실제로 작동함을 확인.

---

## E-3. 본 회차 핵심 5개

1. **GMM 모델**: $K$개 가우시안의 가중 합. 모수 $\theta = \{\pi_k, \boldsymbol{\mu}_k, \Sigma_k\}$.
2. **잠재변수** $z_i$: 데이터가 어느 mode에서 왔는가. 직접 관측 X. 직접 MLE가 어려운 이유는 log 안 sum.
3. **EM 알고리즘**: E-step (responsibility 베이즈) + M-step (가중 평균·공분산·가중치). 두 step 반복.
4. **수렴**: log-likelihood 단조 증가, local max 보장. 초기화 의존.
5. **K-means = GMM의 특수 극한** ($\Sigma_k = \sigma^2 I$, $\sigma^2 \to 0$, hard assignment).

---

## E-4. 자기 점검 질문

- GMM의 직접 MLE이 어려운 이유 (log 안 sum) 와 EM이 그것을 어떻게 우회하는가?
- E-step의 responsibility $\gamma_{ik}$를 베이즈 정리 한 줄로 적으시오.
- M-step의 세 갱신 식 (π, μ, Σ) 를 그 의미와 함께.
- EM의 수렴 보장 (단조 증가) 의 한 줄 직관.
- K-means가 GMM의 특수 극한인 조건 두 가지 ($\Sigma_k$, $\sigma^2$).

---

<!-- _class: exercise -->

# 본 회차 마무리 문제

본 회차 사슬을 한 문제로 종합한다.

3개 1D 데이터 $X = \{-1, 2, 5\}$, $K = 2$. 초기 모수: $\pi^{(0)} = (0.5, 0.5)$, $\mu^{(0)} = (0, 4)$, $\sigma^2_{(0)} = (1, 1)$.

- **(a)** E-step 1번 후 responsibility $\gamma_{ik}^{(1)}$를 계산. (Hint: 각 데이터에 대해 두 mode의 가우시안 PDF 값으로 정규화)
- **(b)** M-step 1번 후 $\pi^{(1)}, \mu^{(1)}, \sigma^2_{(1)}$를 계산. (가중 평균·가중 분산 식)
- **(c)** Log-likelihood $\log p(X \mid \theta^{(0)}), \log p(X \mid \theta^{(1)})$를 비교. 단조 증가하는가?
- **(d)** 이 한 step에서 K-means라면 어떻게 진행되는가? Hard assignment로.

---

<!-- _class: exercise -->

## 본 회차 마무리 문제: 답

- **(a)** 가우시안 PDF (분모 $\sqrt{2\pi}$ 공통, 비율만):
  - $x = -1$: $\mathcal{N}(-1|0,1) \propto e^{-0.5}, \mathcal{N}(-1|4,1) \propto e^{-12.5}$. $\gamma_{11} \approx 1, \gamma_{12} \approx 0$.
  - $x = 2$: $\mathcal{N}(2|0,1) \propto e^{-2}, \mathcal{N}(2|4,1) \propto e^{-2}$. $\gamma_{21} = \gamma_{22} = 0.5$.
  - $x = 5$: $\mathcal{N}(5|0,1) \propto e^{-12.5}, \mathcal{N}(5|4,1) \propto e^{-0.5}$. $\gamma_{31} \approx 0, \gamma_{32} \approx 1$.

- **(b)**
  - $N_1 = 1 + 0.5 + 0 = 1.5$, $N_2 = 0 + 0.5 + 1 = 1.5$. $\pi^{(1)} = (0.5, 0.5)$.
  - $\mu_1^{(1)} = (1 \cdot (-1) + 0.5 \cdot 2 + 0 \cdot 5) / 1.5 = 0/1.5 = 0$. (변화 없음)
  - $\mu_2^{(1)} = (0 \cdot (-1) + 0.5 \cdot 2 + 1 \cdot 5)/1.5 = 6/1.5 = 4$. (변화 없음)
  - $\sigma^2_{1,(1)} = (1 \cdot 1 + 0.5 \cdot 4 + 0)/1.5 = 3/1.5 = 2$. (증가)
  - $\sigma^2_{2,(1)} = (0 + 0.5 \cdot 4 + 1 \cdot 1)/1.5 = 3/1.5 = 2$. (증가)

- **(c)** 분산이 데이터에 맞게 늘어났으므로 likelihood 증가 (계산 생략, 정성적).

- **(d)** K-means hard assignment: $x = -1 \to$ cluster 1, $x = 2 \to$ tie (거리 같음, 일반적으로 한 쪽 선택), $x = 5 \to$ cluster 2. centroid 갱신은 단순 평균.

> **핵심**: EM은 soft assignment로 경계 데이터 $(x = 2)$ 의 불확실성을 반영하고, 그 결과 분산이 더 정확히 추정된다.

---

<!-- _class: exercise -->

## 다음 회차 (Part 3 4회차) Review용 숙제

- **(1)** 본 회차 문제의 EM 반복 5번 후 모수를 (수기 또는 코드로) 계산하시오. 수렴하는가?
- **(2)** GMM의 모드 수 $K$를 어떻게 선택하는지 BIC·AIC 정의를 자율 학습으로 찾아 정리. (책무 X)
- **(3)** 본 회차 GMM이 "분류 (supervised) 가 아닌 클러스터링 (unsupervised)" 인 이유. 다음 회차 (SVM) 와 어떤 점에서 다른가? (Hint: 라벨 사용 여부)

Part 3 4회차 (SVM) Review에서 다룬다.

---

## E-5. 다음 회차 (Part 3 4회차) 예고

**주제**: Support Vector Machine (SVM) Hard / Soft Margin · Hinge Loss · Dual

**연결**: 본 회차의 GMM은 unsupervised (라벨 X). Part 3 4회차의 SVM은 supervised 분류의 표준이며, Part 2 9회차에서 미리 본 KKT 조건이 SVM dual의 핵심이다. **support vector** 의 정확한 정의가 등장한다.

**사전 reading**:
- MML §12.1-12.3 (Separating Hyperplanes·Primal SVM)

---

<!-- _class: lead -->

# Q & A

본 회차 사슬:
**GMM 모델 → 잠재변수 → EM (E + M) → 수렴 → K-means 극한**

핵심 한 줄: **EM은 잠재변수를 가정해 soft assignment로 채운 뒤 모수를 가중 가우시안 MLE로 갱신한다.** 두 step의 반복이 likelihood를 단조 증가시킨다.

다음 회차의 출발 문제:
> 라벨이 주어진 분류 문제에서 두 클래스를 가장 안정적으로 분리하는 hyperplane은 무엇이고, 그 풀이가 왜 KKT 조건의 모범 사례인가?

`HANDOUT`: 본 PDF + Part 3 4회차 사전 reading (MML §12.1-12.3)
