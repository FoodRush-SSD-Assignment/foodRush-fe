import axios from "axios";

const orderApi = axios.create({
  baseURL: import.meta.env.VITE_ORDER_SERVICE_URL,
  withCredentials: false,
});

export default orderApi;
