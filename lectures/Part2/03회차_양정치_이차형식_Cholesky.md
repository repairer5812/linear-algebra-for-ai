---
marp: true
theme: default
paginate: true
header: '인공지능 전공자를 위한 선형대수학'
footer: 'Part 2 3회차 · Positive definite·Quadratic form·Cholesky'
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
  .strang { background: #FEF3C7; border-left: 4px solid #D97706; padding: 10px 16px; margin: 12px 0;
            font-size: 19px; color: #78350F; border-radius: 0 8px 8px 0; }
  .strang strong { color: #92400E; }
---

<!-- _class: lead -->
<!-- _paginate: false -->

# Part 2 · 3회차

## Positive definite(양정치)·이차형식·Cholesky 분해

MML §4.3 (메인) · Strang Ch 6.5 (발췌)

**모든 Eigenvalue가 양수**인 대칭행렬에서 이차형식·Cholesky·다변량 정규가 한 묶음으로 등장합니다.

> $A \succ 0 \iff$ 모든 $\lambda > 0 \iff \mathbf{x}^\top A \mathbf{x} > 0 \iff A = LL^\top$ ($L$ 대각 양수)

---

<!-- _class: exercise -->

# Review: 2회차 마무리 숙제

지난 회차 문제:
> $A = \begin{pmatrix} 4 & 1 \\ 1 & 4 \end{pmatrix}$의 직교 대각화와 $\mathbf{x}^\top A \mathbf{x} > 0$ 증명.

### 답
- Eigenvalue: $\lambda_1 = 3, \lambda_2 = 5$ (모두 양수). Eigenvector $(1,-1)^\top, (1,1)^\top$ (직교).
- $Q = \frac{1}{\sqrt 2}\begin{pmatrix} 1 & 1 \\ -1 & 1 \end{pmatrix}$, $\Lambda = \mathrm{diag}(3, 5)$. $A = Q\Lambda Q^\top$.
- (d) $\mathbf{y} = Q^\top \mathbf{x}$로 변수 변환하면 $\mathbf{x}^\top A \mathbf{x} = \mathbf{y}^\top \Lambda \mathbf{y} = 3y_1^2 + 5y_2^2 > 0$ ($\mathbf{x}\neq\mathbf{0} \Rightarrow \mathbf{y}\neq\mathbf{0}$).

### 핵심 관찰
"모든 $\lambda > 0$"이 곧 "$\mathbf{x}^\top A \mathbf{x} > 0$"으로 환원되는 두 동치 진술이 본 회차 양정치 정의의 두 축이다. Spectral theorem이 두 진술을 잇는 다리이다.

---

## 본 회차 핵심 질문

> ### 모든 Eigenvalue가 **양수**인 대칭행렬은 어떤 특별한 성질을 가집니까?

이 한 질문에 답하려면 네 단계가 필요합니다.

1. **이차형식(quadratic form)** $\mathbf{x}^\top A \mathbf{x}$의 정의·기하 해석
2. **양정치(positive definite)·양반정치(positive semidefinite) 정식 정의**와 5개 동치 진술
3. **Cholesky 분해** $A = LL^\top$ ($L$ 하삼각·대각 양수)
4. **응용**: Hessian·뉴턴법, 다변량 정규분포 샘플링, Ridge 정규화

---

## 학습 목표

이번 회차가 끝나면 학생은 다음을 답할 수 있어야 합니다.

1. **이차형식** $\mathbf{x}^\top A \mathbf{x}$를 손으로 전개하고 $\mathbb{R}^2, \mathbb{R}^3$의 등위면 (타원·쌍곡선)을 그릴 수 있다.
2. **양정치(positive definite)**의 5개 동치 진술 (모든 $\lambda > 0$, $\mathbf{x}^\top A\mathbf{x} > 0$, $A = R^\top R$ ($R$ 가역), 모든 leading principal minor $> 0$, Cholesky 존재)을 모두 진술할 수 있다.
3. **Cholesky 분해** $A = LL^\top$를 $2\times 2$, $3\times 3$에 대해 손으로 계산할 수 있다.
4. 손실함수의 **Hessian이 양정치**일 때 강한 볼록(strongly convex), Newton 방향 보장 등 의미를 설명할 수 있다.
5. **다변량 정규 샘플링**을 Cholesky로 구현할 수 있다 ($\mathbf{z} \sim \mathcal{N}(\mathbf{0}, I) \Rightarrow L\mathbf{z} + \boldsymbol\mu \sim \mathcal{N}(\boldsymbol\mu, A)$).

---

## 본 회차 개념 사슬

| 질문 | 답 (본 회차의 답) | 도구 |
|---|---|---|
| Norm 일반화? | $\mathbf{x}^\top A \mathbf{x}$ | 이차형식 |
| 항상 $> 0$ 보장? | 모든 $\lambda > 0$ (대칭) | 양정치 정의 |
| 동치 진술 5개? | $\lambda, \mathbf{x}^\top A\mathbf{x}, R^\top R, \text{minor}, LL^\top$ | 정리 2.3.5 |
| 빠른 분해? | $A = LL^\top$ | Cholesky |
| 응용? | Hessian·MVN·Ridge | D 섹션 |

---

## 수업 흐름

| 순서 | 블록 | 내용 |
|:---:|:---:|---|
| ① | A | **오프닝**: 2회차 Review, 본 회차 사슬 |
| ② | **B** | **정의·동기**: 이차형식 → 양정치 |
| ③ | **C** | **정리·풀이**: 5개 동치, Cholesky 풀이 |
| ④ | **D** | **응용**: Hessian·MVN·Ridge |
| ⑤ | E | **코딩 실습**: NumPy Cholesky·MVN 샘플링, 마무리 문제 |

---

# B. 정의·동기: 이차형식 → 양정치

## B-1. 이차형식 (Quadratic form)

### 정의 2.3.1 (이차형식)
대칭행렬 $A \in \mathbb{R}^{n\times n}$ ($A^\top = A$)과 벡터 $\mathbf{x} \in \mathbb{R}^n$에 대해
$$q(\mathbf{x}) = \mathbf{x}^\top A \mathbf{x} = \sum_{i=1}^n\sum_{j=1}^n A_{ij} x_i x_j$$
를 **이차형식**이라 한다.

### 예제 ($n = 2$)
$A = \begin{pmatrix} a & b \\ b & c \end{pmatrix}$일 때
$$\mathbf{x}^\top A \mathbf{x} = a x_1^2 + 2 b x_1 x_2 + c x_2^2$$

> **왜 $A$가 대칭인가**: $A$가 비대칭이라도 $\mathbf{x}^\top A \mathbf{x} = \mathbf{x}^\top (A + A^\top)/2 \cdot \mathbf{x}$이므로 대칭 부분만이 이차형식에 기여. 따라서 일반성을 잃지 않고 대칭으로 둔다.

---

## B-2. 이차형식의 기하 해석

$q(\mathbf{x}) = c$ (상수)의 해집합 = **이차곡선·이차곡면** (등위면, level set).

### $\mathbb{R}^2$의 경우 ($q(\mathbf{x}) = 1$)
- $A = I$ (단위행렬): $x_1^2 + x_2^2 = 1$ = **원**.
- $A = \mathrm{diag}(1, 4)$: $x_1^2 + 4x_2^2 = 1$ = **타원** (긴축 $x_1$, 짧은축 $x_2$).
- $A = \mathrm{diag}(1, -1)$: $x_1^2 - x_2^2 = 1$ = **쌍곡선**.
- $A = \mathrm{diag}(-1, -1)$: $-x_1^2 - x_2^2 = 1$ = **공집합**.

### Eigenvalue 분류
대칭 $A$의 Eigenvalue $\lambda_1, \lambda_2$에 따라:
- 모두 양수: **타원** (양정치)
- 하나 양수·하나 음수: **쌍곡선** (부정부호, indefinite)
- 모두 음수: 공집합 (음정치, $-A$가 양정치)
- 하나 양·하나 0: 평행선 (양반정치, semidefinite)

→ 이차형식의 모양 = 대칭행렬 $A$의 **Eigenvalue 부호**가 결정.

---

## B-3. 정식 정의 (Positive definite·Positive semidefinite)

### 정의 2.3.2 (양정치, positive definite, $A \succ 0$)
대칭 $A$가 모든 $\mathbf{x} \neq \mathbf{0}$에 대해
$$\mathbf{x}^\top A \mathbf{x} > 0$$
이면 $A$를 **양정치(positive definite, 양정치)**라 한다. 표기 $A \succ 0$ 또는 $A > 0$.

### 정의 2.3.3 (양반정치, positive semidefinite, $A \succeq 0$)
모든 $\mathbf{x}$에 대해 $\mathbf{x}^\top A \mathbf{x} \ge 0$이면 **양반정치(positive semidefinite, 양반정치)**, 표기 $A \succeq 0$.

### 양정치의 필요조건 (즉시 결과)
- 모든 대각 원소 $A_{ii} > 0$ (이유: $\mathbf{x} = \mathbf{e}_i$ 대입).
- $\det(A) > 0$ (이유: 모든 $\lambda > 0$, 곱이 양수, 3회차 정리에서 정식 진술).

> **음정치(negative definite)**·**부정부호(indefinite)**: $\mathbf{x}^\top A \mathbf{x} < 0$ 또는 부호가 둘 다 나타나는 경우. 같은 분류 체계.

---

## B-4. 양정치 ↔ 모든 $\lambda > 0$ (Spectral 활용)

### 정리 2.3.4 (양정치 ↔ Eigenvalue 양수)
대칭 $A$가 양정치일 필요충분조건은 모든 Eigenvalue $\lambda_i > 0$이다.

### 풀이 흐름
Spectral theorem: $A = Q\Lambda Q^\top$. $\mathbf{y} = Q^\top \mathbf{x}$로 변수 변환하면
$$\mathbf{x}^\top A \mathbf{x} = \mathbf{y}^\top \Lambda \mathbf{y} = \sum_{i=1}^n \lambda_i y_i^2$$

($\Rightarrow$) 모든 $\lambda_i > 0$이면 $\mathbf{y} \neq \mathbf{0}$ ($\mathbf{x}\neq\mathbf{0}$이므로)에 대해 $\sum \lambda_i y_i^2 > 0$.
($\Leftarrow$) $\mathbf{x} = Q\mathbf{e}_i$ (즉 $\mathbf{y} = \mathbf{e}_i$) 대입하면 $\lambda_i = \mathbf{e}_i^\top \Lambda \mathbf{e}_i > 0$. ∎

### 의의
**$\mathbf{x}^\top A \mathbf{x} > 0$의 무한 검사**가 **$n$개 Eigenvalue의 부호 검사**로 환원된다.

---

## B-5. 친숙한 양정치 예제

### 예제 1 (Gram 행렬)
$X \in \mathbb{R}^{m\times n}$ (열이 일차독립)에 대해 $A = X^\top X$는 항상 양정치이다.

이유: $\mathbf{x}^\top A \mathbf{x} = \mathbf{x}^\top X^\top X \mathbf{x} = \|X\mathbf{x}\|^2 \ge 0$, 등호는 $X\mathbf{x} = \mathbf{0}$ 즉 $\mathbf{x} = \mathbf{0}$ (열 일차독립)일 때만.

### 예제 2 (공분산 행렬)
$\Sigma = \mathbb{E}[(\mathbf{X} - \boldsymbol\mu)(\mathbf{X} - \boldsymbol\mu)^\top]$는 항상 양반정치. 데이터가 한 부분공간에 갇히지 않으면 양정치.

### 예제 3 ($A = I + B^\top B$)
임의의 $B$에 대해 $I + B^\top B$는 양정치. Ridge 정규화 $X^\top X + \lambda I$도 $\lambda > 0$이면 양정치 (Part 1 10회차 다중공선성 해소의 정식 이유).

---

<div class="analogy">

**직관 (밥그릇 vs 안장 비유)**: 이차형식 $q(\mathbf{x}) = \mathbf{x}^\top A \mathbf{x}$의 그래프는 $A$의 Eigenvalue 부호에 따라 모양이 정해집니다. **모두 양수면 밥그릇** (위로 열린 그릇, 바닥에 유일 최솟값), **하나 양·하나 음이면 안장** (말 안장 모양, 최솟값·최댓값 없음, 임계점은 saddle), **모두 음수면 거꾸로 된 밥그릇**. 손실함수의 Hessian이 밥그릇이면 Newton·뉴턴류 알고리즘이 곧장 최솟값으로 내려간다, 안장이면 멈춘다, 이것이 7회차 Hessian 분석의 토대입니다.

</div>

---

# C. 정리·풀이: 5개 동치, Cholesky

## C-1. 정리 2.3.5 (양정치의 5개 동치 진술)

대칭 $A \in \mathbb{R}^{n\times n}$에 대해 다음은 동치이다.
1. $A \succ 0$ (양정치 정의: 모든 $\mathbf{x}\neq\mathbf{0}$에 대해 $\mathbf{x}^\top A \mathbf{x} > 0$).
2. 모든 Eigenvalue $\lambda_i > 0$.
3. **모든 leading principal minor**가 양수: $\det A_k > 0$ ($A_k$ = 좌상단 $k \times k$ 블록).
4. 가역인 $R \in \mathbb{R}^{n\times n}$가 존재해 $A = R^\top R$.
5. **유일한** 하삼각 $L$ (대각 양수)이 존재해 $A = LL^\top$ (**Cholesky 분해**).

### 풀이 흐름 (다섯 동치 잇기)
- 1↔2: 정리 2.3.4 (Spectral).
- 2→4: $A = Q\Lambda Q^\top$, $R = \Lambda^{1/2} Q^\top$ (실수 행렬, $\lambda > 0$이므로 $\sqrt{\lambda}$ 가능). 그러면 $R^\top R = Q\Lambda Q^\top = A$.
- 4→1: $\mathbf{x}^\top A \mathbf{x} = \|R\mathbf{x}\|^2 > 0$ ($R$ 가역).
- 1↔3: Sylvester 판정법 (본문 진술까지, 증명은 부록).
- 4↔5: Cholesky 알고리즘 (C-3에서 직접 풀이).

---

## C-2. Sylvester 판정법 (Leading minor)

$A_k$ = $A$의 좌상단 $k \times k$ 부분행렬.

### 예제 ($3 \times 3$)
$A = \begin{pmatrix} 2 & 1 & 0 \\ 1 & 3 & 1 \\ 0 & 1 & 2 \end{pmatrix}$.

- $\det A_1 = 2 > 0$ ✓
- $\det A_2 = \det\begin{pmatrix} 2 & 1 \\ 1 & 3 \end{pmatrix} = 6 - 1 = 5 > 0$ ✓
- $\det A_3 = \det A = 2(6-1) - 1(2-0) = 10 - 2 = 8 > 0$ ✓

→ $A$는 양정치. 손계산 검사로 가장 빠른 방법 중 하나.

### 주의 (양반정치)
양반정치의 경우 "모든 principal minor (leading뿐 아니라 모든 위치)가 $\ge 0$"이 필요충분이다. Leading minor만으로는 부족.

---

## C-3. Cholesky 분해 알고리즘 (구성적 풀이)

$A = LL^\top$, $L$ 하삼각·$L_{ii} > 0$. 식을 풀면 다음 점화식.

### 알고리즘 (요소별)
$j = 1, 2, \ldots, n$에 대해
$$L_{jj} = \sqrt{A_{jj} - \sum_{k=1}^{j-1} L_{jk}^2}, \qquad L_{ij} = \frac{1}{L_{jj}}\left(A_{ij} - \sum_{k=1}^{j-1} L_{ik}L_{jk}\right) \quad (i > j)$$

### 비용
$O(n^3/3)$. LU 분해의 절반 ($O(2n^3/3)$). 대칭성·양정치성을 이용한 효율 분해.

---

## C-4. Cholesky $2\times 2$ 손풀이

$A = \begin{pmatrix} 4 & 2 \\ 2 & 5 \end{pmatrix}$.

### Step 1
$L_{11} = \sqrt 4 = 2$.

### Step 2
$L_{21} = A_{21}/L_{11} = 2/2 = 1$.

### Step 3
$L_{22} = \sqrt{A_{22} - L_{21}^2} = \sqrt{5 - 1} = 2$.

### 검증
$$L = \begin{pmatrix} 2 & 0 \\ 1 & 2 \end{pmatrix}, \quad LL^\top = \begin{pmatrix} 2 & 0 \\ 1 & 2 \end{pmatrix}\begin{pmatrix} 2 & 1 \\ 0 & 2 \end{pmatrix} = \begin{pmatrix} 4 & 2 \\ 2 & 5 \end{pmatrix} = A$$ ✓

### Sylvester 검사
$\det A_1 = 4 > 0$, $\det A_2 = 20 - 4 = 16 > 0$. 양정치 ✓ (Cholesky 존재의 보장.)

---

## C-5. Cholesky $3\times 3$ 손풀이

$A = \begin{pmatrix} 4 & 12 & -16 \\ 12 & 37 & -43 \\ -16 & -43 & 98 \end{pmatrix}$ (전형적 예제).

### 1열
- $L_{11} = \sqrt 4 = 2$
- $L_{21} = 12/2 = 6$
- $L_{31} = -16/2 = -8$

### 2열
- $L_{22} = \sqrt{37 - 36} = 1$
- $L_{32} = (-43 - (-8)(6))/1 = (-43 + 48)/1 = 5$

### 3열
- $L_{33} = \sqrt{98 - 64 - 25} = \sqrt{9} = 3$

### 결과
$$L = \begin{pmatrix} 2 & 0 & 0 \\ 6 & 1 & 0 \\ -8 & 5 & 3 \end{pmatrix}$$

검산: $LL^\top = A$ 확인 가능. **분해가 유일**하다는 것은 $L_{ii} > 0$ 조건에서 자동.

---

<!-- _class: exercise -->

# 잠깐 풀어보기: 양정치 판정·Cholesky

### 문제 1 (양정치 판정)
다음 행렬이 양정치인지 판정하시오 (Sylvester 또는 Eigenvalue).

- (i) $\begin{pmatrix} 3 & 1 \\ 1 & 2 \end{pmatrix}$
- (ii) $\begin{pmatrix} 1 & 2 \\ 2 & 1 \end{pmatrix}$
- (iii) $\begin{pmatrix} 2 & -1 & 0 \\ -1 & 2 & -1 \\ 0 & -1 & 2 \end{pmatrix}$

### 문제 2 (Cholesky)
$A = \begin{pmatrix} 9 & 3 \\ 3 & 5 \end{pmatrix}$의 Cholesky 분해 $A = LL^\top$를 구하시오.

> **힌트 1(iii)**: 1D 라플라시안 형태. 양정치 판단에는 Sylvester 셋 다 양수 확인.

---

<!-- _class: exercise -->

## 잠깐 풀어보기: 답

### 문제 1
- (i) $\det A_1 = 3 > 0$, $\det A_2 = 6 - 1 = 5 > 0$ → **양정치**.
- (ii) $\det A_1 = 1 > 0$, $\det A_2 = 1 - 4 = -3 < 0$ → **양정치 아님** (사실 부정부호 indefinite, $\lambda = 3, -1$).
- (iii) $\det A_1 = 2$, $\det A_2 = 4 - 1 = 3$, $\det A_3 = 2(3) - (-1)(-2) = 6 - 2 = 4$. 모두 $> 0$ → **양정치**.

### 문제 2
- $L_{11} = 3, L_{21} = 3/3 = 1, L_{22} = \sqrt{5 - 1} = 2$.
- $L = \begin{pmatrix} 3 & 0 \\ 1 & 2 \end{pmatrix}$, 검증: $LL^\top = \begin{pmatrix} 9 & 3 \\ 3 & 5 \end{pmatrix}$ ✓.

> **메시지**: 양정치 검사는 Sylvester가 가장 빠르고, 분해는 Cholesky가 LU보다 절반 비용. AI에서 등장하는 대부분의 대칭 행렬 분해는 Cholesky로 처리한다.

---

# D. 응용: Hessian·MVN·Ridge

## D-1. 손실함수의 Hessian 양정치 = 강한 볼록

### 정의 (7회차 미리보기)
$f: \mathbb{R}^n \to \mathbb{R}$의 **Hessian** $\nabla^2 f(\mathbf{x})$는 $n \times n$ 대칭행렬, $(i, j)$ 원소 = $\partial^2 f / \partial x_i \partial x_j$ (혼합편미분).

### 2차 Taylor 전개
$$f(\mathbf{x} + \mathbf{h}) \approx f(\mathbf{x}) + \nabla f(\mathbf{x})^\top \mathbf{h} + \frac{1}{2}\mathbf{h}^\top \nabla^2 f(\mathbf{x})\, \mathbf{h}$$

임계점 ($\nabla f = \mathbf{0}$)에서:
- $\nabla^2 f \succ 0$: **국소 최솟값** (밥그릇)
- $\nabla^2 f \prec 0$: 국소 최댓값
- 부정부호: 안장점

### Newton 방향
Newton 갱신 $\mathbf{x}_{k+1} = \mathbf{x}_k - (\nabla^2 f)^{-1} \nabla f$가 **감소 방향**임은 $\nabla^2 f \succ 0$일 때 보장. 7회차 정식.

---

## D-2. 다변량 정규분포(MVN) 샘플링: Cholesky의 가장 친숙한 응용

### 다변량 정규분포
$\mathbf{X} \sim \mathcal{N}(\boldsymbol\mu, \Sigma)$, $\Sigma$가 공분산 (양정치).

### 샘플링 알고리즘
1. $\mathbf{z} \in \mathbb{R}^n$, 각 $z_i \stackrel{\text{iid}}{\sim} \mathcal{N}(0, 1)$ 생성. 즉 $\mathbf{z} \sim \mathcal{N}(\mathbf{0}, I)$.
2. $\Sigma = LL^\top$ (Cholesky).
3. $\mathbf{X} = L\mathbf{z} + \boldsymbol\mu$.

### 정당화
$\mathbf{X}$의 평균 $= \boldsymbol\mu$, 공분산 $= L \cdot \mathbb{E}[\mathbf{z}\mathbf{z}^\top] \cdot L^\top = LIL^\top = LL^\top = \Sigma$ ✓.

### 의의
**Cholesky 분해 한 번이면 MVN 샘플링이 행렬 곱 한 번**으로 줄어든다. VAE·Diffusion·Bayesian 추론 등 거의 모든 확률 모델 학습에 등장.

---

## D-3. Ridge 정규화: 양정치 보장

### Part 1 10회차 미해결 문제
최소제곱 $\min \|X\boldsymbol\beta - \mathbf{y}\|^2$의 정규방정식 $X^\top X \boldsymbol\beta = X^\top \mathbf{y}$. 다중공선성·$\mathrm{rank}(X) < n$이면 $X^\top X$가 양반정치 (특이), 해 비유일.

### Ridge 해결
$$\min \|X\boldsymbol\beta - \mathbf{y}\|^2 + \lambda \|\boldsymbol\beta\|^2 \quad (\lambda > 0)$$
의 정규방정식: $(X^\top X + \lambda I)\boldsymbol\beta = X^\top \mathbf{y}$.

### 핵심
$X^\top X + \lambda I$는 항상 **양정치** ($\lambda > 0$, 모든 Eigenvalue가 $X^\top X$의 Eigenvalue, $\lambda$, 즉 $\ge \lambda > 0$). 따라서 가역이며 해가 유일. Cholesky로 빠르게 풀이.

→ 본 회차의 한 정리 (양정치 ↔ 모든 $\lambda > 0$ ↔ Cholesky 존재)가 곧 Ridge 정규화의 정당화이다.

---

## D-4. AI 응용 카탈로그

| 장면 | 등장 양정치 행렬 |
|---|---|
| **공분산** | $\Sigma$, 데이터 분산이 양정치 (모든 방향 분산 양수) |
| **Hessian** | 볼록 손실의 $\nabla^2 f$ |
| **Gram·NTK** | $X^\top X, K$ (kernel) |
| **Ridge·MAP** | $X^\top X + \lambda I$ |
| **Fisher 정보** | $I(\theta)$, 정보 행렬 |
| **Laplace 근사** | 사후분포 mode 근방의 공분산 = $(-\nabla^2 \log p)^{-1}$ |
| **PSD kernel** (RBF·Polynomial) | Mercer 정리, Part 3 5회차 |

→ 양정치는 **분산·곡률·정보**라는 세 직관이 만나는 자리이다.

---

# E. 코딩 실습: NumPy Cholesky·MVN

## E-1. Cholesky NumPy

```python
import numpy as np

A = np.array([[4, 12, -16],
              [12, 37, -43],
              [-16, -43, 98]], dtype=float)

L = np.linalg.cholesky(A)
print(L)
# [[ 2.  0.  0.]
#  [ 6.  1.  0.]
#  [-8.  5.  3.]]

# 검증
assert np.allclose(L @ L.T, A)
```

### 양정치 검사
```python
# (i) Cholesky 시도 (실패하면 양정치 아님)
try:
    np.linalg.cholesky(A)
    print("양정치")
except np.linalg.LinAlgError:
    print("양정치 아님")

# (ii) Eigenvalue 검사
vals = np.linalg.eigvalsh(A)  # 대칭 전용
print("양정치" if (vals > 0).all() else "양정치 아님")
```

`eigvalsh`는 대칭 전용 (Spectral theorem 활용, `eigvals`보다 빠르고 안정적).

---

## E-2. MVN 샘플링

```python
mu = np.array([1.0, 2.0])
Sigma = np.array([[2.0, 1.0], [1.0, 2.0]])

L = np.linalg.cholesky(Sigma)
N = 10000
z = np.random.randn(2, N)
X = L @ z + mu[:, None]

# 검증: 표본 평균·공분산
print(X.mean(axis=1))         # ~ [1.0, 2.0]
print(np.cov(X, bias=False))  # ~ Sigma
```

### NumPy 내장과 비교
```python
X2 = np.random.multivariate_normal(mu, Sigma, size=N).T
# 내장 함수도 내부적으로 Cholesky (또는 SVD) 사용
```

내장 함수의 정체가 Cholesky임을 손으로 재현.

---

## E-3. Ridge 정규화 풀이

```python
np.random.seed(0)
X = np.random.randn(100, 5)
beta_true = np.array([1, -2, 3, 0, 0])
y = X @ beta_true + 0.1 * np.random.randn(100)

# 정규방정식 + Ridge
lam = 0.1
A = X.T @ X + lam * np.eye(5)
b = X.T @ y

# Cholesky 풀이 (대칭 양정치 활용)
L = np.linalg.cholesky(A)
z = np.linalg.solve(L, b)        # L z = b
beta = np.linalg.solve(L.T, z)   # L^T beta = z
print(beta)
```

`np.linalg.solve`로 직접 풀어도 되지만, 대칭 양정치의 경우 Cholesky가 가장 효율적이다.

---

## E-4. 본 회차 핵심 5개

1. **이차형식** $\mathbf{x}^\top A \mathbf{x}$의 모양 = $A$의 Eigenvalue 부호 (양정치 ↔ 타원, 부정부호 ↔ 안장).
2. **양정치(positive definite)** ↔ 모든 $\lambda > 0$ ↔ $\mathbf{x}^\top A\mathbf{x} > 0$ ↔ leading minor $> 0$ ↔ $A = LL^\top$ (Cholesky).
3. **Cholesky 분해**는 대칭 양정치 전용, LU의 절반 비용, 유일성 보장.
4. **Hessian 양정치 = 강한 볼록**: 손실함수가 밥그릇, Newton·뉴턴류가 보장된 감소.
5. **MVN 샘플링**: $\mathbf{X} = L\mathbf{z} + \boldsymbol\mu$, VAE·Diffusion·Bayesian 추론의 표준 도구. **Ridge 정규화**의 양정치 보장이 곧 다중공선성 해소.

---

## E-5. 자기 점검 질문

- $A$가 양정치이면 $A^{-1}$도 양정치인가? (힌트: Eigenvalue가 $1/\lambda_i$로 변환.)
- $A, B$가 양정치이면 $A + B$도 양정치인가? $AB$는?
- $X^\top X$가 양정치가 되는 조건은? (열 일차독립.)
- Cholesky 분해의 유일성을 보장하는 조건은? ($L_{ii} > 0$, 양정치, 대칭.)
- 부정부호(indefinite) Hessian을 가지는 임계점의 이름은? (안장점, saddle point. Part 2 7회차에서 정식.)

---

<!-- _class: exercise -->

# 본 회차 마무리 문제 (즉석 풀이)

본 회차 사슬 (이차형식 → 양정치 → Cholesky → 응용)을 한 문제로 종합합니다.

$A = \begin{pmatrix} 4 & 2 & 0 \\ 2 & 5 & 1 \\ 0 & 1 & 3 \end{pmatrix}$가 주어졌다.

- **(a)** Sylvester 판정법으로 $A$가 양정치임을 확인하시오.
- **(b)** Cholesky 분해 $A = LL^\top$의 $L$을 구하시오.
- **(c)** 이차형식 $q(\mathbf{x}) = \mathbf{x}^\top A \mathbf{x}$를 전개해서 한 줄로 쓰시오 ($x_1, x_2, x_3$의 함수).
- **(d)** **MVN 응용**: 평균 $\boldsymbol\mu = \mathbf{0}$, 공분산 $\Sigma = A$를 가지는 다변량 정규분포에서 한 샘플을 만드는 NumPy 코드 한 줄을 적으시오 ($\mathbf{z}$가 표준 정규 샘플임을 가정).

---

<!-- _class: exercise -->

## 본 회차 마무리 문제: 답

- **(a)** $\det A_1 = 4 > 0$. $\det A_2 = 20 - 4 = 16 > 0$. $\det A_3 = 4(15-1) - 2(6-0) + 0 = 56 - 12 = 44 > 0$. 모두 양수 → **양정치**.

- **(b)** 1열: $L_{11} = 2, L_{21} = 1, L_{31} = 0$. 2열: $L_{22} = \sqrt{5-1} = 2, L_{32} = (1 - 0)/2 = 0.5$. 3열: $L_{33} = \sqrt{3 - 0 - 0.25} = \sqrt{2.75} = \sqrt{11}/2$.
$$L = \begin{pmatrix} 2 & 0 & 0 \\ 1 & 2 & 0 \\ 0 & 0.5 & \sqrt{11}/2 \end{pmatrix}$$

- **(c)** $q(\mathbf{x}) = 4x_1^2 + 5x_2^2 + 3x_3^2 + 4 x_1 x_2 + 2 x_2 x_3$.

- **(d)** `x = L @ z` (단, `z = np.random.randn(3)`). 즉 `x = np.linalg.cholesky(A) @ np.random.randn(3)`.

> **핵심**: 양정치 → Cholesky → MVN 샘플링의 한 줄 사슬이 본 회차 응용의 전부이다. 다음 회차는 **모든 행렬**에 적용 가능한 더 강한 분해, 즉 **SVD**를 다룬다.

---

<!-- _class: exercise -->

## 다음 회차 Review용 숙제

위 마무리 문제의 유사 문제이다. 강의 후 풀어 와서 **4회차 Review 시간**에 비교한다.

$A = \begin{pmatrix} 25 & 15 & -5 \\ 15 & 18 & 0 \\ -5 & 0 & 11 \end{pmatrix}$가 주어졌다.

- (a) Sylvester 판정법으로 양정치 확인.
- (b) Cholesky $A = LL^\top$의 $L$ 구하기.
- (c) **새 예고**: SVD의 핵심 사실 $A^\top A$의 Eigenvalue가 $\sigma_i^2$. 본 회차 행렬 $A$가 대칭 양정치라면 $A^\top A = A^2$의 Eigenvalue는 $A$의 Eigenvalue의 제곱이다. (a)의 행렬에 대해 $\lambda^2$들이 양수임을 확인하고 (대각화 없이 trace·det 활용 가능), SVD의 $\sigma_i$ 후보를 추정해보시오.

### 자기 점검
- (c)는 4회차 SVD 준비 운동이다. $\sigma_i$ = $A^\top A$의 Eigenvalue의 양의 제곱근, 대칭 양정치의 경우 $\sigma_i = \lambda_i$로 일치.

---

## E-6. 과제 안내

`04_과제/Part2/03회차_homework.md`, 마감: 4회차 시작 전

**수학 30점**
- 양정치 판정 (Sylvester·Eigenvalue·이차형식 직접), 5문제
- Cholesky 손풀이 $2\times 2, 3\times 3$, 5문제
- 이차형식 등위면 식별 (타원·쌍곡선·공집합), 3문제
- Ridge 정규화의 양정치 보장 증명, 2문제

**코딩 20점**
- NumPy `cholesky`·`eigvalsh`로 양정치 판정 함수 구현
- MVN 샘플링 직접 구현, `multivariate_normal`과 분포 비교
- Ridge 회귀 Cholesky 풀이, 정규방정식 풀이와 결과 일치 확인
- **보너스**: Hessian이 양정치인 2D 볼록 함수의 Newton 한 스텝 시각화

---

## E-7. 다음 회차 (4회차) 예고

**주제**: SVD (Singular Value Decomposition, 특이값 분해)·기하 해석

**연결**: 본 회차에서 본 양정치는 **대칭, 모든 $\lambda > 0$**의 특별한 경우. SVD는 **모든 행렬** (정방·직사각·대칭·비대칭 무관)에 적용되는 **가장 일반적인 분해**이다. $A = U\Sigma V^\top$ 한 식이 양정치·LU·QR·고유분해를 모두 포섭한다. Strang Ch 7의 시그니처 **회전·신축·회전** 기하 해석을 한 회차에 집중한다.

**사전 reading**:
- MML §4.5 (Singular Value Decomposition)
- Strang Ch 7.1-7.2 (Image of the Unit Sphere·SVD geometry)

---

# 부록: Sylvester 판정법 증명 (자율)

**본 회차 본문은 진술까지**. 증명 골자만 부록에 둔다.

### 증명 (귀납, $n$에 대해)
$n = 1$ 자명. $n \ge 2$ 가정. $A$를 블록으로 $\begin{pmatrix} A_{n-1} & \mathbf{b} \\ \mathbf{b}^\top & c \end{pmatrix}$로 쓰면, $A_{n-1}$이 양정치 (귀납 가정) → Cholesky $A_{n-1} = L_{n-1}L_{n-1}^\top$ 존재. $A$의 Cholesky가 가능할 필요충분조건은 Schur complement $c - \mathbf{b}^\top A_{n-1}^{-1} \mathbf{b} > 0$, 이것이 $\det A / \det A_{n-1} > 0$, 즉 $\det A > 0$과 동치. ∎

# 부록: 추천 연습문제

| 출처 | 주제 | 난도 |
|---|---|:---:|
| Strang Ch 6.5 Problem 1-5 | 양정치 판정 | 하 |
| Strang Ch 6.5 Problem 9-12 | Cholesky 손풀이 | 중 |
| MML §4.3 Exercise 4.11-4.12 | 대칭 양정치 성질 | 중 |
| Strang Ch 6.5 Problem 17-19 | 이차형식 등위면 | 중 |
| Strang Ch 6.5 Problem 21-23 | Ridge·정규화 | 상 |

---

<!-- _class: lead -->

# Q & A

본 회차 사슬:
**이차형식 → 양정치(positive definite, $\succ 0$) → Cholesky $A = LL^\top$ → Hessian·MVN·Ridge**

핵심 한 줄: **양정치 = 모든 방향에서 양수 = 밥그릇 = Cholesky 가능, 한 정리의 다섯 동치 진술이 본 회차의 전부이다.**

다음 회차의 출발 문제:
> 비정방·비대칭 행렬에도 일반화되는 **모든 행렬의 분해**는 무엇입니까?

`HANDOUT`: 본 PDF, `Part2_03_양정치_Cholesky_MVN.ipynb`
