# 과제 1회차: Vector(벡터)·$\mathbb{R}^n$·Linear combination(선형결합)

> 마감: 다음 회차 강의 시작 전
> 형식: 손풀이(수학) + Jupyter 노트북(코드, 선택)
> 성격: 자기 점검용 학습 도구.

본 과제는 본 회차에서 다룬 객체(Vector·$\mathbb{R}^n$·덧셈·Scalar(스칼라)곱·Linear combination·Span 직관)만 사용한다. Norm·Inner product 등 다음 회차 객체는 사용하지 않는다.

## 학습 목표 (본 회차에서 다룬 객체)

- $\mathbb{R}^n$의 Vector(벡터) 정의와 Column vector(열벡터) 표기 (MML §2.1, 강의교안 B-2)
- 덧셈·Scalar곱 두 연산 (강의교안 B-3)
- Linear combination(선형결합)의 정의 (강의교안 C-1)
- Span(생성공간) 직관 (강의교안 C-3, 정식 정의는 8회차)
- 표준 단위Vector $\mathbf{e}_i$로의 분해 (강의교안 B-6)

## 수학 문제

### 문제 1 (정의·진위)

다음 진위를 판정하고, 참이면 정의·식으로 근거를 제시하며, 거짓이면 반례를 제시한다. 등호 또는 예외 성립 조건을 함께 진술한다.

(a) Vector $\mathbf{u}, \mathbf{v} \in \mathbb{R}^n$에 대해 $2\mathbf{u} - 3\mathbf{v}$는 $\mathbf{u}, \mathbf{v}$의 Linear combination이다.

(b) 영Vector $\mathbf{0}$은 임의의 Vector 집합 $\{\mathbf{v}_1, \ldots, \mathbf{v}_k\} \subset \mathbb{R}^n$의 Linear combination으로 항상 표현된다. 어떤 계수 선택으로 표현되는지를 명시한다.

(c) Vector 두 개가 만드는 Span은 언제나 평면이다.

### 문제 2 (계산)

$\mathbf{a} = (3, 1, -2, 4)^\top$, $\mathbf{b} = (-1, 2, 5, 0)^\top \in \mathbb{R}^4$이 주어졌다.

(a) $\mathbf{a} + \mathbf{b}$와 $\mathbf{a} - \mathbf{b}$를 각각 성분별로 계산한다.

(b) $\mathbf{c} = 2\mathbf{a} - 3\mathbf{b}$를 계산한다.

(c) $\mathbb{R}^2$에서 $\mathbf{v}_1 = (1, 0)^\top$, $\mathbf{v}_2 = (1, 1)^\top$일 때, $\mathbf{w} = (3, 2)^\top$를 $\mathbf{w} = x_1 \mathbf{v}_1 + x_2 \mathbf{v}_2$ 형태의 Linear combination으로 표현하는 계수 $x_1, x_2$를 구하고 검산한다.

(d) $\mathbb{R}^3$에서 $\mathbf{x} = 4\mathbf{e}_1 - 2\mathbf{e}_2 + \mathbf{e}_3$를 성분 표기 $(x_1, x_2, x_3)^\top$으로 적는다.

### 문제 3 (증명·응용)

(a) 임의의 $\mathbf{x} = (x_1, \ldots, x_n)^\top \in \mathbb{R}^n$이 표준 단위Vector $\mathbf{e}_1, \ldots, \mathbf{e}_n$의 Linear combination
$$\mathbf{x} = x_1 \mathbf{e}_1 + x_2 \mathbf{e}_2 + \cdots + x_n \mathbf{e}_n$$
으로 유일하게 표현됨을 보인다. (Hint: $i$번째 성분만 비교한다)

(b) 본 회차 D-1·D-2에서 본 바와 같이 MNIST 28×28 이미지 한 장은 $\mathbb{R}^{784}$ Vector로 펼쳐진다. 같은 클래스(예: 숫자 "7") 이미지 $n$장 $\mathbf{x}_1, \ldots, \mathbf{x}_n \in \mathbb{R}^{784}$의 평균 이미지 $\mathbf{m}$이 모든 계수가 $1/n$인 Linear combination임을 식으로 보이고, 평균을 취해도 결과가 다시 $\mathbb{R}^{784}$ Vector인 이유를 본 회차 두 연산의 성질로 한 문장 설명한다.

## 코딩 문제 (선택)

본 회차 강의교안 E-1은 코딩 실습을 선택으로 안내한다. 시간이 부족하면 수학 문제로 마치고 본 절은 추후에 진행해도 된다.

### 문제 1: 직접 구현

NumPy로 Vector 덧셈·Scalar곱·Linear combination을 성분 단위 for문으로 직접 구현하고, 라이브러리 결과와 `np.allclose(atol=1e-8)`로 비교한다. `np.add`·연산자 `+`·`*` 같은 벡터화 호출은 검증용으로만 허용한다.

```python
import numpy as np

def vec_add(u, v):
    """Vector 덧셈 직접 구현 (성분 단위 for문)"""
    # TODO
    pass

def scalar_mul(c, v):
    """Scalar곱 직접 구현"""
    # TODO
    pass

def linear_combination(coeffs, vectors):
    """coeffs: 길이 k 리스트, vectors: k개의 1D ndarray.
    sum_i coeffs[i] * vectors[i] 를 vec_add·scalar_mul만으로 계산."""
    # TODO
    pass

# 검증
np.random.seed(0)
u = np.random.randn(5)
v = np.random.randn(5)
w = np.random.randn(5)

assert np.allclose(vec_add(u, v), u + v, atol=1e-8)
assert np.allclose(scalar_mul(2.5, u), 2.5 * u, atol=1e-8)

coeffs = [2.0, -3.0, 0.5]
vectors = [u, v, w]
mine = linear_combination(coeffs, vectors)
lib = 2.0 * u - 3.0 * v + 0.5 * w
assert np.allclose(mine, lib, atol=1e-8)
print("OK: Vector·Linear combination 검증 통과")
```

### 문제 2: 시각화·응용

`sklearn.datasets.load_digits`로 8×8 숫자 이미지를 불러 같은 클래스(예: 숫자 "3") 이미지 10장을 $\mathbb{R}^{64}$ Vector로 펼친 뒤 계수 균등한 Linear combination(평균 이미지)을 계산한다. 평균을 다시 8×8로 reshape하여 원본 3장과 함께 시각화한다.

```python
from sklearn.datasets import load_digits
import matplotlib.pyplot as plt
import numpy as np

X, ylabel = load_digits(return_X_y=True)  # X: (1797, 64)

# TODO 1: 숫자 "3"인 이미지 처음 10장을 (10, 64) 행렬로 추출
idx = ...  # FILL: ylabel == 3 의 처음 10개
imgs = X[idx]  # (10, 64)

# TODO 2: 평균 이미지 (Linear combination: 각 계수 1/10)
mean_img = ...  # shape (64,)

# 검증: 평균은 load_digits 픽셀값 범위 안
assert mean_img.shape == (64,)
assert 0 <= mean_img.min() and mean_img.max() <= 16

# 시각화 (제공)
fig, axes = plt.subplots(1, 4, figsize=(11, 3))
for k in range(3):
    axes[k].imshow(imgs[k].reshape(8, 8), cmap='gray')
    axes[k].set_title(f'원본 {k}'); axes[k].axis('off')
axes[3].imshow(mean_img.reshape(8, 8), cmap='gray')
axes[3].set_title('평균(Linear combination)'); axes[3].axis('off')
plt.tight_layout(); plt.show()
```

## 자기 점검 체크리스트

- [ ] $\mathbb{R}^n$ Vector·두 연산·Linear combination의 정의를 손으로 정확히 진술할 수 있다.
- [ ] 평균 이미지가 계수 균등 Linear combination임을 식으로 풀어쓸 수 있다.
- [ ] 표준 단위Vector $\mathbf{e}_i$로의 분해 유일성을 한 줄로 설명할 수 있다.
- [ ] (코딩 진행 시) `np.allclose(atol=1e-8)` 검증 통과.

## 다음 회차로 가져갈 질문

본 회차의 두 연산만으로는 "두 Vector가 얼마나 비슷한가"를 잴 수 없다. 다음 회차에서 Norm(노름)과 Inner product(내적)를 도입하여 길이·각도·Cosine similarity(코사인 유사도)를 정식 정의한다.
