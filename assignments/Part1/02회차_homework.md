# 과제 2회차: Norm(노름)·Inner product(내적)·각도·Cauchy-Schwarz·Cosine similarity

> 마감: 다음 회차 강의 시작 전
> 형식: 손풀이(수학) + Jupyter 노트북(코드, 선택)
> 성격: 자기 점검용 학습 도구.

본 과제는 본 회차에서 다룬 객체(Euclidean norm $\|\cdot\|_2$·$\ell_1$·$\ell_\infty$ 보조 노름·Dot product(내적)·각도 정의·Cauchy-Schwarz inequality(코시-슈바르츠 부등식)·삼각부등식(triangle inequality)·Cosine similarity)만 사용한다. Matrix·Matrix·Vector 곱 등 다음 회차 객체는 사용하지 않는다.

## 학습 목표 (본 회차에서 다룬 객체)

- Euclidean norm $\|\mathbf{x}\|_2 = \sqrt{x_1^2 + \cdots + x_n^2}$ (MML §3.1, 강의교안 정의 2.1)
- Norm의 세 본질 성질: 양정성(positive definiteness)·동차성(absolute homogeneity)·삼각부등식(triangle inequality) (강의교안 B-3)
- 보조 노름 $\ell_1, \ell_\infty$ (강의교안 B-4)
- Dot product $\mathbf{u}\cdot\mathbf{v} = \sum_i u_i v_i$ (MML §3.2, 강의교안 정의 2.2)
- Cauchy-Schwarz inequality $|\mathbf{u}\cdot\mathbf{v}| \le \|\mathbf{u}\|_2 \|\mathbf{v}\|_2$ (강의교안 정리 2.1, Strang Ch 1.2 판별식 풀이)
- 각도 $\cos\theta = \frac{\mathbf{u}\cdot\mathbf{v}}{\|\mathbf{u}\|_2 \|\mathbf{v}\|_2}$ (강의교안 정의 2.3)
- Orthogonal(직교): $\mathbf{u}\cdot\mathbf{v} = 0$ (강의교안 정의 2.4)
- Cosine similarity (강의교안 정의 2.5)

## 수학 문제

### 문제 1 (정의·진위)

다음 진위를 판정하고 참이면 정의·식으로 근거를, 거짓이면 반례를 제시한다. 등호 또는 예외 조건을 함께 진술한다.

(a) Euclidean norm은 $\|\mathbf{x}\|_2 = 0 \iff \mathbf{x} = \mathbf{0}$을 만족한다. (양정성)

(b) 임의의 $\mathbf{u}, \mathbf{v} \in \mathbb{R}^n$에 대해 $|\mathbf{u}\cdot\mathbf{v}| = \|\mathbf{u}\|_2 \|\mathbf{v}\|_2$가 성립하는 경우는 $\mathbf{u}, \mathbf{v}$가 평행할 때뿐이다. (Cauchy-Schwarz의 등호 조건)

(c) 두 Vector가 직교(Orthogonal)이면 그들의 합의 노름은 피타고라스 식 $\|\mathbf{u}+\mathbf{v}\|_2^2 = \|\mathbf{u}\|_2^2 + \|\mathbf{v}\|_2^2$을 만족한다.

### 문제 2 (계산)

$\mathbf{u} = (1, 2, -2)^\top$, $\mathbf{v} = (3, 0, 4)^\top \in \mathbb{R}^3$이 주어졌다.

(a) $\|\mathbf{u}\|_2$, $\|\mathbf{v}\|_2$, $\|\mathbf{u}\|_1$, $\|\mathbf{u}\|_\infty$를 모두 계산한다.

(b) $\mathbf{u}\cdot\mathbf{v}$를 계산하고, $\cos\theta$와 두 Vector 사이 각도(라디안 또는 도)를 구한다.

(c) $\mathbf{u}$를 단위Vector $\hat{\mathbf{u}} = \mathbf{u}/\|\mathbf{u}\|_2$로 정규화하고, $\|\hat{\mathbf{u}}\|_2 = 1$을 검산한다.

(d) Cosine similarity $\cos\theta$ 값과 Dot product 값이 다른 이유를 한 문장으로 적는다. ($\|\mathbf{u}\|_2, \|\mathbf{v}\|_2$의 역할)

### 문제 3 (증명·응용)

(a) Cauchy-Schwarz inequality $|\mathbf{u}\cdot\mathbf{v}| \le \|\mathbf{u}\|_2 \|\mathbf{v}\|_2$를 강의교안 C-4의 판별식 풀이로 증명한다. 임의의 $t \in \mathbb{R}$에 대해 $\|\mathbf{u} - t\mathbf{v}\|_2^2 \ge 0$인 사실로부터 시작하여 등호 조건도 도출한다.

(b) 텍스트 검색에서 문서 임베딩 $\mathbf{d} \in \mathbb{R}^{768}$과 질의 임베딩 $\mathbf{q} \in \mathbb{R}^{768}$의 유사도 판정에 왜 Dot product가 아닌 Cosine similarity를 쓰는지를, 문서 길이(노름) 차이에 대한 스케일 불변성과 함께 한 단락으로 설명한다.

## 코딩 문제 (선택)

### 문제 1: 직접 구현

NumPy로 Euclidean norm·Dot product·Cosine similarity를 성분 단위 for문으로 직접 구현한다.

```python
import numpy as np

def my_norm2(x):
    """Euclidean norm 직접 구현"""
    # TODO: x_i^2 누적합 후 sqrt
    pass

def my_dot(u, v):
    """Dot product 직접 구현"""
    # TODO
    pass

def my_cosine(u, v):
    """Cosine similarity 직접 구현 (my_norm2·my_dot만 사용)"""
    # TODO
    pass

# 검증
np.random.seed(0)
u = np.random.randn(10); v = np.random.randn(10)
assert np.isclose(my_norm2(u), np.linalg.norm(u), atol=1e-8)
assert np.isclose(my_dot(u, v), float(u @ v), atol=1e-8)
ref_cos = (u @ v) / (np.linalg.norm(u) * np.linalg.norm(v))
assert np.isclose(my_cosine(u, v), ref_cos, atol=1e-8)
print("OK: Norm·Dot·Cosine 검증 통과")
```

### 문제 2: 응용 (Cosine similarity 검색)

`sklearn.datasets.load_digits`에서 숫자 "7" 이미지 10장과 "1" 이미지 10장을 골라 각각의 평균 Vector를 만든다. 임의의 새 이미지 한 장에 대해 두 평균 Vector와의 Cosine similarity를 비교하여 더 가까운 쪽을 후보 클래스로 출력한다.

```python
from sklearn.datasets import load_digits
import numpy as np

X, y = load_digits(return_X_y=True)

# TODO 1: 숫자 7·1 각각 10장 평균 Vector m7, m1 (Linear combination, 1회차 도구)
m7 = ...  # shape (64,)
m1 = ...

# TODO 2: 새 이미지 한 장 x_new 추출 (예: y==7 11번째)
x_new = ...

# TODO 3: Cosine similarity 두 개 계산 (my_cosine 또는 식 직접)
cos7 = ...
cos1 = ...

print(f"cos(x_new, m7) = {cos7:.4f}")
print(f"cos(x_new, m1) = {cos1:.4f}")
print("후보 클래스:", 7 if cos7 > cos1 else 1)
```

## 자기 점검 체크리스트

- [ ] Norm의 세 성질을 적고 $\mathbb{R}^n$에서 확인할 수 있다.
- [ ] Cauchy-Schwarz inequality의 판별식 풀이 증명을 직접 쓸 수 있다.
- [ ] Dot product 값과 Cosine similarity 값의 차이를 한 문장으로 설명할 수 있다.
- [ ] (코딩 진행 시) Cosine similarity 검증 통과.

## 다음 회차로 가져갈 질문

본 회차의 Norm·Dot product는 두 Vector 사이의 관계를 다룬다. 다음 회차에서 여러 Vector를 한 객체 Matrix(행렬)로 묶고, Matrix·Vector 곱 $A\mathbf{x}$를 Row picture와 Column picture 두 해석으로 도입한다. Column picture는 본 회차에서 본 Linear combination의 직접 연속이다.
