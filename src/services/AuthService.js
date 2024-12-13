// import axios from "axios";
import axiosInstance from "./AxiosInstance";
// const api = axios.create({
//   baseURL: "http://52.78.186.21:8080/book",
//   // baseURL: "http://localhost:8080/book",
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

export const loginHandler = async (email, password) => {
  const response = await axiosInstance.post("/auth/login", { email, password });
  return response;
};

export const kakaoCallback = async (code) => {
  const response = await axiosInstance.get("/auth/kakao/callback", {
    params: { code },
  });
  return response.data;
};

export const naverCallback = async (code, state) => {
  const response = await axiosInstance.get("/auth/naver/callback", {
    params: { code, state },
  });
  return response.data;
};

export const registerOAuth = async (nickname, birthdate, gender) => {
  const response = await axiosInstance.post("/auth/social/new", {
    nickname,
    birthdate,
    gender,
  });
  return response.data;
};

export const checkNicknameDuplicate = async (nickname) => {
  const response = await axiosInstance.get(`/auth/nickname/check/${nickname}`);
  return response.data; // true (중복 없음), false (중복 있음)
};

export const whoami = async () => {
  const response = await axiosInstance.get(`/member/me`);
  return response;
};

export const sendEmail = async (email) => {
  try {
    const response = await axiosInstance.post(`/auth/email_send`, { email });
    return response;
  } catch (error) {
    throw new Error("Failed to send email code");
  }
};

export const verifyCode = async (email, code) => {
  try {
    const response = await axiosInstance.post(`auth/email_verify`, {
      email,
      code,
    });
    return response;
  } catch (error) {
    throw new Error("Failed to verify email code");
  }
};

// eslint-disable-next-line no-restricted-globals
export const register = async (
  email,
  password,
  name,
  nick_name,
  birth_date,
  gender
) => {
  try {
    const response = await axiosInstance.post(`auth/register`, {
      email,
      password,
      name,
      nick_name,
      birth_date,
      gender,
    });
    return response;
  } catch (error) {
    throw new Error("Failed to register member");
  }
};
