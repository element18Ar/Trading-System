// src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import InputField from '../components/ui/InputField'; 
import Button from '../components/ui/Button'; 

const RegisterPage = ({ onAuthSuccess }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Registering...');
        try {
            // Call the register function from authService
            await register({ name, email, password });
            
            // onAuthSuccess(user); 
            navigate('/');
            
        } catch (error) {
            setMessage(`❌ ${error.message}`);
        }
    };

    return (
        <div className="auth-container">
            <h1 className="auth-title">Register Account</h1>
            <form onSubmit={handleSubmit} className="auth-form">
                
                <InputField 
                    label="Name" 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                />
                
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
                
                {/* Register button uses the Primary color (#F89344) */}
                <Button type="submit" variant="primary">Register</Button>
            </form>
            
            <p className={`status-message ${message.startsWith('❌') ? 'error' : ''}`}>
                {message}
            </p>
            
            <style jsx>{`
                .auth-container {
                    max-width: 400px;
                    margin: 80px auto;
                    padding: 30px;
                    background-color: var(--color-bg-light); 
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }
                .auth-title {
                    color: var(--color-text-dark);
                    text-align: center;
                    margin-bottom: 25px;
                }
                .status-message {
                    margin-top: 15px;
                    text-align: center;
                    color: var(--color-text-dark); 
                }
                .status-message.error {
                    color: var(--color-secondary);
                }
            `}</style>
        </div>
    );
};

export default RegisterPage;