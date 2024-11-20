import React from "react";

// 카카오, 네이버 로그인 버튼 컴포넌트
const OAuthButton = ({ provider, onClick }) => {
  const buttonText = provider === "kakao" ? "카카오 로그인" : "네이버 로그인";
  const buttonStyle = provider === "kakao" ? "kakao-btn" : "naver-btn";

  return (
    <button className={buttonStyle} onClick={onClick}>
      {buttonText}
    </button>
  );
};

export default OAuthButton;
