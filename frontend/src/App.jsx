import { useState } from 'react'
import './App.css'

function App() {

  return (
    <Router>  
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
    </Router>
  )
}

export default App
