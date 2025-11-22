// src/features/product/NewItemForm.jsx

import React, { useState } from 'react';
import { listItem } from './api/productService';
import { Button } from '../../components/ui/Button'; 
// Assume you have an InputField component for form inputs
import InputField from '../../components/ui/InputField'; 

// NOTE: In a real app, you would use a 'useAuth' hook to get the user's token
const DUMMY_TOKEN = 'YOUR_AUTH_TOKEN_FROM_AUTH_SERVICE'; 

const NewItemForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        quantity: 1,
    });
    const [statusMessage, setStatusMessage] = useState('');

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage('Listing item...');
        try {
            // Call the service function with the form data and the authentication token
            await listItem(formData, DUMMY_TOKEN); 
            
            setStatusMessage('✅ Item listed successfully!');
            // Clear form or redirect user
            setFormData({ name: '', description: '', price: 0, quantity: 1 });

        } catch (error) {
            setStatusMessage(`❌ Listing failed: ${error.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="new-item-form">
            <h2 className="form-title">List New Product</h2>
            
            <InputField 
                label="Product Name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
            />
            
            <InputField 
                label="Description" 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                type="textarea"
                required 
            />
            
            <InputField 
                label="Price ($)" 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                type="number" 
                min="0"
                required 
            />

            <InputField 
                label="Quantity" 
                name="quantity" 
                value={formData.quantity} 
                onChange={handleChange} 
                type="number" 
                min="1"
                required 
            />
            
            {/* The main form submission button uses the Primary color */}
            <Button type="submit" variant="primary">
                List Item
            </Button>
            
            <p className="status-message">{statusMessage}</p>

            <style jsx>{`
                .new-item-form {
                    max-width: 600px;
                    margin: 40px auto;
                    padding: 20px;
                    background-color: var(--color-bg-light); /* BG/300 */
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                .form-title {
                    color: var(--color-text-dark); /* BG/700 */
                    margin-bottom: 20px;
                }
                .status-message {
                    margin-top: 15px;
                    font-weight: bold;
                    color: var(--color-text-dark); /* Default status color */
                }
            `}</style>
        </form>
    );
};

export default NewItemForm;