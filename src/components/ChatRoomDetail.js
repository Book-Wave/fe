import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import { fetchRoomDetails } from '../services/ChatService'; // 정확한 경로로 수정

const ChatRoomDetail = () => {
  const [room, setRoom] = useState({});
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [unreadMessages, setUnreadMessages] = useState(0); // 읽지 않은 메시지
  const client = useRef(null);
  const messagesEndRef = useRef(null);
  const messageIds = useRef(new Set());

  const roomId = localStorage.getItem('wschat.roomId');
  const sender = localStorage.getItem('wschat.sender');

  // receiver 설정
  const receiver = useMemo(() => {
    const users = roomId.split('-'); // roomId를 분리
    return users.find((user) => user !== sender); // sender가 아닌 사용자를 receiver로 설정
  }, [roomId, sender]);

  // 최신 메시지 스크롤 ref
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const subscribe = useCallback(() => {
    if (client.current) {
      client.current.subscribe(`/sub/${roomId}`, ({ body }) => {
        const newMessage = JSON.parse(body);

        // 읽지 않은 메시지 처리
        if (newMessage.sender === receiver) {
          setUnreadMessages((prev) => prev + 1);
        }

        setMessages((prevMessages) => {
          if (!messageIds.current.has(newMessage.id)) {
            messageIds.current.add(newMessage.id);
            return [...prevMessages, newMessage];
          }
          return prevMessages;
        });
      });
    }
  }, [roomId, receiver]);

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
      setRoom(response.room);
      setMessages(response.messages);

      // 읽지 않은 메시지 업데이트
      const unreadCount = response.messages.filter(
        (msg) => msg.sender === receiver && !msg.read
      ).length;
      setUnreadMessages(unreadCount);
    } catch (error) {
      console.error('채팅방 데이터를 가져오는 데 실패했습니다.', error);
    }
  }, [roomId, receiver]);

  // 읽음 처리
  const markAsRead = useCallback(async () => {
    try {
      await markMessagesAsRead(roomId, sender);
      setUnreadMessages(0); // 읽지 않은 메시지 초기화
    } catch (error) {
      console.error('읽음 처리 실패', error);
    }
  }, [roomId, sender]);

  useEffect(() => {
    fetchRoomData();
    connect();
    return () => client.current?.deactivate();
  }, [roomId, fetchRoomData, connect]);

  useEffect(() => {
    scrollToBottom();
    markAsRead(); // 메시지가 변경될 때 읽음 처리
  }, [messages, markAsRead]);

  const sendMessage = () => {
    if (client.current && client.current.connected && message.trim()) {
      const newMessage = {
        roomId,
        sender,
        receiver,
        message,
        time: new Date(),
      };
      client.current.publish({
        destination: '/pub/message',
        body: JSON.stringify({
          roomId,
          sender,
          receiver,
          message,
          time: new Date(),
        }),
      });
      console.log('보낸 메시지:', message);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
      scrollToBottom();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="bg-white p-4 border-b border-gray-300">
        <h1 className="text-2xl font-semibold">{room.name}</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 pb-32">
        {messages.map((msg, index) => (
          <div
            className={`flex ${msg.sender === sender ? 'justify-end' : ''}`}
            key={index}
          >
            <div
              className={`${
                msg.sender === sender
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 text-black'
              } max-w-[75%] rounded-lg p-3 mb-2`}
            >
              {msg.message}
              <div className="text-xs text-gray-500 mt-1">
                {new Date(msg.time).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      <footer className="p-4 border-t border-gray-300">
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 p-2 rounded-md border border-gray-400 focus:outline-none"
            placeholder="메시지를 입력하세요..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            보내기
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatRoomDetail;
