import axios from "axios";

const PRODUCT_BASE = "http://localhost:5001";
const PRODUCT_API = `${PRODUCT_BASE}/api/v1/products/items`;

async function ensureProductToken() {
  let token = localStorage.getItem("productServiceToken");
  const authToken = localStorage.getItem("authToken");
  if (!token && authToken) {
    try {
      const res = await fetch(`${PRODUCT_BASE}/api/token/exchange`, {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.token) {
          localStorage.setItem("productServiceToken", data.token);
          token = data.token;
        }
      }
    } catch (_) {}
  }
  return token || authToken || null;
}

export const getAllItems = async () => {
  const token = await ensureProductToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return axios.get(PRODUCT_API, { headers });
};

export const getItemById = async (itemId) => {
  const token = await ensureProductToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return axios.get(`${PRODUCT_API}/${itemId}`, { headers });
};

export const createItem = async (data) => {
  const token = await ensureProductToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return axios.post(PRODUCT_API, data, { headers });
};

export const updateItem = async (itemId, data) => {
  const token = await ensureProductToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return axios.put(`${PRODUCT_API}/${itemId}`, data, { headers });
};

export const deleteItem = async (itemId) => {
  const token = await ensureProductToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return axios.delete(`${PRODUCT_API}/${itemId}`, { headers });
};
