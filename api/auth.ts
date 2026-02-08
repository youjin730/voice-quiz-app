import client from "./client";

// 로그인
// api/auth.ts
// 인자를 { email, password } 객체 하나로 받음
export const login = async (data: { email: string; password: string }) => {
  return await client.post("/api/auth/login", data);
};

// 내 정보 조회
export const getMyProfile = async () => {
  return await client.get("/api/auth/me");
};

// 로그아웃
export const logout = async () => {
  return await client.post("/api/auth/logout");
};

// app/api/auth.ts (기존 파일에 추가)

// 아이디 찾기 (POST /api/auth/find-id 라고 가정)
export const findId = async (name: string, phone: string) => {
  // 백엔드 명세에 따라 주소나 파라미터가 다를 수 있습니다.
  // 예시: POST로 { name, phone } 전송
  return await client.post("/api/auth/find-id", { name, phone });
};
// app/api/auth.ts 에 추가

// 프로필 수정 (PATCH /api/auth/me)
// data는 { name: "새이름", phone: "새번호" } 등의 객체
export const updateProfile = async (data: any) => {
  return await client.patch("/api/auth/me", data);
};

// app/api/auth.ts 에 추가

// ✅ 회원가입 (명세서 반영: /register)
export const signup = async (userData: any) => {
  // 명세서에 'birth', 'address'가 없으므로,
  // 혹시 에러가 나면 userData에서 그 두 개를 빼고 보내야 할 수도 있습니다.
  // 일단은 그대로 보내보세요 (보통 백엔드에서 필요 없는 건 알아서 무시합니다).
  return await client.post("/api/auth/register", userData);
};
