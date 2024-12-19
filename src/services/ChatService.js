import axiosInstance from './AxiosInstance';

export const fetchNickName = async () => {
  try {
    const response = await axiosInstance.get('/chat/nickname');
    console.log(response);
    return response.data;
  } catch (error) {
    console.log('닉네임을 불러오지 못했습니다.');
    throw error;
  }
};

export const createRoom = async (sender, receiver) => {
  try {
    const response = await axiosInstance.post('/chat/rooms', {
      sender,
      receiver,
    });

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
    const sender = localStorage.getItem('wschat.sender');
    const encodedSender = encodeURIComponent(sender);
    const response = await axiosInstance.get('/chat/rooms', {
      headers: {
        'X-Sender': encodedSender,
      },
    });

    if (response.status === 200) {
      // 데이터 가공: message: 제거
      return Array.isArray(response.data)
        ? response.data.map((roomKey) => ({
            roomId: roomKey.replace('message:', ''), // message: 제거
            fullKey: roomKey, // 원래 key 보존
          }))
        : [];
    }
  } catch (error) {
    console.error('에러 발생 (fetchRooms):', error.response || error);
    throw error;
  }
};

export const fetchRoomDetails = async (roomId) => {
  try {
    const response = await axiosInstance.get(`/chat/rooms/${roomId}/messages`);
    console.log('API 응답:', response.data); // 디버깅을 위한 로그 추가
    return response.data; // 응답 데이터를 그대로 반환
  } catch (error) {
    console.error('API 요청 실패:', error);
    throw error;
  }
};

export const markMessagesAsRead = async (
  roomId,
  unreadMessageIds,
  receiver
) => {
  try {
    const response = await axiosInstance.post(`/chat/rooms/${roomId}/read`, {
      messageIds: unreadMessageIds,
      receiver: receiver,
    });
    console.log('읽음 처리 완료:', response.data);
  } catch (error) {
    console.error('읽음 처리 실패:', error.response || error);
    throw error;
  }
};
