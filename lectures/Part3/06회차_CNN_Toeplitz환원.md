---
marp: true
theme: default
paginate: true
header: '인공지능 전공자를 위한 선형대수학'
footer: 'Part 3 6회차 — CNN · 1D Conv → Toeplitz 환원 · 1×1 Conv = 행렬곱'
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

# Part 3 · 6회차

## CNN · 1D Convolution → Toeplitz 환원 · 1×1 Conv = 행렬곱

자체 교안 (본 강좌 시그니처)
**Part 3 6회차** — Conv 연산이 사실은 한 종류의 행렬 곱임을 정식화합니다.

> "Conv는 LA의 어떤 객체인가" 한 질문에 본 회차가 답한다. **Toeplitz 행렬**이 그 답이다.

---

<!-- _class: exercise -->

# Review: 5회차 마무리 숙제

지난 회차 (Kernel SVM) 숙제: 1D 데이터 $x_1=-2, y_1=+1$; $x_2=0, y_2=-1$; $x_3=2, y_3=+1$.

### 답

- **(a)** 선형 SVM 분리 **불가**. 1D에서 $-2, +2$가 같은 부호, 중간 $0$이 반대 부호. 한 직선 (점)으로 가를 수 없다.
- **(b)** $K(x_i, x_j) = (x_i x_j + 1)^2$:
$$\mathbf{K} = \begin{pmatrix} 25 & 1 & 9 \\ 1 & 1 & 1 \\ 9 & 1 & 25 \end{pmatrix}.$$
- **(c)** $\phi(x_i) = (1, \sqrt{2}x_i, x_i^2)$: $\phi(-2)=(1,-2\sqrt{2},4)$, $\phi(0)=(1,0,0)$, $\phi(2)=(1,2\sqrt{2},4)$. **셋째 좌표 $x^2$로 분리**: $+1$은 $x^2=4$, $-1$은 $x^2=0$.
- **(d)** 알고리즘이 데이터를 오직 **Inner product** $\mathbf{x}_i^\top\mathbf{x}_j$ 형태로만 사용해야 Kernel 일반화 가능 (정리 5.2).

### 핵심 관찰

본 회차 CNN은 Kernel SVM과 정반대 접근: **$\phi$를 명시적으로 학습**한다 (Conv 필터). 본 회차는 그 Conv 자체가 LA에서 무슨 객체인지를 묻는다.

---

## 본 회차 핵심 질문

> ### Convolution 연산을 행렬 곱으로 적을 수 있습니까?

이 한 질문에 답하려면 세 단계가 필요합니다.

1. **1D Convolution**의 정식 정의와 직관
2. **Toeplitz 행렬**을 이용한 Conv → 행렬 곱 환원
3. **1×1 Convolution**의 행렬 곱 동치

본 회차의 모든 결과는 이 순서를 따른다. 본 회차는 **본 강좌의 시그니처 자체 교안**이다.

---

## 학습 목표

이번 회차가 끝나면 학생은 다음을 답할 수 있어야 합니다.

1. **1D Convolution** $(\mathbf{x} * \mathbf{k})_i = \sum_j x_{i-j} k_j$의 정식 정의와 PyTorch `nn.Conv1d`의 cross-correlation 관계를 설명할 수 있습니다.
2. **Toeplitz 행렬** $T_k$의 정식 정의와 모든 행이 같은 커널 $\mathbf{k}$를 한 칸씩 미는 형태임을 적을 수 있습니다.
3. **$\mathbf{x} * \mathbf{k} = T_k \mathbf{x}$** 환원을 작은 예제로 손으로 검증할 수 있습니다.
4. **1×1 Convolution**이 **채널 차원에서의 행렬 곱**과 동치임을 설명할 수 있습니다.
5. nn.Conv1d 출력과 손으로 만든 Toeplitz 곱이 일치하는 PyTorch 검증 패턴을 알 수 있습니다.

---

## 본 회차 개념 사슬

| 질문 | 답 (본 회차의 답) | 도구 |
|---|---|---|
| Conv 정식 정의? | **1D Conv** | $\sum_j x_{i-j} k_j$ |
| Conv를 한 객체로? | **Toeplitz 행렬** | $T_k \in \mathbb{R}^{m \times n}$ |
| $\mathbf{x} * \mathbf{k}$는? | $T_k \mathbf{x}$ | 행렬·벡터 곱 (Part 1 3회차) |
| 1×1 Conv는? | **채널 행렬 곱** | $C_\text{out} \times C_\text{in}$ |
| 다채널 Conv는? | $T_k$ 블록·채널 결합 | (디테일 부록) |

→ 본 회차는 **Part 1 3회차 행렬·벡터 곱**을 신경망 핵심 연산에 적용한 종합이다.

---

## 수업 흐름

| 순서 | 블록 | 내용 |
|:---:|:---:|---|
| ① | A | **오프닝**: 핵심 질문 + 5회차 Review |
| ② | **B** | **1D Conv·Cross-correlation** 정식 정의 + Toeplitz 행렬 |
| ③ | **C** | **Conv → Toeplitz 곱** 환원·**1×1 Conv = 행렬곱** |
| ④ | D | **PyTorch 검증**·**AI 연결** (ResNet·MobileNet) |
| ⑤ | E | **마무리·다음 회차 (Attention)·자율 학습 박스 (2D 블록 Toeplitz)** |

---

# B. 1D Convolution · Toeplitz 행렬

## B-1. 동기: 시그널 처리에서 신경망까지

오디오 신호·시계열·이미지의 한 행 같은 **1차원 수열** $\mathbf{x} = (x_0, x_1, \ldots, x_{n-1})$.

특징 추출의 표준 도구: **작은 커널** $\mathbf{k} = (k_0, k_1, \ldots, k_{p-1})$을 신호 위로 **한 칸씩 밀면서 곱·합**.

<div class="analogy">

**직관 (창문 비유)**: Convolution은 **작은 창문 (커널)을 긴 신호 위로 한 칸씩 밀며 보는 일**입니다. 창문이 한 위치에 있을 때 보이는 값들을 가중치 (커널 값)와 곱해 한 숫자로 요약합니다. 이를 모든 위치에서 반복해 새 신호를 만듭니다. **창문 자체는 한 종류, 위치만 바뀝니다.**

</div>

→ 이 "위치만 바꿔가며 같은 커널 적용"이 본 회차 Toeplitz 행렬의 정확한 정의가 된다.

---

## B-2. 1D Convolution: 정식 정의

### 정의 6.1 (1D Convolution, 수학적)
입력 $\mathbf{x} \in \mathbb{R}^n$, 커널 $\mathbf{k} \in \mathbb{R}^p$에 대해
$$(\mathbf{x} * \mathbf{k})_i = \sum_{j=0}^{p-1} x_{i-j}\, k_j.$$

### 정의 6.2 (1D Cross-correlation, 신경망 표준)
$$(\mathbf{x} \star \mathbf{k})_i = \sum_{j=0}^{p-1} x_{i+j}\, k_j.$$

**차이**: 수학의 Conv는 커널을 **뒤집은** 가중치, Cross-correlation은 **뒤집지 않는** 가중치. 신경망 라이브러리 (`nn.Conv1d` 등)는 **Cross-correlation**을 "Conv"라고 부른다.

> 본 회차에서 "Conv"라 함은 **신경망 표준**의 Cross-correlation을 가리킨다.

---

## B-3. 작은 예제로 보기

$\mathbf{x} = (1, 2, 3, 4, 5)^\top \in \mathbb{R}^5$, $\mathbf{k} = (1, 0, -1)^\top \in \mathbb{R}^3$ (간단한 미분 검출 커널).

stride = 1, no padding, Cross-correlation 계산:

| 위치 $i$ | 창 | 곱·합 | $y_i$ |
|:---:|---|---|:---:|
| 0 | $(1, 2, 3)$ | $1 \cdot 1 + 2 \cdot 0 + 3 \cdot (-1)$ | $-2$ |
| 1 | $(2, 3, 4)$ | $2 \cdot 1 + 3 \cdot 0 + 4 \cdot (-1)$ | $-2$ |
| 2 | $(3, 4, 5)$ | $3 \cdot 1 + 4 \cdot 0 + 5 \cdot (-1)$ | $-2$ |

→ $\mathbf{y} = (-2, -2, -2)^\top \in \mathbb{R}^3$.

**출력 길이** $m = n - p + 1 = 5 - 3 + 1 = 3$. (padding·stride 일반 형식화는 자율 학습 박스 참조.)

---

## B-4. Toeplitz 행렬: 정식 정의

### 정의 6.3 (Toeplitz 행렬)
모든 대각선 (diagonal) 위의 원소가 같은 행렬을 **Toeplitz 행렬**이라 한다. 즉
$$(T)_{ij} = t_{i-j}, \quad t_k \in \mathbb{R}.$$

### 본 회차의 Conv-Toeplitz
커널 $\mathbf{k} = (k_0, \ldots, k_{p-1})$로 만든 행렬 $T_k \in \mathbb{R}^{m \times n}$의 $i$번째 행:
$$T_k[i, :] = (\underbrace{0, \ldots, 0}_{i \text{개}}, k_0, k_1, \ldots, k_{p-1}, \underbrace{0, \ldots, 0}_{n-i-p \text{개}}).$$

각 행은 **커널을 한 칸씩 오른쪽으로 민** 패턴. $m = n - p + 1$.

---

## B-5. B-3 예제의 Toeplitz 행렬

$\mathbf{k} = (1, 0, -1)$, $n=5$, $m=3$:
$$T_k = \begin{pmatrix} 1 & 0 & -1 & 0 & 0 \\ 0 & 1 & 0 & -1 & 0 \\ 0 & 0 & 1 & 0 & -1 \end{pmatrix} \in \mathbb{R}^{3 \times 5}.$$

검증: $T_k \mathbf{x}$를 계산하면
$$T_k \mathbf{x} = \begin{pmatrix} 1 \cdot 1 + 0 \cdot 2 + (-1) \cdot 3 + 0 \cdot 4 + 0 \cdot 5 \\ 0 \cdot 1 + 1 \cdot 2 + 0 \cdot 3 + (-1) \cdot 4 + 0 \cdot 5 \\ 0 \cdot 1 + 0 \cdot 2 + 1 \cdot 3 + 0 \cdot 4 + (-1) \cdot 5 \end{pmatrix} = \begin{pmatrix} -2 \\ -2 \\ -2 \end{pmatrix}.$$

→ B-3 결과와 **완전 일치**. 본 회차 핵심 환원이 작은 예에서 작동 확인.

---

# C. Conv → Toeplitz 환원 · 1×1 Conv = 행렬곱

## C-1. 핵심 정리

### 정리 6.1 (1D Conv = Toeplitz 행렬·벡터 곱)
입력 $\mathbf{x} \in \mathbb{R}^n$, 커널 $\mathbf{k} \in \mathbb{R}^p$, no padding, stride 1에 대해
$$\boxed{\;\mathbf{x} \star \mathbf{k} = T_k \mathbf{x} \in \mathbb{R}^{m}, \quad m = n - p + 1.\;}$$

여기서 $T_k$는 B-4·B-5에서 정의한 Toeplitz 행렬.

### 증명 흐름
$T_k$의 $i$번째 행과 $\mathbf{x}$의 곱을 적으면
$$(T_k \mathbf{x})_i = \sum_{j=0}^{p-1} k_j \cdot x_{i+j} = (\mathbf{x} \star \mathbf{k})_i.$$

→ 단순 인덱스 일치. 본 회차 사슬의 중심 식.

---

## C-2. 핵심 관찰의 함의

### "Conv는 행렬 곱"
정리 6.1에 따르면 Conv 연산은 **Part 1 3회차 행렬·벡터 곱과 같은 객체**다. 차이는 행렬이 일반 dense가 아니라 **희소·구조화된 Toeplitz**라는 점.

### 파라미터 절감
- 일반 $\mathbb{R}^{m \times n}$ 행렬: $m \cdot n$개 파라미터.
- Toeplitz $T_k$: $p$개 ($\mathbf{k}$의 성분 수)만 자유.

→ **CNN의 본질적 가치**: Toeplitz 구조에 의한 **파라미터 공유** (weight sharing). 같은 커널이 모든 위치에 재사용된다.

---

## C-3. Toeplitz가 만드는 신경망의 두 성질

### (i) Locality (지역성)
$T_k$가 각 행에서 $p$개 비영 원소만 가지므로, 출력 $y_i$는 입력의 **연속된 $p$개**만 본다. 멀리 떨어진 위치는 영향 없음.

### (ii) Translation Equivariance (이동 동치)
입력을 한 칸 옆으로 밀면 출력도 한 칸 옆으로 밀린다. 이는 Toeplitz의 **대각선 균일 구조**가 직접 보장한다.

> **다음 회차 (Attention) 마지막 슬라이드에서 직관 한 슬라이드로 흡수**한다. 정식 정의·Kronecker 정식은 자율 학습 박스로 이동.

---

## C-4. Multi-channel Conv (직관)

실제 CNN은 단일 채널이 아니라 **$C_\text{in}$ 입력 채널·$C_\text{out}$ 출력 채널**.

입력 $\mathbf{X} \in \mathbb{R}^{C_\text{in} \times n}$, 커널 $\mathbf{K} \in \mathbb{R}^{C_\text{out} \times C_\text{in} \times p}$.

출력 채널 $c'$의 위치 $i$:
$$\mathbf{Y}_{c', i} = \sum_{c=0}^{C_\text{in}-1} \sum_{j=0}^{p-1} \mathbf{K}_{c', c, j} \cdot \mathbf{X}_{c, i+j}.$$

→ 각 $(c', c)$ 쌍마다 Toeplitz 행렬 $T_{k_{c',c}}$가 생기고, 채널 차원으로 합산. **블록 Toeplitz 행렬**로 일반화 가능 (디테일은 자율 학습 박스).

---

## C-5. 1×1 Convolution

### 정의 6.4 (1×1 Conv)
커널 크기 $p = 1$인 Convolution. 위치 차원에 슬라이딩이 없고 **각 위치를 독립**으로 처리.

### 정식 식
$$\mathbf{Y}_{c', i} = \sum_{c=0}^{C_\text{in}-1} \mathbf{W}_{c', c} \cdot \mathbf{X}_{c, i}, \quad \mathbf{W} \in \mathbb{R}^{C_\text{out} \times C_\text{in}}.$$

→ 위치 $i$를 고정하면 **채널 Vector** $\mathbf{X}_{:, i} \in \mathbb{R}^{C_\text{in}}$에 대해
$$\mathbf{Y}_{:, i} = \mathbf{W}\, \mathbf{X}_{:, i}.$$

### 정리 6.2 (1×1 Conv = 채널 행렬 곱)
1×1 Conv는 **모든 위치에서 같은 행렬 $\mathbf{W} \in \mathbb{R}^{C_\text{out} \times C_\text{in}}$을 채널 Vector에 곱하는 연산**이다. Conv라는 이름이 붙어 있지만 **위치 차원에서는 아무 것도 안 한다**.

---

## C-6. 1×1 Conv가 등장하는 위치

| 모델 | 1×1 Conv 용도 |
|---|---|
| **GoogLeNet (Inception)** | 채널 압축 (병목, bottleneck) |
| **ResNet** | 잔차 블록의 채널 수 조정 |
| **MobileNet** | Depthwise separable의 두 번째 단계 |
| **Transformer (Vision)** | Token mixing 대안으로 일부 활용 |

→ 모든 사례에서 본질은 **채널 차원의 선형 변환** ($\mathbf{W} \in \mathbb{R}^{C_\text{out} \times C_\text{in}}$). 본 회차에서 정식화한 그 객체다.

---

<!-- _class: exercise -->

# 잠깐 풀어보기: Toeplitz 환원

### 문제 1 (계산)
$\mathbf{x} = (2, 4, 6, 8)^\top, \mathbf{k} = (1, -1)^\top$. stride 1, no padding.

- (a) Cross-correlation $\mathbf{x} \star \mathbf{k}$를 직접 계산.
- (b) Toeplitz 행렬 $T_k \in \mathbb{R}^{3 \times 4}$를 적고 $T_k \mathbf{x}$를 계산.
- (c) (a)와 (b)가 일치하는지 확인.

### 문제 2 (개념)
$C_\text{in} = 64, C_\text{out} = 256$인 1×1 Conv의 학습 가능한 파라미터 수는? 일반 fully connected $\mathbb{R}^{(64 \cdot H \cdot W) \to (256 \cdot H \cdot W)}$와 비교하시오 ($H = W = 16$ 가정).

> **힌트**: 1×1 Conv는 위치 차원에 영향 없고 채널 행렬만 학습한다.

---

<!-- _class: exercise -->

## 잠깐 풀어보기: 답

### 문제 1
- (a) $y_0 = 2 \cdot 1 + 4 \cdot (-1) = -2$, $y_1 = 4 - 6 = -2$, $y_2 = 6 - 8 = -2$. → $(-2, -2, -2)^\top$.
- (b) $T_k = \begin{pmatrix} 1 & -1 & 0 & 0 \\ 0 & 1 & -1 & 0 \\ 0 & 0 & 1 & -1 \end{pmatrix}$. $T_k \mathbf{x} = (2-4, 4-6, 6-8)^\top = (-2, -2, -2)^\top$.
- (c) 일치 ✓.

### 문제 2
- **1×1 Conv 파라미터 수**: $C_\text{out} \cdot C_\text{in} = 256 \cdot 64 = 16{,}384$. (Bias 제외)
- **Fully connected**: $(64 \cdot 16 \cdot 16) \cdot (256 \cdot 16 \cdot 16) = 16{,}384 \cdot 65{,}536 \approx 1.07 \times 10^9$. **약 65,000배 차이**.

→ 1×1 Conv는 **위치 차원의 weight sharing**으로 파라미터를 절감한다. 그 본질은 채널 행렬곱 한 번.

---

# D. PyTorch 검증 · AI 연결

## D-1. nn.Conv1d → Toeplitz 일치 검증 (노트북 안내)

→ `11_주피터노트북/Part3/06_CNN_Toeplitz.ipynb`

### 검증 패턴 (한 단락)
1. `nn.Conv1d(in_channels=1, out_channels=1, kernel_size=p, bias=False)` 생성, 가중치 $\mathbf{k}$ 수동 설정.
2. 입력 $\mathbf{x} \in \mathbb{R}^n$을 `(1, 1, n)`로 reshape 후 Conv 출력 $\mathbf{y}_\text{torch}$ 얻기.
3. NumPy로 Toeplitz $T_k \in \mathbb{R}^{m \times n}$를 직접 구성.
4. $\mathbf{y}_\text{Toeplitz} = T_k \mathbf{x}$.
5. `torch.allclose(y_torch, y_toeplitz)` → True 확인.

### 의미
이 검증이 통과하면 본 회차 정리 6.1이 PyTorch 실 구현과 **bit-level 일치**함이 보장된다. 학생은 "Conv는 Toeplitz 행렬 곱"이라는 본 회차 결론을 자기 손으로 검증한다.

---

## D-2. AI 연결: ResNet의 1×1 Conv

ResNet의 Bottleneck block:
$$\mathbf{X} \xrightarrow{1{\times}1} \mathbf{X}_1 \xrightarrow{3{\times}3} \mathbf{X}_2 \xrightarrow{1{\times}1} \mathbf{X}_3 \xrightarrow{+\mathbf{X}} \mathbf{X}_4.$$

| 단계 | Conv | 본 회차 환원 |
|---|---|---|
| 1 | 1×1 (채널 축소) | 채널 행렬 곱 (C-5) |
| 2 | 3×3 (공간 학습) | Toeplitz 곱 (정리 6.1, 2D는 부록) |
| 3 | 1×1 (채널 복원) | 채널 행렬 곱 (C-5) |

→ Bottleneck block의 3개 Conv 중 **2개가 본 회차의 1×1 Conv = 채널 행렬 곱**. 1개가 Toeplitz Conv. ResNet의 효율성은 이 분해에서 온다.

---

## D-3. MobileNet의 Depthwise Separable Conv

표준 Conv 1개를 다음 두 단계로 분리:

1. **Depthwise Conv**: 각 입력 채널을 **독립** Conv ($C_\text{in}$개 Toeplitz).
2. **Pointwise Conv (1×1)**: 채널 결합 (본 회차 C-5).

파라미터 비교 ($k = $ 커널, $C, C'$ 채널):
- 표준 Conv: $C' \cdot C \cdot k^2$
- Depthwise separable: $C \cdot k^2 + C' \cdot C$

→ $k = 3, C = C' = 256$이면 표준 $589{,}824$ vs separable $66{,}304$. **9배 절감**. MobileNet의 핵심 아이디어가 본 회차 객체로 분해된다.

---

## D-4. 본 회차 핵심 5개

1. **1D Conv (Cross-correlation)** $(\mathbf{x} \star \mathbf{k})_i = \sum_j x_{i+j} k_j$가 신경망 표준 정의.
2. **Toeplitz 행렬** $T_k \in \mathbb{R}^{m \times n}$: 각 행이 커널을 한 칸씩 민 형태.
3. **정리 6.1**: $\mathbf{x} \star \mathbf{k} = T_k \mathbf{x}$. **Conv = Toeplitz 행렬·벡터 곱**.
4. **Locality + Translation Equivariance + Weight sharing**이 Toeplitz 구조에서 직접 따라온다.
5. **1×1 Conv = 채널 행렬곱**: 모든 위치에서 같은 $\mathbf{W} \in \mathbb{R}^{C_\text{out} \times C_\text{in}}$을 채널 Vector에 곱한다. ResNet·MobileNet의 핵심 객체.

---

## D-5. 자기 점검 질문

- 수학의 Conv와 신경망의 Conv (Cross-correlation)는 무엇이 다르고 왜 신경망은 후자를 쓰는가?
- Toeplitz 행렬이 일반 행렬에 비해 파라미터를 얼마나 절감하는가? ($n = 100, p = 3$ 예)
- $T_k \mathbf{x}$의 결과가 입력보다 짧아지는 이유는? 길이가 같아지려면 어떻게 해야 하나?
- 1×1 Conv를 "Conv"라고 부르지만 실제로는 위치 차원에서 슬라이딩이 없다. 왜 그래도 Conv 계열이라고 부르는가?
- nn.Conv1d 출력과 손으로 만든 Toeplitz 곱이 일치하는 PyTorch 코드를 작성할 수 있는가?

---

<!-- _class: exercise -->

# 본 회차 마무리 문제 (즉석 풀이)

본 회차 사슬 (1D Conv → Toeplitz → 1×1 Conv = 행렬곱)을 **한 문제**로 종합합니다.

- **(a)** $\mathbf{x} = (1, 3, 5, 7, 9)^\top, \mathbf{k} = (1, 2, 1)^\top$. Cross-correlation $\mathbf{x} \star \mathbf{k}$를 직접 계산.
- **(b)** Toeplitz 행렬 $T_k \in \mathbb{R}^{3 \times 5}$를 적고 $T_k \mathbf{x}$로 (a) 결과를 다시 얻으시오.
- **(c)** 입력 $\mathbf{X} \in \mathbb{R}^{3 \times n}$ ($C_\text{in} = 3$), 출력 $\mathbf{Y} \in \mathbb{R}^{5 \times n}$ ($C_\text{out} = 5$)인 1×1 Conv의 파라미터 수는?
- **(d)** ResNet Bottleneck block에서 (c)의 1×1 Conv가 등장하는 위치 2곳을 답하시오.

---

<!-- _class: exercise -->

## 본 회차 마무리 문제: 답

- **(a)** $y_0 = 1 \cdot 1 + 3 \cdot 2 + 5 \cdot 1 = 12$. $y_1 = 3 + 10 + 7 = 20$. $y_2 = 5 + 14 + 9 = 28$. → $(12, 20, 28)^\top$.

- **(b)** $T_k = \begin{pmatrix} 1 & 2 & 1 & 0 & 0 \\ 0 & 1 & 2 & 1 & 0 \\ 0 & 0 & 1 & 2 & 1 \end{pmatrix}$.
  $T_k \mathbf{x} = (1+6+5, 3+10+7, 5+14+9)^\top = (12, 20, 28)^\top$ ✓.

- **(c)** $C_\text{out} \cdot C_\text{in} = 5 \cdot 3 = 15$.

- **(d)** Bottleneck block의 첫 1×1 (채널 축소: $\mathbf{X} \to \mathbf{X}_1$)과 마지막 1×1 (채널 복원: $\mathbf{X}_2 \to \mathbf{X}_3$).

> **핵심**: Conv 연산은 그 종류에 관계없이 **모두 행렬 곱으로 환원**된다. 1×1은 채널 행렬, 일반 Conv는 Toeplitz 행렬. Part 1 3회차의 행렬·벡터 곱이 신경망의 한가운데에 있다.

---

<!-- _class: exercise -->

## 다음 회차 (Attention) Review용 숙제

본 회차 사슬의 **확장 문제**입니다.

- (a) $\mathbf{x} = (4, 1, 2, 3)^\top, \mathbf{k} = (1, 1)^\top$. Cross-correlation을 계산하고 Toeplitz $T_k \in \mathbb{R}^{3 \times 4}$로 검증하시오.
- (b) 1×1 Conv가 fully connected layer와 본질적으로 같은 연산임을 한 줄로 설명하시오.
- (c) **다음 회차 미리보기**: Self-attention 수식 $\mathrm{Attn}(Q, K, V) = \mathrm{softmax}(QK^\top/\sqrt{d_k})V$에서 $Q, K, V$ 각각이 어떤 객체로 보이는지 (행렬·벡터·스칼라 중) 직관적으로 추측하시오.
- (d) Embedding layer (정수 ID → Vector)가 사실은 행렬·벡터 곱과 동치임을 한 줄로 설명하시오.

---

## E-1. 과제 안내

`04_과제/Part3/06회차_homework.md` — 마감: 7회차 시작 전

**수학 30점**
- Cross-correlation 계산·Toeplitz 환원, 3문제
- 출력 길이 공식 $m = n - p + 1$ 유도, 2문제
- 1×1 Conv 파라미터 수 계산, 3문제
- ResNet·MobileNet의 Conv 분해, 2문제

**코딩 30점**
- `nn.Conv1d` 출력과 손으로 만든 Toeplitz 곱이 일치함을 PyTorch로 검증
- 1×1 Conv를 `nn.Linear`로 동일 결과 재현
- Depthwise separable Conv를 표준 Conv 대비 파라미터 비교 시각화
- (보너스) `scipy.linalg.toeplitz` 활용한 효율 구현

---

## E-2. 다음 회차 (7회차) 예고

**주제**: Attention 분해 · $\mathrm{softmax}(QK^\top/\sqrt{d_k})V$ · Multi-head 직관 + Equivariance 직관 한 슬라이드

**연결**: 본 회차에서 Conv를 행렬 곱 (Toeplitz)으로 환원했다. **7회차에서는 Attention을 행렬 곱 3개의 조합으로 분해**한다. Embedding이 행렬·벡터 곱이라는 사실 (이번 회차 숙제 (d))도 7회차에서 정식화한다.

**사전 reading**:
- Vaswani et al., *Attention Is All You Need* (NeurIPS 2017), §3.2

---

<div class="appendix">

## 자율 학습·부록: 2D 블록 Toeplitz·padding/stride 형식화

본 강좌 본문에서는 1D Conv → Toeplitz 환원에 집중한다. **2D Conv를 블록 Toeplitz 행렬 곱으로 정식화**하는 형식, **padding (zero·reflect 등) / stride / dilation의 인덱스 산식**은 본문에서 다루지 않는다. 관심 학생은 후속 자료 또는 Goodfellow·Bengio·Courville *Deep Learning* Ch.9, Dumoulin·Visin *A guide to convolution arithmetic for deep learning* (arXiv:1603.07285) 참고. 본 회차 정리 6.1의 직접 일반화.

</div>

---

# 부록: PyTorch·NumPy 추천 실습

본 회차에서 다룬 내용을 코드로 검증해 보고 싶은 학생을 위한 안내입니다 (모두 자율).

| 실습 | 도구 | 난도 |
|---|---|:---:|
| 임의 $\mathbf{k}, \mathbf{x}$에 대해 nn.Conv1d ↔ Toeplitz 일치 검증 | PyTorch | 하 |
| `scipy.linalg.toeplitz`로 $T_k$ 생성 효율화 | SciPy | 하 |
| 1×1 Conv를 `nn.Linear`로 등가 재현 | PyTorch | 중 |
| Multi-channel Conv → Block Toeplitz 직접 구성 | NumPy | 상 |
| Edge detection $\mathbf{k} = (1, 0, -1)$로 1D 신호 처리 | NumPy | 하 |

---

<!-- _class: lead -->

# Q & A

본 회차 사슬:
**1D Conv (Cross-correlation) → Toeplitz 행렬 $T_k$ → $\mathbf{x} \star \mathbf{k} = T_k \mathbf{x}$ → 1×1 Conv = 채널 행렬곱**

핵심 한 줄: **Conv 연산은 모두 행렬 곱이다. 일반 Conv는 Toeplitz, 1×1 Conv는 채널 행렬. Part 1 3회차 행렬·벡터 곱이 CNN 전체를 지탱한다.**

다음 회차의 출발 문제:
> Attention 수식 $\mathrm{softmax}(QK^\top/\sqrt{d_k})V$를 행렬 곱 몇 개로 분해할 수 있을까?

`HANDOUT`: 본 PDF·`06_CNN_Toeplitz.ipynb`
