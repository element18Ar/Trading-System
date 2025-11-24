import { useState, useEffect } from "react";
import { PlusCircle, User, Home, MessageSquare } from "lucide-react"; // Added MessageSquare
import TradeInbox from "./TradeInbox.jsx"; // Import the new Inbox component
import TradeDetail from "./TradeDetail.jsx"; // Import the new Detail component

// --- 🎨 STYLE CONSTANTS ---
const COLOR_PRIMARY_DARK = "#2C2D2D";
const COLOR_ACCENT = "#00BFA5";
const COLOR_TEXT_LIGHT = "white";
const COLOR_CARD_BG = "#3E3F3F"; // Added for Trade components

const BASE_STYLES = {
  background: `linear-gradient(135deg, #121212 0%, #000000 100%)`,
  fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', sans-serif",
  color: COLOR_TEXT_LIGHT,
  minHeight: "100vh",
};

// --- 🛠️ HELPER COMPONENTS ---

/**
 * Renders the main dashboard welcome screen.
 */
const DashboardHome = () => (
  <div style={{ padding: '4rem', textAlign: 'center' }}>
    <h1 style={{ fontSize: '3.5rem', color: COLOR_ACCENT, marginBottom: '1rem' }}>TARA SWAP TA</h1>
    <p style={{ fontSize: '1.5rem', opacity: 0.8 }}>Start adding items or manage your profile. 🎉</p>
  </div>
);

/**
 * Content Component for adding a new item. (Unchanged)
 */
const AddItemContent = () => {
  // ... (Your original AddItemContent component code here) ...
  const [form, setForm] = useState({ name: "", description: "", price: "" });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const seller = localStorage.getItem("userId");
    if (!seller) {
      alert("Error: User not logged in (userId missing).");
      return;
    }

    try {
      const res = await fetch("http://localhost:5002/api/products/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: Number(form.price), seller })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      await res.json();
      alert("Item Listed Successfully! ✅");
      setForm({ name: "", description: "", price: "" }); // Reset form

    } catch (error) {
      console.error("Error listing item:", error);
      alert("Failed to list item. See console for details.");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h2>➕ Add New Item for Bartering</h2>

      <form onSubmit={handleSubmit} style={{
        marginTop: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}>
        <input
          name="name"
          placeholder="Item Name (e.g., Vintage Camera)"
          onChange={handleChange}
          value={form.name}
          required
          style={{ padding: '0.8rem', background: COLOR_PRIMARY_DARK, border: `1px solid ${COLOR_ACCENT}`, borderRadius: '6px', color: COLOR_TEXT_LIGHT }}
        />

        <textarea
          name="description"
          placeholder="Detailed Description of the item..."
          rows={4}
          onChange={handleChange}
          value={form.description}
          required
          style={{ padding: '0.8rem', background: COLOR_PRIMARY_DARK, border: `1px solid ${COLOR_ACCENT}`, borderRadius: '6px', color: COLOR_TEXT_LIGHT }}
        />

        <input
          name="price"
          type="number"
          placeholder="Estimated Value (in USD or equivalent)"
          onChange={handleChange}
          value={form.price}
          required
          min="0"
          style={{ padding: '0.8rem', background: COLOR_PRIMARY_DARK, border: `1px solid ${COLOR_ACCENT}`, borderRadius: '6px', color: COLOR_TEXT_LIGHT }}
        />

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
          Upload Item
        </button>
      </form>
    </div>
  );
};

/**
 * Content Component for viewing the user's listed items (Profile). (Unchanged)
 */
const ProfileContent = () => {
  // ... (Your original ProfileContent component code here) ...
  const sellerId = localStorage.getItem("userId");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) {
      console.warn("No user ID found to fetch profile items.");
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch("http://localhost:5002/api/product-service/items")
      .then(res => res.json())
      .then(data => {
        const filtered = data.data.items.filter(i => i.seller === sellerId);
        setItems(filtered);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch user items:", error);
        setLoading(false);
      });
  }, [sellerId]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>👤 My Listed Items</h2>
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
              <h3 style={{ color: COLOR_ACCENT, marginBottom: '0.5rem' }}>{item.name}</h3>
              <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>{item.description}</p>
              <p style={{ fontWeight: 600, marginTop: '1rem' }}>Value: ${item.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


// --- 📦 MAIN DASHBOARD COMPONENT ---

export default function Dashboard() {
  const [currentView, setCurrentView] = useState("Home"); // 'Home', 'AddItem', 'Profile', 'Inbox', 'TradeDetail'
  const [selectedTrade, setSelectedTrade] = useState(null); // State to hold selected trade ID/object

  // Function to handle clicking into a specific trade from the inbox
  const handleViewTrade = (tradeId) => {
    setSelectedTrade(tradeId);
    setCurrentView('TradeDetail');
  };

  // Function to render the correct content based on the currentView state
  const renderContent = () => {
    switch (currentView) {
      case "AddItem":
        return <AddItemContent />;
      case "Profile":
        return <ProfileContent />;
      case "Inbox":
        // Pass the function to switch to TradeDetail view
        return <TradeInbox onSelectTrade={handleViewTrade} />;
      case "TradeDetail":
        // Render the detail component if a trade is selected
        return selectedTrade ? <TradeDetail tradeId={selectedTrade} onBack={() => setCurrentView('Inbox')} /> : <DashboardHome />;
      case "Home":
      default:
        return <DashboardHome />;
    }
  };

  // Style for the main container
  const mainContainerStyle = {
    ...BASE_STYLES,
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch", // Stretch sidebar and content to full height
  };

  // Style for the sidebar
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

  // Style for the main content area
  const contentStyle = {
    flexGrow: 1,
    padding: "2rem",
    ...BASE_STYLES, // Use base background for the content area
  };

  // Style for navigation buttons
  const navButtonStyle = (isActive) => ({
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.8rem 1rem",
    borderRadius: "8px",
    backgroundColor: isActive ? COLOR_ACCENT : 'transparent',
    color: isActive ? COLOR_PRIMARY_DARK : COLOR_TEXT_LIGHT,
    fontWeight: isActive ? 700 : 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: 'none',
    textAlign: 'left'
  });

  return (
    <div style={mainContainerStyle}>
      {/* Sidebar Navigation */}
      <aside style={sidebarStyle}>
        <h2 style={{ marginBottom: "2rem", color: COLOR_ACCENT }}>SWAP.TA</h2>

        <button
          style={navButtonStyle(currentView === "Home")}
          onClick={() => { setCurrentView("Home"); setSelectedTrade(null); }}
        >
          <Home size={20} /> Home
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

        {/* NEW NEGOTIATIONS BUTTON */}
        <button
          style={navButtonStyle(currentView === "Inbox" || currentView === "TradeDetail")}
          onClick={() => {
            setCurrentView("Inbox");
            setSelectedTrade(null); // Deselect trade when going back to inbox list
          }}
        >
          <MessageSquare size={20} /> Negotiations
        </button>

      </aside>

      {/* Main Content Area */}
      <main style={contentStyle}>
        {renderContent()}
      </main>
    </div>
  );
}