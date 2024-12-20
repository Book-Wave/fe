import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { kakaoCallback, naverCallback } from "../services/AuthService"; // api.js에서 함수 가져오기

const OAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isCallbackHandled = useRef(false); // 한 번만 실행되도록 하는 ref

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");
    const pathname = location.pathname;

    if (code && !isCallbackHandled.current) {
      isCallbackHandled.current = true; // 첫 번째 실행 후 상태 변경
      if (pathname.includes("kakao")) {
        console.log(origin);
        handleKakaoCallback(code);
      } else if (pathname.includes("naver")) {
        console.log(origin);
        const state = queryParams.get("state");
        handleNaverCallback(code, state);
      } else {
        alert("지원하지 않는 인증 서비스입니다.");
        navigate("/");
      }
    }
  });

  const handleKakaoCallback = async (code) => {
    try {
      const response = await kakaoCallback(code);
      if (response.new_user) {
        navigate("/register/oauth");
      } else {
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("로그인 처리 실패:", error);
      navigate("/");
    }
  };

  const handleNaverCallback = async (code, state) => {
    try {
      const response = await naverCallback(code, state);
      if (response.new_user) {
        navigate("/register/oauth");
      } else {
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("네이버 로그인 처리 실패:", error);
      navigate("/");
    }
  };

  return <div>로그인 처리 중입니다...</div>;
};

export default OAuthCallback;
