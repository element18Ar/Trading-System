import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Homepage from "./pages/homepage.jsx";
import Login from "./pages/loginpage.jsx";
import Register from "./pages/registerpage.jsx";

// Import the single combined dashboard component
import Dashboard from "./pages/Dashboard.jsx";


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Core Authenticated Dashboard Route */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* If needed later:
          <Route path="*" element={<NotFound />} />
        */}
      </Routes>
    </Router>
  );
}

export default App;