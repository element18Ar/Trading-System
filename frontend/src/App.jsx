import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Homepage from "./pages/homepage.jsx";
import Login from "./pages/loginpage.jsx";
import Register from "./pages/registerpage.jsx";

// Dashboard (single combined component)
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Authenticated Dashboard */}
        <Route path="/dashboard/:userId" element={<Dashboard />} />

        {/* Redirect unknown paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
    </Router>
  );
}

export default App;
