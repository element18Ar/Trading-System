import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Homepage from "./pages/homepage.jsx";
import Login from "./pages/loginpage.jsx";
import Register from "./pages/registerpage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;