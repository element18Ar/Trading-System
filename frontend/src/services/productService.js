// src/features/product/api/productService.js

import axios from 'axios';

// NOTE: In a full system, you would get the base URL from an environment variable
const PRODUCT_API_URL = '/api/products/items'; 

// 1. Get All Items (Catalog View)
export const getAllItems = async () => {
    try {
        // Your backend route: GET /api/products/items
        const response = await axios.get(PRODUCT_API_URL);
        
        // Assuming your backend returns data in the format: { data: { items: [...] } }
        return response.data.data.items;
    } catch (error) {
        console.error('Error fetching items:', error);
        throw new Error('Failed to retrieve product listings.');
    }
};

// 2. List a New Item
export const listItem = async (itemData, token) => {
    try {
        // Headers are needed to send the authentication token and tell the server we're sending JSON
        const config = {
            headers: {
                'Content-Type': 'application/json',
                // This token comes from the Auth-Service and is required by the Product-Service POST endpoint
                'Authorization': `Bearer ${token}` 
            },
        };

        // Your backend route: POST /api/products/items
        const response = await axios.post(PRODUCT_API_URL, itemData, config);
        
        // Assuming your backend returns data in the format: { data: { item: {...} } }
        return response.data.data.item;
    } catch (error) {
        console.error('Error listing item:', error);
        throw new Error(error.response.data.message || 'Failed to list item.');
    }
};