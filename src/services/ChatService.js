import axios from 'axios';

export const createRoom = async (roomName) => {
  try {
    const userone = localStorage.getItem('wschat.sender'); // 'wschat.sender'에서 userone 가져오기
    const usertwo = ''; // usertwo는 공백으로 설정

    const response = await axios.post(
      'http://52.78.186.21:8080/book/chat/rooms', // API endpoint
      { roomName, userone, usertwo } // 요청 본문에 roomName, userone, usertwo 포함
    );

    console.log('서버 응답:', response); // 서버 응답 확인
    return response.data;
  } catch (error) {
    console.error('채팅방 개설 실패:', error.response || error);
    throw error;
  }
};

export const fetchRooms = async () => {
  try {
    // const response = await axios.get('http://localhost:8080/api/rooms', {
    const response = await axios.get(
      `http://52.78.186.21:8080/book/chat/rooms`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ); // 채팅방 목록 API 호출
    // 응답 상태가 200일 때만 처리
    if (response.status === 200) {
      // 만약 response.data가 배열이 아니라면 빈 배열로 처리
      return Array.isArray(response.data) ? response.data : [];
    } else {
      throw new Error('채팅방 목록을 불러오는 데 실패했습니다.');
    }
  } catch (error) {
    console.error('에러:', error);
    throw error;
  }
};

export const fetchRoomDetails = async (roomId) => {
  const token = localStorage.getItem('access_token'); // JWT 토큰 가져오기
  const sender = localStorage.getItem('wschat.sender');
  console.log(token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      sender: sender, // sender 값을 쿼리 파라미터로 추가
    },
  };
  try {
    // 첫 번째 요청: room 데이터 가져오기
    const roomRes = await axios.get(
      `http://52.78.186.21:8080/book/chat/${roomId}`,
      // `http://localhost:8080/api/rooms/${roomId}`,
      config
    );

    // 두 번째 요청: messages 데이터 가져오기
    const messagesRes = await axios.get(
      `http://52.78.186.21:8080/book/chat/${roomId}/messages`,
      // `http://localhost:8080/api/rooms/${roomId}/messages`,
      config
    );

    console.log('Room Response:', roomRes.data); // room 데이터 확인
    console.log('Messages Response:', messagesRes.data); // 메시지 데이터 확인

    return {
      room: roomRes.data,
      messages: messagesRes.data,
    };
  } catch (error) {
    console.error('API 요청 실패:', error); // 에러 로그 확인
    throw error; // 에러를 다시 던져서 호출한 쪽에서 처리할 수 있도록 함
  }
};
