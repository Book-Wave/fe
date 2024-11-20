import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/book",
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginWithCredentials = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data.token; // JWT 토큰 반환
};

export const validateToken = async (token) => {
  const response = await api.post("/auth/validate", { token });
  return response.data.valid;
};
