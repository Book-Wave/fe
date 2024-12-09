import axios from 'axios';

export const createRoom = async (roomName) => {
  try {
    const userone = localStorage.getItem('wschat.sender'); // 'wschat.sender'에서 userone 가져오기
    console.log('userone:', userone); // userone 확인
    const usertwo = ''; // usertwo는 공백으로 설정
    console.log('요청 데이터:', { roomName, userone, usertwo }); // 요청 데이터 확인

    const response = await axios.post(
      'http://52.78.186.21:8080/book/chat/rooms', // API endpoint
      { roomName, userone, usertwo } // 요청 본문에 roomName, userone, usertwo 포함
    );

    console.log('서버 응답:', response.status, response.data); // 서버 응답 상태 및 데이터 확인
    return response.data;
  } catch (error) {
    console.error('채팅방 개설 실패:', error.response || error);
    throw error;
  }
};

export const fetchRooms = async () => {
  try {
    console.log('채팅방 목록 호출 시작');
    const response = await axios.get(
      `http://52.78.186.21:8080/book/chat/rooms`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('응답 상태 코드:', response.status); // 응답 상태 코드 확인
    console.log('응답 데이터:', response.data); // 응답 데이터 확인

    if (response.status === 200) {
      return Array.isArray(response.data) ? response.data : [];
    } else {
      throw new Error('채팅방 목록을 불러오는 데 실패했습니다.');
    }
  } catch (error) {
    console.error('에러 발생 (fetchRooms):', error.response || error);
    throw error;
  }
};

const parseMessages = (data) => {
  try {
    // 데이터가 이미 JSON 객체인 경우
    if (Array.isArray(data)) {
      return data;
    }
    console.warn('메시지 데이터가 예상과 다릅니다:', data);
    return [];
  } catch (error) {
    console.error('메시지 데이터 파싱 실패:', error);
    return [];
  }
};

export const fetchRoomDetails = async (roomId) => {
  const token = localStorage.getItem('access_token');
  const sender = localStorage.getItem('wschat.sender');

  if (!token) {
    console.error('JWT 토큰이 없습니다. 로그인이 필요합니다.');
    throw new Error('JWT 토큰이 없습니다.');
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    params: { sender },
  };

  try {
    console.log('Room ID:', roomId);

    // 병렬로 Room과 Messages 데이터 가져오기
    const [roomRes, messagesRes] = await Promise.all([
      axios.get(`http://52.78.186.21:8080/book/chat/${roomId}`, config),
      axios.get(
        `http://52.78.186.21:8080/book/chat/${roomId}/messages`,
        config
      ),
    ]);

    if (typeof messagesRes.data !== 'object') {
      console.error('Messages API 응답이 HTML입니다:', messagesRes.data);
      throw new Error('메시지 데이터가 유효하지 않습니다.');
    }

    console.log('Room API 응답:', roomRes.status, roomRes.data);
    console.log('Messages API 응답:', messagesRes.status, messagesRes.data);

    return {
      room: roomRes.data,
      messages: parseMessages(messagesRes.data),
    };
  } catch (error) {
    console.error('API 요청 실패:', error.response || error);
    throw error;
  }
};
