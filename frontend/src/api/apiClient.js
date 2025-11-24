import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5002", // Negotiation Service
  withCredentials: false,
});

export default apiClient;
