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

  // 채팅방 이름을 깔끔하게 표시하는 함수
  const formatRoomName = (roomId) => {
    return roomId.replace('messages:', '');
  };

  // 사용자 이니셜을 가져오는 함수
  const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="overflow-y-auto flex-grow p-3">
      <div className="mb-4">
        <input
          type="text"
          value={receiverName}
          onChange={(e) => setReceiverName(e.target.value)}
          placeholder="대화 상대를 입력하세요"
          className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleCreateRoom}
          className="bg-indigo-500 text-white px-4 py-2 mt-2 rounded-md w-full hover:bg-indigo-600 transition-colors"
        >
          채팅방 만들기
        </button>
      </div>

      {rooms.length > 0 ? (
        rooms.map((room) => {
          const roomName = formatRoomName(room.roomId);
          return (
            <div
              key={room.roomId}
              onClick={() => enterRoom(room.roomId)}
              className="flex items-center mb-2 cursor-pointer hover:bg-gray-100 p-3 rounded-lg transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-3 text-indigo-600 font-semibold">
                {getInitials(roomName)}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-medium text-gray-800">
                  {roomName}
                </h2>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-sm text-gray-500 text-center mt-4">
          채팅방이 없습니다. 새로 만들어보세요!
        </p>
      )}
    </div>
  );
};

export default ChatRoomList;
