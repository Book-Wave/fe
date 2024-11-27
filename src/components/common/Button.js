import React from "react";

const Button = ({ onClick, children, active, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        padding: "10px 20px",
        backgroundColor: active ? "#4caf50" : "#f0f0f0", // active가 true일 때 녹색
        color: active ? "#fff" : "#000", // 활성화된 버튼의 텍스트 색
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
};

export default Button;
