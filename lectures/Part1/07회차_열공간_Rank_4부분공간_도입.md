---
marp: true
theme: default
paginate: true
header: '인공지능 전공자를 위한 선형대수학'
footer: 'Part 1 7회차 · Column space · Rank · 4 fundamental subspaces 도입'
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
            font-size: 19px; color: #312E81; border-radius: 0 8px 8px 0; }
  .strang strong { color: #4338CA; }
  .bigpicture { background: #FAF5FF; border: 2px solid #A855F7; padding: 14px 18px; margin: 14px 0;
                font-size: 19px; color: #581C87; border-radius: 8px; }
  .bigpicture strong { color: #6B21A8; }
---

<!-- _class: lead -->
<!-- _paginate: false -->

# Part 1 7회차

## Column space(열공간) · Rank(계수) · 4 fundamental subspaces 도입

MML §2.6 일부 (메인) · Strang Ch 3.3-3.4 (발췌, **시그니처**) · Part 1 (LA1)

> 6회차의 $N(A)$에 세 자매 $C(A), C(A^\top), N(A^\top)$를 더해 행렬에 자연스럽게 붙는 **네 부분공간의 큰 그림** 을 본다. 본 회차가 Strang 시그니처 발췌 가장 강한 회차이다.

---

<!-- _class: exercise -->

# Review: 6회차 마무리 숙제

지난 회차에서 제기한 문제:

> $A = \begin{pmatrix} 1 & 3 & 0 & 2 \\ 2 & 6 & 1 & 5 \\ 1 & 3 & 2 & 4 \end{pmatrix}$의 RREF·$N(A)$·열 span의 차원.

### 답

- $R_2 \leftarrow R_2 - 2R_1$, $R_3 \leftarrow R_3 - R_1$:
  $\begin{pmatrix} 1 & 3 & 0 & 2 \\ 0 & 0 & 1 & 1 \\ 0 & 0 & 2 & 2 \end{pmatrix}$.
- $R_3 \leftarrow R_3 - 2R_2$:
  $\begin{pmatrix} 1 & 3 & 0 & 2 \\ 0 & 0 & 1 & 1 \\ 0 & 0 & 0 & 0 \end{pmatrix}$ ← **RREF**.
- Pivot 열: 1, 3 / Free 열: 2, 4. $x_2 = s$, $x_4 = t$, $x_1 = -3s - 2t$, $x_3 = -t$.
- $N(A) = \mathrm{span}\{(-3,1,0,0)^\top,\,(-2,0,-1,1)^\top\}$, $\mathbb{R}^4$의 **2차원 부분공간**.
- 열 span의 차원 = Pivot 수 = **2**.

---

<!-- _class: exercise -->

## Review: 핵심 관찰

(e)의 "열 span의 차원" 이 **Pivot 수** 와 같다는 사실은 본 회차의 핵심 주장이다.

- 4개 열 중 **2개의 Pivot 열** ($\mathbf{a}_1, \mathbf{a}_3$)이 나머지 두 열을 span한다.
- 즉 $\mathbf{a}_2 = 3\mathbf{a}_1$, $\mathbf{a}_4 = 2\mathbf{a}_1 + \mathbf{a}_3$.

본 한 줄이 본 회차의 다섯 줄짜리 주장:

> **Column space의 차원 = Row space의 차원 = Pivot 수 = Rank.**

본 회차에서 $C(A)$를 정식화하고, 두 자매 부분공간 $C(A^\top), N(A^\top)$를 도입하며, 4 부분공간의 직교 그림을 본다.

---

## 본 회차 핵심 질문

> ### 행렬 $A$에는 **네 개의 부분공간** 이 자연스럽게 붙는다: 이들은 무엇이며, 차원·직교성의 어떤 큰 그림을 이루는가?

이 한 질문에 답하려면 네 객체를 모두 정의해야 한다.

- **Column space** $C(A)$: 열들의 span ($\mathbb{R}^m$ 안)
- **Row space** $C(A^\top)$: 행들의 span ($\mathbb{R}^n$ 안)
- **Null space** $N(A)$: $A\mathbf{x} = \mathbf{0}$의 해 ($\mathbb{R}^n$ 안)
- **Left null space** $N(A^\top)$: $A^\top \mathbf{y} = \mathbf{0}$의 해 ($\mathbb{R}^m$ 안)

본 회차에서 정의와 직관, 8회차에서 차원정리와 정식 증명.

---

## 학습 목표

이번 회차가 끝나면 학생은 다음을 답할 수 있어야 합니다.

1. **Column space** $C(A)$의 정의를 진술하고, RREF로 기저를 구할 수 있습니다.
2. **Row space** $C(A^\top)$의 정의와 RREF로의 기저 추출을 진술할 수 있습니다.
3. **Rank**의 정의(Pivot 수 = $C(A)$ 차원 = $C(A^\top)$ 차원)를 진술할 수 있습니다.
4. **4 fundamental subspaces**의 이름·소속 공간·차원을 표로 정리할 수 있습니다.
5. $C(A) \perp N(A^\top)$, $C(A^\top) \perp N(A)$의 직교 관계를 직관적으로 설명할 수 있습니다 (정식 증명은 Part 2 1회차 Orthogonality).

---

## 본 회차 개념 사슬

| 질문 | 답 | 도구 |
|---|---|---|
| 열들의 span은? | **Column space** $C(A)$ | $\subseteq \mathbb{R}^m$ |
| 행들의 span은? | **Row space** $C(A^\top)$ | $\subseteq \mathbb{R}^n$ |
| 두 차원이 같은가? | **Rank** | Pivot 수 |
| 본 회차 마지막 두 부분공간? | $N(A), N(A^\top)$ | 동차 system |
| 큰 그림은? | **4 fundamental subspaces** | 직교 쌍 |

---

## 수업 흐름

| 순서 | 블록 | 내용 |
|:---:|:---:|---|
| ① | A | 오프닝 + 6회차 Review |
| ② | B | **Column space** $C(A)$ 정의·기저 |
| ③ | C | **Row space** $C(A^\top)$ 정의·기저 |
| ④ | **D** | **Rank**: 세 차원이 같다 |
| ⑤ | **E** | **4 fundamental subspaces** 큰 그림 |
| ⑥ | F | 차원 정리 도입 (정식은 8회차) |
| ⑦ | G | 응용 + 마무리 + 다음 회차 |

> **B-C-D-E가 본 회차의 심장이다.** E가 Strang 시그니처 본문이다.

---

## B. Column space · B-1. 정의

### Definition (Column space, 열공간)
$A = [\mathbf{a}_1 \mid \mathbf{a}_2 \mid \cdots \mid \mathbf{a}_n] \in \mathbb{R}^{m \times n}$의 **Column space**는

$$C(A) \;:=\; \mathrm{span}\{\mathbf{a}_1, \ldots, \mathbf{a}_n\} \;=\; \{A\mathbf{x} : \mathbf{x} \in \mathbb{R}^n\}.$$

두 표현이 같음은 3회차의 Column picture: $A\mathbf{x} = \sum x_j \mathbf{a}_j$이므로 $A\mathbf{x}$ 전체가 곧 열들의 span.

**소속 공간**: $C(A) \subseteq \mathbb{R}^m$ (열이 $m$차원 벡터).

### 명제 7.1 (Column space는 부분공간)
$C(A)$는 $\mathbb{R}^m$의 부분공간 (Span은 항상 부분공간, 6회차 명제 6.3).

---

## B-2. $\mathbf{b} \in C(A)$의 의미

| 질문 | $C(A)$ 언어 |
|---|---|
| $A\mathbf{x} = \mathbf{b}$가 해를 가지는가? | $\mathbf{b} \in C(A)$? |
| 해를 가지지 않는가? | $\mathbf{b} \notin C(A)$ |
| 항상 해를 가지는가? | $C(A) = \mathbb{R}^m$ |

3회차의 "해 존재 ↔ Column picture에서 $\mathbf{b}$ 도달 가능" 과 일치한다.

### Strang Ch 3.3 발췌

<div class="strang">

**Strang Ch 3.3 발췌 (Column space의 의미)**

$A\mathbf{x} = \mathbf{b}$의 해 존재 여부는 **$\mathbf{b}$가 $A$의 Column space 안에 있는지** 한 질문으로 정리된다. $C(A)$는 $A$가 "도달할 수 있는 출력의 전체 집합" 이다.

선형층 관점에서 $C(W)$는 그 층이 만들 수 있는 모든 출력의 부분공간이다. 신경망 한 층의 표현력 한계가 정확히 그 층의 $C(W)$의 차원이다.

</div>

---

## B-3. Column space의 기저 (RREF로 추출)

### 방법
1. $A$를 RREF로 만든다.
2. RREF의 **Pivot 열의 위치** 를 기록.
3. **원래 $A$의 같은 위치의 열** 이 $C(A)$의 기저.

### 예
$A = \begin{pmatrix} 1 & 2 & 3 \\ 2 & 4 & 7 \\ 3 & 6 & 11 \end{pmatrix}$.

RREF: $R_2 \leftarrow R_2 - 2R_1$, $R_3 \leftarrow R_3 - 3R_1$, ...
$\begin{pmatrix} 1 & 2 & 0 \\ 0 & 0 & 1 \\ 0 & 0 & 0 \end{pmatrix}$. Pivot 열: 1, 3.

**$C(A)$의 기저**: $A$의 1열과 3열, 즉 $\{(1,2,3)^\top, (3,7,11)^\top\}$. $\dim C(A) = 2$.

### 경고
RREF의 열을 그대로 쓰지 말 것. RREF는 행 연산 결과라서 **열 공간이 보존되지 않는다** (행 공간만 보존). 따라서 기저는 **원래 $A$의 열**.

---

## C. Row space · C-1. 정의

### Definition (Row space, 행공간)
$A \in \mathbb{R}^{m \times n}$의 **Row space**는 $A$의 행들의 span. 행들을 열로 다시 쓰면 곧 $A^\top$의 Column space이므로

$$C(A^\top) \;=\; \mathrm{span}\{A\text{의 행들}\} \;\subseteq\; \mathbb{R}^n.$$

**소속 공간**: $C(A^\top) \subseteq \mathbb{R}^n$ (행이 $n$차원 벡터).

### 명제 7.2 (Row space는 행 연산에 불변)
행 연산은 $C(A^\top)$를 보존한다.

**증명 골자**: 행 연산은 행들의 선형결합이므로 새 행들도 원래 행들의 span 안. 또한 가역이므로 원래 행들도 새 행들의 span 안. 따라서 두 span이 같다. $\blacksquare$

---

## C-2. Row space 기저

행 연산이 행 공간을 보존하므로

> **RREF의 0이 아닌 행들이 $C(A^\top)$의 기저**.

### 예 (위 B-3과 같은 $A$)
RREF의 0이 아닌 행: $(1, 2, 0), (0, 0, 1)$. → $C(A^\top) = \mathrm{span}\{(1,2,0)^\top, (0,0,1)^\top\}$, $\dim C(A^\top) = 2$.

### 핵심 관찰 (대칭)

| 부분공간 | RREF 기저 추출 |
|---|---|
| $C(A)$ | **원래 $A$의** Pivot 열 |
| $C(A^\top)$ | **RREF의** 0 아닌 행 |

두 차원이 같다 (Pivot 수). 이것이 본 회차의 정리.

---

## D. Rank · D-1. 정의와 정리

### Definition (Rank)
$A$의 **Rank** $\mathrm{rank}(A)$는 다음 세 값 중 하나로 정의한다 (모두 같다고 곧 증명).

1. RREF에서 Pivot의 수
2. $C(A)$의 차원
3. $C(A^\top)$의 차원

### 정리 7.1 (Rank의 세 정의 동치)
임의의 $A \in \mathbb{R}^{m \times n}$에 대해

$$\dim C(A) \;=\; \dim C(A^\top) \;=\; \text{Pivot 수}.$$

**증명 골자**:
- "Pivot 수 = $\dim C(A^\top)$" : RREF의 0 아닌 행 ($=$ Pivot 수)이 $C(A^\top)$의 일차독립 생성집합 (8회차 일차독립으로 정식).
- "Pivot 수 = $\dim C(A)$" : 원래 $A$의 Pivot 열들이 $C(A)$의 일차독립 생성집합 (8회차에서 정식).

8회차에서 일차독립·기저·차원을 정식화한 뒤 본 정리의 증명을 완성한다. $\blacksquare$

---

## D-2. Rank가 같다는 사실의 의미

| 풀이 | Rank로 |
|---|---|
| $A\mathbf{x} = \mathbf{b}$가 항상 해 가짐 | $\mathrm{rank}(A) = m$ ($C(A) = \mathbb{R}^m$) |
| $A\mathbf{x} = \mathbf{b}$의 해가 유일 (있을 때) | $\mathrm{rank}(A) = n$ ($N(A) = \{\mathbf{0}\}$) |
| 정사각 $A$가 가역 | $\mathrm{rank}(A) = n$ (5회차 동치 사슬) |

### 표기·관습

- 일반적으로 $\mathrm{rank}(A) \le \min(m, n)$.
- $\mathrm{rank}(A) = \min(m, n)$일 때 **Full rank**.
  - 정사각이면 가역.
  - 가로형 ($m < n$)이면 onto이지만 유일성 X.
  - 세로형 ($m > n$)이면 일차독립한 열이지만 onto X (Part 2 2회차 최소제곱의 무대).

---

## D-3. Rank 계산 예

### 예 1
$A = \begin{pmatrix} 1 & 2 \\ 2 & 4 \\ 3 & 6 \end{pmatrix}$. 두 열이 비례 ($\mathbf{a}_2 = 2\mathbf{a}_1$) → $\mathrm{rank}(A) = 1$.

### 예 2
$A = \begin{pmatrix} 1 & 0 & 1 \\ 0 & 1 & 1 \\ 1 & 1 & 2 \end{pmatrix}$ (3회차 Review 행렬). $\mathbf{a}_3 = \mathbf{a}_1 + \mathbf{a}_2$. RREF는 $\begin{pmatrix} 1 & 0 & 1 \\ 0 & 1 & 1 \\ 0 & 0 & 0 \end{pmatrix}$. Pivot 2 → $\mathrm{rank} = 2$.

### 예 3
$A = I_n$. $\mathrm{rank}(I_n) = n$ (모든 열이 일차독립).

---

## E. 4 fundamental subspaces · E-1. 네 객체

본 회차 시그니처. 행렬 $A \in \mathbb{R}^{m \times n}$에 자연스럽게 붙는 네 부분공간:

| 이름 | 정의 | 소속 |
|---|---|:---:|
| **Column space** | $C(A) = \{A\mathbf{x} : \mathbf{x} \in \mathbb{R}^n\}$ | $\subseteq \mathbb{R}^m$ |
| **Row space** | $C(A^\top) = \{A^\top \mathbf{y} : \mathbf{y} \in \mathbb{R}^m\}$ | $\subseteq \mathbb{R}^n$ |
| **Null space** | $N(A) = \{\mathbf{x} : A\mathbf{x} = \mathbf{0}\}$ | $\subseteq \mathbb{R}^n$ |
| **Left null space** | $N(A^\top) = \{\mathbf{y} : A^\top \mathbf{y} = \mathbf{0}\}$ | $\subseteq \mathbb{R}^m$ |

두 자매 ($C(A), N(A^\top)$)가 $\mathbb{R}^m$ 안에, 다른 두 자매 ($C(A^\top), N(A)$)가 $\mathbb{R}^n$ 안에 산다.

---

## E-2. 차원 정리 (Rank-nullity, 정식은 8회차)

### 정리 7.2 (차원 정리, 도입)

$A \in \mathbb{R}^{m \times n}$, $r = \mathrm{rank}(A)$라 하자. 그러면

$$\boxed{\dim C(A) \;=\; \dim C(A^\top) \;=\; r}$$
$$\boxed{\dim N(A) \;=\; n - r, \qquad \dim N(A^\top) \;=\; m - r.}$$

특히 $\dim C(A^\top) + \dim N(A) = n$, $\dim C(A) + \dim N(A^\top) = m$.

**직관 (Pivot · Free의 분배)**:
- $\mathbb{R}^n$의 $n$개 열 변수 중 Pivot 열 $r$개가 $C(A^\top)$의 차원에 기여, Free 열 $n - r$개가 $N(A)$의 차원에 기여.
- $\mathbb{R}^m$의 $m$개 행 변수 중 Pivot 행 $r$개가 $C(A)$의 차원에 기여, 나머지 $m - r$개가 $N(A^\top)$의 차원에 기여.

정식 증명은 8회차에서 일차독립·기저·차원의 정식 정의 후.

---

## E-3. Strang 시그니처: Big picture

<div class="strang">

**Strang Ch 3.4 발췌 (4 fundamental subspaces big picture, 시그니처)**

행렬 $A$를 보는 가장 좋은 방법은 **$A$가 $\mathbb{R}^n$에서 $\mathbb{R}^m$으로 가는 선형사상** 이다. 그 정의역 $\mathbb{R}^n$과 공역 $\mathbb{R}^m$ 각각이 두 부분공간으로 정확히 둘로 쪼개진다.

$$\mathbb{R}^n \;=\; C(A^\top) \;\oplus\; N(A) \qquad \mathbb{R}^m \;=\; C(A) \;\oplus\; N(A^\top)$$

여기서 $\oplus$는 직교 직합. 즉

- $C(A^\top) \perp N(A)$ 안에서 $\mathbb{R}^n$이 둘로 쪼개진다.
- $C(A) \perp N(A^\top)$ 안에서 $\mathbb{R}^m$이 둘로 쪼개진다.

$A$의 작용: $C(A^\top)$의 원소를 $C(A)$로 일대일 사상, $N(A)$의 원소를 $\mathbf{0}$으로. 정확히 Strang의 "big picture" 도식이며, 본 강의 전체의 척추이다.

</div>

---

## E-4. Big picture를 본문 텍스트·식으로

<div class="bigpicture">

**4 fundamental subspaces big picture**

$\mathbb{R}^n$ 쪽 (정의역):
- **Row space** $C(A^\top)$, 차원 $r$
- **Null space** $N(A)$, 차원 $n - r$
- 둘은 **수직** ($C(A^\top) \perp N(A)$)
- 합쳐서 $\mathbb{R}^n$ 전체 ($\dim = n$)

$\mathbb{R}^m$ 쪽 (공역):
- **Column space** $C(A)$, 차원 $r$
- **Left null space** $N(A^\top)$, 차원 $m - r$
- 둘은 **수직** ($C(A) \perp N(A^\top)$)
- 합쳐서 $\mathbb{R}^m$ 전체 ($\dim = m$)

$A$의 작용:
- $\mathbf{x} \in C(A^\top)$ → $A\mathbf{x} \in C(A)$ (일대일)
- $\mathbf{x} \in N(A)$ → $\mathbf{0} \in \mathbb{R}^m$
- 임의의 $\mathbf{x} \in \mathbb{R}^n$ = $\mathbf{x}_r + \mathbf{x}_n$ ($\mathbf{x}_r \in C(A^\top), \mathbf{x}_n \in N(A)$)
- $A\mathbf{x} = A\mathbf{x}_r + \mathbf{0} = A\mathbf{x}_r \in C(A)$

</div>

본 한 그림이 본 강의 전체의 척추이다. 다음 25 회차 중 절반 이상이 이 그림의 어느 모서리를 다룬다.

---

## E-5. 직교성의 직관 (정식 증명은 Part 2 1회차)

**$C(A^\top) \perp N(A)$**: $\mathbf{x} \in N(A)$이면 $A\mathbf{x} = \mathbf{0}$. 이 식의 한 행을 보면 "($A$의 한 행) · $\mathbf{x}$ $= 0$" 이다. 즉 $\mathbf{x}$는 $A$의 **모든 행과 수직**, 따라서 행들의 span $= C(A^\top)$과 수직.

**$C(A) \perp N(A^\top)$**: $A$ 자리에 $A^\top$를 넣으면 위와 똑같은 논리. $\mathbf{y} \in N(A^\top)$이면 $A^\top \mathbf{y} = \mathbf{0}$, 즉 $\mathbf{y}$는 $A^\top$의 모든 행 ($=A$의 모든 열)과 수직.

정식 정의 (Orthogonal complement, $V^\perp$)는 Part 2 1회차.

---

## E-6. Big picture 표 (한 자리 정리)

| 부분공간 | 정의 | 차원 | 소속 공간 | 직교 짝 |
|---|---|:---:|:---:|---|
| $C(A)$ | 열의 span | $r$ | $\mathbb{R}^m$ | $N(A^\top)$ |
| $C(A^\top)$ | 행의 span | $r$ | $\mathbb{R}^n$ | $N(A)$ |
| $N(A)$ | $A\mathbf{x} = \mathbf{0}$ | $n - r$ | $\mathbb{R}^n$ | $C(A^\top)$ |
| $N(A^\top)$ | $A^\top \mathbf{y} = \mathbf{0}$ | $m - r$ | $\mathbb{R}^m$ | $C(A)$ |

**합 법칙**: $r + (n - r) = n$, $r + (m - r) = m$. 빠짐 없이 모든 차원이 채워진다.

---

## F. 도입 적용 예제

### 예: $A = \begin{pmatrix} 1 & 2 & 0 \\ 0 & 0 & 1 \\ 1 & 2 & 1 \end{pmatrix}$의 4 부분공간

**RREF**: $R_3 \leftarrow R_3 - R_1 - R_2$:
$\begin{pmatrix} 1 & 2 & 0 \\ 0 & 0 & 1 \\ 0 & 0 & 0 \end{pmatrix}$. Pivot 열: 1, 3. Pivot 수 $r = 2$.

| 부분공간 | 기저 | 차원 |
|---|---|:---:|
| $C(A)$ | $\{(1,0,1)^\top,\,(0,1,1)^\top\}$ ($A$의 1, 3열) | 2 |
| $C(A^\top)$ | $\{(1,2,0)^\top,\,(0,0,1)^\top\}$ (RREF 행) | 2 |
| $N(A)$ | $\{(-2, 1, 0)^\top\}$ ($x_2 = 1$, free) | 1 |
| $N(A^\top)$ | $\{(1, 1, -1)^\top\}$ ($A^\top$의 RREF로) | 1 |

**검산**: $r + (n-r) = 2 + 1 = 3 = n$ ✓, $r + (m-r) = 2 + 1 = 3 = m$ ✓.

---

## F-2. Equivariance 직관 한 슬라이드 (8회차 삭제 흡수)

**Equivariance**(등변성): 연산 $T$와 변환 $g$가 교환 ($T \circ g = g \circ T$)할 때, $T$는 $g$에 대해 등변이라 한다.

| 예 | 변환 | 의미 |
|---|---|---|
| CNN의 1D Conv | 평행이동 | shift-equivariant |
| GNN의 message passing | 노드 순서 permutation | permutation-equivariant |
| 신경망 + Normalization | 스케일 | scale-equivariant |

본 강의 본문에서는 직관 한 줄로만 두고, 정식 정의 (commute의 의미·Kronecker 곱 정식 식)는 부록·심화로 보낸다. Part 4 7회차 (Attention)에서 한 슬라이드 더 다룬다.

> **메시지**: 4 부분공간의 큰 그림이 정적인 그림이라면, equivariance는 그 그림이 변환에 대해 어떻게 보존되는지의 동적인 이야기이다.

---

<!-- _class: exercise -->

# 잠깐 풀어보기: 4 부분공간

$A = \begin{pmatrix} 1 & 0 & 2 \\ 1 & 1 & 3 \\ 0 & 1 & 1 \end{pmatrix}$.

- **(a)** RREF
- **(b)** $\mathrm{rank}(A)$
- **(c)** $C(A)$의 기저와 차원
- **(d)** $N(A)$의 기저와 차원
- **(e)** $C(A^\top)$의 기저와 차원
- **(f)** $\dim C(A) + \dim N(A) = ?$ ($n$인가?)

---

<!-- _class: exercise -->

## 잠깐 풀어보기: 답

- **(a)** $R_2 \leftarrow R_2 - R_1$, $R_3 \leftarrow R_3 - R_2$: $\begin{pmatrix} 1 & 0 & 2 \\ 0 & 1 & 1 \\ 0 & 0 & 0 \end{pmatrix}$ ← **RREF**.
- **(b)** Pivot 2개 → $\mathrm{rank}(A) = 2$.
- **(c)** $A$의 1, 2열 → $\{(1,1,0)^\top,\,(0,1,1)^\top\}$, 차원 2.
- **(d)** Free 열 3, $x_3 = 1$ → $x_1 = -2$, $x_2 = -1$. $N(A) = \mathrm{span}\{(-2, -1, 1)^\top\}$, 차원 1.
- **(e)** RREF의 0 아닌 행: $\{(1,0,2)^\top,\,(0,1,1)^\top\}$, 차원 2.
- **(f)** $2 + 1 = 3 = n$ ✓. **차원 정리** 확인.

> **검산**: 1, 2, 3, 4 부분공간 모두 직교 짝의 차원 $r + (n-r) = n$, $r + (m-r) = m$ 만족.

---

## G. 응용 · AI 연결

### G-1. 신경망 한 층의 4 부분공간

선형층 $\mathbf{y} = W\mathbf{x}$, $W \in \mathbb{R}^{m \times n}$:

| 부분공간 | AI 해석 |
|---|---|
| $C(W) \subseteq \mathbb{R}^m$ | 그 층이 만들 수 있는 모든 출력 방향 |
| $N(W) \subseteq \mathbb{R}^n$ | 그 층이 0으로 보내는 입력 방향 (정보 손실) |
| $C(W^\top) \subseteq \mathbb{R}^n$ | 그 층이 실제로 사용하는 입력 방향 |
| $N(W^\top) \subseteq \mathbb{R}^m$ | 그 층이 절대 도달하지 못하는 출력 방향 |

**Bottleneck**: $\dim C(W) < m$이면 일부 출력 방향이 표현 불가. 이것이 Autoencoder의 핵심.

---

## G-2. PCA·SVD 미리보기

Part 4 PCA의 핵심: 데이터 행렬 $X \in \mathbb{R}^{N \times d}$의 4 부분공간을 분석.

- $C(X) \subseteq \mathbb{R}^N$: 데이터가 살고 있는 샘플 방향
- $C(X^\top) \subseteq \mathbb{R}^d$: 데이터가 사용하는 특성 방향
- $N(X)$: 의미 없는 샘플 결합
- $N(X^\top)$: 사용되지 않는 특성 결합

**Rank**가 데이터의 본질적 자유도. PCA의 주성분이 $C(X^\top)$의 직교 기저이고, 신경망 학습이 본질적으로 이 부분공간들을 추정·근사한다.

본 회차의 그림이 Part 4 전체의 직관적 토대이다.

---

<!-- _class: exercise -->

# 본 회차 마무리 문제

$A = \begin{pmatrix} 1 & 2 & 1 & 1 \\ 2 & 4 & 3 & 4 \\ 1 & 2 & 2 & 3 \end{pmatrix}$로 두자.

- **(a)** $A$의 RREF와 $\mathrm{rank}(A)$
- **(b)** $C(A)$의 기저 (원래 $A$의 열로)
- **(c)** $C(A^\top)$의 기저 (RREF의 행으로)
- **(d)** $N(A)$의 기저와 차원
- **(e)** $N(A^\top)$의 차원 (정의·차원 정리로 두 가지 방식)
- **(f)** 4 부분공간을 표로 정리: 차원과 소속 공간 ($\mathbb{R}^m$ or $\mathbb{R}^n$)

---

<!-- _class: exercise -->

## 본 회차 마무리 문제: 답

- **(a)** $R_2 \leftarrow R_2 - 2R_1$, $R_3 \leftarrow R_3 - R_1$:
  $\begin{pmatrix} 1 & 2 & 1 & 1 \\ 0 & 0 & 1 & 2 \\ 0 & 0 & 1 & 2 \end{pmatrix}$. $R_3 \leftarrow R_3 - R_2$, $R_1 \leftarrow R_1 - R_2$:
  $\begin{pmatrix} 1 & 2 & 0 & -1 \\ 0 & 0 & 1 & 2 \\ 0 & 0 & 0 & 0 \end{pmatrix}$ ← **RREF**. Pivot 2 → **$\mathrm{rank}(A) = 2$**.

- **(b)** Pivot 열 1, 3 → $\{(1,2,1)^\top,\,(1,3,2)^\top\}$, $\dim C(A) = 2$.

- **(c)** RREF의 0 아닌 행 $\{(1,2,0,-1)^\top,\,(0,0,1,2)^\top\}$, $\dim C(A^\top) = 2$.

- **(d)** $x_2 = s$, $x_4 = t$ free → $x_1 = -2s + t$, $x_3 = -2t$. $N(A) = \mathrm{span}\{(-2,1,0,0)^\top,\,(1,0,-2,1)^\top\}$, 차원 2.

- **(e)** 차원 정리로 $\dim N(A^\top) = m - r = 3 - 2 = 1$. 직접 계산: $A^\top \mathbf{y} = \mathbf{0}$의 RREF에서 free variable 1개 → 1차원. ✓

- **(f)** 표:

| 부분공간 | 차원 | 소속 |
|---|:---:|:---:|
| $C(A)$ | 2 | $\mathbb{R}^3$ |
| $C(A^\top)$ | 2 | $\mathbb{R}^4$ |
| $N(A)$ | 2 | $\mathbb{R}^4$ |
| $N(A^\top)$ | 1 | $\mathbb{R}^3$ |

검산: $2 + 2 = 4 = n$ ✓, $2 + 1 = 3 = m$ ✓.

---

## G-3. 본 회차 핵심 5개

1. **Column space** $C(A)$: 열의 span, 차원 = Pivot 수
2. **Row space** $C(A^\top)$: 행의 span, 차원 = Pivot 수
3. **Rank**: 세 정의가 동치, Pivot · $\dim C(A)$ · $\dim C(A^\top)$
4. **4 fundamental subspaces**: $C(A), C(A^\top), N(A), N(A^\top)$
5. **Big picture**: $\mathbb{R}^n = C(A^\top) \oplus N(A)$, $\mathbb{R}^m = C(A) \oplus N(A^\top)$, 각 쌍은 직교

---

## G-4. 자기 점검 질문

- Rank의 세 정의를 말할 수 있는가?
- $C(A)$의 기저를 RREF에서 어떻게 추출하는가? (원래 $A$인지 RREF인지)
- $C(A^\top)$의 기저는 어떻게 추출하는가?
- 4 부분공간의 차원 합 두 식 ($r + (n-r) = n$, $r + (m-r) = m$)을 말할 수 있는가?
- $N(A)$와 $C(A^\top)$가 같은 공간 ($\mathbb{R}^n$)에 산다는 사실의 의미는?

---

<!-- _class: exercise -->

## 다음 회차 Review용 숙제

7회차 마무리 문제의 짝 문제이다. 8회차 Review에서 함께 답을 맞춘다.

$A = \begin{pmatrix} 1 & 1 & 0 & 2 \\ 2 & 3 & 1 & 5 \\ 1 & 2 & 1 & 3 \end{pmatrix}$로 두자.

- (a) RREF와 $\mathrm{rank}(A)$
- (b) $C(A), C(A^\top)$의 기저
- (c) $N(A)$의 기저와 차원
- (d) $N(A^\top)$의 차원
- (e) 4 부분공간을 차원·소속 공간 표로
- (f) (8회차 예고) $N(A)$의 임의 벡터와 $C(A^\top)$의 임의 벡터의 내적이 0임을 한 쌍의 벡터로 확인

### 자기 점검
- (f)의 직교성은 어떤 보편적 사실의 한 예인가? Part 2 1회차에서 정식 증명.
- 만약 $A$를 가로로 한 열 더 (Free 열) 늘리면 $N(A)$의 차원은 어떻게 변하나?

---

## G-5. 다음 회차 (8회차) 예고

**주제**: Linear independence · Basis · Dimension · 차원정리 · 4 부분공간 정식

**연결**: 본 회차의 "Pivot 수 = 차원" 사실을 정식 증명하기 위해 **일차독립**·**기저**·**차원**을 정식 정의하고, 본 회차의 도입 정리 7.2 (차원 정리)를 본격 증명한다. 4 부분공간의 큰 그림을 8회차에 정식 마무리한다.

**사전 reading**:
- MML §2.5 일차독립, §2.6 기저·차원·계수 정식
- Strang Ch 3.4-3.5 (Strang 시그니처 정식 마무리)

---

## 다음 회차로 가져갈 질문

다음 세 가지 질문을 8회차로 가져간다.

1. **일차독립** (linear independence)의 정식 정의는 무엇이며, "$\mathbf{a}_2 = 2\mathbf{a}_1$" 같은 종속 관계를 어떻게 일반화하는가?
2. **기저** (basis)의 정의: 일차독립 + 생성 두 조건. 어떻게 행렬에서 RREF로 만드는가?
3. **차원 정리** $\dim C(A) + \dim N(A) = n$의 정식 증명을 어떻게 하는가? Free 변수가 $N(A)$ 기저를 만든다는 사실은?

---

<!-- _class: lead -->

# Q & A

본 회차 사슬:
**Column space → Row space → Rank → 4 fundamental subspaces → Big picture**

핵심 한 줄: **$A$는 $\mathbb{R}^n$의 절반 ($C(A^\top)$)을 $\mathbb{R}^m$의 절반 ($C(A)$)으로 일대일 사상하고, 나머지는 모두 $\mathbf{0}$이다.**

`HANDOUT`: 본 PDF + `07_열공간_Rank.ipynb` (선택)
