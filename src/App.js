import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashBoard";
import CallbackPage from "./pages/CallBack";
import RegisterPage from "./pages/RegisterPage";
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/register/*" element={<RegisterPage />} />
          <Route path="/kakao/callback" element={<CallbackPage />} />
          <Route path="/naver/callback" element={<CallbackPage />} />
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
