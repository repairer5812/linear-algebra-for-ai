# 인공지능 전공자를 위한 선형대수학

> 인공지능 전공 대학원생을 위한 29회차 (1회차 2시간 × 29 = 58시간) 선형대수학 강좌 공식 웹사이트.

본 저장소는 강좌의 공개 페이지(GitHub Pages)를 호스팅한다. 메인 페이지, 진단 테스트, 커리큘럼 상세, FAQ가 포함된다.

## 강좌 한 줄 소개

정의·정리에서 출발해 NumPy·PyTorch로 직접 구현하고, 임의 AI 모델 한 모듈을 표준 선형대수 객체로 분해할 수 있는 수준까지 끌어올리는 29회차 (Part 1 8 + Part 2 9 + Part 3 4 + Part 4 8) 강좌.

## 주요 페이지

- `index.html` — 메인 페이지 (강좌 개요, 6 핵심역량, 평가·수료, 신청, FAQ)
- `diagnostic.html` — 진단 테스트 10문제 + 6축 육각형 결과 분석
- `curriculum.html` — Part 1 (LA1, 8회차) + Part 2 (LA2, 9회차) + Part 3 (VC + Probability, 4회차) + Part 4 (ML 및 AI 응용, 8회차) 상세 회차표 + 자가진단 체크리스트
- `admin.html` — 강사용 익명 응답 통계 (토큰 인증)

## 핵심역량 6축

1. 벡터·내적
2. 행렬연산
3. 부분공간·계수
4. 직교성·정사영
5. 분해·고윳값
6. AI 응용·코딩

## 학습 환경

- 메인 교재: Deisenroth·Faisal·Ong, *Mathematics for Machine Learning* (MML), 무료 PDF: <https://mml-book.github.io/>
- 발췌 보조 교재: Strang, *Introduction to Linear Algebra* (6th ed.)
- 시각 보조: 3Blue1Brown, *Essence of Linear Algebra*
- 실습: Google Colab
- LMS: Google Classroom (코드 추후 공개)

## 강사

최경찬 / SW AI 융합정보대학원 61기

## 기술 스택

- 정적 HTML / CSS / Vanilla JavaScript (빌드 도구 없음)
- Chart.js 4.x — 레이더·막대 차트
- KaTeX 0.16.x — 수식 렌더링
- html2canvas + jsPDF — 결과 PNG/PDF 다운로드
- Cloudflare Worker (`worker/` 디렉터리) — 익명 응답 수집·집계

## 라이선스

본 저장소의 페이지·문서·이미지 자료는 MIT License 하에 공개한다. 외부 인용 자료(MML, Strang, EoLA 등)는 각 원저작자의 라이선스를 따른다.
