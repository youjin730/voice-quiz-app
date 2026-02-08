import client from "./client";

/* ========== 숏폼 (Shorts) ========== */

// 1. 숏폼 문제 조회 (categoryCode는 선택사항)
export const getShortsQuiz = async (
  categoryCode?: string,
  limit: number = 5,
) => {
  // 쿼리 파라미터 만들기
  const params: any = { limit };
  if (categoryCode) params.categoryCode = categoryCode;

  return await client.get("/api/training/shorts", { params });
};

// 2. 숏폼 세션 시작
export const startShortsSession = async (totalRounds: number = 5) => {
  return await client.post("/api/training/shorts/sessions", { totalRounds });
};

// 3. 숏폼 답안 제출
export const submitShortsAnswer = async (data: {
  sessionId: number;
  roundNo: number;
  shortId: number;
  userChoice: "real" | "fake"; // 타입 안전성 강화
  timeMs: number;
}) => {
  return await client.post("/api/training/shorts/attempts", data);
};

// 4. 숏폼 세션 종료 (결과 받기)
export const finishShortsSession = async (sessionId: number) => {
  return await client.post(`/api/training/shorts/sessions/${sessionId}/finish`);
};

// app/api/training.ts 에 추가

// 숏폼 결과 조회 (GET /api/training/shorts/sessions/:id/result)
export const getShortsSessionResult = async (sessionId: number) => {
  return await client.get(`/api/training/shorts/sessions/${sessionId}/result`);
};

/* ========== 롱폼 (Longs) ========== */

// 1. 시나리오 목록 조회
export const getScenarios = async () => {
  return await client.get("/api/training/scenarios");
};

// app/api/training.ts 파일

// ... 다른 코드들 ...

// 2. 롱폼 세션 시작 (수정됨)
// app/api/training.ts

export const startLongsSession = async (scenarioId: number) => {
  console.log("🚀 [API 수정] 세션 시작 시도 (snake_case): ID =", scenarioId);

  try {
    // ✅ 수정 포인트: 키 이름을 'scenario_id'로 변경!
    const response = await client.post("/api/training/longs/sessions", {
      scenario_id: Number(scenarioId),
    });

    console.log("✅ [API 성공] 응답:", response.data);
    return response;
  } catch (error: any) {
    // 🚨 여기서 서버가 보내준 진짜 에러 메시지를 확인해야 합니다!
    console.error(
      "🔥 [API 실패 원인]:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};
// 3. 텍스트 메시지 전송 (음성은 FormData라 따로 처리하거나 여기서 분기)
export const sendLongsMessage = async (data: {
  sessionId: number;
  turnNo: number; // 명세서에 turnNo 필요
  text: string;
}) => {
  return await client.post("/api/training/longs/messages", {
    inputMode: "text",
    ...data,
  });
};

// 4. 롱폼 세션 종료
export const finishLongsSession = async (sessionId: number) => {
  return await client.post(`/api/training/longs/sessions/${sessionId}/finish`);
};

// 5. 롱폼 결과 조회
export const getLongsResult = async (sessionId: number) => {
  return await client.get(`/api/training/longs/sessions/${sessionId}/result`); // 혹은 finish 응답 사용
};
