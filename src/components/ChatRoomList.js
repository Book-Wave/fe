import React, { useState } from 'react';
import { createRoom, fetchRooms } from '../services/ChatService';

const ChatRoomList = ({ rooms, style }) => {
  const [roomName, setRoomName] = useState('');

  const handleCreateRoom = async () => {
    if (!roomName) {
      alert('채팅방 이름을 입력해주세요.');
      return;
    }
    try {
      await createRoom(roomName);
      alert(`${roomName} 방 개설에 성공하였습니다.`);
      setRoomName('');
    } catch (error) {
      console.error('채팅방 개설 실패:', error);
    }
  };

  const enterRoom = (roomId) => {
    const sender = prompt('대화명을 입력해 주세요.');
    if (sender) {
      localStorage.setItem('wschat.sender', sender);
      localStorage.setItem('wschat.roomId', roomId);
      window.location.href = `/room/${roomId}`;
    }
  };

  return (
    <div style={style}>
      <h3>채팅방 리스트</h3>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && handleCreateRoom()}
        />
        <button className="btn btn-primary" onClick={handleCreateRoom}>
          채팅방 개설
        </button>
      </div>
      <ul className="list-group">
        {rooms.map((item) => (
          <li
            key={item.roomId}
            className="list-group-item list-group-item-action"
            onClick={() => enterRoom(item.roomId)}
          >
            {item.roomName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatRoomList;
