---
marp: true
theme: default
paginate: true
header: '인공지능 전공자를 위한 선형대수학'
footer: 'Part 2 9회차 · Eckart-Young·Low-rank·PCA 도입·Part 2 종합 Review'
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

# Part 2 · 9회차: **Part 2 (선형대수 2) 마무리 회차**

## Eckart-Young·저계수 근사·Linear transformation·PCA 도입 + Part 2 (선형대수 2) 종합 문제 Review

MML §4.6·§2.7·§2.8, Ch 10 도입 · **Strang Ch 7.3-7.4 (발췌, 증명 부록)** · Part 2 (LA2)

**Part 2 (선형대수 2) 마무리**, SVD를 응용·기저변환·PCA로 통합하고 Part 2 1-8회차 종합 문제를 함께 Review합니다.

> 큰 $\sigma_i$ 몇 개만 남기면 가장 가까운 저계수 행렬, 이것이 압축·LoRA·PCA 모두입니다.

---

<!-- _class: exercise -->

# Review: 8회차 마무리 숙제

지난 회차 문제:
> $A = \begin{pmatrix} 2 & 0 \\ 0 & 3 \\ 0 & 0 \end{pmatrix}$의 SVD와 rank-1 근사.

### 답
- $A^\top A = \mathrm{diag}(4, 9)$, $A A^\top = \mathrm{diag}(4, 9, 0)$. 공통 nonzero Eigenvalue: $4, 9$.
- $\sigma_1 = 3, \sigma_2 = 2$ (내림차순), $\mathrm{rank}(A) = 2$.
- $U = I_3$, $\Sigma = \begin{pmatrix} 3 & 0 \\ 0 & 2 \\ 0 & 0 \end{pmatrix}$, $V = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}$ (열 순서 주의: $\sigma$가 내림차순이므로 $\lambda = 9 \to \mathbf{v}_1 = \mathbf{e}_2$).
- rank-1 근사: $\tilde A = \sigma_1 \mathbf{u}_1 \mathbf{v}_1^\top = 3 \cdot \mathbf{e}_2 \mathbf{e}_2^\top \cdot \begin{pmatrix} \cdot \\ \cdot \end{pmatrix}$, 풀이하면 $\tilde A = \begin{pmatrix} 0 & 0 \\ 0 & 3 \\ 0 & 0 \end{pmatrix}$. $\|A - \tilde A\|_F^2 = 4 = \sigma_2^2$ ✓.

### 핵심 관찰
$\|A - \tilde A\|_F^2 = \sigma_2^2$가 우연이 아니라 **Eckart-Young 정리**의 직접적 귀결이다. 본 회차의 주제.

---

## 본 회차 핵심 질문

> ### 큰 $\sigma_i$ 몇 개만 남긴 SVD 부분합이 **가장 가까운 rank-$k$ 행렬**입니까?

이 한 질문에 답하려면 네 단계가 필요합니다.

1. **SVD 외적 합 표현** $A = \sum_{i=1}^r \sigma_i \mathbf{u}_i \mathbf{v}_i^\top$
2. **Eckart-Young 정리**: 진술, 한 줄 풀이 (증명은 부록)
3. **Linear transformation·기저변환·좌표변환**: 행렬의 추상 해석
4. **PCA 도입** (Part 4 2회차 본격): 데이터의 SVD = 주성분 분석

---

## 학습 목표

이번 회차가 끝나면 학생은 다음을 답할 수 있어야 합니다.

1. SVD를 **외적의 합** $A = \sum \sigma_i \mathbf{u}_i \mathbf{v}_i^\top$로 적고, 부분합 $A_k = \sum_{i=1}^k \sigma_i \mathbf{u}_i \mathbf{v}_i^\top$의 rank가 $k$임을 보일 수 있다.
2. **Eckart-Young 정리**(Frobenius·spectral norm 둘 다)를 정확히 진술하고, $\|A - A_k\|_F^2 = \sum_{i>k} \sigma_i^2$를 적용할 수 있다.
3. **Linear transformation** $T: V \to W$의 정식 정의와 행렬 표현, **기저변환 행렬** $P$의 의미를 설명할 수 있다.
4. **PCA의 SVD 풀이**: 데이터 행렬 $X$ (행 = 표본)를 평균 중심화 후 SVD하면 $V$의 열이 주성분, $\sigma_i^2/(n-1)$이 분산.
5. **이미지 압축·LoRA·LSA** 세 응용 모두 Eckart-Young의 직접적 응용임을 설명할 수 있다.

---

## 본 회차 개념 사슬

| 질문 | 답 (본 회차의 답) | 도구 |
|---|---|---|
| SVD의 외적 표현? | $A = \sum \sigma_i \mathbf{u}_i \mathbf{v}_i^\top$ | rank-1 합 |
| 가장 가까운 rank-$k$? | $A_k = \sum_{i=1}^k$ | Eckart-Young |
| 오차의 크기? | $\sum_{i>k} \sigma_i^2$ | Frobenius |
| 추상 행렬은? | Linear transformation | $T: V \to W$ |
| 좌표 바꾸기? | 기저변환 행렬 $P$ | 닮음 |
| PCA의 본질? | 평균 중심화, SVD | Part 4 도입 |

---

## 수업 흐름

| 순서 | 블록 | 내용 |
|:---:|:---:|---|
| ① | A | **오프닝**: 8회차 Review, 본 회차 사슬 |
| ② | **B** | **정의·동기**: SVD 외적 표현 → 저계수 근사 |
| ③ | **C** | **정리·풀이**: Eckart-Young 진술, 직관 풀이, Linear transformation |
| ④ | **D** | **응용**: PCA 도입·이미지 압축·LoRA |
| ⑤ | E | **Part 2 (선형대수 2) 마무리, 9회차 마무리 문제·Part 2 종합 Review** |

---

# B. 정의·동기: SVD 외적 표현 → 저계수 근사

## B-1. SVD를 외적의 합으로

$A = U\Sigma V^\top$에서 행렬 곱을 풀어 쓰면

$$A = \sum_{i=1}^r \sigma_i \mathbf{u}_i \mathbf{v}_i^\top$$

각 $\sigma_i \mathbf{u}_i \mathbf{v}_i^\top$는 **rank-1 행렬**이다 ($m\times 1$ 곱하기 $1\times n$). 따라서 SVD = **rank-1 행렬 $r$개의 합**.

### 부분합
$$A_k = \sum_{i=1}^k \sigma_i \mathbf{u}_i \mathbf{v}_i^\top, \quad k \le r$$
는 rank-$k$ 행렬이다. 처음 $k$개 큰 특이값만 남긴 **SVD 절단(truncated SVD)**.

### 의의
$A$가 큰 $\sigma_i$ 몇 개에 "에너지"가 집중되어 있다면, $A_k$는 적은 저장 공간으로 $A$를 잘 근사한다. 저장: 원본 $mn$ vs 절단 $k(m + n + 1)$.

---

## B-2. Frobenius 노름과 Spectral 노름

### 정의 2.5.1 (Frobenius 노름)
$$\|A\|_F = \sqrt{\sum_{i,j} A_{ij}^2} = \sqrt{\sum_{i=1}^r \sigma_i^2}$$

두 번째 등식: $\|A\|_F^2 = \mathrm{tr}(A^\top A) = \mathrm{tr}(V\Sigma^\top \Sigma V^\top) = \mathrm{tr}(\Sigma^\top \Sigma) = \sum \sigma_i^2$.

### 정의 2.5.2 (Spectral 노름)
$$\|A\|_2 = \max_{\|\mathbf{x}\| = 1}\|A\mathbf{x}\| = \sigma_1$$

(8회차 잠깐 풀어보기 문제 3에서 확인.)

### 의미
- Frobenius = 모든 원소를 한 벡터로 본 Euclidean 노름.
- Spectral = 최대 신축 배율.

---

## B-3. 동기: 데이터의 저계수성

실세계 데이터 행렬 $X \in \mathbb{R}^{n\times d}$는 흔히 **저계수 또는 거의 저계수**:
- 이미지: 픽셀 자기상관 → 인접 픽셀 비슷, 실질 정보가 적은 차원
- 영화 평점 (Netflix): 사용자×영화 행렬, 취향 잠재 차원 적음
- 단어 공출현 (LSA): 문서×단어 행렬, 토픽 잠재 차원 적음

→ **저계수 근사**가 자연스러운 압축·잡음 제거 도구.

<div class="analogy">

**직관 (해상도 조절 비유)**: 4K 사진을 720p로 줄여도 사람 얼굴은 인식됩니다. 줄인 만큼 디스크·전송 비용이 절감됩니다. SVD 저계수 근사는 **데이터의 해상도를 수학적으로 정확히 조절하는 도구**입니다. 큰 $\sigma_i$ = 본질적 정보, 작은 $\sigma_i$ = 자잘한 디테일·잡음. **몇 개만 남길지가 압축률을 결정**합니다.

</div>

---

# C. 정리·풀이: Eckart-Young, Linear transformation

## C-1. 정리 2.5.3 (Eckart-Young 정리)

### 진술
$A \in \mathbb{R}^{m\times n}$의 SVD를 $A = \sum_{i=1}^r \sigma_i \mathbf{u}_i \mathbf{v}_i^\top$ ($r = \mathrm{rank}(A)$)이라 하자. 임의의 $k \le r$에 대해
$$A_k = \sum_{i=1}^k \sigma_i \mathbf{u}_i \mathbf{v}_i^\top$$
는 다음을 만족한다.

(i) **Frobenius**: 모든 rank-$k$ 이하 $B$에 대해
$$\|A - A_k\|_F \le \|A - B\|_F$$
등호는 $B = A_k$일 때만. 그리고
$$\|A - A_k\|_F^2 = \sum_{i=k+1}^r \sigma_i^2$$

(ii) **Spectral**: 모든 rank-$k$ 이하 $B$에 대해
$$\|A - A_k\|_2 \le \|A - B\|_2$$
등호는 $B = A_k$일 때. $\|A - A_k\|_2 = \sigma_{k+1}$.

### 본 회차 처리
**본문은 진술·예제·직관 풀이**까지. 엄격 증명은 부록에 둔다 (마스터 계획서 §0.4·§0.5).

---

## C-2. 직관 한 줄 풀이 (Frobenius 경우)

$B$가 rank-$k$ 이하라 하자. $B$의 SVD를 $B = \sum_{i=1}^k \tau_i \tilde{\mathbf{u}}_i \tilde{\mathbf{v}}_i^\top$로 두면 (필요 시 $\tau_i = 0$ 추가).

$\|A - B\|_F^2 = \|A\|_F^2 - 2\langle A, B\rangle_F + \|B\|_F^2$ ($\langle \cdot,\cdot\rangle_F$ = 원소별 내적).

$\langle A, B\rangle_F$를 SVD로 풀면 두 분해의 특이벡터가 일치할 때 최대화. **최대화는 $B$가 $A_k$일 때**, 따라서 거리 제곱은 그때 최소.

남은 부분: $\|A - A_k\|_F^2 = \|A\|_F^2 - \|A_k\|_F^2 = \sum_i \sigma_i^2 - \sum_{i\le k}\sigma_i^2 = \sum_{i>k}\sigma_i^2$. ∎ (직관 풀이, 엄격 증명은 부록.)

<div class="strang">

**📚 Strang Ch 7.3 발췌**: Strang은 Eckart-Young을 "**SVD의 마지막 정리**"라 부릅니다. 모든 행렬의 가장 정확한 저계수 근사가 SVD 절단으로 자동 얻어집니다. 이미지 압축의 JPEG·MP3, 추천 시스템, LoRA, PCA, eigenfaces, LSA 모두 본 정리 한 줄에서 비롯됩니다.

</div>

---

## C-3. 예제: $3 \times 3$ rank-1 근사

$A = \begin{pmatrix} 4 & 0 & 0 \\ 0 & 3 & 0 \\ 0 & 0 & 2 \end{pmatrix}$. SVD 자명: $U = V = I, \sigma_1 = 4, \sigma_2 = 3, \sigma_3 = 2$.

### rank-1 근사
$$A_1 = 4 \mathbf{e}_1 \mathbf{e}_1^\top = \begin{pmatrix} 4 & 0 & 0 \\ 0 & 0 & 0 \\ 0 & 0 & 0 \end{pmatrix}$$
$\|A - A_1\|_F^2 = 3^2 + 2^2 = 13 = \sigma_2^2 + \sigma_3^2$ ✓.
$\|A - A_1\|_2 = 3 = \sigma_2$ ✓.

### rank-2 근사
$A_2 = \mathrm{diag}(4, 3, 0)$. $\|A - A_2\|_F^2 = 4 = \sigma_3^2$ ✓.

→ 한 줄 정리가 손계산에서 즉시 검증된다.

---

## C-4. 정의 2.5.4 (Linear transformation)

### 정의
$V, W$를 vector space라 할 때 함수 $T: V \to W$가 모든 $\mathbf{u}, \mathbf{v} \in V$와 모든 $\alpha \in \mathbb{R}$에 대해
$$T(\mathbf{u} + \mathbf{v}) = T(\mathbf{u}) + T(\mathbf{v}), \quad T(\alpha \mathbf{u}) = \alpha T(\mathbf{u})$$
를 만족하면 **Linear transformation(선형변환)**이라 한다.

### 행렬과의 관계
$V = \mathbb{R}^n, W = \mathbb{R}^m$이면 $T$는 어떤 행렬 $A \in \mathbb{R}^{m\times n}$에 대해 $T(\mathbf{x}) = A\mathbf{x}$로 표현된다. 즉 **유한차원 vector space의 Linear transformation = 행렬**.

### 의의
**행렬과 Linear transformation은 같은 것**의 두 표기. Part 1·Part 2의 모든 행렬 결과가 Linear transformation의 결과로 재해석된다.

---

## C-5. 기저변환과 닮음 (Change of basis)

### 표현행렬
같은 Linear transformation $T$도 기저 선택에 따라 다른 행렬로 표현된다. 표준 기저에서 $A$, 새 기저 $\{\mathbf{p}_1, \ldots, \mathbf{p}_n\}$에서 $\tilde A$.

$P = [\mathbf{p}_1\ \cdots\ \mathbf{p}_n]$ (기저변환 행렬)일 때
$$\tilde A = P^{-1} A P$$

즉 **새 기저 표현 = 닮음 변환**.

### Eigenvector 기저
$A = S\Lambda S^{-1}$에서 $S$를 기저변환 행렬로 보면 $\Lambda$는 **Eigenvector 기저에서의 표현행렬**. 그래서 대각이 된다 (6회차의 좌표 정렬 직관).

### SVD의 기저변환
$A = U\Sigma V^\top$에서
- $V$: 입력 공간 $\mathbb{R}^n$의 **우특이벡터 기저** 선택.
- $U$: 출력 공간 $\mathbb{R}^m$의 **좌특이벡터 기저** 선택.
- $\Sigma$: 두 기저에서의 표현행렬, 대각이 된다.

→ SVD = **입·출력 공간에 가장 자연스러운 두 정직교 기저를 골라 만든 대각 표현행렬**.

---

## C-6. 정의 2.5.5 (Affine transformation)

### 정의
$T(\mathbf{x}) = A\mathbf{x} + \mathbf{b}$ 형태 (Linear, 평행이동).

### 의의
신경망 한 층의 $\mathbf{y} = W\mathbf{x} + \mathbf{b}$가 곧 Affine transformation이다. **선형, 평행이동**의 합성이 신경망의 한 기본 연산.

→ Linear transformation의 결과 (행렬 합성·역행렬·rank 분석)가 그대로 신경망 분석에 사용된다.

---

<!-- _class: exercise -->

# 잠깐 풀어보기: Eckart-Young, Linear transformation

### 문제 1 (Eckart-Young 적용)
$A$의 특이값이 $\sigma = (10, 7, 5, 2, 0.5, 0.1)$. rank-3 근사의 Frobenius 오차 제곱과 Spectral 오차를 구하시오.

### 문제 2 (Linear transformation 판정)
다음 중 Linear transformation인 것은? (i) $T(\mathbf{x}) = 2\mathbf{x}$, (ii) $T(\mathbf{x}) = \mathbf{x} + (1, 0)^\top$, (iii) $T(\mathbf{x}) = \|\mathbf{x}\| \mathbf{x}$, (iv) $T(x, y) = (y, -x)$.

### 문제 3 (기저변환)
표준 기저에서 $A = \begin{pmatrix} 3 & 0 \\ 0 & 1 \end{pmatrix}$. 기저변환 행렬 $P = \begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}$로 $\tilde A = P^{-1}AP$를 계산하시오.

---

<!-- _class: exercise -->

## 잠깐 풀어보기: 답

### 문제 1
- Frobenius: $\|A - A_3\|_F^2 = \sigma_4^2 + \sigma_5^2 + \sigma_6^2 = 4 + 0.25 + 0.01 = 4.26$.
- Spectral: $\|A - A_3\|_2 = \sigma_4 = 2$.

### 문제 2
- (i) Linear ✓ ($T(\mathbf{u}+\mathbf{v}) = 2(\mathbf{u}+\mathbf{v}) = T(\mathbf{u})+T(\mathbf{v})$).
- (ii) X (Affine, 영벡터를 영벡터로 보내지 않음).
- (iii) X ($T(\alpha \mathbf{x}) = |\alpha|\,\alpha\, \|\mathbf{x}\|\mathbf{x} \neq \alpha T(\mathbf{x})$ 일반).
- (iv) Linear ✓ (행렬 $\begin{pmatrix} 0 & 1 \\ -1 & 0 \end{pmatrix}$ 곱).

### 문제 3
$P^{-1} = \frac{1}{-2}\begin{pmatrix} -1 & -1 \\ -1 & 1 \end{pmatrix} = \frac{1}{2}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}$. 
$AP = \begin{pmatrix} 3 & 3 \\ 1 & -1 \end{pmatrix}$. 
$\tilde A = P^{-1}AP = \frac{1}{2}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}\begin{pmatrix} 3 & 3 \\ 1 & -1 \end{pmatrix} = \frac{1}{2}\begin{pmatrix} 4 & 2 \\ 2 & 4 \end{pmatrix} = \begin{pmatrix} 2 & 1 \\ 1 & 2 \end{pmatrix}$.

> **메시지**: 같은 Linear transformation의 다른 표현. trace·det·Eigenvalue 보존 (둘 다 $\mathrm{tr} = 4, \det = 3, \lambda = 1, 3$).

---

# D. 응용: PCA·이미지 압축·LoRA

## D-1. PCA 도입 (Part 4 2회차 본격)

### 데이터 모델
$n$개 $d$차원 표본 $\mathbf{x}_1, \ldots, \mathbf{x}_n$, 데이터 행렬 $X \in \mathbb{R}^{n\times d}$ (행 = 표본).

### Step 1: 평균 중심화
$\bar{\mathbf{x}} = \frac{1}{n}\sum \mathbf{x}_i$. $\tilde X_{ij} = X_{ij} - \bar x_j$. 즉 각 열에서 그 열의 평균을 빼기.

### Step 2: SVD
$\tilde X = U \Sigma V^\top$.

### Step 3: 주성분 추출
- $V$의 첫 $k$열 $\mathbf{v}_1, \ldots, \mathbf{v}_k$ = **첫 $k$ 주성분 (principal components)**, 데이터의 **최대 분산 방향**.
- $\sigma_i^2 / (n-1)$ = $i$번째 주성분 방향의 표본 분산.
- $U\Sigma$의 첫 $k$열 = 데이터의 **저차원 표현** (각 표본을 $k$차원으로 압축).

### 의의
PCA = **평균 중심화·SVD**. 본질이 SVD이며, Eckart-Young이 곧 **PCA의 정당화** ("주성분으로 잘라낸 게 가장 가까운 저차원 근사").

---

## D-2. PCA와 공분산행렬의 관계 (한 줄)

$\tilde X^\top \tilde X / (n-1) = $ 표본 공분산행렬 $S$.

$\tilde X = U\Sigma V^\top$ → $\tilde X^\top \tilde X = V\Sigma^2 V^\top$ → $S = V \frac{\Sigma^2}{n-1} V^\top$.

즉 $S$의 **Eigenvector** = PCA 주성분 = $V$의 열, **Eigenvalue** = $\sigma_i^2/(n-1)$.

→ PCA는 SVD로도 공분산 고유분해로도 풀이 가능. **SVD 풀이가 수치적으로 더 안정적**이라 표준 알고리즘.

---

## D-3. 이미지 압축 (Strang Ch 7.3 시그니처 응용)

### 모델
회색 이미지 = $m \times n$ 행렬 $A$. SVD $A = U\Sigma V^\top$, $A_k = \sum_{i\le k}\sigma_i \mathbf{u}_i \mathbf{v}_i^\top$.

### 저장 비용
- 원본: $mn$ 픽셀.
- rank-$k$ 근사: $k(m + n + 1)$ (각 $\mathbf{u}_i$ $m$개, $\mathbf{v}_i$ $n$개, $\sigma_i$ 1개).
- 압축률: $k(m+n+1) / mn$. $m, n$ 클수록 더 효과적.

### 예제
$512 \times 512$ 이미지, $k = 50$. 원본 262,144 vs 압축 51,250 → 약 5배 압축. $\sigma_i$ 분포가 빠르게 감소하면 시각적 손실 거의 없음.

### Strang의 그림
Strang Ch 7.3에 등장하는 텍스트 압축 패턴: 원본 글자 → rank-1 (가장 큰 모드만, 흐릿한 평균) → rank-5 → rank-20 → 원본. **rank-20쯤에서 사람 눈으로 구분 불가**한 경우가 흔하다.

---

## D-4. LoRA (Low-Rank Adaptation)

### 동기
대형 언어 모델 (GPT, LLaMA)의 가중치 행렬 $W \in \mathbb{R}^{d\times d}$ ($d \sim 10^3$ - $10^4$). Fine-tuning 시 $W$ 전체 갱신은 메모리·비용 부담.

### LoRA 가정
**갱신량 $\Delta W$가 저계수**라고 가정. $\Delta W = BA$, $B \in \mathbb{R}^{d\times k}, A \in \mathbb{R}^{k\times d}$, $k \ll d$ (보통 $k = 8, 16, 32$).

### 학습
$W$는 고정, $A, B$만 학습. 매개변수 수: $2dk$ vs 원본 $d^2$ → $k = 8, d = 1024$이면 $2 \cdot 1024 \cdot 8 / 1024^2 = 1.5\%$.

### Eckart-Young 연결
"$\Delta W$의 정보가 최대한 보존되는 rank-$k$ 표현"이 Eckart-Young의 직접적 응용. 사실상 경험적으로 작동하는 이유가 본 회차 정리에 있다.

---

## D-5. AI 응용 카탈로그

| 응용 | rank | 효과 |
|---|---|---|
| **JPEG** (DCT, 양자화) | 암묵 저계수 | 시각 압축 |
| **MP3** | 주파수 도메인 저계수 | 청각 압축 |
| **PCA (Part 4)** | 데이터 → 주성분 $k$ | 차원 축소·시각화 |
| **LSA (잠재 의미 분석)** | 단어×문서 → 토픽 $k$ | NLP 토픽 모델 |
| **eigenfaces** | 얼굴 데이터 SVD | 얼굴 인식 표현 |
| **LoRA** | 가중치 갱신 rank-$k$ | LLM 효율 fine-tuning |
| **추천 시스템** | 사용자×아이템 → 잠재 $k$ | 협업 필터링 |

→ Eckart-Young 한 정리가 위 모든 응용의 수학적 정당화.

---

<!-- _class: exercise -->

# 잠깐 풀어보기: PCA·압축

### 문제 1 (PCA 손풀이)
$\tilde X = \begin{pmatrix} 1 & 1 \\ -1 & 1 \\ 0 & -2 \end{pmatrix}$ ($n = 3, d = 2$, 평균 중심화 완료). 표본 공분산행렬 $S = \tilde X^\top \tilde X / 2$를 계산하고 주성분 방향을 구하시오.

### 문제 2 (압축률)
$1000 \times 1000$ 이미지를 rank-50 SVD로 압축. 압축률 (저장 비용 비)?

### 문제 3 (LoRA)
$d = 4096, k = 16$. LoRA 매개변수 수 / 원본 매개변수 수?

---

<!-- _class: exercise -->

## 잠깐 풀어보기: 답

### 문제 1
$\tilde X^\top \tilde X = \begin{pmatrix} 1 & -1 & 0 \\ 1 & 1 & -2 \end{pmatrix} \cdot \begin{pmatrix} 1 & 1 \\ -1 & 1 \\ 0 & -2 \end{pmatrix} = \begin{pmatrix} 2 & 0 \\ 0 & 6 \end{pmatrix}$. $S = \mathrm{diag}(1, 3)$.

주성분 = $S$의 Eigenvector = $\mathbf{e}_1, \mathbf{e}_2$. 분산 = $1, 3$. **두 번째 좌표축이 첫 주성분** (큰 분산 $3$).

### 문제 2
원본 $10^6$, 압축 $50 \cdot (1000 + 1000 + 1) = 100,050$. 약 **10배 압축** (10%).

### 문제 3
LoRA: $2 \cdot 4096 \cdot 16 = 131,072$. 원본: $4096^2 \approx 1.68 \times 10^7$. 비율 $\approx 0.78\%$. **0.78%만으로 fine-tuning** 가능.

> **메시지**: 저계수 가정, SVD가 실제 모델·이미지·언어에 광범위하게 적용되는 까닭은 데이터·가중치 갱신의 본질적 차원이 크지 않기 때문. 이것이 머신러닝 후반의 핵심 직관.

---

# E. Part 2 (선형대수 2) 마무리, 9회차 마무리 문제·Part 2 종합 Review

## E-1. Part 2 (선형대수 2) 1-9회차 핵심 한 표

| 회차 | 핵심 도구 | 핵심 식 | 응용 |
|:---:|---|---|---|
| 1 | Orthogonality·Projection | $P = A(A^\top A)^{-1}A^\top$ | 4 부분공간 직교 짝 |
| 2 | Least squares | $A^\top A \hat{\mathbf{x}} = A^\top \mathbf{b}$ | AI 회귀 표준 |
| 3 | Gram-Schmidt·QR | $A = QR$ | 수치 안정·회전 |
| 4 | Determinant | $\det A$ | 가역·signed volume |
| 5 | Eigenvalue·Eigenvector | $A\mathbf{v} = \lambda\mathbf{v}$ | PageRank·피보나치 |
| 6 | 대각화·Spectral | $A = S\Lambda S^{-1}$, $A = Q\Lambda Q^\top$ | $A^k$ 한 줄 |
| 7 | 양정치·Cholesky | $A \succ 0 \iff LL^\top$ | MVN·Ridge |
| 8 | SVD | $A = U\Sigma V^\top$ | 4 부분공간·회전·신축·회전 |
| 9 | Eckart-Young (본 회차) | $A_k = \sum_{i\le k}\sigma_i\mathbf{u}_i\mathbf{v}_i^\top$ | PCA·압축·LoRA |

본 회차가 한 줄로 통합: **정사영 → QR → 행렬식 → 고유분해 → SVD → 저계수 근사**, Part 2 (선형대수 2) 전체의 정점.

### 후반부 종합 풀기 (본 섹션의 일부)

본 9회차는 전반부 (Eckart-Young 정식 도입)에 이어 **사전 공개된 Part 2 (선형대수 2) 종합 문제를 함께 Review**합니다. 학생은 본 회차 전에 종합 문제 (05_시험/Part2_종합문제Review.md)를 본인 페이스로 풀어 와서, 본 회차 후반에 모두 함께 풀이를 짚어 봅니다. Part 2 1-8회차의 도구가 한 흐름으로 어떻게 엮이는지 한 자리에서 종합합니다.

---

## E-2. 본 회차 핵심 5개

1. **SVD 외적 표현**: $A = \sum \sigma_i \mathbf{u}_i \mathbf{v}_i^\top$, rank-1 행렬들의 합.
2. **Eckart-Young**: $A_k = \sum_{i\le k}$가 모든 rank-$k$ 이하 행렬 중 $A$에 가장 가까움. $\|A-A_k\|_F^2 = \sum_{i>k}\sigma_i^2, \|A-A_k\|_2 = \sigma_{k+1}$. (본문 진술까지, 증명 부록.)
3. **Linear transformation = 행렬**, **기저변환 = 닮음**. SVD = 입·출력 자연 기저에서의 대각 표현.
4. **PCA = 평균 중심화, SVD**. $V$의 열 = 주성분, $\sigma_i^2/(n-1)$ = 분산. Eckart-Young이 정당화.
5. **AI 응용**: 이미지 압축 (rank-50으로 시각 손실 거의 없음), LoRA (rank-8/16 fine-tuning), LSA·eigenfaces·추천 시스템 모두 같은 원리.

---

## E-3. 자기 점검 질문

- $A$가 rank-$r$인 행렬. rank-$r$ 근사의 오차는?
- PCA가 SVD와 공분산 고유분해 두 방법 중 SVD가 수치적으로 선호되는 이유는?
- Eckart-Young은 Frobenius·spectral 두 노름에서 모두 성립한다. 두 노름에서 최적이 동일한 $A_k$인 점이 우연인가?
- Affine transformation은 Linear transformation인가? 신경망 한 층은?
- LoRA의 $\Delta W = BA$에서 $BA$의 rank가 $\le k$임을 보이시오.

---

<!-- _class: exercise -->

# 본 회차 마무리 문제 (즉석 풀이)

본 회차 사슬 (외적 표현 → Eckart-Young → PCA)을 한 문제로 종합합니다.

$\tilde X = \begin{pmatrix} 3 & 0 \\ 0 & 2 \\ 0 & 0 \end{pmatrix}$가 주어졌다 ($3 \times 2$, 평균 중심화 완료).

- **(a)** SVD를 적으시오 ($U, \Sigma, V$). (대각형이므로 자명.)
- **(b)** SVD 외적 합 표현 $\tilde X = \sigma_1 \mathbf{u}_1 \mathbf{v}_1^\top + \sigma_2 \mathbf{u}_2 \mathbf{v}_2^\top$을 명시적으로 쓰시오.
- **(c)** rank-1 근사 $\tilde X_1$와 $\|\tilde X - \tilde X_1\|_F^2, \|\tilde X - \tilde X_1\|_2$를 구하시오.
- **(d)** **PCA**: 표본 공분산행렬 $S = \tilde X^\top \tilde X / 2$의 첫 주성분과 분산.
- **(e)** Eckart-Young 정리의 의미를 본 문제에 적용해 한 줄로 설명.

---

<!-- _class: exercise -->

## 본 회차 마무리 문제: 답

- **(a)** $\sigma_1 = 3, \sigma_2 = 2$. $U = I_3$ (의 첫 두 열·임의 셋째), $V = I_2$, $\Sigma = \begin{pmatrix} 3 & 0 \\ 0 & 2 \\ 0 & 0 \end{pmatrix}$.

- **(b)** $\tilde X = 3 \mathbf{e}_1 \mathbf{e}_1^\top + 2 \mathbf{e}_2 \mathbf{e}_2^\top = \begin{pmatrix} 3 & 0 \\ 0 & 0 \\ 0 & 0 \end{pmatrix} + \begin{pmatrix} 0 & 0 \\ 0 & 2 \\ 0 & 0 \end{pmatrix}$. (외적은 $\mathbb{R}^3$ 벡터와 $\mathbb{R}^2$ 벡터의 곱이므로 $3 \times 2$ 행렬.)

- **(c)** $\tilde X_1 = \begin{pmatrix} 3 & 0 \\ 0 & 0 \\ 0 & 0 \end{pmatrix}$. $\|\tilde X - \tilde X_1\|_F^2 = 2^2 = 4 = \sigma_2^2$. $\|\tilde X - \tilde X_1\|_2 = 2 = \sigma_2$.

- **(d)** $S = \tilde X^\top \tilde X / 2 = \mathrm{diag}(9, 4)/2 = \mathrm{diag}(4.5, 2)$. 첫 주성분 = $\mathbf{e}_1$ (분산 4.5), 두 번째 = $\mathbf{e}_2$ (분산 2).

- **(e)** Eckart-Young: rank-1 행렬 중 $\tilde X_1$이 $\tilde X$에 가장 가깝다. 오차 = $\sigma_2$ (spectral) 또는 $\sigma_2^2$ (Frobenius). PCA에서 "한 주성분만 남기는" 차원 축소가 곧 이 근사.

> **핵심**: 본 회차는 5-8회차의 분해 도구 (Eigenvalue → 대각화 → 양정치 → SVD)를 응용 한 정리 (Eckart-Young)으로 통합한다. Part 4는 이 토대 위에서 PCA·SVM·GMM·CNN·Attention을 정식으로 다룬다.

---

<!-- _class: exercise -->

## 다음 회차 Review용 숙제 (Part 3 1회차로 가져갈 질문)

위 마무리 문제의 유사 문제, 그리고 Part 2 (선형대수 2) 통합 점검.

### 통합 문제
$A = \begin{pmatrix} 2 & 1 \\ 1 & 2 \\ 0 & 1 \end{pmatrix}$가 주어졌다.

- (a) SVD를 구하시오 ($U, \Sigma, V$를 모두 명시).
- (b) rank-1 근사 $A_1$와 $\|A - A_1\|_F^2$, $\|A - A_1\|_2$.
- (c) (Part 2 통합) $A$의 SVD에서 $\sigma_1^2, \sigma_2^2$이 $A^\top A$의 Eigenvalue임을 확인하고, $A^\top A$가 양정치임을 별도로 확인 (모든 $\lambda > 0$).
- (d) **Part 3 1회차 도입**: $f(\mathbf{x}) = \|A\mathbf{x} - \mathbf{b}\|^2$ ($\mathbf{b} \in \mathbb{R}^3$ 고정)의 gradient $\nabla f$를 손계산해 보시오. (Part 2 2회차 정규방정식 미리보기, Part 3 1회차 벡터 미적분 도입.)

### 자기 점검
- (a)에서 $V$의 열이 PCA에서는 주성분이 됨을 다시 확인.
- (c)에서 양정치 ↔ SVD ↔ 고유분해 세 개념이 통합되는 자리.
- (d)는 다음 Part 3 1회차 (Vector Calculus 1)의 첫 동기.

---

## E-4. 과제 안내

`04_과제/Part2/09회차_homework.md`, 마감: Part 3 1회차 시작 전

**수학 30점**
- Eckart-Young Frobenius·spectral 오차 계산, 5문제
- Linear transformation 판정, 4문제
- 기저변환 행렬 계산, 3문제
- PCA SVD 풀이 (소규모 데이터), 3문제

**코딩 20점**
- NumPy SVD로 이미지 압축 (rank-5, 20, 50 비교 시각화)
- MNIST 2D PCA 시각화 (Part 4 미리보기)
- LoRA $\Delta W = BA$ 매개변수 수 계산·검증
- **보너스**: 합성 데이터에 PCA, SVD 두 방법 비교 (정확도·시간)

---

## E-5. 다음 회차 (Part 3 1회차) 예고

**주제**: Vector Calculus 1, Jacobian·Chain rule·Gradient

**연결**: Part 2 (선형대수 2, 1-9회차)는 행렬 분해 도구의 완성. **Part 3 (1-4회차)는 미분·확률·최적화** 추가 수학으로, ML 응용을 떠받칠 두 번째 토대. Part 3 1회차는 다변수 함수의 미분 (Jacobian, Hessian의 첫 형제)에서 시작, 신경망 backward의 본질을 정식화한다.

**사전 reading**:
- MML §5.1-5.4 (Differentiation, Gradients of Vector-Valued Functions, Chain Rule)

---

# 부록: Eckart-Young 엄격 증명 (자율)

**본 회차 본문은 진술·예제·직관 풀이까지**. 엄격 증명은 부록.

### 증명 (Frobenius·spectral 동시)
$B \in \mathbb{R}^{m\times n}$이 rank $\le k$라 하자. $B$의 column space는 어떤 $k$차원 부분공간 $W \subset \mathbb{R}^m$에 포함. $W^\perp$ ($W$의 직교 보완) 위 정직교 단위 벡터 $\mathbf{w}_1, \ldots, \mathbf{w}_{m-k}$를 잡으면 $W^\perp \cap \mathrm{span}(\mathbf{u}_1, \ldots, \mathbf{u}_{k+1}) \neq \{\mathbf{0}\}$ (차원 합 $(m-k) + (k+1) = m+1 > m$이므로 교집합 비자명).

이 교집합에서 단위 벡터 $\mathbf{w}^\star$를 잡으면 $\mathbf{w}^\star \perp $ Column space($B$), 즉 $B^\top \mathbf{w}^\star = \mathbf{0}$ (Left null). $\mathbf{w}^\star = \sum_{i\le k+1} c_i \mathbf{u}_i$로 쓰면 $\sum c_i^2 = 1$.

$\|A - B\|_2 \ge \|(A-B)\mathbf{v}\|$ 꼴의 하한을 적당히 잡으면 $\|A - B\|_2 \ge \sigma_{k+1}$ ($\mathbf{v} = $ 적절한 우특이벡터의 합) 유도. Frobenius도 유사 차분기.

엄격한 형태는 von Neumann의 trace 부등식 또는 Weyl의 부등식 활용. 자세한 흐름은 Golub·Van Loan *Matrix Computations* Theorem 2.4.8 또는 MML §4.6 참고. ∎

# 부록: 추천 연습문제

| 출처 | 주제 | 난도 |
|---|---|:---:|
| Strang Ch 7.3 Problem 1-5 | rank-$k$ 근사 손풀이 | 중 |
| Strang Ch 7.3 Problem 7-10 | 이미지 압축 응용 | 중 |
| MML §4.6 Exercise 4.20-4.22 | Eckart-Young 정식 | 중 |
| MML §2.7-2.8 Exercise | Linear transformation·기저변환 | 중 |
| Strang Ch 7.4 Problem 13-15 | PCA·공분산 SVD 연결 | 상 |
| MML §10 도입 | PCA의 SVD 정식 | 상 |

---

<!-- _class: lead -->

# Q & A

본 회차 사슬:
**SVD 외적 표현 → Eckart-Young (저계수 근사 최적) → Linear transformation·기저변환 → PCA 도입**

핵심 한 줄: **데이터의 본질적 차원이 적으면 SVD 절단이 곧 그 본질을 추출하는 최적 도구이며, 이것이 PCA·이미지 압축·LoRA·LSA 모두의 토대이다.**

다음 회차의 출발 문제:
> 다변수 함수의 미분은 어떻게 정의하면 자연스러운가? Jacobian·gradient·chain rule이 행렬 곱으로 어떻게 표현되는가?

`HANDOUT`: 본 PDF, `Part2_09_저계수근사_PCA_LoRA.ipynb`

**Part 2 (선형대수 2) 마무리**: 1-9회차로 정사영부터 SVD·저계수 근사까지의 완성. 다음 Part 3 (1-4회차)는 미분·확률·최적화로 ML 응용을 떠받칠 두 번째 토대.
