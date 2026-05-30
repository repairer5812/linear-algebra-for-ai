# 과제 3회차 답안: Matrix(행렬)·Matrix-Vector 곱(Row picture·Column picture)

> 본 답안은 학생 자율 풀이 후 **자기 점검용**이다. 시험·평가가 아니다.
> 강의교안 3회차의 정의 번호(정의 2.1~2.6)를 그대로 인용한다.

---

## 수학 문제

### 문제 1 (정의·진위)

**(a) Row picture와 Column picture가 같은 결과를 낸다.**

정의 2.3에서 $(A\mathbf{x})_i = \sum_{j=1}^{n} a_{ij} x_j$이다. 이 합을 두 방식으로 묶는다.

- **Row picture (정의 2.4)**: $i$를 고정하면 $\sum_j a_{ij} x_j = \mathbf{r}_i \cdot \mathbf{x}$, 즉 $i$행과 $\mathbf{x}$의 Dot product.
- **Column picture (정의 2.5)**: $\left(\sum_j x_j \mathbf{a}_j\right)_i = \sum_j x_j (\mathbf{a}_j)_i = \sum_j x_j a_{ij} = \sum_j a_{ij} x_j$.

두 표현의 $i$성분이 모두 $\sum_j a_{ij} x_j$로 같으므로 $A\mathbf{x}$ 전체가 일치한다. **같은 식을 다른 단위(행 vs 열)로 묶었을 뿐**이다. $\blacksquare$

**(b) $A\mathbf{x} = \mathbf{b}$의 해 존재 조건 (Column picture 설명).**

Column picture로 보면 $A\mathbf{x} = x_1 \mathbf{a}_1 + \cdots + x_n \mathbf{a}_n$이다. 따라서 $A\mathbf{x} = \mathbf{b}$를 푼다는 것은 **$\mathbf{b}$를 $A$ 열들의 Linear combination으로 쓸 계수 $(x_1, \ldots, x_n)$가 있는가**를 묻는 것이다. 그런 계수가 존재할 필요충분조건은 $\mathbf{b} \in \mathrm{span}(\mathbf{a}_1, \ldots, \mathbf{a}_n) = \mathrm{col}(A)$이다. $\mathbf{b}$가 Column space 밖에 있으면 어떤 계수로도 도달할 수 없으므로 해가 없다.

**(c) $A^\top A$는 정사각 대칭 행렬이다.**

$A \in \mathbb{R}^{m \times n}$이면 $A^\top \in \mathbb{R}^{n \times m}$이므로 $A^\top A \in \mathbb{R}^{n \times n}$, 정사각이다. 대칭은 Transpose가 자기 자신임을 보이면 된다. $(AB)^\top = B^\top A^\top$ (문제 3(a))와 $(A^\top)^\top = A$를 쓰면
$$(A^\top A)^\top = A^\top (A^\top)^\top = A^\top A.$$
따라서 $A^\top A$는 대칭이다. $\blacksquare$

---

### 문제 2 (계산)

$A = \begin{pmatrix} 1 & 2 & 0 \\ 3 & -1 & 4 \end{pmatrix}$, $\mathbf{x} = (2, 1, -1)^\top$, $B = \begin{pmatrix} 1 & 0 \\ 2 & 1 \\ 0 & 3 \end{pmatrix}$.

**(a) Row picture.**

- 1행: $(1, 2, 0) \cdot (2, 1, -1) = 2 + 2 + 0 = 4$
- 2행: $(3, -1, 4) \cdot (2, 1, -1) = 6 - 1 - 4 = 1$

$\therefore A\mathbf{x} = (4,\ 1)^\top$.

**(b) Column picture.**

$A$의 열: $\mathbf{a}_1 = (1, 3)^\top$, $\mathbf{a}_2 = (2, -1)^\top$, $\mathbf{a}_3 = (0, 4)^\top$.

$$2\mathbf{a}_1 + 1\cdot\mathbf{a}_2 - 1\cdot\mathbf{a}_3 = (2, 6) + (2, -1) - (0, 4) = (4,\ 1)^\top.$$

**검산**: (a)의 $(4, 1)^\top$과 일치한다.

**(c) $A^\top$과 $AB$.**

$$A^\top = \begin{pmatrix} 1 & 3 \\ 2 & -1 \\ 0 & 4 \end{pmatrix} \in \mathbb{R}^{3 \times 2}.$$

$AB \in \mathbb{R}^{2 \times 2}$를 두 해석으로 계산한다.

*해석 1 (원소 = Inner product)*:

- $(AB)_{11} = (1, 2, 0)\cdot(1, 2, 0) = 1 + 4 + 0 = 5$
- $(AB)_{12} = (1, 2, 0)\cdot(0, 1, 3) = 0 + 2 + 0 = 2$
- $(AB)_{21} = (3, -1, 4)\cdot(1, 2, 0) = 3 - 2 + 0 = 1$
- $(AB)_{22} = (3, -1, 4)\cdot(0, 1, 3) = 0 - 1 + 12 = 11$

$$AB = \begin{pmatrix} 5 & 2 \\ 1 & 11 \end{pmatrix}.$$

*해석 2 (열 묶음, $AB = [A\mathbf{b}_1 \mid A\mathbf{b}_2]$)*:

- $A\mathbf{b}_1 = A(1, 2, 0)^\top = 1\mathbf{a}_1 + 2\mathbf{a}_2 + 0\mathbf{a}_3 = (1, 3) + (4, -2) = (5,\ 1)^\top$
- $A\mathbf{b}_2 = A(0, 1, 3)^\top = 0\mathbf{a}_1 + 1\mathbf{a}_2 + 3\mathbf{a}_3 = (2, -1) + (0, 12) = (2,\ 11)^\top$

두 열을 모으면 $\begin{pmatrix} 5 & 2 \\ 1 & 11 \end{pmatrix}$, **해석 1과 일치한다.**

**(d) $\mathbf{b} = (5, 4)^\top$가 $\mathrm{col}(A)$ 안에 있는가.**

$\mathbf{a}_1 = (1, 3)^\top$과 $\mathbf{a}_2 = (2, -1)^\top$이 Linear independence이므로 ($\det \begin{pmatrix} 1 & 2 \\ 3 & -1 \end{pmatrix} = -7 \ne 0$) 두 열만으로도 $\mathbb{R}^2$ 전체를 Span한다. 따라서 $\mathrm{col}(A) = \mathbb{R}^2$이고 $\mathbf{b}$는 반드시 안에 있다.

계수 한 조: $(x_1, x_2, x_3) = (3, 1, -1)$.

**검산**: $3\mathbf{a}_1 + 1\mathbf{a}_2 - 1\mathbf{a}_3 = (3, 9) + (2, -1) - (0, 4) = (5,\ 4)^\top$. ✓

미지수 3개에 식 2개이므로 해는 **유일하지 않다** (예: $x_3$를 자유변수로 두면 무수히 많다).

---

### 문제 3 (증명·응용)

**(a) $(AB)^\top = B^\top A^\top$ 증명 (원소 표기).**

$A \in \mathbb{R}^{m \times n}$, $B \in \mathbb{R}^{n \times p}$. 좌변의 $(i, j)$ 성분:
$$\big((AB)^\top\big)_{ij} = (AB)_{ji} = \sum_{k=1}^{n} a_{jk} b_{ki}.$$

우변의 $(i, j)$ 성분:
$$(B^\top A^\top)_{ij} = \sum_{k=1}^{n} (B^\top)_{ik} (A^\top)_{kj} = \sum_{k=1}^{n} b_{ki} a_{jk} = \sum_{k=1}^{n} a_{jk} b_{ki}.$$

두 성분이 모든 $(i, j)$에서 같으므로 $(AB)^\top = B^\top A^\top$이다. **순서가 뒤집힌다는 점**이 핵심이다. $\blacksquare$

**(b) 신경망 한 층 $\mathbf{y} = W\mathbf{x} + \mathbf{b}$의 $W\mathbf{x}$를 Column picture로.**

Column picture (정의 2.5)로 보면 $W\mathbf{x} = x_1 \mathbf{w}_1 + x_2 \mathbf{w}_2 + \cdots + x_n \mathbf{w}_n$이다 ($\mathbf{w}_j$는 $W$의 $j$번째 열). 즉 입력 좌표 $x_j$가 $W$의 $j$번째 열 $\mathbf{w}_j$의 계수, 곧 혼합 비율로 작용한다. 한 층의 출력은 "각 입력 특징 $x_j$가 자신에게 대응하는 출력 방향 $\mathbf{w}_j$를 얼마나 켜는가"를 모두 더한 것이며, 도달 가능한 출력 전체는 $W$ 열들이 Span하는 부분공간(곧 $\mathrm{col}(W)$) 안에 놓인다. 같은 곱을 Row picture로 보면 각 출력 뉴런 $y_i = \mathbf{r}_i \cdot \mathbf{x}$가 입력 전체의 가중합이라는 관점이 된다.

---

## 코딩 문제 (선택) 답안

### 문제 1: 직접 구현

```python
import numpy as np

def matvec_row(A, x):
    """Row picture: 각 행과 x의 Dot product"""
    m, n = A.shape
    y = np.zeros(m)
    for i in range(m):
        y[i] = sum(A[i, j] * x[j] for j in range(n))
    return y

def matvec_col(A, x):
    """Column picture: A 열들의 Linear combination"""
    m, n = A.shape
    y = np.zeros(m)
    for j in range(n):
        y += x[j] * A[:, j]
    return y

# 검증
np.random.seed(0)
A = np.random.randn(7, 5); x = np.random.randn(5)
y_row = matvec_row(A, x); y_col = matvec_col(A, x)
assert np.allclose(y_row, y_col, atol=1e-8), "두 해석 불일치"
assert np.allclose(y_row, A @ x, atol=1e-8), "라이브러리와 불일치"
print("OK: Row picture·Column picture 일치")
```

**예상 출력**:

```
OK: Row picture·Column picture 일치
```

### 문제 2: Matrix-Matrix 곱 4해석 비교

```python
import numpy as np

def matmul_inner(A, B):
    """C[i,j] = A 행 i · B 열 j"""
    m, k = A.shape; k2, n = B.shape
    C = np.zeros((m, n))
    for i in range(m):
        for j in range(n):
            C[i, j] = np.dot(A[i, :], B[:, j])
    return C

def matmul_col(A, B):
    """C 의 j번째 열 = A @ B[:, j]"""
    return np.column_stack([A @ B[:, j] for j in range(B.shape[1])])

def matmul_row(A, B):
    """C 의 i번째 행 = A[i, :] @ B"""
    return np.vstack([A[i, :] @ B for i in range(A.shape[0])])

def matmul_outer(A, B):
    """C = sum_k A[:, k] outer B[k, :]"""
    return sum(np.outer(A[:, k], B[k, :]) for k in range(A.shape[1]))

# 검증
np.random.seed(1)
A = np.random.randn(6, 4); B = np.random.randn(4, 5)
C_ref = A @ B
for name, fn in [("inner", matmul_inner), ("col", matmul_col),
                 ("row", matmul_row), ("outer", matmul_outer)]:
    assert np.allclose(fn(A, B), C_ref, atol=1e-8), f"{name} 불일치"
print("OK: 4해석 일치")
```

**예상 출력**:

```
OK: 4해석 일치
```

---

## 자기 점검 체크리스트 (정답 대조)

- [x] $A\mathbf{x}$를 Row·Column 두 해석으로 같은 결과를 손계산했다 (문제 2(a)(b), 모두 $(4, 1)^\top$).
- [x] $A\mathbf{x} = \mathbf{b}$ 해 존재 $\iff$ $\mathbf{b} \in \mathrm{col}(A)$를 설명했다 (문제 1(b)).
- [x] $(AB)^\top = B^\top A^\top$를 원소 표기로 증명했다 (문제 3(a)).
- [x] (코딩) 두 해석 일치·4해석 일치 검증을 통과했다.

## 다음 회차로 가져갈 질문에 대한 메모

본 회차는 $A\mathbf{x} = \mathbf{b}$의 해 존재를 **Column space 소속 여부**로 판정했다. 4회차에서는 실제 해를 구하는 Gauss 소거(Gaussian elimination)·RREF(Reduced Row Echelon Form)와 해의 세 경우(유일해·해 없음·무수해)를 정식 도입한다. 문제 2(d)에서 본 "해가 있으나 유일하지 않은" 상황이 그 무수해 경우의 예고이다.
