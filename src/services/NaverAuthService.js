import axios from "axios";

export const naverLogin = async (code) => {
  const response = await axios.post(
    "http://localhost:8080/book/auth/naver/login",
    {
      code,
    }
  );
  return response.data.token; // 받은 JWT 토큰을 반환
};
