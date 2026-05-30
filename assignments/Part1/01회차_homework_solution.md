# 1회차 과제 답안

> 본 답안은 학생 자율 풀이 후 자기 점검용이다. 시험·평가가 아니다. 강의 시간에 함께 풀이를 검토한다.
> 본 답안은 본 회차에서 다룬 객체(Vector·$\mathbb{R}^n$·덧셈·Scalar곱·Linear combination·Span 직관·표준 단위Vector $\mathbf{e}_i$)만 사용한다.

## 수학 문제

### 문제 1 답안 (정의·진위)

**(a) 참.** Linear combination(선형결합)의 정의 1.4에 따르면 Vector $\mathbf{v}_1, \ldots, \mathbf{v}_k \in \mathbb{R}^n$, Scalar $\alpha_1, \ldots, \alpha_k \in \mathbb{R}$에 대한 식 $\sum_{i=1}^{k} \alpha_i \mathbf{v}_i$가 곧 Linear combination이다. 본 문제는 $k=2$, $\mathbf{v}_1 = \mathbf{u}, \mathbf{v}_2 = \mathbf{v}$, 계수 $\alpha_1 = 2, \alpha_2 = -3$인 경우이다. 계수는 음수·0 모두 허용되므로(C-1) $2\mathbf{u} - 3\mathbf{v} = 2\mathbf{u} + (-3)\mathbf{v}$는 $\mathbf{u}, \mathbf{v}$의 Linear combination이다.

**(b) 참.** 모든 계수를 0으로 잡으면 $0 \cdot \mathbf{v}_1 + 0 \cdot \mathbf{v}_2 + \cdots + 0 \cdot \mathbf{v}_k = \mathbf{0}$이다(정의 1.3에서 $0 \cdot \mathbf{x} = \mathbf{0}$, 정의 1.2의 성분별 합으로 $\mathbf{0} + \mathbf{0} = \mathbf{0}$). 따라서 영Vector $\mathbf{0}$은 **항상** 자명한 계수 선택 $\alpha_1 = \cdots = \alpha_k = 0$으로 표현된다. 이를 **자명한 Linear combination**(trivial linear combination)이라 한다.

**(c) 거짓.** Span의 직관(C-4)에 따르면 두 Vector가 평행할 때 Span은 평면이 아니라 한 직선으로 축소된다. 반례: $\mathbf{v}_1 = (1, 1)^\top$, $\mathbf{v}_2 = (2, 2)^\top \in \mathbb{R}^2$. $\mathbf{v}_2 = 2\mathbf{v}_1$이므로 $\alpha_1 \mathbf{v}_1 + \alpha_2 \mathbf{v}_2 = (\alpha_1 + 2\alpha_2)\mathbf{v}_1$이고, Span은 $\mathbf{v}_1$ 방향의 한 직선뿐이다.

평면이 되는 조건은 두 Vector가 **평행이 아닐 때**(어느 한쪽이 다른 쪽의 Scalar 배가 아닐 때)이다. 단 $\mathbb{R}^2$에서는 평면이 곧 $\mathbb{R}^2$ 전체이고, $\mathbb{R}^3$ 이상에서는 원점을 지나는 한 평면이다. "진짜 다른 방향" 개수에 따라 Span의 차원이 결정된다는 점은 8회차 Linear independence에서 정식화한다.

### 문제 2 답안 (계산)

$\mathbf{a} = (3, 1, -2, 4)^\top$, $\mathbf{b} = (-1, 2, 5, 0)^\top \in \mathbb{R}^4$.

**(a)** 정의 1.2(성분별 합)에 따라
$$\mathbf{a} + \mathbf{b} = (3 + (-1),\, 1 + 2,\, -2 + 5,\, 4 + 0)^\top = (2, 3, 3, 4)^\top$$
$$\mathbf{a} - \mathbf{b} = \mathbf{a} + (-1)\mathbf{b} = (3 - (-1),\, 1 - 2,\, -2 - 5,\, 4 - 0)^\top = (4, -1, -7, 4)^\top$$

**(b)** $2\mathbf{a} = (6, 2, -4, 8)^\top$(정의 1.3, 성분별 Scalar곱). $3\mathbf{b} = (-3, 6, 15, 0)^\top$. 따라서
$$\mathbf{c} = 2\mathbf{a} - 3\mathbf{b} = (6 - (-3),\, 2 - 6,\, -4 - 15,\, 8 - 0)^\top = (9, -4, -19, 8)^\top$$

**(c)** $\mathbf{w} = x_1 \mathbf{v}_1 + x_2 \mathbf{v}_2$를 성분별로 풀면
$$x_1 (1, 0)^\top + x_2 (1, 1)^\top = (x_1 + x_2,\, x_2)^\top = (3, 2)^\top$$
이므로 $x_2 = 2$, $x_1 + x_2 = 3 \Rightarrow x_1 = 1$.

검산: $1 \cdot (1, 0)^\top + 2 \cdot (1, 1)^\top = (1, 0)^\top + (2, 2)^\top = (3, 2)^\top$. ✓

**(d)** 정의에 따라 $\mathbf{e}_1 = (1, 0, 0)^\top$, $\mathbf{e}_2 = (0, 1, 0)^\top$, $\mathbf{e}_3 = (0, 0, 1)^\top \in \mathbb{R}^3$이다. 정의 1.3·1.2를 적용하면
$$\mathbf{x} = 4\mathbf{e}_1 - 2\mathbf{e}_2 + \mathbf{e}_3 = (4, 0, 0)^\top + (0, -2, 0)^\top + (0, 0, 1)^\top = (4, -2, 1)^\top$$

### 문제 3 답안 (증명·응용)

**(a) 존재성·유일성 증명.**

*존재성*: 임의의 $\mathbf{x} = (x_1, \ldots, x_n)^\top \in \mathbb{R}^n$에 대해
$$x_1 \mathbf{e}_1 + x_2 \mathbf{e}_2 + \cdots + x_n \mathbf{e}_n$$
의 $i$번째 성분을 정의 1.2·1.3으로 계산한다. $\mathbf{e}_j$의 $i$번째 성분은 $j = i$이면 1, $j \neq i$이면 0이므로(B-6 표준 단위Vector 정의), $x_j \mathbf{e}_j$의 $i$번째 성분은 $j = i$일 때만 $x_i$, 다른 모든 $j$에서는 0이다. 성분별 합을 취하면 $i$번째 성분은 $x_i$이다. 모든 $i$에서 $\mathbf{x}$의 $i$번째 성분과 일치하므로 $\mathbf{x} = \sum_i x_i \mathbf{e}_i$.

*유일성*: $\mathbf{x} = \sum_{i=1}^{n} c_i \mathbf{e}_i$인 또 다른 계수 $(c_1, \ldots, c_n)$이 존재한다고 가정한다. 좌·우변의 $i$번째 성분을 비교하면 좌변은 $x_i$, 우변은 위의 같은 계산으로 $c_i$이다. 따라서 $c_i = x_i$이 모든 $i$에서 성립하므로 계수는 유일하다. $\blacksquare$

**(b) MNIST 평균 이미지가 Linear combination임.**

$\mathbf{x}_1, \ldots, \mathbf{x}_n \in \mathbb{R}^{784}$에 대해 평균 이미지는
$$\mathbf{m} = \frac{1}{n}\sum_{i=1}^{n} \mathbf{x}_i = \frac{1}{n}\mathbf{x}_1 + \frac{1}{n}\mathbf{x}_2 + \cdots + \frac{1}{n}\mathbf{x}_n$$
이다. 이는 Vector $\mathbf{x}_1, \ldots, \mathbf{x}_n$에 대해 모든 계수가 $\alpha_i = 1/n \in \mathbb{R}$로 같은 Linear combination이다(정의 1.4).

*결과가 다시 $\mathbb{R}^{784}$ Vector인 이유*: 본 회차 두 연산 정의 1.2·1.3은 모두 결과가 $\mathbb{R}^n$ Vector이도록 정의되어 있다(덧셈은 같은 차원 두 Vector를 같은 차원 Vector로, Scalar곱은 $\mathbb{R}^n$ Vector를 $\mathbb{R}^n$ Vector로 보낸다). 따라서 두 연산만으로 만든 Linear combination도 다시 $\mathbb{R}^{784}$ Vector이다.

## 코딩 문제 (선택)

### 문제 1 답안 (직접 구현)

```python
import numpy as np

def vec_add(u, v):
    """Vector 덧셈 직접 구현 (성분 단위 for문, 정의 1.2)"""
    assert len(u) == len(v), "차원이 다른 Vector는 덧셈이 정의되지 않음 (B-3)"
    n = len(u)
    out = np.empty(n, dtype=float)
    for i in range(n):
        out[i] = u[i] + v[i]
    return out

def scalar_mul(c, v):
    """Scalar곱 직접 구현 (정의 1.3)"""
    n = len(v)
    out = np.empty(n, dtype=float)
    for i in range(n):
        out[i] = c * v[i]
    return out

def linear_combination(coeffs, vectors):
    """sum_i coeffs[i] * vectors[i] 를 vec_add·scalar_mul만으로 계산.
    정의 1.4 Linear combination."""
    assert len(coeffs) == len(vectors) and len(vectors) > 0
    # 영Vector로 초기화: 0 * vectors[0] = 0 (정의 1.3)
    acc = scalar_mul(0.0, vectors[0])
    for i in range(len(coeffs)):
        acc = vec_add(acc, scalar_mul(coeffs[i], vectors[i]))
    return acc

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

검증 결과: `OK: Vector·Linear combination 검증 통과` 출력. 본 회차 정의 1.2·1.3·1.4를 그대로 코드로 옮긴 구현이다.

### 문제 2 답안 (시각화·응용)

```python
from sklearn.datasets import load_digits
import matplotlib.pyplot as plt
import numpy as np

X, ylabel = load_digits(return_X_y=True)  # X: (1797, 64)

# TODO 1: 숫자 "3"인 이미지 처음 10장을 (10, 64) 행렬로 추출
idx = np.where(ylabel == 3)[0][:10]   # ylabel == 3 의 처음 10개 인덱스
imgs = X[idx]  # (10, 64)

# TODO 2: 평균 이미지 (Linear combination: 각 계수 1/10)
# m = (1/10) * x_1 + (1/10) * x_2 + ... + (1/10) * x_10 (정의 1.4)
mean_img = imgs.mean(axis=0)   # shape (64,)
# 식 그대로의 표현: mean_img = (1.0 / 10) * imgs.sum(axis=0)

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

결과: 원본 3장은 각자 다른 필체의 숫자 "3" 모양으로, 평균 이미지는 본 회차 D-2에서 본 MNIST 평균 그림과 같이 "3의 본질"에 해당하는 흐릿한 3 모양으로 나타난다. 평균 이미지가 다시 $\mathbb{R}^{64}$ Vector이고 8×8 reshape이 가능한 이유는 두 연산이 $\mathbb{R}^{64}$ 안에서 닫혀 있기 때문이다(문제 3 (b) 결론과 동일).

## 자기 점검 체크리스트 답안

- $\mathbb{R}^n$ Vector·두 연산·Linear combination의 정의 — 정의 1.1·1.2·1.3·1.4를 그대로 진술하면 된다.
- 평균 이미지가 계수 균등 Linear combination임을 식으로 풀어쓰기 — 문제 3 (b)의 첫 식 참조.
- 표준 단위Vector $\mathbf{e}_i$로의 분해 유일성 — 문제 3 (a)의 한 줄 요약: "$i$번째 성분만 비교하면 계수가 곧 성분 $x_i$로 결정된다."
- 코딩 진행 시 `np.allclose(atol=1e-8)` 검증 — 문제 1 코드 마지막 `print("OK: ...")` 출력 확인.

## 다음 회차로 가져갈 질문 안내

본 회차의 두 연산만으로는 "두 Vector가 얼마나 비슷한가"를 잴 수 없다. 다음 회차에서 Norm $\|\cdot\|_2$과 Dot product $\mathbf{u}\cdot\mathbf{v}$를 도입하여 길이·각도·Cosine similarity로 답한다.
