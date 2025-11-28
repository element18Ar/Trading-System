import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from "axios";
import { refreshToken } from "../api/authApi.js";
import { PlusCircle, User, Home, MessageSquare, LogOut } from "lucide-react";

import MarketplaceHome from "./MarketplaceHome.jsx";
import UserProfileContent from "./UserProfileContent.jsx";
import AddItemContent from "./AddItemContent.jsx";
import TradeInbox from "./TradeInbox.jsx";
import TradeDetail from "./TradeDetail.jsx";

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

export default function Dashboard() {
  const navigate = useNavigate();
  const { userId } = useParams(); // ✅ Correct location
  const location = useLocation();
  const [user, setUser] = useState(null); // store fetched user
  const [currentView, setCurrentView] = useState("Home");
  const [selectedTrade, setSelectedTrade] = useState(null);

  // ✅ Fetch user on load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }
        const doFetch = async (bearer) => {
          return axios.get(`http://localhost:5000/api/users/${userId}`, {
            headers: bearer ? { Authorization: `Bearer ${bearer}` } : {},
            withCredentials: true,
          });
        };

        let res = await doFetch(token);
        setUser(res.data);
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          try {
            const data = await refreshToken();
            const newToken = data.accessToken;
            if (newToken) {
              localStorage.setItem('authToken', newToken);
              const res2 = await axios.get(`http://localhost:5000/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${newToken}` }
              });
              setUser(res2.data);
              return;
            }
          } catch (refreshErr) {
            console.error("Token refresh failed:", refreshErr);
            navigate('/login');
          }
        }
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();

    // View routing via query params
    const params = new URLSearchParams(location.search);
    const viewParam = params.get('view');
    const tradeParam = params.get('trade');

    if (viewParam === 'Inbox') {
      setCurrentView('Inbox');
    }
    if (tradeParam) {
      setSelectedTrade(tradeParam);
      setCurrentView('TradeDetail');
    } else {
      const active = localStorage.getItem('activeTradeId');
      if (active) {
        setSelectedTrade(active);
        setCurrentView('TradeDetail');
        localStorage.removeItem('activeTradeId');
      }
    }
  }, [userId, location.search]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleViewTrade = tradeId => {
    setSelectedTrade(tradeId);
    setCurrentView('TradeDetail');
  };

  const handleItemUploadSuccess = () => setCurrentView("Home");

  const renderContent = () => {
    switch (currentView) {
      case "AddItem": return <AddItemContent onSuccess={handleItemUploadSuccess} />;
      case "Profile": return <UserProfileContent user={user} />;
      case "Inbox": return <TradeInbox onSelectTrade={handleViewTrade} />;
      case "TradeDetail": 
        return selectedTrade 
          ? <TradeDetail tradeId={selectedTrade} onBack={() => setCurrentView('Inbox')} />
          : <MarketplaceHome />;
      case "Home":
      default: return <MarketplaceHome />;
    }
  };

  const mainContainerStyle = { ...BASE_STYLES, display: "flex", flexDirection: "row", alignItems: "stretch" };
  const sidebarStyle = { width: "250px", minHeight: "100vh", backgroundColor: COLOR_PRIMARY_DARK, padding: "1.5rem 1rem", boxShadow: "5px 0 15px rgba(0, 0, 0, 0.5)", display: "flex", flexDirection: "column", gap: "0.5rem" };
  const contentStyle = { flexGrow: 1, padding: "2rem", ...BASE_STYLES };
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
    border: 'none',
    textAlign: 'left',
  });

  return (
    <div style={mainContainerStyle}>
      <aside style={sidebarStyle}>
        <h2 style={{ marginBottom: "0.5rem", color: COLOR_ACCENT }}>SWAP.TA</h2>

        {/* Display logged user name */}
        {user && (
          <p style={{ color: "#aaa", marginBottom: "2rem" }}>
            Hello, <strong>{user.username}</strong>
          </p>
        )}

        <button style={navButtonStyle(currentView === "Home")} onClick={() => { setCurrentView("Home"); setSelectedTrade(null); }}><Home size={20} /> Marketplace</button>
        <button style={navButtonStyle(currentView === "AddItem")} onClick={() => { setCurrentView("AddItem"); setSelectedTrade(null); }}><PlusCircle size={20} /> Add Item</button>
        <button style={navButtonStyle(currentView === "Profile")} onClick={() => { setCurrentView("Profile"); setSelectedTrade(null); }}><User size={20} /> My Profile</button>
        <button style={navButtonStyle(currentView === "Inbox" || currentView === "TradeDetail")} onClick={() => { setCurrentView("Inbox"); setSelectedTrade(null); }}><MessageSquare size={20} /> Negotiations (Inbox)</button>

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #444' }}>
          <button style={{ ...navButtonStyle(false, true), width: '100%' }} onClick={handleLogout}><LogOut size={20} /> Logout</button>
        </div>
      </aside>

      <main style={contentStyle}>{renderContent()}</main>
    </div>
  );
}
