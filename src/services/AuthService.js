import axiosInstance from './AxiosInstance';

export const loginHandler = async (email, password) => {
  const response = await axiosInstance.post('/auth/login', { email, password });
  return response;
};

export const handleOAuthLogin = async (provider) => {
  console.log(axiosInstance.defaults.baseURL);
  window.location.href = `${axiosInstance.defaults.baseURL}/auth/${provider}/login`;
};

export const kakaoCallback = async (code) => {
  const response = await axiosInstance.get('/auth/kakao/callback', {
    params: { code },
  });
  return response;
};

export const naverCallback = async (code, state) => {
  const response = await axiosInstance.get('/auth/naver/callback', {
    params: { code, state },
  });
  return response;
};

export const registerOAuth = async (nickname, birthdate, gender) => {
  const response = await axiosInstance.post('/auth/social/new', {
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
    throw new Error('Failed to send email code');
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
    throw new Error('Failed to verify email code');
  }
};

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
    throw error;
  }
};

export const resetting = async (email, password, confirm_password) => {
  try {
    const response = axiosInstance.put(`auth/reset`, {
      email,
      password,
      confirm_password,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
