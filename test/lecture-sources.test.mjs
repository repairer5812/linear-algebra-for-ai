import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const exists = (path) => existsSync(new URL(path, root));

const restoredMarkdown = [
  'lectures/Part1/00회차_Introduction.md',
  'lectures/Part1/01회차_벡터_선형결합.md',
  'lectures/Part1/03회차_행렬_행렬벡터곱.md',
  'lectures/Part1/04회차_가우스소거_RREF.md',
  'lectures/Part1/05회차_행렬곱_역행렬_LU_전치.md',
  'lectures/Part1/06회차_벡터공간_부분공간.md',
  'lectures/Part1/07회차_열공간_Rank_4부분공간_도입.md',
];

const restoredAssets = [
  'lectures/Part1/assets/01_b1_doc_vector.png',
  'lectures/Part1/assets/01_b1_image_vector.png',
  'lectures/Part1/assets/01_b1_linear_system.png',
  'lectures/Part1/assets/01_b1_parallelogram.png',
  'lectures/Part1/assets/01_b1_user_vector.png',
  'lectures/Part1/assets/01_c4_span_r2.png',
  'lectures/Part1/assets/01_d4_word_embedding.png',
  'lectures/Part1/assets/02_b5_unit_balls.png',
  'lectures/Part1/assets/02_c3_angle.png',
  'lectures/Part1/assets/03_c_pictures.png',
  'lectures/Part1/assets/03_d_colspace.png',
  'lectures/Part1/assets/03_f_adjacency.png',
];

const withheld = [
  'assignments/Part1/01회차_homework.md',
  'assignments/Part1/01회차_homework.pdf',
  'assignments/Part1/01회차_homework_solution.md',
  'assignments/Part1/01회차_homework_solution.pdf',
  'assignments/Part1/02회차_homework.md',
  'assignments/Part1/02회차_homework.pdf',
  'assignments/Part1/02회차_homework_solution.md',
  'assignments/Part1/02회차_homework_solution.pdf',
  'assignments/Part1/03회차_homework.md',
  'assignments/Part1/03회차_homework.pdf',
  'assignments/Part1/03회차_homework_solution.md',
  'assignments/Part1/03회차_homework_solution.pdf',
  'lectures/Part1/08회차_일차독립_기저_차원_4부분공간_정식.md',
  'lectures/Part2/01회차_직교성_정사영.md',
  'lectures/Part2/02회차_최소제곱_정규방정식.md',
  'lectures/Part2/03회차_그람슈미트_QR_회전.md',
  'lectures/Part2/04회차_행렬식_종합문제Review.md',
  'lectures/Part2/05회차_고윳값_고유벡터.md',
  'lectures/Part2/06회차_대각화_스펙트럼정리.md',
  'lectures/Part2/07회차_양정치_이차형식_Cholesky.md',
  'lectures/Part2/08회차_SVD.md',
  'lectures/Part2/09회차_저계수근사_종합문제Review.md',
  'lectures/Part3/01회차_벡터미적분1_Jacobian.md',
  'lectures/Part3/02회차_벡터미적분2_Hessian.md',
  'lectures/Part3/03회차_확률_MLE_KL.md',
  'lectures/Part3/04회차_연속최적화_종합문제Review.md',
  'lectures/Part4/01회차_선형회귀.md',
  'lectures/Part4/02회차_PCA.md',
  'lectures/Part4/03회차_GMM_EM.md',
  'lectures/Part4/04회차_SVM.md',
  'lectures/Part4/05회차_커널SVM.md',
  'lectures/Part4/06회차_CNN_Toeplitz환원.md',
  'lectures/Part4/07회차_Attention_분해.md',
];

test('공개 PDF의 Marp 원본과 그림이 90dc8d3 직전 소스에서 돌아왔다', () => {
  for (const path of restoredMarkdown) {
    assert.match(read(path), /^marp: true$/m, path);
  }
  for (const path of restoredAssets) {
    const file = new URL(path, root);
    assert.equal(exists(path), true, path);
    assert.ok(statSync(file).size > 0, path);
  }
});

test('README에 Marp PDF 재생성 명령이 있다', () => {
  const text = read('README.md');
  assert.match(text, /npx --yes @marp-team\/marp-cli --pdf --allow-local-files/);
  assert.match(text, /lectures\/Part1\/00회차_Introduction\.md/);
  assert.match(text, /02_d4_attention\.png/);
});

test('과제 답안과 재게시하지 않은 교안은 워킹 트리에 없다', () => {
  for (const path of withheld) {
    assert.equal(exists(path), false, path);
  }
});
