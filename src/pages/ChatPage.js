import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import ChatRoomList from '../components/ChatRoomList';
import ChatRoomDetail from '../components/ChatRoomDetail';
import { fetchRooms } from '../services/ChatService';

const ChatPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, []);

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
