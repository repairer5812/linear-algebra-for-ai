---
marp: true
theme: default
paginate: true
header: '인공지능 전공자를 위한 선형대수학'
footer: 'Part 4 8회차 — Case Study 발표 · Part 4 (ML 및 AI의 수학적 응용) 종합 문제 Review'
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
  .appendix { background: #EEF2FF; border-left: 4px solid #6366F1; padding: 10px 16px; margin: 12px 0;
              font-size: 19px; color: #3730A3; border-radius: 0 8px 8px 0; }
  .appendix strong { color: #4338CA; }
---

<!-- _class: lead -->
<!-- _paginate: false -->

# Part 4 · 8회차

## Case Study 발표 · Part 4 (ML 및 AI의 수학적 응용) 종합 문제 Review

자체 교안 · Part 1·2·3·4 종합 · Part 4 (ML 및 AI의 수학적 응용)
**Part 4 8회차 (마지막 회차)** — Part 1·2·3·4의 도구를 모두 동원해 학생 각자의 AI 모델 부분을 LA 객체로 환원합니다.

> 본 회차는 본 강좌 전체의 종합 활동이다. 사전 공개된 종합 문제를 본인이 풀어 온 풀이를 함께 Review하고, Case Study 발표로 마무리한다.

---

<!-- _class: exercise -->

# Review: 7회차 마무리 숙제

지난 회차 (Attention 분해) 숙제 핵심 답:

> (a) softmax 적용 결과 $P$. (b) $PV$ 계산. (c) Linear combination 해석. (d) Case Study 후보 1-2줄.

### 답 정리

- **(a)** 7회차 (c)의 행렬 $\begin{pmatrix} 2.83 & 0 & 1.41 \\ 0 & 2.83 & 1.41 \\ 1.41 & 1.41 & 1.41 \end{pmatrix}$의 row-wise softmax (예시):
  $$P \approx \begin{pmatrix} 0.76 & 0.04 & 0.20 \\ 0.04 & 0.76 & 0.20 \\ 0.33 & 0.33 & 0.34 \end{pmatrix}.$$
- **(b)** $V = Q$. $PV$의 각 행 = $V$의 행 Vector들의 가중 합.
- **(c)** 정리 7.3에 의해 **Token $i$의 출력은 모든 Token의 value Vector의 Linear combination**. 가중치는 query-key 유사도 softmax.
- **(d)** 학생별 선택 (ResNet 1×1 Conv·ViT Attention head·LoRA adapter·RoPE 등). 본 회차에서 발표.

### 핵심 관찰

본 회차는 7개 회차 동안 쌓은 도구를 **학생 각자가 선택한 한 모델 조각**에 적용한다. 발표·종합 문제로 본 강좌 전체를 닫는다.

---

## 본 회차 핵심 질문

> ### 본 강좌 도구로 임의의 AI 모델 한 부분을 LA 객체로 환원할 수 있습니까?

이 한 질문에 답하려면 세 단계가 필요합니다.

1. 각 학생이 선택한 모델 부분의 **Case Study 발표** (5분 × n명)
2. **Part 4 통합 문제 풀이** (Regression·PCA·GMM·SVM·CNN·Attention 한 문제)
3. **Part 1·2·3·4 핵심 통합 풀이** (본 강좌 전체 학습 흐름 한 자리)

본 회차는 **본 강좌 전체의 마지막 회차**다.

---

## 학습 목표

이번 회차가 끝나면 학생은 다음을 답할 수 있어야 합니다.

1. 임의 AI 모델의 한 부분을 **본 강좌 도구로 분해**할 수 있습니다.
2. **Linear Regression·PCA·GMM·SVM·Kernel·CNN·Attention** 7개 Part 4 도구의 공통 객체와 차이를 답할 수 있습니다.
3. **Part 1 (Vector·Matrix·부분공간·정사영) → Part 3 (Eigenvalue·SVD·미분·확률·최적화) → Part 4 (응용)**의 흐름을 한 자리로 설명할 수 있습니다.
4. **Case Study 발표**를 통해 동료의 분해를 듣고 자신의 분해와 비교할 수 있습니다.
5. Part 4 (ML 및 AI의 수학적 응용) 종합 문제·Part 1·2·3·4 핵심 통합 문제를 풀 수 있습니다.

---

## 본 회차 학습 흐름

| 질문 | 답 (본 회차의 답) | 도구 |
|---|---|---|
| 임의 모델 한 부분 환원? | **Case Study 발표** | 학생 각자 |
| Part 4 도구 7개 통합? | **사전 공개된 종합 문제, 함께 Review** | Part 4 1-7회차 |
| Part 1·2·3·4 전체 통합? | **핵심 통합 풀이** | 본 강좌 전체 |

---

## 수업 흐름

| 순서 | 블록 | 내용 |
|:---:|:---:|---|
| ① | A | **오프닝**: Case Study 발표 안내 + 7회차 Review |
| ② | **B** | **Case Study 발표** (학생 각자 5분 × $n$명), 동료 질문 |
| ③ | **C** | **사전 공개된 Part 4 (ML 및 AI의 수학적 응용) 종합 문제, 함께 Review** (Regression → PCA → GMM → SVM → CNN → Attention) |
| ④ | D | **Part 1·2·3·4 핵심 통합 풀이**·본 강좌 전체 회고 |
| ⑤ | E | **마무리·후속 학습 안내** |

---

# B. Case Study 발표

## B-1. Case Study 형식

### 목적
본 강좌 7개 회차 (Part 4) 동안 쌓은 도구로 **임의의 AI 모델 한 부분**을 LA 객체로 환원해 본다. 본 강좌 전체를 본인 손으로 정리하는 학습 활동이다.

### 형식
- **보고서 1쪽** (사전 제출)
- **5분 발표** (본 회차 B 섹션)
- 동료 1-2 질문, 강사 코멘트

### 발표 구성 (5분)
| 시간 | 내용 |
|:---:|---|
| 1분 | 선택 모델·부분 소개 (스크린샷 또는 식 1줄) |
| 2분 | 본 강좌 어느 회차 어느 객체로 환원되는가 |
| 1분 | 환원의 의미 (파라미터 수·연산량·해석성 등) |
| 1분 | 자신이 가장 인상 깊었던 발견, 질문 |

---

## B-2. Case Study 후보 예시

본 강좌 회차별 추천 후보:

| 모델·부분 | 본 강좌 환원 | 적용 회차 |
|---|---|---|
| **ResNet의 1×1 Conv** | 채널 행렬곱 | Part 4 6회차 |
| **ViT의 Attention head** | $\mathrm{softmax}(QK^\top/\sqrt{d_k})V$ 분해 | Part 4 7회차 |
| **LoRA adapter** | 저계수 분해 $W + AB$ ($A \in \mathbb{R}^{d \times r}, B \in \mathbb{R}^{r \times d}$) | Part 2 9회차 (저계수 근사) |
| **RoPE positional encoding** | 회전 행렬 적용 | Part 2 3회차 (Rotation) |
| **LayerNorm** | 행별 표준화 + scale | Part 1 2회차 (Norm) |
| **GELU/ReLU 활성화** | element-wise 비선형 | (Part 4 외 보조) |
| **Word2Vec Skip-gram** | Inner product + softmax | Part 1 2회차 (Inner product) |
| **PCA whitening** | SVD + scaling | Part 2 8·9회차 |
| **Diffusion U-Net 한 블록** | Conv + Attention 조합 | Part 4 6·7회차 |
| **CLIP의 contrastive loss** | Inner product 행렬 + softmax | Part 1 2회차 + 7회차 |

---

## B-3. 발표는 자기 점검 활동

> 발표는 본 강좌 전체를 자신의 손으로 정리하는 학습 활동이다.

### 강사가 보는 것
- 학생이 본 강좌 도구를 **자기 언어로** 설명할 수 있는가
- 자신이 흥미를 느낀 모델을 **수학적으로 분해**할 수 있는가
- 동료의 분해에서 **새로운 관점**을 듣고 자신 것과 비교할 수 있는가

### 강사가 보지 않는 것
- 발표 화려함·디자인
- 최신 모델·복잡한 모델인지 여부
- 환원의 "정답" 여부 (모델은 다양하게 환원 가능)

---

# C. Part 4 (ML 및 AI의 수학적 응용) 종합 문제 Review

> 본 회차 C 섹션은 Part 4 7개 도구를 모두 동원하는 통합 문제이다.

## C-1. 종합 문제 1: Linear Regression → PCA

데이터 행렬 $X \in \mathbb{R}^{n \times d}$ ($n$ samples · $d$ features), 타겟 $\mathbf{y} \in \mathbb{R}^n$.

### 문제
- (a) Linear regression 정규방정식 $\hat{\boldsymbol\beta} = (X^\top X)^{-1} X^\top \mathbf{y}$를 적고 그 정당화 (정사영)를 한 줄로 설명.
- (b) $X$의 SVD $X = U\Sigma V^\top$로 (a)를 다시 적기.
- (c) PCA의 첫 주성분 방향이 $V$의 어느 열인지 답.
- (d) Ridge regression $\hat{\boldsymbol\beta}_\lambda = (X^\top X + \lambda I)^{-1} X^\top \mathbf{y}$가 SVD 형태로 어떻게 정리되는지 한 줄.

---

## C-2. 종합 문제 1 답

- **(a)** $\hat{\boldsymbol\beta}$는 $\mathbf{y}$를 $\mathrm{col}(X)$로 정사영한 결과의 좌표. **정규방정식 = 정사영 조건** $X^\top(\mathbf{y} - X\boldsymbol\beta) = 0$. (Part 2 2회차)
- **(b)** $X = U\Sigma V^\top$ 대입. $X^\top X = V\Sigma^2 V^\top$, $(X^\top X)^{-1} = V\Sigma^{-2}V^\top$. $X^\top \mathbf{y} = V\Sigma U^\top \mathbf{y}$.
  $$\hat{\boldsymbol\beta} = V\Sigma^{-1}U^\top \mathbf{y}.$$
- **(c)** PCA 첫 주성분 = **$V$의 첫 열** $\mathbf{v}_1$. 가장 큰 특이값 $\sigma_1$에 대응. (Part 2 8·9회차)
- **(d)** Ridge: $\hat{\boldsymbol\beta}_\lambda = V \mathrm{diag}\!\left(\frac{\sigma_i}{\sigma_i^2 + \lambda}\right) U^\top \mathbf{y}$. 작은 $\sigma_i$에서 분모 $\lambda$가 안정화 역할.

---

## C-3. 종합 문제 2: SVM Dual → Kernel → CNN 비교

### 문제
- (a) Soft margin SVM Dual의 정식을 적으시오 ($\alpha_i$, $K$ 사용).
- (b) RBF Kernel $K(\mathbf{x}, \mathbf{x}') = \exp(-\gamma\|\mathbf{x} - \mathbf{x}'\|^2)$의 $\gamma$가 클 때와 작을 때 결정 경계 모양 차이를 한 줄로.
- (c) Kernel SVM과 CNN의 공통점·차이점을 한 줄씩.
- (d) CNN의 1D Conv를 Toeplitz $T_k$로 환원할 때 입력 길이 $n$, 커널 길이 $p$, 출력 길이 $m$의 관계 (no padding).

---

## C-4. 종합 문제 2 답

- **(a)** $\max_{\alpha} \sum \alpha_i - \tfrac{1}{2}\sum_{i,j}\alpha_i\alpha_j y_iy_j K(\mathbf{x}_i, \mathbf{x}_j)$ s.t. $\sum \alpha_i y_i = 0, 0 \le \alpha_i \le C$.
- **(b)** $\gamma$ 클수록 좁은 봉우리 (점 가까이만 영향) → **결정 경계 들쭉날쭉, 과적합 위험**. $\gamma$ 작으면 **부드러운 경계, 과소적합 위험**.
- **(c)** 공통: **특징 공간 매핑** 사용. 차이: Kernel SVM은 $\phi$를 만들지 않고 $K$로 직접, CNN은 $\phi$를 **학습으로 만든다** (Conv 필터).
- **(d)** $m = n - p + 1$. Toeplitz $T_k \in \mathbb{R}^{m \times n}$.

---

## C-5. 종합 문제 3: Attention의 모든 객체 차원 추적

$n = 8$ Token, $d = 64$ embedding, $h = 4$ head, head별 $d_k = d_v = 16$.

### 문제
- (a) $X, W^Q, W^K, W^V$ (head 1개 기준) shape.
- (b) head 1개의 $Q, K, V$ shape.
- (c) head 1개의 $QK^\top$, $P$, $PV$ shape.
- (d) $h$개 head concat 결과 + $W^O$ 적용 결과 shape.
- (e) 전체 Multi-head attention의 학습 가능한 파라미터 수 ($h$개 $W^Q + W^K + W^V$ + $W^O$).

---

## C-6. 종합 문제 3 답

- (a) $X \in \mathbb{R}^{8 \times 64}$, $W^Q, W^K, W^V \in \mathbb{R}^{64 \times 16}$.
- (b) $Q, K, V \in \mathbb{R}^{8 \times 16}$.
- (c) $QK^\top \in \mathbb{R}^{8 \times 8}$, $P \in \mathbb{R}^{8 \times 8}$, $PV \in \mathbb{R}^{8 \times 16}$.
- (d) Concat $\in \mathbb{R}^{8 \times 64}$ ($h \cdot d_v = 4 \cdot 16 = 64$), $W^O \in \mathbb{R}^{64 \times 64}$, 결과 $\in \mathbb{R}^{8 \times 64}$. **입력과 같은 shape**.
- (e) head별 $3 \cdot (64 \cdot 16) = 3072$, $h$개: $4 \cdot 3072 = 12{,}288$, $W^O$: $64 \cdot 64 = 4096$, **총 $16{,}384$ 파라미터**.

→ 큰 수 같지만 한 Transformer 층의 전체 파라미터 중 일부. Embedding과 FFN이 더 큰 비중.

---

# D. Part 1·2·3·4 핵심 통합 풀이

## D-1. 본 강좌 전체 학습 흐름 한 자리

| Part | 핵심 객체 | Part 4에서 어디 등장 |
|---|---|---|
| Part 1 1회차 | Vector·Linear combination | Attention $PV$ (7회차) |
| Part 1 2회차 | Inner product | $QK^\top$ (7회차)·SVM 거리 (4회차) |
| Part 1 3회차 | 행렬·벡터 곱 | Conv·Attention 전체 (6·7회차) |
| Part 1 7-8회차 | 4 부분공간·차원정리 | Regression $X$의 column space (1회차) |
| Part 2 1·2회차 | 정사영·LS | Regression 정규방정식 (1회차) |
| Part 2 8·9회차 | SVD·저계수 근사 | PCA (2회차)·LoRA |
| Part 3 3회차 | 확률·MLE·KL | Regression MLE (1회차)·GMM (3회차) |
| Part 3 4회차 | 최적화·KKT | SVM Dual (4회차) |

→ **Part 4는 Part 1·2·3 도구의 응용 총집합**. 본 강좌의 메시지가 이 표에 응축된다.

---

## D-2. 본 강좌 메시지 한 줄

> **모든 AI 모델의 핵심 층은 LA 객체로 분해된다.**

- Conv = Toeplitz 행렬곱 (6회차)
- 1×1 Conv = 채널 행렬곱 (6회차)
- Attention = 행렬곱 4개 + softmax (7회차)
- Embedding = one-hot × 행렬 (7회차)
- Regression = 정사영 (1회차)
- PCA = SVD (2회차)
- SVM = Convex QP + KKT (4회차)
- Kernel = $\phi$ Inner product (5회차)

→ **Part 1의 객체 (Vector·행렬·Inner product·정사영)와 Part 2의 도구 (SVD·미분·확률·최적화)가 본 회차까지 모든 모델에 등장**한다.

---

## D-3. 후속 학습 안내 (본 강좌 이후)

### 직접 후속 (수학 깊이)
- **Convex Optimization** (Boyd·Vandenberghe, 무료 공개): SVM Dual·KKT의 정식 후속.
- **Geometric Deep Learning** (Bronstein et al. proto-book): Equivariance·GNN의 정식 후속.
- **Information Geometry** (Amari): 확률 다양체와 자연 그래디언트.

### AI 응용 (모델 깊이)
- **Deep Learning** (Goodfellow et al., 무료 공개): CNN·RNN·Attention 정식 교과서.
- **Probabilistic Machine Learning** (Murphy): GMM·EM·Bayesian의 정식 후속.
- **PRML** (Bishop): 본 강좌 Kernel·SVM·GMM의 정식 후속.

### 자율 학습 박스 후속 (본 강좌 본문 외)
- NTK · 2D 블록 Toeplitz · Attention Jacobian · Multi-head reshape · Equivariance commute 정식 (각 회차 부록 참조).

---

<!-- _class: exercise -->

# 본 회차 마무리 문제 (즉석 풀이)

본 강좌 전체를 종합하는 한 문제입니다.

학생 본인이 가장 관심 있는 AI 모델 (Transformer·CNN·Diffusion·GAN·VAE·LoRA·Mamba 등) 한 개를 선택하여 다음 4가지를 한 자리에 적으시오.

- **(a)** 그 모델의 **가장 작은 한 부분** (한 행렬·한 연산)을 1줄로 적기.
- **(b)** 그 부분이 본 강좌 **어느 회차의 어느 객체**로 환원되는가.
- **(c)** 환원의 의미 (왜 그 관점이 유용한가) 1-2줄.
- **(d)** 본인의 **다음 학습 단계** (어떤 자료·어떤 주제) 1줄.

---

<!-- _class: exercise -->

## 본 회차 마무리 문제: 예시 답 (강사 시연)

학생들이 자유롭게 적을 수 있도록 예시 한 개만 제시한다.

### 선택: GPT의 한 Attention head
- **(a)** GPT 한 layer의 한 head: $\mathrm{Attn}(XW^Q, XW^K, XW^V)$ with causal mask.
- **(b)** Part 4 7회차 정의 7.3 (Scaled Dot-Product Attention) + Part 1 1·2·3회차 (Vector·Inner product·행렬 곱).
- **(c)** GPT의 token 간 정보 전달이 **Linear combination + 유사도 가중치**라는 단순한 두 객체임을 드러낸다. 모델의 신비를 LA 언어로 분해 가능.
- **(d)** Speculative decoding·KV cache·LongRoPE 등 GPT 추론 최적화 기법으로 학습 확장.

→ 학생 각자 자기 관심에 맞는 답을 적는다. 정답 없음.

---

## E-1. 본 강좌 전체 회고

### 본 강좌가 다룬 것
- Part 1 (8회차): Vector·행렬·부분공간 일부
- Part 2 (9회차): 정사영·QR·Determinant·Eigenvalue·SVD·저계수 근사
- Part 3 (4회차): 확률·최적화·KKT
- Part 4 (8회차): Regression·PCA·GMM·SVM·Kernel·CNN·Attention + Case Study

### 본 강좌의 메시지
1. **LA는 AI의 언어**: 모든 모델 핵심 층이 LA 객체로 분해됨.
2. **정의 → 정리 → 분해 → 응용**의 4단 사이클 (수학책 흐름).
3. **Part 1의 객체가 Part 4까지 끝없이 재등장**: Inner product·Linear combination·행렬 곱·정사영.

### 후속 학습 (D-3)
본 강좌가 다루지 못한 자율 학습 박스 (PPCA·Bayesian LR·NTK·2D Toeplitz·Attention Jacobian·Equivariance commute 정식 등)는 각 회차 부록 박스에서 자료를 안내했다.

---

## E-2. 다음 단계: 본 강좌 후 학생이 할 수 있는 것

### 즉시 가능한 것
- 임의 신경망의 forward pass를 행렬 곱 사슬로 분해
- PyTorch 모듈의 `.weight` shape만 보고 무슨 연산인지 식별
- 새 모델 논문을 LA 관점으로 읽기

### 1-3개월 후 가능한 것
- 모델 파라미터 수·연산량을 손으로 추산
- LoRA·PEFT 등 파라미터 효율 기법을 저계수 분해 관점으로 직접 이해
- 새 Attention 변형 논문 (Linformer·Performer·FlashAttention) 핵심 비교

### 6-12개월 후 가능한 것
- 자율 학습 박스의 정식 항목 (NTK·Backward Jacobian·Equivariance commute)으로 진입
- 본인 도메인 (음성·비전·텍스트·바이오)의 모델을 분해·설계

---

<!-- _class: exercise -->

## 강의 종료 후 자율 문제 (선택)

본 강좌가 끝난 후에도 손을 떼지 않을 학생을 위한 자율 문제입니다.

- (1) Diffusion 모델의 한 noise prediction 네트워크 ($\epsilon_\theta(\mathbf{x}_t, t)$)를 본 강좌 도구로 분해해 보시오.
- (2) Mamba·State Space Model의 핵심 연산을 Toeplitz 행렬 관점에서 해석해 보시오.
- (3) RoPE (Rotary Positional Embedding)가 어떻게 회전 행렬로 정식화되는지 적으시오.
- (4) Speculative Decoding의 기댓값 분석에 Part 3 확률 도구가 어떻게 들어가는지 1쪽 보고서.
- (5) FlashAttention의 IO-efficient algorithm이 동일한 수학적 객체를 다른 메모리 패턴으로 계산함을 확인하시오.

→ 이 자율 문제는 본 강좌 이후의 자기 학습 trigger다. 제출 의무 없음.

---

## E-3. 본 강좌 전체 핵심 5개

1. **모든 신경망 핵심 층은 LA 객체로 분해**된다 (Conv = Toeplitz, Attention = 4 행렬곱 + softmax, Embedding = one-hot × 행렬, Regression = 정사영, PCA = SVD, SVM = Convex QP + KKT).
2. **Part 1의 객체 (Vector·Inner product·행렬 곱·정사영)**가 본 강좌 끝까지 모든 모델의 한가운데에 있다.
3. **정의 → 정리 → 분해 → 응용** 4단 사이클 (§7 수학책 흐름)이 본 강좌 모든 회차의 골격이다.
4. **Case Study는 자기 점검 학습 활동**이다. 학생 각자가 본 강좌 도구를 자기 언어로 정리한다.
5. **본 강좌 이후의 후속 학습**은 자율 학습 박스 (각 회차 부록)와 D-3의 추천 자료로 이어진다.

---

## E-4. 자기 점검 질문 (본 강좌 전체)

- Vector → Inner product → 행렬 곱 → 부분공간 → 정사영의 흐름을 한 자리에 적을 수 있는가?
- SVD가 Regression·PCA·LoRA 세 곳에 어떻게 등장하는지 설명할 수 있는가?
- Convex 최적화·KKT가 SVM·Lagrange duality에 어떻게 적용되는지 적을 수 있는가?
- Conv·1×1 Conv·Attention·Embedding의 행렬 곱 환원을 한 자리에 적을 수 있는가?
- 본인이 가장 관심 있는 AI 모델 한 부분을 본 강좌 도구로 분해할 수 있는가?

---

## E-5. 본 강좌의 메시지 한 줄 (다시)

> **선형대수는 AI의 언어이다.**
> **모든 모델의 핵심 층은 행렬 곱 + element-wise 함수로 분해되며, Part 1의 객체 (Vector·Inner product·행렬 곱·정사영)가 모든 모델의 한가운데에 있다.**

이 한 줄을 본 강좌 후에도 손에 쥐기를 바란다.

---

# 부록: 본 강좌 전체 회차 표

| Part | 회차 | 핵심 |
|:---:|:---:|---|
| 1 | 1 | Vector·Linear combination |
| 1 | 2 | Norm·Inner product·Cosine sim |
| 1 | 3 | 행렬·벡터 곱 (Row·Column picture) |
| 1 | 4 | Gauss·RREF |
| 1 | 5 | 행렬곱·역·LU |
| 1 | 6 | Vector space·Subspace·Null space |
| 1 | 7 | Column space·Rank·4 부분공간 |
| 1 | 8 | Basis·Dim·차원정리 |
| 2 | 1 | Orthogonality·Projection |
| 2 | 2 | Least squares·정규방정식 |
| 2 | 3 | Orthonormal·Gram-Schmidt·QR |
| 2 | 4 | Determinant |
| 2 | 5 | Eigenvalue·Eigenvector |
| 2 | 6 | Diagonalization·Spectral |
| 2 | 7 | Positive definite·Cholesky |
| 2 | 8 | SVD 정식 |
| 2 | 9 | Eckart-Young·Matrix Approx |
| 3 | 1 | Vector Calculus 1 |
| 3 | 2 | Vector Calculus 2 |
| 3 | 3 | Probability·MLE·KL |
| 3 | 4 | Optimization·KKT + Part 3 종합 |
| 4 | 1 | Linear Regression |
| 4 | 2 | PCA·SVD 동치 |
| 4 | 3 | GMM·EM |
| 4 | 4 | SVM Hard/Soft·Dual |
| 4 | 5 | Kernel SVM·RBF·Polynomial |
| 4 | 6 | CNN·Toeplitz·1×1=행렬곱 |
| 4 | 7 | Attention 분해·Multi-head·Equivariance 직관 |
| 4 | 8 | Case Study + 종합 |

→ 29회차 × 2시간 = **58시간**의 본 강좌가 본 회차에서 닫힌다.

---

<!-- _class: lead -->

# 본 강좌 종료

> **선형대수는 AI의 언어이다.**

본 강좌의 모든 회차에서 본 객체들이 본 회차 마지막 표에 모였다.
이제 각자의 관심 모델로 떠나, 본 강좌 도구로 그 모델의 한가운데에 있는 LA 객체를 분해하기 바란다.

다음 학습 단계의 출발 문제:
> 본인이 분해해 본 모델의 그 다음 부분은 어떤 LA 객체일까?

`HANDOUT`: 본 PDF, Case Study 보고서 (학생 각자), 본 강좌 전체 노트
