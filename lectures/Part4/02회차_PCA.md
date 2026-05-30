---
marp: true
theme: default
paginate: true
header: '인공지능 전공자를 위한 선형대수학'
footer: 'Part 4 2회차 — PCA · SVD 동치 · 분산 최대화 · 재구성 오차'
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

# Part 4 2회차

## PCA: 분산 최대화 = 재구성 오차 최소화 = SVD

MML Ch 10 (메인) · Part 4 (ML 및 AI의 수학적 응용)
**차원 축소의 표준**: PCA의 두 동치 정식 (분산 최대화 · 재구성 오차 최소화) 이 모두 데이터 행렬의 SVD로 환원된다. Part 3 4회차 종합 문제 1을 정식으로 풀고 응용 (eigenfaces) 까지 확장한다.

> Probabilistic PCA (PPCA) 는 본 회차 본문에서 다루지 않고 자율 학습으로 둔다.

---

<!-- _class: exercise -->

# Review: 지난 회차 (Part 4 1회차) 마무리 문제

> **(1)** $\mathbf{w}^*_{\text{ridge}}$에서 $\sigma_i \to 0$ 좌표가 자동 무시됨을 SVD 식으로.
> **(2)** 다중공선성에 Ridge가 효과적인 SVD 정당화.
> **(3)** PCA 차원축소와 Ridge의 공통 정신.

---

<!-- _class: exercise -->

# Review: 답

- **(1)** $\sigma_i / (\sigma_i^2 + \lambda) \to 0 / (0 + \lambda) = 0$. 자동 shrinkage to 0.

- **(2)** 다중공선성 = 일부 $\sigma_i$가 매우 작음. Ridge가 그 좌표의 영향을 자동 축소. OLS는 $1/\sigma_i$로 폭증.

- **(3)** **둘 다 작은 특이값 방향을 무시**한다. Ridge는 연속적 shrinkage, PCA는 cutoff (top-$k$만 남김). 정신은 같다.

---

## 본 회차 핵심 질문

> ### 데이터의 본질적 차원을 추출하는 표준 방법 PCA는 어떤 두 동치 정식으로 정의되고, 그것이 왜 데이터 행렬의 SVD와 같은가?

이 질문에 답하려면 네 단계가 필요하다.

1. **PCA 정식 1**: 투영 후 분산 최대화 (variance maximization)
2. **PCA 정식 2**: 재구성 오차 최소화 (reconstruction error minimization)
3. **SVD 동치**: 두 정식 모두 $X$의 SVD에서 직접 풀린다
4. **응용**: Eigenfaces, MNIST 시각화, 노이즈 제거

---

## 학습 목표

본 회차가 끝나면 학생은 다음을 답할 수 있어야 한다.

1. **PCA의 두 정식 정의** (분산 최대화 · 재구성 오차) 를 적고 동치임을 보일 수 있다.
2. PCA 해 (첫 PC) 가 공분산 행렬 $S = X^\top X / N$의 **최대 고유값 고유벡터** 임을 Lagrange 승수법으로 유도할 수 있다.
3. PCA가 **$X$의 SVD의 right singular vectors** 와 일치함을 보일 수 있다.
4. **Explained variance ratio** $\sigma_i^2 / \sum_j \sigma_j^2$로 차원 선택을 할 수 있다.
5. **Eigenfaces·MNIST 시각화**를 직관적으로 설명할 수 있다.

---

## 본 회차 학습 흐름

| 질문 | 답 | 도구 |
|---|---|---|
| 차원축소의 정식 1? | **분산 최대화** | Lagrange + 고유분해 |
| 차원축소의 정식 2? | **재구성 오차 최소화** | Eckart-Young (Part 2 9) |
| 둘이 동치인 이유? | **공분산의 고유분해 = $X$의 SVD** | Part 2 8·9회차 |
| 몇 차원을 남길까? | **Explained variance ratio** | $\sigma_i^2$의 누적 비율 |
| 응용? | **Eigenfaces·MNIST 시각화** | 얼굴·숫자의 주성분 |

---

## 수업 흐름

| 순서 | 블록 | 내용 |
|:---:|:---:|---|
| ① | A | Review + 본 회차 학습 흐름 |
| ② | **B** | PCA 정식 1: 분산 최대화 |
| ③ | **C** | PCA 정식 2: 재구성 오차 |
| ④ | **C2** | SVD 동치 증명 |
| ⑤ | **D** | 응용: Eigenfaces·MNIST·노이즈 제거 |
| ⑥ | E | 코딩 실습 + 마무리 + 자율 학습 박스 (PPCA) |

---

# B. PCA 정식 1: 분산 최대화

## B-1. 문제 설정

데이터 $X \in \mathbb{R}^{N \times d}$, 행 $\mathbf{x}_i^\top$. **평균을 빼서 centered** 라 가정 ($\bar{\mathbf{x}} = \mathbf{0}$).

**공분산 행렬** (Part 3 3회차):
$$S = \frac{1}{N} X^\top X \in \mathbb{R}^{d \times d}, \quad S \text{ symmetric PSD}.$$

### 1차원 투영
방향 $\mathbf{w} \in \mathbb{R}^d$ ($\Vert \mathbf{w} \Vert = 1$) 로 $\mathbf{x}_i$를 투영하면 스칼라 $z_i = \mathbf{w}^\top \mathbf{x}_i$.

투영 후 분산:
$$\mathrm{Var}(z) = \frac{1}{N} \sum_{i=1}^{N} z_i^2 = \frac{1}{N} \sum_i (\mathbf{w}^\top \mathbf{x}_i)^2 = \mathbf{w}^\top S \mathbf{w}.$$

---

## B-2. 1st PC: Lagrange 풀이

### 정의 2.1 (1st Principal Component)
$$\mathbf{w}_1 = \arg\max_{\mathbf{w}} \mathbf{w}^\top S \mathbf{w} \quad \text{s.t.} \quad \Vert \mathbf{w}\Vert^2 = 1.$$

### 정리 2.1 (1st PC = 최대 고유벡터)
Lagrangian $\mathcal{L} = \mathbf{w}^\top S \mathbf{w} - \lambda (\mathbf{w}^\top \mathbf{w} - 1)$.
$\nabla_{\mathbf{w}} \mathcal{L} = 2 S\mathbf{w} - 2\lambda \mathbf{w} = \mathbf{0}$ → **$S\mathbf{w} = \lambda \mathbf{w}$**, 즉 $\mathbf{w}$는 $S$의 고유벡터.

목적값 $\mathbf{w}^\top S \mathbf{w} = \lambda$이므로 **가장 큰 고유값 $\lambda_1$에 대응하는 고유벡터 $\mathbf{w}_1$**이 1st PC. (Part 3 4회차 종합 문제 1과 동일)

---

## B-3. 2nd, 3rd PC: deflation

### 정리 2.2 (2nd PC: 1st와 직교 + 분산 최대)
$$\mathbf{w}_2 = \arg\max_{\mathbf{w}} \mathbf{w}^\top S \mathbf{w} \quad \text{s.t.} \quad \Vert \mathbf{w}\Vert^2 = 1, \;\; \mathbf{w}^\top \mathbf{w}_1 = 0.$$

같은 Lagrange 풀이 + symmetric matrix의 고유벡터 직교성 (Part 2 6회차 Spectral theorem) 으로 **$\mathbf{w}_2 = $ 두 번째 큰 고유값 고유벡터**.

### 일반화
$k$개 PC = $S$의 top-$k$ 고유값 고유벡터 (큰 순서).

$S = Q \Lambda Q^\top$ (spectral), $\Lambda = \mathrm{diag}(\lambda_1 \geq \cdots \geq \lambda_d \geq 0)$, $Q$의 첫 $k$ 열 = $W_k = [\mathbf{w}_1, \ldots, \mathbf{w}_k]$.

---

## B-4. 분산 분해

전체 분산 = $\mathrm{tr}(S) = \sum_i \lambda_i$.

$k$개 PC로 잡은 분산 = $\sum_{i=1}^{k} \lambda_i$.

### Explained Variance Ratio
$$\mathrm{EVR}(k) = \frac{\sum_{i=1}^{k} \lambda_i}{\sum_{i=1}^{d} \lambda_i}.$$

예: top-2 PC로 80% 설명되면 EVR(2) = 0.8.

### 차원 선택의 표준
$\mathrm{EVR}(k) \geq$ 임계값 (예: 90%, 95%, 99%) 이 되는 최소 $k$를 선택.

<div class="analogy">

**직관 (EVR의 의미)**: 데이터의 총 분산은 모든 PC의 Eigenvalue $\lambda_i$의 합 $\sum_i \lambda_i$이다. 상위 $k$개 PC가 가지는 분산 비율 $\mathrm{EVR}(k) = \sum_{i=1}^k \lambda_i / \sum_{i=1}^d \lambda_i$는 본래 데이터의 변동성 중 $k$차원 부분공간에 보존되는 비율을 의미한다. EVR이 임계값 (예: 90%) 에 도달하는 최소 $k$를 차원으로 선택하는 것이 표준이다.

</div>

---

# C. PCA 정식 2: 재구성 오차 최소화

## C-1. 재구성 모델

$k$차원 축소 ($k < d$): 데이터를 $k$차원 표현으로 압축한 뒤 원래 차원으로 복원.

- **Encode** (압축): $\mathbf{z}_i = W^\top \mathbf{x}_i \in \mathbb{R}^k$ ($W \in \mathbb{R}^{d \times k}$, $W^\top W = I_k$).
- **Decode** (복원): $\hat{\mathbf{x}}_i = W \mathbf{z}_i = W W^\top \mathbf{x}_i$.

### 재구성 오차
$$\mathcal{E}(W) = \sum_{i=1}^{N} \Vert \mathbf{x}_i - W W^\top \mathbf{x}_i \Vert^2 = \Vert X - X W W^\top \Vert_F^2.$$

### 정식 2 (Reconstruction PCA)
$$W^* = \arg\min_W \mathcal{E}(W) \quad \text{s.t.} \quad W^\top W = I_k.$$

---

## C-2. 재구성 오차 = 분산 최대화 (동치)

### 보조정리
$$\Vert \mathbf{x}_i \Vert^2 = \Vert W^\top \mathbf{x}_i \Vert^2 + \Vert \mathbf{x}_i - W W^\top \mathbf{x}_i \Vert^2.$$

피타고라스: 투영 $W^\top \mathbf{x}_i$와 잔차의 직교.

합으로:
$$\sum_i \Vert \mathbf{x}_i \Vert^2 = \mathrm{tr}(W^\top X^\top X W) + \mathcal{E}(W) = N \cdot \mathrm{tr}(W^\top S W) + \mathcal{E}(W).$$

좌변은 상수. 따라서 **재구성 오차 최소화 = $\mathrm{tr}(W^\top S W)$ 최대화 = 투영 분산 최대화**.

### 결론
**두 정식 (분산 최대화 + 재구성 오차 최소화) 은 동치**이다. 같은 $W$ = top-$k$ 고유벡터 행렬이 두 문제 모두의 해.

---

# C2. SVD 동치

## C2-1. 데이터 행렬의 SVD

### 정리 2.3 (PCA = SVD)
$X = U \Sigma V^\top$ (SVD, Part 2 8회차). 이때:
- $S = X^\top X / N = V \Sigma^\top \Sigma V^\top / N = V \cdot \mathrm{diag}(\sigma_i^2 / N) \cdot V^\top$.
- $S$의 **고유벡터** = $V$의 열, **고유값** = $\sigma_i^2 / N$.

따라서 **PCA의 $W_k$ = $V$의 첫 $k$ 열** = $X$의 top-$k$ right singular vectors.

### 투영 점수 (PC score)
$Z = X W_k = U \Sigma V^\top V_k = U_k \Sigma_k$.

각 데이터 $\mathbf{x}_i$의 $k$ PC 좌표는 $\Sigma_k$ scaling을 받은 $U_k$ 행.

---

## C2-2. Eckart-Young 관점 (Part 2 9회차)

### 정리 2.4 (PCA = 최적 rank-$k$ 근사)
$X_k = U_k \Sigma_k V_k^\top = X W_k W_k^\top$는 **rank $k$ 이하의 모든 행렬 중 Frobenius norm 오차 최소**.

$$\Vert X - X_k \Vert_F^2 = \sum_{i=k+1}^{r} \sigma_i^2.$$

→ **PCA = 데이터 행렬의 최적 저계수 근사**. Part 2 9회차의 Eckart-Young 정리가 PCA의 정식 보장.

<div class="analogy">

**직관 (PCA의 최적성)**: PCA는 데이터 Matrix의 $k$-rank 근사 중 Frobenius norm 오차가 최소인 근사이다. 즉 임의의 $k$차원 부분공간으로의 정사영 중 PCA가 만들어내는 부분공간 (상위 $k$개 PC의 Span) 이 정보 손실 $\sum_{i > k} \sigma_i^2$을 최소화한다. 본 최적성은 Part 2 9회차 Eckart-Young 정리가 보장한다.

</div>

---

## C2-3. PCA 알고리즘 (3 단계 요약)

| 단계 | 연산 |
|---|---|
| **(1) Centering** | $X \leftarrow X - \bar{\mathbf{x}}^\top$ (열별 평균 빼기) |
| **(2) SVD** | $X = U \Sigma V^\top$ |
| **(3) Projection** | $Z = X V_k = U_k \Sigma_k$ (top-$k$ PC score) |

### 비용
- 정확 SVD: $O(\min(N d^2, N^2 d))$.
- 랜덤화 SVD (truncated): $O(N d k)$, 대용량 데이터의 표준.

> 본 강의는 numpy `np.linalg.svd` 또는 sklearn `PCA`로 실습. 정식 알고리즘 (Householder·Jacobi) 은 자율 학습.

---

<!-- _class: exercise -->

# 잠깐 풀어보기: PCA 동치

### 문제 1 (2D 손계산)
$X = \begin{pmatrix} 1 & 2 \\ -1 & -2 \\ 2 & 4 \\ -2 & -4 \end{pmatrix}$ (centered).

- (a) $X^\top X$와 그 고유분해. 1st PC 방향은?
- (b) 1차원 PCA 후 재구성 오차는 얼마?

### 문제 2 (개념)
$X$의 모든 행이 한 직선 위에 있으면 PCA 결과는?

---

<!-- _class: exercise -->

## 잠깐 풀어보기: 답

### 문제 1
(a) $X^\top X = \begin{pmatrix} 10 & 20 \\ 20 & 40 \end{pmatrix}$. 고유값: $\det(A - \lambda I) = (10-\lambda)(40-\lambda) - 400 = \lambda^2 - 50\lambda = \lambda(\lambda - 50)$. $\lambda_1 = 50, \lambda_2 = 0$.

$\lambda_1 = 50$ 고유벡터: $(10 - 50) w_1 + 20 w_2 = 0$ → $w_2 = 2 w_1$. 정규화: $\mathbf{w}_1 = (1, 2)^\top / \sqrt{5}$.

(b) 두 번째 고유값 0이므로 재구성 오차 = $\lambda_2 \cdot N = 0$. **데이터가 1차원에 완벽히 놓여 있다.**

### 문제 2
모든 데이터가 한 직선 → rank 1. SVD에서 $\sigma_1 > 0$, $\sigma_2 = \cdots = 0$. PCA가 정확히 그 직선 방향을 찾아내고 다른 PC는 분산 0.

> **메시지**: PCA의 EVR(1) = 100%이면 데이터가 1차원에 놓여 있다는 신호.

---

# D. 응용: Eigenfaces·MNIST·노이즈 제거

## D-1. Eigenfaces (얼굴 인식의 고전)

데이터: $N$장의 얼굴 사진을 $\mathbb{R}^{H \times W}$ Vector로 펼쳐 $X \in \mathbb{R}^{N \times HW}$.

PCA로 top-$k$ PC를 구한 것 = **eigenfaces** (얼굴의 주성분).

### 결과 직관
- 1st eigenface: 평균에서 가장 큰 변화 (보통 조명 방향).
- 2-5th: 얼굴 형태 (둥근 vs 긴), 표정.
- 더 작은 PC: 미세한 디테일.

### 얼굴 인식 절차
새 얼굴을 top-$k$ PC 공간에 투영 → $k$차원 좌표만으로 학습된 얼굴들과 거리 비교.

> 현대 얼굴 인식은 deep learning이 표준이지만, eigenfaces는 PCA의 가장 유명한 응용이자 직관적 해석이 가능한 모범 사례.

---

## D-2. MNIST 시각화

$X \in \mathbb{R}^{N \times 784}$ (1회차 MNIST). 모든 데이터를 2D PC 공간에 그리면:
- 같은 숫자 (예: 7) 끼리 군집.
- 비슷한 숫자 (1과 7, 3과 8) 가 가까이.

### 차원의 절약
$784 \to 50$ (EVR $\approx 95\%$). 50차원 PCA 후 분류기 적용이 표준 baseline.

> Deep learning 등장 전 MNIST의 표준 전처리 = PCA 50.

---

## D-3. 노이즈 제거 (Denoising)

가정: 신호는 top-$k$ PC에 집중, 노이즈는 모든 PC에 균등.

### 절차
1. PCA로 $X$의 SVD 구함.
2. Top-$k$만 유지, 나머지 0.
3. 재구성 $X_k$가 **노이즈 제거된 데이터**.

신호 대 노이즈 비율 (SNR) 이 좋아진다, 노이즈는 $\sum_{i > k} \sigma_i^2$만 잃고 신호는 $\sum_{i \leq k} \sigma_i^2$ 유지.

### 한계
- 신호와 노이즈가 **같은 방향**에 있으면 분리 불가.
- 비선형 다양체 위의 데이터엔 부적합 → 비선형 PCA·autoencoder·t-SNE·UMAP 사용.

---

## D-4. PCA의 한계

| 한계 | 설명 |
|---|---|
| **선형성** | 비선형 구조 (S 모양 다양체) 캡처 X. → t-SNE, UMAP, autoencoder. |
| **분산 = 정보 가정** | 작은 분산이지만 중요한 방향 (분류 경계) 놓침. → LDA, supervised PCA. |
| **이상치 민감** | 표본 평균·공분산이 이상치에 흔들림. → Robust PCA. |
| **해석 어려움** | PC가 원 변수의 혼합이라 의미 부여 어려움. → sparse PCA, factor analysis. |

> 본 강의는 PCA를 선형 차원축소의 표준으로 다루며, 후속 강화는 자율 학습으로 둔다.

---

## E-1. 코딩 실습: PCA 직접 구현

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits

X, y = load_digits(return_X_y=True)  # (1797, 64)
X = X - X.mean(axis=0)

# SVD
U, S, Vt = np.linalg.svd(X, full_matrices=False)
print("singular values shape:", S.shape)
print("EVR top-5:", (S[:5]**2 / (S**2).sum()))
print("EVR cumulative top-10:", (S[:10]**2 / (S**2).sum()).cumsum())

# Top-2 PCA projection
Z = U[:, :2] * S[:2]  # (N, 2)

plt.scatter(Z[:, 0], Z[:, 1], c=y, cmap='tab10', s=10)
plt.title("MNIST top-2 PCA")
plt.show()
```

같은 숫자가 군집을 이룸이 보인다. EVR 누적이 90% 도달하는 $k$를 확인.

---

## E-2. 코딩 실습: 노이즈 제거

```python
import numpy as np

# 신호 + 노이즈 만들기
N, d = 200, 50
true_signal = np.outer(np.random.randn(N), np.random.randn(d))  # rank 1
noise = 0.5 * np.random.randn(N, d)
X = true_signal + noise

U, S, Vt = np.linalg.svd(X, full_matrices=False)

# Top-1 reconstruction (denoise)
X_denoise = U[:, :1] @ np.diag(S[:1]) @ Vt[:1, :]
print("noise norm:", np.linalg.norm(noise))
print("denoise residual:", np.linalg.norm(X_denoise - true_signal))
```

`X_denoise`가 원래 신호와 가까워진다 (노이즈 평균화).

---

## E-3. 본 회차 핵심 5개

1. **PCA 정식 1 (분산 최대화)**: 투영 후 분산 $\mathbf{w}^\top S \mathbf{w}$를 최대화. Lagrange로 $S$의 최대 고유벡터.
2. **PCA 정식 2 (재구성 오차 최소화)**: $\Vert X - X W W^\top \Vert_F^2$ 최소화. 피타고라스로 정식 1과 동치.
3. **SVD 동치**: $X = U \Sigma V^\top$의 right singular vectors $V$ = PC 방향, $\sigma_i^2 / N$ = 분산. 두 도구가 같다.
4. **Explained Variance Ratio**: $\sum_{i \leq k} \sigma_i^2 / \sum_j \sigma_j^2$로 차원 선택. 90%·95%·99% 임계값 사용.
5. **응용**: Eigenfaces (얼굴 주성분), MNIST 시각화 (군집), 노이즈 제거 (top-$k$ 유지).

---

## E-4. 자기 점검 질문

- PCA 정식 1 (분산 최대화) 의 Lagrange 풀이가 고유분해로 환원되는 한 줄.
- 정식 2 (재구성 오차) 가 정식 1과 동치인 이유 (피타고라스).
- $X$의 SVD에서 PC 방향과 PC score를 어떻게 읽는가?
- EVR 누적이 90% 도달하는 $k$를 정하는 의미.
- Eigenfaces가 얼굴의 어떤 변화 (조명·표정·개인) 를 잡는지 직관적으로.

---

<!-- _class: exercise -->

# 본 회차 마무리 문제

본 회차 학습 흐름을 한 문제로 종합한다.

데이터 $X \in \mathbb{R}^{N \times 3}$ (centered) 의 SVD가 $X = U \Sigma V^\top$, $\Sigma = \mathrm{diag}(6, 3, 1)$.

- **(a)** 1st·2nd·3rd PC 방향과 각 PC의 분산 ($N = 100$ 가정).
- **(b)** EVR(1), EVR(2)를 계산. 90%, 95% 임계값에서 몇 차원으로 줄일 수 있는가?
- **(c)** $k = 2$ PCA 후 재구성 오차 $\Vert X - X_2 \Vert_F^2$의 값.
- **(d)** 새 데이터 $\mathbf{x}_{\text{new}} \in \mathbb{R}^3$를 2차원 PCA 공간에 투영한 좌표 $\mathbf{z}_{\text{new}}$의 식.

---

<!-- _class: exercise -->

## 본 회차 마무리 문제: 답

- **(a)** PC 방향 = $V$의 1·2·3 열. 분산 = $\sigma_i^2 / N$ = $36/100, 9/100, 1/100 = 0.36, 0.09, 0.01$.

- **(b)** $\sum \sigma_i^2 = 36 + 9 + 1 = 46$.
  - EVR(1) = 36/46 ≈ 78.3%. 90% 미달.
  - EVR(2) = 45/46 ≈ 97.8%. 95% 통과 → $k = 2$로 충분.

- **(c)** $\Vert X - X_2 \Vert_F^2 = \sigma_3^2 = 1$ (잘려나간 특이값 제곱 합).

- **(d)** $\mathbf{z}_{\text{new}} = V_2^\top \mathbf{x}_{\text{new}} \in \mathbb{R}^2$. ($V_2 = V$의 첫 2열)

> **핵심**: 본 회차 모든 도구 (분산·EVR·재구성·SVD) 가 SVD 한 줄에서 같이 나온다. **데이터 행렬의 SVD가 PCA의 모든 답을 한 번에 준다**.

---

<!-- _class: exercise -->

## 다음 회차 (Part 4 3회차) Review용 숙제

- **(1)** PCA 결과 첫 두 PC로 데이터가 두 군집을 형성한다면, 그 군집의 중심을 어떻게 알아낼 수 있는가? (3회차 GMM의 출발점)
- **(2)** PCA는 한 가우시안 (단일 mode) 의 주축을 찾는 도구이다. 데이터가 **여러 가우시안의 혼합**이면 어떤 모델이 필요한가? (Hint: Part 4 3회차 GMM)
- **(3)** 노이즈 제거에 사용한 top-$k$ 절단의 한계 (신호·노이즈가 같은 방향에 있을 때) 를 한 줄로.

Part 4 3회차 (GMM·EM) Review에서 다룬다.

---

## E-5. 자율 학습·부록

> **자율 학습·부록**: Probabilistic PCA (PPCA)
> PCA를 **잠재변수 확률 모델**로 재구성한 버전. $\mathbf{x} = W \mathbf{z} + \boldsymbol{\mu} + \boldsymbol{\varepsilon}$, $\mathbf{z} \sim \mathcal{N}(0, I)$, $\boldsymbol{\varepsilon} \sim \mathcal{N}(0, \sigma^2 I)$. EM 알고리즘으로 $W, \sigma^2$를 추정하면 $\sigma^2 \to 0$의 극한에서 본 회차 PCA와 일치. Bayesian PCA·factor analysis·VAE로 자연스럽게 일반화. MML §10.7 참조.

본 회차에서는 다루지 않고 흥미 있는 학생의 자율 학습으로 둔다. 본 회차에서는 분산 최대화·SVD 동치만 본문으로 한다.

---

## E-6. 다음 회차 (Part 4 3회차) 예고

**주제**: Gaussian Mixture Models · EM Algorithm

**연결**: PCA는 한 가우시안의 주축을 찾는 도구이다. 데이터가 **여러 가우시안의 혼합** (예: MNIST의 10개 숫자 군집) 이면 GMM이 적합하다. EM 알고리즘은 GMM 학습의 표준이며 본 회차의 PCA 도구가 mode 안에서 재등장한다.

**사전 reading**:
- MML Ch 11 (Density Estimation with Gaussian Mixture Models)

---

<!-- _class: lead -->

# Q & A

본 회차 학습 흐름:
**분산 최대화 = 재구성 오차 최소화 = $X$의 SVD → PC score → Eigenfaces·MNIST**

핵심 한 줄: **PCA는 데이터 행렬의 SVD 한 줄로 끝난다.** 두 정식 (분산·재구성) 모두 같은 답이고, Eckart-Young이 최적성을 보장한다.

다음 회차의 출발 문제:
> 데이터가 한 가우시안이 아니라 **여러 가우시안의 혼합**일 때, 그 mode를 어떻게 자동으로 분리하는가?

`HANDOUT`: 본 PDF + Part 4 3회차 사전 reading (MML Ch 11)
