import React from "react";
import Button from "../common/Button";
import { handleOAuthLogin } from "../../services/AuthService";

function OAuthLoginForm() {
  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <div className="flex justify-center items-center space-x-4">
        <Button
          variant="outlined"
          className="oauth-button kakao flex items-center space-x-2"
          onClick={() => handleOAuthLogin("kakao")}
        >
          <img src="/kakao.png" alt="카카오 아이콘" className="w-5 h-5" />
          <span>카카오 로그인</span>
        </Button>
        <Button
          variant="outlined"
          className="oauth-button naver flex items-center space-x-2"
          onClick={() => handleOAuthLogin("naver")}
        >
          <img src="/naver.png" alt="네이버 아이콘" className="w-5 h-5" />
          <span>네이버 로그인</span>
        </Button>
      </div>
    </div>
  );
}

export default OAuthLoginForm;
