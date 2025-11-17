
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
      
    };
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      //alert("Login successful");

      if (data.user.role === "user") {
        window.location.href = "/user/";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Login error:", err.message);
      setError(err.message);
    }
  };






 /* const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };*/

