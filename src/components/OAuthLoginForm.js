import React from "react";
import Button from "./common/Button";

const api = "http://52.78.186.21:8080/book";
// const api = "http://localhost:8080/book";

function OAuthLoginForm() {
  const handleOAuthLogin = (provider) => {
    // OAuth 인증 URL로 이동
    window.location.href = `${api}/auth/${provider}/login`;
  };
  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <div className="flex justify-center items-center space-x-4">
        <Button
          className="oauth-button kakao"
          onClick={() => handleOAuthLogin("kakao")}
        >
          카카오 로그인
        </Button>
        <Button
          className="oauth-button naver"
          onClick={() => handleOAuthLogin("naver")}
        >
          네이버 로그인
        </Button>
      </div>
    </div>
  );
}

export default OAuthLoginForm;
