// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/DashBoard';
import CallbackPage from './pages/auth/CallBack';
import RegisterPage from './pages/auth/RegisterPage';
import ChatPage from './pages/ChatPage';
import MainLayout from './pages/MainLayout';
import ForgetPW from './pages/auth/ForgetPW';
import ItemList from './components/ItemList';
import ItemDetail from './components/ItemDetail';
import ItemRegisterPage from './pages/ItemRegisterPage';
import ItemUpdatePage from './pages/ItemUpdatePage';
import BookSearch from './components/BookSearch';
import MyShopPage from './pages/MyShopPage';

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
          <Route
            path="/book-search"
            element={
              <MainLayout>
                <BookSearch />
              </MainLayout>
            }
          />
          <Route
            path="/shop/:nickname"
            element={
              <MainLayout>
                <MyShopPage />
              </MainLayout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
