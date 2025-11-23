import { useState } from 'react'
import './App.css'
import { Route } from 'react-router-dom';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>  
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />
    </Routes>
    </Router>
  );
}

export default App;