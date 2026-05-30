---
marp: true
theme: default
paginate: true
header: '인공지능 전공자를 위한 선형대수학'
footer: 'Part 3 1회차 — Vector Calculus 1: Jacobian · Chain rule · Gradient'
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

# Part 3 1회차

## Vector Calculus 1: Jacobian(자코비안)·Chain rule·Gradient

MML §5.1-5.4 (메인) · Part 3 (VC + Probability)
**Part 3 (VC + Probability) 시작**: 행렬 분해 (Eigenvalue·SVD)에서 미분 연산으로 전환한다. 신경망 학습의 backward pass가 사실 본 회차 두 도구 (Jacobian·Chain rule)의 반복임을 본다.

> 본 회차의 결과는 "왜 행렬 미분이 자연스러운가"에 답한다. 2회차 (Hessian·Newton) 와 3·4회차 (확률·최적화) 의 전제이다.

---

<!-- _class: exercise -->

# Review: 지난 회차 (Part 2 9회차) 마무리 문제

지난 회차에서 다룬 Eckart-Young 정리와 저계수 근사:

> **(a)** $A \in \mathbb{R}^{m \times n}$의 SVD가 $A = U\Sigma V^\top$일 때, rank $k$ 근사 $A_k = \sum_{i=1}^{k} \sigma_i \mathbf{u}_i \mathbf{v}_i^\top$의 Frobenius 오차를 식으로 적으시오.
> **(b)** Eckart-Young 정리의 한 줄 진술.
> **(c)** Linear transformation $T: \mathbb{R}^n \to \mathbb{R}^m$이 Matrix $A \in \mathbb{R}^{m \times n}$과 동치임을 말하는 핵심 사실.

---

<!-- _class: exercise -->

# Review: 답

- **(a)** $\Vert A - A_k \Vert_F^2 = \sum_{i=k+1}^{r} \sigma_i^2$, 여기서 $r = \mathrm{rank}(A)$이다. 잘려나간 특이값의 제곱 합이 오차의 제곱이다.

- **(b)** **rank가 $k$ 이하인 모든 행렬 중, SVD를 잘라 만든 $A_k$가 Frobenius·Spectral norm 모두에서 최소 오차를 준다.**

- **(c)** $T$가 Linear (덧셈·Scalar곱 보존) 이면 표준기저 상의 값 $T(\mathbf{e}_1), \ldots, T(\mathbf{e}_n)$이 $T$를 완전히 결정하고, 이 값들을 열로 모은 행렬 $A$가 $T(\mathbf{x}) = A\mathbf{x}$를 만족한다.

> Part 2 5-9회차의 결론: Matrix는 Linear transformation이며, 그 transformation은 Eigenvalue·SVD로 분해된다. 본 회차부터는 **비선형 함수의 국소 선형화**가 주제이다.

---

## 본 회차 핵심 질문

> ### 다변수 함수 $\mathbf{f}: \mathbb{R}^n \to \mathbb{R}^m$의 "미분"은 무엇이고, 합성함수의 미분은 어떻게 결합되는가?

이 한 질문에 답하려면 네 단계가 필요하다.

1. Partial derivative (편미분) 와 Gradient (그래디언트)
2. Jacobian (자코비안) Matrix, 다변수 미분의 표준 표현
3. Chain rule (연쇄법칙), 합성함수의 Jacobian 곱
4. Matrix·Vector 입력 함수의 미분 (행렬 미분)

본 회차의 결과는 "신경망의 backward pass = Jacobian 곱의 누적"으로 모인다.

---

## 학습 목표

본 회차가 끝나면 학생은 다음을 답할 수 있어야 한다.

1. **Partial derivative**·**Gradient**의 정의와 기하적 의미 (steepest ascent 방향) 를 설명할 수 있다.
2. **Jacobian Matrix**를 정의하고, 단순한 함수에 대해 손으로 구할 수 있다.
3. **Chain rule (다변수)** 을 Jacobian 곱으로 진술하고, 합성함수에 적용할 수 있다.
4. **Gradient = (스칼라 출력 함수의) Jacobian의 전치**임을 설명할 수 있다.
5. **신경망 한 층의 forward·backward**를 Jacobian 곱으로 분해할 수 있다.

---

## 본 회차 개념 사슬

| 질문 | 답 | 도구 |
|---|---|---|
| 한 변수의 미분이 다변수로? | **Partial derivative** | $\partial f / \partial x_i$ |
| 모든 partial을 한 묶음으로? | **Gradient** $\nabla f$ | $\mathbb{R}^n$ Vector |
| Vector valued 함수의 미분? | **Jacobian** $J_{\mathbf{f}}$ | $\mathbb{R}^{m \times n}$ Matrix |
| 합성함수 $\mathbf{g} \circ \mathbf{f}$의 미분? | **Chain rule** | Jacobian 곱 $J_{\mathbf{g}} \, J_{\mathbf{f}}$ |
| 신경망 backward의 정체? | **Jacobian 곱의 누적** | autograd |

이 사슬을 본 회차에서 완주한다. 2회차에서 Hessian·Newton·Taylor로 이어진다.

---

## 수업 흐름

| 순서 | 블록 | 내용 |
|:---:|:---:|---|
| ① | A | 오프닝: Review + 본 회차 사슬 |
| ② | **B** | Partial derivative·Gradient 정의 |
| ③ | **C** | Jacobian Matrix 정의·예제 |
| ④ | **C2** | Chain rule (Jacobian 곱) 정리·증명 흐름 |
| ⑤ | **D** | 신경망 한 층의 forward·backward |
| ⑥ | E | 코딩 실습 (autograd 검증) + 마무리 문제 |

> **B·C·C2가 본 회차의 심장이다.** D는 응용, E는 검증이다.

---

# B. Partial derivative와 Gradient

> 일변수 미분의 직관에서 출발하여 다변수로 확장한다.

## B-1. Partial derivative (편미분): 정의

### 정의 6.1 (Partial derivative)
함수 $f: \mathbb{R}^n \to \mathbb{R}$의 점 $\mathbf{x} = (x_1, \ldots, x_n)^\top$에서의 $i$번째 변수에 대한 **partial derivative** (편미분) 는
$$\frac{\partial f}{\partial x_i}(\mathbf{x}) \;=\; \lim_{h \to 0} \frac{f(x_1, \ldots, x_i + h, \ldots, x_n) - f(\mathbf{x})}{h}.$$
다른 모든 변수를 상수로 고정하고 $x_i$만 변화시켰을 때의 변화율이다.

### 예제
$f(x_1, x_2) = x_1^2 x_2 + 3 x_2$일 때
$$\frac{\partial f}{\partial x_1} = 2 x_1 x_2, \qquad \frac{\partial f}{\partial x_2} = x_1^2 + 3.$$

각 변수마다 다른 변수를 상수처럼 다루고 일변수 미분을 한다.

---

## B-2. Gradient (그래디언트): 정의

### 정의 6.2 (Gradient)
$f: \mathbb{R}^n \to \mathbb{R}$이 모든 partial derivative를 가질 때, 그것들을 모아 만든 $\mathbb{R}^n$ Vector를 **Gradient**라 부른다.
$$\nabla f(\mathbf{x}) \;=\; \begin{pmatrix} \partial f / \partial x_1 \\ \partial f / \partial x_2 \\ \vdots \\ \partial f / \partial x_n \end{pmatrix} \in \mathbb{R}^n.$$

### 예제
위 $f(x_1, x_2) = x_1^2 x_2 + 3 x_2$의 Gradient는
$$\nabla f(\mathbf{x}) = \begin{pmatrix} 2 x_1 x_2 \\ x_1^2 + 3 \end{pmatrix}.$$

---

## B-3. Gradient의 기하적 의미

<div class="analogy">

**직관 (등고선 위 산행 비유)**: 함수 $f(\mathbf{x})$를 산의 고도로 보면, **Gradient는 그 점에서 가장 가파른 오르막 방향**입니다. 등고선과 수직이며, 크기는 그 방향의 경사도입니다. 산을 가장 빨리 내려가려면 $-\nabla f$ 방향으로 가야 합니다 (4회차 Gradient descent의 출발점).

</div>

### 핵심 사실
- $\nabla f(\mathbf{x})$ 방향: **steepest ascent** (가장 가파른 오르막)
- $-\nabla f(\mathbf{x})$ 방향: **steepest descent** (가장 가파른 내리막)
- 등고선 (level set) 과 **직교** (perpendicular)
- $\Vert \nabla f \Vert$ = 그 방향의 변화율 (slope)

> 정식 진술과 증명은 C 섹션의 Chain rule 활용으로 자연스럽게 이어진다.

---

## B-4. 자주 쓰는 Gradient 공식 (Strang·MML 표준)

| 함수 | Gradient |
|---|---|
| $f(\mathbf{x}) = \mathbf{a}^\top \mathbf{x}$ | $\nabla f = \mathbf{a}$ |
| $f(\mathbf{x}) = \mathbf{x}^\top \mathbf{x} = \Vert \mathbf{x} \Vert^2$ | $\nabla f = 2\mathbf{x}$ |
| $f(\mathbf{x}) = \mathbf{x}^\top A \mathbf{x}$ ($A$ symmetric) | $\nabla f = 2 A \mathbf{x}$ |
| $f(\mathbf{x}) = \Vert A\mathbf{x} - \mathbf{b} \Vert^2$ | $\nabla f = 2 A^\top (A\mathbf{x} - \mathbf{b})$ |

**마지막 행은 Part 2 2회차 Least squares의 정규방정식과 직결된다.** $\nabla f = \mathbf{0}$에서 $A^\top A \mathbf{x} = A^\top \mathbf{b}$가 나온다.

### 예제 (확인)
$f(\mathbf{x}) = \mathbf{x}^\top A \mathbf{x}$, $A = \begin{pmatrix} 2 & 1 \\ 1 & 3 \end{pmatrix}$.
$\nabla f = 2 A \mathbf{x} = \begin{pmatrix} 4 x_1 + 2 x_2 \\ 2 x_1 + 6 x_2 \end{pmatrix}$. 손으로 partial 두 개를 직접 계산해도 같은 답이 나온다.

---

<!-- _class: exercise -->

# 잠깐 풀어보기: Gradient

### 문제 1 (손계산)
$f(x_1, x_2) = x_1^2 + 2 x_1 x_2 + 3 x_2^2$에 대해 $\nabla f(\mathbf{x})$를 구하시오. $\mathbf{x} = (1, 1)^\top$에서 값은?

### 문제 2 (Matrix 식)
$f(\mathbf{x}) = (\mathbf{x} - \mathbf{c})^\top (\mathbf{x} - \mathbf{c})$의 Gradient를 구하시오. ($\mathbf{c}$는 상수 Vector)

> **힌트**: $f(\mathbf{x}) = \mathbf{x}^\top \mathbf{x} - 2\mathbf{c}^\top \mathbf{x} + \mathbf{c}^\top \mathbf{c}$로 전개한 뒤 표를 사용한다.

---

<!-- _class: exercise -->

## 잠깐 풀어보기: 답

### 문제 1
$\partial f / \partial x_1 = 2 x_1 + 2 x_2$, $\partial f / \partial x_2 = 2 x_1 + 6 x_2$.
$\nabla f(\mathbf{x}) = (2 x_1 + 2 x_2, \; 2 x_1 + 6 x_2)^\top$. $\mathbf{x} = (1,1)^\top$에서 $(4, 8)^\top$.

또는 $A = \begin{pmatrix} 1 & 1 \\ 1 & 3 \end{pmatrix}$로 보면 $f = \mathbf{x}^\top A \mathbf{x}$, $\nabla f = 2 A \mathbf{x}$로 같은 답.

### 문제 2
$\nabla f = 2(\mathbf{x} - \mathbf{c})$.

> **메시지**: 점 $\mathbf{c}$까지의 제곱 거리의 Gradient는 $\mathbf{c}$로부터 멀어지는 방향 $\mathbf{x} - \mathbf{c}$ 의 두 배이다. 가장 가파른 내리막은 $\mathbf{c}$를 향한다 (회귀·클러스터링의 기본 기하).

---

# C. Jacobian Matrix: 다변수 미분의 표준 표현

> Gradient는 출력이 스칼라일 때의 객체이다. 출력이 Vector이면 Jacobian이 등장한다.

## C-1. Jacobian: 정의

### 정의 6.3 (Jacobian Matrix)
함수 $\mathbf{f}: \mathbb{R}^n \to \mathbb{R}^m$, $\mathbf{f}(\mathbf{x}) = (f_1(\mathbf{x}), \ldots, f_m(\mathbf{x}))^\top$ 의 **Jacobian**은
$$J_{\mathbf{f}}(\mathbf{x}) \;=\; \frac{\partial \mathbf{f}}{\partial \mathbf{x}} \;=\; \begin{pmatrix} \partial f_1 / \partial x_1 & \cdots & \partial f_1 / \partial x_n \\ \vdots & \ddots & \vdots \\ \partial f_m / \partial x_1 & \cdots & \partial f_m / \partial x_n \end{pmatrix} \in \mathbb{R}^{m \times n}.$$

$(i, j)$ 성분은 $\partial f_i / \partial x_j$이다. **$i$번째 행 = $f_i$의 Gradient의 전치**이다.

> 본 강의는 MML의 "분자 (numerator) layout"을 표준으로 한다, 출력이 행, 입력이 열. 이는 후에 Chain rule이 행렬 곱 그대로 결합되도록 만드는 규약이다.

---

## C-2. Jacobian 예제

### 예 1 (선형 함수)
$\mathbf{f}(\mathbf{x}) = A \mathbf{x}$, $A \in \mathbb{R}^{m \times n}$.
$$J_{\mathbf{f}}(\mathbf{x}) = A.$$

선형 함수의 Jacobian은 어디서 미분해도 $A$ 자체이다.

### 예 2 (2 → 2 비선형)
$\mathbf{f}(x_1, x_2) = (x_1^2 + x_2, \; x_1 x_2)^\top$.
$$J_{\mathbf{f}}(\mathbf{x}) = \begin{pmatrix} 2 x_1 & 1 \\ x_2 & x_1 \end{pmatrix}.$$

### 예 3 (Scalar 출력 → Gradient 전치)
$f: \mathbb{R}^n \to \mathbb{R}$, 즉 $m = 1$이면
$$J_f(\mathbf{x}) = (\nabla f(\mathbf{x}))^\top \in \mathbb{R}^{1 \times n}.$$

Gradient는 **column** Vector, Jacobian (스칼라 출력) 은 **row** Vector이다. **$(\nabla f)^\top = J_f$**가 본 강의 규약이다.

---

## C-3. Jacobian의 의미: 국소 선형 근사

### 핵심 사실 (1차 Taylor)
$\mathbf{f}: \mathbb{R}^n \to \mathbb{R}^m$이 $\mathbf{x}_0$에서 미분 가능하면
$$\mathbf{f}(\mathbf{x}_0 + \mathbf{h}) \approx \mathbf{f}(\mathbf{x}_0) + J_{\mathbf{f}}(\mathbf{x}_0) \mathbf{h}.$$

비선형 함수를 **점 $\mathbf{x}_0$ 근처에서 선형 함수 (Matrix·Vector 곱) 로 근사**한 것이다. Jacobian은 그 선형 근사의 Matrix이다.

<div class="analogy">

**직관 (지도 위의 한 점 확대 비유)**: 지구는 곡면이지만 한 마을을 확대해서 보면 **평면 지도**로 충분합니다. 한 마을 = 점 $\mathbf{x}_0$ 근처, 평면 지도 = $J_{\mathbf{f}}(\mathbf{x}_0)$. 비선형 함수도 한 점 근처에서는 행렬 한 개로 다 설명된다는 뜻입니다.

</div>

> 2차 항 (Hessian) 은 2회차에서 다룬다.

---

# C2. Chain rule: 합성함수의 Jacobian 곱

> 본 회차의 정점이다. 신경망 backward의 정체가 여기 있다.

## C2-1. Chain rule (다변수): 정리

### 정리 6.1 (Chain rule, MML §5.2.2)
$\mathbf{f}: \mathbb{R}^n \to \mathbb{R}^m$, $\mathbf{g}: \mathbb{R}^m \to \mathbb{R}^p$가 모두 미분 가능하면 합성함수 $\mathbf{g} \circ \mathbf{f}: \mathbb{R}^n \to \mathbb{R}^p$의 Jacobian은
$$J_{\mathbf{g} \circ \mathbf{f}}(\mathbf{x}) \;=\; J_{\mathbf{g}}(\mathbf{f}(\mathbf{x})) \cdot J_{\mathbf{f}}(\mathbf{x}).$$

오른쪽은 **Matrix 곱**이다. 형태 확인: $J_{\mathbf{g}} \in \mathbb{R}^{p \times m}$, $J_{\mathbf{f}} \in \mathbb{R}^{m \times n}$, 곱은 $\mathbb{R}^{p \times n}$이고 이는 합성함수 $\mathbb{R}^n \to \mathbb{R}^p$의 Jacobian 형태와 일치한다.

---

## C2-2. Chain rule 증명 흐름 (정의 6.3·국소 선형 근사 활용)

1차 Taylor로 $\mathbf{f}(\mathbf{x}_0 + \mathbf{h}) \approx \mathbf{f}(\mathbf{x}_0) + J_{\mathbf{f}}(\mathbf{x}_0) \mathbf{h}$, 1차 Taylor를 $\mathbf{g}$에 다시 적용하면
$$\mathbf{g}(\mathbf{f}(\mathbf{x}_0 + \mathbf{h})) \approx \mathbf{g}(\mathbf{f}(\mathbf{x}_0)) + J_{\mathbf{g}}(\mathbf{f}(\mathbf{x}_0)) \cdot J_{\mathbf{f}}(\mathbf{x}_0) \mathbf{h}.$$

좌변의 1차 선형 근사 Matrix가 $J_{\mathbf{g} \circ \mathbf{f}}(\mathbf{x}_0)$의 정의이므로 두 Matrix가 같다.

정식 증명은 차이가 $o(\Vert \mathbf{h} \Vert)$ 임을 확인하는 작업이며 MML §5.2.2 참조.

---

## C2-3. 예제 (손계산)

$\mathbf{f}(x_1, x_2) = (x_1 + x_2, \; x_1 x_2)^\top$, $\mathbf{g}(u_1, u_2) = (u_1^2, \; u_1 + u_2)^\top$.

$J_{\mathbf{f}}(\mathbf{x}) = \begin{pmatrix} 1 & 1 \\ x_2 & x_1 \end{pmatrix}$, $J_{\mathbf{g}}(\mathbf{u}) = \begin{pmatrix} 2 u_1 & 0 \\ 1 & 1 \end{pmatrix}$.

$\mathbf{u} = \mathbf{f}(\mathbf{x}) = (x_1 + x_2, x_1 x_2)^\top$를 대입하고 곱하면
$$J_{\mathbf{g} \circ \mathbf{f}}(\mathbf{x}) = \begin{pmatrix} 2(x_1+x_2) & 0 \\ 1 & 1 \end{pmatrix} \begin{pmatrix} 1 & 1 \\ x_2 & x_1 \end{pmatrix} = \begin{pmatrix} 2(x_1+x_2) & 2(x_1+x_2) \\ 1 + x_2 & 1 + x_1 \end{pmatrix}.$$

검증: $\mathbf{g}(\mathbf{f}(\mathbf{x})) = ((x_1 + x_2)^2, \; x_1 + x_2 + x_1 x_2)^\top$의 partial을 직접 계산해도 같은 결과가 나온다.

---

## C2-4. Chain rule의 의미: 행렬 곱의 결합법칙

3중 합성 $\mathbf{h} \circ \mathbf{g} \circ \mathbf{f}$도 같은 규칙으로
$$J_{\mathbf{h} \circ \mathbf{g} \circ \mathbf{f}} = J_{\mathbf{h}} \cdot J_{\mathbf{g}} \cdot J_{\mathbf{f}}.$$

**$L$층 합성** ($L$층 신경망의 forward) 의 Jacobian은
$$J_{\mathbf{f}_L \circ \cdots \circ \mathbf{f}_1} = J_{\mathbf{f}_L} \cdot J_{\mathbf{f}_{L-1}} \cdots J_{\mathbf{f}_1}.$$

이것이 backpropagation의 정체이다. **행렬 곱은 결합법칙을 만족**하므로 (Part 1 5회차) 곱 순서를 왼쪽부터 (forward) 또는 오른쪽부터 (reverse mode = backward) 자유롭게 할 수 있다.

> Reverse mode가 더 효율적인 이유는 D 섹션에서 다룬다.

---

<!-- _class: exercise -->

# 잠깐 풀어보기: Jacobian과 Chain rule

### 문제 1 (Jacobian 계산)
$\mathbf{f}(x_1, x_2) = (e^{x_1} \cos x_2, \; e^{x_1} \sin x_2)^\top$의 Jacobian을 구하시오. $\det J_{\mathbf{f}}$도 함께 구하시오.

### 문제 2 (Chain rule)
$f(\mathbf{x}) = \Vert A\mathbf{x} - \mathbf{b} \Vert^2$를 $\mathbf{r}(\mathbf{x}) = A\mathbf{x} - \mathbf{b}$ (Jacobian $A$) 와 $g(\mathbf{r}) = \mathbf{r}^\top \mathbf{r}$ (Gradient $2\mathbf{r}$, Jacobian $2\mathbf{r}^\top$) 의 합성으로 보고 Chain rule로 $\nabla f$를 유도하시오.

---

<!-- _class: exercise -->

## 잠깐 풀어보기: 답

### 문제 1
$$J_{\mathbf{f}}(\mathbf{x}) = \begin{pmatrix} e^{x_1} \cos x_2 & -e^{x_1} \sin x_2 \\ e^{x_1} \sin x_2 & e^{x_1} \cos x_2 \end{pmatrix}.$$
$\det J_{\mathbf{f}} = e^{2 x_1} (\cos^2 x_2 + \sin^2 x_2) = e^{2 x_1}$.

이는 극좌표 → 직교좌표 변환의 Jacobian으로, 적분 변수 변환의 표준 예제이다.

### 문제 2
$f = g \circ \mathbf{r}$. Chain rule:
$J_f = J_g(\mathbf{r}(\mathbf{x})) \cdot J_{\mathbf{r}}(\mathbf{x}) = 2 \mathbf{r}^\top \cdot A = 2 (A\mathbf{x} - \mathbf{b})^\top A.$

$\nabla f = J_f^\top = 2 A^\top (A\mathbf{x} - \mathbf{b})$. B-4 표의 마지막 행과 일치한다.

> **메시지**: 행렬 미분 공식은 모두 Chain rule + 단순 함수 두세 개로 유도된다.

---

# D. 응용·AI 연결: 신경망 forward·backward

> 본 회차의 도구가 신경망 학습의 어디에 등장하는가.

## D-1. 신경망 한 층의 forward

$L$층 fully-connected 신경망의 한 층:
$$\mathbf{z}_\ell = W_\ell \mathbf{a}_{\ell-1} + \mathbf{b}_\ell, \qquad \mathbf{a}_\ell = \sigma(\mathbf{z}_\ell)$$

- $W_\ell \in \mathbb{R}^{d_\ell \times d_{\ell-1}}$: 가중치 (weight) Matrix
- $\mathbf{b}_\ell \in \mathbb{R}^{d_\ell}$: bias (편향) Vector
- $\sigma$: 활성화 함수 (ReLU·sigmoid 등), 성분별 적용

전체 신경망은 $\mathbf{f}: \mathbf{x} \mapsto \mathbf{a}_L$의 합성이다.

---

## D-2. 한 층의 Jacobian

### 가중합 부분 $\mathbf{z}_\ell = W_\ell \mathbf{a}_{\ell-1} + \mathbf{b}_\ell$의 Jacobian
입력 $\mathbf{a}_{\ell-1}$에 대해 선형이므로
$$\frac{\partial \mathbf{z}_\ell}{\partial \mathbf{a}_{\ell-1}} = W_\ell.$$

### 활성화 부분 $\mathbf{a}_\ell = \sigma(\mathbf{z}_\ell)$의 Jacobian
성분별이므로 **대각 Matrix**:
$$\frac{\partial \mathbf{a}_\ell}{\partial \mathbf{z}_\ell} = \mathrm{diag}(\sigma'(z_{\ell,1}), \ldots, \sigma'(z_{\ell,d_\ell})).$$

### 한 층 전체
Chain rule:
$$\frac{\partial \mathbf{a}_\ell}{\partial \mathbf{a}_{\ell-1}} = \mathrm{diag}(\sigma'(\mathbf{z}_\ell)) \cdot W_\ell.$$

---

## D-3. 전체 신경망의 Jacobian (forward 관점)

$L$층 합성의 Jacobian:
$$\frac{\partial \mathbf{a}_L}{\partial \mathbf{x}} = \prod_{\ell=L}^{1} \left[ \mathrm{diag}(\sigma'(\mathbf{z}_\ell)) \cdot W_\ell \right].$$

순서는 $L$부터 $1$까지 (왼쪽 곱).

<div class="analogy">

**직관 (도미노 비유)**: 입력의 작은 변화 $\delta \mathbf{x}$가 1층 Jacobian을 통과하면 $\delta \mathbf{a}_1$이 되고, 그것이 2층 Jacobian을 통과하면 $\delta \mathbf{a}_2$가 되고, 끝까지 가면 $\delta \mathbf{a}_L$이 됩니다. **각 층이 Jacobian 한 개의 도미노**, 전체 backward는 그 도미노 모두를 곱한 것입니다.

</div>

---

## D-4. Backward (reverse mode) 의 효율성

손실 (loss) $\ell = L(\mathbf{a}_L, \mathbf{y})$는 스칼라 출력이다. Gradient $\nabla_{\mathbf{x}} \ell \in \mathbb{R}^n$를 구하려면

$$\nabla_{\mathbf{x}} \ell = \left( \frac{\partial \mathbf{a}_L}{\partial \mathbf{x}} \right)^\top \nabla_{\mathbf{a}_L} \ell.$$

전체 Jacobian을 만든 뒤 곱하면 메모리·계산이 너무 크다. **Reverse mode**는 다음 한 줄을 반복한다:
$$\nabla_{\mathbf{a}_{\ell-1}} \ell = W_\ell^\top \cdot \mathrm{diag}(\sigma'(\mathbf{z}_\ell)) \cdot \nabla_{\mathbf{a}_\ell} \ell.$$

**스칼라 → Vector 곱이 매 단계 1번**이므로 전체 Jacobian Matrix를 절대 만들지 않는다. 이것이 PyTorch·JAX autograd의 핵심이다.

> 본 회차에서 도구만 익히고, 실제 backward 구현은 본 강의 외부의 별도 학습 자료로 진행한다.

---

## D-5. Matrix gradient의 정체 (한 줄 정리)

$W \in \mathbb{R}^{m \times n}$에 대한 손실 $\ell$의 Gradient $\partial \ell / \partial W$는 **$m \times n$ Matrix**이다. 정의는 성분별:
$$\left( \frac{\partial \ell}{\partial W} \right)_{ij} = \frac{\partial \ell}{\partial W_{ij}}.$$

한 층의 경우 ($\mathbf{z} = W \mathbf{a} + \mathbf{b}$) Chain rule + outer product 한 줄:
$$\frac{\partial \ell}{\partial W} = (\nabla_{\mathbf{z}} \ell) \cdot \mathbf{a}^\top \in \mathbb{R}^{m \times n}.$$

> 유도는 $\partial z_i / \partial W_{ij} = a_j$로부터 직접 나온다. autograd 검증은 E 코딩 실습.

---

## E-1. 코딩 실습 (PyTorch autograd로 검증)

```python
import torch

# 손계산 대상: f(x) = ||A x - b||^2
A = torch.tensor([[1.0, 2.0], [3.0, 1.0], [2.0, 0.0]], requires_grad=False)
b = torch.tensor([1.0, 0.0, -1.0])
x = torch.tensor([0.5, -0.3], requires_grad=True)

f = ((A @ x - b) ** 2).sum()
f.backward()

# autograd가 계산한 gradient
print("autograd:", x.grad)

# 손공식: grad = 2 A^T (A x - b)
manual = 2 * A.T @ (A @ x - b)
print("manual :", manual.detach())
```

두 값이 부동소수점 오차 안에서 같음을 확인한다 (Gradient 공식 검증).

---

## E-2. 코딩 실습: 한 층 신경망 Jacobian

```python
import torch

W = torch.tensor([[1.0, 2.0], [3.0, -1.0]], requires_grad=False)
b = torch.tensor([0.5, -0.2], requires_grad=False)
x = torch.tensor([1.0, -1.0], requires_grad=True)

z = W @ x + b
a = torch.tanh(z)

# autograd로 da/dx 직접 구하기 (Jacobian)
J = torch.autograd.functional.jacobian(lambda x: torch.tanh(W @ x + b), x)
print("autograd Jacobian:\n", J)

# 손공식: J = diag(tanh'(z)) W = diag(1 - tanh^2(z)) W
manual_J = torch.diag(1 - torch.tanh(z) ** 2) @ W
print("manual Jacobian:\n", manual_J.detach())
```

`torch.autograd.functional.jacobian`은 vector valued 함수의 전체 Jacobian을 만든다 (작은 차원에서만 사용).

---

## E-3. 본 회차 핵심 5개

1. **Partial derivative**·**Gradient**: 한 변수의 미분을 다변수로 묶은 객체이다. Gradient는 steepest ascent 방향이다.
2. **Jacobian Matrix** $J_{\mathbf{f}} \in \mathbb{R}^{m \times n}$: vector valued 함수의 표준 미분 표현이다. $(i,j)$ 성분은 $\partial f_i / \partial x_j$이다.
3. **Chain rule (다변수)**: 합성함수의 Jacobian은 **각 Jacobian의 행렬 곱**이다 ($J_{\mathbf{g} \circ \mathbf{f}} = J_{\mathbf{g}} \cdot J_{\mathbf{f}}$).
4. **신경망 한 층**의 Jacobian은 $\mathrm{diag}(\sigma'(\mathbf{z})) \cdot W$이다. 전체 backward는 이 도미노 곱의 reverse-mode 누적이다.
5. **Matrix gradient**는 성분별 정의로 $m \times n$ Matrix이며, 한 층 weight에 대해서는 outer product $\nabla_{\mathbf{z}} \ell \cdot \mathbf{a}^\top$로 정리된다.

---

## E-4. 자기 점검 질문

- $f(\mathbf{x}) = \mathbf{x}^\top A \mathbf{x}$ ($A$ symmetric) 의 Gradient를 손으로 유도하시오.
- 선형 함수 $\mathbf{f}(\mathbf{x}) = A\mathbf{x} + \mathbf{b}$의 Jacobian은? 점 $\mathbf{x}$에 의존하는가?
- Chain rule의 행렬 곱 순서가 왜 자연스러운가 (오른쪽 인수의 출력이 왼쪽 인수의 입력)?
- Reverse mode가 forward mode보다 효율적인 경우는 입력·출력 차원이 어떤 관계일 때인가?
- 신경망 한 층 weight $W$에 대한 손실 gradient의 형태 ($\nabla_{\mathbf{z}} \ell \cdot \mathbf{a}^\top$) 가 outer product인 이유는?

---

<!-- _class: exercise -->

# 본 회차 마무리 문제

본 회차 사슬 (Partial → Gradient → Jacobian → Chain rule → 신경망 한 층) 을 한 문제로 종합한다.

2층 신경망의 일부를 다음과 같이 정의한다.
- 입력 $\mathbf{x} \in \mathbb{R}^2$
- 1층: $\mathbf{z}_1 = W_1 \mathbf{x}$, $W_1 = \begin{pmatrix} 1 & 0 \\ 0 & 1 \\ 1 & 1 \end{pmatrix}$ (bias 0, $\mathbb{R}^3$ 출력)
- 활성화: $\mathbf{a}_1 = \tanh(\mathbf{z}_1)$ (성분별)
- 2층: $z_2 = \mathbf{w}_2^\top \mathbf{a}_1$, $\mathbf{w}_2 = (1, 1, -1)^\top$ ($\mathbb{R}$ 출력)
- 손실: $\ell = z_2^2$

- **(a)** $J_{W_1}(\mathbf{x}) = \partial \mathbf{z}_1 / \partial \mathbf{x}$의 형태와 값.
- **(b)** $\partial \mathbf{a}_1 / \partial \mathbf{z}_1$의 형태와 값 ($\mathbf{z}_1$이 주어졌다고 가정, 일반식).
- **(c)** Chain rule을 사용해 $\partial \ell / \partial \mathbf{x}$를 일반식으로 적으시오 (Jacobian 곱의 결합).
- **(d)** $\mathbf{x} = (0, 0)^\top$일 때 (d) 의 수치값. ($\tanh 0 = 0$, $\tanh' 0 = 1$)

---

<!-- _class: exercise -->

## 본 회차 마무리 문제: 답

- **(a)** $J_{W_1}(\mathbf{x}) = W_1 \in \mathbb{R}^{3 \times 2}$ (선형이므로 어디서 미분해도 $W_1$).

- **(b)** $\partial \mathbf{a}_1 / \partial \mathbf{z}_1 = \mathrm{diag}(\tanh'(z_{1,1}), \tanh'(z_{1,2}), \tanh'(z_{1,3})) = \mathrm{diag}(1 - \tanh^2 z_{1,i}) \in \mathbb{R}^{3 \times 3}$.

- **(c)** Chain rule을 차례로 적용하면
$$\frac{\partial \ell}{\partial \mathbf{x}} = \frac{\partial \ell}{\partial z_2} \cdot \frac{\partial z_2}{\partial \mathbf{a}_1} \cdot \frac{\partial \mathbf{a}_1}{\partial \mathbf{z}_1} \cdot \frac{\partial \mathbf{z}_1}{\partial \mathbf{x}} = 2 z_2 \cdot \mathbf{w}_2^\top \cdot \mathrm{diag}(1 - \tanh^2 \mathbf{z}_1) \cdot W_1.$$

형태 확인: $\mathbb{R} \times \mathbb{R}^{1 \times 3} \times \mathbb{R}^{3 \times 3} \times \mathbb{R}^{3 \times 2} = \mathbb{R}^{1 \times 2}$, 전치하면 Gradient 형태 $\mathbb{R}^2$.

- **(d)** $\mathbf{x} = \mathbf{0}$이면 $\mathbf{z}_1 = \mathbf{0}$, $\mathbf{a}_1 = \mathbf{0}$, $z_2 = 0$, 따라서 전체 식이 $0$이다. $\partial \ell / \partial \mathbf{x} = \mathbf{0}$.

> **핵심**: 비선형 합성함수의 미분은 항상 행렬 곱 사슬로 분해된다. **신경망 backward의 본질이 본 회차 한 줄에 있다.**

---

<!-- _class: exercise -->

## 다음 회차 Review용 숙제

본 회차 객체로 풀 수 있는 유사 문제이다.

- **(1)** $f(\mathbf{x}) = \log(1 + \exp(\mathbf{w}^\top \mathbf{x}))$ (이진 분류 손실의 한 형태, $\mathbf{w} \in \mathbb{R}^n$ 상수) 의 Gradient $\nabla f(\mathbf{x})$를 Chain rule로 유도하시오.
- **(2)** $\mathbf{f}(\mathbf{x}) = \mathrm{softmax}(\mathbf{x})$ ($\mathbb{R}^n \to \mathbb{R}^n$, $f_i(\mathbf{x}) = e^{x_i} / \sum_j e^{x_j}$) 의 Jacobian 성분 $\partial f_i / \partial x_j$를 구하시오. (힌트: 두 경우, $i = j$와 $i \neq j$로 나뉜다.)
- **(3)** 본 회차 마무리 문제에서 $\mathbf{x} = (1, -1)^\top$일 때 $\partial \ell / \partial \mathbf{x}$의 수치값을 NumPy 또는 PyTorch autograd로 검증하시오.

2회차 (Hessian·Taylor·Newton) 첫 Review에서 다룬다.

---

## E-5. 다음 회차 (Part 3 2회차) 예고

**주제**: Hessian Matrix · 다변수 Taylor 전개 · Newton 방법 · 옵티마이저 비교 (SGD·Newton·Adam) 의 곡률 관점

**연결**: 본 회차에서 다룬 1차 미분 (Gradient·Jacobian) 만으로는 함수의 **곡률** (얼마나 휘어 있는지) 을 모른다. 2회차에서 **2차 미분 (Hessian)** 과 **다변수 Taylor 2차 전개**를 도입하여 곡률을 다룬다. Newton 방법은 그 곡률 정보를 이용한 최적화이다.

**사전 reading**:
- MML §5.5-5.8 (Higher-Order Derivatives·Taylor Series·Optimization)

---

# 부록: 자율 학습·심화 안내

본 회차에서 도구만 익혔다. 더 깊이 들어가고 싶은 학생을 위한 안내:

| 주제 | 위치 |
|---|---|
| 행렬 미분 공식표 (vec·Kronecker 사용) | Matrix Cookbook 또는 MML §5.4 |
| Hessian과 Taylor 2차 전개 | 2회차 |
| Backpropagation 알고리즘 정식 | 자율 학습 자료 (외부 강의) |
| Implicit function theorem 응용 | 자율 학습 자료 |

---

<!-- _class: lead -->

# Q & A

본 회차 사슬:
**Partial derivative → Gradient → Jacobian → Chain rule → 신경망 한 층의 Jacobian**

핵심 한 줄: **신경망의 backward는 각 층 Jacobian의 행렬 곱이다.** Chain rule이 본 회차의 정점이다.

다음 회차의 출발 문제:
> 1차 미분으로 잡지 못한 함수의 **곡률**을 어떤 객체로 잡을 것인가?

`HANDOUT`: 본 PDF + 2회차 사전 reading (MML §5.5-5.8)
