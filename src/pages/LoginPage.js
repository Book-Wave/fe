import React from "react";
import LoginForm from "../components/LoginForm";
import Header from "../components/common/Header";
import OAuthLoginForm from "../components/OAuthLoginForm";

const LoginPage = () => {
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
    </>
  );
};

export default LoginPage;
