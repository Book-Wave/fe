import React, { useEffect, useState } from 'react';
import { createRoom, fetchRooms } from '../services/ChatService';
import { useNavigate } from 'react-router-dom';

const ChatRoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const navigate = useNavigate();

  const loadRooms = async () => {
    try {
      const roomData = await fetchRooms();
      setRooms(roomData);
    } catch (error) {
      console.error('채팅방 목록 불러오기 실패:', error);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      alert('채팅방 이름을 입력해주세요.');
      return;
    }
    try {
      await createRoom(roomName);
      alert(`${roomName} 방 개설에 성공하였습니다.`);
      setRoomName('');
      loadRooms();
    } catch (error) {
      console.error('채팅방 개설 실패:', error);
      alert('채팅방 개설에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const enterRoom = (roomId) => {
    const sender = prompt('대화명을 입력해 주세요.');
    if (sender) {
      localStorage.setItem('wschat.sender', sender);
      localStorage.setItem('wschat.roomId', roomId);
      navigate(`/chat/room/${roomId}`);
    }
  };

  return (
    <div className="w-1/4 bg-white border-r border-gray-300 h-screen">
      {/* Sidebar Header */}
      <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-indigo-600 text-white">
        <h1 className="text-2xl font-semibold">Chat Web</h1>
      </header>

      {/* 채팅방 생성 */}
      <div className="p-4">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="채팅방 이름을 입력하세요"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && handleCreateRoom()}
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={handleCreateRoom}
          >
            생성
          </button>
        </div>
      </div>

      {/* 채팅방 목록 */}
      <div className="overflow-y-auto h-[calc(100%-8rem)] p-3">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div
              key={room.roomId}
              className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
              onClick={() => enterRoom(room.roomId)}
            >
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                <img
                  src={`https://placehold.co/200x200/ffa8e4/ffffff?text=${room.roomname[0]}`}
                  alt="Room Avatar"
                  className="w-12 h-12 rounded-full"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{room.roomname}</h2>
                <p className="text-gray-600">
                  생성자: {room.creator || '알 수 없음'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">
            채팅방이 없습니다. 새로 만들어보세요!
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatRoomList;
