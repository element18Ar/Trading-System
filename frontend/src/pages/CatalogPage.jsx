// src/pages/CatalogPage.jsx

import React from 'react';
// Import the component from the /components directory
import ItemList from '../components/ItemList';
// Assuming you have a reusable Header/Footer/Layout component
import Layout from '../components/layout/Layout'; 

const CatalogPage = () => {
    return (
        // Use a simple Layout component (e.g., adds header/footer)
        <Layout>
            <div className="catalog-page">
                {/* Use the BG/700 color for the main title */}
                <h1 className="page-title">🛒 Available Products</h1>
                
                {/* The ItemList component handles data fetching and rendering the ItemCard */}
                <ItemList />
            </div>
            
            <style jsx>{`
                .catalog-page {
                    padding: 20px 40px;
                    max-width: 1400px;
                    margin: 0 auto;
                }
                .page-title {
                    color: var(--color-text-dark); /* BG/700 */
                    margin-bottom: 30px;
                    border-bottom: 2px solid var(--color-bg-light); /* BG/300 as a subtle divider */
                    padding-bottom: 10px;
                }
            `}</style>
        </Layout>
    );
};

export default CatalogPage;