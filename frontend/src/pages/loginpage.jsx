import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { Eye, EyeOff } from "lucide-react";

// Custom hook to detect screen size (kept consistent)
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

export default function Login() {
    const { isMobile } = useScreenSize();
    const navigate = useNavigate(); // Initialize useNavigate hook
    const [showPassword, setShowPassword] = useState(false);

    // Define Colors (kept consistent)
    const COLOR_PRIMARY_DARK = "#2C2D2D"; 
    const COLOR_CARD_BG = "#3E3F3F"; 
    const COLOR_ACCENT = "#00BFA5"; 
    const COLOR_INPUT_BG = "#303030"; // Reverting to match register input background
    const COLOR_INPUT_BORDER = "#8A8C8C"; 
    const COLOR_TEXT_LIGHT = "white"; 
    
    // Responsive Style Variables (kept consistent)
    const cardPadding = isMobile ? "2rem 1.5rem" : "2.5rem 2.5rem"; 
    const containerPadding = isMobile ? "1rem" : "2rem";
    const inputHeight = isMobile ? "2.8rem" : "3.2rem";
    const buttonFontSize = isMobile ? "1.05rem" : "1.2rem";

    // Reusable styles for the input element
    const inputStyle = {
        width: "100%",
        height: inputHeight,
        padding: "0 12px",
        paddingRight: "40px",
        backgroundColor: COLOR_INPUT_BG,
        color: COLOR_TEXT_LIGHT,
        border: `1px solid ${COLOR_INPUT_BORDER}`,
        borderRadius: "8px",
        fontSize: "1rem",
        boxSizing: "border-box",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
    };

    const handleFocus = (e) => {
        e.target.style.borderColor = COLOR_ACCENT;
        e.target.style.boxShadow = `0 0 0 2px rgba(0, 191, 165, 0.5)`;
    };
    const handleBlur = (e) => {
        e.target.style.borderColor = COLOR_INPUT_BORDER;
        e.target.style.boxShadow = 'none';
    };

    // New function to handle form submission and navigation
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission (page reload)
        
        // 💡 In a real app, you would handle:
        // 1. Validating credentials (client-side)
        // 2. Making an API call to authenticate the user
        // 3. Storing authentication token/user data
        
        // Simulate successful login and navigate to the Dashboard
        console.log("Login successful! Navigating to Dashboard...");
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
            {/* Background Texture (omitted for brevity) */}

            {/* LOGIN CARD */}
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
                        Welcome Back
                    </h1>
                    <p style={{ opacity: 0.7, marginTop: "0.5rem" }}>
                        Sign in to access your trades.
                    </p>
                </header>

                {/* Form Fields - Add onSubmit handler to the form */}
                <form 
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                    onSubmit={handleSubmit} // ⬅️ Handle form submission
                >
                    
                    {/* Username/Email Input */}
                    <input
                        type="text"
                        placeholder="Username or Email"
                        style={inputStyle}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />

                    {/* Password Input (Wrapped for Icon) */}
                    <div style={{ position: "relative", width: "100%" }}>
                        <input
                            type={showPassword ? "text" : "password"} // Dynamic type
                            placeholder="Password"
                            style={{
                                ...inputStyle,
                                width: "100%",
                                paddingRight: "40px",
                            }}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: COLOR_ACCENT,
                                padding: "0.2rem",
                                zIndex: 2,
                            }}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>


                    {/* LOGIN BUTTON (Primary CTA) */}
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
                        Log In
                    </button>
                </form>

                {/* Link to Registration */}
                <p style={{ marginTop: "1.5rem", fontSize: "0.9rem", opacity: 0.8 }}>
                    Need an account?{" "}
                    <Link 
                        to="/register" 
                        style={{ 
                            color: COLOR_ACCENT, 
                            textDecoration: "none", 
                            fontWeight: 600,
                            transition: "opacity 0.2s"
                        }}
                        onMouseOver={(e) => e.target.style.opacity = 0.8}
                        onMouseOut={(e) => e.target.style.opacity = 1}
                    >
                        Register Now
                    </Link>
                </p>
            </div>
        </div>
    );
}