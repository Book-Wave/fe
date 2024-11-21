import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/book",
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginWithCredentials = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data.token;
};

export const validateToken = async (token) => {
  const response = await api.post("/auth/validate", { token });
  return response.data.valid;
};

export const kakaoCallback = async (code) => {
  const response = await api.get("/auth/kakao/callback", {
    params: { code },
  });
  return response.data;
};

export const naverCallback = async (code, state) => {
  const response = await api.get("/auth/naver/callback", {
    params: { code, state },
  });
  return response.data;
};

export const registerOAuth = async (nickname, birthdate, gender) => {
  const response = await api.post(
    "/auth/social/new",
    {
      nickname,
      birthdate,
      gender,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

export const checkNicknameDuplicate = async (nickname) => {
  const response = await api.get(`/auth/nickname/check/${nickname}`);
  return response.data; // true (중복 없음), false (중복 있음)
};
