---
marp: true
theme: default
paginate: true
header: '인공지능 전공자를 위한 선형대수학'
footer: 'Part 4 4회차 — Support Vector Machine · Hard/Soft margin · Hinge · Dual'
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

# Part 4 · 4회차

## Support Vector Machine · Hard/Soft margin · Hinge loss · Dual

MML §12.1-§12.3 (메인) · Part 4 (ML 및 AI의 수학적 응용) · (Strang 발췌 없음)
**Part 4 4회차** — 분류기를 "마진 최대화"라는 한 원칙으로 환원합니다.

> 본 회차는 Part 3 4회차 (KKT)와 Part 1의 Inner product·Norm·정사영을 한 자리에 모읍니다.

---

<!-- _class: exercise -->

# Review: 3회차 마무리 문제

지난 회차 (GMM·EM) 마무리 문제:

> 두 개의 가우시안 성분 $(\pi_1, \mu_1, \Sigma_1), (\pi_2, \mu_2, \Sigma_2)$로 $n$개 데이터를 클러스터링한다. E-step의 책임도 $\gamma_{ik}$의 정의식과 M-step의 $\mu_k$ 갱신식을 적으시오.

### 답

- E-step: $\gamma_{ik} = \dfrac{\pi_k \mathcal{N}(\mathbf{x}_i \mid \mu_k, \Sigma_k)}{\sum_{j=1}^{2} \pi_j \mathcal{N}(\mathbf{x}_i \mid \mu_j, \Sigma_j)}$
- M-step: $\mu_k = \dfrac{\sum_{i=1}^{n} \gamma_{ik} \mathbf{x}_i}{\sum_{i=1}^{n} \gamma_{ik}}$

### 핵심 관찰

EM은 잠재변수의 사후확률 (책임도)을 가중치로 한 **가중 평균**으로 파라미터를 갱신한다. 책임도 자체가 한 데이터의 "어느 성분 소속" 확률이다.

본 회차는 EM의 확률적 결정 (soft)에서 한 발 물러나, **결정 경계 자체의 기하**를 직접 다루는 SVM으로 들어간다.

---

## 본 회차 핵심 질문

> ### 두 클래스를 가르는 가장 좋은 직선·초평면이란 무엇입니까?

이 한 질문에 답하려면 세 단계가 필요합니다.

1. **Hyperplane**(초평면)과 **Margin**(마진)의 정식 정의
2. **Hard margin SVM**의 최적화 문제 (선형분리 가정)
3. **Soft margin·Hinge loss**와 **Dual** 형태 (KKT로 정당화)

본 회차의 모든 결과는 이 순서를 따른다.

---

## 학습 목표

이번 회차가 끝나면 학생은 다음을 답할 수 있어야 합니다.

1. **Hyperplane** $\mathbf{w}^\top \mathbf{x} + b = 0$의 정식 정의와 점·초평면 거리식을 적을 수 있습니다.
2. **Hard margin SVM**의 정식 최적화 문제 $\min \tfrac{1}{2}\|\mathbf{w}\|^2$ s.t. $y_i(\mathbf{w}^\top\mathbf{x}_i + b) \ge 1$을 세울 수 있습니다.
3. **Soft margin SVM**과 **Hinge loss** $\max(0, 1 - y_i(\mathbf{w}^\top\mathbf{x}_i + b))$의 동치를 설명할 수 있습니다.
4. **Lagrange dual**·**KKT 조건**으로 Dual SVM 식을 유도할 수 있습니다.
5. **Support vector**의 정의와 $\mathbf{w} = \sum_i \alpha_i y_i \mathbf{x}_i$의 의미를 답할 수 있습니다.

---

## 본 회차 학습 흐름

| 질문 | 답 (본 회차의 답) | 도구 |
|---|---|---|
| 두 클래스를 가르는 평면? | **Hyperplane** | $\mathbf{w}^\top\mathbf{x}+b=0$ |
| 가장 좋은 평면? | **Margin 최대화** | $\tfrac{2}{\|\mathbf{w}\|}$ |
| 정식 최적화? | **Hard margin SVM** | $\min \tfrac{1}{2}\|\mathbf{w}\|^2$ |
| 선형 분리 불가? | **Soft margin·Hinge** | slack $\xi_i \ge 0$ |
| 풀이 도구? | **Lagrange Dual·KKT** | Part 3 4회차 |
| 해의 형태? | $\mathbf{w} = \sum_i \alpha_i y_i \mathbf{x}_i$ | Support vector |

→ 본 회차는 **Inner product·Norm (Part 1)·최적화·KKT (Part 3 4회차)**의 종합 응용이다.

---

## 수업 흐름

| 순서 | 블록 | 내용 |
|:---:|:---:|---|
| ① | A | **오프닝**: 핵심 질문·3회차 Review |
| ② | **B** | **Hyperplane·Margin** 정식 정의, 점·평면 거리식 |
| ③ | **C** | **Hard margin SVM** 정식·Soft margin·Hinge·Dual 풀이 (KKT) |
| ④ | **D** | **AI 연결**: 텍스트 분류·SVM의 역사적 위치 |
| ⑤ | E | **마무리·자기 점검·다음 회차 (Kernel SVM)** |

---

# B. Hyperplane · Margin: 정의·동기

> "두 클래스를 가르는 평면"을 정식으로 적습니다.

## B-1. 동기: 분류기의 기하학적 접근

이진 분류 문제: 데이터 $\{(\mathbf{x}_i, y_i)\}_{i=1}^n$, $\mathbf{x}_i \in \mathbb{R}^d$, $y_i \in \{-1, +1\}$.

목표: 새 입력 $\mathbf{x}$에 대해 $y \in \{-1, +1\}$ 예측.

**접근 1 (확률)**: Logistic regression. $P(y=+1 \mid \mathbf{x})$를 모델링.
**접근 2 (기하)**: 두 클래스를 가르는 **평면** 하나를 찾는다. 평면의 어느 쪽인가로 결정.

→ SVM은 접근 2의 정점. **평면을 어떻게 고를지**를 마진 최대화로 정식화한다.

---

## B-2. Hyperplane: 정식 정의

### 정의 4.1 (Hyperplane, 초평면)
$\mathbf{w} \in \mathbb{R}^d \setminus \{\mathbf{0}\}$, $b \in \mathbb{R}$에 대해
$$H = \{\mathbf{x} \in \mathbb{R}^d : \mathbf{w}^\top \mathbf{x} + b = 0\}$$
를 $\mathbb{R}^d$의 **Hyperplane**(초평면)이라 부른다. $\mathbf{w}$를 **법선 Vector**(normal vector), $b$를 **편향**(bias)이라 한다.

- $d=2$: 직선. $d=3$: 평면. 일반 $d$: $d-1$차원 평면.
- $\mathbf{w}$는 평면에 수직. 평면의 "기울기 방향".
- 같은 평면을 $(\mathbf{w}, b)$와 $(c\mathbf{w}, cb)$ ($c \ne 0$)가 동일하게 표현 → **스케일 자유도** 존재.

> **다음 절에서 사용**: 이 자유도를 이용해 마진 1을 강제한다.

---

## B-3. 점·Hyperplane 거리식

### 정리 4.1 (점·Hyperplane 거리)
점 $\mathbf{x}_0 \in \mathbb{R}^d$에서 Hyperplane $H : \mathbf{w}^\top\mathbf{x}+b=0$까지의 거리는
$$\mathrm{dist}(\mathbf{x}_0, H) = \frac{|\mathbf{w}^\top\mathbf{x}_0 + b|}{\|\mathbf{w}\|}.$$

### 증명 흐름 (Part 1 정사영 이용)
$H$ 위의 한 점 $\mathbf{x}_H$를 잡으면 $\mathbf{w}^\top\mathbf{x}_H + b = 0$. 차이 Vector $\mathbf{x}_0 - \mathbf{x}_H$를 법선 방향 $\mathbf{w}/\|\mathbf{w}\|$로 정사영하면
$$\mathrm{dist} = \left|\frac{\mathbf{w}^\top(\mathbf{x}_0 - \mathbf{x}_H)}{\|\mathbf{w}\|}\right| = \frac{|\mathbf{w}^\top\mathbf{x}_0 + b|}{\|\mathbf{w}\|}.$$

→ **Part 2 1회차 (Projection·정사영)이 본 회차의 거리식을 정당화**한다.

---

## B-4. Margin (마진): 정의

데이터 $\{(\mathbf{x}_i, y_i)\}_{i=1}^n$가 Hyperplane $H : \mathbf{w}^\top\mathbf{x}+b=0$에 의해 정확히 분리된다고 하자.

### 정의 4.2 (Margin)
각 점에서 평면까지의 최소 거리:
$$\mathrm{margin}(\mathbf{w}, b) = \min_{i=1, \ldots, n} \frac{|\mathbf{w}^\top\mathbf{x}_i + b|}{\|\mathbf{w}\|}.$$

<div class="analogy">

**기하적 해석 (Maximum margin)**: Hyperplane $\mathbf{w}^\top\mathbf{x} + b = 0$은 두 클래스를 분리하는 결정 경계이고, Margin은 그 경계에서 가장 가까운 데이터 점까지의 수직 거리이다. SVM은 두 클래스 어느 점에 대해서도 이 수직 거리가 최대가 되는 분리 경계 $(\mathbf{w}^*, b^*)$를 찾는 알고리즘이다. 일반화 오차 상한 (VC 차원·Margin 의존) 이 Margin에 반비례하므로 큰 margin이 곧 좋은 일반화로 이어진다.

</div>

---

## B-5. 분류 규칙과 부호

데이터가 정확히 분리되면 $y_i (\mathbf{w}^\top\mathbf{x}_i + b) > 0$ (전 점에서 부호 일치).

스케일 자유도를 사용해 **모든 점에서 $y_i(\mathbf{w}^\top\mathbf{x}_i + b) \ge 1$**, 등식은 평면에 가장 가까운 점 (마진 위)에서 성립하도록 정규화하자.

→ 이 정규화 하에서
$$\mathrm{margin}(\mathbf{w}, b) = \frac{1}{\|\mathbf{w}\|}, \qquad \text{두 마진 평면 사이 거리} = \frac{2}{\|\mathbf{w}\|}.$$

**마진 최대화** = $\dfrac{1}{\|\mathbf{w}\|}$ 최대화 = $\|\mathbf{w}\|^2$ **최소화**.

---

# C. Hard margin · Soft margin · Dual

## C-1. Hard margin SVM 정식

### 정의 4.3 (Hard margin SVM, primal)
선형 분리 가능 데이터에 대해
$$\boxed{\;\min_{\mathbf{w}, b} \tfrac{1}{2}\|\mathbf{w}\|^2 \quad \text{s.t.} \quad y_i(\mathbf{w}^\top\mathbf{x}_i + b) \ge 1, \;\; i = 1, \ldots, n.\;}$$

- 목적함수 $\tfrac{1}{2}\|\mathbf{w}\|^2$는 **Convex 이차함수**.
- 제약은 **선형 부등식**.
- **Convex quadratic program** (QP).

> **Part 3 4회차 (Convex 최적화·KKT)에서 다룬 정식 도구가 본 회차에서 작동**한다.

### 한계
- **선형 분리 가능**이 가정. 현실 데이터는 자주 분리 불가.
- 이상점 1개로 해가 망가질 수 있음.

---

## C-2. Soft margin SVM 정식

### 정의 4.4 (Soft margin SVM)
slack 변수 $\xi_i \ge 0$을 도입해 일부 위반 허용:
$$\boxed{\;\min_{\mathbf{w}, b, \xi} \tfrac{1}{2}\|\mathbf{w}\|^2 + C\sum_{i=1}^n \xi_i \quad \text{s.t.} \quad y_i(\mathbf{w}^\top\mathbf{x}_i + b) \ge 1 - \xi_i, \;\; \xi_i \ge 0.\;}$$

- $C > 0$: 위반에 대한 벌점 강도. 큰 $C$ → 위반을 강하게 억제 (hard 근사), 작은 $C$ → 큰 마진 우선.
- $\xi_i = 0$: 마진 밖 정확 분류. $0 < \xi_i \le 1$: 마진 안 정확 분류. $\xi_i > 1$: 오분류.

---

## C-3. Hinge loss와의 동치

slack의 최적값: $\xi_i = \max(0, 1 - y_i(\mathbf{w}^\top\mathbf{x}_i + b))$.

대입하면 Soft margin SVM은
$$\min_{\mathbf{w}, b} \;\tfrac{1}{2}\|\mathbf{w}\|^2 + C\sum_{i=1}^n \max(0,\, 1 - y_i(\mathbf{w}^\top\mathbf{x}_i + b)).$$

### 정의 4.5 (Hinge loss)
$$L_{\mathrm{hinge}}(z) = \max(0,\, 1 - z), \qquad z = y(\mathbf{w}^\top\mathbf{x}+b).$$

- $z \ge 1$: 손실 0 (마진 밖 정확).
- $z < 1$: 손실 $1 - z$ (마진 안 또는 오분류).
- **꺾인 선형 함수**, $z=1$에서 미분 불연속.

→ SVM = **L2 정규화·Hinge loss** 형태. 다른 분류기와 같은 골격이다 (Logistic = L2·Logistic loss).

---

## C-4. Lagrangian과 Dual

### 정리 4.2 (Hard margin SVM의 Lagrangian)
$\alpha_i \ge 0$을 부등식 $y_i(\mathbf{w}^\top\mathbf{x}_i+b) - 1 \ge 0$의 Lagrange 승수로 두면
$$\mathcal{L}(\mathbf{w}, b, \alpha) = \tfrac{1}{2}\|\mathbf{w}\|^2 - \sum_{i=1}^n \alpha_i \big[y_i(\mathbf{w}^\top\mathbf{x}_i + b) - 1\big].$$

### Stationarity (KKT 조건 일부)
- $\nabla_\mathbf{w}\mathcal{L} = \mathbf{w} - \sum_i \alpha_i y_i \mathbf{x}_i = \mathbf{0}$ → $\;\mathbf{w}^* = \sum_i \alpha_i y_i \mathbf{x}_i$
- $\partial_b\mathcal{L} = -\sum_i \alpha_i y_i = 0$ → $\;\sum_i \alpha_i y_i = 0$

→ **최적 $\mathbf{w}$가 데이터의 Linear combination**이다. 이것이 Dual의 핵심 출발점.

---

## C-5. Dual SVM 정식

위 stationarity를 $\mathcal{L}$에 대입하면 $\mathbf{w}, b$가 소거된다.

### 정리 4.3 (Hard margin SVM의 Dual)
$$\boxed{\;\max_{\alpha \ge 0} \;\sum_{i=1}^n \alpha_i \;-\; \tfrac{1}{2}\sum_{i,j=1}^n \alpha_i\alpha_j y_i y_j (\mathbf{x}_i^\top \mathbf{x}_j) \quad \text{s.t.} \quad \sum_i \alpha_i y_i = 0.\;}$$

- 변수: $\alpha_i$ ($n$개), $\mathbf{w}, b$ 소거됨.
- **데이터 $\mathbf{x}_i, \mathbf{x}_j$는 오직 Inner product $\mathbf{x}_i^\top \mathbf{x}_j$로만 등장**.
- Soft margin: 조건이 $0 \le \alpha_i \le C$로 바뀜 (KKT로 유도).

> **다음 회차 (Kernel SVM)의 출발점**: Inner product를 다른 함수 $K(\mathbf{x}_i, \mathbf{x}_j)$로 바꾸면 비선형 분류로 확장된다.

---

## C-6. KKT 조건과 Support Vector

KKT의 **Complementary slackness**:
$$\alpha_i \cdot \big[y_i(\mathbf{w}^\top\mathbf{x}_i + b) - 1\big] = 0, \qquad i = 1, \ldots, n.$$

→ 두 경우:
- $\alpha_i = 0$: 점이 마진 밖. 해에 **기여하지 않음**.
- $\alpha_i > 0$: 점이 **마진 위** ($y_i(\mathbf{w}^\top\mathbf{x}_i + b) = 1$). 이 점을 **Support vector**라 부른다.

### 정의 4.6 (Support Vector)
KKT 조건에서 $\alpha_i > 0$인 데이터 $\mathbf{x}_i$를 **Support vector**라 한다.

### 핵심 결론
$$\mathbf{w}^* = \sum_{i : \alpha_i > 0} \alpha_i y_i \mathbf{x}_i.$$

→ **해는 Support vector들의 Linear combination만으로 결정**된다. 다른 점들은 빼도 결과가 같다.

---

<!-- _class: exercise -->

# 잠깐 풀어보기: SVM 정식·Dual

### 문제 1 (계산)
$\mathbf{x}_1 = (1, 1)^\top, y_1 = +1$; $\mathbf{x}_2 = (-1, -1)^\top, y_2 = -1$이 주어진 1차원 분리 가능 데이터.

- (a) 두 점만의 최적 Hyperplane $\mathbf{w}^\top\mathbf{x} + b = 0$을 직관적으로 구하시오 (그림으로).
- (b) 그 평면의 마진 $1/\|\mathbf{w}\|$를 구하시오.

### 문제 2 (개념)
Dual SVM의 변수가 왜 $n$개 ($\alpha_i$ 개수)이고 데이터 차원 $d$와 무관한지 한 줄로 설명하시오.

> **힌트**: 두 점 $(1,1), (-1,-1)$을 가르는 가장 마진 큰 평면은 둘 사이 수직이등분선이다.

---

<!-- _class: exercise -->

## 잠깐 풀어보기: 답

### 문제 1
- (a) 수직이등분선 = 원점을 지나고 $(1,1)$ 방향에 수직. 법선 $\mathbf{w} = (1, 1)^\top$, $b = 0$. 마진 정규화 위해 스케일 조정: $y_i(\mathbf{w}^\top\mathbf{x}_i + b) = 1$ 만족시켜야 하므로 $\mathbf{w} = (1/2, 1/2)^\top$, $b=0$. 검증: $1 \cdot ((1/2)(1) + (1/2)(1)) = 1$ ✓
- (b) $\|\mathbf{w}\| = \sqrt{(1/2)^2 + (1/2)^2} = 1/\sqrt{2}$. 마진 $1/\|\mathbf{w}\| = \sqrt{2}$. (두 점 사이 거리 $2\sqrt{2}$의 절반, 일치)

### 문제 2
Dual 변수 $\alpha_i$는 **데이터 1개당 1개**로 도입된 Lagrange 승수이기 때문이다. Primal 변수 $\mathbf{w} \in \mathbb{R}^d$는 stationarity에 의해 $\mathbf{w} = \sum_i \alpha_i y_i \mathbf{x}_i$로 표현되어 소거된다. → $d$가 매우 크고 $n$이 작으면 Dual이 효율적.

---

# D. AI 연결

## D-1. SVM의 역사적 위치

| 시기 | 위치 | 메모 |
|---|---|---|
| 1963 | Vapnik·Lerner, 선형 분류기 초기 | Hard margin 원형 |
| 1992 | Boser·Guyon·Vapnik, Kernel SVM | 비선형 확장 |
| 1995 | Cortes·Vapnik, Soft margin | 현재 표준 형태 |
| 2000s | 텍스트 분류·바이오인포에서 사실상 표준 | 딥러닝 직전 |
| 2010s 이후 | 딥러닝에 자리 일부 양보 | 그러나 소규모 데이터·해석성 영역에서 여전 |

→ SVM은 **"가장 잘 정식화된 분류기"**의 사례. Convex·KKT·Support vector라는 LA·최적화 언어로 완전히 분해된다.

---

## D-2. 텍스트 분류·고차원 응용

텍스트 분류 예: TF-IDF 벡터 $\mathbf{x} \in \mathbb{R}^{50{,}000}$ (단어 5만 종).

- Primal: $\mathbf{w} \in \mathbb{R}^{50{,}000}$. 차원 큼.
- Dual: $\alpha \in \mathbb{R}^n$. 데이터 $n$이 수천이면 훨씬 작다.

→ **고차원·희소 데이터**에서 SVM이 강한 이유: Dual 변수가 $n$에 비례. 또한 텍스트는 **선형 분리가능에 가까운 고차원**이라 SVM 가정이 잘 맞는다.

> 약어: TF-IDF (Term Frequency · Inverse Document Frequency, 단어 빈도와 희소성을 결합한 텍스트 표현).

---

## D-3. SVM과 다른 분류기의 손실함수 한 표

| 분류기 | 손실 함수 | 정규화 |
|---|---|---|
| **SVM (soft)** | Hinge: $\max(0, 1 - z)$ | $\|\mathbf{w}\|^2$ |
| **Logistic regression** | $\log(1 + e^{-z})$ | $\|\mathbf{w}\|^2$ |
| **Perceptron** | $\max(0, -z)$ | 없음 |
| **Squared loss (Ridge)** | $(z - 1)^2$ | $\|\mathbf{w}\|^2$ |

→ $z = y(\mathbf{w}^\top\mathbf{x}+b)$. 모두 **"마진 $z$가 클수록 작은 손실"** 골격. SVM은 $z \ge 1$이면 손실 0인 점이 특징.

---

## D-4. 본 회차 핵심 5개

1. **Hyperplane** $\mathbf{w}^\top\mathbf{x}+b=0$, 점·평면 거리 $|\mathbf{w}^\top\mathbf{x}+b|/\|\mathbf{w}\|$ (Part 1 정사영).
2. **Hard margin SVM**: $\min \tfrac{1}{2}\|\mathbf{w}\|^2$ s.t. $y_i(\mathbf{w}^\top\mathbf{x}_i+b) \ge 1$. Convex QP.
3. **Soft margin·Hinge**: slack $\xi_i$로 위반 허용. $L_{\mathrm{hinge}}(z) = \max(0, 1-z)$ 동치.
4. **Dual SVM**: $\max_{\alpha} \sum\alpha_i - \tfrac{1}{2}\sum\alpha_i\alpha_j y_iy_j \mathbf{x}_i^\top\mathbf{x}_j$, $\sum\alpha_i y_i = 0$. **Inner product만 등장**.
5. **Support vector**: $\alpha_i > 0$인 데이터. $\mathbf{w}^* = \sum \alpha_i y_i \mathbf{x}_i$로 해를 Linear combination 형태로 적는다.

---

## D-5. 자기 점검 질문

- $\mathbf{w}^\top\mathbf{x} + b = 0$이 같은 평면을 표현하는 $(\mathbf{w}, b)$가 여러 개인 이유는?
- Hard margin의 정규화 $y_i(\mathbf{w}^\top\mathbf{x}_i + b) \ge 1$에서 우변 $1$의 의미는?
- Soft margin에서 $C \to \infty$이면 Hard margin과 같은 결과? 그 이유는?
- KKT의 Complementary slackness가 왜 "Support vector가 마진 위에 있다"를 의미하는가?
- Dual에서 데이터는 오직 $\mathbf{x}_i^\top\mathbf{x}_j$로만 등장한다. 이것이 다음 회차 Kernel trick의 출발이 되는 이유는?

---

<!-- _class: exercise -->

# 본 회차 마무리 문제 (즉석 풀이)

본 회차 학습 흐름 (Hyperplane → Margin → Hard/Soft → Dual → Support vector)을 **한 문제**로 종합합니다.

세 점 데이터:
- $\mathbf{x}_1 = (1, 0)^\top, y_1 = +1$
- $\mathbf{x}_2 = (0, 1)^\top, y_2 = +1$
- $\mathbf{x}_3 = (-1, -1)^\top, y_3 = -1$

- **(a)** Hard margin SVM의 정식 최적화 문제를 위 데이터에 대해 적으시오.
- **(b)** 직관적으로 최적 Hyperplane을 그림으로 추정하고 $\mathbf{w}, b$를 (스케일 정규화 후) 적으시오.
- **(c)** (b)에서 어느 점이 Support vector인지 답하시오.
- **(d)** Dual 변수 $\alpha_i$ 중 0이 아닌 것은 몇 개인가? 그 이유는?

---

<!-- _class: exercise -->

## 본 회차 마무리 문제: 답

- **(a)** $\min_{\mathbf{w}, b} \tfrac{1}{2}(w_1^2 + w_2^2)$ s.t.
  - $1 \cdot (w_1 \cdot 1 + w_2 \cdot 0 + b) \ge 1$
  - $1 \cdot (w_1 \cdot 0 + w_2 \cdot 1 + b) \ge 1$
  - $-1 \cdot (w_1 \cdot (-1) + w_2 \cdot (-1) + b) \ge 1$

- **(b)** 대칭에 의해 $w_1 = w_2$. 처음 두 부등식에서 $w_1 + b = 1$ (등식). 셋째에서 $w_1 + w_2 - b = 1 \Rightarrow 2w_1 - b = 1$. 풀이: $w_1 = w_2 = 2/3$, $b = 1/3$.

- **(c)** 세 점 모두 마진 위. 모두 Support vector.

- **(d)** $\alpha_1, \alpha_2, \alpha_3$ 모두 양수. KKT의 $\sum\alpha_i y_i = 0$에서 $\alpha_1 + \alpha_2 - \alpha_3 = 0$, 즉 $\alpha_3 = \alpha_1 + \alpha_2$. 셋 다 0이 아니다.

> **핵심**: $\mathbf{w}^* = \alpha_1 y_1 \mathbf{x}_1 + \alpha_2 y_2 \mathbf{x}_2 + \alpha_3 y_3 \mathbf{x}_3$가 마진 위 점들의 Linear combination이다. 이 식이 본 회차 핵심 결론이다.

---

<!-- _class: exercise -->

## 다음 회차 (Kernel SVM) Review용 숙제

본 회차 마무리 문제의 **유사 문제**입니다.

네 점 데이터: $\mathbf{x}_1 = (2, 0)^\top, y_1 = +1$; $\mathbf{x}_2 = (0, 2)^\top, y_2 = +1$; $\mathbf{x}_3 = (-2, 0)^\top, y_3 = -1$; $\mathbf{x}_4 = (0, -2)^\top, y_4 = -1$.

- (a) Hard margin SVM 정식 (4개 부등식)을 적으시오.
- (b) 대칭으로 최적 Hyperplane을 추정하고 $\mathbf{w}, b$를 답하시오.
- (c) 마진 $1/\|\mathbf{w}\|$의 값은?
- (d) 동그라미 데이터 $\mathbf{x}_1 = (1,1), y_1=+1$; $\mathbf{x}_2 = (-1,1), y_2=-1$; $\mathbf{x}_3 = (-1,-1), y_3=+1$; $\mathbf{x}_4 = (1,-1), y_4=-1$ (XOR 형태). 본 회차 선형 SVM으로 분리 가능한가? 그 이유는?

→ (d)는 **5회차 (Kernel SVM)에서 풀린다**. 본 회차에서는 "선형 SVM의 한계"를 확인하는 것이 숙제의 핵심.

---

## E-1. 과제 안내

`04_과제/Part3/04회차_homework.md` — 마감: 5회차 시작 전

**수학 30점**
- Hyperplane·점·평면 거리 계산, 3문제
- Hard margin SVM 정식·해 직관 추정, 3문제
- Soft margin·Hinge loss 정식·$C$에 따른 해 변화, 2문제
- Dual SVM 유도·KKT 조건 적용, 2문제

**코딩 20점**
- `sklearn.svm.SVC(kernel='linear')`로 2D toy data 학습·결정 경계 시각화
- Soft margin $C$ 값 $0.1, 1, 10$ 비교 시각화
- Support vector 인덱스 확인 (`clf.support_`)

---

## E-2. 다음 회차 (5회차) 예고

**주제**: Kernel SVM · Kernel trick · RBF · Polynomial kernel

**연결**: 본 회차 Dual SVM에서 데이터가 오직 **Inner product $\mathbf{x}_i^\top\mathbf{x}_j$로만 등장**했다. 이 자리를 **다른 유사도 함수** $K(\mathbf{x}_i, \mathbf{x}_j)$로 바꾸면 비선형 분류가 된다. 본 회차 숙제 (d)의 XOR 데이터를 5회차에서 푼다.

**사전 reading**:
- MML §12.4-§12.5 (Kernels)
- Bishop, *PRML* Ch.6.1-6.2 (Kernel methods) — 자율

---

# 부록: MML §12.1-§12.3 추천 연습문제

본 회차에서 다룬 내용을 손으로 더 다루어 보고 싶은 학생을 위한 안내입니다 (모두 자율).

| MML §12 | 주제 | 난도 |
|---|---|:---:|
| Exercise 12.1 | Hyperplane 거리 공식 유도 | 하 |
| Exercise 12.2 | Hard margin primal 정식 자체 유도 | 중 |
| Exercise 12.3 | Hinge loss와 slack 동치 증명 | 중 |
| Exercise 12.4 | Lagrangian stationarity로 $\mathbf{w} = \sum \alpha_i y_i \mathbf{x}_i$ 유도 | 중 |
| Exercise 12.5 | Dual SVM 정식 유도 (KKT) | 상 |

---

<!-- _class: lead -->

# Q & A

본 회차 학습 흐름:
**Hyperplane → Margin → Hard/Soft margin SVM → Hinge loss → Lagrange Dual → Support Vector**

핵심 한 줄: **마진 최대화는 Convex QP로 정식화되고, KKT의 Complementary slackness가 해를 Support vector의 Linear combination으로 만든다.**

다음 회차의 출발 문제:
> Dual SVM의 $\mathbf{x}_i^\top\mathbf{x}_j$를 **다른 유사도 함수**로 바꾸면 어떻게 될까?

`HANDOUT`: 본 PDF
