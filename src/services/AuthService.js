import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/book",
  headers: {
    "Content-Type": "application/json",
  },
});

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

export const whoami = async (token) => {
  try {
    const response = await api.get(`/member/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user info"
    );
  }
};

export const sendEmail = async (email) => {
  try {
    const response = await api.post(`/auth/email_send`, { email });
    return response;
  } catch (error) {
    throw new Error("Failed to send email code");
  }
};

export const verifyCode = async (email, code) => {
  try {
    const response = await api.post(`auth/email_verify`, { email, code });
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
    const response = await api.post(`auth/register`, {
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
