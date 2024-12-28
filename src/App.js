import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/DashBoard";
import CallbackPage from "./pages/auth/CallBack";
import RegisterPage from "./pages/auth/RegisterPage";
import ChatPage from "./pages/ChatPage";
import MainLayout from "./pages/MainLayout";
import ForgetPW from "./pages/auth/ForgetPW";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <MainLayout>
                <LoginPage />
              </MainLayout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            }
          />
          <Route
            path="/register/*"
            element={
              <MainLayout>
                <RegisterPage />
              </MainLayout>
            }
          />
          <Route
            path="/kakao/callback"
            element={
              <MainLayout>
                <CallbackPage />
              </MainLayout>
            }
          />
          <Route
            path="/naver/callback"
            element={
              <MainLayout>
                <CallbackPage />
              </MainLayout>
            }
          />
          <Route
            path="/chat/*"
            element={
              <MainLayout>
                <ChatPage />
              </MainLayout>
            }
          />
          <Route
            path="/"
            element={
              <MainLayout>
                <LoginPage />
              </MainLayout>
            }
          />
          <Route
            path="/resetting"
            element={
              <MainLayout>
                <ForgetPW />
              </MainLayout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
