import axios from "axios";

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_SERVICE_URL,
  withCredentials: false,
});

export default adminApi;
