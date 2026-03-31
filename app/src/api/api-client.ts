import axios from "axios";
import { API_Response_Error } from "../types/api-response";
import { useAuthStore } from "../store/use-auth-store";


const API_BASE_URL = "http://192.168.1.173:3000/api"; // Placeholder, update as needed

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add a response interceptor to handle global error structure
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data) {
      const apiError = error.response.data as API_Response_Error;
      console.error(`[API Error] ${apiError.path}: ${apiError.error} (${apiError.statusCode})`);
      
      // Attach the backend error message to the error object for hooks to use
      if (apiError.error) {
        error.message = apiError.error;
      }
    }
    return Promise.reject(error);
  }
);


export default apiClient;

