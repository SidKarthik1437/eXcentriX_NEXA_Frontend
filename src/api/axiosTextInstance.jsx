// src/api/axiosApi.js
import axios from "axios";

export const baseURL = "http://localhost:8000/"; // Adjust this base URL to your Django backend API's URL

// Create an Axios instance
const axiosTextInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    Authorization: localStorage.getItem("token")
      ? "Token " + localStorage.getItem("token")
      : null,
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

// Handle request interceptors
axiosTextInstance.interceptors.request.use(
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
axiosTextInstance.interceptors.response.use(
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

export default axiosTextInstance;
