import axios from "axios";

const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_SERVICE_URL,
  withCredentials: false,
});

export default authApi;
