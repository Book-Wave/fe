import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// 기존 페이지
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/DashBoard";
import CallbackPage from "./pages/auth/CallBack";
import RegisterPage from "./pages/auth/RegisterPage";
import ChatPage from "./pages/ChatPage";
import MainLayout from "./pages/MainLayout";
import ForgetPW from "./pages/auth/ForgetPW";

// 추가된 컴포넌트
import ItemList from "./components/ItemList";
import ItemDetail from "./components/ItemDetail";
import ItemRegisterPage from "./pages/ItemRegisterPage";
import ItemUpdatePage from "./pages/ItemUpdatePage";
import BookSearch from "./components/BookSearch"; // 책 검색
import MyShop from "./pages/MyShop";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 기존 라우트 */}
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
                <DashboardPage />
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

          {/* 상품 관련 라우트 */}
          <Route
            path="/items"
            element={
              <MainLayout>
                <ItemList />
              </MainLayout>
            }
          />
          <Route
            path="/items/register"
            element={
              <MainLayout>
                <ItemRegisterPage />
              </MainLayout>
            }
          />
          <Route
            path="/items/:itemId"
            element={
              <MainLayout>
                <ItemDetail />
              </MainLayout>
            }
          />
          <Route
            path="/items/:itemId/update"
            element={
              <MainLayout>
                <ItemUpdatePage />
              </MainLayout>
            }
          />

          {/* 책 검색 관련 라우트 */}
          <Route
            path="/book-search"
            element={
              <MainLayout>
                <BookSearch />
              </MainLayout>
            }
          />
          <Route
            path="/myshop"
            element={
              <MainLayout>
                <MyShop />
              </MainLayout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
