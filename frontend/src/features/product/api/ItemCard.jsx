// src/features/product/ItemCard.jsx

import React from 'react';
// Import your reusable Card component from the UI library
import { Button } from '../../components/ui/Button'; 

const ItemCard = ({ item }) => {
    // Note: The Mongoose Schema defined 'price', 'name', and 'description'
    const { name, price, description, quantity } = item; 

    return (
        // Style using variables defined in src/styles/_variables.css
        <div className="item-card">
            <h3 className="item-name">{name}</h3>
            
            <p className="item-description">{description}</p>
            
            <div className="item-details">
                {/* Use Secondary color for high-visibility data like price */}
                <p className="item-price">
                    ${price.toFixed(2)}
                </p>
                
                {/* Use the Medium Text color for secondary details */}
                <p className="item-quantity">
                    {quantity} in stock
                </p>
            </div>

            {/* Use Primary color for the main CTA button */}
            <Button variant="primary">Make Offer</Button> 
            
            {/* Styles for this component */}
            <style jsx>{`
                .item-card {
                    background-color: var(--color-bg-light); /* BG/300 */
                    border-radius: 8px;
                    padding: 16px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .item-name {
                    color: var(--color-text-dark); /* BG/700 */
                    margin-top: 0;
                    margin-bottom: 5px;
                }
                .item-description {
                    color: var(--color-text-medium); /* BG/500 */
                    font-size: 0.9em;
                }
                .item-price {
                    color: var(--color-secondary); /* FF642F */
                    font-size: 1.4em;
                    font-weight: bold;
                }
                .item-quantity {
                    color: var(--color-text-medium);
                    font-size: 0.8em;
                }
            `}</style>
        </div>
    );
};

export default ItemCard;