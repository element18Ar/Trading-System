// src/components/layout/Header.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    // Links focus on the Product-Service and the necessary Auth link
    return (
        <header className="app-header">
            <div className="container">
                <Link to="/" className="logo">Trading Hub</Link>
                <nav className="nav-links">
                    <Link to="/" className="nav-link">Catalog</Link>
                    <Link to="/list" className="nav-link">List Item</Link>
                    <Link to="/login" className="nav-link primary-link">Login</Link>
                </nav>
            </div>
            <style jsx>{`
                .app-header {
                    background-color: var(--color-text-dark); /* BG/700 */
                    padding: 15px 0;
                }
                .container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .logo {
                    font-size: 1.8em;
                    font-weight: bold;
                    color: var(--color-primary); /* #F89344 */
                    text-decoration: none;
                }
                .nav-link {
                    color: var(--color-bg-light); /* BG/300 */
                    text-decoration: none;
                }
                .primary-link {
                    color: var(--color-primary);
                }
            `}</style>
        </header>
    );
};

export default Header;