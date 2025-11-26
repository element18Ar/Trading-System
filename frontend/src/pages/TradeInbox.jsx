import React, { useState, useEffect } from "react";
import { List } from "lucide-react";
import { getUserTrades } from "../api/tradeApi.js";

// --- 🎨 STYLE CONSTANTS ---
const COLOR_ACCENT = "#00BFA5";
const COLOR_PRIMARY_DARK = "#2C2D2D";
const COLOR_CARD_BG = "#3E3F3F";

export default function TradeInbox({ onSelectTrade }) {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId"); // Must be available from login

  const fetchTrades = async () => {
    if (!userId) {
      console.error("User ID not found in localStorage.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await getUserTrades(userId);
      setTrades(res.data);
    } catch (error) {
      console.error("Error fetching trades:", error);
      setTrades([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const getPartner = (trade) => {
    const isInitiator = trade.initiator._id === userId;
    return isInitiator ? trade.receiver : trade.initiator;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'accepted': return { color: 'green', fontWeight: 'bold' };
      case 'rejected': return { color: 'red', fontWeight: 'bold' };
      case 'proposed': return { color: 'yellow' };
      case 'negotiating': return { color: COLOR_ACCENT };
      default: return { color: 'gray' };
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2><List size={28} style={{ marginRight: '10px' }} />Trade Negotiations Inbox</h2>
      <p style={{ opacity: 0.8, marginBottom: '20px' }}>Current and past trade proposals.</p>

      {loading && <p>Loading negotiations...</p>}
      
      {!loading && trades.length === 0 && <p>You have no active or archived trades.</p>}

      {!loading && trades.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {trades.map(trade => {
            const partner = getPartner(trade);
            const isInitiator = trade.initiator._id === userId;
            const lastActive = new Date(trade.lastActivity).toLocaleDateString();

            return (
              <div 
                key={trade._id} 
                onClick={() => onSelectTrade(trade._id)}
                style={{
                  padding: "1rem",
                  background: COLOR_CARD_BG,
                  borderRadius: "10px",
                  cursor: "pointer",
                  borderLeft: `5px solid ${getStatusStyle(trade.status).color}`,
                  transition: 'background-color 0.2s',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#4A4B4B'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = COLOR_CARD_BG}
              >
                <div>
                  <h3 style={{ margin: 0 }}>
                    Trade with <span style={{ color: COLOR_ACCENT }}>{partner.username}</span>
                  </h3>
                  <p style={{ margin: '0.2rem 0', opacity: 0.7, fontSize: '0.9rem' }}>
                    {isInitiator ? "You started this trade." : "Awaiting your response."}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, ...getStatusStyle(trade.status) }}>
                    {trade.status.toUpperCase()}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.6 }}>
                    Active: {lastActive}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
