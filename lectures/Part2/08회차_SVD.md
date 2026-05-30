---
marp: true
theme: default
paginate: true
header: '인공지능 전공자를 위한 선형대수학'
footer: 'Part 2 8회차 · SVD·회전·신축·회전 기하'
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
  .geo { background: #EDE9FE; border-left: 4px solid #7C3AED; padding: 10px 16px; margin: 12px 0;
         font-size: 19px; color: #4C1D95; border-radius: 0 8px 8px 0; }
  .geo strong { color: #6D28D9; }
---

<!-- _class: lead -->
<!-- _paginate: false -->

# Part 2 · 8회차

## SVD(특이값 분해)·회전·신축·회전 기하 해석

MML §4.5 (메인) · **Strang Ch 7.1-7.2 (시그니처 발췌)** · Part 2 (LA2)

**Part 2의 절정**, 그리고 **본 강좌 전체의 시그니처 회차**.

> $A = U\Sigma V^\top$: 모든 행렬을 회전·신축·회전 세 단계로 분해합니다.

---

<!-- _class: exercise -->

# Review: 7회차 마무리 숙제

지난 회차 문제:
> $A = \begin{pmatrix} 25 & 15 & -5 \\ 15 & 18 & 0 \\ -5 & 0 & 11 \end{pmatrix}$의 양정치 판정·Cholesky.

### 답
- Sylvester: $\det A_1 = 25, \det A_2 = 450-225 = 225, \det A_3 = 25(198) - 15(165) + (-5)(75) = 4950 - 2475 - 375 = 2100 > 0$. **양정치**.
- Cholesky 풀이: $L_{11} = 5, L_{21} = 3, L_{31} = -1; L_{22} = 3, L_{32} = 1; L_{33} = 3$.
$L = \begin{pmatrix} 5 & 0 & 0 \\ 3 & 3 & 0 \\ -1 & 1 & 3 \end{pmatrix}$.
- (c) $A$ 대칭 양정치이므로 $A^\top A = A^2$, Eigenvalue가 $\lambda^2$. SVD에서 $\sigma_i = \lambda_i$ (양수).

### 핵심 관찰
대칭 양정치는 SVD와 고유분해가 일치한다. 본 회차는 이 특별 경우를 **모든 직사각·비대칭 행렬**로 일반화한다.

---

## 본 회차 핵심 질문

> ### 정방·직사각·대칭·비대칭 **모든 행렬**에 적용되는 분해가 존재합니까?

이 한 질문에 답하려면 네 단계가 필요합니다.

1. **SVD 정식 정의** $A = U\Sigma V^\top$ ($U, V$ 직교, $\Sigma$ 대각·양 비증가)
2. **존재·유일성**: 모든 $A \in \mathbb{R}^{m\times n}$에 대해 존재
3. **시그니처 기하 해석**: 단위구 → 회전 → 신축 → 회전 (Strang Ch 7.1-7.2)
4. **특이값 ↔ 고유값**: $A^\top A$의 Eigenvalue $\sigma_i^2$

---

## 학습 목표

이번 회차가 끝나면 학생은 다음을 답할 수 있어야 합니다.

1. **SVD 정식 정의**를 정확히 적고, $U, \Sigma, V$의 차원·성질·의미를 구분할 수 있다.
2. **단위구 → 타원체** 매핑을 통한 SVD 기하 해석 (회전·신축·회전 세 단계)을 설명할 수 있다.
3. $\sigma_i^2$ = $A^\top A$의 Eigenvalue, $\sigma_i^2$ = $A A^\top$의 Eigenvalue임을 손계산으로 확인할 수 있다.
4. $2 \times 2$ 또는 $2 \times 3$ 행렬의 SVD를 손으로 분해할 수 있다.
5. **4개 fundamental subspace** (Part 1 7-8회차)와 SVD의 관계 ($V$의 열 ↔ Row space·Null space; $U$의 열 ↔ Column space·Left null space)를 설명할 수 있다.

---

## 본 회차 개념 사슬

| 질문 | 답 (본 회차의 답) | 도구 |
|---|---|---|
| 모든 행렬의 분해? | $A = U\Sigma V^\top$ | SVD |
| 항상 존재? | 그렇다 (직사각도) | 정리 2.4.4 |
| 기하 해석? | 회전·신축·회전 | 단위구 → 타원체 |
| $\sigma_i$의 정체? | $A^\top A$의 Eigenvalue의 양의 제곱근 | 정리 2.4.5 |
| 4 부분공간 연결? | $V$ ↔ Row·Null, $U$ ↔ Col·Left null | 정리 2.4.7 |
| 응용? | 저계수 근사·PCA·이미지 압축 | 9회차 |

---

## 수업 흐름

| 순서 | 블록 | 내용 |
|:---:|:---:|---|
| ① | A | **오프닝**: 7회차 Review, 본 회차 사슬 |
| ② | **B** | **정의·동기**: 모든 행렬에 일반화 → $A = U\Sigma V^\top$ |
| ③ | **C** | **정리·풀이**: $\sigma_i^2$ = $A^\top A$ Eigenvalue, 4 부분공간 |
| ④ | **D** | **시그니처 기하**: 회전·신축·회전 (Strang Ch 7) |
| ⑤ | E | **코딩 실습**: NumPy SVD, 단위구 시각화, 마무리 문제 |

> **D 섹션이 본 회차 시그니처 자산**, 발췌 강도 ▓▓▓▓▓. 가장 깊이 다룹니다.

---

# B. 정의·동기: 모든 행렬의 분해

## B-1. 동기: 고유분해의 한계

지금까지 본 분해들의 한계:
- **대각화 $A = S\Lambda S^{-1}$**: 정방행렬만, 일차독립 Eigenvector 필요 (결함 행렬 불가).
- **직교 대각화 $A = Q\Lambda Q^\top$**: 정방, **대칭만**.
- **Cholesky $A = LL^\top$**: 정방, 대칭, **양정치만**.

→ 직사각 행렬 (예: $1000 \times 784$ MNIST 데이터 행렬)이나 비대칭 행렬에는 적용 불가.

### SVD의 야망
**모든 $A \in \mathbb{R}^{m\times n}$**에 적용되는 분해. 정방·직사각·대칭·비대칭·결함·비결함 무관.

---

## B-2. 정식 정의 (SVD)

### 정의 2.4.1 (Singular Value Decomposition, SVD)
$A \in \mathbb{R}^{m\times n}$에 대해
$$A = U\Sigma V^\top$$
- $U \in \mathbb{R}^{m\times m}$: 직교행렬 ($U^\top U = I_m$)
- $V \in \mathbb{R}^{n\times n}$: 직교행렬 ($V^\top V = I_n$)
- $\Sigma \in \mathbb{R}^{m\times n}$: 대각 비증가 음이 아닌 원소 (`$\Sigma_{ii} = \sigma_i \ge 0$`, $\sigma_1 \ge \sigma_2 \ge \cdots \ge 0$)

여기서 $\sigma_i$를 $A$의 **특이값(singular value)**이라 한다. $U$의 열 $\mathbf{u}_i$를 **좌특이벡터(left singular vector)**, $V$의 열 $\mathbf{v}_i$를 **우특이벡터(right singular vector)**라 한다.

### 표기 관례
- $r = \mathrm{rank}(A)$: 영이 아닌 $\sigma_i$의 개수.
- **Compact SVD** (축소형): $A = U_r \Sigma_r V_r^\top$, $U_r \in \mathbb{R}^{m\times r}, \Sigma_r \in \mathbb{R}^{r\times r}, V_r \in \mathbb{R}^{n\times r}$. 영 부분 절약.

---

## B-3. 정리 2.4.4 (SVD 존재 정리)

### 진술
모든 $A \in \mathbb{R}^{m\times n}$에 대해 SVD $A = U\Sigma V^\top$가 존재한다.

특이값 $\sigma_1 \ge \sigma_2 \ge \cdots \ge \sigma_{\min(m,n)} \ge 0$는 **유일**하다 (행렬에 의해 결정).

좌·우 특이벡터는 $\sigma_i > 0$가 단일 (multiplicity 1)이면 부호를 제외하고 유일.

### 증명 흐름 (요약)
$A^\top A \in \mathbb{R}^{n\times n}$는 **대칭 양반정치** (양정치이거나 양반정치). 정리 2.3.4에 의해 직교 대각화 $A^\top A = V\Lambda V^\top$, $\Lambda = \mathrm{diag}(\lambda_1, \ldots, \lambda_n), \lambda_i \ge 0$.

$\sigma_i = \sqrt{\lambda_i}$ 정의. $\sigma_i > 0$에 대해 $\mathbf{u}_i = A\mathbf{v}_i / \sigma_i$, 나머지는 직교 보완으로 확장. 이 $U, \Sigma, V$가 정의 2.4.1을 만족한다. (상세 증명은 부록에 둔다.)

---

## B-4. $2\times 2$ SVD 손풀이

$A = \begin{pmatrix} 3 & 0 \\ 4 & 5 \end{pmatrix}$.

### Step 1: $A^\top A$
$$A^\top A = \begin{pmatrix} 3 & 4 \\ 0 & 5 \end{pmatrix}\begin{pmatrix} 3 & 0 \\ 4 & 5 \end{pmatrix} = \begin{pmatrix} 25 & 20 \\ 20 & 25 \end{pmatrix}$$

### Step 2: $A^\top A$ Eigenvalue
$p(\lambda) = (25 - \lambda)^2 - 400 = \lambda^2 - 50\lambda + 225 = 0$. $\lambda = 45, 5$. $\sigma_1 = \sqrt{45} = 3\sqrt 5, \sigma_2 = \sqrt 5$.

### Step 3: $V$ (우특이벡터)
- $\lambda = 45$: $\begin{pmatrix} -20 & 20 \\ 20 & -20 \end{pmatrix}\mathbf{v} = \mathbf{0}$ → $\mathbf{v}_1 = \frac{1}{\sqrt 2}(1,1)^\top$.
- $\lambda = 5$: $\mathbf{v}_2 = \frac{1}{\sqrt 2}(1,-1)^\top$ (직교).

### Step 4: $U$ ($\mathbf{u}_i = A\mathbf{v}_i/\sigma_i$)
$A\mathbf{v}_1 = \frac{1}{\sqrt 2}(3, 9)^\top$, $\mathbf{u}_1 = \frac{1}{\sqrt{2}} \cdot \frac{1}{3\sqrt 5}(3, 9)^\top = \frac{1}{\sqrt{10}}(1, 3)^\top$.
$A\mathbf{v}_2 = \frac{1}{\sqrt 2}(3, -1)^\top$, $\mathbf{u}_2 = \frac{1}{\sqrt 2} \cdot \frac{1}{\sqrt 5}(3, -1)^\top = \frac{1}{\sqrt{10}}(3, -1)^\top$.

### 검증
$$U = \frac{1}{\sqrt{10}}\begin{pmatrix} 1 & 3 \\ 3 & -1 \end{pmatrix}, \quad \Sigma = \begin{pmatrix} 3\sqrt 5 & 0 \\ 0 & \sqrt 5 \end{pmatrix}, \quad V = \frac{1}{\sqrt 2}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}$$

$U\Sigma V^\top = A$ ✓.

---

# C. 정리·풀이: $\sigma_i^2$와 4 부분공간

## C-1. 정리 2.4.5 ($\sigma_i^2$와 Eigenvalue)

$A = U\Sigma V^\top$일 때
1. $A^\top A = V\Sigma^\top \Sigma V^\top$의 Eigenvalue는 $\sigma_1^2, \ldots, \sigma_n^2$ ($n - r$개는 0).
2. $A A^\top = U\Sigma\Sigma^\top U^\top$의 Eigenvalue는 $\sigma_1^2, \ldots, \sigma_m^2$ ($m - r$개는 0).

### 풀이 흐름
$A^\top A = V\Sigma^\top U^\top U\Sigma V^\top = V\Sigma^\top \Sigma V^\top$. 우변이 $V$로 직교 대각화된 형태이므로 Eigenvalue는 $\Sigma^\top \Sigma$의 대각, 즉 $\sigma_i^2$.

### 의의
$A^\top A$, $A A^\top$이 **같은 영이 아닌 Eigenvalue** ($\sigma_i^2$)를 공유하는 핵심 사실. PCA·NTK·CCA 등에 반복 등장.

---

## C-2. 정리 2.4.6 (Rank와 영이 아닌 $\sigma_i$)

$$\mathrm{rank}(A) = (\text{영이 아닌 특이값의 개수}) = r$$

### 풀이 흐름
$A = U\Sigma V^\top$, $U, V$ 직교 (가역). $\mathrm{rank}(A) = \mathrm{rank}(\Sigma) = r$ (직교 곱이 rank 보존).

### 의의
**Rank의 정의**(Part 1 7-8회차)가 SVD 한 식에서 즉시 읽힌다. Cholesky·LU와 달리 rank를 직접 노출하는 분해. **수치적 rank**도 작은 $\sigma_i$의 임계값 처리로 정의 가능.

---

## C-3. 정리 2.4.7 (4 fundamental subspaces와 SVD)

Part 1 7-8회차의 4 부분공간이 SVD의 $U, V$에 정확히 대응한다.

### 진술
$A = U\Sigma V^\top$, $r = \mathrm{rank}(A)$일 때
| 부분공간 | 기저 |
|---|---|
| **Column space** $C(A) \subset \mathbb{R}^m$ | $\mathbf{u}_1, \ldots, \mathbf{u}_r$ ($U$의 첫 $r$열) |
| **Left null space** $N(A^\top) \subset \mathbb{R}^m$ | $\mathbf{u}_{r+1}, \ldots, \mathbf{u}_m$ |
| **Row space** $C(A^\top) \subset \mathbb{R}^n$ | $\mathbf{v}_1, \ldots, \mathbf{v}_r$ ($V$의 첫 $r$열) |
| **Null space** $N(A) \subset \mathbb{R}^n$ | $\mathbf{v}_{r+1}, \ldots, \mathbf{v}_n$ |

### 의의
**4 부분공간이 한 SVD 분해에서 정직교 기저로 즉시 추출**된다. Strang이 SVD를 "LA의 최종 정리"라 부르는 이유. **차원정리** $\dim C(A) + \dim N(A) = n$도 자동 (전자 $r$, 후자 $n - r$).

---

## C-4. SVD vs 고유분해 비교

| 항목 | 고유분해 ($A = S\Lambda S^{-1}$) | SVD ($A = U\Sigma V^\top$) |
|---|---|---|
| 적용 | 정방, 비결함 | **모든** $A \in \mathbb{R}^{m\times n}$ |
| 분해의 좌·우 행렬 | $S, S^{-1}$ (가역만, 직교 아님) | $U, V^\top$ (**직교**) |
| 중간 행렬 | $\Lambda$ (실수 또는 복소) | $\Sigma$ (**음이 아닌 실수**) |
| 존재 | 보장 안 됨 | **항상 보장** |
| 대칭 양정치 일치 시 | $\Lambda = $ Eigenvalue | $\Sigma = \Lambda$ |

→ SVD는 **고유분해를 직사각·비대칭으로 확장**한 가장 일반적 분해이다.

---

# D. 시그니처: 회전·신축·회전 기하 (Strang Ch 7.1-7.2)

<div class="strang">

**📚 Strang Ch 7.1-7.2 발췌 (본 회차 시그니처)**: SVD $A = U\Sigma V^\top$를 **세 단계 기하 작용**으로 본다. (1) $V^\top$: 입력 공간의 정직교 기저 ($\mathbf{v}_i$)를 표준 기저로 **회전**. (2) $\Sigma$: 각 축을 $\sigma_i$배로 **신축** (그리고 차원 변환). (3) $U$: 결과를 출력 공간의 정직교 기저 ($\mathbf{u}_i$)로 다시 **회전**. **단위구 → 타원체** 매핑이 이 세 작용의 한 줄 요약이다.

</div>

## D-1. 단위구 → 타원체 (Strang의 그림)

$\mathbb{R}^n$의 단위구 $S^{n-1} = \{\mathbf{x} : \|\mathbf{x}\| = 1\}$를 $A$로 보내면 $\mathbb{R}^m$의 타원체 (또는 차원이 더 낮으면 평면체)가 된다.

### 풀이 흐름
$\mathbf{y} = A\mathbf{x} = U\Sigma V^\top \mathbf{x}$.

- $V^\top \mathbf{x}$: 단위구 → 단위구 ($V^\top$ 직교).
- $\Sigma (V^\top \mathbf{x})$: 각 $i$번째 좌표가 $\sigma_i$배 → **반축이 $\sigma_i$인 타원체**.
- $U(\cdots)$: 타원체 → 타원체 ($U$ 직교, 회전).

→ **타원체의 반축 = $\sigma_i$**, 방향 = $\mathbf{u}_i$ ($U$의 열). 그리고 **타원체의 반축에 대응하는 단위구 위 점 = $\mathbf{v}_i$**.

---

## D-2. $\mathbb{R}^2 \to \mathbb{R}^2$ 시각화 (한 그림으로 4단계)

<div class="geo">

**KaTeX 그림 재구성 (Strang Ch 7.1 Figure)**:

```
   [단위구 R^2]             [V^T 회전 후]             [Σ 신축 후]              [U 회전 후 = AS^1]
        ●                      ●                        ●●                       ╱─ ●
      ●   ●                  ●   ●                   ●●  ●●                    ╱       ╲
     ●  +  ●     ──V^T──>   ●  +  ●    ───Σ────>   ●● ●● ●●   ────U────>     ╱    +    ╲
      ●   ●                  ●   ●                   ●●  ●●                    ╲       ╱
        ●                      ●                        ●●                       ╲─ ●
   v_1, v_2가              e_1, e_2가                 e_1축 σ_1배              σ_1 u_1축
   "특수 축"               표준 축                    e_2축 σ_2배              σ_2 u_2축
```

- **입력 단위구의 두 특수 축** = $\mathbf{v}_1, \mathbf{v}_2$ (우특이벡터)
- **타원체의 두 반축** = $\sigma_1 \mathbf{u}_1, \sigma_2 \mathbf{u}_2$
- 두 축의 일치는 우연이 아니라 SVD가 보장하는 **정직교 기저의 대응**이다.

</div>

---

## D-3. 세 단계의 텍스트 분석

### 단계 1: $V^\top$ (입력 회전)
- 작용: 입력 공간 $\mathbb{R}^n$의 정직교 기저 $\{\mathbf{v}_1, \ldots, \mathbf{v}_n\}$을 표준 기저 $\{\mathbf{e}_1, \ldots, \mathbf{e}_n\}$으로 회전.
- 의미: $A$의 작용에서 **자연스러운 입력 좌표축**이 $\mathbf{v}_i$임을 드러낸다.

### 단계 2: $\Sigma$ (좌표축 신축, 차원 변환)
- 작용: $\mathbb{R}^n \to \mathbb{R}^m$, $i$번째 좌표를 $\sigma_i$배. $i > r$이면 0 (납작).
- 의미: $\sigma_i$가 **$\mathbf{v}_i$ 방향이 $\mathbf{u}_i$ 방향으로 얼마나 늘어나는가**의 신축 배율.

### 단계 3: $U$ (출력 회전)
- 작용: 출력 공간 $\mathbb{R}^m$의 표준 기저를 정직교 기저 $\{\mathbf{u}_1, \ldots, \mathbf{u}_m\}$으로 회전.
- 의미: 출력의 **자연스러운 좌표축**이 $\mathbf{u}_i$임을 드러낸다.

### 종합
$$A\mathbf{v}_i = \sigma_i \mathbf{u}_i$$
이 한 식이 SVD의 본질이다. **$\mathbf{v}_i$를 넣으면 $\sigma_i$배 신축된 $\mathbf{u}_i$가 나온다.** $A$의 작용은 정직교 기저쌍에서는 단순한 신축이다.

---

## D-4. 직사각 행렬의 한 그림 ($m \neq n$)

### $m < n$ (가로로 긴, "납작한" 행렬)
$A: \mathbb{R}^n \to \mathbb{R}^m$. 단위구 ($n-1$차원) → 타원체 ($m$차원, 차원 축소).

- $\sigma_1, \ldots, \sigma_m$ ($m$개의 특이값, 일부 0 가능).
- $\mathbf{v}_{m+1}, \ldots, \mathbf{v}_n$은 **Null space**의 정직교 기저 (D-3 단계 2에서 0으로 잘림).

### $m > n$ (세로로 긴, "키 큰" 행렬)
$A: \mathbb{R}^n \to \mathbb{R}^m$. 단위구 ($n-1$차원) → 타원체 ($n$차원, $\mathbb{R}^m$ 안에 박힘).

- $\sigma_1, \ldots, \sigma_n$ ($n$개의 특이값).
- $\mathbf{u}_{n+1}, \ldots, \mathbf{u}_m$은 **Left null space**의 정직교 기저.

→ 4 부분공간이 한 그림에 등장.

---

## D-5. 회전·신축·회전 분해의 보편성

<div class="analogy">

**직관 (사진 보정 비유)**: 사진 보정 앱에서 **각도 보정 (회전)** → **확대/축소 (신축)** → **출력 프레임 회전**의 세 단계로 어떤 사진도 변환할 수 있습니다. SVD는 이 직관을 행렬·선형변환에 정식화한 정리입니다. 회전·신축은 가장 단순한 두 기본 작용이고, **모든 선형변환이 회전·신축·회전 세 단계로 분해**된다는 사실이 SVD가 일반성을 갖는 이유입니다.

</div>

### 폴라 분해(Polar Decomposition)와의 관계
$A = U\Sigma V^\top = (U V^\top)(V\Sigma V^\top) = Q P$, $Q = UV^\top$ 직교, $P = V\Sigma V^\top$ 대칭 양반정치.

→ **회전 $Q$**, **양반정치 신축 $P$** 두 단계 분해 (폴라 분해). SVD가 폴라 분해의 정식 풀이를 제공한다.

---

## D-6. 응용 미리보기: 4가지 (9회차 정식)

| 응용 | SVD의 사용 |
|---|---|
| **저계수 근사 (Low-rank)** | 작은 $\sigma_i$ 절단 → 가장 가까운 rank-$k$ 행렬 (Eckart-Young) |
| **PCA** | 데이터 행렬의 SVD → 주성분 = $\mathbf{v}_i$, 분산 = $\sigma_i^2$ |
| **이미지 압축** | 이미지 행렬 SVD, 큰 $\sigma_i$ 몇 개만 보관 |
| **LoRA** | 가중치 갱신을 rank-$k$ ($k = 8, 16$)로 강제, $\sigma_i$만 학습 |

→ 9회차에서 정식화. 본 회차에서는 SVD가 이 모든 응용의 토대임을 확인하는 데 그친다.

---

<!-- _class: exercise -->

# 잠깐 풀어보기: SVD 손풀이

### 문제 1 (직사각 SVD)
$A = \begin{pmatrix} 1 & 0 & 0 \\ 0 & 0 & 1 \end{pmatrix}$의 SVD를 구하시오 (특이값·$U$·$V$).

### 문제 2 (기하 해석)
$A = \begin{pmatrix} 2 & 0 \\ 0 & 1 \end{pmatrix}$가 단위구 $\{(x,y) : x^2+y^2=1\}$를 어떤 모양으로 보내는가? 타원체의 반축은?

### 문제 3 (특이값과 norm)
$\|A\|_2$ (행렬의 spectral norm) = $\sigma_1$ (최대 특이값)임을 정의·진술 차원에서 설명하시오.

> **힌트 1**: $A$가 이미 신축, 좌표 선택 형태. $U = I_2, V = I_3$의 일부, $\Sigma = ?$.

---

<!-- _class: exercise -->

## 잠깐 풀어보기: 답

### 문제 1
$A$의 두 행이 단위벡터이고 서로 직교. 직접 보면 $\sigma_1 = \sigma_2 = 1$, $U = I_2$, $V = (\mathbf{e}_1, \mathbf{e}_3, \mathbf{e}_2)$ (열 순서). $\Sigma = \begin{pmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \end{pmatrix}$.

검증: $A^\top A = \mathrm{diag}(1, 0, 1)$. Eigenvalue 1, 1, 0. $\sigma_1 = \sigma_2 = 1$ ✓.

### 문제 2
$A$ 자체가 이미 $\Sigma$ 형태 ($U = V = I$). $\sigma_1 = 2, \sigma_2 = 1$. 단위구 → 반축 $(2, 1)$의 **타원** ($x_1$방향 2배, $x_2$방향 1배). 가장 긴 반축이 $\mathbf{u}_1 = \mathbf{e}_1$.

### 문제 3
$\|A\|_2 = \max_{\|\mathbf{x}\| = 1} \|A\mathbf{x}\|$. SVD에서 $\|A\mathbf{x}\| = \|U\Sigma V^\top \mathbf{x}\| = \|\Sigma V^\top \mathbf{x}\|$ ($U$ 직교). $V^\top \mathbf{x}$도 단위벡터, $\Sigma \mathbf{y}$의 최대 norm = $\sigma_1$ ($\mathbf{y} = \mathbf{e}_1$). 따라서 $\|A\|_2 = \sigma_1$.

> **메시지**: SVD가 가장 큰 신축 배율 = 가장 큰 특이값임을 직접 말해 준다. 이것이 행렬 norm·조건수의 정의에 핵심.

---

# E. 코딩 실습: NumPy SVD, 시각화

## E-1. NumPy SVD

```python
import numpy as np

A = np.array([[3, 0], [4, 5]], dtype=float)

U, sigma, Vt = np.linalg.svd(A)
# U, Vt는 행렬, sigma는 1D 배열

print("U =\n", U)
print("sigma =", sigma)
print("V^T =\n", Vt)

# 재구성
Sigma = np.diag(sigma)
assert np.allclose(U @ Sigma @ Vt, A)
```

`Vt` = $V^\top$ (NumPy는 전치를 반환). 재구성 시 주의.

### 직사각 처리
```python
A = np.random.randn(3, 5)
U, sigma, Vt = np.linalg.svd(A)
# U: 3x3, sigma: (3,), Vt: 5x5

# full vs compact
U2, sigma2, Vt2 = np.linalg.svd(A, full_matrices=False)
# U2: 3x3, sigma2: (3,), Vt2: 3x5 (compact)

Sigma2 = np.diag(sigma2)
assert np.allclose(U2 @ Sigma2 @ Vt2, A)
```

`full_matrices=False`로 compact SVD. 큰 데이터에서 메모리 절약.

---

## E-2. 단위구 → 타원체 시각화

```python
import matplotlib.pyplot as plt

A = np.array([[3, 0], [4, 5]], dtype=float)

theta = np.linspace(0, 2*np.pi, 200)
circle = np.array([np.cos(theta), np.sin(theta)])  # 2 x 200

ellipse = A @ circle  # 2 x 200

fig, ax = plt.subplots(1, 2, figsize=(10, 5))
ax[0].plot(circle[0], circle[1])
ax[0].set_title("단위구"); ax[0].set_aspect('equal')
ax[1].plot(ellipse[0], ellipse[1])
ax[1].set_title("A로 사상된 타원체"); ax[1].set_aspect('equal')

# 반축 (sigma_i u_i)을 그려보기
U, sigma, Vt = np.linalg.svd(A)
for i in range(2):
    axis = sigma[i] * U[:, i]
    ax[1].plot([0, axis[0]], [0, axis[1]], 'r-', linewidth=2)
plt.show()
```

빨간 선이 타원체의 반축, 길이 = $\sigma_i$, 방향 = $\mathbf{u}_i$. **눈으로 본다.**

---

## E-3. $A^\top A$와 $\sigma_i^2$ 일치 검증

```python
A = np.random.randn(5, 3)

U, sigma, Vt = np.linalg.svd(A)
ATA_eigs = np.linalg.eigvalsh(A.T @ A)
ATA_eigs = np.sort(ATA_eigs)[::-1]  # 내림차순

print("sigma^2:", sigma**2)
print("A^T A eigs:", ATA_eigs)
assert np.allclose(sigma**2, ATA_eigs)

# A A^T도 동일 nonzero
AAT_eigs = np.sort(np.linalg.eigvalsh(A @ A.T))[::-1]
print("A A^T eigs:", AAT_eigs)
# 처음 3개가 sigma^2, 나머지 2개는 0
```

정리 2.4.5를 NumPy 한 줄로 확인.

---

## E-4. 본 회차 핵심 5개

1. **SVD 정식**: $A = U\Sigma V^\top$, $U \in \mathbb{R}^{m\times m}, V \in \mathbb{R}^{n\times n}$ 직교, $\Sigma$ 대각·비증가 음 아닌.
2. **존재 보장**: 모든 $A \in \mathbb{R}^{m\times n}$에 SVD가 존재. **고유분해의 일반화**.
3. **$\sigma_i^2 = $** $A^\top A$ (또는 $AA^\top$)의 Eigenvalue. $\mathrm{rank}(A) = $ 영이 아닌 $\sigma_i$의 개수.
4. **시그니처 기하**: $A = $ 회전 $V^\top$ → 신축 $\Sigma$ → 회전 $U$. 단위구 → 타원체. $A\mathbf{v}_i = \sigma_i \mathbf{u}_i$.
5. **4 fundamental subspaces**가 $U, V$의 첫 $r$ / 마지막 $m-r, n-r$ 열에 정직교 기저로 나타남. **차원정리**가 SVD에서 자동.

---

## E-5. 자기 점검 질문

- 대칭 양정치 $A$에서 SVD와 고유분해는 어떻게 일치하는가?
- 직교행렬 $Q$의 SVD는? (힌트: $Q = Q \cdot I \cdot I^\top$, 모든 $\sigma_i = 1$.)
- $A$와 $cA$ ($c > 0$)의 SVD 관계?
- $A$의 SVD에서 $\mathbf{u}_1, \mathbf{v}_1$의 부호를 모두 뒤집어도 분해가 성립하는가?
- 특이값이 모두 같은 행렬은 어떤 모양인가? (단위구 → 단위구의 $\sigma$배, 즉 균등 신축.)

---

<!-- _class: exercise -->

# 본 회차 마무리 문제 (즉석 풀이)

본 회차 사슬 (SVD 정의 → $\sigma_i^2$ → 4 부분공간 → 기하)을 한 문제로 종합합니다.

$A = \begin{pmatrix} 1 & 1 \\ 0 & 1 \\ 1 & 0 \end{pmatrix}$가 주어졌다 ($3 \times 2$).

- **(a)** $A^\top A$를 계산하고 Eigenvalue를 구하시오.
- **(b)** $\sigma_1, \sigma_2$를 구하시오 (내림차순). $\mathrm{rank}(A) = ?$
- **(c)** 우특이벡터 $\mathbf{v}_1, \mathbf{v}_2$를 구하시오 ($\mathbb{R}^2$의 정직교 기저).
- **(d)** 좌특이벡터 $\mathbf{u}_i = A\mathbf{v}_i/\sigma_i$ ($i = 1, 2$)를 구하시오. (세 번째 $\mathbf{u}_3$는 Left null space, 구할 필요 없음.)
- **(e)** **기하 해석**: $A$가 단위원 $S^1 \subset \mathbb{R}^2$를 $\mathbb{R}^3$의 어떤 모양으로 보내는가? 타원의 반축은?

---

<!-- _class: exercise -->

## 본 회차 마무리 문제: 답

- **(a)** $A^\top A = \begin{pmatrix} 1 & 1 & 0 \\ 1 & 0 & 1 \end{pmatrix}^\top \cdot \begin{pmatrix} 1 & 1 \\ 0 & 1 \\ 1 & 0 \end{pmatrix} = \begin{pmatrix} 2 & 1 \\ 1 & 2 \end{pmatrix}$. Eigenvalue: $\lambda = 1, 3$.

- **(b)** $\sigma_1 = \sqrt 3, \sigma_2 = 1$. $\mathrm{rank}(A) = 2$ (둘 다 양수).

- **(c)** $\lambda = 3$: $\mathbf{v}_1 = \frac{1}{\sqrt 2}(1, 1)^\top$. $\lambda = 1$: $\mathbf{v}_2 = \frac{1}{\sqrt 2}(1, -1)^\top$.

- **(d)** $A\mathbf{v}_1 = \frac{1}{\sqrt 2}(2, 1, 1)^\top$. $\mathbf{u}_1 = \frac{1}{\sqrt 3 \cdot \sqrt 2}(2, 1, 1)^\top = \frac{1}{\sqrt 6}(2, 1, 1)^\top$. $A\mathbf{v}_2 = \frac{1}{\sqrt 2}(0, -1, 1)^\top$. $\mathbf{u}_2 = \frac{1}{\sqrt 2}(0, -1, 1)^\top$. $\mathbf{u}_1, \mathbf{u}_2$ 직교 확인 가능.

- **(e)** $A$는 $\mathbb{R}^2$의 단위원을 $\mathbb{R}^3$의 **타원**으로 보낸다 (2D 모양이 3D 안에 박힘). 반축: $\sigma_1 \mathbf{u}_1$ (길이 $\sqrt 3$, 방향 $(2,1,1)/\sqrt 6$), $\sigma_2 \mathbf{u}_2$ (길이 1, 방향 $(0,-1,1)/\sqrt 2$).

> **핵심**: $3 \times 2$ 행렬은 평면을 $\mathbb{R}^3$에 박힌 타원으로 보낸다. SVD가 그 타원의 반축·방향을 한 식에 풀어 준다. 다음 회차는 이 SVD에서 작은 $\sigma_i$를 절단해 **저계수 근사**를 만든다.

---

<!-- _class: exercise -->

## 다음 회차 Review용 숙제

위 마무리 문제의 유사 문제이다. 강의 후 풀어 와서 **9회차 Review 시간**에 비교한다.

$A = \begin{pmatrix} 2 & 0 \\ 0 & 3 \\ 0 & 0 \end{pmatrix}$가 주어졌다.

- (a) $A^\top A, A A^\top$의 Eigenvalue.
- (b) $\sigma_1, \sigma_2$ (내림차순), $\mathrm{rank}(A)$.
- (c) $U, \Sigma, V$를 모두 적으시오.
- (d) **저계수 근사 미리보기**: $A$를 $\sigma_2$를 0으로 절단한 **rank-1 근사** $\tilde A$를 계산하시오. $\|A - \tilde A\|_F^2 = ?$ (Frobenius 노름 제곱.)

### 자기 점검
- (d)에서 $\|A - \tilde A\|_F^2 = \sigma_2^2 = 9$가 나와야 한다. 이것이 **Eckart-Young 정리**의 가장 단순한 사례이며 9회차의 주제이다.

---

## E-6. 과제 안내

`04_과제/Part2/08회차_homework.md`, 마감: 9회차 시작 전

**수학 30점**
- $2\times 2, 3\times 2, 2\times 3$ SVD 손풀이, 5문제
- $\sigma_i^2$ = $A^\top A$ Eigenvalue 일치 직접 검증, 3문제
- 4 fundamental subspace 기저 추출, 3문제
- spectral norm $\|A\|_2 = \sigma_1$ 검증, 2문제

**코딩 20점**
- NumPy `svd`로 분해·재구성, $A^\top A$ Eigenvalue 일치 확인
- 단위구 → 타원체 시각화 ($\mathbb{R}^2$, $\mathbb{R}^3$)
- 직사각 행렬 compact vs full SVD 메모리 비교
- **보너스**: 회전 행렬·반사 행렬 SVD 직접 풀이 (모든 $\sigma_i = 1$)

---

## E-7. 다음 회차 (9회차) 예고

**주제**: Eckart-Young 정리·저계수 근사·Linear transformation·PCA 도입

**연결**: 본 회차에서 본 SVD $A = U\Sigma V^\top$의 큰 $\sigma_i$ 몇 개만 남기면 **가장 가까운 rank-$k$ 근사**가 된다 (Eckart-Young 정리, 본문 진술까지·증명 부록). 이미지 압축·LoRA·PCA가 모두 이 한 정리로 통합된다. 9회차는 또한 Part 4 PCA의 직접적 도입 한 슬라이드를 포함한다.

**사전 reading**:
- MML §4.6 (Matrix Approximation)
- Strang Ch 7.3-7.4 (Principal Components·Geometry of the SVD)

---

# 부록: SVD 존재 증명 (자율)

**본 회차 본문은 진술까지**. 증명은 부록.

### 증명 골자
1. $A^\top A$는 대칭 양반정치. Spectral theorem에 의해 직교 대각화 $A^\top A = V\Lambda V^\top$, $\Lambda = \mathrm{diag}(\lambda_1, \ldots, \lambda_n)$, $\lambda_1 \ge \cdots \ge \lambda_n \ge 0$.
2. $\sigma_i = \sqrt{\lambda_i}$ 정의. $\sigma_i > 0$인 $i \le r$에 대해 $\mathbf{u}_i = A\mathbf{v}_i / \sigma_i$.
3. $\mathbf{u}_i$의 정직교성: $\mathbf{u}_i^\top \mathbf{u}_j = \frac{1}{\sigma_i \sigma_j} \mathbf{v}_i^\top A^\top A \mathbf{v}_j = \frac{\lambda_j}{\sigma_i \sigma_j}\mathbf{v}_i^\top \mathbf{v}_j$. $i = j$이면 $\sigma_i^2/\sigma_i^2 = 1$. $i \neq j$이면 $\mathbf{v}_i^\top \mathbf{v}_j = 0$.
4. $\mathbf{u}_{r+1}, \ldots, \mathbf{u}_m$을 Gram-Schmidt로 임의의 정직교 보완.
5. $A = U\Sigma V^\top$ 직접 검증 (열별로). ∎

# 부록: 추천 연습문제

| 출처 | 주제 | 난도 |
|---|---|:---:|
| Strang Ch 7.1 Problem 1-5 | $2\times 2$ SVD 손풀이 | 중 |
| Strang Ch 7.2 Problem 7-10 | 단위구 → 타원체 기하 | 중 |
| MML §4.5 Exercise 4.17-4.19 | SVD 정의·존재 | 중 |
| Strang Ch 7.1 Problem 13-15 | 4 부분공간 SVD 연결 | 상 |
| Strang Ch 7.2 Problem 19-22 | 폴라 분해·spectral norm | 상 |

---

<!-- _class: lead -->

# Q & A

본 회차 사슬:
**SVD 정식 $A = U\Sigma V^\top$ → $\sigma_i^2$ = $A^\top A$ Eigenvalue → 회전·신축·회전 기하 → 4 부분공간**

핵심 한 줄: **모든 행렬은 회전·신축·회전 세 단계로 분해되며, $\sigma_1$이 최대 신축 배율·$\mathbf{v}_1$이 최대 신축이 일어나는 방향이다.**

다음 회차의 출발 문제:
> 큰 $\sigma_i$ 몇 개만 남기면 가장 가까운 rank-$k$ 행렬이 얻어지는가? (Eckart-Young)

`HANDOUT`: 본 PDF, `Part2_08_SVD_시각화.ipynb`
