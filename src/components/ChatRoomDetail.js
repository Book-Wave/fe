import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { fetchRoomDetails } from '../services/ChatService';

const ChatRoomDetail = () => {
  const [room, setRoom] = useState({});
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const client = useRef(null);

  const roomId = localStorage.getItem('wschat.roomId');

  console.log('RoomId from URL:', roomId);

  const subscribe = useCallback(() => {
    if (client.current) {
      if (client.current.subscribed) return;

      client.current.subscribe(`/sub/${roomId}`, ({ body }) => {
        const newMessage = JSON.parse(body);
        setMessages((prevMessages) => {
          if (prevMessages.some((msg) => msg.id === newMessage.id)) {
            return prevMessages; // 중복 메시지 방지
          }
          return [...prevMessages, newMessage];
        });
      });
      client.current.subscribed = true;
    }
  }, [roomId]);

  const connect = useCallback(() => {
    if (client.current && client.current.connected) return; // 이미 연결된 경우 종료
    console.log('WebSocket 연결 시도...');

    client.current = new Client({
      // brokerURL: 'ws://localhost:8080/ws',
      brokerURL: `ws://52.78.186.21:8080/ws`,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => console.log(str),
    });

    client.current.onConnect = () => {
      console.log('WebSocket 연결 성공');
      if (!client.current.subscribed) {
        // 중복 구독 방지
        client.current.subscribed = true;
        subscribe();
      }
    };

    client.current.activate();
  }, [subscribe]);

  const fetchRoomData = useCallback(async () => {
    try {
      const response = await fetchRoomDetails(roomId);
      console.log('Room data:', response); // 응답 로그 찍기
      setRoom(response.room);
      setMessages(response.messages);
    } catch (error) {
      console.error('채팅방 데이터를 가져오는 데 실패했습니다.', error); // 에러 로그 확인
    }
  }, [roomId]);

  useEffect(() => {
    fetchRoomData();
  }, [roomId, fetchRoomData]);

  useEffect(() => {
    connect();
    return () => client.current?.deactivate();
  }, [roomId, connect]);

  const sendMessage = () => {
    const sender = localStorage.getItem('wschat.sender');
    if (client.current && client.current.connected && message.trim()) {
      client.current.publish({
        destination: '/pub/message',
        body: JSON.stringify({ roomId, sender, message, time: new Date() }),
      });
      console.log(message);
      setMessage('');

      fetchRoomData();
    }
  };

  return (
    <div>
      <h2>{room.name || '채팅방'}</h2>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>보내기</button>
      <ul>
        {Array.isArray(messages) &&
          messages.map((msg, idx) => (
            <li key={idx}>{`${msg.sender}: ${msg.message}`}</li>
          ))}
      </ul>
    </div>
  );
};

export default ChatRoomDetail;
