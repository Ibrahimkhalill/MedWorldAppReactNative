import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://209.38.159.136/api",
});

export default axiosInstance;
