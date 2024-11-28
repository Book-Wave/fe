import axios from 'axios';

export const createRoom = (roomName) =>
  axios.post('http://localhost:8080/api/rooms', { name: roomName });

export const fetchRooms = () =>
  axios.get('http://localhost:8080/api/rooms').then((res) => res.data);

export const fetchRoomDetails = (roomId) =>
  Promise.all([
    axios.get(`http://localhost:8080/api/rooms/${roomId}`),
    axios.get(`http://localhost:8080/api/rooms/${roomId}/messages`),
  ]).then(([roomRes, messagesRes]) => ({
    room: roomRes.data,
    messages: messagesRes.data,
  }));
