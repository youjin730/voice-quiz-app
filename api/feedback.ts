import client from "./client";

// 피드백 요약 (학습 리포트 메인)
export const getFeedbackSummary = async () => {
  return await client.get("/api/feedback/summary");
};

// 주간 리포트 (mode: 'short' 또는 'long')
export const getWeeklyReport = async (mode: "short" | "long") => {
  return await client.get(`/api/reports/weekly`, {
    params: { mode },
  });
};
