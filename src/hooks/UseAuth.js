import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useAuth = () => {
  const { authToken, login, logout } = useContext(AuthContext);

  const isAuthenticated = !!authToken; // 토큰이 있으면 인증됨

  return {
    isAuthenticated,
    login,
    logout,
  };
};

export default useAuth;
