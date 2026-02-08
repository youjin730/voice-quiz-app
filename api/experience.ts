import client from "./client";

// 1. 내 녹음 목록 가져오기
export const getMyRecords = async () => {
  return await client.get("/api/experience/records");
};

// 2. 원본 목소리 등록
export const uploadRecord = async (originalUrl: string, note: string) => {
  return await client.post("/api/experience/records", { originalUrl, note });
};

// 3. 딥페이크(클론) 생성 요청
export const createClone = async (recordId: number, clonedUrl: string) => {
  return await client.post("/api/experience/clones", {
    recordId,
    clonedUrl,
    model: "elevenlabs", // 기본값 설정
  });
};
