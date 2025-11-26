import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5002",
  withCredentials: false,
});

apiClient.interceptors.request.use(async (config) => {
  const authToken = localStorage.getItem("authToken");
  let serviceToken = localStorage.getItem("negotiationServiceToken");

  if (!serviceToken && authToken) {
    try {
      const res = await fetch("http://localhost:5002/api/token/exchange", {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.token) {
          localStorage.setItem("negotiationServiceToken", data.token);
          serviceToken = data.token;
        }
      }
    } catch (_) {}
  }

  const tokenToUse = serviceToken || authToken;
  if (tokenToUse) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${tokenToUse}`;
  }
  return config;
});

export default apiClient;
