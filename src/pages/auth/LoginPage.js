import React from "react";
import LoginForm from "../../components/auth/LoginForm";
// import Header from "../components/common/Header";
import OAuthLoginForm from "../../components/auth/OAuthLoginForm";

const LoginPage = () => {
  return (
    <>
      {/* <Header /> */}
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
      <LoginForm />
      <br />
      <br />
      <div className="flex items-center w-[384px] mx-auto">
        <hr className="flex-1 border-gray-300" />
        <span className="mx-4 text-sm text-gray-500">소셜 로그인</span>
        <hr className="flex-1 border-gray-300" />
      </div>
      <OAuthLoginForm />
    </>
  );
};

export default LoginPage;
