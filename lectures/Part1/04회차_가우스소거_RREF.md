---
marp: true
theme: default
paginate: true
header: '인공지능 전공자를 위한 선형대수학'
footer: 'Part 1 4회차 · Gaussian elimination · RREF · 해의 구조'
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

# Part 1 4회차

## Gaussian elimination · RREF · 해의 구조

MML §2.3.1-§2.3.3 (메인) · Strang Ch 2.1-2.3 (발췌, **Elementary matrix · LU 절차 시그니처**) · [EoLA Ch.7: Inverse matrices, column space and null space](https://www.youtube.com/watch?v=uQhTuRlWMxw) · Part 1 (LA1)

---

<!-- _class: exercise -->

# Review: 3회차 마무리 숙제

지난 회차에서 제기한 문제:

> $A = \begin{pmatrix} 1 & 0 & 1 \\ 0 & 1 & 1 \\ 1 & 1 & 2 \end{pmatrix}$, $\mathbf{x} = (1, 1, 1)^\top$
> (a) Row · Column picture로 $A\mathbf{x}$, (b) 세 열의 관계, (c) $\mathrm{col}(A)$의 모양, (d) $A\mathbf{y}=(1,2,3)^\top$의 해 존재.

### 답

- **(a)** Row: $(2, 2, 4)^\top$. Column: $1(1,0,1)^\top + 1(0,1,1)^\top + 1(1,1,2)^\top = (2, 2, 4)^\top$ ✓
- **(b)** $\mathbf{a}_3 = \mathbf{a}_1 + \mathbf{a}_2$, 셋째 열은 처음 둘의 합. **Linear dependence** (일차종속).
- **(c)** $\mathrm{col}(A) = \mathrm{span}\{(1,0,1)^\top, (0,1,1)^\top\}$, $\mathbb{R}^3$의 **평면** (2차원).
- **(d)** $(1,2,3)^\top = 1(1,0,1)^\top + 2(0,1,1)^\top$ ✓, 평면 위. **해 있음** (무수히, 일차종속이므로).

### 핵심 관찰

"$\mathbf{b}$가 평면 위에 있는가"를 **눈으로** 확인하기 어렵다. 3개의 식이 동시에 맞아떨어지는지 일일이 검사해야 한다. 차원이 커지면 불가능하다.

→ 본 회차의 **Gaussian elimination** (가우스 소거법)이 이 검사를 **알고리즘**으로 만든다.

---

## 본 회차 핵심 질문

> ### $A\mathbf{x} = \mathbf{b}$를 어떻게 **알고리즘으로** 풀고, 동시에 **해의 구조** (유일·무수·없음)를 한 번에 판정합니까?

이 한 알고리즘이 LA의 모든 손계산의 기초가 된다.

- **도구**: Elementary row operations(기본 행 연산) 3가지
- **과정**: Gaussian elimination → REF → RREF(Reduced Row Echelon Form, 기약사다리꼴)
- **결과**: Pivot(피벗) 위치를 보면 해의 구조가 즉시 보인다.

본 회차의 모든 결과는 "한 알고리즘 + 한 표준형"을 따른다.

---

## 학습 목표

이번 회차가 끝나면 학생은 다음을 답할 수 있어야 합니다.

1. **Elementary row operations** 세 가지를 진술하고 적용할 수 있습니다.
2. **Gaussian elimination**으로 $A\mathbf{x} = \mathbf{b}$를 손계산할 수 있습니다.
3. **REF**와 **RREF**의 정의·차이를 설명하고 RREF가 **유일**하다는 사실을 진술할 수 있습니다.
4. **Pivot 열과 Free 열**을 식별하고 그 의미를 설명할 수 있습니다.
5. **해의 세 경우** (유일·무수·없음)를 RREF의 Pivot 패턴으로 판정할 수 있습니다.
6. 해의 구조와 3회차 **Column space**의 관계를 진술할 수 있습니다.

---

## 본 회차 학습 흐름

| 질문 | 답 | 도구 |
|---|---|---|
| 식 묶음을 어떻게 단순화? | **Row operations** | 3가지 연산 |
| 체계적으로 어떻게? | **Gaussian elimination** | Forward + Backward |
| 가장 단순한 표준형은? | **RREF** | Pivot=1, 위·아래 0 |
| 어떤 변수가 자유인가? | **Free variables** | Pivot 없는 열 |
| 해의 존재·유일성은? | **Pivot 패턴 판정** | 3가지 경우 |

본 회차는 이 순서를 따라 진행한다.

---

## 수업 흐름

| 순서 | 블록 | 내용 |
|:---:|:---:|---|
| ① | A | **오프닝**: 핵심 질문 + 3회차 Review |
| ② | B | Linear equation system의 행렬 표현 + Row operations |
| ③ | **C** | **Gaussian elimination** (Forward · Backward) |
| ④ | **D** | **RREF · Pivot · Free variables** |
| ⑤ | **E** | **해의 세 경우** (유일·무수·없음) |
| ⑥ | F | CS·AI 적용 + Column space 연결 |
| ⑦ | G | **클로징**: 코딩 + 마무리 문제 + 숙제 |

> **C·D·E가 본 회차의 핵심이다.**

---

## B. Linear equation system의 표현 — B-1. Augmented matrix(첨가행렬)

$$\begin{cases} a_{11}x_1 + a_{12}x_2 + \cdots = b_1 \\ a_{21}x_1 + a_{22}x_2 + \cdots = b_2 \\ \vdots \end{cases} \;\Leftrightarrow\; A\mathbf{x} = \mathbf{b} \;\Leftrightarrow\; [A \mid \mathbf{b}]$$

**Augmented matrix** $[A \mid \mathbf{b}]$로 한 표에 모든 정보를 담는다.

### 예
$\begin{cases} 2x + y = 5 \\ x + 3y = 5 \end{cases} \;\Leftrightarrow\; \left[\begin{array}{cc|c} 2 & 1 & 5 \\ 1 & 3 & 5 \end{array}\right]$

---

## B-2. Elementary row operations: 3가지

해를 바꾸지 않는 세 가지 행 연산이다.

| 기호 | 연산 | 의미 |
|:---:|---|---|
| **(R1)** | $R_i \leftrightarrow R_j$ | 두 행을 교환 |
| **(R2)** | $R_i \leftarrow c\,R_i\;(c \ne 0)$ | 한 행을 0이 아닌 Scalar(스칼라)로 곱하기 |
| **(R3)** | $R_i \leftarrow R_i + c\,R_j$ | 한 행에 다른 행의 Scalar배를 더하기 |

> **Strang Ch 2.2-2.3 발췌 (시그니처, Elementary matrix)**: Strang은 세 행 연산 각각이 **Elementary matrix** $E$로 표현됨을 강조한다. $R_i \leftarrow R_i - cR_j$는 단위행렬 $I$의 $(i, j)$ 자리를 $-c$로 바꾼 $E_{ij}(c)$로 좌측에 곱한 것과 같다. 즉 한 행 연산 = 한 번의 $E A$ 좌측 곱. **Forward elimination 전체 과정** = $E_k \cdots E_2 E_1 A = U$ (상삼각). 이것을 거꾸로 정리하면 $A = (E_1^{-1} E_2^{-1} \cdots E_k^{-1}) U = LU$ (5회차 LU 분해의 정확한 출발점). Strang이 LA 책 전반에서 가장 자주 반복하는 시그니처 패턴이다.

### 명제 3.1 (해 불변성)
세 연산은 모두 $A\mathbf{x} = \mathbf{b}$의 **해집합을 보존**한다.

**증명 골자**: 각 연산이 가역(invertible)이다. $R_i \leftrightarrow R_j$를 한 번 더 하면 원래대로, $c$로 곱하면 $1/c$로 다시 곱하면 원래로 돌아간다. 따라서 식 묶음이 동치(equivalent)이다. $\blacksquare$

---

## C. Gaussian elimination

### C-1. 전체 흐름

<div class="analogy">

**직관 (Gauss 소거의 의미)**: 본래 선형방정식 묶음 $A\mathbf{x} = \mathbf{b}$는 미지수가 모든 행에 뒤섞여 있어 해를 직접 읽기 어렵다. 세 종류의 행 연산 (행 교환·Scalar곱·다른 행 더하기) 을 위에서 아래로 반복해 **상삼각형** (Row Echelon Form) 에 도달하면, 마지막 행이 한 미지수만, 그 위 행이 두 미지수, … 식이 된다. 마지막 행부터 거꾸로 대입 (back-substitution) 해 해를 차례로 읽는다. 본 회차의 절차가 이 흐름을 그대로 구현한다.

</div>

### 두 단계
1. **Forward elimination(전방 소거)**: $A$를 **상삼각형**으로 (Row Echelon Form, REF)
2. **Backward substitution(후방 대입)**: REF에서 미지수를 거꾸로 구하기

또는 한 번에: **Forward 후 계속 위로도 소거 → RREF**, 답을 직접 읽기 (Gauss-Jordan).

> **Strang Ch 2.1-2.3 발췌 (시그니처, 절차)**: Strang의 절차 표준은 **"Pivot은 0이 아닌 첫 원소, 그 아래 모두 0으로"**를 위에서 아래로 한 열씩 반복한다. 각 단계가 (R3) Elementary matrix 한 번에 대응된다. 본 회차 C-2 손계산 예제가 이 발췌의 직역이다. Strang은 **부동소수점 안정성을 위해 가장 큰 값을 pivot으로** 선택하는 *partial pivoting*까지 한 흐름으로 다룬다 (본 F-2에서 짧게 안내, 5회차 LU에서 본격).

---

## C-2. 손계산 예제: Forward 단계

$\left[\begin{array}{cc|c} 2 & 1 & 5 \\ 1 & 3 & 5 \end{array}\right]$ — 위에서 본 그 식.

**(R1)** $R_1 \leftrightarrow R_2$ (첫 pivot을 1로 만들기 위해):
$\left[\begin{array}{cc|c} 1 & 3 & 5 \\ 2 & 1 & 5 \end{array}\right]$

**(R3)** $R_2 \leftarrow R_2 - 2R_1$:
$\left[\begin{array}{cc|c} 1 & 3 & 5 \\ 0 & -5 & -5 \end{array}\right]$

**(R2)** $R_2 \leftarrow R_2 / (-5)$:
$\left[\begin{array}{cc|c} 1 & 3 & 5 \\ 0 & 1 & 1 \end{array}\right]$ ← **REF (상삼각형, pivot = 1)**

---

## C-3. Backward substitution

REF $\left[\begin{array}{cc|c} 1 & 3 & 5 \\ 0 & 1 & 1 \end{array}\right]$를 식으로 다시 쓰면:

$$\begin{cases} x + 3y = 5 \\ y = 1 \end{cases}$$

**아래에서 위로** 대입한다:
- $y = 1$
- $x = 5 - 3y = 5 - 3 = 2$

**해**: $(x, y) = (2, 1)$. ✓ (검산: $2\cdot 2 + 1 = 5$, $2 + 3 = 5$)

---

## C-4. Pivot(피벗)의 의미

**Pivot** = 각 행에서 **0이 아닌 첫 원소** (REF 기준).

| Augmented matrix | Pivot 위치 |
|---|---|
| $\left[\begin{array}{cc\|c} 1 & 3 & 5 \\ 0 & 1 & 1 \end{array}\right]$ | (1,1), (2,2) — 두 열 모두 |
| $\left[\begin{array}{ccc\|c} 1 & 2 & 3 & 6 \\ 0 & 0 & 1 & 2 \\ 0 & 0 & 0 & 0 \end{array}\right]$ | (1,1), (2,3) — 1열·3열 |

**Pivot 위치가 해의 구조를 결정한다**:
- 모든 열에 pivot → 유일해
- 일부 열에 pivot 없음 → 자유 변수 발생
- $\mathbf{b}$ 열에 pivot → 해 없음 (다음에 설명)

---

<!-- _class: exercise -->

# 잠깐 풀어보기: Gaussian elimination

### 문제 1 (2×2)
다음을 Gaussian elimination으로 풀어보시오.
$$\begin{cases} x + 2y = 4 \\ 3x + 7y = 13 \end{cases}$$

### 문제 2 (3×3, 일관해)
다음을 풀어보시오.
$$\begin{cases} x + y + z = 6 \\ x + 2y + 3z = 14 \\ x + 3y + 5z = 22 \end{cases}$$

> **힌트**: 첫 행을 그대로 두고 둘째·셋째 행에서 첫 행의 배수를 빼는 것부터 시작한다.

---

<!-- _class: exercise -->

## 잠깐 풀어보기: 답

### 문제 1
$\left[\begin{array}{cc|c} 1 & 2 & 4 \\ 3 & 7 & 13 \end{array}\right]$ →$_{R_2 - 3R_1}$ $\left[\begin{array}{cc|c} 1 & 2 & 4 \\ 0 & 1 & 1 \end{array}\right]$
$y = 1$, $x = 4 - 2 = 2$. **해 $(2, 1)$**.

### 문제 2
$\left[\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\ 1 & 2 & 3 & 14 \\ 1 & 3 & 5 & 22 \end{array}\right]$
→$_{R_2 - R_1,\,R_3 - R_1}$ $\left[\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\ 0 & 1 & 2 & 8 \\ 0 & 2 & 4 & 16 \end{array}\right]$
→$_{R_3 - 2R_2}$ $\left[\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\ 0 & 1 & 2 & 8 \\ 0 & 0 & 0 & 0 \end{array}\right]$

마지막 행이 $0=0$이며, **Free variable이 발생**한다. $z = t$로 두면 $y = 8 - 2t$, $x = 6 - y - z = 6 - (8-2t) - t = t - 2$. **해**: $(t-2,\,8-2t,\,t)$, $t \in \mathbb{R}$, 무수히 많다.

> **메시지**: 한 식이 다른 식의 Linear combination(선형결합)이면 자유 변수가 생긴다.

---

## D. RREF · Pivot · Free variables

### D-1. REF vs RREF

**REF (Row Echelon Form, 사다리꼴)**
- 각 행의 첫 0 아닌 원소(pivot)가 그 위 행의 pivot보다 **오른쪽**
- pivot 아래는 모두 0
- 0행은 모두 맨 아래

**RREF (Reduced REF, 기약사다리꼴)** — REF + 두 조건
- 모든 pivot이 정확히 **1**
- 모든 pivot의 **위·아래가 0** (열 전체가 표준 단위 벡터)

| Augmented matrix | 상태 |
|---|---|
| $\left[\begin{array}{cc\|c} 2 & 3 & 7 \\ 0 & 1 & 1 \end{array}\right]$ | REF (pivot 위 0 X) |
| $\left[\begin{array}{cc\|c} 1 & 0 & 4 \\ 0 & 1 & 1 \end{array}\right]$ | **RREF** ✓ |

### D-2. RREF의 유일성 (정리 3.1)
어떤 행렬 $A$에 대해서도 행 연산으로 도달하는 RREF는 **유일**하다. REF는 어떤 행 교환을 했느냐에 따라 모양이 다를 수 있지만, **RREF는 한 가지뿐**이며 **표준형** (canonical form)이다. 따라서 "$A$의 RREF" 라고 부를 수 있다 (정관사 the). 증명은 8회차 Basis(기저) 도구 이후.

---

## D-3. Pivot column vs Free column

**Pivot column(피벗 열)**: RREF에서 pivot이 들어 있는 열.
**Free column(자유 열)**: pivot이 없는 열.

| RREF | Pivot 열 | Free 열 |
|---|---|---|
| $\left[\begin{array}{ccc\|c} 1 & 0 & -1 & 0 \\ 0 & 1 & 2 & 3 \\ 0 & 0 & 0 & 0 \end{array}\right]$ | 1, 2 | **3** |
| $\left[\begin{array}{ccc\|c} 1 & 2 & 0 & 3 \\ 0 & 0 & 1 & 1 \\ 0 & 0 & 0 & 0 \end{array}\right]$ | 1, 3 | **2** |

**Free column 수 = 자유 변수 수 = 해의 자유도**이다.

---

## D-4. RREF에서 해 직접 읽기

$\left[\begin{array}{ccc|c} 1 & 0 & -1 & 0 \\ 0 & 1 & 2 & 3 \\ 0 & 0 & 0 & 0 \end{array}\right]$

- 1열·2열 pivot → $x_1, x_2$가 종속 변수
- 3열 free → $x_3 = t$ 임의

식으로:
- $x_1 - x_3 = 0 \Rightarrow x_1 = t$
- $x_2 + 2x_3 = 3 \Rightarrow x_2 = 3 - 2t$

**해**: $(t, 3-2t, t)$, 직선 (1차원 자유도).

→ RREF만 보면 해의 **완전한 모양**이 즉시 나온다.

---

## E. 해의 세 경우

### E-1. 세 경우의 판정

$[A \mid \mathbf{b}]$의 RREF를 보고 판정한다.

| 경우 | RREF의 특징 | 예 |
|---|---|---|
| **(i) 유일해** | 모든 변수 열에 pivot, $\mathbf{b}$ 열 pivot 없음 | $\left[\begin{array}{cc\|c} 1 & 0 & 2 \\ 0 & 1 & 1 \end{array}\right]$ |
| **(ii) 무수히 많은 해** | Free column이 있음, $\mathbf{b}$ 열 pivot 없음 | $\left[\begin{array}{ccc\|c} 1 & 0 & -1 & 0 \\ 0 & 1 & 2 & 3 \\ 0 & 0 & 0 & 0 \end{array}\right]$ |
| **(iii) 해 없음** | $\mathbf{b}$ 열에 pivot ($0 = c \ne 0$의 식) | $\left[\begin{array}{cc\|c} 1 & 2 & 3 \\ 0 & 0 & 1 \end{array}\right]$ |

**한 표로**: $\mathbf{b}$ 열 pivot이 있으면 모순 → 해 없음. 없으면 free column 수가 해의 자유도.

---

## E-2. 해 없음의 의미: 모순 행

$\left[\begin{array}{cc|c} 1 & 2 & 3 \\ 0 & 0 & 1 \end{array}\right]$의 둘째 행은 식으로 $0 \cdot x_1 + 0 \cdot x_2 = 1$, 즉 $0 = 1$이다.

**어떤 $x_1, x_2$를 잡아도 모순**이며 해가 없다.

### 3회차와 연결
- 해 없음 ↔ $\mathbf{b} \notin \mathrm{col}(A)$, $\mathbf{b}$가 $A$의 Column space 밖
- 해 있음 ↔ $\mathbf{b} \in \mathrm{col}(A)$, Column space 안

본 회차 알고리즘이 **그 멤버십 판정을 손계산으로** 가능하게 한다.

---

## E-3. 무수히 많은 해의 구조

해가 있고 free column이 $k$개면 해 집합은 **$k$차원 affine subspace** (평행이동된 부분공간)이다.

### 구조
$\mathbf{x} = \mathbf{x}_p + \mathbf{x}_h$

- $\mathbf{x}_p$ = **특수해(particular solution)**: RREF에서 free 변수를 0으로 둔 해
- $\mathbf{x}_h$ = **동차해(homogeneous solution)**: $A\mathbf{x} = \mathbf{0}$의 해 집합 (Null space, 6회차)

### 예 (앞 슬라이드)
해 $(t, 3-2t, t) = (0, 3, 0) + t(1, -2, 1)$
- $\mathbf{x}_p = (0, 3, 0)$
- $\mathbf{x}_h = t(1, -2, 1)$, 모든 $t \in \mathbb{R}$

→ **6회차 Null space**의 출발점이다.

---

<!-- _class: exercise -->

# 잠깐 풀어보기: 해의 세 경우

각 경우를 RREF로 판정하고 해를 구하시오.

### 문제 1 (해 없음)
$$\begin{cases} x + y = 3 \\ 2x + 2y = 7 \end{cases}$$

### 문제 2 (유일해)
$$\begin{cases} x + 2y - z = 1 \\ -x + y + 2z = 2 \\ y + z = 1 \end{cases}$$

### 문제 3 (무수해)
$$\begin{cases} x + y - z = 2 \\ 2x + 2y - 2z = 4 \\ 3x + 3y - 3z = 6 \end{cases}$$

---

<!-- _class: exercise -->

## 잠깐 풀어보기: 답

### 문제 1
$\left[\begin{array}{cc|c} 1 & 1 & 3 \\ 2 & 2 & 7 \end{array}\right]$ →$_{R_2 - 2R_1}$ $\left[\begin{array}{cc|c} 1 & 1 & 3 \\ 0 & 0 & 1 \end{array}\right]$, $\mathbf{b}$ 열에 pivot → **해 없음**.

### 문제 2
RREF로 가면 $\left[\begin{array}{ccc|c} 1 & 0 & 0 & 1 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 1 \end{array}\right]$. 모든 변수 열 pivot → **유일해 $(1, 0, 1)$**.

### 문제 3
세 식이 같은 식의 1·2·3배. RREF: $\left[\begin{array}{ccc|c} 1 & 1 & -1 & 2 \\ 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \end{array}\right]$. Pivot 1개, free 2개.
$y = s, z = t$로 두면 $x = 2 - s + t$. 해: $(2-s+t,\,s,\,t)$, **2차원 자유 해 집합**.

> **메시지**: 세 식이 본질적으로 같은 식이면 자유도가 그만큼 커진다.

---

## F. CS·AI 적용

### F-1. AI에서 Linear equation 풀이

| 응용 | $A\mathbf{x} = \mathbf{b}$의 역할 | 회차 |
|---|---|---|
| **선형 회귀** | $A\hat\beta = \mathbf{b}$ (overdetermined → 최소제곱) | Part 2 2 · Part 4 1 |
| **신경망 한 층의 역방향** | 입력 복원 (역연산) | Part 2 |
| **Embedding 정규화** | Linear constraint 적용 | Part 2 2 |
| **Optimization KKT** | 등식 제약 = $A\mathbf{x} = \mathbf{b}$ | Part 3 4 |
| **Computer Graphics** | 좌표 변환 풀이 | — |

대형 신경망 학습에서도 본질은 거대한 Linear equation system 근사 풀이이다.

---

## F-2. 수치적 주의: 부동소수점

손계산은 정확하지만 NumPy 등 부동소수점에서는 작은 오차가 누적된다.

```python
A = np.array([[2.0, 1.0], [1.0, 3.0]])
b = np.array([5.0, 5.0])
x = np.linalg.solve(A, b)  # → [2.0, 1.0] (정확)
```

`np.linalg.solve`는 LU Decomposition(5회차)을 내부적으로 사용한다. Gaussian elimination이 그 토대이다.

### Partial pivoting (간단 안내)
큰 행렬에서 **가장 큰 값을 pivot으로** 선택해 수치 안정성을 높이는 표준 기법이다. 5회차 LU에서 다시 다룬다.

---

## G. 클로징

### G-1. 코딩 실습 골자

→ [Colab으로 실행](https://colab.research.google.com/github/repairer5812/linear-algebra-for-ai/blob/main/notebooks/Part1/03_%EA%B0%80%EC%9A%B0%EC%8A%A4%EC%86%8C%EA%B1%B0_RREF.ipynb)

1. **Gaussian elimination을 직접 구현** (Forward + Backward)
2. NumPy `np.linalg.solve`와 결과 비교
3. `sympy.Matrix(...).rref()`로 RREF 직접 계산 + 손계산과 비교
4. 해의 세 경우를 모두 실험 (유일·무수·없음)
5. **랜덤 행렬 100개**에 대해 해 존재 여부를 RREF로 자동 판정
6. 시각화: 2변수 경우 두 직선의 교차·평행·일치

---

## G-2. 본 회차 핵심 5개

1. **Elementary row operations 3가지**: 해를 바꾸지 않는 식 묶음 변형
2. **Gaussian elimination**: Forward(REF) + Backward(해 읽기)
3. **RREF는 유일**: 한 행렬의 표준형
4. **Pivot 열 vs Free 열**: Free 열 수 = 자유 변수 수
5. **해의 세 경우 판정**: $\mathbf{b}$ 열 pivot 있음 → 없음. Free 열 있음 → 무수. 모든 변수 열 pivot → 유일.

---

## G-3. 자기 점검 질문

- Elementary row operations 세 가지를 말하시오. 해를 보존하는 이유는?
- REF와 RREF의 차이는 무엇인가?
- 어떤 행렬의 RREF는 유일한가, 아니면 알고리즘에 따라 달라지는가?
- "Free column이 있으면 무수히 많은 해": 항상 참인가? 반례를 생각해보시오.
- $\mathbf{b}$ 열에 pivot이 있다는 것의 기하학적 의미는?

---

<!-- _class: exercise -->

# 본 회차 마무리 문제 (즉석 풀이)

다음 system을 RREF로 풀고 **해의 종류** (유일·무수·없음)를 판정하시오.

$$\begin{cases} x + 2y + 3z = 4 \\ 2x + 5y + 7z = 9 \\ x + 3y + 5z = 6 \end{cases}$$

- **(a)** Augmented matrix를 적으시오.
- **(b)** Gaussian elimination으로 REF를 만드시오.
- **(c)** 추가 행 연산으로 RREF로 만드시오.
- **(d)** Pivot 열과 Free 열을 식별하시오.
- **(e)** 해의 종류·해를 적으시오.

---

<!-- _class: exercise -->

## 본 회차 마무리 문제: 답

- **(a)** $\left[\begin{array}{ccc|c} 1 & 2 & 3 & 4 \\ 2 & 5 & 7 & 9 \\ 1 & 3 & 5 & 6 \end{array}\right]$
- **(b)** $R_2 \leftarrow R_2 - 2R_1,\;R_3 \leftarrow R_3 - R_1$:
   $\left[\begin{array}{ccc|c} 1 & 2 & 3 & 4 \\ 0 & 1 & 1 & 1 \\ 0 & 1 & 2 & 2 \end{array}\right]$
   $R_3 \leftarrow R_3 - R_2$:
   $\left[\begin{array}{ccc|c} 1 & 2 & 3 & 4 \\ 0 & 1 & 1 & 1 \\ 0 & 0 & 1 & 1 \end{array}\right]$ ← **REF**
- **(c)** $R_2 \leftarrow R_2 - R_3,\;R_1 \leftarrow R_1 - 3R_3,\;R_1 \leftarrow R_1 - 2R_2$:
   $\left[\begin{array}{ccc|c} 1 & 0 & 0 & 1 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 1 \end{array}\right]$ ← **RREF**
- **(d)** Pivot 열: 1, 2, 3 (모두). Free 열: 없음.
- **(e)** **유일해**: $(x, y, z) = (1, 0, 1)$.

> **검산**: $1 + 0 + 3 = 4$ ✓, $2 + 0 + 7 = 9$ ✓, $1 + 0 + 5 = 6$ ✓
> **핵심**: 모든 변수 열에 pivot → 해 유일. RREF의 $\mathbf{b}$ 열이 곧 해.

---

<!-- _class: exercise -->

## 다음 회차 Review용 숙제

위 마무리 문제의 **유사 문제**이다. 5회차 Review에서 함께 답을 맞춘다.

다음 system을 RREF로 풀어 **해의 종류**를 판정하고 해를 구하시오.

$$\begin{cases} x + y + 2z = 4 \\ 2x + 3y + 5z = 9 \\ 3x + 5y + 8z = 14 \end{cases}$$

- (a) Augmented matrix → REF → RREF
- (b) Pivot · Free 열 식별
- (c) 해의 종류 (유일·무수·없음)
- (d) 해를 구하시오. (자유 변수가 있으면 일반해 형태로)

### 자기 점검
- (b)에서 세 행이 모두 살아남는가? 한 행이 0행이 되면 그 이유는?
- 5회차의 **Inverse matrix** (역행렬)가 정의되려면 RREF에서 어떤 조건이 필요한지 생각해보시오.

5회차 본 주제 (**Inverse matrix · LU Decomposition**)와 직접 연결된다.

---

## G-4. 과제 안내

`04_과제/Part1/04회차_homework.md` — 마감: 5회차 시작 전

**수학 30점**
- Gaussian elimination 손계산 (3문제, 2×2~3×3)
- 해의 세 경우 판정 (4문제)
- RREF 직접 구하기 (3문제)
- 자유 변수가 있을 때 일반해 표현

**코딩 20점**
- Gaussian elimination 직접 구현 (Forward + Backward)
- `sympy.rref()`와 결과 비교
- 부동소수점 오차 관찰 (큰 행렬에서)

---

## G-5. 다음 회차 (5회차) 예고

**주제**: Inverse matrix · LU Decomposition

**연결**: 본 회차에서 본 Gaussian elimination을 **행렬 형태로 정리**하면 LU Decomposition이 됩니다. $A = LU$로, 가우스 소거의 모든 단계가 하삼각 Matrix $L$에 누적되고, 결과 REF가 상삼각 $U$입니다.

또한 RREF에서 변수 열 모두 pivot ↔ Inverse matrix 존재이며, **Inverse matrix**가 5회차 첫 분해의 주인공입니다.

**사전 reading**:
- **MML §2.2.2 (Inverse and Transpose)**, **§2.3.4-§2.3.5** (Permutation matrix·LU), 메인
- **Strang Ch 2.4-2.7 발췌** (LU·BLAS·전치 시그니처), 본문 박스로 가져옴
- 3Blue1Brown EoLA Ch.7 (Inverse, column space)

---

<!-- _class: lead -->

# Q & A

본 회차 학습 흐름:
**Row operations → Gaussian elimination → REF → RREF → Pivot 패턴 → 해의 세 경우**

핵심 한 줄: **RREF의 Pivot 위치를 보면 $A\mathbf{x}=\mathbf{b}$의 해가 한눈에 보인다.**

`HANDOUT`: 본 PDF + `03_가우스소거_RREF.ipynb`
