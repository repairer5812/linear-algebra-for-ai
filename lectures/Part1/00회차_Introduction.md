---
marp: true
theme: default
paginate: true
header: '인공지능 전공자를 위한 선형대수학'
footer: '0회차 · Introduction'
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

# 인공지능 전공자를 위한 선형대수학

## 0회차 · Introduction

SW·AI 융합대학원 · Part 1·2·3 (총 29회차)
메인 교재: MML (Deisenroth·Faisal·Ong, *Mathematics for Machine Learning*) · 발췌: Strang, *Introduction to Linear Algebra* · 시각: 3Blue1Brown EoLA

---

## 본 회차 학습 목표

이번 회차가 끝나면 학생은 다음을 답할 수 있어야 합니다.

1. **왜** AI 대학원에서 Linear Algebra(선형대수)를 한 학기 다시 배우는지
2. **무엇을** 29회차 동안 배우는지: 수학적 흐름과 CS/AI 흐름의 큰 그림
3. **어떻게** 배우는지: MML(메인) / Strang(발췌) / EoLA / NumPy의 4단 운영
4. **결과**: 이 강의를 마치면 어떤 능력이 생기는지
5. 한 Definition(정의)이 코드 한 줄과 그림 한 장으로 어떻게 이어지는지 (시그니처 예제)

---

## 본 회차 핵심 질문

> ### 수학 정의 한 줄이 어떻게 AI 모델 한 줄이 됩니까?

이 한 질문에 29회차에 걸쳐 답합니다.

- **본 회차 부분 답**: 가장 단순한 정의 (Vector(벡터)의 평균) 한 줄이 **MNIST 숫자 분류**까지 곧장 이어집니다 (G 시그니처).
- **학기 전체의 답**: $\mathrm{softmax}(QK^\top/\sqrt{d_k})V$, Transformer Attention(어텐션) 한 줄을 LA 객체로 완전 분해합니다 (Part 3 7회차).

매 회차 첫 슬라이드에 해당 회차의 핵심 질문이 있습니다. 강의 중 길을 잃으면 이 한 질문으로 돌아옵니다.

---

## 본 회차 수업 흐름

| 순서 | 블록 | 내용 |
|:---:|:---:|---|
| ① | A | **오프닝**: 핵심 질문, 강의 소개, 전제 |
| ② | B | 왜 Linear Algebra인가: 네 가지 동기 |
| ③ | **C** | **수학적 흐름의 큰 그림** |
| ④ | **D** | **CS·AI 흐름** |
| ⑤ | E | 교재 운용: MML (메인) / Strang (발췌) / EoLA (시각) |
| ⑥ | F | 이수 후 능력 점검표 |
| ⑦ | **G** | **시그니처 시연: MNIST 평균 이미지** |
| ⑧ | H | **클로징**: 1회차로 가져갈 마무리 문제, 사전 reading |

> **순서의 의미**: 수학 흐름 → CS 흐름 → 두 흐름이 만나는 한 예제 (평균 이미지)로 마무리합니다.
> 본 회차는 첫 회차이므로 Review가 없습니다. 다음 회차부터 표준 사이클 (핵심 질문 → Review → 본 강의 → 마무리 문제 → 숙제)을 운영합니다.

---

## A-1. 교과 정보

- **과목명**: Linear Algebra Part 1 (12회차) / Part 2 (9회차) / Part 3 (8회차)
- **대상**: SW·AI 융합대학원 1학년, **학부 LA 미이수 학생** 표준
- **운영**: 총 29회차, 1회차 2시간 × 29 = 58시간
- **메인 교재**: Deisenroth·Faisal·Ong, *Mathematics for Machine Learning* (MML, 무료 공식 PDF 공개)
- **발췌 교재**: Gilbert Strang, *Introduction to Linear Algebra* (6th ed.), 시그니처 10개 자산을 본문 발췌 박스로 사용 (Row·Column picture·Cauchy-Schwarz 판별식·Elementary matrix·LU·4 fundamental subspaces·Least squares·Gram-Schmidt·Determinant 기하·Eigenvalue 응용·SVD 기하·Eckart-Young)
- **시각 보조**: 3Blue1Brown *Essence of Linear Algebra* (EoLA)

---

## A-2. 운영 방식

| 항목 | 운영 |
|---|---|
| 출석 | 자율 (대학원생 자체 강의) |
| 과제 | 매 회차 수학 문제, Jupyter 노트북 |
| **코딩 실습 (Google Colab)** | **매 회차 필수 X. 회차별 학습 가치에 따라 1-2개 또는 그 이상으로 운영. 필요 없으면 수학 정리·풀이로 마무리** |
| 종합 문제 풀기 | Part 1 12회차·Part 2 9회차·Part 3 8회차 마지막에 학습 도구로 운영 |

> 대학원생 자체 강의이므로 정식 시험·평가는 없습니다. "종합 문제 풀기"는 각 Part 종료 시 학습 정리를 위한 도구입니다.
>
> Colab 노트북은 회차별 `11_주피터노트북/`에 모두 준비되어 있되, 강의 시간 중 실행할지 여부는 회차마다 판단합니다. 시간 부족 또는 수학 내용의 깊이가 더 중요한 회차는 코딩 없이 정리·풀이로 마칠 수 있습니다.

학부 LA 이수자는 Part 1 전반부를 빠르게 통과하고 응용 부분에 집중합니다 (별도 안내).

---

## A-3. 전제 가정

다음은 들어와 있다는 가정으로 진행합니다.

- 미적분학 · 이산수학 · 확률 기초 (학부 또는 자기학습)
- Python · NumPy 사용 가능
- PyTorch는 처음이어도 학습 의지

학부 LA 미이수 학생을 표준으로 한 강의입니다. Part 1 전반부에서 Definition·Theorem(정리)을 천천히 다지고 Part 2·3에서 응용으로 가속합니다.

---

## B-1. 동기 1: AI 논문 한 줄을 읽으려면

다음은 LLM 표준 논문의 한 문장입니다.

> "Self-attention computes $\mathrm{softmax}(QK^\top / \sqrt{d_k})V$, where $Q, K, V \in \mathbb{R}^{n \times d}$."

이 한 줄을 이해하려면 알아야 하는 것:

- $\mathbb{R}^{n \times d}$ → **Vector space(벡터공간)·Dimension(차원)** (6·8회차)
- $QK^\top$ → **모든 쌍의 Inner product(내적)** (2회차)
- $\sqrt{d_k}$로 나누는 이유 → **Vector Norm(노름)의 정규화** (2회차)
- softmax 후 $V$ → **Matrix(행렬)·Vector 곱의 두 해석** (3회차)

<div class="analogy">

**직관 (5층 건물 비유)**: 이 한 줄은 **5층 건물의 청사진 한 장**과 같습니다. 본 회차에서 전부 이해할 필요는 없고, 각 층이 무엇인지 (QK·softmax·V)만 알면 됩니다. **29회차에 걸쳐 한 층씩 들어가 봅니다.**

</div>

---

## B-2. 동기 2·3: 데이터는 Matrix, 선형 근사가 비선형을 다룹니다

**동기 2: 데이터는 Matrix입니다**

| 데이터 | LA 객체 |
|---|---|
| 이미지 (28×28) | $\mathbb{R}^{784}$ Vector |
| 문서 (BERT) | $\mathbb{R}^{768}$ Vector |
| 사용자×영화 평점 | $\mathbb{R}^{n \times m}$ Matrix |
| 신경망 한 층 | 가중치 Matrix $W$ + bias $\mathbf{b}$ |

**동기 3: 선형 근사가 비선형 세계를 다룹니다**

$f$가 미분가능하면 $\mathbf{x}_0$ 근방에서
$$f(\mathbf{x}_0 + \mathbf{h}) \approx f(\mathbf{x}_0) + J(\mathbf{x}_0)\,\mathbf{h}$$
여기서 $J$는 Jacobian(자코비안), **한 Matrix**. Backpropagation(역전파)은 이 식의 반복입니다.

<div class="analogy">

**직관 (지구와 동네 마당)**: **지구는 둥글지만 동네 마당은 평평하게 본다.** 비선형 함수도 한 점 근방에서는 직선처럼 봐도 됩니다. 그 "한 점에서의 평평한 근사"가 곧 **Jacobian**입니다.

</div>

---

## B-3. 동기 4: Decomposition(분해)이 본질을 드러냅니다

<div class="analogy">

**직관 (카레의 재료 분리)**: Decomposition은 **카레의 재료 분리**와 같습니다. 완성된 카레만 보면 복잡하지만, 양파·당근·고기·향신료로 분리하면 각 재료의 역할이 보입니다. Matrix도 마찬가지로, 복잡해 보이는 Matrix를 단순한 Matrix의 곱으로 분리하면 본질이 드러납니다.

</div>

| Decomposition | 구조 | 회차 |
|---|---|---|
| $A = LU$ | 하·상삼각 | 5 |
| $A = QR$ | 직교, 상삼각 | 11 |
| $A = Q\Lambda Q^\top$ | 대칭 → 회전·신축 | Part 2 1-2 |
| $A = U\Sigma V^\top$ (SVD) | **임의 Matrix → 회전·신축·회전** | Part 2 4-5 |

---

# C. 수학적 흐름의 큰 그림

> "Definition → Theorem → Decomposition → Application(응용)" 사이클이 매 회차 반복됩니다.

## C-1. 4단 사고 구조

매 회차가 다음 네 단계 안에 위치합니다.

| 단계 | 이름 | 의미 | 예 |
|:---:|---|---|---|
| ① | **Definition** | "이것을 [이름]이라 부른다" | Vector, Norm, Subspace(부분공간) |
| ② | **Theorem** | "정의에서 어떤 성질이 따라오는가" | Cauchy-Schwarz, Dimension Theorem |
| ③ | **Decomposition·구조** | "복잡한 객체를 단순한 객체의 합·곱으로" | LU, QR, SVD |
| ④ | **Application** | "분해된 구조가 AI 모델에서 어떻게 등장하는가" | PCA, 회귀, Attention |

<div class="analogy">

**직관 (요리 단계 비유)**: ① 재료 이름 익히기 → ② 재료의 성질 알기 → ③ 요리(분해) 기법 배우기 → ④ 실제 식당 메뉴 만들기. **이름을 모르면 요리를 못 합니다.**

</div>

---

## C-2. 수학적 흐름의 5대 줄기

| 줄기 | 주제 | 의미 | 회차 |
|:---:|---|---|---|
| 1 | **Vector · Matrix** | 객체의 정의 | 1·3 |
| 2 | **Linear equation** (선형방정식) $A\mathbf{x}=\mathbf{b}$ | 연산의 의미 | 4·5 |
| 3 | **Space** (공간) | Subspace · Basis(기저) · Dimension | 6·7·8 |
| 4 | **Orthogonality(직교성) · Projection(정사영)** | 거리·각도의 분해 | 9·10·11 |
| 5 | **Decomposition** | Determinant(행렬식) · Eigenvalue(고윳값) · SVD | 12 · Part 2·3 전체 |

**Part 1**: 1~4번 줄기를 단단히 다집니다.
**Part 2·3**: 5번 줄기 + AI 응용으로 나아갑니다.

---

## C-3. Part 1 흐름: 방정식과 공간

| 회차 | 주제 (MML §·Strang Ch 발췌) | 단계 |
|:---:|---|:---:|
| 1-3 | Vector · Norm · Inner product · Matrix·Vector 곱 (MML §2.1-§2.2·§3.1-§3.4 / Strang Ch 1) | ①·② 토대 |
| 4-5 | Gauss 소거 · 행렬곱 · 역행렬 · LU (MML §2.3 / Strang Ch 2) | ② 풀이, ③ 첫 분해 |
| 6-8 | Vector space · Subspace · 4 fundamental subspaces · Basis · Dimension (MML §2.4-§2.6 / Strang Ch 3) | ② 구조·골격 |
| 9 | Orthogonality · Projection (MML §3.6·§3.8 / Strang Ch 4.1-4.2) | ②·③ |
| 10 | Least squares · 정규방정식 · 다중공선성 (MML §3.8 / Strang Ch 4.3) | ③·④ 회귀 |
| 11 | Orthonormal basis · Gram-Schmidt · QR · Rotation (MML §3.5·§3.9 / Strang Ch 4.4) | ③·④ |
| 12 | Determinant + Part 1 종합 문제 풀기 (MML §4.1 / Strang Ch 5) | ②·종합 |

**핵심 명제**: $A\mathbf{x} = \mathbf{b}$의 해는 **$A$의 4 fundamental subspaces**로 완전히 결정됩니다.

---

## C-4. Part 2 흐름: 분해와 수학 도구

| 회차 | 주제 (MML §·Strang Ch 발췌) | 단계 |
|:---:|---|:---:|
| 1-2 | Eigenvalue · Diagonalization · Spectral theorem (MML §4.2·§4.4 / Strang Ch 6.1-6.4) | ③ 정사각 분해 |
| 3 | Positive definite · 이차형식 · Cholesky (MML §4.3 / Strang Ch 6.5) | ③ |
| 4 | SVD 정식·기하 해석 (MML §4.5 / Strang Ch 7.1-7.2) | ③ 임의 분해 |
| 5 | Eckart-Young · Matrix Approx · Linear Transformation (MML §4.6·§2.7·§2.8 / Strang Ch 7.3-7.4) | ③·④ 압축 |
| 6-7 | Vector Calculus (Jacobian · Hessian · Newton) (MML §5.1-§5.8) | ④ 신경망 미분 |
| 8 | Probability · MLE · KL divergence · Cross entropy · MVN (MML §6·§8.3) | ④ LLM·VAE 수학 |
| 9 | Continuous Optimization (Convex · Lagrange · KKT) (MML §7.1-§7.3), Part 2 종합 문제 풀기 | ④ 옵티마이저·정규화, 종합 |

---

## C-5. Part 3 흐름: AI 응용과 모델 분해

| 회차 | 주제 | 단계 |
|:---:|---|:---:|
| 1 | Linear Regression (MML Ch 9) | ⑤ ML 응용 |
| 2 | PCA · SVD 동치 (MML Ch 10) | ⑤ |
| 3 | Gaussian Mixture Models · EM (MML Ch 11) | ⑤ |
| 4 | SVM Hard/Soft margin · Hinge · Dual (MML §12.1-§12.3) | ⑤ |
| 5 | Kernel SVM · Kernel trick · RBF · Poly (MML §12.4-§12.5) | ⑤ |
| 6 | CNN · 1D Conv → Toeplitz · 1×1=행렬곱 (자체 교안) | ④ 모델 분해 |
| 7 | Attention 분해 · Embedding=행렬곱 · Multi-head 직관 + Equivariance 직관 한 슬라이드 (자체 교안) | ④ 모델 분해 |
| 8 | Case Study 발표, Part 3 종합 문제 풀기 (자체 교안) | 종합 |

**핵심 명제**: 어떤 Matrix도 **SVD로 회전·신축·회전으로 분해**됩니다. 그 위에 미분·확률·최적화 도구를 쌓아 **임의 AI 모듈을 선형대수 객체로 환원**할 수 있습니다.

---

# D. CS·AI 흐름

> 수학 5대 줄기가 컴퓨터와 AI에서 어디에 등장하는지를 봅니다.

## D-1. 데이터·연산의 LA 환원

| CS·AI 객체 | LA 환원 | 회차 |
|---|---|---|
| 이미지·텍스트·사용자 | $\mathbb{R}^d$ **Vector** | 1 |
| 데이터셋 ($n$개 샘플) | $\mathbb{R}^{n \times d}$ **Matrix** | 3 |
| 신경망 한 층 | $\mathbf{x} \mapsto W\mathbf{x} + \mathbf{b}$ | 3·6 |
| 손실 함수의 미분 | **Jacobian / Hessian** | Part 2 6-7 |
| 학습 = 최소화 | **Least squares · 정규방정식** | 10 |
| 추론 = Matrix 곱 누적 | **BLAS · GPU 병렬화** | 3 |
| 모델 압축·Quantization(양자화) | **Low-rank Decomposition (SVD·LoRA)** | Part 2 4-5 |

---

## D-2. AI 모델 안의 LA 객체

Transformer 한 블록의 입력 → 출력 흐름:

| 단계 | 식 | LA 객체 | 회차 |
|---|---|---|:---:|
| **입력** | $\mathbf{x} \in \mathbb{R}^d$ | Vector | 1 |
| **Embedding** (임베딩) | $E\mathbf{x}$ | Matrix·Vector 곱 | 3 |
| **Attention** | $\mathrm{softmax}\!\left(\frac{QK^\top}{\sqrt{d}}\right)V$ | 모든 쌍의 Inner product | 2 · Part 3 7 |
| **FFN** | $W_2\,\mathrm{ReLU}(W_1\mathbf{x}+\mathbf{b}_1)+\mathbf{b}_2$ | affine 변환 | 6 |
| **출력** | $\mathrm{softmax}(\cdots)$ | 확률 Vector | · |

각 작업 단계가 회차별 주제와 일대일로 대응합니다.

---

## D-3. Decomposition이 AI를 만듭니다

| 응용 | Decomposition | 의미 |
|---|---|---|
| **PCA** (차원 축소) | SVD / Eigenvalue Decomposition | "주된 방향" 만 남깁니다 |
| **회귀** (선형 모델) | $A^\top A$ 풀이 (QR) | "데이터를 가장 잘 설명하는 선" |
| **LoRA** (LLM 효율 미세조정) | rank-r Low-rank 근사 | "$W$의 변화량을 r-차원으로" |
| **추천 시스템** | Matrix Decomposition | "사용자·아이템의 공통 잠재 요인" |
| **이미지 압축·JPEG·MP3** | DCT (직교 분해) | "주파수별 에너지 누적" |
| **Whitening · BatchNorm** | 공분산 Diagonalization | "축마다 분산 1로" |

Decomposition이 AI의 절반입니다. 이 강의 후반부가 다 이 표 안에 있습니다.

---

## E-1. 4단 운영 모델

| 자료 | 위상 | 사용 시점 | 비유 |
|---|---|---|---|
| **MML** | 메인 | 정의·정리·예제·ML 응용 (LR·PCA·GMM·SVM) | 지도 |
| **Strang** | 발췌 | 시그니처 자산 10개를 본문 발췌 박스로 사용 | 명소 사진첩 |
| **3Blue1Brown** | 시각 | 사전 시청 | 위성사진 |
| **NumPy / PyTorch** | 실습 | 매 회차 ipynb | 탐사 장비 |

**왜 MML이 메인입니까?**
- MML은 LA 표준 (Vector·Matrix·Linear equation·Subspace·Determinant) 외에도 Vector Calculus·Probability·Optimization·ML 4대 응용 (LR·PCA·GMM·SVM)을 한 권에 담아 본 강의의 Part 1·2·3을 모두 커버합니다.
- 무료 공식 PDF가 공개되어 있어 학생 모두가 동일 텍스트로 접근할 수 있습니다.
- Strang은 Row·Column picture, Cauchy-Schwarz 판별식, 4 fundamental subspaces 등 **시그니처 자산 10개**를 본문 발췌 박스로 가져옵니다 (📚 박스).
- EoLA는 직관·시각 잡기에 좋습니다.

---

## E-2. 매 회차 reading 패턴

```
회차 시작 24시간 전:
  ① MML 해당 절 본문 + 예제 (메인)
  ② Strang 해당 절 발췌 (시그니처 자산 회차에 한정)
  ③ 3Blue1Brown EoLA 해당 편 1편

회차 종료 직후:
  ④ 강의교안 (07/Part1/N회차_*.md) 다시 읽기
  ⑤ 회차 ipynb (11/Part1/N_*.ipynb) 실행
  ⑥ 과제 (04_과제/Part1/N회차_homework.md) 착수
```

**24시간 전·직후의 2회 노출**이 누적 학습 정착의 결정 변수입니다.

---

## F-1. Part 1 종료 시 (12회차 후)

학생은 다음을 할 수 있습니다.

- [ ] Vector·Matrix·Linear equation Definition을 정확히 진술하고 손계산할 수 있습니다.
- [ ] $A\mathbf{x} = \mathbf{b}$의 해 존재·유일성을 **4 기본 Subspace**로 판별할 수 있습니다.
- [ ] LU·QR Decomposition을 정의대로 직접 구현할 수 있습니다.
- [ ] 정규방정식 $A^\top A \hat\beta = A^\top \mathbf{b}$로 회귀를 풀 수 있습니다.
- [ ] Gram-Schmidt를 직접 구현할 수 있습니다.
- [ ] Subspace · Projection · 직교 여공간의 Definition·Theorem을 진술할 수 있습니다.

---

## F-2. Part 2 종료 시 (9회차 후)

- [ ] Eigenvalue Decomposition · SVD의 Definition·계산법을 자유롭게 사용할 수 있습니다.
- [ ] PCA·Low-rank 근사를 SVD로 **한 줄에 구현**할 수 있습니다.
- [ ] Jacobian·Hessian으로 신경망 한 층의 미분을 분해할 수 있습니다.

## F-3. Part 3 종료 시 (8회차 후)

- [ ] CNN convolution을 1D Toeplitz matrix로 환원하고 1×1 convolution이 일반 행렬곱임을 설명할 수 있습니다.
- [ ] **Attention $\mathrm{softmax}(QK^\top/\sqrt{d_k})V$를 LA 객체로 분해**하고 Embedding이 행렬곱임을 설명할 수 있습니다. Equivariance(등변성)·Multi-head의 직관도 한 줄로 정리할 수 있습니다.
- [ ] 임의의 AI 모델 한 부분을 골라 LA 분해 보고서를 작성할 수 있습니다 (Case Study).

---

## F-4. 시그니처 능력: "수학 → 코드 → 분해 보고"

| 단계 | 내용 |
|:---:|---|
| 1 | **논문에서 식을 봅니다** |
| 2 | Definition·Theorem으로 분해합니다 ("이건 SVD다", "이건 4 Subspace다") |
| 3 | **NumPy / PyTorch로 한 줄씩 구현합니다** |
| 4 | 실제 데이터에서 검증합니다 |
| 5 | 보고서로 정리합니다 |

LLM 시대에 LA를 **다시 배우는 이유**: 라이브러리 호출 한 줄 안에 무엇이 들어 있는지 **알면서 부르는** 사람이 되기 위해서입니다.

---

# G. 시그니처 시연: 손글씨 "7"의 평균은 어떻게 생겼을까요

> 지금까지의 수학·CS 흐름이 **가장 친숙한 한 예제**에 모이는 지점입니다.

## G-1. 질문

손글씨 숫자 데이터 (MNIST)에서 **숫자 "7"이라고 적힌 모든 이미지를 평균내면** 어떤 그림이 나올까요?

| 직관 후보 | 결과 |
|---|---|
| (가) 무의미한 잡음? | ❌ |
| (나) 한 사람의 7만 보임? | ❌ |
| (다) **"7의 본질" 같은 흐릿한 7 모양** | ✅ |

<div class="analogy">

**직관 (평균 얼굴 비유)**: 100명의 얼굴을 평균하면 한 사람의 얼굴이 아니라 "**모든 사람의 공통점**"이 보입니다. 손글씨 7도 마찬가지로, 한 사람의 7이 아니라 "7의 본질"이 평균에 나타납니다.

</div>

→ 이 단순한 질문의 답이 **PCA·Embedding·표현 학습**의 출발점입니다.

---

## G-2. 한 줄의 수학

이미지 한 장을 **Vector** $\mathbf{x}_i \in \mathbb{R}^{784}$ (28×28 픽셀)로 봅니다 (1회차).

숫자 "7"인 모든 이미지를 모은 집합 $\{\mathbf{x}_1, \mathbf{x}_2, \ldots, \mathbf{x}_n\}$의 **Vector 평균**:

$$\mathbf{m} = \frac{1}{n}\sum_{i=1}^{n}\mathbf{x}_i \;\in\; \mathbb{R}^{784}$$

이 한 식 안에 들어 있는 1회차의 모든 것:

- "이미지를 Vector로 본다": Vector의 Definition
- "Vector들을 더한다": Vector 덧셈
- "$\frac{1}{n}$을 곱한다": Scalar(스칼라)곱

---

## G-3. 코드: 단 한 줄

```python
mean_seven = X[y == 7].mean(axis=0).reshape(28, 28)
plt.imshow(mean_seven, cmap='gray')
```

- 수학 정의 1줄 → 코드 1줄 → 그림 1장
- 이것이 **이 강의 모든 회차의 표준 사이클**입니다

→ 노트북 `11_주피터노트북/Part1/00_Introduction_평균이미지.ipynb`를 함께 실행합니다.

---

## G-4. 본 시연에 들어 있는 29회차의 지점

| 시연의 부분 | 회차 |
|---|:---:|
| 이미지를 Vector로 보기 ($\mathbb{R}^{784}$) | **1** |
| Vector 덧셈·Scalar곱 (평균 연산) | **1** |
| 데이터셋을 Matrix로 ($\mathbb{R}^{n\times 784}$) | **3** |
| 평균 Vector·중심화 (데이터의 "원점") | **7 · Part 3 2** |
| 평균을 빼고 본 분산의 주방향 (**PCA**) | **Part 3 2** |
| 분류기로 확장 (가장 가까운 평균 ⇒ 클래스) | **2·10** |

가장 단순한 수학(Vector 평균) 한 줄이 **29회차 전체의 입구**입니다.

---

## G-5. 노트북에서 봅니다: 실행 흐름

1. MNIST 손글씨 로드: Matrix $X \in \mathbb{R}^{1797 \times 64}$, 레이블 $\mathbf{y}$
2. 한 장을 Vector로: `X[0].shape == (64,)` 확인 (1회차)
3. **0~9 각 숫자의 평균 이미지 계산**: `X[y==k].mean(axis=0)` (1회차)
4. 시각화: 10개 평균이 흐릿한 0, 1, ..., 9 모양으로 보입니다.
5. **응용**: 새 이미지를 가장 가까운 평균으로 분류합니다 (간단한 분류기).
6. 보너스: 평균을 빼면 무엇이 남는가 (PCA 미리보기)

---

## H. 1회차 사전 reading 안내

**1회차 주제**: Vector · Linear combination(선형결합) · Span(생성공간), MML §2.1 도입

> 본 회차에서 본 평균 이미지 시연의 토대로 **Vector의 Definition·$\mathbb{R}^n$·Linear combination**을 1회차에 정식 수학으로 맞춥니다.
> **Norm·Inner product·Cosine similarity는 2회차** (MML §3.1-§3.4), Cauchy-Schwarz까지의 흐름은 2회차에서 다룹니다.

**1회차 시작 24시간 전까지**

- [ ] **MML** §2.1 (Vectors): 메인 reading
- [ ] **3Blue1Brown EoLA** Ch.1 (Vectors), Ch.2 (Linear combinations, span, basis): 시각 사전 시청
- [ ] (선택) **Strang** Ch 1.1 발췌: Vector 직관, 평행사변형 법칙 그림 참조

**0회차 종료 후 권장**

- 본 회차에서 본 평균 이미지 시연을 `00_Introduction_평균이미지.ipynb`에서 **다른 숫자 (예: 4·8)로 재실행**해보세요.
- 어색한 부분을 1회차 강의에서 질문할 수 있도록 준비합니다.
- MML (메인) 공식 PDF·Strang (발췌) PDF·종이본을 확인합니다. 매 회차 reading의 시작점입니다.

---

<!-- _class: exercise -->

# 본 회차 마무리 문제

**본 회차 핵심 질문**: "수학 정의 한 줄이 어떻게 AI 모델 한 줄이 됩니까?"
본 회차에서는 **Vector의 평균**이라는 가장 단순한 예로 일부 답을 다루었습니다.

### 1회차 시작 전 풀어볼 3문제

본 회차에서 본 객체 (평균 Vector·5층 청사진·29회차 구조)만으로 답할 수 있는 문제들입니다.

**(a) (평균 Vector 표기)** MNIST에서 숫자 "7"인 이미지 $n$장 $\mathbf{x}_1, \ldots, \mathbf{x}_n \in \mathbb{R}^{784}$이 주어졌다고 하자. 그 평균 이미지 $\mathbf{m}$을 **Vector(벡터)·Linear combination(선형결합)** 두 단어를 모두 사용해 한 줄로 표기하시오. ($\sum$ 기호 사용 가능)

**(b) (5층 청사진 매핑)** Self-attention 한 줄 $\mathrm{softmax}(QK^\top / \sqrt{d_k})\,V$를 본 회차에서 본 **5층 건물 (Vector space · Inner product · Norm · Matrix · Vector 곱)** 의 도움으로 만든다고 할 때, 5개 층 중 **두 개**를 골라 이 식의 어느 부분이 그 층에 대응되는지 한 줄씩 적으시오.

**(c) (강좌 구조)** 이 강의는 32회차가 아니라 29회차로 운영됩니다. Part 1·2·3은 각각 몇 회차이고, 1회차당 강의 시간은 몇 시간입니까? 총 강의 시간은 몇 시간입니까?

→ 1회차에서는 **Vector·Linear combination**으로 평균 Vector $\mathbf{m}$의 정의를 수학적으로 다지고, $\mathbb{R}^n$의 두 연산을 정식으로 도입합니다. 길이·각도 (Norm·Inner product)는 2회차의 주제이며, 본 회차에서는 그 토대 (Vector·평균)만 단단히 합니다.

---

## 마무리 문제 운영 원칙 (안내)

매 회차 다음 4단 사이클로 운영합니다.

| 단계 | 시점 | 내용 |
|---|---|---|
| ① 핵심 질문 | 회차 시작 (오프닝) | 해당 회차의 한 질문 |
| ② Review | 회차 시작 (10분) | 지난 차시 숙제 풀이 |
| ③ 본 강의 | 회차 중반 | Definition·Theorem·유제 |
| ④ 마무리 문제, 숙제 | 회차 끝 (15분) | 즉석 풀이, 유사 문제 → 다음 회차 Review 재료 |

본 회차 (0회차)는 ④의 첫 출발입니다. 위 문제가 **1회차 시작 시 Review 문제**가 됩니다.

---

<!-- _class: lead -->

# Q & A

본 회차는 Definition·증명 없이 큰 그림만 다루었습니다.
**다음 회차부터 본격 수학을 시작합니다.**

`HANDOUT`: 본 PDF + `00_Introduction_평균이미지.ipynb`
