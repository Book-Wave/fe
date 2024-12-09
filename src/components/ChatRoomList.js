import React, { useEffect, useState } from 'react';
import { createRoom, fetchRooms } from '../services/ChatService';
import { useNavigate } from 'react-router-dom';

const ChatRoomList = ({ style }) => {
  const [rooms, setRooms] = useState([]); // 채팅방 목록 상태
  const [roomName, setRoomName] = useState(''); // 새 채팅방 이름 입력 상태
  const navigate = useNavigate();

  // 채팅방 목록 불러오기
  const loadRooms = async () => {
    try {
      console.log('채팅방 목록을 불러옵니다...');
      const roomData = await fetchRooms();
      setRooms(roomData); // 상태 업데이트
      console.log('채팅방 목록:', roomData);
    } catch (error) {
      console.error('채팅방 목록 불러오기 실패:', error);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadRooms();
  }, []);

  // 새 채팅방 생성
  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      alert('채팅방 이름을 입력해주세요.');
      return;
    }
    try {
      console.log('채팅방 생성 요청:', roomName);
      await createRoom(roomName);
      alert(`${roomName} 방 개설에 성공하였습니다.`);
      setRoomName(''); // 입력 필드 초기화
      loadRooms(); // 채팅방 목록 갱신
    } catch (error) {
      console.error('채팅방 개설 실패:', error);
      alert('채팅방 개설에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 채팅방 입장
  const enterRoom = (roomId) => {
    const sender = prompt('대화명을 입력해 주세요.');
    if (sender) {
      localStorage.setItem('wschat.sender', sender);
      localStorage.setItem('wschat.roomId', roomId);
      navigate(`/chat/room/${roomId}`); // React Router로 이동
    }
  };

  return (
    <div style={style} className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        채팅방 리스트
      </h3>

      {/* 새 채팅방 생성 */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="채팅방 이름을 입력하세요"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && handleCreateRoom()} // Enter 키 이벤트 처리
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={handleCreateRoom}
        >
          채팅방 개설
        </button>
      </div>

      {/* 채팅방 목록 */}
      <ul role="list" className="divide-y divide-gray-100">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <li
              key={room.roomId}
              className="flex justify-between gap-x-6 py-5 cursor-pointer hover:bg-gray-50"
              onClick={() => enterRoom(room.roomId)}
            >
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold text-gray-900">
                  {room.roomname}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  생성자: {room.creator || '알 수 없음'}
                </p>
              </div>
              <div className="hidden sm:flex sm:flex-col sm:items-end">
                <p className="text-sm text-gray-900">{room.members || 0}명</p>
              </div>
            </li>
          ))
        ) : (
          <li className="text-sm text-gray-500">
            채팅방이 없습니다. 새로 만들어보세요!
          </li>
        )}
      </ul>
    </div>
  );
};

export default ChatRoomList;
