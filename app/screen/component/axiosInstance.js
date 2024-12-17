import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://e418-115-127-156-9.ngrok-free.app/api",
});

export default axiosInstance;
