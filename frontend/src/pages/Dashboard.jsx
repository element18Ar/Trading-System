import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { PlusCircle, User, Home, MessageSquare, LogOut, Upload } from "lucide-react"; // Added Upload icon
import TradeInbox from "./TradeInbox.jsx";
import TradeDetail from "./TradeDetail.jsx";

// --- 🎨 STYLE CONSTANTS ---
const COLOR_PRIMARY_DARK = "#2C2D2D";
const COLOR_ACCENT = "#00BFA5";
const COLOR_TEXT_LIGHT = "white";
const COLOR_DANGER = "#DC3545";

const BASE_STYLES = {
  background: `linear-gradient(135deg, #121212 0%, #000000 100%)`,
  fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', sans-serif",
  color: COLOR_TEXT_LIGHT,
  minHeight: "100vh",
};

// --- 🛠️ HELPER COMPONENTS ---

/**
 * 🏠 New Home Content: Displays all items from all users (The Marketplace).
 */
const MarketplaceHome = () => {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch all items (no seller ID filter)
    fetch("http://localhost:5001/api/product-service/items")
      .then(res => res.json())
      .then(data => {
        // Assuming data.data.items holds the array of products
        setAllItems(data.data.items || []);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch marketplace items:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ color: COLOR_ACCENT }}>🏠 Barter Marketplace</h2>
      <p style={{ opacity: 0.8, marginBottom: '2rem' }}>Browse all items currently available for trade.</p>

      {loading && <p>Loading marketplace...</p>}

      {!loading && allItems.length === 0 && (
        <p>No items have been listed yet. Be the first to start trading!</p>
      )}

      {!loading && allItems.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem"
        }}>
          {allItems.map(item => (
            <div key={item._id} style={{
              padding: "1rem",
              background: COLOR_PRIMARY_DARK,
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
              border: `1px solid ${COLOR_ACCENT}50`
            }}>
              {/* Placeholder for the item image */}
              <div style={{
                height: '150px',
                backgroundColor: '#444',
                borderRadius: '8px',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#888',
                fontSize: '0.9rem'
              }}>
                [Item Photo]
              </div>
              <h3 style={{ color: COLOR_TEXT_LIGHT, marginBottom: '0.5rem' }}>{item.name}</h3>
              <p style={{ opacity: 0.7, fontSize: '0.9rem', minHeight: '40px' }}>{item.description.substring(0, 100)}...</p>
              {/* Removed Price tag */}
              <p style={{ fontWeight: 600, marginTop: '1rem', color: COLOR_ACCENT }}>Barter Item</p>
              <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>Seller ID: {item.seller.substring(0, 8)}...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


/**
 * Content Component for adding a new item. 
 * Updated to handle **photo upload** and **remove price**.
 * Takes a callback to switch view on success.
 */
const AddItemContent = ({ onSuccess }) => {
  // Removed 'price' from initial state
  const [form, setForm] = useState({ name: "", description: "" });
  const [photo, setPhoto] = useState(null); // New state for photo file

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = e => {
    // Set the selected file
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const seller = localStorage.getItem("userId");

    // Form validation for photo
    if (!photo) {
      alert("Please upload an image for your item.");
      return;
    }

    if (!seller) {
      alert("Error: User not logged in (userId missing).");
      return;
    }

    // Use FormData for text fields and file upload
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    // Note: Assuming your backend API accepts a field named 'itemImage' for the file
    formData.append('itemImage', photo);
    formData.append('seller', seller);
    // If your backend still requires a price field, you can set a placeholder here:
    formData.append('price', 0);


    try {
      const res = await fetch("http://localhost:5002/api/products/items", {
        method: "POST",
        // IMPORTANT: Do NOT set Content-Type header when using FormData. The browser handles it.
        body: formData // Send the FormData object
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      await res.json();
      alert("Item Listed Successfully! ✅");
      setForm({ name: "", description: "" }); // Reset text fields
      setPhoto(null); // Reset photo state

      onSuccess(); // Switch back to the Marketplace view

    } catch (error) {
      console.error("Error listing item:", error);
      alert("Failed to list item. See console for details. (Check server file upload config)");
    }
  };

  const inputStyle = { padding: '0.8rem', background: COLOR_PRIMARY_DARK, border: `1px solid ${COLOR_ACCENT}`, borderRadius: '6px', color: COLOR_TEXT_LIGHT };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h2>➕ List Item for Bartering</h2>

      <form onSubmit={handleSubmit} style={{
        marginTop: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}>
        {/* Item Name */}
        <input
          name="name"
          placeholder="Item Name (e.g., Vintage Camera)"
          onChange={handleChange}
          value={form.name}
          required
          style={inputStyle}
        />

        {/* Item Description */}
        <textarea
          name="description"
          placeholder="Detailed Description of the item (and what you'd like in return)..."
          rows={4}
          onChange={handleChange}
          value={form.description}
          required
          style={inputStyle}
        />

        {/* Photo Upload Field (New) */}
        <div style={{ ...inputStyle, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label style={{
            marginBottom: '0.5rem',
            fontWeight: 'bold',
            color: COLOR_ACCENT,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Upload size={18} /> Upload Item Photo (Required)
          </label>
          <input
            type="file"
            name="itemImage"
            onChange={handlePhotoChange}
            required
            accept="image/*"
            style={{
              border: 'none',
              padding: '0.5rem',
              width: '100%',
              backgroundColor: COLOR_PRIMARY_DARK,
              cursor: 'pointer'
            }}
          />
          {photo && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
              Selected file: **{photo.name}**
            </p>
          )}
        </div>

        {/* Removed Price Input Field */}

        <button
          type="submit"
          style={{
            padding: "1rem",
            background: COLOR_ACCENT,
            border: "none",
            borderRadius: "8px",
            color: COLOR_PRIMARY_DARK,
            fontWeight: 700,
            cursor: "pointer",
            transition: "background-color 0.2s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#00E0C0'}
          onMouseOut={(e) => e.target.style.backgroundColor = COLOR_ACCENT}
        >
          Publish for Trade
        </button>
      </form>
    </div>
  );
};

/**
 * 👤 Profile Content: Shows user account details and their listed items. (Unchanged)
 */
const UserProfileContent = () => {
  const userId = localStorage.getItem("userId");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial placeholder for user account details
  const initialUserDetails = {
    username: "User-" + (userId ? userId.substring(0, 8) : "Guest"),
    email: "user@example.com",
    joinDate: new Date().toLocaleDateString()
  };

  // State for user details and editing functionality
  const [userDetails, setUserDetails] = useState(initialUserDetails);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(initialUserDetails.username);

  // --- Profile Management Logic ---

  // Function to handle saving the updated profile data
  const handleSaveProfile = () => {
    // --- REAL WORLD LOGIC: START ---
    // 1. API Call: Send PUT request to update user details in the backend
    // Example: 
    // fetch(`http://localhost:5002/api/users/${userId}`, { 
    //     method: 'PUT', 
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ username: newUsername })
    // }) 
    // --- REAL WORLD LOGIC: END ---

    // Optimistically update the local state
    setUserDetails(prev => ({ ...prev, username: newUsername }));
    setIsEditing(false);
    alert("Profile updated successfully! (Simulation)");
  };

  // --- Item Fetching Logic (Unchanged) ---

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    // Fetch only items belonging to the current logged-in user (sellerId)
    fetch("http://localhost:5002/api/product-service/items")
      .then(res => res.json())
      .then(data => {
        const filtered = data.data.items.filter(i => i.seller === userId);
        setItems(filtered);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch user items:", error);
        setLoading(false);
      });
  }, [userId]);

  // --- Component JSX (Unchanged) ---

  const editButtonStyle = {
    backgroundColor: COLOR_ACCENT,
    color: COLOR_PRIMARY_DARK,
    border: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginLeft: '1rem'
  };

  const cancelButtonStyle = {
    backgroundColor: COLOR_DANGER,
    color: COLOR_TEXT_LIGHT,
    border: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginLeft: '0.5rem'
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>👤 My Account & Listings</h2>

      {/* User Details Section */}
      <div style={{ background: COLOR_PRIMARY_DARK, padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h3 style={{ color: COLOR_ACCENT, marginBottom: '1rem' }}>Account Information</h3>

        <p style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
          <strong>Username:</strong>
          {isEditing ? (
            <>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                style={{
                  marginLeft: '0.5rem',
                  padding: '0.3rem',
                  background: '#444',
                  border: '1px solid #666',
                  color: COLOR_TEXT_LIGHT,
                  borderRadius: '4px'
                }}
              />
              <button
                style={{ ...editButtonStyle, backgroundColor: '#28A745' }}
                onClick={handleSaveProfile}
              >
                Save
              </button>
              <button
                style={cancelButtonStyle}
                onClick={() => {
                  setIsEditing(false);
                  setNewUsername(userDetails.username); // Reset username on cancel
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <span style={{ marginLeft: '0.5rem' }}>{userDetails.username}</span>
              <button
                style={editButtonStyle}
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            </>
          )}
        </p>

        <p><strong>Email:</strong> {userDetails.email}</p>
        <p><strong>Member Since:</strong> {userDetails.joinDate}</p>
        <p style={{ marginTop: '1rem', opacity: 0.7, fontSize: '0.9rem' }}>*Future feature: Edit profile details here.</p>
      </div>

      {/* Listed Items Section (Unchanged) */}
      <h3 style={{ color: COLOR_TEXT_LIGHT, borderBottom: `1px solid ${COLOR_ACCENT}50`, paddingBottom: '0.5rem', marginBottom: '1rem' }}>My Listed Items ({items.length})</h3>
      <p style={{ opacity: 0.8 }}>Manage items you have uploaded for trade.</p>

      {loading && <p style={{ marginTop: '2rem' }}>Loading items...</p>}

      {!loading && items.length === 0 && (
        <p style={{ marginTop: '2rem' }}>You haven't listed any items yet. Go to "Add Item" to start trading!</p>
      )}

      {!loading && items.length > 0 && (
        <div style={{
          marginTop: "2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1.5rem"
        }}>
          {items.map(item => (
            <div key={item._id} style={{
              padding: "1rem",
              background: COLOR_PRIMARY_DARK,
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)"
            }}>
              <h4 style={{ color: COLOR_ACCENT, marginBottom: '0.5rem' }}>{item.name}</h4>
              <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>{item.description.substring(0, 50)}...</p>
              <p style={{ fontWeight: 600, marginTop: '1rem' }}>Value: ${item.price}</p>
              <button style={{
                marginTop: '0.5rem',
                padding: '0.4rem 0.8rem',
                backgroundColor: COLOR_DANGER,
                color: COLOR_TEXT_LIGHT,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


// --- 📦 MAIN DASHBOARD COMPONENT (Unchanged) ---

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState("Home"); // 'Home', 'AddItem', 'Profile', 'Inbox', 'TradeDetail'
  const [selectedTrade, setSelectedTrade] = useState(null);

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  // Function to handle clicking into a specific trade from the inbox
  const handleViewTrade = (tradeId) => {
    setSelectedTrade(tradeId);
    setCurrentView('TradeDetail');
  };

  // Callback after successful item upload
  const handleItemUploadSuccess = () => {
    // Switch back to the Marketplace/Home view after upload
    setCurrentView("Home");
  };

  // Function to render the correct content based on the currentView state
  const renderContent = () => {
    switch (currentView) {
      case "AddItem":
        // Pass the success callback to the AddItem component
        return <AddItemContent onSuccess={handleItemUploadSuccess} />;
      case "Profile":
        return <UserProfileContent />; // Use the updated Profile component
      case "Inbox":
        return <TradeInbox onSelectTrade={handleViewTrade} />;
      case "TradeDetail":
        return selectedTrade ? <TradeDetail tradeId={selectedTrade} onBack={() => setCurrentView('Inbox')} /> : <MarketplaceHome />;
      case "Home":
      default:
        return <MarketplaceHome />; // Use the new Marketplace as the Home view
    }
  };

  // Style for the main container (Unchanged)
  const mainContainerStyle = {
    ...BASE_STYLES,
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
  };

  // Style for the sidebar (Unchanged)
  const sidebarStyle = {
    width: "250px",
    minHeight: "100vh",
    backgroundColor: COLOR_PRIMARY_DARK,
    padding: "1.5rem 1rem",
    boxShadow: "5px 0 15px rgba(0, 0, 0, 0.5)",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  };

  // Style for the main content area (Unchanged)
  const contentStyle = {
    flexGrow: 1,
    padding: "2rem",
    ...BASE_STYLES,
  };

  // Style for navigation buttons (Unchanged)
  const navButtonStyle = (isActive, isLogout = false) => ({
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.8rem 1rem",
    borderRadius: "8px",
    backgroundColor: isLogout ? COLOR_DANGER : (isActive ? COLOR_ACCENT : 'transparent'),
    color: isLogout ? COLOR_TEXT_LIGHT : (isActive ? COLOR_PRIMARY_DARK : COLOR_TEXT_LIGHT),
    fontWeight: isLogout || isActive ? 700 : 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: 'none',
    textAlign: 'left',
    ...(!isLogout && {
      '&:hover': {
        backgroundColor: isActive ? '#00E0C0' : COLOR_PRIMARY_DARK,
      }
    })
  });

  return (
    <div style={mainContainerStyle}>
      {/* Sidebar Navigation */}
      <aside style={sidebarStyle}>
        <h2 style={{ marginBottom: "2rem", color: COLOR_ACCENT }}>SWAP.TA</h2>

        {/* Navigation Links */}
        <button
          style={navButtonStyle(currentView === "Home")}
          onClick={() => { setCurrentView("Home"); setSelectedTrade(null); }}
        >
          <Home size={20} /> Marketplace
        </button>

        <button
          style={navButtonStyle(currentView === "AddItem")}
          onClick={() => { setCurrentView("AddItem"); setSelectedTrade(null); }}
        >
          <PlusCircle size={20} /> Add Item
        </button>

        <button
          style={navButtonStyle(currentView === "Profile")}
          onClick={() => { setCurrentView("Profile"); setSelectedTrade(null); }}
        >
          <User size={20} /> My Profile
        </button>

        {/* NEGOTIATIONS (Chat/Inbox) */}
        <button
          style={navButtonStyle(currentView === "Inbox" || currentView === "TradeDetail")}
          onClick={() => {
            setCurrentView("Inbox");
            setSelectedTrade(null);
          }}
        >
          <MessageSquare size={20} /> Negotiations (Inbox)
        </button>

        {/* LOGOUT BUTTON */}
        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #444' }}>
          <button
            style={{ ...navButtonStyle(false, true), width: '100%' }}
            onClick={handleLogout}
          >
            <LogOut size={20} /> Logout
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <main style={contentStyle}>
        {renderContent()}
      </main>
    </div>
  );
}