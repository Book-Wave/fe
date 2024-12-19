import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import { fetchRoomDetails, markMessagesAsRead } from '../services/ChatService'; // 정확한 경로로 수정
import { useParams } from 'react-router-dom';
import { getAccessToken } from '../utils/TokenUtil';

const ChatRoomDetail = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [unreadMessages, setUnreadMessages] = useState(0); // 읽지 않은 메시지
  const client = useRef(null);
  const messagesEndRef = useRef(null);
  const { roomId } = useParams();

  const sender = localStorage.getItem('wschat.sender');

  // receiver 설정
  const [receiver, setReceiver] = useState(null);
  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid Date';
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  useEffect(() => {
    if (!roomId || !sender) return;
    const users = roomId.split('-');
    setReceiver(users.find((user) => user !== sender)); // sender가 아닌 유저 선택
  }, [roomId, sender]);

  // 최신 메시지 스크롤 ref
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const subscribe = useCallback(() => {
    if (client.current) {
      client.current.subscribe(`/sub/${roomId}`, ({ body }) => {
        const newMessage = JSON.parse(body);
        console.log('새 메시지 수신:', newMessage);

        setMessages((prevMessages) => {
          // 중복 메시지 방지
          if (
            !prevMessages.some(
              (msg) =>
                msg.messagetime === newMessage.messagetime &&
                msg.sender === newMessage.sender
            )
          ) {
            return [...prevMessages, newMessage];
          }
          return prevMessages;
        });

        if (newMessage.sender === receiver) {
          setUnreadMessages((prev) => prev + 1);
        }
      });
    }
  }, [roomId, receiver]);

  const connect = useCallback(() => {
    if (client.current && client.current.connected) {
      console.log('WebSocket already connected');
      return;
    }
    console.log('WebSocket 연결 시도...');
    const token = getAccessToken('access_token');
    console.log('사용 중인 토큰:', token);

    client.current = new Client({
      brokerURL: 'ws://52.78.186.21:8080/ws',
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: console.log,
      onConnect: () => {
        console.log('WebSocket 연결 성공');
        subscribe();
      },
      onStompError: (frame) => {
        console.error('STOMP 오류:', frame.headers['message'], frame.body);
      },
      onWebSocketClose: (event) => {
        console.warn('WebSocket 연결 종료:', event.code, event.reason);
      },
    });

    client.current.activate();
  }, [subscribe]);

  const fetchRoomData = useCallback(async () => {
    try {
      const messages = await fetchRoomDetails(roomId);
      if (Array.isArray(messages)) {
        setMessages(messages);
        const unreadCount = messages.filter(
          (msg) => msg.sender === receiver && !msg.isRead
        ).length;
        setUnreadMessages(unreadCount);
      } else {
        console.error('예상치 못한 응답 형식:', messages);
        setMessages([]);
        setUnreadMessages(0);
      }
    } catch (error) {
      console.error('채팅방 데이터를 가져오는 데 실패했습니다.', error);
      setMessages([]);
      setUnreadMessages(0);
    }
  }, [roomId, receiver]);

  // 읽음 처리
  const markAsRead = useCallback(async () => {
    try {
      // 상대방 메시지만 읽음 처리
      const unreadMessageIds = messages
        .filter((msg) => msg.sender === receiver && !msg.isRead)
        .map((msg) => msg.messageId);

      if (unreadMessageIds.length > 0) {
        await markMessagesAsRead(roomId, unreadMessageIds, receiver);
        setUnreadMessages(0); // 읽지 않은 메시지 초기화
      }
    } catch (error) {
      console.error('읽음 처리 실패', error);
    }
  }, [roomId, messages, receiver]);

  useEffect(() => {
    fetchRoomData();
    connect();
    return () => {
      if (client.current) {
        client.current.deactivate();
        console.log('WebSocket 연결 해제');
      }
    };
  }, [roomId, fetchRoomData, connect]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    markAsRead();
  }, [markAsRead, messages]);

  const sendMessage = () => {
    const token = getAccessToken('access_token');
    console.log('메세지 시도: ' + message);
    if (client.current && client.current.connected && message.trim()) {
      const now = new Date();
      const formattedTime = formatDate(now);

      const newMessage = {
        roomId,
        sender,
        receiver,
        message,
        messagetime: formattedTime,
      };
      client.current.publish({
        destination: '/pub/message',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newMessage),
      });
      console.log('보낸 메시지:', newMessage);

      // 로컬 상태 업데이트
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="bg-white p-4 border-b border-gray-300">
        <h1 className="text-2xl font-semibold">
          {roomId || '채팅방'}
          {unreadMessages > 0 && (
            <span className="ml-2 text-red-500">({unreadMessages})</span>
          )}
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 pb-32">
        {messages.map((msg, index) => (
          <div
            key={msg.messageId || `msg-${index}`}
            className={`flex ${msg.sender === sender ? 'justify-end' : ''}`}
          >
            <div
              className={`${
                msg.sender === sender
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 text-black'
              } max-w-[75%] rounded-lg p-3 mb-2`}
            >
              {msg.sender !== sender && (
                <div className="text-xs text-gray-500 mb-1">{receiver}</div>
              )}
              {msg.message}
              <div className="text-xs text-gray-500 mt-1">
                {formatDate(msg.messagetime)}
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
