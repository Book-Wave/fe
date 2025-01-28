import React, { useEffect, useState } from 'react';
import { fetchRooms } from '../services/ChatService';
import { useNavigate } from 'react-router-dom';

const ChatRoomList = () => {
  const [rooms, setRooms] = useState([]);
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

  const enterRoom = (roomId) => {
    navigate(`/chat/room/${roomId}`);
  };

  const formatRoomName = (roomId) => {
    return roomId.replace('messages:', '');
  };

  const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="overflow-y-auto flex-grow p-3">
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
        <div className="text-center py-8">
          <p className="text-gray-500 mb-2">진행 중인 채팅이 없습니다.</p>
          <p className="text-sm text-gray-400">
            관심있는 상품의 구매하기 버튼을 눌러
            <br />
            판매자와 대화를 시작해보세요!
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatRoomList;
