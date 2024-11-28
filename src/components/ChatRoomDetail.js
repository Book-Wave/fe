import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { fetchRoomDetails } from '../services/ChatService';

const ChatRoomDetail = () => {
  const [room, setRoom] = useState({});
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const client = useRef(null);

  const roomId = localStorage.getItem('wschat.roomId');

  const subscribe = useCallback(() => {
    client.current.subscribe(`/sub/${roomId}`, ({ body }) => {
      const newMessage = JSON.parse(body);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  }, [roomId]);

  const connect = useCallback(() => {
    client.current = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      onConnect: () => subscribe(),
    });
    client.current.activate();
  }, [subscribe]);

  const fetchRoomData = async () => {
    const data = await fetchRoomDetails(roomId);
    setRoom(data.room);
    setMessages(data.messages);
  };

  useEffect(() => {
    fetchRoomData();
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
        {messages.map((msg, idx) => (
          <li key={idx}>{`${msg.sender}: ${msg.message}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default ChatRoomDetail;
