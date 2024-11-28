import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CallbackPage from './pages/CallbackPage';
import NewUser from './pages/NewUser';
import ChatPage from './pages/ChatPage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/register" element={<NewUser />} />
          <Route path="/kakao/callback" element={<CallbackPage />} />
          <Route path="/naver/callback" element={<CallbackPage />} />
          <Route path="/chat/*" element={<ChatPage />} />
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
