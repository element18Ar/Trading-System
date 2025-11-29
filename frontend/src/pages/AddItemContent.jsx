import { useState } from "react";
import { refreshToken } from "../api/authApi.js";
import { createItem } from "../api/itemApi.js";
import { Upload } from "lucide-react";

const COLOR_PRIMARY_DARK = "#2C2D2D";
const COLOR_ACCENT = "#00BFA5";
const COLOR_TEXT_LIGHT = "white";

const AddItemContent = ({ onSuccess }) => {
  const [form, setForm] = useState({ name: "", description: "" });
  const [photo, setPhoto] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePhotoChange = e => setPhoto(e.target.files[0]);

  const handleSubmit = async e => {
    e.preventDefault();
    const seller = localStorage.getItem("userId");
    if (!photo) return alert("Please upload an image for your item.");
    if (!seller) return alert("User not logged in.");

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('itemImage', photo);
    formData.append('seller', seller);
    formData.append('price', 0);

    try {
      await createItem(formData);
      alert("Item Listed Successfully! ✅");
      setForm({ name: "", description: "" });
      setPhoto(null);
      onSuccess();
    } catch (error) {
      if (error?.code === "PRODUCT_SERVICE_OFFLINE") {
        alert("Marketplace service is offline. Please start Product Service (port 5001) and retry.");
        return;
      }
      alert(error?.response?.data?.message || "Failed to list item. Please try again.");
    }
  };

  const inputStyle = { 
    padding: '0.8rem', 
    background: COLOR_PRIMARY_DARK, 
    border: `1px solid ${COLOR_ACCENT}`, 
    borderRadius: '6px', 
    color: COLOR_TEXT_LIGHT 
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h2>➕ List Item for Bartering</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input name="name" placeholder="Item Name" onChange={handleChange} value={form.name} required style={inputStyle} />
        <textarea name="description" placeholder="Description" rows={4} onChange={handleChange} value={form.description} required style={inputStyle} />
        <div style={{ ...inputStyle, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label style={{ marginBottom: '0.5rem', fontWeight: 'bold', color: COLOR_ACCENT, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Upload size={18} /> Upload Item Photo
          </label>
          <input type="file" name="itemImage" onChange={handlePhotoChange} required accept="image/*" style={{ border: 'none', padding: '0.5rem', width: '100%', backgroundColor: COLOR_PRIMARY_DARK, cursor: 'pointer' }} />
          {photo && <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Selected file: {photo.name}</p>}
        </div>
        <button type="submit" style={{ padding: "1rem", background: COLOR_ACCENT, border: "none", borderRadius: "8px", color: COLOR_PRIMARY_DARK, fontWeight: 700, cursor: "pointer" }}>Publish for Trade</button>
      </form>
    </div>
  );
};

export default AddItemContent;
