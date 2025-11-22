// src/pages/CreateItemPage.jsx

import React from 'react';
// Import the component from the /components directory
import NewItemForm from '../components/NewItemForm'; 
import Layout from '../components/layout/Layout'; 

const CreateItemPage = () => {
    return (
        <Layout>
            <div className="create-item-page">
                {/* The NewItemForm handles the entire submission logic */}
                <NewItemForm />
            </div>
            
            <style jsx>{`
                .create-item-page {
                    /* Ensures the page container doesn't interfere with the form's centered alignment */
                    padding: 20px 0;
                }
            `}</style>
        </Layout>
    );
};

export default CreateItemPage;