import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
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
        setRooms(roomData);
      } catch (error) {
        console.error('채팅방 목록을 가져오는 데 실패했습니다.', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* 채팅방 목록 */}
      <div
        style={{
          width: '300px',
          borderRight: '1px solid #ccc',
          padding: '10px',
        }}
      >
        {loading ? <p>로딩 중...</p> : <ChatRoomList rooms={rooms} />}
      </div>

      {/* 채팅방 상세 */}
      <div
        style={{
          flexGrow: 1,
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Routes>
          {/* 기본 경로는 첫 번째 채팅방으로 리다이렉트 */}
          <Route
            path="/"
            element={
              rooms.length > 0 ? (
                <Navigate to={`/chat/room/${rooms[0].roomId}`} />
              ) : (
                <p>채팅방이 없습니다.</p>
              )
            }
          />
          {/* 특정 채팅방 경로 */}
          <Route path="/room/:roomId" element={<ChatRoomDetail />} />
        </Routes>
      </div>
    </div>
  );
};

export default ChatPage;
