import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import { fetchRoomDetails } from '../services/ChatService'; // 정확한 경로로 수정

const ChatRoomDetail = () => {
  const [room, setRoom] = useState({});
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const client = useRef(null);
  const messagesEndRef = useRef(null);

  const roomId = localStorage.getItem('wschat.roomId');
  const sender = localStorage.getItem('wschat.sender');

  // 최신 메시지 스크롤 ref
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const subscribe = useCallback(() => {
    if (client.current) {
      if (client.current.subscribed) return;

      const messageIds = new Set(); // 중복 메시지 방지용

      client.current.subscribe(`/sub/${roomId}`, ({ body }) => {
        const newMessage = JSON.parse(body);
        setMessages((prevMessages) => {
          if (messageIds.has(newMessage.id)) return prevMessages;
          messageIds.add(newMessage.id);
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
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
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-300">
        {/* Sidebar Header */}
        <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-indigo-600 text-white">
          <h1 className="text-2xl font-semibold">Chat Web</h1>
        </header>

        {/* Contact List */}
        <div className="overflow-y-auto h-screen p-3 mb-9 pb-20">
          {room.users?.map((user, index) => (
            <div
              className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
              key={index}
            >
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                <img
                  src={`https://placehold.co/200x/ffa8e4/ffffff.svg?text=${user.name.charAt(
                    0
                  )}&font=Lato`}
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{user.name}</h2>
                <p className="text-gray-600">{user.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1">
        {/* Chat Header */}
        <header className="bg-white p-4 text-gray-700">
          <h1 className="text-2xl font-semibold">{room.name}</h1>
        </header>

        {/* Chat Messages */}
        <div className="h-screen overflow-y-auto p-4 pb-36">
          {messages.map((msg, index) => (
            <div
              className={`flex mb-4 ${
                msg.sender === sender ? 'justify-end' : ''
              } cursor-pointer`}
              key={index}
            >
              <div
                className={`${
                  msg.sender === sender
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white'
                } max-w-96 rounded-lg p-3 gap-3`}
              >
                <p>{msg.message}</p>
              </div>
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center ml-2`}
              >
                <img
                  src={`https://placehold.co/200x/${
                    msg.sender === sender ? 'b7a8ff' : 'ffa8e4'
                  }/ffffff.svg?text=${msg.sender.charAt(0)}&font=Lato`}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                />
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Chat Input */}
        <footer className="bg-white border-t border-gray-300 p-4 absolute bottom-0 w-3/4">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="메시지를 입력하세요..."
              className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              onClick={sendMessage}
              className="bg-indigo-500 text-white px-4 py-2 ml-2 rounded-md focus:outline-none"
            >
              보내기
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ChatRoomDetail;
