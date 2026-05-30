---
marp: true
theme: default
paginate: true
header: '인공지능 전공자를 위한 선형대수학'
footer: 'Part 3 7회차 — Attention 분해 · Embedding=행렬곱 · Multi-head · Equivariance 직관'
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

# Part 3 · 7회차

## Attention 분해 · Embedding = 행렬곱 · Multi-head 직관 · Equivariance 직관

자체 교안 (본 강좌 시그니처) · MML 부록 보강
**Part 3 7회차** — Transformer 핵심을 행렬 곱 3-4개의 조합으로 환원합니다.

> "Attention은 LA의 어떤 객체인가" 한 질문에 본 회차가 답한다. **세 행렬 곱과 한 softmax**가 답이다.

---

<!-- _class: exercise -->

# Review: 6회차 마무리 숙제

지난 회차 (CNN·Toeplitz) 숙제 핵심 답:

> (a) $\mathbf{x} \star \mathbf{k} = (5, 3, 5)^\top$, $T_k \mathbf{x}$ 일치 검증.
> (c) Self-attention의 $Q, K, V$ 직관 추측.
> (d) Embedding layer가 행렬·벡터 곱과 동치임을 한 줄로.

### 답 정리

- **(a)** $\mathbf{k}=(1,1)$로 인접 두 값의 합. $\mathbf{x}=(4,1,2,3)$이면 $(5,3,5)^\top$. Toeplitz $T_k = \begin{pmatrix}1&1&0&0\\0&1&1&0\\0&0&1&1\end{pmatrix}$, $T_k \mathbf{x}=(5,3,5)^\top$ ✓.
- **(b)** 1×1 Conv는 위치 차원에 슬라이딩이 없어 각 위치를 독립으로 처리. 모든 위치에서 같은 $\mathbf{W} \in \mathbb{R}^{C_\text{out}\times C_\text{in}}$ 행렬곱. fully connected와 본질적으로 같다.
- **(c)** $Q, K, V$는 **모두 행렬**일 것이라는 직관. (정답이며 본 회차 B 섹션에서 정식화)
- **(d)** Embedding은 정수 ID $i$를 받아 $i$번째 행 (또는 열) Vector를 반환. 이는 **one-hot Vector $\mathbf{e}_i$와 Embedding 행렬 $E$의 곱** $E^\top \mathbf{e}_i$와 동치.

### 핵심 관찰

지난 회차 CNN을 행렬 곱으로 환원했듯, 본 회차는 Attention을 행렬 곱 3-4개로 분해한다. **모든 신경망 핵심 층은 행렬 곱**이라는 본 강좌의 메시지가 본 회차에서 완성된다.

---

## 본 회차 핵심 질문

> ### Attention 수식 $\mathrm{softmax}(QK^\top/\sqrt{d_k})V$를 행렬 곱 몇 개로 분해할 수 있습니까?

이 한 질문에 답하려면 네 단계가 필요합니다.

1. **Embedding이 행렬 곱**임을 정식화
2. **$Q, K, V$**가 입력 Embedding에 세 개의 행렬을 곱해 생성됨
3. **$QK^\top$·softmax·$V$ 곱**의 차원·역할 정식 해석
4. **Multi-head 직관**·**Equivariance 직관 한 슬라이드 흡수**

본 회차의 모든 결과는 이 순서를 따른다. 본 회차는 **본 강좌의 시그니처 자체 교안**이다.

---

## 학습 목표

이번 회차가 끝나면 학생은 다음을 답할 수 있어야 합니다.

1. **Embedding** 연산이 one-hot Vector와 Embedding 행렬의 곱과 동치임을 설명할 수 있습니다.
2. **$Q, K, V$**가 각각 입력 $X \in \mathbb{R}^{n \times d}$에 $W^Q, W^K, W^V$를 곱해 생성됨을 적을 수 있습니다.
3. **$QK^\top$**의 각 성분이 Token 간 Inner product (유사도)이고 softmax로 합 1의 가중치가 됨을 설명할 수 있습니다.
4. **$\mathrm{softmax}(QK^\top/\sqrt{d_k})V$**의 출력 차원·각 성분 의미를 답할 수 있습니다.
5. **Multi-head attention** $h$개 head 병렬의 직관과 **Translation·Permutation Equivariance** 직관을 한 슬라이드 수준에서 설명할 수 있습니다.

---

## 본 회차 개념 사슬

| 질문 | 답 (본 회차의 답) | 도구 |
|---|---|---|
| Embedding은? | **one-hot과 행렬의 곱** | $E^\top \mathbf{e}_i$ |
| $Q, K, V$는? | **세 행렬곱** | $X W^Q, X W^K, X W^V$ |
| $QK^\top$은? | **Token 유사도 행렬** | Inner product $n \times n$ |
| softmax는? | **합 1의 가중치 행렬** | 각 행 합 1 |
| $\mathrm{softmax}(\cdot)V$는? | **가중 Vector 합** | 행렬·행렬 곱 |
| Multi-head는? | $h$개 head 병렬 | reshape (디테일 부록) |
| Equivariance는? | **Conv·GNN 직관** | (정식·Kronecker 부록) |

→ 본 회차는 **Part 1 3회차 행렬·행렬 곱·Part 1 2회차 Inner product·Part 1 1회차 one-hot·Linear combination**의 종합 응용이다.

---

## 수업 흐름

| 순서 | 블록 | 내용 |
|:---:|:---:|---|
| ① | A | **오프닝**: 핵심 질문 + 6회차 Review |
| ② | **B** | **Embedding = 행렬곱** + $Q, K, V$ 정식 정의 |
| ③ | **C** | **$\mathrm{softmax}(QK^\top/\sqrt{d_k})V$ 분해** + Multi-head 직관 |
| ④ | D | **AI 연결** (Transformer 한 층의 완전 분해) |
| ⑤ | E | **Equivariance 직관 한 슬라이드·마무리·다음 회차 (Case Study)·자율 학습 박스** |

---

# B. Embedding · Q, K, V: 정식 정의

## B-1. Embedding: one-hot × 행렬

### 동기
자연어 처리에서 단어는 정수 ID (예: "apple" → 42)로 표현된다. 신경망은 Vector를 입력받는다. **정수를 Vector로 바꾸는 함수**가 Embedding이다.

### 정의 7.1 (Embedding)
어휘 크기 $V$, 임베딩 차원 $d$의 **Embedding 행렬** $E \in \mathbb{R}^{V \times d}$에 대해, 정수 ID $i \in \{0, \ldots, V-1\}$의 임베딩은
$$\mathrm{emb}(i) = E_{i, :} = E^\top \mathbf{e}_i \in \mathbb{R}^d.$$

여기서 $\mathbf{e}_i \in \mathbb{R}^V$는 $i$번째 성분만 1인 표준 단위 Vector.

### 정리 7.1 (Embedding = 행렬·벡터 곱)
Embedding 연산은 **one-hot Vector와 Embedding 행렬의 곱**과 동치다.

→ Part 1 1회차에서 본 "임의 Vector는 표준 단위 Vector의 Linear combination"의 직접 응용. one-hot은 그 중 한 성분만 1인 특수 경우.

---

## B-2. 입력 표현: Token 행렬

문장 한 개를 $n$개 Token으로 나누고 각 Token을 $d$차원 Embedding으로 표현하면 입력은 행렬:
$$X = \begin{pmatrix} \mathbf{x}_1^\top \\ \mathbf{x}_2^\top \\ \vdots \\ \mathbf{x}_n^\top \end{pmatrix} \in \mathbb{R}^{n \times d}.$$

- 각 행 $\mathbf{x}_i^\top$이 한 Token의 Embedding.
- $n$ = sequence length, $d$ = embedding dim.

### 본 회차 표기 관례
- $X \in \mathbb{R}^{n \times d}$: 입력 Token 행렬.
- $W^Q, W^K \in \mathbb{R}^{d \times d_k}$, $W^V \in \mathbb{R}^{d \times d_v}$: 학습 가능 행렬.
- $d_k$ = query·key 차원, $d_v$ = value 차원. (보통 $d_v = d_k$.)

---

## B-3. Q, K, V: 정식 정의

### 정의 7.2 (Query·Key·Value 행렬)
입력 $X \in \mathbb{R}^{n \times d}$로부터
$$Q = X W^Q \in \mathbb{R}^{n \times d_k}, \quad K = X W^K \in \mathbb{R}^{n \times d_k}, \quad V = X W^V \in \mathbb{R}^{n \times d_v}.$$

세 개의 **독립적 행렬 곱**으로 생성. 학습 대상은 $W^Q, W^K, W^V$ 세 행렬.

### 각 행의 의미
- $Q$의 $i$번째 행 $\mathbf{q}_i^\top$: Token $i$가 **"무엇을 찾는가"** ($i$의 질의).
- $K$의 $j$번째 행 $\mathbf{k}_j^\top$: Token $j$가 **"무엇을 제공하는가"** ($j$의 키).
- $V$의 $j$번째 행 $\mathbf{v}_j^\top$: Token $j$가 **"실제로 전달할 내용"** ($j$의 값).

<div class="analogy">

**직관 (도서관 검색 비유)**: $Q$는 **검색어**, $K$는 **책 제목·태그**, $V$는 **책 내용**입니다. 검색어 $\mathbf{q}_i$와 모든 책 제목 $\mathbf{k}_j$의 유사도를 잰 뒤, 유사도 높은 책의 **내용 $\mathbf{v}_j$를 가중 합**하여 Token $i$의 답을 만듭니다.

</div>

---

# C. Attention 분해 · Multi-head

## C-1. Attention 정식 정의

### 정의 7.3 (Scaled Dot-Product Attention)
$$\boxed{\;\mathrm{Attn}(Q, K, V) = \mathrm{softmax}\!\left(\frac{Q K^\top}{\sqrt{d_k}}\right) V \in \mathbb{R}^{n \times d_v}.\;}$$

(softmax는 행별 정규화. 각 행이 합 1.)

### 본 회차에서 분해할 4단계
1. **$QK^\top$**: $n \times n$ 행렬, 모든 Token 쌍의 Inner product.
2. **$/\sqrt{d_k}$**: scaling (수치 안정).
3. **softmax**: 각 행을 합 1의 확률 분포로.
4. **$\cdots V$**: 확률 가중치로 $V$의 행 Vector들의 Linear combination.

→ 본 회차 사슬: 행렬 곱 → softmax → 행렬 곱. **단 두 종류의 연산**이다.

---

## C-2. $QK^\top$: Token 유사도 행렬

### 차원 확인
$Q \in \mathbb{R}^{n \times d_k}, K \in \mathbb{R}^{n \times d_k}$. $K^\top \in \mathbb{R}^{d_k \times n}$.
$$Q K^\top \in \mathbb{R}^{n \times n}.$$

### 각 성분의 의미
$$(QK^\top)_{ij} = \mathbf{q}_i^\top \mathbf{k}_j.$$

→ Token $i$의 query와 Token $j$의 key의 **Inner product**. Part 1 2회차에서 본 **Vector 유사도**.

### $\sqrt{d_k}$ scaling 이유
$\mathbf{q}_i, \mathbf{k}_j$가 평균 0·분산 1로 독립이면 $\mathbf{q}_i^\top \mathbf{k}_j$의 분산은 $d_k$. softmax가 극단으로 가는 것을 막기 위해 $\sqrt{d_k}$로 나눠 분산을 1로 정규화.

---

## C-3. softmax: 각 행을 합 1의 가중치로

### 정의 7.4 (Row-wise softmax)
행렬 $A \in \mathbb{R}^{n \times n}$의 row-wise softmax:
$$\mathrm{softmax}(A)_{ij} = \frac{e^{A_{ij}}}{\sum_{l=1}^{n} e^{A_{il}}}.$$

- 각 행이 양수이고 합 1.
- **확률 분포 $n$개**가 한 행렬로 묶인 형태.

### 의미
$P = \mathrm{softmax}(QK^\top/\sqrt{d_k}) \in \mathbb{R}^{n \times n}$의 $i$번째 행 $\mathbf{p}_i^\top$:
- Token $i$가 "다른 어느 Token에 얼마나 주목하는가"의 확률 분포.
- $p_{ij}$ 크면 Token $i$는 Token $j$에 강하게 주목.

→ "Attention" 이름의 출처: 각 Token이 다른 Token에 **주의**를 분배하는 가중치.

---

## C-4. $P V$: 가중 Vector 합

### 차원 확인
$P \in \mathbb{R}^{n \times n}, V \in \mathbb{R}^{n \times d_v}$.
$$PV \in \mathbb{R}^{n \times d_v}.$$

### 각 행의 의미
$(PV)_{i, :} = \sum_{j=1}^{n} p_{ij} \mathbf{v}_j^\top$.

→ Token $i$의 출력은 **모든 Token의 value $\mathbf{v}_j$의 가중 합** (가중치 $p_{ij}$). Part 1 1회차에서 본 **Linear combination**이 그대로 등장.

### 정리 7.2 (Attention 전체 분해)
$\mathrm{Attn}(Q, K, V)$는 다음 5단계로 분해된다:
1. $Q = XW^Q$ (행렬 곱)
2. $K = XW^K$ (행렬 곱)
3. $V = XW^V$ (행렬 곱)
4. $P = \mathrm{softmax}(QK^\top/\sqrt{d_k})$ (행렬 곱 + softmax)
5. $\mathrm{Attn} = PV$ (행렬 곱)

→ **행렬 곱 4번 + softmax 1번**. 본 회차 핵심 결론.

---

## C-5. Multi-head Attention: 직관

### 정의 7.5 (Multi-head Attention)
$h$개의 attention head를 병렬로 적용한다. 각 head는 자신의 $W_i^Q, W_i^K, W_i^V$를 가지고
$$\mathrm{head}_i = \mathrm{Attn}(X W_i^Q, X W_i^K, X W_i^V), \quad i = 1, \ldots, h.$$

각 $\mathrm{head}_i \in \mathbb{R}^{n \times d_v}$. 모두 이어 붙인 (concat) 뒤 출력 행렬 $W^O$로 변환:
$$\mathrm{MHA}(X) = \mathrm{Concat}(\mathrm{head}_1, \ldots, \mathrm{head}_h) W^O.$$

### 직관
$h$개의 head는 **서로 다른 관점의 유사도**를 학습한다. 한 head는 문법적 의존, 다른 head는 의미적 유사 등 다양한 관계를 동시에 잡는다.

> **Multi-head reshape의 정식 디테일** (한 큰 행렬을 $h$개로 reshape하여 효율 구현)은 자율 학습 박스로 이동한다.

---

## C-6. Attention의 본질 한 줄

### 정리 7.3 (Attention 의미 정리)
$$\mathrm{Attn}(Q, K, V)_{i, :} = \sum_{j=1}^{n} p_{ij} \mathbf{v}_j^\top, \quad p_{ij} = \mathrm{softmax}_j\!\left(\frac{\mathbf{q}_i^\top \mathbf{k}_j}{\sqrt{d_k}}\right).$$

각 Token $i$의 출력은 **모든 Token의 value Vector의 Linear combination**이며, 가중치는 query-key 유사도의 softmax이다.

→ **Linear combination** (Part 1 1회차)·**Inner product** (Part 1 2회차)·**행렬 곱** (Part 1 3회차)·**softmax** 한 함수. 이것이 Transformer의 한가운데에 있다.

---

<!-- _class: exercise -->

# 잠깐 풀어보기: Attention 분해

### 문제 1 (차원 추적)
$n = 4$ (Token 4개), $d = 8$ (embedding), $d_k = d_v = 2$. 다음 행렬의 shape을 모두 답하시오.

- (a) $X, W^Q, W^K, W^V$
- (b) $Q, K, V$
- (c) $QK^\top, P, PV$

### 문제 2 (개념)
$h = 4$ head, 각 head의 $d_k = d_v = 2$, $d = 8$. Multi-head attention에서 head들을 concat한 결과의 shape과 출력 행렬 $W^O$의 shape을 답하시오.

> **힌트**: concat은 마지막 차원에서. $W^O$는 다시 $d$로 돌려놓는다.

---

<!-- _class: exercise -->

## 잠깐 풀어보기: 답

### 문제 1
- (a) $X \in \mathbb{R}^{4 \times 8}$. $W^Q, W^K, W^V \in \mathbb{R}^{8 \times 2}$.
- (b) $Q, K, V \in \mathbb{R}^{4 \times 2}$.
- (c) $QK^\top \in \mathbb{R}^{4 \times 4}$ (Token 4개 × 4개 유사도). $P \in \mathbb{R}^{4 \times 4}$ (softmax 후). $PV \in \mathbb{R}^{4 \times 2}$.

### 문제 2
- concat 결과: 4 head 각 $\mathbb{R}^{n \times d_v} = \mathbb{R}^{4 \times 2}$, concat → $\mathbb{R}^{4 \times 8}$.
- $W^O \in \mathbb{R}^{8 \times 8}$ (원래 차원으로 변환).
- 최종 MHA 출력 $\in \mathbb{R}^{4 \times 8} = \mathbb{R}^{n \times d}$. **입력과 같은 shape**.

→ Transformer 한 층의 입출력 shape이 같다 (잔차 연결 가능). 이것이 깊게 쌓을 수 있는 이유.

---

# D. AI 연결

## D-1. Transformer 한 층의 완전 분해

Transformer encoder 한 층:
$$\text{Input} \to \text{LayerNorm} \to \text{MHA} \to \text{Residual} \to \text{LayerNorm} \to \text{FFN} \to \text{Residual} \to \text{Output}.$$

| 단계 | 본 회차 환원 |
|---|---|
| Embedding | one-hot × 행렬 (정리 7.1) |
| LayerNorm | 행별 표준화 (정의는 자율) |
| MHA | 행렬 곱 $h \cdot 4 + 1$개 (정리 7.2) |
| FFN | 2개 행렬 곱 + 1개 비선형 |
| Residual | Vector 합 |

→ **Transformer 한 층 전체가 행렬 곱과 element-wise 함수의 조합**이다. 본 강좌의 메시지가 한 자리에 모인다.

---

## D-2. GPT·BERT·ViT 공통 골격

| 모델 | 입력 Token | Attention 방식 |
|---|---|---|
| **BERT** | 단어 piece | bidirectional (모든 Token이 모두 봄) |
| **GPT** | 단어 piece | causal mask (이전 Token만 봄) |
| **ViT** | 이미지 패치 | bidirectional |

→ 본 회차에서 본 정의 7.3 식은 셋 모두에 동일. 차이는 **마스크의 형태**뿐. Token이 단어이든 이미지 패치이든, **수학적 객체는 동일**.

---

## D-3. 본 회차 핵심 5개

1. **Embedding = one-hot × 행렬** (정리 7.1). 정수 ID가 Vector로 환원되는 메커니즘.
2. **$Q = XW^Q, K = XW^K, V = XW^V$**, 세 독립 행렬 곱으로 query·key·value 생성.
3. **$QK^\top \in \mathbb{R}^{n \times n}$**의 각 성분 = Token 간 Inner product (유사도).
4. **$\mathrm{softmax}(QK^\top/\sqrt{d_k})V$** = 각 Token이 다른 Token의 value를 확률 가중치로 Linear combination한 결과 (정리 7.3).
5. **Multi-head**: $h$개 attention 병렬, 다양한 관점의 유사도를 동시 학습.

---

## D-4. 자기 점검 질문

- Embedding을 one-hot × 행렬로 보면 학습 가능한 파라미터는 무엇이고 몇 개인가? ($V = 30{,}000, d = 768$)
- $QK^\top$이 $n \times n$인 이유와 그 크기가 sequence length에 따라 어떻게 변하는가?
- $\sqrt{d_k}$로 나누는 이유는? $d_k = 64$이면 분산이 얼마에서 얼마로 정규화되는가?
- Multi-head가 single head 1개를 큰 $d_k$로 쓰는 것보다 좋은 이유는?
- Conv (6회차)와 Attention (본 회차)는 모두 행렬 곱이다. 차이는 어디에서 오는가?

---

# E. Equivariance 직관·마무리

## E-1. Equivariance 직관 한 슬라이드 (본 회차 흡수)

본 강좌의 원래 8회차에서 다루던 Equivariance·Kronecker를 **직관 한 슬라이드**로 본 회차에 흡수한다.

### Translation Equivariance (CNN)
> **"이미지를 한 칸 옆으로 밀고 Conv를 적용한 결과 = Conv를 적용한 뒤 한 칸 옆으로 민 결과"**

그림 직관:
$$\text{Image} \xrightarrow{\text{shift}} \text{shifted} \xrightarrow{\text{Conv}} \text{out1}, \qquad \text{Image} \xrightarrow{\text{Conv}} \xrightarrow{\text{shift}} \text{out2}, \quad \text{out1} = \text{out2}.$$

→ **6회차 Toeplitz 구조에서 자동 따라옴**. Conv 필터가 위치에 관계없이 같기 때문.

### Permutation Equivariance (GNN)
> **"노드 순서를 바꾸고 GNN을 통과한 결과 = GNN을 통과한 뒤 노드 순서를 바꾼 결과"**

GNN의 메시지 패싱은 노드의 **이름·순서에 의존하지 않는다**. 그래프 구조만이 출력을 결정한다.

→ **정식 정의·Kronecker $I_H \otimes W$ 정식 식·Circulant ↔ CNN 증명**은 자율 학습 박스로 이동.

---

## E-2. 본 회차 마무리 한 줄

본 회차의 결론:
- **모든 신경망 핵심 층은 행렬 곱**이다.
- CNN은 Toeplitz, 1×1 Conv는 채널 행렬, Attention은 4개 행렬 곱 + softmax, Embedding은 one-hot × 행렬.
- 본 강좌 Part 1 1·2·3회차 (Vector·Inner product·행렬 곱)이 본 회차에 모두 등장한다.

→ **선형대수가 AI의 한가운데에 있다**는 본 강좌 메시지가 본 회차에서 완성된다.

---

<!-- _class: exercise -->

# 본 회차 마무리 문제 (즉석 풀이)

본 회차 사슬 (Embedding → Q,K,V → $QK^\top$ → softmax → $\cdots V$ → Multi-head + Equivariance 직관)을 **한 문제**로 종합합니다.

$n = 3$ Token, $d = 4$, $d_k = d_v = 2$. 입력
$$X = \begin{pmatrix} 1 & 0 & 1 & 0 \\ 0 & 1 & 0 & 1 \\ 1 & 1 & 0 & 0 \end{pmatrix}, \quad W^Q = W^K = W^V = \begin{pmatrix} 1 & 0 \\ 0 & 1 \\ 1 & 0 \\ 0 & 1 \end{pmatrix}.$$

- **(a)** $Q = XW^Q$를 계산하시오. ($K, V$도 같은 행렬이므로 결과 동일)
- **(b)** $QK^\top \in \mathbb{R}^{3 \times 3}$를 계산하시오.
- **(c)** $\sqrt{d_k} = \sqrt{2}$로 나누면 그 결과는?
- **(d)** Multi-head에서 $h$개 head를 쓰는 직관적 이유를 한 줄로 답하시오.

---

<!-- _class: exercise -->

## 본 회차 마무리 문제: 답

- **(a)** 각 행에 $W^Q$ 곱. 행 1: $(1, 0, 1, 0) \cdot W^Q = (1+1, 0+0) = (2, 0)$. 행 2: $(0, 1, 0, 1) \cdot W^Q = (0+0, 1+1) = (0, 2)$. 행 3: $(1, 1, 0, 0) \cdot W^Q = (1+0, 0+1) = (1, 1)$.
  $$Q = \begin{pmatrix} 2 & 0 \\ 0 & 2 \\ 1 & 1 \end{pmatrix}.$$

- **(b)** $K = Q$. $QK^\top$의 $(i,j) = \mathbf{q}_i^\top \mathbf{q}_j$.
  $$QK^\top = \begin{pmatrix} 4 & 0 & 2 \\ 0 & 4 & 2 \\ 2 & 2 & 2 \end{pmatrix}.$$

- **(c)** 각 원소를 $\sqrt{2}$로 나눔. $\approx \begin{pmatrix} 2.83 & 0 & 1.41 \\ 0 & 2.83 & 1.41 \\ 1.41 & 1.41 & 1.41 \end{pmatrix}$.

- **(d)** $h$개 head는 서로 다른 관점의 Token 유사도 (문법·의미·위치 등)를 동시에 학습한다.

> **핵심**: 본 회차 식의 모든 객체가 작은 예제에서 손으로 추적 가능하다. 행렬 곱 + softmax 두 종류만 등장한다.

---

<!-- _class: exercise -->

## 다음 회차 (Case Study) Review용 숙제

본 회차 마무리 문제의 **확장 + Case Study 준비**입니다.

- (a) 본 문제 (c)의 결과에 row-wise softmax를 적용하여 $P \in \mathbb{R}^{3 \times 3}$를 계산하시오. (소수 둘째 자리)
- (b) $V = Q$ (같은 행렬)일 때 $PV$를 계산하시오.
- (c) 본 회차 정리 7.3에 따르면 (b)의 각 행은 무엇의 Linear combination인가?
- (d) **다음 회차 Case Study 준비**: 자신이 분해해 보고 싶은 AI 모델의 한 부분 (예: ResNet 1×1 Conv, ViT Attention head, LoRA adapter, RoPE positional encoding 등)을 한 개 선택하고 어떤 LA 객체로 환원할 수 있을지 1-2줄로 적어 오시오.

---

## E-3. 과제 안내

`04_과제/Part3/07회차_homework.md` — 마감: 8회차 시작 전 (Case Study 자료 포함)

**수학 30점**
- Embedding을 one-hot × 행렬로 적기, 2문제
- $Q, K, V$ 행렬 곱 차원 추적, 3문제
- $QK^\top$·softmax·$PV$ 작은 예 계산, 3문제
- Multi-head reshape·concat 차원 추적, 2문제

**코딩 20점**
- PyTorch `nn.MultiheadAttention`의 가중치를 추출해 식대로 손으로 재계산
- 같은 입력에 대해 `nn.Embedding`과 one-hot × 행렬이 일치함 검증
- (보너스) 작은 Transformer 한 층 직접 구현 (행렬 곱만 사용)

**Case Study 준비 (다음 회차 발표)**
- 자신이 선택한 모델 부분에 대한 보고서 (1쪽) + 5분 발표 슬라이드
- 자기 점검 활동

**Part 3 종합 문제 사전 풀이**
- 마지막 회차 전에 사전 공개된 `05_시험/Part3_종합문제풀기.md`를 본인 페이스로 풀어 와서, 8회차에 함께 Review

---

## E-4. 다음 회차 (8회차) 예고

**주제**: Case Study 발표 + Part 3 종합 문제 풀기

**연결**: 본 회차까지 7회차 동안 다룬 Part 3 (Linear Regression·PCA·GMM·SVM·Kernel·CNN·Attention) 7개 도구를 모두 동원하여 학생 각자의 Case Study를 발표하고, 사전 공개된 Part 1·2·3 종합 문제를 함께 Review한다.

**준비물**:
- Case Study 보고서 1쪽 + 5분 발표
- 본 강좌 노트 (Part 1·2·3 전체)

---

<div class="appendix">

## 자율 학습·부록: Attention backward Jacobian · Multi-head reshape · Equivariance commute 정식 · Kronecker $I_H \otimes W$ 정식 식

본 강좌 본문에서는 직관과 forward 분해에 집중한다. 다음은 본문에서 다루지 않으며 관심 학생은 후속 자료를 참고한다.

- **Attention backward Jacobian**: $\partial \mathrm{Attn} / \partial X$의 정식 행렬식 유도. softmax 미분과 행렬 곱 체인 룰의 결합.
- **Multi-head reshape 정식 디테일**: 한 큰 행렬 $W^Q \in \mathbb{R}^{d \times h d_k}$를 $h$개로 reshape하여 batched matmul 한 번으로 구현하는 PyTorch 패턴.
- **Equivariance commute 정식 정의**: $f \circ T_g = T'_g \circ f$ for all $g \in G$ (군 $G$ 동치).
- **Kronecker $I_H \otimes W$ 정식 식**: 다채널 Conv를 한 행렬로 적기 위한 Kronecker 곱 정식 표현, Circulant 행렬 ↔ CNN 동치 증명.

참고: Bronstein·Bruna·Cohen·Veličković, *Geometric Deep Learning: Grids, Groups, Graphs, Geodesics, and Gauges* (proto-book). MML §3.10 (Kronecker product).

</div>

---

# 부록: 본 회차 사슬 요약

| 객체 | 정식 | 본 강좌 어디서 |
|---|---|---|
| one-hot Vector | $\mathbf{e}_i \in \mathbb{R}^V$ | Part 1 1회차 |
| Embedding | $E^\top \mathbf{e}_i$ | 정리 7.1 |
| Token 행렬 | $X \in \mathbb{R}^{n \times d}$ | B-2 |
| $Q, K, V$ | $XW^Q, XW^K, XW^V$ | 정의 7.2 |
| $QK^\top$ | Inner product 행렬 | C-2, Part 1 2회차 |
| softmax | row-wise 합 1 | 정의 7.4 |
| $PV$ | 행 Vector의 Linear combination | C-4, Part 1 1회차 |
| Multi-head | $h$개 head 병렬 + concat | 정의 7.5 |
| Equivariance | Conv·GNN 직관 | E-1 |

→ **Part 1의 객체들이 모두 본 회차에 다시 등장**한다.

---

<!-- _class: lead -->

# Q & A

본 회차 사슬:
**Embedding (one-hot × 행렬) → $Q, K, V$ (3 행렬곱) → $QK^\top$ (유사도) → softmax (가중치) → $PV$ (Linear combination) → Multi-head → Equivariance 직관**

핵심 한 줄: **Attention은 행렬 곱 4번과 softmax 1번. Transformer 한 층의 모든 객체가 Part 1 도구로 분해된다.**

다음 회차의 출발 문제:
> 학생 각자가 선택한 AI 모델 부분을 LA 객체로 환원해 봅시다.

`HANDOUT`: 본 PDF
