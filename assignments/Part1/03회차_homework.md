# 과제 3회차: Matrix(행렬)·Matrix-Vector 곱(Row picture·Column picture)

> 마감: 다음 회차 강의 시작 전
> 형식: 손풀이(수학) + Jupyter 노트북(코드, 선택)
> 성격: 자기 점검용 학습 도구.

본 과제는 본 회차에서 다룬 객체(Matrix 정의·Transpose(전치)·Symmetric matrix(대칭행렬)·Matrix-Vector 곱의 Row picture·Column picture·Column space의 도입 개념·Matrix-Matrix 곱의 4가지 해석)만 사용한다. 가우스 소거·역행렬·LU 등 다음 회차 객체는 사용하지 않는다.

## 학습 목표 (본 회차에서 다룬 객체)

- $m \times n$ Matrix의 정의와 열 표현 (MML §2.2, 강의교안 정의 2.1·2.2)
- Transpose(전치), Symmetric matrix(대칭행렬) (강의교안 B-3)
- Matrix-Vector 곱의 정의식 (강의교안 정의 2.3)
- Row picture(행 해석): 각 행이 한 식, 해는 초평면(hyperplane)의 교집합 (Strang Ch 1.3·2.1 발췌, 강의교안 정의 2.4)
- Column picture(열 해석): $A\mathbf{x} = \sum_j x_j \mathbf{a}_j$가 $A$ 열들의 Linear combination (강의교안 정의 2.5)
- $A\mathbf{x} = \mathbf{b}$ 해의 존재 의미: $\mathbf{b} \in \mathrm{span}(A\text{의 열})$ 인가 (강의교안 D-1)
- Matrix-Matrix 곱의 4가지 해석 (강의교안 E)

## 수학 문제

### 문제 1 (정의·진위)

(a) Matrix-Vector 곱 $A\mathbf{x}$의 Row picture와 Column picture 두 해석이 같은 결과를 낸다는 사실을, 정의 2.3에서 출발하여 한 줄 식으로 보인다.

(b) $A\mathbf{x} = \mathbf{b}$가 해를 가질 필요충분조건은 $\mathbf{b}$가 $A$ 열들의 Linear combination으로 표현될 수 있다는 사실이다. 이 진술을 Column picture로 설명한다.

(c) 임의의 $A \in \mathbb{R}^{m \times n}$에 대해 $A^\top A$는 정사각 대칭 행렬이다.

### 문제 2 (계산)

다음 Matrix와 Vector가 주어졌다.
$$A = \begin{pmatrix} 1 & 2 & 0 \\ 3 & -1 & 4 \end{pmatrix}, \quad \mathbf{x} = \begin{pmatrix} 2 \\ 1 \\ -1 \end{pmatrix}, \quad B = \begin{pmatrix} 1 & 0 \\ 2 & 1 \\ 0 & 3 \end{pmatrix}$$

(a) $A\mathbf{x}$를 Row picture로 계산한다. 각 행과 $\mathbf{x}$의 Dot product를 한 줄씩 적는다.

(b) $A\mathbf{x}$를 Column picture로 계산한다. $A$의 열 $\mathbf{a}_1, \mathbf{a}_2, \mathbf{a}_3$를 적고 $2\mathbf{a}_1 + 1\cdot\mathbf{a}_2 - 1\cdot\mathbf{a}_3$을 전개한다. 결과가 (a)와 일치함을 검산한다.

(c) $A^\top$과 $A B$를 계산한다. $AB$는 두 가지 해석(원소=Inner product, 열 묶음)으로 각각 한 번씩 계산하여 일치를 확인한다.

(d) $\mathbf{b} = (5, 4)^\top$가 $A$의 Column space 안에 있는지를 Column picture 해석으로 판단한다. 가능하면 한 조 $(x_1, x_2, x_3)$ 계수를 제시한다(유일하지 않아도 된다).

### 문제 3 (증명·응용)

(a) $A \in \mathbb{R}^{m\times n}, B \in \mathbb{R}^{n\times p}$일 때 $(AB)^\top = B^\top A^\top$이 성립함을 정의(원소 표기)로 증명한다.

(b) 신경망의 한 층 $\mathbf{y} = W\mathbf{x} + \mathbf{b}$ ($W \in \mathbb{R}^{m\times n}$)에서 $W\mathbf{x}$ 부분을 Column picture로 해석하면 어떤 의미가 되는지 한 단락으로 설명한다. 입력 좌표 $x_j$가 $W$의 어떤 열의 계수로 작용하는지를 명시한다.

## 코딩 문제 (선택)

### 문제 1: 직접 구현

NumPy로 Matrix-Vector 곱을 Row picture와 Column picture 두 방식으로 직접 구현하고, 결과가 일치함을 검증한다. `A @ x` 같은 라이브러리 호출은 검증용으로만 사용한다.

```python
import numpy as np

def matvec_row(A, x):
    """Row picture: 각 행과 x의 Dot product"""
    m, n = A.shape
    y = np.zeros(m)
    # TODO: for i in range(m): y[i] = sum_j A[i,j]*x[j]
    return y

def matvec_col(A, x):
    """Column picture: A 열들의 Linear combination"""
    m, n = A.shape
    y = np.zeros(m)
    # TODO: for j in range(n): y += x[j] * A[:, j]
    return y

# 검증
np.random.seed(0)
A = np.random.randn(7, 5); x = np.random.randn(5)
y_row = matvec_row(A, x); y_col = matvec_col(A, x)
assert np.allclose(y_row, y_col, atol=1e-8), "두 해석 불일치"
assert np.allclose(y_row, A @ x, atol=1e-8), "라이브러리와 불일치"
print("OK: Row picture·Column picture 일치")
```

### 문제 2: Matrix-Matrix 곱 4해석 비교

$AB$를 (i) 원소=Inner product, (ii) 열 묶음, (iii) 행 묶음, (iv) Outer product(외적)의 합 네 가지 방식으로 직접 구현하고 모두 일치함을 확인한다.

```python
import numpy as np

def matmul_inner(A, B):
    """C[i,j] = A 행 i · B 열 j"""
    # TODO
    pass

def matmul_col(A, B):
    """C 의 j번째 열 = A @ B[:, j]"""
    # TODO
    pass

def matmul_row(A, B):
    """C 의 i번째 행 = A[i, :] @ B"""
    # TODO
    pass

def matmul_outer(A, B):
    """C = sum_k A[:, k] outer B[k, :]"""
    # TODO
    pass

# 검증
np.random.seed(1)
A = np.random.randn(6, 4); B = np.random.randn(4, 5)
C_ref = A @ B
for name, fn in [("inner", matmul_inner), ("col", matmul_col),
                 ("row", matmul_row), ("outer", matmul_outer)]:
    assert np.allclose(fn(A, B), C_ref, atol=1e-8), f"{name} 불일치"
print("OK: 4해석 일치")
```

## 자기 점검 체크리스트

- [ ] $A\mathbf{x}$를 Row·Column 두 해석으로 같은 결과를 손계산할 수 있다.
- [ ] $A\mathbf{x} = \mathbf{b}$ 해가 존재한다 = $\mathbf{b}$가 $A$ 열의 Linear combination이다, 를 한 문장으로 설명할 수 있다.
- [ ] $(AB)^\top = B^\top A^\top$를 정의식으로 증명할 수 있다.
- [ ] (코딩 진행 시) 4해석 일치 검증 통과.

## 다음 회차로 가져갈 질문

본 회차의 Column picture로 $A\mathbf{x} = \mathbf{b}$의 의미를 보았다. 다음 회차에서는 실제로 해를 구하는 알고리즘인 Gauss 소거(Gaussian elimination)·RREF(Reduced Row Echelon Form)와 해의 세 경우(유일해·해 없음·무수해)를 정식 도입한다.
