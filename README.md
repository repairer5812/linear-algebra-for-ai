# 인공지능 전공자를 위한 선형대수학

> 인공지능 전공 대학원생을 위한 24회차 (1회차 2시간 × 24 = 48시간) 선형대수학 강좌 공식 웹사이트.

본 저장소는 강좌의 공개 페이지(GitHub Pages)를 호스팅한다. 소개, 진도표, 강의자료, 진단 테스트, 변경 이력이 포함된다.

## 강좌 한 줄 소개

정의·정리에서 출발해 NumPy·PyTorch로 직접 구현하고, 임의 AI 모델 한 모듈을 표준 선형대수 객체로 분해할 수 있는 수준까지 끌어올리는 24회차 (Part 1 7 + Part 2 8 + Part 3 9) 강좌.

## 주요 페이지

- `index.html` — 메인 페이지 (강좌 개요, 6 핵심역량, 평가·수료, 신청, FAQ)
- `diagnostic.html` — 진단 테스트 12문제 + 6축 레이더 차트 결과
- `curriculum.html` — Part 1 (선형대수 1, 7회차) + Part 2 (선형대수 2, 8회차) + Part 3 (ML·AI의 수학, 9회차) 상세 회차표 + 자가진단 체크리스트
- `lectures.html` — 강의자료 (Part 1 PDF, 노트북, Colab. Part 2, Part 3는 순차 공개 자리)
- `changelog.html` — 변경 이력
- `admin.html` — 강사용 익명 응답 통계 (토큰 인증)

## 핵심역량 6축

1. 벡터·내적공간
2. 선형방정식·행렬
3. 벡터공간·부분공간
4. 직교성·정사영
5. 행렬식·고윳값
6. SVD·선형변환

진단 테스트의 문항 수와 축 이름은 `assets/diagnostic-config.js` 한 곳에서 고친다. 진단 화면(`assets/diagnostic.js`), 강사 통계(`admin.html`), 워커(`worker/src/index.js`)가 이 파일을 함께 읽는다. 응답 집계의 모양(총점·축·문항·히스토그램)과 계산은 `assets/diagnostic-stats.js`의 `aggregateDiagnostics` 하나다. 강사 화면과 워커(`/stats`, `/analyze`)가 이 함수를 함께 쓴다. 문항 수를 바꾸면 워커를 다시 배포하고, 화면 문구에 적힌 "12문제" 같은 숫자도 손으로 고친다.

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

## 강의 PDF

Part 1 교안 PDF의 원본은 Marp 마크다운이다. `00`, `01`, `03`부터 `07`은 `90dc8d3` 직전 커밋의 소스이고, `02`는 그 뒤에 다시 올린 `lectures/Part1/02회차_노름_내적_코사인유사도.md`다. 슬라이드 그림은 `lectures/Part1/assets/`에 있다.

저장소에 들어 있는 PDF는 PptxGenJS 슬라이드를 LibreOffice 또는 PowerPoint로 내보낸 파일이다. 그 pptx는 git에 없다. 아래 Marp 명령은 이 마크다운으로 PDF를 만들며, 커밋된 PDF와 바이트가 같지 않다. 명령은 커밋된 PDF를 덮어쓰지 않도록 `/tmp`에 쓴다.

```bash
npx --yes @marp-team/marp-cli --pdf --allow-local-files \
  --output /tmp/00회차_Introduction.pdf \
  lectures/Part1/00회차_Introduction.md
```

Chrome(또는 Chromium)이 필요하다. 각 파일 앞머리의 `math: mathjax`로 수식을 그린다. `02`가 참조하는 `assets/02_d4_attention_banner.jpg`, `02_d4_transformer_full.png`, `02_d4_softmax.png`, `02_d4_attention.png`는 git 히스토리에 없다.

`06`, `07` 소스 파일 이름은 공개 PDF와 다르다. 소스는 `06회차_벡터공간_부분공간.md`, `07회차_열공간_Rank_4부분공간_도입.md`이고, PDF는 `06회차_벡터공간_부분공간_기저_차원.pdf`, `07회차_열공간_Rank_4부분공간_차원정리.pdf`다.

## 라이선스

본 저장소의 페이지·문서·이미지 자료는 MIT License 하에 공개한다. 외부 인용 자료(MML, Strang, EoLA 등)는 각 원저작자의 라이선스를 따른다.
