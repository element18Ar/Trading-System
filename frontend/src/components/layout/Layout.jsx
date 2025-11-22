// src/components/layout/Layout.jsx

import React from 'react';
import Header from './Header'; 
// import Footer from './Footer'; // We'll skip the Footer for now

const Layout = ({ children }) => {
    // This is the file that was causing the error in NotFoundPage.jsx
    return (
        <div className="app-layout">
            <Header />
            <main className="app-content">
                {children}
            </main>
            {/* <Footer /> */}
            <style jsx>{`
                .app-layout {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                }
                .app-content {
                    flex-grow: 1;
                }
            `}</style>
        </div>
    );
};

export default Layout;