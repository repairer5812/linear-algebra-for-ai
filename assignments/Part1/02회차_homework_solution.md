# 2회차 과제 답안

> 본 답안은 학생 자율 풀이 후 자기 점검용이다. 시험·평가가 아니다. 강의 시간에 함께 풀이를 검토한다.
> 본 답안은 본 회차에서 다룬 객체(Euclidean norm $\|\cdot\|_2$·$\ell_1$·$\ell_\infty$·Dot product·각도 정의·Cauchy-Schwarz inequality·삼각부등식·Orthogonal·Cosine similarity)만 사용한다.

## 수학 문제

### 문제 1 답안 (정의·진위)

**(a) 참.** Euclidean norm의 정의 2.1에 따라 $\|\mathbf{x}\|_2 = \sqrt{x_1^2 + \cdots + x_n^2}$이다. 양정성(positive definiteness, B-3)은 두 방향을 모두 보인다.

(⇐) $\mathbf{x} = \mathbf{0}$이면 모든 $x_i = 0$이고 $\sqrt{0 + \cdots + 0} = 0$이므로 $\|\mathbf{x}\|_2 = 0$.

(⇒) $\|\mathbf{x}\|_2 = 0$이면 $\sqrt{\sum x_i^2} = 0$이므로 $\sum_{i=1}^{n} x_i^2 = 0$이다. 각 $x_i^2 \ge 0$인 실수의 합이 0이려면 모든 $x_i^2 = 0$, 즉 모든 $x_i = 0$이어야 한다. 따라서 $\mathbf{x} = \mathbf{0}$.

**(b) 참.** Cauchy-Schwarz inequality의 등호 조건 $|\mathbf{u}\cdot\mathbf{v}| = \|\mathbf{u}\|_2 \|\mathbf{v}\|_2$는 $\mathbf{u}, \mathbf{v}$가 **선형 종속**(평행), 즉 어느 한쪽이 다른 쪽의 Scalar 배일 때만 성립한다(정리 2.1, 강의교안 C-4). 본 회차 판별식 풀이의 시작점 $\|\mathbf{u} - t\mathbf{v}\|_2^2 \ge 0$에서 등호는 $\mathbf{u} - t\mathbf{v} = \mathbf{0}$, 즉 $\mathbf{u} = t\mathbf{v}$일 때만 가능하다(양정성, (a) 결과 활용). 단 $\mathbf{v} = \mathbf{0}$이면 $\mathbf{u}$가 무엇이든 양변이 모두 0이라 등호가 자명하게 성립한다(이 경우도 평행으로 본다, $\mathbf{0}$은 모든 Vector와 평행으로 약속).

**(c) 참.** Orthogonal 정의 2.4에 따라 $\mathbf{u}\cdot\mathbf{v} = 0$. Dot product의 분배 성질(정의 2.2의 성분별 합에서 직접 도출)을 사용하면
$$\|\mathbf{u}+\mathbf{v}\|_2^2 = (\mathbf{u}+\mathbf{v})\cdot(\mathbf{u}+\mathbf{v}) = \mathbf{u}\cdot\mathbf{u} + 2\,\mathbf{u}\cdot\mathbf{v} + \mathbf{v}\cdot\mathbf{v} = \|\mathbf{u}\|_2^2 + 0 + \|\mathbf{v}\|_2^2$$
이다. 본 회차에서 본 **피타고라스 정리의 Vector 일반화**이다.

### 문제 2 답안 (계산)

$\mathbf{u} = (1, 2, -2)^\top$, $\mathbf{v} = (3, 0, 4)^\top \in \mathbb{R}^3$.

**(a) Norm 계산.**
$$\|\mathbf{u}\|_2 = \sqrt{1^2 + 2^2 + (-2)^2} = \sqrt{1 + 4 + 4} = \sqrt{9} = 3$$
$$\|\mathbf{v}\|_2 = \sqrt{3^2 + 0^2 + 4^2} = \sqrt{9 + 0 + 16} = \sqrt{25} = 5$$
$$\|\mathbf{u}\|_1 = |1| + |2| + |-2| = 5 \quad\text{(보조 노름, B-4)}$$
$$\|\mathbf{u}\|_\infty = \max(|1|, |2|, |-2|) = 2$$

**(b) Dot product와 각도.**
$$\mathbf{u}\cdot\mathbf{v} = (1)(3) + (2)(0) + (-2)(4) = 3 + 0 - 8 = -5$$

각도 정의 2.3에 따라
$$\cos\theta = \frac{\mathbf{u}\cdot\mathbf{v}}{\|\mathbf{u}\|_2 \|\mathbf{v}\|_2} = \frac{-5}{3 \cdot 5} = -\frac{1}{3} \approx -0.3333$$
$$\theta = \arccos\!\left(-\tfrac{1}{3}\right) \approx 1.9106\,\text{rad} \approx 109.47^\circ$$

(둔각: Cosine similarity 음수는 두 Vector가 "반대 방향에 가까움"을 의미한다, D 섹션.)

**(c) 정규화.**
$$\hat{\mathbf{u}} = \frac{\mathbf{u}}{\|\mathbf{u}\|_2} = \frac{1}{3}(1, 2, -2)^\top = \left(\tfrac{1}{3},\, \tfrac{2}{3},\, -\tfrac{2}{3}\right)^\top$$

검산:
$$\|\hat{\mathbf{u}}\|_2 = \sqrt{\left(\tfrac{1}{3}\right)^2 + \left(\tfrac{2}{3}\right)^2 + \left(-\tfrac{2}{3}\right)^2} = \sqrt{\tfrac{1 + 4 + 4}{9}} = \sqrt{\tfrac{9}{9}} = 1 \quad\checkmark$$

일반화: 동차성(B-3)에 따라 $\|\alpha \mathbf{x}\|_2 = |\alpha| \|\mathbf{x}\|_2$이므로 $\alpha = 1/\|\mathbf{u}\|_2$를 대입하면 $\|\hat{\mathbf{u}}\|_2 = 1$이 자동으로 따라온다.

**(d) Dot product vs Cosine similarity.** Cosine similarity는 분모 $\|\mathbf{u}\|_2 \|\mathbf{v}\|_2$로 두 Vector의 노름을 나누어 **방향 정보만** 남긴 양이고, Dot product는 분모를 나누지 않아 **방향과 노름 크기가 함께** 반영된 양이다.

### 문제 3 답안 (증명·응용)

**(a) Cauchy-Schwarz inequality 판별식 풀이 증명.**

먼저 $\mathbf{v} = \mathbf{0}$이면 좌변 $|\mathbf{u}\cdot\mathbf{v}| = 0$, 우변 $\|\mathbf{u}\|_2 \|\mathbf{v}\|_2 = 0$로 자명하게 성립한다. 이하 $\mathbf{v} \neq \mathbf{0}$이라 가정한다.

양정성(B-3, 문제 1 (a))에 따라 임의의 $t \in \mathbb{R}$에 대해
$$\|\mathbf{u} - t\mathbf{v}\|_2^2 \ge 0$$
이고 등호는 $\mathbf{u} - t\mathbf{v} = \mathbf{0}$일 때만 성립한다.

좌변을 Dot product로 전개하면(Dot product 분배 성질, 정의 2.2)
$$\|\mathbf{u} - t\mathbf{v}\|_2^2 = (\mathbf{u} - t\mathbf{v})\cdot(\mathbf{u} - t\mathbf{v}) = \|\mathbf{v}\|_2^2 \, t^2 - 2\,(\mathbf{u}\cdot\mathbf{v})\, t + \|\mathbf{u}\|_2^2$$

이는 $t$에 대한 2차식이다($\mathbf{v} \neq \mathbf{0}$ 가정으로 $\|\mathbf{v}\|_2^2 > 0$). 모든 $t$에서 0 이상이므로 판별식 $D \le 0$:
$$D = \left[-2(\mathbf{u}\cdot\mathbf{v})\right]^2 - 4 \|\mathbf{v}\|_2^2 \|\mathbf{u}\|_2^2 = 4\,(\mathbf{u}\cdot\mathbf{v})^2 - 4\,\|\mathbf{u}\|_2^2 \|\mathbf{v}\|_2^2 \le 0$$

양변을 4로 나누고 정리하면
$$(\mathbf{u}\cdot\mathbf{v})^2 \le \|\mathbf{u}\|_2^2 \|\mathbf{v}\|_2^2$$

양변에 제곱근을 취하면(양변 모두 음이 아님)
$$|\mathbf{u}\cdot\mathbf{v}| \le \|\mathbf{u}\|_2 \|\mathbf{v}\|_2 \qquad \blacksquare$$

*등호 조건*: $D = 0$, 즉 2차식이 중근을 가지는 어떤 $t^* \in \mathbb{R}$에서 $\|\mathbf{u} - t^* \mathbf{v}\|_2^2 = 0$이 성립할 때이다. 양정성에 따라 이는 $\mathbf{u} - t^* \mathbf{v} = \mathbf{0}$, 즉 $\mathbf{u} = t^* \mathbf{v}$(평행)와 동치이다. ($\mathbf{v} = \mathbf{0}$인 경우는 위 도입부에서 별도 처리; 이 경우도 평행으로 본다.)

**(b) 문서 검색에서 Cosine similarity를 쓰는 이유.**

문서 임베딩 $\mathbf{d}, \mathbf{q} \in \mathbb{R}^{768}$의 노름 $\|\mathbf{d}\|_2$는 문서 길이·단어 빈도 분포에 따라 큰 폭으로 달라진다. 길이가 긴 문서는 같은 의미라도 노름이 커지기 쉽고, 이 경우 Dot product $\mathbf{d}\cdot\mathbf{q}$는 의미 유사도가 아닌 단순한 노름 크기에 의해 값이 부풀려진다. 반면 Cosine similarity $\frac{\mathbf{d}\cdot\mathbf{q}}{\|\mathbf{d}\|_2 \|\mathbf{q}\|_2}$는 분모로 두 Vector의 노름을 나누므로 임의 양의 Scalar $\alpha > 0$, $\beta > 0$에 대해 $\cos\angle(\alpha\mathbf{d}, \beta\mathbf{q}) = \cos\angle(\mathbf{d}, \mathbf{q})$를 만족한다(동차성, B-3). 즉 **스케일 불변**(scale invariance)이라 문서 길이 차이의 영향을 받지 않고 오로지 방향(의미)만 비교한다. Cauchy-Schwarz inequality(정리 2.1)에 의해 값은 항상 $[-1, 1]$ 범위에 들어가 해석도 일관된다(1: 같은 방향, 0: 직교, -1: 반대 방향).

## 코딩 문제 (선택)

### 문제 1 답안 (직접 구현)

```python
import numpy as np

def my_norm2(x):
    """Euclidean norm 직접 구현 (정의 2.1)"""
    s = 0.0
    for i in range(len(x)):
        s += x[i] * x[i]   # x_i^2 누적합
    return float(np.sqrt(s))

def my_dot(u, v):
    """Dot product 직접 구현 (정의 2.2)"""
    assert len(u) == len(v), "차원이 다른 Vector는 Dot product가 정의되지 않음"
    s = 0.0
    for i in range(len(u)):
        s += u[i] * v[i]   # u_i v_i 누적합
    return float(s)

def my_cosine(u, v):
    """Cosine similarity 직접 구현 (정의 2.3, my_norm2·my_dot만 사용)"""
    nu = my_norm2(u)
    nv = my_norm2(v)
    assert nu > 0 and nv > 0, "영Vector는 Cosine similarity가 정의되지 않음"
    return my_dot(u, v) / (nu * nv)

# 검증
np.random.seed(0)
u = np.random.randn(10); v = np.random.randn(10)
assert np.isclose(my_norm2(u), np.linalg.norm(u), atol=1e-8)
assert np.isclose(my_dot(u, v), float(u @ v), atol=1e-8)
ref_cos = (u @ v) / (np.linalg.norm(u) * np.linalg.norm(v))
assert np.isclose(my_cosine(u, v), ref_cos, atol=1e-8)
print("OK: Norm·Dot·Cosine 검증 통과")
```

검증 결과: `OK: Norm·Dot·Cosine 검증 통과` 출력. 본 회차 정의 2.1·2.2·2.3을 그대로 코드로 옮긴 구현이다.

### 문제 2 답안 (Cosine similarity 검색)

```python
from sklearn.datasets import load_digits
import numpy as np

X, y = load_digits(return_X_y=True)

# TODO 1: 숫자 7·1 각각 10장 평균 Vector m7, m1 (Linear combination, 1회차 도구)
# m7 = (1/10) sum_{i=1..10} x_i (계수 균등 Linear combination)
m7 = X[y == 7][:10].mean(axis=0)   # shape (64,)
m1 = X[y == 1][:10].mean(axis=0)   # shape (64,)

# TODO 2: 새 이미지 한 장 x_new 추출 (예: y==7 11번째)
x_new = X[y == 7][10]   # 학습에 쓰지 않은 11번째 7 이미지

# TODO 3: Cosine similarity 두 개 계산 (정의 2.3)
def cosine(a, b):
    return float(a @ b) / (np.linalg.norm(a) * np.linalg.norm(b))

cos7 = cosine(x_new, m7)
cos1 = cosine(x_new, m1)

print(f"cos(x_new, m7) = {cos7:.4f}")
print(f"cos(x_new, m1) = {cos1:.4f}")
print("후보 클래스:", 7 if cos7 > cos1 else 1)
```

예상 결과: `cos(x_new, m7)`가 `cos(x_new, m1)`보다 큰 값으로 나오고 후보 클래스로 7이 출력된다. 본 회차 Cosine similarity가 곧 "방향이 얼마나 비슷한가"의 척도이며, 같은 클래스 평균 Vector와 새 이미지 사이의 각도가 다른 클래스 평균과의 각도보다 작기 때문이다. 본 절차는 다음 회차 Matrix·Vector 곱으로 일반화되면 가장 단순한 nearest-mean classifier가 된다.

## 자기 점검 체크리스트 답안

- Norm의 세 성질 — 양정성·동차성·삼각부등식. $\mathbb{R}^n$에서 양정성은 문제 1 (a), 동차성은 문제 2 (c) 검산, 삼각부등식은 Cauchy-Schwarz inequality에서 도출(증명은 5회차 또는 자율 학습).
- Cauchy-Schwarz inequality 판별식 풀이 증명 — 문제 3 (a)에서 시작 가정 $\|\mathbf{u} - t\mathbf{v}\|_2^2 \ge 0$부터 판별식 $D \le 0$까지의 흐름을 손으로 재현할 수 있다.
- Dot product 값과 Cosine similarity 값의 차이 — 문제 2 (d)의 한 문장 그대로.
- 코딩 진행 시 Cosine similarity 검증 — 문제 1 코드 마지막 `print("OK: ...")` 출력 확인.

## 다음 회차로 가져갈 질문 안내

본 회차의 Norm·Dot product는 두 Vector 사이의 관계를 다룬다. 다음 회차에서 여러 Vector를 한 객체 Matrix로 묶고, Matrix·Vector 곱 $A\mathbf{x}$를 Row picture와 Column picture 두 해석으로 도입한다. Column picture는 1회차에서 본 Linear combination의 직접 연속이다.
