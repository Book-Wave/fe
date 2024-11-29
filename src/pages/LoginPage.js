import React from "react";
import LoginForm from "../components/LoginForm";
import Header from "../components/common/Header";
import OAuthLoginForm from "../components/OAuthLoginForm";

const LoginPage = () => {
  // const [activeTab, setActiveTab] = useState("login");

  // const renderForm = () => {
  //   if (activeTab === "login") {
  //     return <LoginForm />;
  //   } else if (activeTab === "register") {
  //     return <RegisterForm />;
  //   }
  // };
  return (
    <>
      <Header />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=[#0080FF]&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
      </div>
      <OAuthLoginForm />
      <LoginForm />
      {/* <div>
        <h1 className="text-3xl font-bold underline">
          로그인 / 회원가입 페이지
        </h1>
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
      </div> */}
    </>
  );
};

export default LoginPage;
