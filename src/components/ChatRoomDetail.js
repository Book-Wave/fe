import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import { fetchRoomDetails } from '../services/ChatService'; // 정확한 경로로 수정

const ChatRoomDetail = () => {
  const [room, setRoom] = useState({});
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const client = useRef(null);

  const roomId = localStorage.getItem('wschat.roomId');

  const subscribe = useCallback(() => {
    if (client.current) {
      if (client.current.subscribed) return;

      client.current.subscribe(`/sub/${roomId}`, ({ body }) => {
        console.log('WebSocket 메시지 수신:', body);
        const newMessage = JSON.parse(body);
        setMessages((prevMessages) => {
          if (prevMessages.some((msg) => msg.id === newMessage.id)) {
            console.log('중복 메시지 감지:', newMessage);
            return prevMessages;
          }
          return [...prevMessages, newMessage];
        });
      });
      client.current.subscribed = true;
    }
  }, [roomId]);

  const connect = useCallback(() => {
    if (client.current && client.current.connected) return;
    console.log('WebSocket 연결 시도...');

    client.current = new Client({
      brokerURL: `ws://52.78.186.21:8080/ws`,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => console.log(str),
    });

    client.current.onConnect = () => {
      console.log('WebSocket 연결 성공');
      subscribe();
    };
    client.current.onStompError = (frame) => {
      console.error('STOMP 오류:', frame.headers['message'], frame.body);
    };
    client.current.onWebSocketClose = () => {
      console.warn('WebSocket 연결이 종료되었습니다.');
    };

    client.current.activate();
  }, [subscribe]);

  const fetchRoomData = useCallback(async () => {
    try {
      const response = await fetchRoomDetails(roomId);
      console.log('Room data:', response);
      setRoom(response.room);
      setMessages(response.messages);
    } catch (error) {
      console.error('채팅방 데이터를 가져오는 데 실패했습니다.', error);
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
      console.log('보낸 메시지:', message);
      setMessage('');
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
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((msg, idx) => (
            <li key={idx}>
              {msg.sender ? `${msg.sender}: ` : ''}
              {msg.message || '내용 없음'}
            </li>
          ))
        ) : (
          <li>메시지가 없습니다.</li>
        )}
      </ul>
    </div>
  );
};

export default ChatRoomDetail;
