import axios from "axios";

const deliveryApi = axios.create({
  baseURL: import.meta.env.VITE_DELIVERY_SERVICE_URL,
  withCredentials: false,
});

export default deliveryApi;
