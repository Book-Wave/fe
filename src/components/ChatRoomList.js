import React, { useEffect, useState } from 'react';
import { createRoom, fetchRooms } from '../services/ChatService';
import { useNavigate } from 'react-router-dom';

const ChatRoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [receiverName, setReceiverName] = useState('');
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
    const sender = localStorage.getItem('wschat.sender');
    console.log(sender);
    if (!receiverName.trim()) {
      alert('대화 상대를 입력해주세요.');
      return;
    }
    try {
      await createRoom(sender, receiverName.trim());
      alert(`${receiverName} 님과의 채팅방이 생성되었습니다.`);
      loadRooms();
    } catch (error) {
      console.error('채팅방 개설 실패:', error);
      alert('채팅방 개설에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const enterRoom = (roomId) => {
    navigate(`/chat/room/${roomId}`);
  };

  return (
    <div className="overflow-y-auto flex-grow p-3">
      {/* 새 채팅방 생성 섹션 */}
      <div className="mb-4">
        <input
          type="text"
          value={receiverName}
          onChange={(e) => setReceiverName(e.target.value)}
          placeholder="대화 상대를 입력하세요"
          className="border p-2 rounded-md w-full"
        />
        <button
          onClick={handleCreateRoom}
          className="bg-indigo-500 text-white px-4 py-2 mt-2 rounded-md"
        >
          채팅방 만들기
        </button>
      </div>

      {rooms.length > 0 ? (
        rooms.map((room) => (
          <div
            key={room.roomId}
            className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
            onClick={() => enterRoom(room.roomId)} // roomId 사용
          >
            <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
              <img
                src={`https://placehold.co/200x200/ffa8e4/ffffff?text=${room.roomId[0]}`}
                alt="Room Avatar"
                className="w-12 h-12 rounded-full"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{room.roomId}</h2>
              <p className="text-gray-600">방 ID: {room.fullKey}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">
          채팅방이 없습니다. 새로 만들어보세요!
        </p>
      )}
    </div>
  );
};

export default ChatRoomList;
