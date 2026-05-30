---
marp: true
theme: default
paginate: true
header: '인공지능 전공자를 위한 선형대수학'
footer: 'Part 4 5회차 — Kernel SVM · Kernel trick · RBF · Polynomial'
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

# Part 4 · 5회차

## Kernel SVM · Kernel trick · RBF · Polynomial kernel

MML §12.4-§12.5 (메인) · Part 4 (ML 및 AI의 수학적 응용) · (Strang 발췌 없음)
**Part 4 5회차** — 비선형 분류를 한 함수 $K(\mathbf{x}, \mathbf{x}')$로 환원합니다.

> 4회차 Dual SVM의 $\mathbf{x}_i^\top \mathbf{x}_j$ 자리를 다른 함수로 바꾼다는 한 발짝이 본 회차의 핵심.

---

<!-- _class: exercise -->

# Review: 4회차 마무리 숙제

지난 회차 숙제 (d): XOR 데이터를 선형 SVM으로 분리 가능한가?

> $\mathbf{x}_1=(1,1), y_1=+1$; $\mathbf{x}_2=(-1,1), y_2=-1$; $\mathbf{x}_3=(-1,-1), y_3=+1$; $\mathbf{x}_4=(1,-1), y_4=-1$.

### 답

**불가능**. 어떤 직선 $w_1x_1 + w_2x_2 + b = 0$도 네 점을 정확히 분리할 수 없다.

이유: $+1$ 점들 $(1,1), (-1,-1)$은 1·3 사분면, $-1$ 점들 $(-1,1), (1,-1)$은 2·4 사분면. **선형 결정 경계로는 사분면 패턴을 가를 수 없다**.

### 핵심 관찰

본 회차는 이 한계를 **특징 공간 매핑**으로 푼다. $(x_1, x_2) \mapsto (x_1, x_2, x_1 x_2)$처럼 새 좌표를 추가하면 XOR가 평면 한 장으로 분리된다. 그 매핑 자체를 명시적으로 만들지 않고 **Kernel 함수**만 다룬다는 것이 핵심.

---

## 본 회차 핵심 질문

> ### Dual SVM의 $\mathbf{x}_i^\top \mathbf{x}_j$를 다른 함수로 바꾸면 무엇이 가능해집니까?

이 한 질문에 답하려면 세 단계가 필요합니다.

1. **특징 공간 매핑** $\phi : \mathbb{R}^d \to \mathcal{H}$의 동기와 정식 정의
2. **Kernel trick**: $K(\mathbf{x}, \mathbf{x}') = \langle \phi(\mathbf{x}), \phi(\mathbf{x}') \rangle$를 $\phi$ 없이 직접 평가
3. **RBF·Polynomial** 두 대표 Kernel 정식과 직관

본 회차의 모든 결과는 이 순서를 따른다.

---

## 학습 목표

이번 회차가 끝나면 학생은 다음을 답할 수 있어야 합니다.

1. **특징 공간 매핑** $\phi$의 정식 정의를 적고 XOR 예제로 $\phi(\mathbf{x}) = (x_1, x_2, x_1 x_2)^\top$가 분리를 가능케 함을 설명할 수 있습니다.
2. **Kernel 함수**의 정식 정의 $K(\mathbf{x}, \mathbf{x}') = \langle \phi(\mathbf{x}), \phi(\mathbf{x}') \rangle$를 적을 수 있습니다.
3. **Polynomial kernel** $K = (\mathbf{x}^\top\mathbf{x}' + c)^p$의 전개를 손으로 풀고 대응되는 $\phi$ 일부를 적을 수 있습니다.
4. **RBF kernel** $K = \exp(-\gamma\|\mathbf{x}-\mathbf{x}'\|^2)$의 유사도 해석과 $\gamma$ 의미를 설명할 수 있습니다.
5. **Kernelized Dual SVM** 정식과 예측 식 $f(\mathbf{x}) = \mathrm{sign}(\sum_i \alpha_i y_i K(\mathbf{x}_i, \mathbf{x}) + b)$를 적을 수 있습니다.

---

## 본 회차 개념 사슬

| 질문 | 답 (본 회차의 답) | 도구 |
|---|---|---|
| XOR이 선형 분리 불가? | **특징 공간 매핑** | $\phi : \mathbb{R}^d \to \mathcal{H}$ |
| $\phi$를 직접 안 만들고 싶다? | **Kernel trick** | $K = \langle \phi, \phi' \rangle$ |
| 대표 Kernel? | **Polynomial·RBF** | $(\mathbf{x}^\top\mathbf{x}'+c)^p$, $\exp(-\gamma\|\cdot\|^2)$ |
| Dual의 어디에 들어가는가? | $\mathbf{x}_i^\top \mathbf{x}_j \to K(\mathbf{x}_i, \mathbf{x}_j)$ | 4회차 Dual |
| 예측 식? | $\sum_i \alpha_i y_i K(\mathbf{x}_i, \mathbf{x}) + b$ | Support vector |

→ 4회차 Dual의 한 자리를 바꾸는 한 발짝이 비선형 분류 전체를 연다.

---

## 수업 흐름

| 순서 | 블록 | 내용 |
|:---:|:---:|---|
| ① | A | **오프닝**: 핵심 질문 + 4회차 Review (XOR) |
| ② | **B** | **특징 공간 매핑** $\phi$ + XOR 풀이 |
| ③ | **C** | **Kernel trick** 정식 + Polynomial·RBF + Kernelized Dual SVM |
| ④ | D | **AI 연결**: 텍스트·이미지 Kernel 사례 |
| ⑤ | E | **마무리·자기 점검·다음 회차 (CNN)·자율 학습 박스 (NTK)** |

---

# B. 특징 공간 매핑

> 선형 분리 불가 데이터를 어떻게 풀까. 데이터를 더 큰 공간으로 옮긴다.

## B-1. 동기: XOR 예제

4회차 Review에서 본 XOR 데이터를 다시 보자.

- $+1$: $(1,1), (-1,-1)$
- $-1$: $(-1,1), (1,-1)$

특징 매핑 $\phi : \mathbb{R}^2 \to \mathbb{R}^3$를 $\phi(\mathbf{x}) = (x_1, x_2, x_1 x_2)^\top$로 정의하자. 각 점의 셋째 좌표:

| 점 | $\phi(\mathbf{x})$ | $y$ | $x_1 x_2$ |
|---|---|:---:|:---:|
| $(1, 1)$ | $(1, 1, 1)$ | $+1$ | $+1$ |
| $(-1, -1)$ | $(-1, -1, 1)$ | $+1$ | $+1$ |
| $(-1, 1)$ | $(-1, 1, -1)$ | $-1$ | $-1$ |
| $(1, -1)$ | $(1, -1, -1)$ | $-1$ | $-1$ |

→ 셋째 좌표 $x_1 x_2$만으로 분리 가능. Hyperplane $x_1 x_2 = 0$ (즉 $\mathbf{w} = (0, 0, 1)^\top, b = 0$)이 분리한다.

---

## B-2. 특징 공간 매핑: 정식 정의

### 정의 5.1 (특징 공간 매핑)
**입력 공간** $\mathcal{X}$ (보통 $\mathbb{R}^d$)에서 **특징 공간** $\mathcal{H}$ (Inner product가 정의된 공간)로 가는 함수
$$\phi : \mathcal{X} \to \mathcal{H}$$
를 **특징 공간 매핑**(feature map)이라 부른다.

- $\mathcal{H}$는 $\mathbb{R}^D$ (유한차원) 또는 무한차원 Hilbert space일 수 있음.
- 일반적으로 $\dim \mathcal{H} \ge \dim \mathcal{X}$. 보통 훨씬 크다.

### 응용 시나리오
입력 공간에서는 선형 분리 불가, **특징 공간에서는 선형 분리 가능**인 경우.

---

## B-3. $\phi$를 명시적으로 만들기의 문제

$d=2, p=3$ Polynomial 모든 단항식을 $\phi$의 좌표로:
$$\phi(\mathbf{x}) = (1, x_1, x_2, x_1^2, x_1 x_2, x_2^2, x_1^3, x_1^2 x_2, x_1 x_2^2, x_2^3)^\top \in \mathbb{R}^{10}.$$

$d = 1000, p = 3$이면 차원은 $\binom{1003}{3} \approx 1.68 \times 10^8$. **명시적으로 만들면 메모리·계산이 폭발**.

### 해결의 단서: 4회차 Dual SVM

4회차 Dual에서 데이터는 오직 $\mathbf{x}_i^\top\mathbf{x}_j$로만 등장했다. $\phi$를 도입하면 그 자리가 $\phi(\mathbf{x}_i)^\top\phi(\mathbf{x}_j)$가 된다.

→ **$\phi$ 자체는 필요 없고 $\phi(\mathbf{x}_i)^\top\phi(\mathbf{x}_j)$만 계산할 수 있다면 충분**하다.

---

# C. Kernel trick · Polynomial · RBF

## C-1. Kernel 함수: 정식 정의

### 정의 5.2 (Kernel 함수)
함수 $K : \mathcal{X} \times \mathcal{X} \to \mathbb{R}$가 **Kernel**이라 함은 어떤 특징 공간 매핑 $\phi : \mathcal{X} \to \mathcal{H}$가 존재해서
$$K(\mathbf{x}, \mathbf{x}') = \langle \phi(\mathbf{x}), \phi(\mathbf{x}') \rangle_{\mathcal{H}}, \quad \forall \mathbf{x}, \mathbf{x}' \in \mathcal{X}$$
인 것이다.

### Kernel의 성질 (정리 5.1, Mercer)
$K$가 Kernel이 되기 위한 필요충분조건은 **임의의 유한 표본** $\mathbf{x}_1, \ldots, \mathbf{x}_n$에 대해 Gram 행렬
$$\mathbf{K} = \big(K(\mathbf{x}_i, \mathbf{x}_j)\big)_{i,j} \in \mathbb{R}^{n \times n}$$
가 **대칭 양의 준정정**(PSD)인 것이다. (증명 자율)

> Part 2 7회차 (Positive definite)에서 다룬 객체가 여기 등장한다.

---

## C-2. Polynomial Kernel

### 정의 5.3 (Polynomial Kernel)
$$K_{\mathrm{poly}}(\mathbf{x}, \mathbf{x}') = (\mathbf{x}^\top \mathbf{x}' + c)^p, \quad c \ge 0, \; p \in \mathbb{N}.$$

### 예제: $d = 2, p = 2, c = 0$
$$K = (x_1 x_1' + x_2 x_2')^2 = (x_1 x_1')^2 + 2 x_1 x_1' x_2 x_2' + (x_2 x_2')^2.$$

이는 $\phi(\mathbf{x}) = (x_1^2, \sqrt{2}\, x_1 x_2, x_2^2)^\top$에 대해
$$\phi(\mathbf{x})^\top\phi(\mathbf{x}') = x_1^2 x_1'^2 + 2 x_1 x_2 x_1' x_2' + x_2^2 x_2'^2 = K.$$

→ **$\phi$를 만들지 않고 $K$를 $\mathbf{x}^\top\mathbf{x}'$ 한 번과 제곱으로 계산**. 비용 $\mathcal{O}(d)$.

---

## C-3. RBF (Gaussian) Kernel

### 정의 5.4 (RBF Kernel, Radial Basis Function)
$$K_{\mathrm{RBF}}(\mathbf{x}, \mathbf{x}') = \exp(-\gamma \|\mathbf{x} - \mathbf{x}'\|^2), \quad \gamma > 0.$$

### 직관
- $\|\mathbf{x} - \mathbf{x}'\| = 0$: $K = 1$ (최대 유사도, 자기 자신).
- $\|\mathbf{x} - \mathbf{x}'\| \to \infty$: $K \to 0$ (멀어지면 0).
- $\gamma$: **거리 민감도**. 큰 $\gamma$ → 좁은 봉우리 (가까운 점만 유사), 작은 $\gamma$ → 넓은 봉우리.

### 대응하는 $\phi$의 차원
RBF의 $\phi$는 **무한차원**이다 ($e^{-\gamma\|\mathbf{x}\|^2}$의 Taylor 전개에서 모든 차수의 단항식 등장). 명시적으로 만들 수 없지만 **$K$ 자체는 한 번의 거리 계산 + $\exp$로 끝**.

> 이것이 Kernel trick의 정수: **$\phi$가 무한차원이어도 $K$만 다루면 유한 비용**.

---

## C-4. Kernelized Dual SVM

### 4회차 Dual 식 재방문
$$\max_{\alpha \ge 0} \sum_i \alpha_i - \tfrac{1}{2}\sum_{i,j} \alpha_i \alpha_j y_i y_j (\mathbf{x}_i^\top \mathbf{x}_j) \quad \text{s.t.} \quad \sum_i \alpha_i y_i = 0.$$

### Kernel 치환
$$\boxed{\;\max_{\alpha \ge 0} \sum_i \alpha_i - \tfrac{1}{2}\sum_{i,j} \alpha_i \alpha_j y_i y_j K(\mathbf{x}_i, \mathbf{x}_j) \quad \text{s.t.} \quad \sum_i \alpha_i y_i = 0.\;}$$

(Soft margin은 추가로 $\alpha_i \le C$.)

### 예측 식
$$f(\mathbf{x}) = \mathrm{sign}\!\left(\sum_{i : \alpha_i > 0} \alpha_i y_i K(\mathbf{x}_i, \mathbf{x}) + b\right).$$

→ **Support vector만 예측에 등장**. 학습·예측 모두 Kernel 값으로만 수행. $\phi$는 절대 만들지 않는다.

---

## C-5. Kernel trick의 적용 범위

### 정리 5.2 (Kernelization 가능 조건)
어떤 알고리즘이 데이터 $\mathbf{x}_i$를 오직 Inner product $\mathbf{x}_i^\top\mathbf{x}_j$의 형태로만 사용한다면, 그 알고리즘은 Kernel 함수로 일반화 가능하다.

### 적용 예
- **Kernel SVM** (본 회차)
- **Kernel PCA** (Part 4 2회차 SVD·PCA의 비선형 확장, 자율)
- **Kernel Ridge regression**
- **Gaussian Process** (Kernel은 공분산 함수, 자율)

→ 본 회차에서는 Kernel SVM에 한정해 다룬다.

---

## C-6. Kernel 결합 규칙

### 정리 5.3 (Kernel의 폐쇄 성질)
$K_1, K_2$가 Kernel이면 다음도 Kernel이다.
- $K_1 + K_2$
- $c K_1$ ($c > 0$)
- $K_1 \cdot K_2$
- $f(\mathbf{x}) K_1(\mathbf{x}, \mathbf{x}') f(\mathbf{x}')$, $f : \mathcal{X} \to \mathbb{R}$
- $\exp(K_1)$

(증명 자율, MML §12.5 참조.)

### 활용
RBF는 Polynomial Kernel과 $\exp$의 결합으로 직접 구성할 수 있다. 복잡한 Kernel을 단순한 Kernel의 합·곱으로 설계한다.

---

<!-- _class: exercise -->

# 잠깐 풀어보기: Kernel SVM

### 문제 1 (계산)
$\mathbf{x} = (1, 2)^\top, \mathbf{x}' = (3, 4)^\top$에 대해 다음을 계산하시오.
- (a) 선형 Kernel $K_{\mathrm{lin}} = \mathbf{x}^\top\mathbf{x}'$
- (b) Polynomial Kernel $K_{\mathrm{poly}} = (\mathbf{x}^\top\mathbf{x}' + 1)^2$
- (c) RBF Kernel $K_{\mathrm{RBF}} = \exp(-1 \cdot \|\mathbf{x} - \mathbf{x}'\|^2)$ ($\gamma = 1$)

### 문제 2 (개념)
XOR 데이터 ($(1,1), (-1,1), (-1,-1), (1,-1)$, 부호 $+,-,+,-$)를 분리하는 데 **Polynomial Kernel** $K = (\mathbf{x}^\top\mathbf{x}'+1)^2$가 충분한 이유를 한 줄로 설명하시오.

> **힌트**: B-1에서 본 $\phi$의 셋째 좌표가 어디에서 등장하는지 보면 된다.

---

<!-- _class: exercise -->

## 잠깐 풀어보기: 답

### 문제 1
- (a) $\mathbf{x}^\top\mathbf{x}' = 1 \cdot 3 + 2 \cdot 4 = 11$
- (b) $(11 + 1)^2 = 144$
- (c) $\|\mathbf{x} - \mathbf{x}'\|^2 = 4 + 4 = 8$, $K = \exp(-8) \approx 3.35 \times 10^{-4}$

### 문제 2
$(x_1 x_1' + x_2 x_2' + 1)^2$의 전개에 **$x_1 x_2 \cdot x_1' x_2'$ 항이 등장**한다 (계수 2). 즉 $\phi$의 한 좌표가 $x_1 x_2$이며, 이 좌표만으로도 XOR 데이터가 1차원에서 분리된다.

→ Polynomial Kernel은 **모든 차수 $\le p$의 단항식 곱**을 $\phi$의 좌표로 자동 포함한다.

---

# D. AI 연결

## D-1. 텍스트 분류에서의 Kernel

### 문자열 Kernel
두 문자열 $s, s'$의 공통 부분문자열 개수로 유사도를 정의하는 Kernel. $\phi(s)$를 명시적으로 적기 어렵지만 (모든 부분문자열을 좌표로) $K(s, s')$는 동적 프로그래밍으로 효율 계산.

### TF-IDF + 선형 Kernel
실용에서는 텍스트를 TF-IDF Vector로 만들고 **선형 Kernel** $K = \mathbf{x}^\top\mathbf{x}'$만으로 충분한 경우가 많다. 차원이 이미 충분히 크기 때문.

→ Kernel 선택은 **데이터의 본래 구조**에 의존한다. "RBF가 항상 좋다"는 잘못된 통념.

---

## D-2. 이미지에서의 Kernel

딥러닝 이전 이미지 분류의 표준:
- **HOG·SIFT 특징**·**RBF SVM**

HOG (Histogram of Oriented Gradients)·SIFT (Scale-Invariant Feature Transform)는 손으로 설계한 특징 추출기. 그 위에 RBF Kernel SVM을 얹는 것이 2010년 ImageNet 이전 표준이었다.

### 딥러닝 이후
딥러닝은 **특징 추출 $\phi$ 자체를 학습**한다. Kernel 함수는 명시적으로 다루지 않지만, 마지막 층의 선형 분류기 직전까지가 사실상 학습된 $\phi$다.

→ Kernel SVM은 사라지지 않았다. **특징 학습·선형 분류기**의 골격이 본 회차의 직접 후속이다.

---

## D-3. Kernel 선택의 한 줄 기준

| Kernel | 어디에 쓰나 | 주의 |
|---|---|---|
| 선형 $K = \mathbf{x}^\top\mathbf{x}'$ | 고차원·희소 (텍스트) | 비선형 패턴 잡지 못함 |
| Polynomial $(\mathbf{x}^\top\mathbf{x}'+c)^p$ | 명시적 단항식 곱 필요 | $p$ 크면 수치 불안정 |
| RBF $\exp(-\gamma\|\cdot\|^2)$ | 분포 모르는 일반 데이터 | $\gamma$ 튜닝 필수, 차원 크면 약함 |

→ **선형 → RBF → Polynomial**의 시도 순서가 실용 권장.

---

## D-4. 본 회차 핵심 5개

1. **특징 공간 매핑** $\phi : \mathcal{X} \to \mathcal{H}$로 입력 공간에서 선형 분리 불가 데이터를 특징 공간에서 분리 가능하게 만든다.
2. **Kernel 함수** $K(\mathbf{x}, \mathbf{x}') = \langle \phi(\mathbf{x}), \phi(\mathbf{x}') \rangle$는 $\phi$를 명시적으로 만들지 않고 Inner product만 직접 계산한다.
3. **Polynomial Kernel** $(\mathbf{x}^\top\mathbf{x}'+c)^p$의 $\phi$는 차수 $\le p$의 모든 단항식.
4. **RBF Kernel** $\exp(-\gamma\|\mathbf{x}-\mathbf{x}'\|^2)$의 $\phi$는 무한차원. 거리 유사도 해석.
5. **Kernelized Dual SVM**: 4회차 Dual의 $\mathbf{x}_i^\top\mathbf{x}_j$를 $K(\mathbf{x}_i, \mathbf{x}_j)$로 치환. 예측 $f(\mathbf{x}) = \mathrm{sign}(\sum_i \alpha_i y_i K(\mathbf{x}_i, \mathbf{x}) + b)$.

---

## D-5. 자기 점검 질문

- $\phi$가 무한차원일 수 있는데 어떻게 $K$를 유한 비용으로 계산하는가?
- Polynomial Kernel $(\mathbf{x}^\top\mathbf{x}' + 1)^p$에서 상수 $1$ ($c$)이 들어가는 의미는?
- RBF Kernel의 $\gamma$가 작아질수록 결정 경계가 더 매끄러워지는 이유는?
- Mercer 정리가 보장하는 것은 무엇이며, Gram 행렬의 어떤 성질로 검증하는가?
- 선형 SVM이 잘 동작하는데 굳이 Kernel을 쓸 필요가 있는가?

---

<!-- _class: exercise -->

# 본 회차 마무리 문제 (즉석 풀이)

본 회차 사슬 (특징 매핑 → Kernel → Polynomial·RBF → Kernelized Dual)을 **한 문제**로 종합합니다.

XOR 데이터 (4회차 Review와 동일):
- $\mathbf{x}_1 = (1, 1), y_1 = +1$; $\mathbf{x}_2 = (-1, 1), y_2 = -1$
- $\mathbf{x}_3 = (-1, -1), y_3 = +1$; $\mathbf{x}_4 = (1, -1), y_4 = -1$

- **(a)** Polynomial Kernel $K(\mathbf{x}, \mathbf{x}') = (\mathbf{x}^\top\mathbf{x}' + 1)^2$의 Gram 행렬 $\mathbf{K} \in \mathbb{R}^{4 \times 4}$를 계산하시오.
- **(b)** $\phi(\mathbf{x}) = (1, \sqrt{2}x_1, \sqrt{2}x_2, x_1^2, \sqrt{2}x_1 x_2, x_2^2)^\top$에 대해 $\phi(\mathbf{x}_1)$를 적으시오.
- **(c)** 본 Kernel로 XOR 데이터가 특징 공간에서 분리 가능한 이유를 $\phi$의 어느 좌표로 설명하시오.
- **(d)** Kernelized Dual SVM의 예측식 $f(\mathbf{x}) = \mathrm{sign}(\sum_i \alpha_i y_i K(\mathbf{x}_i, \mathbf{x}) + b)$가 $\phi$를 직접 계산하지 않는 이유를 한 줄로 답하시오.

---

<!-- _class: exercise -->

## 본 회차 마무리 문제: 답

- **(a)** $K(\mathbf{x}_i, \mathbf{x}_j) = (\mathbf{x}_i^\top\mathbf{x}_j + 1)^2$. 각 Inner product: $\mathbf{x}_i^\top\mathbf{x}_j = \pm 2$ (같은 사분면 대각) 또는 $0$ (직교).
  $$\mathbf{K} = \begin{pmatrix} 9 & 1 & 1 & 1 \\ 1 & 9 & 1 & 1 \\ 1 & 1 & 9 & 1 \\ 1 & 1 & 1 & 9 \end{pmatrix}.$$
  (대각: $(2+1)^2 = 9$, 비대각 인접: $(0+1)^2 = 1$, 비대각 반대: $(-2+1)^2 = 1$)

- **(b)** $\phi(\mathbf{x}_1) = (1, \sqrt{2}, \sqrt{2}, 1, \sqrt{2}, 1)^\top$.

- **(c)** $\phi$의 다섯째 좌표 $\sqrt{2} x_1 x_2$가 XOR 패턴과 같은 부호 ($+1, -1, +1, -1$이 아니라 $x_1 x_2 = +1, -1, +1, -1$). 이 좌표 한 축으로 분리.

- **(d)** 학습·예측 모두 $K(\cdot, \cdot)$ 값만 필요하기 때문. $\phi$의 6차원·무한차원 좌표를 실제로 만들 필요가 없다.

> **핵심**: 4회차 Dual의 한 자리 ($\mathbf{x}_i^\top\mathbf{x}_j \to K$) 교체로 XOR이 풀린다.

---

<!-- _class: exercise -->

## 다음 회차 (CNN) Review용 숙제

본 회차 마무리 문제의 **유사 문제**입니다.

세 점 1D 데이터: $x_1 = -2, y_1 = +1$; $x_2 = 0, y_2 = -1$; $x_3 = 2, y_3 = +1$.

- (a) 선형 SVM으로 분리 가능한가?
- (b) Polynomial Kernel $K(x, x') = (x \cdot x' + 1)^2$의 Gram 행렬 $\mathbf{K} \in \mathbb{R}^{3 \times 3}$를 계산하시오.
- (c) $\phi(x) = (1, \sqrt{2}x, x^2)^\top$에 대해 세 점을 특징 공간 좌표로 적고, 어느 좌표로 분리 가능한지 설명하시오.
- (d) 본 회차 정리 5.2 (Kernelization 조건)에 따르면 알고리즘이 데이터를 어떤 형태로 사용해야 Kernel 일반화가 가능한가?

---

## E-1. 과제 안내

`04_과제/Part3/05회차_homework.md` — 마감: 6회차 시작 전

**수학 30점**
- Polynomial Kernel 전개·대응 $\phi$ 적기, 3문제
- RBF Kernel 거리 유사도 해석·$\gamma$ 효과, 2문제
- Gram 행렬 PSD 검증 (작은 예), 2문제
- Kernelized Dual SVM 정식·예측식 유도, 3문제

**코딩 20점**
- `sklearn.svm.SVC(kernel='rbf', gamma=g, C=c)`로 XOR 학습·결정 경계 시각화
- $\gamma \in \{0.1, 1, 10\}$, $C \in \{0.1, 1, 10\}$ 그리드 결과 비교
- Support vector 비율 (`len(clf.support_) / n`) 분석

---

## E-2. 다음 회차 (6회차) 예고

**주제**: CNN · 1D Conv → Toeplitz 환원 · 1×1 Conv = 행렬곱

**연결**: 본 회차 Kernel SVM에서 $\phi$를 명시적으로 만들지 않았다. **CNN은 정반대**: 학습으로 $\phi$ 자체를 만든다. 본 회차에서는 Conv 연산을 LA의 어떤 객체로 환원할 수 있는지가 핵심이다 (**Toeplitz 행렬 곱**).

**사전 reading**:
- Goodfellow·Bengio·Courville, *Deep Learning* Ch.9 (CNN) — 자율
- 1D signal processing 기초

---

<div class="appendix">

## 자율 학습·부록: NTK (Neural Tangent Kernel)

본 강좌 본문에서는 다루지 않는다. 신경망 학습을 무한 폭 극한에서 Kernel ridge regression으로 환원하는 이론 (Jacot·Gabriel·Hongler 2018). 본 회차 Kernel·RBF 개념의 직접 후속. 관심 학생은 후속 자료 또는 *Neural Tangent Kernel: Convergence and Generalization in Neural Networks* (NeurIPS 2018) 참고.

</div>

---

# 부록: MML §12.4-§12.5 추천 연습문제

본 회차에서 다룬 내용을 손으로 더 다루어 보고 싶은 학생을 위한 안내입니다 (모두 자율).

| MML §12 | 주제 | 난도 |
|---|---|:---:|
| Exercise 12.6 | Polynomial Kernel의 $\phi$ 유도 | 중 |
| Exercise 12.7 | RBF Kernel의 PSD 검증 | 상 |
| Exercise 12.8 | Kernel 결합 규칙 증명 (합·곱) | 중 |
| Exercise 12.9 | Kernelized SVM Dual 정식 유도 | 중 |

---

<!-- _class: lead -->

# Q & A

본 회차 사슬:
**특징 공간 매핑 → Kernel 함수 → Polynomial·RBF → Kernelized Dual SVM**

핵심 한 줄: **Kernel trick은 $\phi$를 만들지 않고 $\langle \phi, \phi' \rangle$만 계산하여 비선형 분류를 한 번의 함수 호출로 환원한다.**

다음 회차의 출발 문제:
> Conv 연산은 LA의 어떤 객체로 적을 수 있을까?

`HANDOUT`: 본 PDF
