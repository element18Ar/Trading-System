import { useState, useEffect } from "react";

const COLOR_PRIMARY_DARK = "#2C2D2D";
const COLOR_ACCENT = "#00BFA5";
const COLOR_TEXT_LIGHT = "white";

export default function MarketplaceHome() {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5001/api/v1/products/items");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        const items = Array.isArray(data?.data?.items) ? data.data.items : (Array.isArray(data?.items) ? data.items : []);
        setAllItems(items);
      } catch (error) {
        console.error("Failed to fetch marketplace items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ color: COLOR_ACCENT }}>🏠 Barter Marketplace</h2>
      <p style={{ opacity: 0.8, marginBottom: '2rem' }}>Browse all items currently available for trade.</p>

      {loading && <p>Loading marketplace...</p>}
      {!loading && allItems.length === 0 && <p>No items have been listed yet. Be the first to start trading!</p>}

      {!loading && allItems.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {allItems.map(item => (
            <div key={item._id} style={{ padding: "1rem", background: COLOR_PRIMARY_DARK, borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.3)", border: `1px solid ${COLOR_ACCENT}50` }}>
              <div style={{ height: '150px', backgroundColor: '#444', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '0.9rem' }}>
                [Item Photo]
              </div>
              <h3 style={{ color: COLOR_TEXT_LIGHT, marginBottom: '0.5rem' }}>{item.name}</h3>
              <p style={{ opacity: 0.7, fontSize: '0.9rem', minHeight: '40px' }}>{item.description?.substring(0, 100)}...</p>
              <p style={{ fontWeight: 600, marginTop: '1rem', color: COLOR_ACCENT }}>Barter Item</p>
              <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>Seller ID: {item.seller?.substring(0, 8)}...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
