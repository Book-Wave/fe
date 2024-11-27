import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import Button from "../components/common/Button";

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState("login");

  const renderForm = () => {
    if (activeTab === "login") {
      return <LoginForm />;
    } else if (activeTab === "register") {
      return <RegisterForm />;
    }
  };
  return (
    <div>
      <h1>로그인 / 회원가입 페이지</h1>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <Button
          onClick={() => setActiveTab("login")}
          active={activeTab === "login"}
        >
          로그인
        </Button>
        <Button
          onClick={() => setActiveTab("register")}
          active={activeTab === "register"}
        >
          회원가입
        </Button>
      </div>
      {renderForm()}
    </div>
  );
};

export default LoginPage;
