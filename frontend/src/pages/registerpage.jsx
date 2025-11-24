import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { registerUser } from "../api/auth.js";



// Custom hook to detect screen size for responsive styling
const useScreenSize = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = width < 768; 
  return { width, isMobile };
};

export default function Register() {
  const { isMobile } = useScreenSize();
  const navigate = useNavigate(); // Hook for routing

  // --- STATE FOR FORM DATA AND API COMMUNICATION ---
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { username, email, password, confirmPassword } = formData;


  // --- HANDLERS ---
  const handleChange = (e) => {
    // Update state when user types in any input field
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // 1. Client-Side Validation: Check password match
    if (password !== confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
    }

    try {
        // 2. API Call (using the service function)
        const response = await registerUser(formData);
        
        // 3. Handle Success (201 Created)
        console.log("Registration successful:", response.data);
        alert("Registration successful! Redirecting to login...");
        
        // Redirect user to the login page after success
        navigate('/login'); 

    } catch (err) {
        // 4. Handle Failure (e.g., 400 Bad Request)
        console.error("Registration failed:", err.response || err);
        
        // Extract the error message from the backend response
        const errorMessage = err.response?.data?.message || 'Network error. Please try again.';
        setError(errorMessage);

    } finally {
        setLoading(false);
    }
  };

  // Define Colors for consistency with Homepage
  const COLOR_PRIMARY_DARK = "#2C2D2D"; 
  const COLOR_CARD_BG = "#3E3F3F"; // Card background
  const COLOR_ACCENT = "#00BFA5"; // Vibrant Teal/Cyan (Primary Button)
  const COLOR_INPUT_BG = "#303030"; // Slightly darker background for better contrast
  const COLOR_INPUT_BORDER = "#8A8C8C"; // Medium Gray for input borders
  const COLOR_TEXT_LIGHT = "white"; // Main text color

  // Responsive Style Variables
  const cardPadding = isMobile ? "2rem 1.5rem" : "2.5rem 2.5rem"; 
  const containerPadding = isMobile ? "1rem" : "2rem";
  const inputHeight = isMobile ? "2.8rem" : "3.2rem";
  const buttonFontSize = isMobile ? "1.05rem" : "1.2rem";

  // New function to handle form submission and navigation
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission (page reload)
    
    // 💡 In a real app, you would handle:
    // 1. Form validation
    // 2. API call to register the user
    // 3. Handling success/error states

    // Simulate successful registration and navigate to the Dashboard
    console.log("Registration successful! Navigating to Dashboard...");
    navigate("/dashboard"); // Redirects the user to the '/dashboard' route
  };

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: `linear-gradient(135deg, #121212 0%, #000000 100%)`,
        padding: containerPadding,
        fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* Background Texture for visual depth */}
      <div 
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 2 2"><rect x="0" y="0" width="1" height="1" fill="%23222" opacity="0.05"/><rect x="1" y="1" width="1" height="1" fill="%23222" opacity="0.05"/></svg>')`,
          backgroundSize: '8px 8px',
          opacity: 0.15,
          pointerEvents: 'none',
        }}
      ></div>

      {/* REGISTRATION CARD */}
      <div
        style={{
          backgroundColor: COLOR_CARD_BG,
          padding: cardPadding,
          borderRadius: "20px",
          color: COLOR_TEXT_LIGHT,
          maxWidth: "400px", 
          width: isMobile ? "90%" : "100%",
          textAlign: "center",
          boxShadow: "0 15px 40px rgba(0, 0, 0, 0.6)",
          zIndex: 1,
        }}
      >
        <header style={{ marginBottom: "2rem" }}>
          <h1 
            style={{ 
              color: COLOR_TEXT_LIGHT,
              fontSize: isMobile ? "2rem" : "2.5rem",
              fontWeight: 800,
              margin: 0,
            }}
          >
            Create Account
          </h1>
          <p style={{ opacity: 0.7, marginTop: "0.5rem" }}>
            Join the modern bartering community.
          </p>
        </header>

        {/* Form Fields - Add onSubmit handler to the form */}
        <form 
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            onSubmit={handleSubmit} // ⬅️ Handle form submission
        >
          {['Username', 'Email', 'Password', 'Confirm Password'].map((field, index) => (
            <input
              key={index}
              type={field.includes('Password') ? 'password' : (field === 'Email' ? 'email' : 'text')}
              placeholder={field}
              style={{
                width: "calc(100% - 24px)",
                height: inputHeight,
                padding: "0 12px",
                backgroundColor: COLOR_INPUT_BG,
                color: COLOR_TEXT_LIGHT,
                border: `1px solid ${COLOR_INPUT_BORDER}`,
                borderRadius: "8px",
                fontSize: "1rem",
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
              }}
              // Inline Focus and Blur handlers for the accent glow effect
              onFocus={(e) => {
                e.target.style.borderColor = COLOR_ACCENT;
                e.target.style.boxShadow = `0 0 0 2px rgba(0, 191, 165, 0.5)`; 
              }}
              onBlur={(e) => {
                e.target.style.borderColor = COLOR_INPUT_BORDER;
                e.target.style.boxShadow = 'none';
              }}
            />
          ))}

          {/* REGISTER BUTTON (Primary CTA) */}
          <button
            type="submit" // ⬅️ Ensure this is type="submit"
            style={{
              backgroundColor: COLOR_ACCENT,
              padding: "1.1rem 2.8rem",
              color: COLOR_PRIMARY_DARK,
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: buttonFontSize,
              fontWeight: 700,
              width: "100%",
              marginTop: "1rem",
              transition: "background-color 0.3s ease, transform 0.1s ease, box-shadow 0.3s ease",
              boxShadow: "0 4px 15px rgba(0, 191, 165, 0.4)",
            }}
            // Hover states for enhanced interactivity
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#00E0C0";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(0, 191, 165, 0.6)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = COLOR_ACCENT;
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 15px rgba(0, 191, 165, 0.4)";
            }}
          >
            Register Now
          </button>
        </form>

        {/* Link to Login */}
        <p style={{ marginTop: "1.5rem", fontSize: "0.9rem", opacity: 0.8 }}>
          Already have an account?{" "}
          <Link 
            to="/login" 
            style={{ 
              color: COLOR_ACCENT, 
              textDecoration: "none", 
              fontWeight: 600,
              transition: "opacity 0.2s"
            }}
            onMouseOver={(e) => e.target.style.opacity = 0.8}
            onMouseOut={(e) => e.target.style.opacity = 1}
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}