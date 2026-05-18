---
marp: true
theme: default
paginate: true
header: '인공지능 전공자를 위한 선형대수학'
footer: '3회차 — Gaussian elimination · RREF · 해의 구조'
math: mathjax
size: 16:9
style: |
  section { font-size: 22px; padding: 50px 60px 70px 60px; }
  section.lead { padding: 100px 60px; }
  h1 { color: #1a365d; margin-top: 0; }
  h2 { color: #2d3748; border-bottom: 2px solid #cbd5e0; padding-bottom: 4px; margin-top: 0; }
  table { font-size: 17px; }
  code { font-size: 17px; background: #f7fafc; padding: 2px 6px; border-radius: 3px; }
  blockquote { font-size: 19px; border-left: 4px solid #4299e1; color: #2d3748; background: #ebf8ff; padding: 8px 14px; }
  section.exercise { background: #fffaf0; }
  section.exercise h1 { color: #c05621; }
  section.exercise h2 { color: #9c4221; border-bottom-color: #fbd38d; }
  .analogy { background: #f5f3ff; border-left: 4px solid #7c3aed; padding: 10px 16px; margin: 12px 0; font-size: 19px; color: #1f2937; }
  .analogy strong { color: #5b21b6; }
---

<!-- _class: lead -->
<!-- _paginate: false -->

# 3회차

## Gaussian elimination · RREF · 해의 구조

MML §2.3.2~§2.3.4 · Strang §2.2, §2.3, §3.2 · EoLA Ch.7

---

<!-- _class: exercise -->

# 🔁 Review — 2회차 마무리 숙제

지난 회차 마지막에 가져갔던 문제:

> $A = \begin{pmatrix} 1 & 0 & 1 \\ 0 & 1 & 1 \\ 1 & 1 & 2 \end{pmatrix}$, $\mathbf{x} = (1, 1, 1)^\top$
> (a) Row · Column picture로 $A\mathbf{x}$, (b) 세 열의 관계, (c) $\mathrm{col}(A)$의 모양, (d) $A\mathbf{y}=(1,2,3)^\top$의 해 존재.

### 답

- **(a)** Row: $(2, 2, 4)^\top$. Column: $1(1,0,1)^\top + 1(0,1,1)^\top + 1(1,1,2)^\top = (2, 2, 4)^\top$ ✓
- **(b)** $\mathbf{a}_3 = \mathbf{a}_1 + \mathbf{a}_2$ — 셋째 열은 처음 둘의 합. **Linear dependence(일차종속)**.
- **(c)** $\mathrm{col}(A) = \mathrm{span}\{(1,0,1)^\top, (0,1,1)^\top\}$ — $\mathbb{R}^3$의 **평면** (2차원).
- **(d)** $(1,2,3)^\top = 1(1,0,1)^\top + 2(0,1,1)^\top$ ✓ — 평면 위. **해 있음** (무수히, 일차종속이므로).

### 핵심 관찰

"$\mathbf{b}$가 평면 위에 있는가"를 **눈으로** 확인하기 어렵습니다 — 3개의 식이 동시에 맞아떨어지는지 일일이 검사해야 합니다. 더 차원이 커지면 불가능합니다.

→ 오늘 회차의 **Gaussian elimination(가우스 소거법)**이 이 검사를 **알고리즘**으로 만듭니다.

---

## 오늘의 핵심 질문

> ### $A\mathbf{x} = \mathbf{b}$를 어떻게 **알고리즘으로** 풀고, 동시에 **해의 구조**(유일·무수·없음)를 한 번에 판정합니까?

이 한 알고리즘이 LA의 모든 손계산의 기초가 됩니다.

- **도구**: Elementary row operations(기본 행 연산) 3가지
- **과정**: Gaussian elimination → REF → RREF(Reduced Row Echelon Form, 기약사다리꼴)
- **결과**: Pivot(피벗) 위치를 보면 해의 구조가 즉시 보입니다.

오늘 회차의 모든 것이 "한 알고리즘 + 한 표준형" 위에 있습니다.

---

## 학습 목표

이번 회차가 끝나면 학생은 다음을 답할 수 있어야 합니다.

1. **Elementary row operations** 세 가지를 진술하고 적용할 수 있습니다.
2. **Gaussian elimination**으로 $A\mathbf{x} = \mathbf{b}$를 손계산할 수 있습니다.
3. **REF**와 **RREF**의 정의·차이를 설명하고 RREF가 **유일**하다는 사실을 진술할 수 있습니다.
4. **Pivot 열과 Free 열**을 식별하고 그 의미를 설명할 수 있습니다.
5. **해의 세 경우** (유일·무수·없음)를 RREF의 Pivot 패턴으로 판정할 수 있습니다.
6. 해의 구조와 2회차 **Column space**의 관계를 진술할 수 있습니다.

---

## 오늘의 논리 사슬

| 질문 | 답 | 도구 |
|---|---|---|
| 식 묶음을 어떻게 단순화? | **Row operations** | 3가지 연산 |
| 체계적으로 어떻게? | **Gaussian elimination** | Forward + Backward |
| 가장 단순한 표준형은? | **RREF** | Pivot=1, 위·아래 0 |
| 어떤 변수가 자유인가? | **Free variables** | Pivot 없는 열 |
| 해의 존재·유일성은? | **Pivot 패턴 판정** | 3가지 경우 |

이 사슬을 한 회차에 완주합니다.

---

## 수업 흐름 (120분)

| 시간 | 블록 | 내용 |
|---|---|---|
| 0~15 | A | **오프닝** — 핵심 질문 + 2회차 Review |
| 15~30 | B | Linear equation system의 행렬 표현 + Row operations |
| 30~60 | **C** | **Gaussian elimination** (Forward · Backward) |
| 60~80 | **D** | **RREF · Pivot · Free variables** |
| 80~100 | **E** | **해의 세 경우** (유일·무수·없음) |
| 100~110 | F | CS·AI 적용 + Column space 연결 |
| 110~120 | G | **클로징** — 코딩 + 마무리 문제 + 숙제 |

> **C·D·E가 오늘의 심장**. 30분 + 20분 + 20분 = 70분 집중 배분.

---

# B. Linear equation system의 표현 + Row operations

---

## B-1. Augmented matrix(첨가행렬)

$$\begin{cases} a_{11}x_1 + a_{12}x_2 + \cdots = b_1 \\ a_{21}x_1 + a_{22}x_2 + \cdots = b_2 \\ \vdots \end{cases} \;\Leftrightarrow\; A\mathbf{x} = \mathbf{b} \;\Leftrightarrow\; [A \mid \mathbf{b}]$$

**Augmented matrix** $[A \mid \mathbf{b}]$로 한 표에 모든 정보를 담습니다.

### 예
$\begin{cases} 2x + y = 5 \\ x + 3y = 5 \end{cases} \;\Leftrightarrow\; \left[\begin{array}{cc|c} 2 & 1 & 5 \\ 1 & 3 & 5 \end{array}\right]$

---

## B-2. Elementary row operations — 3가지

해를 바꾸지 않는 세 가지 행 연산입니다.

| 기호 | 연산 | 의미 |
|:---:|---|---|
| **(R1)** | $R_i \leftrightarrow R_j$ | 두 행을 교환 |
| **(R2)** | $R_i \leftarrow c\,R_i\;(c \ne 0)$ | 한 행을 0이 아닌 Scalar(스칼라)로 곱하기 |
| **(R3)** | $R_i \leftarrow R_i + c\,R_j$ | 한 행에 다른 행의 Scalar배를 더하기 |

### 명제 3.1 (해 불변성)
세 연산은 모두 $A\mathbf{x} = \mathbf{b}$의 **해집합을 보존**합니다.

**증명 골자**: 각 연산이 가역(invertible). $R_i \leftrightarrow R_j$를 한 번 더 하면 원래대로, $c$로 곱하면 $1/c$로 다시 곱하면 원래로 — 따라서 식 묶음이 동치(equivalent)입니다. $\blacksquare$

---

# C. Gaussian elimination

---

## C-1. 전체 흐름

<div class="analogy">

💡 **파인만식 비유**: 복잡한 주문서를 **단계별로 정리**하는 작업입니다. 처음엔 메뉴가 마구 섞여 있어 누가 뭘 주문했는지 안 보이지만, **한 행씩 차근차근 정리**(소거)하면 끝에는 누가 무엇을 얼마나 시켰는지 한눈에 보입니다.

</div>

### 두 단계
1. **Forward elimination(전방 소거)** — $A$를 **상삼각형**으로 (Row Echelon Form, REF)
2. **Backward substitution(후방 대입)** — REF에서 미지수를 거꾸로 구하기

또는 한 번에: **Forward 후 계속 위로도 소거 → RREF**, 답을 직접 읽기 (Gauss-Jordan).

---

## C-2. 손계산 예제 — Forward 단계

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

**아래에서 위로** 대입합니다:
- $y = 1$
- $x = 5 - 3y = 5 - 3 = 2$

**해**: $(x, y) = (2, 1)$. ✓ (검산: $2\cdot 2 + 1 = 5$, $2 + 3 = 5$)

---

## C-4. Pivot(피벗)의 의미

**Pivot** = 각 행에서 **0이 아닌 첫 원소**(REF 기준).

| Augmented matrix | Pivot 위치 |
|---|---|
| $\left[\begin{array}{cc\|c} 1 & 3 & 5 \\ 0 & 1 & 1 \end{array}\right]$ | (1,1), (2,2) — 두 열 모두 |
| $\left[\begin{array}{ccc\|c} 1 & 2 & 3 & 6 \\ 0 & 0 & 1 & 2 \\ 0 & 0 & 0 & 0 \end{array}\right]$ | (1,1), (2,3) — 1열·3열 |

**Pivot 위치가 해의 구조를 결정합니다**:
- 모든 열에 pivot → 유일해
- 일부 열에 pivot 없음 → 자유 변수 발생
- $\mathbf{b}$ 열에 pivot → 해 없음 (다음에 설명)

---

<!-- _class: exercise -->

# 🖍 잠깐 풀어보기 — Gaussian elimination

### 문제 1 (2×2)
다음을 Gaussian elimination으로 풀어보세요.
$$\begin{cases} x + 2y = 4 \\ 3x + 7y = 13 \end{cases}$$

### 문제 2 (3×3, 일관해)
다음을 푸세요.
$$\begin{cases} x + y + z = 6 \\ x + 2y + 3z = 14 \\ x + 3y + 5z = 22 \end{cases}$$

> **힌트**: 첫 행을 그대로 두고 둘째·셋째 행에서 첫 행의 배수를 빼는 것부터 시작.

---

<!-- _class: exercise -->

## 잠깐 풀어보기 — 답

### 문제 1
$\left[\begin{array}{cc|c} 1 & 2 & 4 \\ 3 & 7 & 13 \end{array}\right]$ →$_{R_2 - 3R_1}$ $\left[\begin{array}{cc|c} 1 & 2 & 4 \\ 0 & 1 & 1 \end{array}\right]$
$y = 1$, $x = 4 - 2 = 2$. **해 $(2, 1)$**.

### 문제 2
$\left[\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\ 1 & 2 & 3 & 14 \\ 1 & 3 & 5 & 22 \end{array}\right]$
→$_{R_2 - R_1,\,R_3 - R_1}$ $\left[\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\ 0 & 1 & 2 & 8 \\ 0 & 2 & 4 & 16 \end{array}\right]$
→$_{R_3 - 2R_2}$ $\left[\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\ 0 & 1 & 2 & 8 \\ 0 & 0 & 0 & 0 \end{array}\right]$

마지막 행이 $0=0$. **Free variable 발생** — $z = t$로 두면 $y = 8 - 2t$, $x = 6 - y - z = 6 - (8-2t) - t = t - 2$. **해**: $(t-2,\,8-2t,\,t)$, $t \in \mathbb{R}$ — 무수히.

> **메시지**: 한 식이 다른 식의 Linear combination(선형결합)이면 자유 변수가 생깁니다.

---

# D. RREF · Pivot · Free variables

---

## D-1. REF vs RREF

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

---

## D-2. RREF의 유일성

### 정리 3.1 (RREF 유일성)
어떤 행렬 $A$에 대해서도 행 연산으로 도달하는 RREF는 **유일**합니다.

**의미**: REF는 어떤 행 교환을 했느냐에 따라 모양이 다를 수 있지만, **RREF는 한 가지뿐**입니다. → **표준형(canonical form)**.

→ "$A$의 RREF" 라고 부를 수 있습니다 (정관사 the).

**증명**: 8회차 Basis(기저) 도구가 필요하므로 그때.

---

## D-3. Pivot column vs Free column

**Pivot column(피벗 열)**: RREF에서 pivot이 들어 있는 열.
**Free column(자유 열)**: pivot이 없는 열.

| RREF | Pivot 열 | Free 열 |
|---|---|---|
| $\left[\begin{array}{ccc\|c} 1 & 0 & -1 & 0 \\ 0 & 1 & 2 & 3 \\ 0 & 0 & 0 & 0 \end{array}\right]$ | 1, 2 | **3** |
| $\left[\begin{array}{ccc\|c} 1 & 2 & 0 & 3 \\ 0 & 0 & 1 & 1 \\ 0 & 0 & 0 & 0 \end{array}\right]$ | 1, 3 | **2** |

**Free column 수 = 자유 변수 수 = 해의 자유도**.

---

## D-4. RREF에서 해 직접 읽기

$\left[\begin{array}{ccc|c} 1 & 0 & -1 & 0 \\ 0 & 1 & 2 & 3 \\ 0 & 0 & 0 & 0 \end{array}\right]$

- 1열·2열 pivot → $x_1, x_2$가 종속 변수
- 3열 free → $x_3 = t$ 임의

식으로:
- $x_1 - x_3 = 0 \Rightarrow x_1 = t$
- $x_2 + 2x_3 = 3 \Rightarrow x_2 = 3 - 2t$

**해**: $(t, 3-2t, t)$ — 직선 (1차원 자유도).

→ RREF만 보면 해의 **완전한 모양**이 즉시 나옵니다.

---

# E. 해의 세 경우

---

## E-1. 세 경우의 판정

$[A \mid \mathbf{b}]$의 RREF를 보고 판정합니다.

| 경우 | RREF의 특징 | 예 |
|---|---|---|
| **(i) 유일해** | 모든 변수 열에 pivot, $\mathbf{b}$ 열 pivot 없음 | $\left[\begin{array}{cc\|c} 1 & 0 & 2 \\ 0 & 1 & 1 \end{array}\right]$ |
| **(ii) 무수히 많은 해** | Free column이 있음, $\mathbf{b}$ 열 pivot 없음 | $\left[\begin{array}{ccc\|c} 1 & 0 & -1 & 0 \\ 0 & 1 & 2 & 3 \\ 0 & 0 & 0 & 0 \end{array}\right]$ |
| **(iii) 해 없음** | $\mathbf{b}$ 열에 pivot ($0 = c \ne 0$의 식) | $\left[\begin{array}{cc\|c} 1 & 2 & 3 \\ 0 & 0 & 1 \end{array}\right]$ |

**한 표로**: $\mathbf{b}$ 열 pivot이 있으면 모순 → 해 없음. 없으면 free column 수가 해의 자유도.

---

## E-2. 해 없음의 의미 — 모순 행

$\left[\begin{array}{cc|c} 1 & 2 & 3 \\ 0 & 0 & 1 \end{array}\right]$의 둘째 행은 식으로 $0 \cdot x_1 + 0 \cdot x_2 = 1$, 즉 $0 = 1$.

**어떤 $x_1, x_2$를 잡아도 모순**입니다 — 해 없음.

### 2회차와 연결
- 해 없음 ↔ $\mathbf{b} \notin \mathrm{col}(A)$ — $\mathbf{b}$가 $A$의 Column space 밖
- 해 있음 ↔ $\mathbf{b} \in \mathrm{col}(A)$ — Column space 안

오늘의 알고리즘이 **그 멤버십 판정을 손계산으로** 가능하게 합니다.

---

## E-3. 무수히 많은 해의 구조

해가 있고 free column이 $k$개면 → 해 집합은 **$k$차원 affine subspace**(평행이동된 부분공간).

### 구조
$\mathbf{x} = \mathbf{x}_p + \mathbf{x}_h$

- $\mathbf{x}_p$ = **특수해(particular solution)** — RREF에서 free 변수를 0으로
- $\mathbf{x}_h$ = **동차해(homogeneous solution)** — $A\mathbf{x} = \mathbf{0}$의 해 집합 (Null space, 5회차)

### 예 (앞 슬라이드)
해 $(t, 3-2t, t) = (0, 3, 0) + t(1, -2, 1)$
- $\mathbf{x}_p = (0, 3, 0)$
- $\mathbf{x}_h = t(1, -2, 1)$, 모든 $t \in \mathbb{R}$

→ **5회차 Null space**의 출발점.

---

<!-- _class: exercise -->

# 🖍 잠깐 풀어보기 — 해의 세 경우

각 경우를 RREF로 판정하고 해를 구하세요.

### 문제 1 (해 없음)
$$\begin{cases} x + y = 3 \\ 2x + 2y = 7 \end{cases}$$

### 문제 2 (유일해)
$$\begin{cases} x + 2y - z = 1 \\ -x + y + 2z = 2 \\ y + z = 1 \end{cases}$$

### 문제 3 (무수해)
$$\begin{cases} x + y - z = 2 \\ 2x + 2y - 2z = 4 \\ 3x + 3y - 3z = 6 \end{cases}$$

---

<!-- _class: exercise -->

## 잠깐 풀어보기 — 답

### 문제 1
$\left[\begin{array}{cc|c} 1 & 1 & 3 \\ 2 & 2 & 7 \end{array}\right]$ →$_{R_2 - 2R_1}$ $\left[\begin{array}{cc|c} 1 & 1 & 3 \\ 0 & 0 & 1 \end{array}\right]$ — $\mathbf{b}$ 열에 pivot → **해 없음**.

### 문제 2
RREF로 가면 $\left[\begin{array}{ccc|c} 1 & 0 & 0 & 1 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 1 \end{array}\right]$. 모든 변수 열 pivot → **유일해 $(1, 0, 1)$**.

### 문제 3
세 식이 같은 식의 1·2·3배. RREF: $\left[\begin{array}{ccc|c} 1 & 1 & -1 & 2 \\ 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \end{array}\right]$. Pivot 1개, free 2개.
$y = s, z = t$로 두면 $x = 2 - s + t$. 해: $(2-s+t,\,s,\,t)$. **2차원 자유 해 집합**.

> **메시지**: 세 식이 본질적으로 같은 식이면 자유도가 그만큼 커집니다.

---

# F. CS·AI 적용 + Column space 연결

---

## F-1. AI에서 Linear equation 풀이

| 응용 | $A\mathbf{x} = \mathbf{b}$의 역할 | 회차 |
|---|---|---|
| **선형 회귀** | $A\hat\beta = \mathbf{b}$ (overdetermined → 최소제곱) | 11 |
| **신경망 한 층의 역방향** | 입력 복원 (역연산) | Part 2 |
| **Embedding 정규화** | Linear constraint 적용 | 11 |
| **Optimization KKT** | 등식 제약 = $A\mathbf{x} = \mathbf{b}$ | 졸업 후 |
| **Computer Graphics** | 좌표 변환 풀이 | — |

대형 신경망 학습에서도 본질은 거대한 Linear equation system 근사 풀이입니다.

---

## F-2. 수치적 주의 — 부동소수점

손계산은 정확하지만 NumPy 등 부동소수점에서는 작은 오차가 누적됩니다.

```python
A = np.array([[2.0, 1.0], [1.0, 3.0]])
b = np.array([5.0, 5.0])
x = np.linalg.solve(A, b)  # → [2.0, 1.0] (정확)
```

`np.linalg.solve`는 LU Decomposition(4회차)을 내부적으로 사용합니다 — Gaussian elimination이 그 토대.

### Partial pivoting (간단 안내)
큰 행렬에서 **가장 큰 값을 pivot으로** 선택해 수치 안정성을 높이는 표준 기법입니다. 4회차 LU에서 다시 봅니다.

---

# G. 클로징

---

## G-1. 코딩 실습 골자

→ `11_주피터노트북/Part1/03_가우스소거_RREF.ipynb`

1. **Gaussian elimination을 직접 구현** (Forward + Backward)
2. NumPy `np.linalg.solve`와 결과 비교
3. `sympy.Matrix(...).rref()`로 RREF 직접 계산 + 손계산과 비교
4. 해의 세 경우를 모두 실험 (유일·무수·없음)
5. **랜덤 행렬 100개**에 대해 해 존재 여부를 RREF로 자동 판정
6. 시각화 — 2변수 경우 두 직선의 교차·평행·일치

---

## G-2. 오늘 회차 핵심 5개

1. **Elementary row operations 3가지** — 해를 바꾸지 않는 식 묶음 변형
2. **Gaussian elimination** — Forward(REF) + Backward(해 읽기)
3. **RREF는 유일** — 한 행렬의 표준형
4. **Pivot 열 vs Free 열** — Free 열 수 = 자유 변수 수
5. **해의 세 경우 판정** — $\mathbf{b}$ 열 pivot 있음 → 없음. Free 열 있음 → 무수. 모든 변수 열 pivot → 유일.

---

## G-3. 자기 점검 질문

- Elementary row operations 세 가지를 말해보세요. 왜 해를 보존합니까?
- REF와 RREF의 차이는 무엇입니까?
- 어떤 행렬의 RREF는 유일합니까, 아니면 알고리즘에 따라 달라집니까?
- "Free column이 있으면 무수히 많은 해" — 항상 참입니까? 반례를 생각해보세요.
- $\mathbf{b}$ 열에 pivot이 있다는 것의 기하학적 의미는?

---

<!-- _class: exercise -->

# 🎯 오늘의 마무리 문제 — 즉석 풀이

다음 system을 RREF로 풀고 **해의 종류**(유일·무수·없음)를 판정하세요.

$$\begin{cases} x + 2y + 3z = 4 \\ 2x + 5y + 7z = 9 \\ x + 3y + 5z = 6 \end{cases}$$

- **(a)** Augmented matrix를 적으세요.
- **(b)** Gaussian elimination으로 REF를 만드세요.
- **(c)** 추가 행 연산으로 RREF로 만드세요.
- **(d)** Pivot 열과 Free 열을 식별하세요.
- **(e)** 해의 종류·해를 적으세요.

---

<!-- _class: exercise -->

## 오늘의 마무리 문제 — 답

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

## 📝 다음 회차 Review용 숙제

위 마무리 문제의 **유사 문제**. 4회차 Review에서 함께 답을 맞춥니다.

다음 system을 RREF로 풀어 **해의 종류**를 판정하고 해를 구하세요.

$$\begin{cases} x + y + 2z = 4 \\ 2x + 3y + 5z = 9 \\ 3x + 5y + 8z = 14 \end{cases}$$

- (a) Augmented matrix → REF → RREF
- (b) Pivot · Free 열 식별
- (c) 해의 종류 (유일·무수·없음)
- (d) 해를 구하세요. (자유 변수가 있으면 일반해 형태로)

### 자기 점검
- (b)에서 세 행이 모두 살아남나요? 한 행이 0행이 되면 그 이유는?
- 4회차의 **Inverse matrix(역행렬)**가 정의되려면 RREF에서 어떤 조건이 필요한지 생각해보세요.

4회차 본 주제(**Inverse matrix · LU Decomposition**)와 직접 연결.

---

## G-4. 과제 안내

`04_과제/Part1/03회차_homework.md` — 마감: 4회차 시작 전

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

## G-5. 다음 회차 (4회차) 예고

**주제**: Inverse matrix · LU Decomposition

**연결**: 오늘 본 Gaussian elimination을 **행렬 형태로 정리**하면 LU Decomposition입니다. $A = LU$ — 가우스 소거의 모든 단계가 하삼각 Matrix $L$에 누적되고, 결과 REF가 상삼각 $U$.

또한 RREF에서 변수 열 모두 pivot ↔ Inverse matrix 존재. **Inverse matrix**가 4회차 첫 분해의 주인공.

**사전 reading**:
- MML §2.2.2 (Inverse), §2.3.5 (LU)
- Strang §2.5, §2.6
- 3Blue1Brown EoLA Ch.7 (Inverse, column space)

---

<!-- _class: lead -->

# Q & A

오늘의 사슬:
**Row operations → Gaussian elimination → REF → RREF → Pivot 패턴 → 해의 세 경우**

핵심 한 줄: **RREF의 Pivot 위치를 보면 $A\mathbf{x}=\mathbf{b}$의 해가 한눈에 보인다.**

`HANDOUT`: 본 PDF + `03_가우스소거_RREF.ipynb`
