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

export const fetchRoomDetails = async (roomId) => {
  const token = localStorage.getItem('access_token'); // JWT 토큰 가져오기
  const sender = localStorage.getItem('wschat.sender');
  console.log('JWT 토큰:', token); // 토큰 확인
  console.log('Sender:', sender); // Sender 값 확인

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      sender: sender, // sender 값을 쿼리 파라미터로 추가
    },
  };

  try {
    console.log('Room ID:', roomId); // 요청하려는 Room ID 확인

    // 첫 번째 요청: room 데이터 가져오기
    const roomRes = await axios.get(
      `http://52.78.186.21:8080/book/chat/${roomId}`,
      config
    );
    console.log('Room API 응답:', roomRes.status, roomRes.data); // room 데이터 응답 상태 및 내용

    // 두 번째 요청: messages 데이터 가져오기
    const messagesRes = await axios.get(
      `http://52.78.186.21:8080/book/chat/${roomId}/messages`,
      config
    );
    console.log('Messages API 응답:', messagesRes.status, messagesRes.data); // messages 데이터 응답 상태 및 내용

    return {
      room: roomRes.data,
      messages: messagesRes.data,
    };
  } catch (error) {
    console.error('API 요청 실패 (fetchRoomDetails):', error.response || error); // 에러 로그 확인
    throw error; // 에러를 다시 던져서 호출한 쪽에서 처리할 수 있도록 함
  }
};
