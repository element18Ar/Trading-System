import axios from "axios";

const PRODUCT_API = "http://localhost:5001/api/items";

// Get all items
export const getAllItems = async () => {
  return axios.get(PRODUCT_API);
};

// Get single item
export const getItemById = async (itemId) => {
  return axios.get(`${PRODUCT_API}/${itemId}`);
};

// Create new item
export const createItem = async (data) => {
  return axios.post(PRODUCT_API, data);
};

// Update item
export const updateItem = async (itemId, data) => {
  return axios.put(`${PRODUCT_API}/${itemId}`, data);
};

// Delete item
export const deleteItem = async (itemId) => {
  return axios.delete(`${PRODUCT_API}/${itemId}`);
};
