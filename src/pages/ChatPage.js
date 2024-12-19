import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import ChatRoomList from '../components/ChatRoomList';
import ChatRoomDetail from '../components/ChatRoomDetail';
import { fetchRooms, fetchNickName } from '../services/ChatService';

const ChatPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      console.log('fetchCurrentUser');
      try {
        const currentUser = await fetchNickName(); // 닉네임 비동기 호출
        if (currentUser) {
          localStorage.setItem('wschat.sender', currentUser.trim());
          fetchRoomsData(); // 닉네임이 정상적으로 설정되면 채팅방 목록을 가져옴
        } else {
          alert('로그인이 필요합니다.');
          // navigate('/'); // 닉네임이 없는 경우 홈으로 리다이렉트
        }
      } catch (error) {
        console.error('닉네임 가져오기 실패:', error);
        // navigate('/'); // 에러 시 홈으로 리다이렉트
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  const fetchRoomsData = async () => {
    try {
      const roomData = await fetchRooms();
      if (Array.isArray(roomData)) {
        setRooms(roomData); // 배열이면 상태에 저장
      } else {
        console.error('유효하지 않은 데이터 형식입니다.');
      }
    } catch (error) {
      console.error('채팅방 목록을 가져오는 데 실패했습니다.', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* 채팅방 목록 */}
      <div
        style={{
          width: '300px',
          borderRight: '1px solid #ccc',
          padding: '10px',
          overflowY: 'auto',
        }}
      >
        {loading ? <p>로딩 중...</p> : <ChatRoomList rooms={rooms} />}
      </div>

      {/* 채팅방 상세 */}
      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Routes>
          <Route path="/room/:roomId" element={<ChatRoomDetail />} />
        </Routes>
      </div>
    </div>
  );
};

export default ChatPage;
