import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import { fetchRoomDetails, markMessagesAsRead } from '../services/ChatService';
import { useParams } from 'react-router-dom';
import { getAccessToken } from '../utils/TokenUtil';

const ChatRoomDetail = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [unreadMessages, setUnreadMessages] = useState(0);
  const client = useRef(null);
  const messagesEndRef = useRef(null);
  const { roomId } = useParams();

  const sender = localStorage.getItem('wschat.sender');
  const [receiver, setReceiver] = useState(null);

  const cleanRoomId = roomId?.replace('messages:', ''); // 방 이름에서 "messages:" 제거

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

  // Receiver 설정
  useEffect(() => {
    if (!roomId || !sender) return;
    const users = cleanRoomId.split('-');
    setReceiver(users.find((user) => user !== sender));
  }, [cleanRoomId, sender]);

  // 메시지 목록 아래로 자동 스크롤
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const subscribe = useCallback(() => {
    if (client.current?.connected) {
      client.current.subscribe(`/sub/${roomId}`, ({ body }) => {
        const newMessage = JSON.parse(body);
        console.log('새 메시지 수신:', newMessage);

        setMessages((prevMessages) => {
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
    } else {
      console.error('WebSocket 연결이 활성화되지 않았습니다.');
    }
  }, [roomId, receiver]);

  const connect = useCallback(() => {
    if (client.current?.connected) {
      console.log('이미 WebSocket이 연결되어 있습니다.');
      return;
    }

    console.log('WebSocket 연결 시도...');
    const token = getAccessToken('access_token');

    client.current = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 0,
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
      const unreadMessageIds = messages
        .filter((msg) => msg.sender === receiver && !msg.isRead)
        .map((msg) => msg.messageId);

      if (unreadMessageIds.length > 0) {
        await markMessagesAsRead(roomId, unreadMessageIds, receiver);
        setUnreadMessages(0);
      }
    } catch (error) {
      console.error('읽음 처리 실패:', error);
    }
  }, [messages, receiver, roomId]);

  // WebSocket 연결 및 메시지 데이터 가져오기
  useEffect(() => {
    const initialize = async () => {
      await fetchRoomData();
      connect();
    };
    initialize();

    return () => {
      if (client.current) {
        client.current.deactivate();
        client.current = null;
        console.log('WebSocket 연결 해제');
      }
    };
  }, [fetchRoomData, connect]);

  // 메시지가 변경될 때 읽음 처리 및 스크롤
  useEffect(() => {
    scrollToBottom();
    markAsRead();
  }, [messages, markAsRead, scrollToBottom]);

  const sendMessage = () => {
    const token = getAccessToken('access_token');
    if (client.current?.connected && message.trim()) {
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
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="bg-white p-4 border-b border-gray-300">
        <h1 className="text-2xl font-semibold">
          {cleanRoomId || '채팅방'}
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
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-black'
              } max-w-[75%] rounded-lg p-3 mb-2 shadow`}
            >
              {msg.sender !== sender && (
                <div className="text-xs text-gray-500 mb-1">{msg.sender}</div>
              )}
              <div className="text-sm">{msg.message}</div>
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
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
          >
            보내기
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatRoomDetail;
