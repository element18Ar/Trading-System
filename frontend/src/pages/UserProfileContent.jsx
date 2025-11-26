import { useState, useEffect } from "react";

const COLOR_PRIMARY_DARK = "#2C2D2D";
const COLOR_ACCENT = "#00BFA5";
const COLOR_TEXT_LIGHT = "white";
const COLOR_DANGER = "#DC3545";

export default function UserProfileContent() {
  const userId = localStorage.getItem("userId");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

const storedUser = JSON.parse(localStorage.getItem("user"));

const initialUserDetails = {
  username: storedUser?.username || "Guest",
  email: storedUser?.email || "guest@example.com",
  joinDate: new Date().toLocaleDateString()
};


 // const initialUserDetails = {
  //username: "User-" + (userId ? userId.substring(0, 8) : "Guest"),
  //email: userId ? `user${userId.substring(0, 4)}@example.com` : "guest@example.com",
  //joinDate: new Date().toLocaleDateString()
//};

  const [userDetails, setUserDetails] = useState(initialUserDetails);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(initialUserDetails.username);

  const handleSaveProfile = () => {
    setUserDetails(prev => ({ ...prev, username: newUsername }));
    setIsEditing(false);
    alert("Profile updated successfully! (Simulation)");
  };

  useEffect(() => {
    if (!userId) return setLoading(false);

    const fetchUserItems = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("productServiceToken") || localStorage.getItem("authToken");
        const res = await fetch("http://localhost:5001/api/v1/products/items", {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        const itemsArray = Array.isArray(data?.data?.items) ? data.data.items : (Array.isArray(data?.items) ? data.items : []);
        const filtered = itemsArray.filter(i => i.seller === userId);
        setItems(filtered);
      } catch (error) {
        console.error("Failed to fetch user items:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserItems();
  }, [userId]);

  const editButtonStyle = { backgroundColor: COLOR_ACCENT, color: COLOR_PRIMARY_DARK, border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginLeft: '1rem' };
  const cancelButtonStyle = { backgroundColor: COLOR_DANGER, color: COLOR_TEXT_LIGHT, border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginLeft: '0.5rem' };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>👤 My Account & Listings</h2>
      <div style={{ background: COLOR_PRIMARY_DARK, padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h3 style={{ color: COLOR_ACCENT, marginBottom: '1rem' }}>Account Information</h3>
        <p style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
          <strong>Username:</strong>
          {isEditing ? <>
            <input type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} style={{ marginLeft: '0.5rem', padding: '0.3rem', background: '#444', border: '1px solid #666', color: COLOR_TEXT_LIGHT, borderRadius: '4px' }} />
            <button style={{ ...editButtonStyle, backgroundColor: '#28A745' }} onClick={handleSaveProfile}>Save</button>
            <button style={cancelButtonStyle} onClick={() => { setIsEditing(false); setNewUsername(userDetails.username); }}>Cancel</button>
          </> : <>
            <span style={{ marginLeft: '0.5rem' }}>{userDetails.username}</span>
            <button style={editButtonStyle} onClick={() => setIsEditing(true)}>Edit</button>
          </>}
        </p>
        <p><strong>Email:</strong> {userDetails.email}</p>
        <p><strong>Member Since:</strong> {userDetails.joinDate}</p>
      </div>

      <h3 style={{ color: COLOR_TEXT_LIGHT, borderBottom: `1px solid ${COLOR_ACCENT}50`, paddingBottom: '0.5rem', marginBottom: '1rem' }}>My Listed Items ({items.length})</h3>
      {loading && <p style={{ marginTop: '2rem' }}>Loading items...</p>}
      {!loading && items.length === 0 && <p style={{ marginTop: '2rem' }}>You haven't listed any items yet.</p>}
      {!loading && items.length > 0 && (
        <div style={{ marginTop: "2rem", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem" }}>
          {items.map(item => (
            <div key={item._id} style={{ padding: "1rem", background: COLOR_PRIMARY_DARK, borderRadius: "12px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)" }}>
              <h4 style={{ color: COLOR_ACCENT, marginBottom: '0.5rem' }}>{item.name}</h4>
              <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>{item.description?.substring(0, 50)}...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
