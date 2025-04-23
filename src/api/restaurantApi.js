import axios from "axios";

const restaurantApi = axios.create({
  baseURL: import.meta.env.VITE_RESTAURANT_SERVICE_URL,
  withCredentials: false,
});

export default restaurantApi;
