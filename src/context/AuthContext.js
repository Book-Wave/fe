import React, { createContext, useContext, useState } from "react";

// 인증 상태를 관리하는 Context
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

  const login = (token) => {
    localStorage.setItem("authToken", token); // 로컬 스토리지에 JWT 저장
    setAuthToken(token); // 상태 업데이트
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setAuthToken(null); // 상태 업데이트
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
