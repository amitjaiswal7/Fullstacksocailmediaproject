import axios from 'axios';

const API = axios.create({ baseURL: 'https://fullstacksocailmediaproject.onrender.com/api' });

export const fetchUsers = () => API.get('/users');
export const fetchMessages = (senderId, receiverId) =>
  API.get('/chats', { params: { senderId, receiverId } });
export const sendMessage = (data) => API.post('/chats', data);
