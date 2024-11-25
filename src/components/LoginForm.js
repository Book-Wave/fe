import React, { useState } from "react";
// import OAuthButton from "./OAuthButton";
import Button from "./common/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const api = "http://localhost:8080/book";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleOAuthLogin = (provider) => {
    // OAuth 인증 URL로 이동
    window.location.href = `${api}/auth/${provider}/login`;
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${api}/auth/login`, {
        email,
        password,
      });

      // JWT 토큰을 로컬 스토리지에 저장
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      alert("로그인 성공!");
      navigate("/dashboard");
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인 실패");
    }
  };

  return (
    <div>
      <h2>로그인</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
      />
      <Button children="로그인" onClick={handleLogin} type="button" />
      <Button
        children="카카오 로그인"
        onClick={() => handleOAuthLogin("kakao")}
        type="button"
      />
      <Button
        children="네이버 로그인"
        onClick={() => handleOAuthLogin("naver")}
        type="button"
      />
    </div>
  );
};

export default LoginForm;
