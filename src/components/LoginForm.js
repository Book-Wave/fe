import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "./common/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// const api = "http://52.78.186.21:8080/book";
const api = "http://localhost:8080/book";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // const handleOAuthLogin = (provider) => {
  //   // OAuth 인증 URL로 이동
  //   window.location.href = `${api}/auth/${provider}/login`;
  // };

  const handleLogin = async (e) => {
    e.preventDefault();

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
    <>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="  이메일"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#0080FF] sm:text-sm"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-[#0080FF] hover:text-[#0000FF]"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="  비밀번호"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#0080FF] sm:text-sm"
              />
            </div>
          </div>
          <div>
            <Button type="submit" variant="filled" size="sm" className="w-full">
              로그인
            </Button>
          </div>
          <p className="mt-10 text-center text-sm text-gray-500">
            회원이 아니신가요?{" "}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              회원가입 하러가기
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
