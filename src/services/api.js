import axios from 'axios';

const api = axios.create({
  baseURL: process.env.BACKEND_API || '', //your api URL
});

export default api;
