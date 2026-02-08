import axios from "axios";

const client = axios.create({
  // ✅ 백엔드 개발자가 준 ngrok 주소 (바뀔 때마다 여기만 수정하면 됨)
  baseURL: "https://hypsometric-katabolically-kelsie.ngrok-free.dev",

  // ✅ 쿠키(세션) 필수 설정
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
