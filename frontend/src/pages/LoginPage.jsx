// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Import the service file for API communication
import { login } from '../services/authService';
// Import reusable UI components (assuming they are in src/components/ui/)
import InputField from '../components/ui/InputField'; 
import Button from '../components/ui/Button'; 

// NOTE: In a complete app, the user state management (onAuthSuccess) 
// would be handled by a Context/Redux or the useAuth hook.
const LoginPage = ({ onAuthSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Logging in...');
        try {
            // Call the login function from authService
            const user = await login({ email, password });
            
            // Assume the user state is updated successfully
            // onAuthSuccess(user); 
            navigate('/'); // Redirect to the main catalog page
            
        } catch (error) {
            setMessage(`❌ ${error.message}`);
        }
    };

    return (
        <div className="auth-container">
            <h1 className="auth-title">Sign In</h1>
            <form onSubmit={handleSubmit} className="auth-form">
                
                <InputField 
                    label="Email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                
                <InputField 
                    label="Password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                
                {/* Login button uses the Primary color (#F89344) */}
                <Button type="submit" variant="primary">Login</Button>
            </form>
            
            {/* Display status or error message */}
            <p className={`status-message ${message.startsWith('❌') ? 'error' : ''}`}>
                {message}
            </p>
            
            <style jsx>{`
                .auth-container {
                    max-width: 400px;
                    margin: 80px auto;
                    padding: 30px;
                    background-color: var(--color-bg-light); /* BG/300 */
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }
                .auth-title {
                    color: var(--color-text-dark); /* BG/700 */
                    text-align: center;
                    margin-bottom: 25px;
                }
                .status-message {
                    margin-top: 15px;
                    text-align: center;
                    color: var(--color-text-dark); 
                }
                .status-message.error {
                    color: var(--color-secondary); /* FF642F for errors */
                }
            `}</style>
        </div>
    );
};

export default LoginPage;