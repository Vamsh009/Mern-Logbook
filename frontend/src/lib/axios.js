import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development"
  ? `http://${window.location.hostname}:3000/api`
  : "/api";

const api = axios.create({
  baseURL: BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if(token && config.headers){
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api
