// src/api/axiosApi.js
import axios from "axios";

export const baseURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BASE_URL_PROD
    : import.meta.env.VITE_BASE_URL_DEV || "http://localhost:8000";

// Create an Axios instance
const axiosImageInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    Authorization: localStorage.getItem("token")
      ? "Token " + localStorage.getItem("token")
      : null,
    "Content-Type": "multipart/form-data",
    accept: "multipart/form-data",
  },
});

// Handle request interceptors
axiosImageInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    // return Promise.reject(error);
    console.log(error);
  }
);

// Handle response interceptors
axiosImageInstance.interceptors.response.use(
  (response) => {
    // Your response handling logic here
    return response;
  },
  (error) => {
    // Your error handling logic here
    // For example, redirecting to login on 401 Unauthorized response
    if (error.response.status === 401) {
      window.location.href = "/login/";
      console.log(error);
    }
    return Promise.reject(error);
  }
);

export default axiosImageInstance;
