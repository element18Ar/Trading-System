import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '', s
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Optional: Clear validation error when user types
    if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
        setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // --- 1. Client-Side Validation: Check if passwords match ---
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return; // Stop the submission process
    }

    setLoading(true);

    try {
     
      const { confirmPassword, ...dataToSend } = formData; 

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend), 
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log('Registration Successful:', data);
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed. Please try again.');
        console.error('Registration Failed:', data);
      }
    } catch (err) {
      console.error('Network Error:', err);
      setError('Could not connect to the server. Check your network or server status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="p-8 w-full max-w-md bg-white shadow-xl rounded-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Account</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Username Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* 👈 NEW Confirm Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword" // 👈 Name matches the state field
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-3 text-white font-bold rounded-lg transition hover:opacity-90 shadow-md disabled:opacity-50"
            style={{ backgroundColor: '#FF642F' }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;