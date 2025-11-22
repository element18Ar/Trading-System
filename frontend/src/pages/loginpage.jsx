import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const Login = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState(''); // State for handling login errors
  const [loading, setLoading] = useState(false); // State for loading indicator
  const navigate = useNavigate(); // Hook for programmatic navigation

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error message when user starts typing again
    setError(''); 
  };

  const handleSubmit = async (e) => { // Make the function asynchronous
    e.preventDefault();
    setError('');
    setLoading(true);

    try {

      const response = await fetch('/api/auth/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 2. Send the form data (email and password) as a JSON string
        body: JSON.stringify(formData), 
      });

      // 3. Handle the server's response
      const data = await response.json();
      
      if (response.ok) {
        // Successful login (status 200-299)
        console.log('Login Successful:', data);
        
        // 4. Store the JWT (or other token) received from the backend
        // This is crucial for maintaining the user's session
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        
        // Optional: Store user info (e.g., username) if the backend sends it
        // localStorage.setItem('user', JSON.stringify(data.user)); 

        // Redirect the user to the protected dashboard page
        navigate('/dashboard'); 

      } else {
        // Login failed (e.g., 401 Unauthorized, 400 Bad Request)
        setError(data.message || 'Login failed. Check your email and password.');
        console.error('Login Failed:', data);
      }
    } catch (err) {
      // Handle network errors (e.g., server is down)
      console.error('Network Error:', err);
      setError('Could not connect to the server. Please try again later.');
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="p-8 w-full max-w-md bg-white shadow-xl rounded-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign In</h1>

        {/* Display error message if present */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@tradehub.com"
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
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-3 text-white font-bold rounded-lg transition hover:opacity-90 shadow-md disabled:opacity-50"
            style={{ backgroundColor: '#F89344' }}
            disabled={loading} // Disable button while submission is in progress
          >
            {loading ? 'Signing In...' : 'Log In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;