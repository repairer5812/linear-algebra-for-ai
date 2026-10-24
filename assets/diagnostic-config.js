/* ==========================================================================
   진단 테스트 공통 설정: 문항 수와 6축 이름은 이 파일에서만 고친다.
   - diagnostic.html, admin.html: 다른 스크립트보다 먼저 <script src="assets/diagnostic-config.js">로 읽는다.
   - worker/src/index.js: import "../../assets/diagnostic-config.js" 로 wrangler 번들에 들어간다.
   세 곳 모두 globalThis.LINALG_DIAG 의 같은 값을 쓴다.
   문항을 더하거나 빼면 assets/diagnostic.js 의 QUESTIONS 와 QUESTION_COUNT 를 함께 고치고,
   워커를 다시 배포해야 제출 검사(answers 길이)가 맞는다.
   ========================================================================== */
globalThis.LINALG_DIAG = Object.freeze({
  QUESTION_COUNT: 12,
  // name: 진단 화면과 강사 통계의 축 이름. detail: 워커의 AI 분석 프롬프트에 붙이는 설명.
  AXES: Object.freeze([
    Object.freeze({ name: "벡터·내적공간", detail: "노름·내적·span·직교" }),
    Object.freeze({ name: "선형방정식·행렬", detail: "LU·역행렬·가역 동치·Ax=b 해 조건" }),
    Object.freeze({ name: "벡터공간·부분공간", detail: "영공간·열공간·rank·4 기본 부분공간" }),
    Object.freeze({ name: "직교성·정사영", detail: "잔차 직교·정규방정식·QR·정규직교 기저" }),
    Object.freeze({ name: "행렬식·고윳값", detail: "고유분해·대각화·스펙트럼 정리" }),
    Object.freeze({ name: "SVD·선형변환", detail: "SVD·Eckart-Young·닮음·기저 변환" })
  ])
});
