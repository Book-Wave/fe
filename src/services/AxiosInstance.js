// axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://52.78.186.21:8080/book',
  // baseURL: "http://localhost:8080/book",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem('access_token');

    if (access_token) {
      config.headers['Authorization'] = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          // "http://localhost:8080/book/auth/refresh",
          'http://52.78.186.21:8080/book/auth/refresh',
          {},
          { withCredentials: true }
        );
        const newAccessToken = response.data.token;
        console.log('재발급 성공: ', newAccessToken);
        // 새로운 access_token 저장
        localStorage.setItem('access_token', newAccessToken);

        // Authorization 헤더 갱신 후 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        if (refreshError.response?.status === 401) {
          // 모든 토큰 만료: 로그인 페이지로 이동
          localStorage.removeItem('access_token');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
