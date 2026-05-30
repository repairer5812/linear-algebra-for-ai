---
marp: true
theme: default
paginate: true
header: '인공지능 전공자를 위한 선형대수학'
footer: 'Part 3 2회차 — Vector Calculus 2: Hessian · Taylor · Newton · Optimizer'
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

# Part 3 2회차

## Vector Calculus 2: Hessian·Taylor·Newton·Optimizer

MML §5.5-5.8 (메인) · Part 3 (VC + Probability)
**1차 미분에서 2차 미분으로**: 1회차의 Gradient·Jacobian이 함수의 기울기만 잡았다면, 본 회차의 Hessian은 **곡률** (얼마나 휘었는가) 을 잡는다. 그 결과 Newton 방법이 등장하고, SGD·Adam과의 비교가 의미를 갖는다.

> 곡률 정보가 들어가는 순간 "한 걸음" 의 크기와 방향이 함수의 모양에 맞춰 자동 조정된다.

---

<!-- _class: exercise -->

# Review: 지난 회차 (Part 3 1회차) 마무리 문제

지난 회차 마무리 + 숙제에서 다룬 내용:

> **(a)** $f(\mathbf{x}) = \log(1 + \exp(\mathbf{w}^\top \mathbf{x}))$의 Gradient를 Chain rule로 유도.
> **(b)** $\mathbf{f}(\mathbf{x}) = \mathrm{softmax}(\mathbf{x})$의 Jacobian 성분 $\partial f_i / \partial x_j$.
> **(c)** 2층 신경망 $\ell = z_2^2$의 $\partial \ell / \partial \mathbf{x}$를 Jacobian 곱 사슬로 표기.

---

<!-- _class: exercise -->

# Review: 답

- **(a)** $\sigma(t) = 1/(1+e^{-t})$ (sigmoid) 로 두면 $\log(1+e^t)$의 미분은 $\sigma(t)$이다. Chain rule: $\nabla f(\mathbf{x}) = \sigma(\mathbf{w}^\top \mathbf{x}) \cdot \mathbf{w}$.

- **(b)** $f_i = e^{x_i} / S$, $S = \sum_j e^{x_j}$.
  - $i = j$: $\partial f_i / \partial x_i = f_i (1 - f_i)$.
  - $i \neq j$: $\partial f_i / \partial x_j = -f_i f_j$.
  - 한 줄로: $J_{\mathrm{softmax}} = \mathrm{diag}(\mathbf{f}) - \mathbf{f} \mathbf{f}^\top$ (대각에서 outer product 빼기).

- **(c)** $\partial \ell / \partial \mathbf{x} = 2 z_2 \cdot \mathbf{w}_2^\top \cdot \mathrm{diag}(1 - \tanh^2 \mathbf{z}_1) \cdot W_1$. 모든 합성은 Jacobian 곱의 사슬로 해체된다.

---

## 본 회차 핵심 질문

> ### 함수의 "휘어진 정도" (곡률) 를 어떻게 객체로 잡고, 그것을 최적화에 어떻게 활용하는가?

이 질문에 답하려면 네 단계가 필요하다.

1. **Hessian Matrix**: 모든 2차 partial을 모은 객체
2. **다변수 Taylor 2차 전개**: $f(\mathbf{x} + \mathbf{h}) \approx f + \nabla f^\top \mathbf{h} + \tfrac{1}{2} \mathbf{h}^\top H \mathbf{h}$
3. **Newton 방법**: 2차 모델의 최소점으로 직접 도약
4. **옵티마이저 비교**: SGD·Newton·Adam이 곡률 정보를 어떻게 다루는가

---

## 학습 목표

본 회차가 끝나면 학생은 다음을 답할 수 있어야 한다.

1. **Hessian Matrix**의 정의와 symmetric인 이유 (Clairaut 정리) 를 설명할 수 있다.
2. **다변수 Taylor 2차 전개**를 적고, 그 항 각각의 기하적 의미를 설명할 수 있다.
3. 임계점에서 Hessian이 **양정치 (positive definite)** 이면 local minimum, 음정치이면 local maximum, indefinite이면 안장점임을 판단할 수 있다.
4. **Newton 방법**의 한 스텝 식 $\mathbf{x}_{k+1} = \mathbf{x}_k - H^{-1} \nabla f$을 유도하고, GD와의 차이를 설명할 수 있다.
5. **SGD·Newton·Adam**이 곡률 정보를 어떻게 (또는 어떻게 근사로) 사용하는지 비교할 수 있다.

---

## 본 회차 개념 사슬

| 질문 | 답 | 도구 |
|---|---|---|
| 함수의 곡률을 객체로? | **Hessian** $H = \nabla^2 f$ | $\mathbb{R}^{n \times n}$ symmetric Matrix |
| 한 점 근처의 2차 모델은? | **Taylor 2차 전개** | $f + \mathbf{g}^\top \mathbf{h} + \tfrac{1}{2} \mathbf{h}^\top H \mathbf{h}$ |
| 임계점이 min·max·saddle? | **Hessian의 정부호성** | 고유값 부호 (Part 2 7회차) |
| 2차 모델의 최소점으로 도약? | **Newton step** | $\mathbf{x} \leftarrow \mathbf{x} - H^{-1} \nabla f$ |
| 실전 옵티마이저는? | **SGD·Adam은 곡률 근사** | 분산·적응 학습률 |

---

## 수업 흐름

| 순서 | 블록 | 내용 |
|:---:|:---:|---|
| ① | A | Review + 본 회차 사슬 |
| ② | **B** | Hessian Matrix 정의·symmetric 증명 흐름 |
| ③ | **C** | 다변수 Taylor 2차 전개·임계점 판정 |
| ④ | **C2** | Newton 방법 유도·GD와 비교 |
| ⑤ | **D** | 옵티마이저 비교 (SGD·Newton·Adam) |
| ⑥ | E | 코딩 실습 + 마무리 문제 |

> **B·C·C2가 본 회차의 심장이다.** D는 응용 비교, E는 검증이다.

---

# B. Hessian Matrix

> 1차 미분의 Gradient를 다시 미분하면 무엇이 나오는가.

## B-1. Hessian: 정의

### 정의 7.1 (Hessian Matrix)
$f: \mathbb{R}^n \to \mathbb{R}$이 2차 partial을 모두 가질 때, **Hessian**은
$$H(\mathbf{x}) \;=\; \nabla^2 f(\mathbf{x}) \;=\; \begin{pmatrix} \partial^2 f / \partial x_1^2 & \cdots & \partial^2 f / \partial x_1 \partial x_n \\ \vdots & \ddots & \vdots \\ \partial^2 f / \partial x_n \partial x_1 & \cdots & \partial^2 f / \partial x_n^2 \end{pmatrix} \in \mathbb{R}^{n \times n}.$$

$(i, j)$ 성분은 $\partial^2 f / \partial x_i \partial x_j$이다. **Gradient $\nabla f$ 의 Jacobian**으로 정의해도 같다 ($H = J_{\nabla f}$).

---

## B-2. Hessian은 Symmetric (Clairaut 정리)

### 정리 7.1 (Clairaut, MML §5.5)
$f$의 2차 partial이 모두 **연속**이면
$$\frac{\partial^2 f}{\partial x_i \partial x_j} = \frac{\partial^2 f}{\partial x_j \partial x_i}, \qquad \therefore H = H^\top.$$

**증명 흐름**: 직사각형 영역 위 평균값 정리로 두 표현이 같은 평균값을 갖도록 환원한 뒤 연속성으로 극한 일치. 정식 증명은 해석학 교재 참조.

본 강의 도메인의 모든 손실 함수 (LLM의 cross entropy, 회귀의 MSE 등) 는 모든 2차 partial이 연속이므로 Hessian은 항상 symmetric이다.

> Symmetric matrix의 spectral theorem (Part 2 6회차) 이 Hessian 분석에 그대로 적용된다.

---

## B-3. Hessian 예제

### 예 1 (이차형식)
$f(\mathbf{x}) = \tfrac{1}{2} \mathbf{x}^\top A \mathbf{x} - \mathbf{b}^\top \mathbf{x} + c$, $A$ symmetric.
$$\nabla f = A\mathbf{x} - \mathbf{b}, \qquad H = A.$$

이차형식의 Hessian은 점에 의존하지 않고 **항상 $A$** 이다 (Newton 한 스텝이면 정답).

### 예 2 (Logistic)
$f(\mathbf{x}) = \log(1 + \exp(\mathbf{w}^\top \mathbf{x}))$.
$\nabla f = \sigma(\mathbf{w}^\top \mathbf{x}) \cdot \mathbf{w}$ (Review).
한 번 더 미분: $H = \sigma(\mathbf{w}^\top \mathbf{x}) (1 - \sigma(\mathbf{w}^\top \mathbf{x})) \cdot \mathbf{w} \mathbf{w}^\top$.

**$\mathbf{w} \mathbf{w}^\top$은 rank 1 positive semidefinite**이다. 로지스틱 회귀의 Hessian이 항상 PSD라는 사실 (convexity) 의 출발점.

---

## B-4. Hessian의 두 가지 동등 정의 (참고)

**정의 (성분별)**: 위 7.1.
**정의 (Gradient의 Jacobian)**: $H = J_{\nabla f}$.
**정의 (이차형식의 미분으로)**: $H(\mathbf{x}) = $ "방향 $\mathbf{h}$로 두 번 미분한 양 $\mathbf{h}^\top H \mathbf{h}$의 모태 Matrix".

세 정의가 동일하다는 것은 Chain rule로 즉시 확인된다.

> Hessian의 의미는 "Gradient가 얼마나 빠르게 변하는가" 이다. Gradient가 일정 (선형 함수) 이면 $H = 0$, Gradient가 급격히 변하면 $\Vert H \Vert$가 크다.

---

<!-- _class: exercise -->

# 잠깐 풀어보기: Hessian

### 문제 1 (손계산)
$f(x_1, x_2) = x_1^3 + 2 x_1 x_2^2 + 3 x_2$의 Gradient와 Hessian을 구하시오.

### 문제 2 (Symmetric 확인)
$f(\mathbf{x}) = \mathbf{x}^\top A \mathbf{x}$, $A$ 가 **symmetric이 아닌** 경우 $H$는 무엇이 되는가? (힌트: $\mathbf{x}^\top A \mathbf{x} = \mathbf{x}^\top \tfrac{1}{2}(A + A^\top) \mathbf{x}$로 정리한 뒤 Hessian이 항상 symmetric임을 확인.)

---

<!-- _class: exercise -->

## 잠깐 풀어보기: 답

### 문제 1
$\nabla f = (3 x_1^2 + 2 x_2^2, \; 4 x_1 x_2 + 3)^\top$.

2차 partial: $\partial^2 f / \partial x_1^2 = 6 x_1$, $\partial^2 f / \partial x_2^2 = 4 x_1$, $\partial^2 f / \partial x_1 \partial x_2 = 4 x_2$.
$$H = \begin{pmatrix} 6 x_1 & 4 x_2 \\ 4 x_2 & 4 x_1 \end{pmatrix}.$$

symmetric.

### 문제 2
$\mathbf{x}^\top A \mathbf{x} = \mathbf{x}^\top \tfrac{1}{2}(A + A^\top) \mathbf{x}$이므로 Hessian은 $A + A^\top$이다 (대칭부 두 배). symmetric Matrix $\tfrac{1}{2}(A + A^\top)$의 두 배라 항상 symmetric.

> **메시지**: 이차형식의 Hessian은 항상 symmetric이며, 비대칭 부분 $\tfrac{1}{2}(A - A^\top)$은 $f$의 값에 기여하지 않는다.

---

# C. 다변수 Taylor 2차 전개와 임계점 판정

> Hessian이 어디서 쓰이는가의 첫 번째 답.

## C-1. 다변수 Taylor 2차 전개

### 정리 7.2 (Taylor 2차, MML §5.8)
$f: \mathbb{R}^n \to \mathbb{R}$이 충분히 부드러우면 점 $\mathbf{x}_0$ 근처에서
$$f(\mathbf{x}_0 + \mathbf{h}) \;=\; f(\mathbf{x}_0) \;+\; \nabla f(\mathbf{x}_0)^\top \mathbf{h} \;+\; \tfrac{1}{2} \mathbf{h}^\top H(\mathbf{x}_0) \mathbf{h} \;+\; o(\Vert \mathbf{h} \Vert^2).$$

세 항의 의미:
1. **0차**: 점의 값 (상수)
2. **1차 (Gradient 항)**: 선형 근사, 기울어진 평면
3. **2차 (Hessian 항)**: 곡률 보정, 사발 또는 안장 모양

오차 $o(\Vert \mathbf{h} \Vert^2)$은 $\mathbf{h} \to 0$일 때 $\Vert \mathbf{h} \Vert^2$보다 빨리 0이 된다.

---

## C-2. Taylor 2차의 기하

<div class="analogy">

**직관 (지구 한 마을의 입체 지도 비유)**: 1회차 Jacobian이 "한 마을의 평면 지도"였다면, **Hessian은 그 마을의 등고선·언덕·골짜기까지 표시한 입체 지도**입니다. 한 점 $\mathbf{x}_0$ 근처에서는 입체 지도가 함수 자체와 거의 같다는 것이 Taylor 2차의 약속입니다.

</div>

### 1차원 비교
$f(x_0 + h) \approx f(x_0) + f'(x_0) h + \tfrac{1}{2} f''(x_0) h^2$.

다변수는 $f''$가 Hessian Matrix $H$로 바뀐 것뿐이다. 곡률 한 개 (1D) 가 모든 방향의 곡률 ($H$의 고유값들) 로 일반화된다.

---

## C-3. 임계점과 Hessian 판정

### 정의 7.2 (임계점)
$\nabla f(\mathbf{x}^*) = \mathbf{0}$인 점 $\mathbf{x}^*$를 **임계점 (critical point)** 이라 부른다.

### 정리 7.3 (Hessian 판정, MML §5.5)
임계점 $\mathbf{x}^*$에서:
- $H(\mathbf{x}^*)$가 **positive definite** (모든 고유값 > 0) → **strict local minimum**
- $H(\mathbf{x}^*)$가 **negative definite** (모든 고유값 < 0) → **strict local maximum**
- $H(\mathbf{x}^*)$의 고유값이 **부호가 섞임** → **saddle point** (안장점)
- 일부 고유값이 0 → 판정 불능 (더 높은 차수 필요)

**증명 흐름**: 임계점에서 1차 항이 0이므로 Taylor 2차는 $f(\mathbf{x}^* + \mathbf{h}) - f(\mathbf{x}^*) \approx \tfrac{1}{2} \mathbf{h}^\top H \mathbf{h}$. 이차형식의 부호가 곧 함수값 변화의 부호이며, 그 부호는 Part 2 7회차 (Positive definite) 의 정리로 고유값에 의해 결정된다.

---

## C-4. 임계점 판정 예제

### 예 1 (Local minimum)
$f(\mathbf{x}) = x_1^2 + x_2^2$. $\nabla f = (2 x_1, 2 x_2)^\top$, 임계점 $\mathbf{0}$.
$H = \begin{pmatrix} 2 & 0 \\ 0 & 2 \end{pmatrix}$, 고유값 $2, 2$ 양수. → $\mathbf{0}$은 local (·global) minimum.

### 예 2 (Saddle point)
$f(\mathbf{x}) = x_1^2 - x_2^2$. $\nabla f = (2 x_1, -2 x_2)^\top$, 임계점 $\mathbf{0}$.
$H = \begin{pmatrix} 2 & 0 \\ 0 & -2 \end{pmatrix}$, 고유값 $2, -2$ 부호가 섞임. → $\mathbf{0}$은 **saddle point**.

### 예 3 (Local maximum)
$f(\mathbf{x}) = -x_1^2 - 2 x_2^2$. $\nabla f = (-2 x_1, -4 x_2)^\top$, 임계점 $\mathbf{0}$.
$H = \begin{pmatrix} -2 & 0 \\ 0 & -4 \end{pmatrix}$, 고유값 $-2, -4$ 모두 음수. → local (·global) maximum.

> 고차원 손실 함수에서는 saddle point가 압도적으로 많다 (random matrix 이론). Deep learning 최적화의 진짜 난적은 local min이 아니라 saddle임이 정설.

---

# C2. Newton 방법: 2차 모델의 최소점으로 도약

## C2-1. Newton step 유도

점 $\mathbf{x}_k$ 근처 Taylor 2차 모델:
$$m(\mathbf{h}) = f(\mathbf{x}_k) + \nabla f(\mathbf{x}_k)^\top \mathbf{h} + \tfrac{1}{2} \mathbf{h}^\top H(\mathbf{x}_k) \mathbf{h}.$$

$m(\mathbf{h})$의 최소점은 $\nabla_{\mathbf{h}} m(\mathbf{h}) = \nabla f(\mathbf{x}_k) + H(\mathbf{x}_k) \mathbf{h} = \mathbf{0}$.
$$\mathbf{h}^* = -H(\mathbf{x}_k)^{-1} \nabla f(\mathbf{x}_k).$$

### Newton 한 스텝
$$\boxed{\;\mathbf{x}_{k+1} = \mathbf{x}_k - H(\mathbf{x}_k)^{-1} \nabla f(\mathbf{x}_k).\;}$$

조건: $H$가 양정치이어야 (또는 정칙이면서 모델 신뢰 영역 안에서) 의미 있는 update.

---

## C2-2. Newton vs Gradient Descent

| 항목 | Gradient Descent | Newton |
|---|---|---|
| 한 스텝 식 | $\mathbf{x} - \eta \nabla f$ | $\mathbf{x} - H^{-1} \nabla f$ |
| 학습률 | 수동 ($\eta$) | 자동 (Hessian 역) |
| 한 스텝 비용 | $O(n)$ | $O(n^3)$ ($H^{-1}$ 또는 풀이) |
| 메모리 | $O(n)$ | $O(n^2)$ ($H$ 저장) |
| 수렴 속도 (근방) | 선형 | **이차** (quadratic) |
| 이차형식 ($f = \tfrac{1}{2} \mathbf{x}^\top A \mathbf{x} - \mathbf{b}^\top \mathbf{x}$) | 여러 스텝 | **한 스텝** |

> **이차형식**의 정답은 정규방정식 $A\mathbf{x} = \mathbf{b}$이며 Newton 한 스텝이 곧 그 풀이이다. Hessian이 $A$ 자체라서 $H^{-1} \nabla f = A^{-1}(A \mathbf{x}_k - \mathbf{b}) = \mathbf{x}_k - A^{-1} \mathbf{b}$로 정확한 최소점에 도착.

---

## C2-3. Newton의 약점·실용 한계

1. **$n$이 크면 $H^{-1}$ 계산이 불가능**. $n = 10^9$ (LLM 파라미터) 이면 $H \in \mathbb{R}^{10^9 \times 10^9}$. 메모리·계산 모두 X.
2. **$H$가 양정치가 아니면** Newton 방향이 내리막이 아닐 수 있다 (saddle 근처).
3. **Stochastic 환경**에서는 $H$의 noise도 크다.

### 실용적 대안 (실제 학습에 쓰이는 것)
- **Quasi-Newton**: BFGS·L-BFGS, $H^{-1}$을 누적 근사 ($n$이 중간일 때).
- **Natural gradient**: Fisher information 사용 (확률 모델 최적화, 3회차 연결).
- **Adam·RMSprop**: gradient의 2차 모멘트로 곡률을 **대각 근사**.

> Newton은 이론적 깊이의 표준이고, Adam·SGD가 실용의 표준이다. 그 사이에 L-BFGS·natural gradient가 있다.

---

# D. 옵티마이저 비교 (곡률 관점)

## D-1. 세 옵티마이저의 update 식

| Optimizer | Update |
|---|---|
| **GD/SGD** | $\mathbf{x} \leftarrow \mathbf{x} - \eta \nabla f$ |
| **Newton** | $\mathbf{x} \leftarrow \mathbf{x} - H^{-1} \nabla f$ |
| **Adam** | $\mathbf{x} \leftarrow \mathbf{x} - \eta \cdot \dfrac{\hat{m}}{\sqrt{\hat{v}} + \varepsilon}$ |

Adam에서 $\hat{m}$은 gradient의 (편향 보정) 평균, $\hat{v}$는 (편향 보정) 제곱 평균이다. 분모 $\sqrt{\hat{v}}$가 **각 좌표별 곡률의 거친 근사** 역할을 한다.

---

## D-2. 곡률 정보의 활용 정도

| Optimizer | 사용한 Hessian 정보 |
|---|---|
| **GD/SGD** | 사용 X (모든 방향 같은 학습률) |
| **Adam·RMSprop** | $\sqrt{\hat{v}}$로 **대각 근사** (좌표별 다른 학습률) |
| **L-BFGS** | 최근 gradient 차이로 $H^{-1}$ low-rank 근사 |
| **Newton** | $H$ 전체 사용 (역행렬) |
| **Natural gradient** | Fisher information $I$ (확률 모델의 $H$) 사용 |

<div class="analogy">

**직관 (산행 보폭 비유)**: GD는 어느 방향이든 **같은 보폭**으로 걷습니다. Adam은 **자주 가본 방향은 짧은 보폭, 처음 가는 방향은 큰 보폭** (좌표별 조정). Newton은 **각 방향의 경사도와 휘어짐을 다 알아본 뒤 최적 보폭**으로 한 발에 도착합니다. 정보가 많을수록 한 스텝이 비싸지만 적게 걸어도 됩니다.

</div>

---

## D-3. 왜 LLM 학습엔 Adam이 표준인가

1. **$H$ 전체는 불가능**: 10억 파라미터 → $H$는 $10^{18}$ 성분.
2. **대각 근사로도 충분**: 좌표별 학습률만으로도 SGD 대비 큰 개선.
3. **메모리·계산이 SGD와 같은 차수** ($O(n)$).
4. **noise robust**: 미니배치 환경에서 안정적.

> 본 강의는 옵티마이저의 곡률 관점만 다루며, 정식 수렴 증명·하이퍼파라미터 튜닝은 별도 학습 자료로 진행한다.

---

<!-- _class: exercise -->

# 잠깐 풀어보기: Newton vs GD

### 문제 1 (Newton 한 스텝)
$f(\mathbf{x}) = \tfrac{1}{2} \mathbf{x}^\top A \mathbf{x} - \mathbf{b}^\top \mathbf{x}$, $A = \begin{pmatrix} 4 & 0 \\ 0 & 1 \end{pmatrix}$, $\mathbf{b} = (8, 2)^\top$, $\mathbf{x}_0 = (0, 0)^\top$.

- Newton 한 스텝 후 $\mathbf{x}_1$을 구하시오.

### 문제 2 (GD 여러 스텝)
같은 문제에 GD ($\eta = 0.1$) 를 적용하면 한 스텝 후 $\mathbf{x}_1$은? 5스텝 후의 근사값은?

> **힌트**: 두 좌표가 분리되므로 각각 1차원 문제 두 개로 푼다.

---

<!-- _class: exercise -->

## 잠깐 풀어보기: 답

### 문제 1 (Newton)
$\nabla f(\mathbf{0}) = A \mathbf{0} - \mathbf{b} = -\mathbf{b} = (-8, -2)^\top$. $H = A$.
$\mathbf{x}_1 = \mathbf{0} - A^{-1}(-\mathbf{b}) = A^{-1}\mathbf{b} = (8/4, 2/1)^\top = (2, 2)^\top$.

**한 스텝 만에 최소점에 도달**. 정답: $f$의 최소점은 $A^{-1}\mathbf{b} = (2, 2)^\top$.

### 문제 2 (GD)
$\mathbf{x}_1 = -\eta \nabla f(\mathbf{0}) = 0.1 \cdot (8, 2)^\top = (0.8, 0.2)^\top$.

5스텝 후 좌표별로 $x_{1, k+1} = x_{1, k} - 0.1 (4 x_{1, k} - 8) = 0.6 x_{1, k} + 0.8$, 같은 식으로 $x_{2, k+1} = 0.9 x_{2, k} + 0.2$.

$x_1$ 좌표: $0 \to 0.8 \to 1.28 \to 1.568 \to 1.741 \to 1.844$ (정답 2에 접근).
$x_2$ 좌표: $0 \to 0.2 \to 0.38 \to 0.542 \to 0.688 \to 0.819$ (정답 2에 매우 느리게).

> **메시지**: 곡률이 다른 좌표 ($A$의 고유값 4와 1) 의 수렴 속도가 다르다. Newton은 이 곡률 차이를 한 번에 보정해 한 스텝이면 끝난다.

---

# E. 코딩 실습 + 마무리

## E-1. 코딩 실습: Newton vs GD (Rosenbrock 함수)

```python
import numpy as np

def f(x):
    return (1 - x[0])**2 + 100 * (x[1] - x[0]**2)**2

def grad(x):
    g0 = -2*(1 - x[0]) - 400*x[0]*(x[1] - x[0]**2)
    g1 = 200*(x[1] - x[0]**2)
    return np.array([g0, g1])

def hess(x):
    h00 = 2 - 400*x[1] + 1200*x[0]**2
    h01 = -400*x[0]
    h11 = 200
    return np.array([[h00, h01], [h01, h11]])

# Newton
x = np.array([-1.0, 1.0])
for k in range(20):
    x = x - np.linalg.solve(hess(x), grad(x))
print("Newton end:", x, "f =", f(x))

# GD
x = np.array([-1.0, 1.0])
eta = 1e-3
for k in range(20):
    x = x - eta * grad(x)
print("GD end:", x, "f =", f(x))
```

Rosenbrock 함수의 최소점은 $(1, 1)$. Newton은 수 스텝, GD는 수천 스텝.

---

## E-2. Hessian 시각화 (Saddle vs Minimum)

```python
import numpy as np
import matplotlib.pyplot as plt

# (a) min: f = x^2 + y^2
# (b) saddle: f = x^2 - y^2
xx, yy = np.meshgrid(np.linspace(-2, 2, 100), np.linspace(-2, 2, 100))

fig, axes = plt.subplots(1, 2, figsize=(10, 4), subplot_kw={'projection': '3d'})
axes[0].plot_surface(xx, yy, xx**2 + yy**2, cmap='viridis')
axes[0].set_title('Local minimum (H positive definite)')
axes[1].plot_surface(xx, yy, xx**2 - yy**2, cmap='viridis')
axes[1].set_title('Saddle point (H indefinite)')
plt.show()
```

사발 모양 vs 안장 모양이 곧 Hessian 고유값 부호의 시각화이다.

---

## E-3. 본 회차 핵심 5개

1. **Hessian** $H = \nabla^2 f$: 모든 2차 partial을 모은 symmetric Matrix이다 (Clairaut). Gradient의 Jacobian이기도 하다.
2. **다변수 Taylor 2차 전개**: $f(\mathbf{x}_0 + \mathbf{h}) \approx f + \nabla f^\top \mathbf{h} + \tfrac{1}{2} \mathbf{h}^\top H \mathbf{h}$. 곡률 항이 새로 등장한다.
3. **임계점 판정**: $\nabla f = \mathbf{0}$일 때 $H$의 **고유값 부호**가 min·max·saddle을 결정한다.
4. **Newton 방법**: 2차 모델의 최소점으로 도약, $\mathbf{x} \leftarrow \mathbf{x} - H^{-1} \nabla f$. 이차형식에서는 한 스텝 만에 끝난다.
5. **옵티마이저 곡률 관점**: GD는 곡률 무시, Adam은 대각 근사, Newton은 전체 $H$, Natural gradient는 Fisher 사용. LLM은 메모리·계산 제약으로 Adam이 표준.

---

## E-4. 자기 점검 질문

- Hessian이 symmetric인 이유 (정리·조건) 는?
- 임계점에서 Hessian의 고유값 부호가 무엇을 결정하는가? 부호가 섞이면 어떤 점인가?
- Newton 한 스텝 식 $\mathbf{x} - H^{-1} \nabla f$가 어떤 모델의 최소점인지 한 줄로.
- Newton이 이차형식에서 한 스텝에 끝나는 이유를 손으로 보이시오.
- LLM 학습에 Newton 대신 Adam을 쓰는 가장 큰 이유 두 가지는?

---

<!-- _class: exercise -->

# 본 회차 마무리 문제

본 회차 사슬을 한 문제로 종합한다.

함수 $f(\mathbf{x}) = (x_1 - 1)^2 + 2 x_1 x_2 + 3 (x_2 - 2)^2$이 주어졌다.

- **(a)** $\nabla f(\mathbf{x})$와 $H$를 구하시오.
- **(b)** 임계점 $\mathbf{x}^*$를 풀이로 구하시오.
- **(c)** $H$의 고유값을 (직접 또는 trace·det로) 구하고 임계점이 min·max·saddle 중 어느 것인지 판정하시오.
- **(d)** Newton 한 스텝 ($\mathbf{x}_0 = (0, 0)^\top$ 출발) 후 $\mathbf{x}_1$이 임계점인지 확인하시오.

---

<!-- _class: exercise -->

## 본 회차 마무리 문제: 답

- **(a)** $\partial f / \partial x_1 = 2(x_1 - 1) + 2 x_2$, $\partial f / \partial x_2 = 2 x_1 + 6 (x_2 - 2)$.
  $\nabla f(\mathbf{x}) = (2 x_1 + 2 x_2 - 2, \; 2 x_1 + 6 x_2 - 12)^\top$.
  $H = \begin{pmatrix} 2 & 2 \\ 2 & 6 \end{pmatrix}$ (상수, 이차형식).

- **(b)** $\nabla f = \mathbf{0}$: $\begin{cases} 2 x_1 + 2 x_2 = 2 \\ 2 x_1 + 6 x_2 = 12 \end{cases}$, $x_2 = 5/2$, $x_1 = -3/2$.
  $\mathbf{x}^* = (-3/2, 5/2)^\top$.

- **(c)** $\mathrm{tr}(H) = 8$, $\det(H) = 12 - 4 = 8$. 고유값 $\lambda^2 - 8\lambda + 8 = 0$, $\lambda = 4 \pm 2\sqrt{2}$. 둘 다 양수 → **strict local (·global) minimum**.

- **(d)** $H$가 상수 (이차형식) 이므로 Newton 한 스텝이면 정답.
  $\mathbf{x}_1 = \mathbf{0} - H^{-1}(\nabla f(\mathbf{0})) = -H^{-1}(-2, -12)^\top$.
  $H^{-1} = \tfrac{1}{8}\begin{pmatrix} 6 & -2 \\ -2 & 2 \end{pmatrix}$, $H^{-1}(-2, -12)^\top = \tfrac{1}{8}(-12 + 24, 4 - 24)^\top = (12/8, -20/8)^\top = (3/2, -5/2)^\top$.
  $\mathbf{x}_1 = -(3/2, -5/2)^\top = (-3/2, 5/2)^\top$. 임계점과 정확히 일치. ✓

> **핵심**: 이차형식은 Hessian이 상수, Newton 한 스텝이 곧 정규방정식 풀이이다.

---

<!-- _class: exercise -->

## 다음 회차 Review용 숙제

본 회차 객체로 풀 수 있는 유사 문제이다.

- **(1)** $f(x_1, x_2) = x_1^4 + x_2^4 - 4 x_1 x_2$의 모든 임계점을 구하고 각각의 성격을 판정하시오 (3개 있다).
- **(2)** Logistic 손실 $f(\mathbf{x}) = \log(1 + \exp(-\mathbf{w}^\top \mathbf{x}))$의 Hessian이 항상 positive semidefinite임을 보이시오 ($\Rightarrow$ 로지스틱 회귀는 convex).
- **(3)** $f(\mathbf{x}) = \tfrac{1}{2} \mathbf{x}^\top A \mathbf{x} - \mathbf{b}^\top \mathbf{x}$에서 GD ($\eta < 2 / \lambda_{\max}(A)$) 의 수렴 속도가 condition number $\kappa = \lambda_{\max}/\lambda_{\min}$로 결정됨을 (한 줄 직관) 설명하시오. ($\kappa$가 크면 느리다.)

3회차 (Probability·MLE·KL) Review에서 다룬다.

---

## E-5. 다음 회차 (Part 3 3회차) 예고

**주제**: Probability · 기대값 · MLE · MAP · KL divergence · Cross entropy · Multivariate Gaussian

**연결**: 본 회차까지의 미분·최적화 도구가 **확률 모델 학습** (MLE) 에 그대로 적용된다. LLM의 토큰 예측이 MLE이며, 그 손실 함수가 cross entropy이다. KL divergence는 두 분포의 차이를 재는 표준 도구이다.

**사전 reading**:
- MML §6 (Probability), §8.3 일부 (Continuous Likelihood)

---

<!-- _class: lead -->

# Q & A

본 회차 사슬:
**Hessian → Taylor 2차 → 임계점 판정 → Newton → 옵티마이저 비교**

핵심 한 줄: **Gradient는 어디로 갈지를, Hessian은 얼마나 갈지를 알려준다.** Newton은 한 점에서 그 모든 정보를 다 쓰는 방법이고, Adam은 그 핵심만 추려 실용화한 방법이다.

다음 회차의 출발 문제:
> 데이터에 노이즈가 있을 때, "가장 그럴듯한" 파라미터는 어떻게 정의하고 그것이 최적화 문제로 어떻게 환원되는가?

`HANDOUT`: 본 PDF + 3회차 사전 reading (MML §6)
