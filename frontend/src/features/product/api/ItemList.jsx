// src/features/product/ItemList.jsx

import React, { useState, useEffect } from 'react';
import { getAllItems } from './api/productService';
import ItemCard from './ItemCard'; 
// Assume you have a simple Spinner component
import Spinner from '../../components/ui/Spinner'; 

const ItemList = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const data = await getAllItems();
                setItems(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    if (loading) {
        return <Spinner />; 
    }

    if (error) {
        // Error message uses the Secondary color to indicate a warning/failure
        return <p style={{ color: 'var(--color-secondary)' }}>Error: {error}</p>;
    }

    if (items.length === 0) {
        return <p>No items are currently listed for sale.</p>;
    }

    return (
        <div className="item-list-container">
            {items.map(item => (
                <ItemCard key={item._id} item={item} />
            ))}
            <style jsx>{`
                .item-list-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                    padding: 20px;
                }
            `}</style>
        </div>
    );
};

export default ItemList;