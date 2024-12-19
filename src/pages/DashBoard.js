import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { whoami } from '../services/AuthService';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const goToChatPage = () => {
    navigate('/chat'); // 원하는 페이지로 이동
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await whoami();
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        setError('유저 정보를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>대시보드</h2>
      {user ? (
        <div>
          <h3>환영합니다, {user.nickname}님!</h3>
          <p>Email: {user.email}</p>
          <p>Hertz: {user.hertz}</p>
        </div>
      ) : (
        <div>
          <p>로그인 정보가 없습니다. </p>
          <button onClick={() => navigate('/login')}>로그인</button>
        </div>
      )}
      <div>
        <button onClick={goToChatPage}>채팅방으로 이동</button>
      </div>
    </div>
  );
};

export default DashboardPage;
