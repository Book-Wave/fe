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

  //최신 메시지 스크롤 ref
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
    <div className="flex-1 p-2 sm:p-6 justify-between flex flex-col h-screen">
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <span className="absolute text-green-500 right-0 bottom-0">
              <svg width="20" height="20">
                <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
              </svg>
            </span>
            <img
              src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=144&h=144"
              alt="profile"
              className="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <div className="text-2xl mt-1 flex items-center">
              <span className="text-gray-700 mr-3">
                {room.name || '채팅방'}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        id="messages"
        className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
      >
        {messages.length > 0 ? (
          messages.map((msg, idx) => (
            <div key={idx} className="chat-message">
              <div
                className={`flex items-end ${
                  msg.sender === sender ? 'justify-end' : ''
                }`}
              >
                <div
                  className={`flex flex-col space-y-2 text-xs max-w-xs mx-2 ${
                    msg.sender === sender
                      ? 'order-1 items-end'
                      : 'order-2 items-start'
                  }`}
                >
                  <div>
                    <span
                      className={`px-4 py-2 rounded-lg inline-block ${
                        msg.sender === sender
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-gray-300 text-gray-600 rounded-bl-none'
                      }`}
                    >
                      {msg.message || '내용 없음'}
                    </span>
                  </div>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=3&w=144&h=144"
                  alt="profile"
                  className="w-6 h-6 rounded-full order-1"
                />
              </div>
            </div>
          ))
        ) : (
          <div>메시지가 없습니다.</div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
        <div className="relative flex">
          <span className="absolute inset-y-0 flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-gray-600"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                ></path>
              </svg>
            </button>
          </span>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메시지를 입력하세요"
            className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
          />
          <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
            <button
              type="button"
              onClick={sendMessage}
              className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-gray-600"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomDetail;
