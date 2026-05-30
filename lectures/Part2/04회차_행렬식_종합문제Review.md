---
marp: true
theme: default
paginate: true
header: '인공지능 전공자를 위한 선형대수학'
footer: 'Part 2 4회차 · Determinant·Part 1·Part 2 전반 종합 문제 Review'
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
  .strang { background: #EEF2FF; border-left: 4px solid #6366F1; padding: 10px 16px; margin: 12px 0;
            font-size: 19px; color: #3730A3; border-radius: 0 8px 8px 0; }
  .strang strong { color: #4338CA; }
  .review { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 10px 16px; margin: 12px 0;
            font-size: 19px; color: #78350F; border-radius: 0 8px 8px 0; }
  .review strong { color: #92400E; }
---

<!-- _class: lead -->
<!-- _paginate: false -->

# Part 2 · 4회차: **Part 1·Part 2 전반 종합 회차**

## Determinant(행렬식) + Part 1·Part 2 전반 종합 문제 Review

MML §4.1 (메인) · **Strang Ch 5.1-5.3 (signed volume·Leibniz·Cofactor 시그니처 발췌)** · Part 2 (LA2)

> **시각 보조 (EoLA):** [EoLA Ch.6: The determinant](https://www.youtube.com/watch?v=Ip3X9LOh2dk)

본 회차 후반은 **사전 공개된 Part 1·Part 2 전반 종합 문제 풀이를 함께 Review**합니다. 학생은 본 회차 전에 종합 문제 (05_시험/Part1_Part2전반_종합문제Review.md)를 본인 페이스로 풀어 와서, 본 회차에 모두 함께 풀이를 짚어 봅니다. Part 1 1-8회차와 Part 2 1-3회차의 핵심 객체가 한 줄기로 어떻게 엮이는지 한 자리에서 종합합니다.

---

<!-- _class: exercise -->

# Review: 3회차 마무리 숙제

지난 회차의 세 문제:

> **문제 1**: $A \in \mathbb{R}^{4 \times 2}$의 QR 분해 (Hadamard 류). **문제 2**: $R_{60°}$, $R_{60°} R_{120°} = R_{180°}$. **문제 3**: Householder reflection.

### 답 (요지)

- **문제 1**: $\mathbf{q}_1 = (1, -1, 1, -1)^\top/2$, $r_{11} = 2$. $\mathbf{q}_1^\top \mathbf{a}_2 = (1 - 1 - 1 + 1)/2 = 0$이므로 $\mathbf{v}_2 = \mathbf{a}_2$. $\mathbf{q}_2 = (1, 1, -1, -1)^\top/2$, $r_{22} = 2$. $R = 2I_2$. **두 열이 이미 직교**.
- **문제 2**: $R_{60°} = \begin{pmatrix} 0.5 & -\sqrt{3}/2 \\ \sqrt{3}/2 & 0.5 \end{pmatrix}$. $(2, 0)^\top \mapsto (1, \sqrt{3})^\top$. $R_{60°} R_{120°}$ 직접 곱 = $R_{180°} = \begin{pmatrix} -1 & 0 \\ 0 & -1 \end{pmatrix}$ ✓
- **문제 3**: $H = I - 2\mathbf{v}\mathbf{v}^\top = \begin{pmatrix} 0 & -1 \\ -1 & 0 \end{pmatrix}$. $H\mathbf{v} = -\mathbf{v}$ ✓. $H(1, -1)^\top = (1, -1)^\top$ ✓.

---

<!-- _class: exercise -->

# Review: 핵심 관찰

3회차 문제 1에서 본 것: $A$의 두 열이 **이미 직교**이면 Gram-Schmidt가 정규화만 한다 (각도 보정 0). 이 관찰이 본 회차 행렬식의 한 면을 미리 보여준다.

- $\det A = ?$ 이 행렬에서는 $A^\top A = 4 I_2$ ($Q^\top Q = I$ + scaling). 만약 $A$가 $4 \times 4$ 완전 Hadamard였다면 $\det = \pm 4^{2}$ 류 ($\sqrt{\det(A^\top A)}$가 두 열로 만든 평행사변형 면적).
- 3회차의 $\det R_\theta = 1$이 이미 행렬식이 **부피 (또는 면적)**라는 본 회차 핵심 직관을 보여 줬다.

→ 본 회차는 행렬식의 세 정의를 한 자리에 정리하고, 그 뒤 Part 1 1-8회차·Part 2 1-3회차의 모든 객체를 한 줄기로 종합한다.

---

## 본 회차 핵심 질문

> ### 한 정사각 행렬에 "**부호 있는 부피**"를 어떻게 정의하고, 그것이 가역성·LU·Eigen·SVD까지 어떻게 이어지는지 한 자리에서 봅니까?

이 한 질문이 본 회차 전반부의 모든 결과이며, 후반부는 Part 1·Part 2 전반 종합 문제 Review입니다.

### 후반부 종합 풀기의 목적

> 사전에 공개된 종합 문제를 본인이 풀어 와서 함께 Review하는 자기 점검 활동입니다. Part 1 1-8회차·Part 2 1-3회차의 핵심 객체 (Vector·Norm·Matrix·Linear equation·Vector space·4 fundamental subspaces·Projection·Least squares·QR·Determinant)가 한 풀이 안에서 어떻게 자연스럽게 만나는지 모두 함께 봅니다.

---

## 학습 목표

이번 회차가 끝나면 학생은 다음을 답할 수 있어야 합니다.

1. **Determinant**의 세 정의 (Leibniz 순열·Cofactor·LU 곱)를 진술하고 작은 행렬에서 손계산할 수 있습니다.
2. Determinant가 **signed volume** (부호 있는 부피)임을 진술하고 2D·3D에서 보일 수 있습니다.
3. $\det A \ne 0 \iff A$ 가역 $\iff$ 열 일차독립 $\iff$ rank $= n$의 **동치 사슬**을 진술할 수 있습니다.
4. $\det(AB) = \det A \cdot \det B$, $\det A^\top = \det A$, $\det A^{-1} = 1/\det A$를 진술할 수 있습니다.
5. **Part 1·Part 2 전반 종합 풀기**: 한 데이터 행렬에 Part 1 1-8회차·Part 2 1-3회차의 도구를 차례로 적용해 회귀·정사영·QR·rank 판정·기하 해석을 한 흐름으로 수행할 수 있습니다.

---

## 본 회차 학습 흐름 (전반부)

| 질문 | 답 (이 강의의 답) | 도구 |
|---|---|---|
| 행렬에 "부피"를? | **Determinant** $\det A$ | 한 Scalar |
| 가장 기하적인 정의? | **Signed volume** | Strang 시그니처 |
| 정식 정의? | **Leibniz** $\sum_{\sigma} \mathrm{sgn}(\sigma) \prod a_{i,\sigma(i)}$ | 순열 합 |
| 재귀 정의? | **Cofactor expansion** | 한 행·한 열 |
| 계산 정의? | **LU 곱** $\prod u_{ii}$ | 5회차 LU |
| 곱셈성? | $\det(AB) = \det A\, \det B$ | 본 회차 정리 |
| 가역의 동치? | $\det A \ne 0$ | Part 1 4·5·8회차 통합 |
| Part 2 후반부로? | **Eigenvalue**의 부호·곱 | 5회차 |

---

## 수업 흐름

| 순서 | 블록 | 내용 |
|:---:|:---:|---|
| ① | A | **오프닝**: 핵심 질문 + 3회차 Review |
| ② | B | **Determinant**: signed volume 직관 + 정식 정의 세 가지 (Strang 시그니처 발췌) |
| ③ | C | **성질·동치 사슬**: $\det(AB)$, 가역 ⟺ $\det \ne 0$ |
| ④ | **D** | **사전 공개된 Part 1·Part 2 전반 종합 문제, 함께 Review** (Part 1 1-8회차·Part 2 1-3회차 통합) |
| ⑤ | E | **클로징**: Part 1·Part 2 전반 한 줄 요약 + Part 2 후반부 예고 |

> **B·C가 행렬식 정식 교육, D가 Part 1·Part 2 전반 종합 학습.**

---

# B. 수학 1: Determinant(행렬식)의 세 정의

> 한 정사각 행렬에 "부피·가역성"을 측정하는 한 Scalar를 부여한다. 세 정의가 같은 결과를 준다.

## B-1. Signed Volume(부호 있는 부피) 직관 (Strang 시그니처)

<div class="strang">

**Strang Ch 5.1 시그니처 발췌: Signed volume**

Strang의 §5.1은 행렬식을 **공리적으로** 도입한다. 한 함수 $\det: \mathbb{R}^{n\times n} \to \mathbb{R}$이 다음 세 공리를 만족해야 한다.

1. **(D1)** $\det I = 1$
2. **(D2)** 두 행을 교환하면 부호가 바뀐다 (alternating)
3. **(D3)** 각 행에 대해 다선형 (multilinear)

이 세 공리에서 $n$차원 평행육면체 (parallelepiped)의 **부호 있는 부피**가 자동으로 결정된다. 양의 부호 = 오른손계, 음의 부호 = 거울 뒤집힘 (반사).

2D의 경우 두 열 Vector로 만든 **평행사변형 면적**, 3D는 세 열 Vector로 만든 **평행육면체 부피**이다.

</div>

### 한 줄 정의 (signed volume)
$\det A$ = $A$의 열 Vector들이 만든 $n$차원 평행육면체의 부호 있는 부피.

---

## B-2. 2D·3D 예시

### 2D
$A = \begin{pmatrix} a & c \\ b & d \end{pmatrix}$. 두 열 $(a, b)^\top, (c, d)^\top$로 만든 평행사변형 면적:

$$\det A = ad - bc.$$

**부호**: 두 열이 시계 반대 방향 (오른손계)이면 양수, 시계 방향이면 음수.

### 3D
$A \in \mathbb{R}^{3 \times 3}$이면 세 열로 만든 평행육면체의 부피:

$$\det A = \mathbf{a}_1 \cdot (\mathbf{a}_2 \times \mathbf{a}_3).$$

(외적·삼중곱, 6회차 도입 정의의 일반화)

### 시각적 확인
$A = I_2$의 두 열은 단위 정사각형 → 면적 1. $\det I = 1$ ✓
$A$의 한 열을 2배로 늘리면 평행사변형 면적도 2배. (multilinearity)
두 열을 같게 두면 평행사변형이 직선이 되어 면적 0. (alternating)

---

## B-3. 정식 정의 1: Leibniz Formula(라이프니츠 공식)

<div class="strang">

**Strang Ch 5.2 발췌: Leibniz 순열 공식**

$$\boxed{\det A = \sum_{\sigma \in S_n} \mathrm{sgn}(\sigma) \prod_{i=1}^n a_{i, \sigma(i)}}$$

여기서 $S_n$은 $\{1, \ldots, n\}$의 **모든 순열**의 집합 ($n!$개), $\mathrm{sgn}(\sigma)$는 순열의 **부호** ($\pm 1$, 교환 횟수 패리티).

</div>

### 예: $2 \times 2$
순열 $(1, 2), (2, 1)$ 두 가지. 부호 $+1, -1$.
$\det A = +a_{11} a_{22} - a_{12} a_{21} = ad - bc$.

### 예: $3 \times 3$ (사루스 공식)
순열 6개. 부호 +,+,+,−,−,−.
$\det A = a_{11}a_{22}a_{33} + a_{12}a_{23}a_{31} + a_{13}a_{21}a_{32} - a_{13}a_{22}a_{31} - a_{12}a_{21}a_{33} - a_{11}a_{23}a_{32}$.

### 명제 11.1 (Leibniz의 한계)
계산량 $O(n!)$. $n = 10$이면 약 $3.6 \times 10^6$, $n = 20$이면 $2.4 \times 10^{18}$. **수치 계산 불가**. 이론적 정의로 쓰고 실전 계산은 다음 두 방법.

---

## B-4. 정식 정의 2: Cofactor Expansion(여인자 전개)

<div class="strang">

**Strang Ch 5.3 발췌: Cofactor expansion**

한 행 (또는 한 열)으로 행렬식을 **재귀적으로** 전개:

$$\det A = \sum_{j=1}^n (-1)^{i+j}\, a_{ij}\, M_{ij},$$

여기서 $M_{ij}$는 $i$행·$j$열을 지운 $(n-1) \times (n-1)$ 부행렬의 행렬식 (**minor**). $(-1)^{i+j} a_{ij}$ 부호 패턴이 체스판 무늬.

</div>

### 예: $3 \times 3$ (첫 행 전개)
$\det \begin{pmatrix} a_{11} & a_{12} & a_{13} \\ a_{21} & a_{22} & a_{23} \\ a_{31} & a_{32} & a_{33} \end{pmatrix} = a_{11} M_{11} - a_{12} M_{12} + a_{13} M_{13}$.

### 활용
- 0이 많은 행·열을 선택하면 계산이 단순화.
- 재귀이므로 $n \times n$ → 여러 $(n-1)\times(n-1)$ → … → $2\times 2$.
- 계산량 $O(n!)$이라 Leibniz와 본질적으로 같음.

---

## B-5. 정식 정의 3: LU 곱 (실전 계산)

### 정리 12.1 (행렬식과 LU)
$A = LU$이면 (5회차의 LU 분해)

$$\det A = \det L \cdot \det U = 1 \cdot \prod_{i=1}^n u_{ii} = \prod_{i=1}^n u_{ii}.$$

($L$은 단위 하삼각이라 대각 1, 상삼각 $U$의 대각곱이 행렬식).

### 행 교환이 있을 때
$PA = LU$이면 $\det P \cdot \det A = \det U$이므로 $\det A = (-1)^{p} \prod u_{ii}$, $p$는 교환 횟수.

### 계산량
Gaussian elimination이 $O(n^3)$이므로 행렬식도 $O(n^3)$. **실전 표준 방법**.

### NumPy
`np.linalg.det(A)` 내부는 LU 분해 기반.

---

## B-6. 세 정의의 비교

| 정의 | 용도 | 계산량 |
|---|---|---|
| **Signed volume** (B-1) | 기하 직관 · 공리 도입 | — |
| **Leibniz** (B-3) | 이론 증명 · 다항식 표현 | $O(n!)$ |
| **Cofactor** (B-4) | 작은 $n$ 손계산 · 재귀 증명 | $O(n!)$ |
| **LU 곱** (B-5) | 실전 수치 계산 | $O(n^3)$ |

세 정의가 **같은 값**을 준다는 사실 자체가 한 정리이다 (Strang의 공리적 접근에서는 세 공리가 유일성을 보장).

---

# C. 수학 2: Determinant의 성질과 동치 사슬

> 행렬식의 한 줄짜리 핵심 성질이 가역성·rank·LU·Eigen 모두와 연결된다.

## C-1. 다섯 가지 본질 성질

### 정리 12.2 (Determinant의 다섯 성질)
정사각 $A, B \in \mathbb{R}^{n \times n}$에 대해:

1. **곱셈성**: $\det(AB) = \det A \cdot \det B$.
2. **전치 불변**: $\det A^\top = \det A$.
3. **역행렬**: $A$ 가역 ⟺ $\det A \ne 0$, $\det(A^{-1}) = 1/\det A$.
4. **Scalar곱**: $\det(cA) = c^n \det A$ (각 행에 $c$ 곱하면 부피가 $c^n$ 배).
5. **삼각행렬**: $\det = \prod u_{ii}$ (대각 곱).

### 핵심 한 줄
$\det$는 **부피의 곱셈성**을 만족하는 유일한 (스칼라까지) 함수이다. 두 변환의 합성 → 부피 변화율의 곱.

---

## C-2. 가역성의 통합 동치 사슬

### 정리 12.3 (Part 1·Part 2 전반 통합 동치)
$A \in \mathbb{R}^{n \times n}$에 대해 다음이 모두 동치이다:

1. $A$가 가역 (Part 1 5회차)
2. $A\mathbf{x} = \mathbf{0}$의 해가 $\mathbf{x} = \mathbf{0}$뿐 (Part 1 4회차)
3. $A$의 열이 일차독립 (Part 1 8회차)
4. $A$의 열이 $\mathbb{R}^n$의 basis (Part 1 8회차)
5. $A$의 RREF가 $I_n$ (Part 1 4회차)
6. $\mathrm{rank}(A) = n$ (Part 1 8회차)
7. $C(A) = \mathbb{R}^n$ (Part 1 7회차)
8. $N(A) = \{\mathbf{0}\}$ (Part 1 6회차)
9. $A^\top A$가 양정부호 (Part 2 2회차)
10. $\det A \ne 0$ (**본 회차**)

### 한 줄 요약
$\det A \ne 0$이 위 9가지 사실의 **한 Scalar 측정**이며, 이것이 행렬식의 핵심 의미이다.

---

## C-3. 응용: 작은 행렬의 가역성 빠른 판정

### 예 1: $A = \begin{pmatrix} 2 & 1 \\ 4 & 3 \end{pmatrix}$
$\det A = 6 - 4 = 2 \ne 0$ → 가역. 두 열 일차독립.

### 예 2: $A = \begin{pmatrix} 1 & 2 & 3 \\ 2 & 4 & 6 \\ 1 & 1 & 2 \end{pmatrix}$
첫 두 행이 비례 ($R_2 = 2 R_1$) → $\det = 0$ → 특이 (singular). 행 일차종속.

### 예 3: 3회차 회전 행렬
$\det R_\theta = \cos^2 + \sin^2 = 1$. 항상 가역, 부피 보존.

---

## C-4. Part 2 후반부·Part 3·Part 4 미리보기 (간략)

| 본 회차 도구 | 다음 사용 |
|---|---|
| $\det A$ | **Part 2 5회차** 특성다항식 $\det(A - \lambda I) = 0$에서 eigenvalue |
| $\det = \prod \lambda_i$ | **Part 2 5회차** eigenvalue 합·곱 공식 |
| $\det Q = \pm 1$ | **Part 2 8회차** SVD의 $U, V$가 직교 행렬 |
| Signed volume | **Part 3 1회차** 다변수 적분의 Jacobian |
| 변환 후 부피 변화율 | **Part 4 9회차** Normalizing flow의 log-det |

→ **행렬식은 한 줄 정의로 Part 2 후반부·Part 3·Part 4 전반의 도구가 된다.**

---

<!-- _class: exercise -->

# 잠깐 풀어보기: 행렬식 손계산

### 문제 1
$A = \begin{pmatrix} 1 & 2 & 0 \\ 3 & 1 & 4 \\ 2 & 0 & 1 \end{pmatrix}$의 행렬식을 (a) Cofactor (첫 행), (b) LU 곱 두 방법으로 구하시오.

### 문제 2
$A = \begin{pmatrix} 2 & 0 & 0 \\ 1 & 3 & 0 \\ 4 & -1 & 5 \end{pmatrix}$의 행렬식.

### 문제 3
$B = \begin{pmatrix} 2 & 1 \\ -1 & 2 \end{pmatrix}$. $\det B$, $\det B^2$, $\det B^{-1}$을 구하시오.

---

<!-- _class: exercise -->

## 잠깐 풀어보기: 답

### 문제 1: (a) Cofactor
$\det = 1\cdot(1 - 0) - 2\cdot(3 - 8) + 0 = 1 - 2(-5) = 1 + 10 = 11$.

### 문제 1: (b) LU
$R_2 \leftarrow R_2 - 3R_1, R_3 \leftarrow R_3 - 2R_1$:
$\begin{pmatrix} 1 & 2 & 0 \\ 0 & -5 & 4 \\ 0 & -4 & 1 \end{pmatrix}$.
$R_3 \leftarrow R_3 - (4/5)R_2$:
$\begin{pmatrix} 1 & 2 & 0 \\ 0 & -5 & 4 \\ 0 & 0 & 1 - 16/5 \end{pmatrix} = \begin{pmatrix} 1 & 2 & 0 \\ 0 & -5 & 4 \\ 0 & 0 & -11/5 \end{pmatrix}$.
$\det = 1\cdot(-5)\cdot(-11/5) = 11$ ✓

### 문제 2
하삼각이므로 $\det = 2 \cdot 3 \cdot 5 = 30$.

### 문제 3
$\det B = 4 - (-1) = 5$. $\det B^2 = 25$. $\det B^{-1} = 1/5$.

> **메시지**: Cofactor는 작은 $n$에 직관적, LU는 큰 $n$에 표준. 두 결과가 항상 일치한다.

---

# D. Part 1·Part 2 전반 종합 문제 Review (Part 1 1-8회차·Part 2 1-3회차 통합)

<div class="review">

**운영 안내**: 본 D 섹션은 **사전 공개된 종합 문제를 본인 페이스로 풀어 와서 함께 Review하는 자기 점검 활동**입니다.

**목적**: Part 1 1-8회차·Part 2 1-3회차의 핵심 객체 (Vector·Norm·Matrix·Linear equation·LU·Vector space·Subspace·4 fundamental subspaces·Orthogonality·Projection·Least squares·QR·Determinant)가 한 흐름의 풀이 안에서 어떻게 자연스럽게 만나는지를 함께 풀이로 짚어 보는 자리입니다.

본 자리에서 한 데이터 행렬 한 개를 두고 Part 1 1-8회차·Part 2 1-3회차의 모든 도구를 차례로 통과시킵니다.

</div>

---

## D-1. 종합 문제 설정

### 데이터

5개 관측 $(t_i, y_i)$:

| $i$ | $t_i$ | $y_i$ |
|:---:|:---:|:---:|
| 1 | 0 | 1 |
| 2 | 1 | 3 |
| 3 | 2 | 4 |
| 4 | 3 | 5 |
| 5 | 4 | 8 |

### 모형
$y = x_1 + x_2 \, t$ (직선 회귀).

### 풀이 행렬

$$A = \begin{pmatrix} 1 & 0 \\ 1 & 1 \\ 1 & 2 \\ 1 & 3 \\ 1 & 4 \end{pmatrix} \in \mathbb{R}^{5 \times 2}, \quad \mathbf{b} = \begin{pmatrix} 1 \\ 3 \\ 4 \\ 5 \\ 8 \end{pmatrix} \in \mathbb{R}^5.$$

---

## D-2. Part 1 1·2회차 (Vector·Norm·Dot product)

### Vector·Linear combination
$A\mathbf{x} = x_1 (1,1,1,1,1)^\top + x_2 (0, 1, 2, 3, 4)^\top$.

→ $A\mathbf{x}$가 두 열의 **Linear combination**. (Part 1 1회차)

### Norm
$\|\mathbf{b}\|^2 = 1 + 9 + 16 + 25 + 64 = 115$, $\|\mathbf{b}\| = \sqrt{115}$. (Part 1 2회차)

### Dot product
두 열의 내적: $\mathbf{1}^\top \mathbf{t} = 0+1+2+3+4 = 10$. 자기 내적: $\mathbf{1}^\top\mathbf{1} = 5$, $\mathbf{t}^\top \mathbf{t} = 0+1+4+9+16 = 30$. (Part 1 2회차)

### Cosine
두 열 사이 cos: $\cos\theta = 10/(\sqrt{5}\cdot\sqrt{30}) = 10/\sqrt{150} \approx 0.816$. (Part 1 2회차)

→ 두 열이 같은 방향이 아니라는 사실이 **다중공선성 없음**의 신호.

---

## D-3. Part 1 3회차 (Matrix·Vector 곱 두 해석)

### Row picture
$(A\mathbf{x})_i = $ ($A$의 $i$행) · $\mathbf{x}$. 각 행이 한 관측의 예측값.
예: $(A\mathbf{x})_3 = (1, 2)\cdot(x_1, x_2) = x_1 + 2x_2$.

### Column picture
$A\mathbf{x} = x_1 \mathbf{1} + x_2 \mathbf{t}$. 두 열의 가중합.

→ 본 회차에서 두 해석이 모두 자연스럽게 쓰인다. Row가 한 관측의 예측, Column이 모형의 표현력 ($C(A)$).

---

## D-4. Part 1 4회차 (Gauss·RREF): $A\mathbf{x} = \mathbf{b}$의 해 존재

### RREF로 판정

$$[A \mid \mathbf{b}] = \left[\begin{array}{cc|c} 1 & 0 & 1 \\ 1 & 1 & 3 \\ 1 & 2 & 4 \\ 1 & 3 & 5 \\ 1 & 4 & 8\end{array}\right]$$

행 연산 $R_i \leftarrow R_i - R_1$ ($i = 2, 3, 4, 5$):

$$\left[\begin{array}{cc|c} 1 & 0 & 1 \\ 0 & 1 & 2 \\ 0 & 2 & 3 \\ 0 & 3 & 4 \\ 0 & 4 & 7\end{array}\right]$$

$R_3 \leftarrow R_3 - 2R_2$, $R_4 \leftarrow R_4 - 3R_2$, $R_5 \leftarrow R_5 - 4R_2$:

$$\left[\begin{array}{cc|c} 1 & 0 & 1 \\ 0 & 1 & 2 \\ 0 & 0 & -1 \\ 0 & 0 & -2 \\ 0 & 0 & -1\end{array}\right]$$

→ $\mathbf{b}$ 열에 pivot이 있는 행 ($-1, -2, -1$이 0이 아님) → **$A\mathbf{x} = \mathbf{b}$ 정확한 해 없음** (관측이 정확한 직선 위가 아님).

이것이 **Part 2 2회차 최소제곱이 필요한 이유**.

---

## D-5. Part 1 5회차 (LU 분해): $A^\top A$의 LU

### $A^\top A$ 먼저 계산
$A^\top A = \begin{pmatrix} 5 & 10 \\ 10 & 30 \end{pmatrix}$, $A^\top \mathbf{b} = (21, 56)^\top$.

### LU 분해
$R_2 \leftarrow R_2 - 2 R_1$: $\begin{pmatrix} 5 & 10 \\ 0 & 10 \end{pmatrix}$.

$L = \begin{pmatrix} 1 & 0 \\ 2 & 1 \end{pmatrix}$, $U = \begin{pmatrix} 5 & 10 \\ 0 & 10 \end{pmatrix}$.

검증: $LU = \begin{pmatrix} 5 & 10 \\ 10 & 30 \end{pmatrix}$ ✓ (Part 1 5회차)

### 결과 활용
$\det(A^\top A) = 5 \cdot 10 = 50$ (본 회차 LU 곱). 0이 아님 → $A^\top A$ 가역 → 본 회차 최소제곱 닫힌 해 존재.

---

## D-6. Part 1 6·7·8회차 (Vector space·Subspace·4 부분공간): 4 fundamental subspaces

| 부분공간 | 차원 | basis | 위치 |
|---|:---:|---|---|
| $C(A)$ | 2 | $\{\mathbf{1}, \mathbf{t}\}$ | $\mathbb{R}^5$ |
| $N(A)$ | 0 | $\{\}$ | $\mathbb{R}^2$ |
| $C(A^\top)$ | 2 | 5개 행 중 두 일차독립 행 | $\mathbb{R}^2$ |
| $N(A^\top)$ | 3 | (D-7에서 구함) | $\mathbb{R}^5$ |

차원 정리: $\dim C(A) + \dim N(A) = 2 + 0 = 2 = n$ ✓ (Part 1 8회차)

$\dim C(A) + \dim N(A^\top) = 2 + 3 = 5 = m$ ✓ (Part 1 8회차)

→ rank = 2 (정확히 Part 1 5회차 LU에서 살아남은 행 수와 일치).

---

## D-7. Part 2 1회차 (Projection·직교 보완)

### 4 fundamental subspaces 직교 짝 (Part 2 1회차)
$\mathbf{b} \in \mathbb{R}^5 = C(A) \oplus N(A^\top)$.

$\mathbf{b}$의 $C(A)$ 정사영을 구한다.

### Projection matrix
$P = A(A^\top A)^{-1} A^\top$.

$(A^\top A)^{-1} = \dfrac{1}{50}\begin{pmatrix} 30 & -10 \\ -10 & 5 \end{pmatrix}$.

$P$를 직접 곱하는 대신 다음 D-8에서 정사영과 최소제곱 해를 한 번에 얻는다.

### 잔차의 위치
잔차 $\mathbf{e}$는 $N(A^\top)$에 위치할 것 (Part 2 1회차 정리). 즉 $A^\top \mathbf{e} = \mathbf{0}$이어야 한다.

---

## D-8. Part 2 2회차 (Least squares): 시그니처 풀이 적용

### $A^\top \mathbf{b}$
$\mathbf{1}^\top \mathbf{b} = 1+3+4+5+8 = 21$.
$\mathbf{t}^\top \mathbf{b} = 0\cdot 1 + 1\cdot 3 + 2\cdot 4 + 3\cdot 5 + 4\cdot 8 = 58$.
$A^\top \mathbf{b} = (21, 58)^\top$.

### Normal equation
$$\begin{pmatrix} 5 & 10 \\ 10 & 30 \end{pmatrix} \hat{\mathbf{x}} = \begin{pmatrix} 21 \\ 58 \end{pmatrix}.$$

### 풀이
$(A^\top A)^{-1} = \dfrac{1}{50}\begin{pmatrix} 30 & -10 \\ -10 & 5 \end{pmatrix}$.
$\hat{\mathbf{x}} = \dfrac{1}{50}(30\cdot 21 - 10\cdot 58,\; -10\cdot 21 + 5\cdot 58)^\top = \dfrac{1}{50}(630-580,\; -210+290)^\top = \dfrac{1}{50}(50, 80)^\top = (1.0, 1.6)^\top$.

### 최적 직선
$$\boxed{\hat{y} = 1.0 + 1.6\, t.}$$

### 예측·잔차·검증
$\mathbf{p} = A\hat{\mathbf{x}} = (1.0, 2.6, 4.2, 5.8, 7.4)^\top$.
$\mathbf{e} = \mathbf{b} - \mathbf{p} = (0, 0.4, -0.2, -0.8, 0.6)^\top$.
손실 $L = \|\mathbf{e}\|^2 = 0 + 0.16 + 0.04 + 0.64 + 0.36 = 1.2$.

직각 검증: $\mathbf{1}^\top \mathbf{e} = 0+0.4-0.2-0.8+0.6 = 0$ ✓, $\mathbf{t}^\top \mathbf{e} = 0+0.4-0.4-2.4+2.4 = 0$ ✓

> **검산 요령**: $A^\top \mathbf{b}$의 두 번째 성분 ($\mathbf{t}^\top \mathbf{b} = 58$)에서 흔히 산술 실수가 난다. 마지막의 $A^\top \mathbf{e} = \mathbf{0}$ 검증이 풀이 전체의 안전장치이다.

---

## D-9. Part 2 3회차 (QR): 같은 문제를 QR로

### Gram-Schmidt
$\mathbf{a}_1 = \mathbf{1} = (1,1,1,1,1)^\top$, $\|\mathbf{a}_1\| = \sqrt{5}$. $\mathbf{q}_1 = \mathbf{1}/\sqrt{5}$. $r_{11} = \sqrt{5}$.

$\mathbf{a}_2 = \mathbf{t} = (0,1,2,3,4)^\top$. $\mathbf{q}_1^\top \mathbf{a}_2 = (0+1+2+3+4)/\sqrt{5} = 10/\sqrt{5} = 2\sqrt{5}$. $r_{12} = 2\sqrt{5}$.

$\mathbf{v}_2 = \mathbf{t} - 2\sqrt{5}\cdot \mathbf{q}_1 = \mathbf{t} - 2\cdot \mathbf{1} = (-2, -1, 0, 1, 2)^\top$. $\|\mathbf{v}_2\| = \sqrt{4+1+0+1+4} = \sqrt{10}$. $r_{22} = \sqrt{10}$.

$\mathbf{q}_2 = (-2, -1, 0, 1, 2)^\top/\sqrt{10}$.

### QR
$R = \begin{pmatrix} \sqrt{5} & 2\sqrt{5} \\ 0 & \sqrt{10} \end{pmatrix}$.

$Q^\top \mathbf{b}$:
- $\mathbf{q}_1^\top \mathbf{b} = (1+3+4+5+8)/\sqrt{5} = 21/\sqrt{5}$
- $\mathbf{q}_2^\top \mathbf{b} = (-2 - 3 + 0 + 5 + 16)/\sqrt{10} = 16/\sqrt{10}$

### 후방 대입
$\sqrt{10}\, \hat{x}_2 = 16/\sqrt{10} \;\Rightarrow\; \hat{x}_2 = 16/10 = 1.6$ ✓
$\sqrt{5}\,\hat{x}_1 + 2\sqrt{5}\cdot 1.6 = 21/\sqrt{5} \;\Rightarrow\; \hat{x}_1 = 21/5 - 2\cdot 1.6 = 4.2 - 3.2 = 1.0$ ✓

→ **QR 풀이와 Part 2 2회차 정규방정식 풀이가 같은 $\hat{\mathbf{x}} = (1.0, 1.6)^\top$.**

---

## D-10. 본 회차 (Determinant): 모든 단계의 행렬식 확인

| 단계 | 행렬식 | 의미 |
|---|---|---|
| $A^\top A$ (D-5) | $5\cdot 10 = 50$ | 가역 (≠ 0) ⟹ 닫힌 해 |
| LU의 $U$ | $5 \cdot 10 = 50$ | 위와 일치 |
| QR의 $R$ | $\sqrt{5}\cdot \sqrt{10} = \sqrt{50}$ | $\det(A^\top A) = \det R^\top R = (\det R)^2 = 50$ ✓ |

### 핵심 관찰
- $\det(A^\top A) = (\det R)^2 = 50$이 두 풀이 (정규방정식·QR)의 일관성을 한 줄로 확인한다.
- $\det \ne 0$이 본 회차 동치 사슬의 한 점이며, $A$의 두 열 일차독립 ⟺ $\mathrm{rank}(A) = 2$ ⟺ 닫힌 해 존재 ⟺ 본 회차 행렬식 ≠ 0을 한 식에서 통합.

---

## D-11. 한 흐름 통합 정리

| 회차 | 어디서 등장 | 결과 |
|:---:|---|---|
| Part 1 1 | $A\mathbf{x}$ Linear combination | 모형의 표현력 정의 |
| Part 1 2 | Norm·Dot product | $\Vert\mathbf{e}\Vert^2$ 손실 |
| Part 1 3 | Row·Column 두 해석 | 풀이 두 관점 |
| Part 1 4 | RREF 판정 | 정확한 해 없음 → 최소제곱 필요 |
| Part 1 5 | LU | $A^\top A$의 가역 확인 |
| Part 1 6 | Subspace | $C(A) \subseteq \mathbb{R}^5$ |
| Part 1 7 | 4 부분공간 | $C(A) \cdot N(A^\top)$ 정의 |
| Part 1 8 | rank·dim 정리 | rank = 2 |
| Part 2 1 | Projection | $\mathbf{p} = P\mathbf{b}$ 정사영 |
| Part 2 2 | 최소제곱 | $\hat{\mathbf{x}} = (1.0, 1.6)^\top$ |
| Part 2 3 | QR | 같은 결과·수치적 표준 |
| Part 2 4 (본 회차) | Determinant | $\det(A^\top A) = 50$ 통합 확인 |

→ **한 데이터, 12개 도구, 한 결과.** 이것이 Part 1·Part 2 전반의 모습이다.

---

# E. 클로징: Part 1·Part 2 전반 요약

## E-1. Part 1·Part 2 전반 한 줄 요약

> **Vector·Matrix를 정의하고, $A\mathbf{x} = \mathbf{b}$를 풀고, 해가 없을 때 가장 가까운 $\hat{\mathbf{x}}$를 정사영·최소제곱으로 찾고, 그 과정을 수치적으로 안정하게 만드는 QR·정규직교 도구와 부피·가역성을 측정하는 행렬식까지.**

Part 1 1-8회차와 Part 2 1-4회차의 모든 도구가 이 한 줄에 응집된다.

## E-2. Part 1·Part 2 전반의 큰 분기점 3개

1. **Part 1 2회차 Cauchy-Schwarz**: 이차식 판별식 패턴 (학기 전반 반복).
2. **4 fundamental subspaces** (Part 1 7-8회차): Strang의 시그니처 그림.
3. **Part 2 2회차 최소제곱**: AI 회귀의 표준 토대, Part 2 전반부의 절정.

---

## E-3. Part 2 후반부 예고

**Part 2 후반부 (5-9회차)**: 정사각 행렬의 분해와 임의 행렬의 분해.

- 5-7회차: Eigenvalue·Diagonalization·Spectral theorem·Positive definite (정사각 분해)
- **8-9회차: SVD·Eckart-Young (임의 행렬의 분해, Part 2의 절정)**

본 회차 행렬식이 Eigenvalue·SVD의 직접 도구로 작동한다.

---

## E-4. 코딩 실습 골자

→ [Colab으로 실행](https://colab.research.google.com/github/repairer5812/linear-algebra-for-ai/blob/main/notebooks/Part2/04_%ED%96%89%EB%A0%AC%EC%8B%9D_%EC%A2%85%ED%95%A9%EB%AC%B8%EC%A0%9CReview.ipynb)

1. **Determinant 세 방법 비교**: Cofactor (재귀) · LU · NumPy `det` (작은 행렬에서)
2. **계산량 비교**: $n = 2, 3, 4, 5, \ldots, 10$에서 Cofactor vs LU 시간
3. **D 섹션 종합 문제 한 자리 풀이**: NumPy로 Part 1 1-8회차·Part 2 1-3회차 도구 차례로 적용
4. **시각화**: 데이터 산점도 + 최적 직선 + 잔차 5개
5. **행렬식의 기하**: 2D 행렬을 단위 정사각형에 적용한 결과 평행사변형 시각화
6. **회전·반사 행렬식**: $\det R_\theta = 1$, $\det H = -1$ 시각

---

## E-5. 본 회차 핵심 5개

1. **Determinant**는 정사각 행렬에 부호 있는 부피를 부여하는 한 Scalar 함수이다.
2. **세 정의** (signed volume·Leibniz·Cofactor·LU 곱)가 같은 값을 준다. 실전 계산은 LU ($O(n^3)$).
3. **곱셈성** $\det(AB) = \det A\, \det B$가 핵심 성질.
4. **동치 사슬**: $\det A \ne 0 \iff$ 가역 $\iff$ 열 일차독립 $\iff$ rank $= n$ $\iff$ $A\mathbf{x}=\mathbf{b}$ 유일해 $\iff$ $N(A) = \{\mathbf{0}\}$ $\iff$ $A^\top A$ 양정부호.
5. **Part 1·Part 2 전반 종합**: Vector·Matrix·해의 구조·정사영·최소제곱·QR·행렬식이 한 데이터·한 모형 안에서 한 흐름으로 작동한다.

---

## E-6. 자기 점검 질문

- $\det A$의 세 정의 (signed volume·Leibniz·Cofactor) 중 가장 기하적인 것은? 가장 실전적인 것은?
- $\det(A B) = \det A \cdot \det B$의 기하 의미를 한 문장으로 말하시오.
- $\det A = 0$이면 $A$의 열들에 대해 무엇을 말할 수 있는가?
- D 섹션 종합 문제의 핵심 결과 $\hat{\mathbf{x}} = (1.0, 1.6)^\top$을 두 방법 (정규방정식·QR)으로 얻은 사실의 의미는?
- Part 1·Part 2 전반에서 가장 자주 등장한 도구 3가지를 말하시오 (Hint: $A^\top$, 정사영, RREF).

---

<!-- _class: exercise -->

# 본 회차 마무리 문제 (즉석 풀이)

### 문제 1 (Determinant)
$A = \begin{pmatrix} 1 & 2 & 3 \\ 0 & 1 & 4 \\ 5 & 6 & 0 \end{pmatrix}$의 행렬식을 두 방법 (Cofactor·LU)으로 구하시오.

### 문제 2 (Part 1·Part 2 전반 미니 종합)
$A = \begin{pmatrix} 1 & 0 \\ 1 & 1 \\ 1 & 2 \end{pmatrix}$, $\mathbf{b} = (2, 1, 3)^\top$.

- **(a)** $A^\top A$, $A^\top \mathbf{b}$, $\det(A^\top A)$: 본 회차
- **(b)** 정규방정식으로 $\hat{\mathbf{x}}$: Part 2 2회차
- **(c)** 잔차 $\mathbf{e}$와 $A^\top \mathbf{e} = \mathbf{0}$ 검증: Part 2 1회차
- **(d)** QR 분해로 같은 $\hat{\mathbf{x}}$: Part 2 3회차

---

<!-- _class: exercise -->

## 본 회차 마무리 문제: 답

### 문제 1: Cofactor (첫 행)
$\det A = 1\cdot(0 - 24) - 2\cdot(0 - 20) + 3\cdot(0 - 5) = -24 + 40 - 15 = 1$.

### 문제 1: LU
$R_3 \leftarrow R_3 - 5 R_1$: $\begin{pmatrix} 1 & 2 & 3 \\ 0 & 1 & 4 \\ 0 & -4 & -15 \end{pmatrix}$. $R_3 \leftarrow R_3 + 4 R_2$: $\begin{pmatrix} 1 & 2 & 3 \\ 0 & 1 & 4 \\ 0 & 0 & 1 \end{pmatrix}$. $\det = 1\cdot 1\cdot 1 = 1$ ✓

### 문제 2: (a)
$A^\top A = \begin{pmatrix} 3 & 3 \\ 3 & 5 \end{pmatrix}$, $A^\top \mathbf{b} = (6, 7)^\top$. $\det = 6$.

### 문제 2: (b)
$\hat{\mathbf{x}} = \dfrac{1}{6}\begin{pmatrix} 5 & -3 \\ -3 & 3 \end{pmatrix}\begin{pmatrix} 6 \\ 7 \end{pmatrix} = \dfrac{1}{6}(30-21, -18+21)^\top = (1.5, 0.5)^\top$.

### 문제 2: (c)
$\mathbf{p} = (1.5, 2.0, 2.5)^\top$. $\mathbf{e} = (0.5, -1.0, 0.5)^\top$. $A^\top \mathbf{e} = (0, 0)^\top$ ✓

### 문제 2: (d)
$\mathbf{q}_1 = \mathbf{1}/\sqrt{3}$, $r_{11} = \sqrt{3}$. $r_{12} = 3/\sqrt{3} = \sqrt{3}$. $\mathbf{v}_2 = (-1, 0, 1)^\top$, $r_{22} = \sqrt{2}$. $\mathbf{q}_2 = (-1, 0, 1)^\top/\sqrt{2}$. $Q^\top \mathbf{b} = (6/\sqrt{3}, 1/\sqrt{2})^\top$. 후방 대입: $\hat{x}_2 = 1/2 = 0.5$ ✓, $\hat{x}_1 = 6/3 - 1\cdot 0.5 \cdot \sqrt{3}/\sqrt{3}\,$ 재정리: $\sqrt{3}\hat{x}_1 + \sqrt{3}\cdot 0.5 = 6/\sqrt{3}$, $\hat{x}_1 = 6/3 - 0.5 = 1.5$ ✓

> **메시지**: Part 1·Part 2 전반의 한 사례가 본 회차 한 문제에 모두 들어 있다.

---

<!-- _class: exercise -->

## Part 2 후반부 시작 전 자율 점검 숙제

Part 2 5회차 (Eigenvalue) 시작 전에 다음을 자율적으로 점검하시오. **의무 제출 아님.**

### 점검 1 (Part 1·Part 2 전반 종합)
D 섹션의 종합 문제를 한 페이지로 자신의 손으로 다시 풀이하시오. Part 1 1-8회차·Part 2 1-3회차의 어느 도구가 어디에서 쓰였는지를 한 문장씩 적어 가며.

### 점검 2 (행렬식)
3×3 random 정수 행렬 10개에 대해 (a) Cofactor (b) NumPy `det`로 행렬식을 구하고 일치 여부를 확인하시오. 그 중 한 행렬을 골라 $\det A \ne 0$이면 가역 행렬을 직접 구해 $A A^{-1} = I$를 검증하시오.

### 점검 3 (Part 2 후반부 미리보기)
한 정사각 $A = \begin{pmatrix} 2 & 1 \\ 0 & 3 \end{pmatrix}$에 대해 $\det(A - \lambda I) = 0$인 $\lambda$를 구하시오 (Part 2 5회차의 특성다항식).

→ Part 2 후반부의 출발이 본 회차 행렬식의 한 사례임을 미리 본다.

---

## E-7. 과제 안내

`04_과제/Part2/04회차_homework.md`. 마감: Part 2 5회차 시작 전.

**수학 30점**
- Determinant 손계산 (Cofactor·LU 각 5문제)
- $\det(AB), \det A^\top, \det A^{-1}, \det(cA)$ 5가지 성질의 각각 한 줄 증명
- 동치 사슬 (Part 1·Part 2 전반 통합) 한 페이지 정리
- D 섹션 종합 문제를 다른 데이터로 한 번 더 풀어내기

**코딩 20점**
- Cofactor expansion 재귀 구현 + LU 곱 구현 + NumPy `det`와 비교
- $n$ 증가에 따른 시간 측정 그래프
- D 섹션 종합 문제를 NumPy 한 노트북으로 완성
- 2D·3D 행렬식의 기하 시각화 (단위 정사각형·정육면체 변형)

---

## E-8. 다음 회차 (Part 2 5회차) 예고

**주제**: Eigenvalue · Eigenvector · 특성다항식

**연결**: 본 회차 마지막 점검 3의 한 식 $\det(A - \lambda I) = 0$이 Part 2 후반부의 출발이다. 행렬식이 한 다항식의 영점으로 **고유값**을 정의한다. 이 한 식이 PageRank·피보나치·미분방정식·PCA·SVD·신경망 안정성 분석에까지 이어진다.

또한 본 회차의 동치 사슬 (가역 ⟺ $\det \ne 0$ ⟺ rank = $n$)이 Part 2 후반부에서 $\det(A - \lambda I) = 0$이라는 한 조건의 의미를 단번에 설명한다.

**사전 reading**:
- MML §4.2
- Strang Ch 6.1-6.2 (PageRank·피보나치 시그니처 발췌)
- 3Blue1Brown EoLA Ch.10-14 (Eigenvalue·Eigenvector·diagonalization)

---

<!-- _class: lead -->

# Q & A

본 회차 학습 흐름:

**Signed volume → Leibniz · Cofactor · LU 곱 → 곱셈성·전치 불변·역행렬 → 동치 사슬 (Part 1·Part 2 전반 통합) → 종합 문제 Review (Part 1 1-8회차·Part 2 1-3회차 한 자리)**

한 줄 결론: **$\det A$가 한 Scalar로 가역성·rank·LU·QR의 모든 정보를 종합하고, 그것이 Part 2 전반부의 마침표이자 Part 2 후반부 Eigenvalue의 출발점이다.**

`HANDOUT`: 본 PDF + `04_행렬식_종합문제Review.ipynb`

---

<!-- _class: lead -->

# Part 2 전반부 마무리

**Part 2 4회차 · Part 1·Part 2 전반의 한 흐름**

다음 Part 2 5회차부터 **Part 2 후반부 (Eigenvalue·Diagonalization·Positive definite·SVD·Eckart-Young)**로 진입합니다.

수고하셨습니다.
