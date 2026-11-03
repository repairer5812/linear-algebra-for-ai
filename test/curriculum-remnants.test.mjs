import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('0회차 노트북은 24회차 강좌를 말하고, 시연 표의 회차 번호는 유지한다', () => {
  const raw = read('notebooks/Part1/00_Introduction_평균이미지.ipynb');
  const nb = JSON.parse(raw);
  const text = nb.cells.map((cell) => (cell.source || []).join('')).join('\n');
  assert.equal(text.includes('28회차'), false);
  assert.match(text, /24회차의 지점/);
  assert.match(text, /24회차 전체의 입구/);
  assert.match(text, /이미지를 벡터로[\s\S]*\*\*1\*\*/);
  assert.match(text, /벡터 덧셈·스칼라곱[\s\S]*\*\*1\*\*/);
  assert.match(text, /데이터셋을 행렬로[\s\S]*\*\*3\*\*/);
  assert.match(text, /가장 가까운 평균으로 분류[\s\S]*\*\*2\*\*/);
});

test('1회차 노트북의 Span 정식 정의는 Part 1 6회차를 가리킨다', () => {
  const raw = read('notebooks/Part1/01_벡터_선형결합.ipynb');
  JSON.parse(raw);
  const text = JSON.parse(raw).cells.map((cell) => (cell.source || []).join('')).join('\n');
  assert.equal(text.includes('정식 정의 8회차'), false);
  assert.match(text, /정식 정의는 Part 1 6회차/);
});

test('2회차 Marp는 폐기된 약어·Part 4·옛 회차 번호를 현재 24회차 구성으로 말한다', () => {
  const text = read('lectures/Part1/02회차_노름_내적_코사인유사도.md');
  assert.equal(/\bLA1\b/.test(text), false);
  assert.match(text, /Part 1 \(선형대수 1\)/);
  assert.equal(text.includes('Part 4'), false);
  assert.match(text, /Part 3 4회차\(선형회귀\)/);
  assert.match(text, /정식 분해는 Part 3/);
  assert.match(text, /Part 3 9회차 정식/);
  assert.equal(text.includes('8회차 일차독립'), false);
  assert.match(text, /Part 1 6회차 일차독립/);
  assert.equal(text.includes('4회차 Orthogonality'), false);
  assert.match(text, /Part 2 1회차 직교성/);
});

test('2회차 Marp는 숙제 제출 트랙 대신 자기 점검을 말한다', () => {
  const text = read('lectures/Part1/02회차_노름_내적_코사인유사도.md');
  assert.equal(text.includes('마무리 숙제'), false);
  assert.equal(text.includes('Review용 숙제'), false);
  assert.equal(text.includes('코딩은 과제로'), false);
  assert.match(text, /제출, 채점하는 숙제는 없고/);
  assert.equal(text.includes('제출·채점'), false);
  assert.match(text, /다음 회차 Review용 자기 점검/);
  assert.match(text, /제출 과제는 아니다/);
  assert.match(text, /제출 과제 아님/);
});

test('2026-07-03 이력은 당시 문장이고, 운영 정정은 2026-11-03 항목에 쉼표 나열로 있다', () => {
  const text = read('changelog.html');
  const julyStart = text.indexOf('<div class="changelog__date">2026-07-03</div>');
  const julyEnd = text.indexOf('<div class="changelog__date">2026-07-01', julyStart);
  const july = text.slice(julyStart, julyEnd);
  assert.match(july, /회차별 과제\(숙제\) 제출 트랙은 폐지하고, Part별 자가평가 시험으로 대체할 예정입니다/);
  assert.equal(july.includes('폐지했습니다'), false);
  assert.equal(july.includes('시험, 점수'), false);
  assert.equal(july.includes('시험·점수'), false);

  const novStart = text.indexOf('<div class="changelog__date">2026-11-03</div>');
  const novEnd = text.indexOf('<div class="changelog__date">2026-07-16</div>', novStart);
  assert.ok(novStart >= 0 && novStart < text.indexOf('<div class="changelog__date">2026-07-16</div>'));
  const nov = text.slice(novStart, novEnd);
  assert.match(nov, /회차별 과제\(숙제\) 제출 트랙은 폐지했습니다/);
  assert.match(nov, /2026-07-03에 적었던 Part별 자가평가 시험은 도입하지 않았고/);
  assert.match(nov, /시험, 점수 게이트 없이 회차 퀴즈와 Part 종합 Review입니다/);
  assert.equal(nov.includes('시험·점수'), false);
  assert.match(text, /4 Part·28회차 → 3 Part·24회차/);
  assert.match(text, /Part 4 캡스톤 발표 제거/);
});

test('소개 페이지의 MML 판 표기는 2020년 초판이다', () => {
  const text = read('index.html');
  assert.equal(text.includes('2nd ed.'), false);
  assert.match(text, /Mathematics for Machine Learning[\s\S]*2020년 초판/);
});

test('README 주요 페이지는 강의자료·변경 이력을 포함하고 진단 결과는 레이더 차트다', () => {
  const text = read('README.md');
  assert.equal(text.includes('육각형'), false);
  assert.match(text, /6축 레이더 차트/);
  assert.match(text, /`lectures\.html`/);
  assert.match(text, /`changelog\.html`/);
  assert.match(text, /소개, 진도표, 강의자료, 진단 테스트, 변경 이력/);
  assert.match(text, /Part 1 PDF, 노트북, Colab\. Part 2, Part 3는 순차 공개 자리/);
  assert.equal(text.includes('PDF·노트북·Colab'), false);
  assert.equal(text.includes('Part 2·3'), false);
});
