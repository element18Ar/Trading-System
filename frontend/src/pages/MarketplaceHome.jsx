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
        const data = await res.json();

        // FIX: backend returns items inside data.data.items
        setAllItems(data?.data?.items || []);
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

      {loading && <p>Loading marketplace...</p>}
      {!loading && allItems.length === 0 && <p>No items listed yet.</p>}

      {!loading && allItems.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {allItems.map((item) => (
            <div
              key={item._id}
              style={{
                padding: "1rem",
                background: COLOR_PRIMARY_DARK,
                borderRadius: "12px",
                border: `1px solid ${COLOR_ACCENT}50`,
              }}
            >
              <img
                src={`http://localhost:5001/${item.image}`}
                alt={item.name}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                }}
              />

              <h3 style={{ color: "white" }}>{item.name}</h3>
              <p style={{ opacity: 0.7 }}>{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
