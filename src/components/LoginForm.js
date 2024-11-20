import React, { useState } from "react";
import OAuthButton from "./OAuthButton"; // OAuth 버튼 컴포넌트
// import axios from "axios";

const api = "http://localhost:8080/book";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // 로컬 로그인 로직 (JWT 처리 등)
  };

  const handleOAuthLogin = async (provider) => {
    // 카카오/네이버 로그인 처리 (OAuth2)
    try {
      window.location.href = `${api}/auth/${provider}/login`;
    } catch (error) {
      console.error("login error", error);
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
      <button onClick={handleLogin}>로그인</button>

      <OAuthButton provider="kakao" onClick={() => handleOAuthLogin("kakao")} />
      <OAuthButton provider="naver" onClick={() => handleOAuthLogin("naver")} />
    </div>
  );
};

export default LoginForm;
