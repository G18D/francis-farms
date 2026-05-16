"use client";
import { useState, useEffect, useRef } from "react";

const ADMIN_PASSWORD = "francis2024";

const INITIAL_PRODUCTS = [
  { id: 1, name: "Farm Fresh Eggs", price: 8.00, unit: "dozen", category: "Eggs", emoji: "🥚", inStock: true, image: null },
  { id: 2, name: "Plantains", price: 3.50, unit: "bunch", category: "Fruits", emoji: "🍌", inStock: true, image: null },
  { id: 3, name: "Julie Mangoes", price: 5.00, unit: "lb", category: "Fruits", emoji: "🥭", inStock: true, image: null },
  { id: 4, name: "Breadfruit", price: 4.00, unit: "each", category: "Vegetables", emoji: "🟢", inStock: true, image: null },
  { id: 5, name: "Sweet Peppers", price: 4.50, unit: "lb", category: "Vegetables", emoji: "🫑", inStock: true, image: null },
  { id: 6, name: "Callaloo", price: 3.00, unit: "bundle", category: "Vegetables", emoji: "🥬", inStock: true, image: null },
  { id: 7, name: "Coconuts", price: 2.50, unit: "each", category: "Fruits", emoji: "🥥", inStock: true, image: null },
  { id: 8, name: "Herb Bundle", price: 5.50, unit: "bundle", category: "Herbs", emoji: "🌿", inStock: true, image: null },
  { id: 9, name: "Vine Tomatoes", price: 4.00, unit: "lb", category: "Vegetables", emoji: "🍅", inStock: true, image: null },
  { id: 10, name: "Pineapple", price: 5.00, unit: "each", category: "Fruits", emoji: "🍍", inStock: true, image: null },
];

const MOCK_ORDERS = [
  { id: "FF-10482", name: "Maria Thomas", phone: "(340) 514-2201", address: "14 Crown Bay, St. Thomas", items: [{ name: "Farm Fresh Eggs", qty: 2, price: 8.00 }, { name: "Callaloo", qty: 3, price: 3.00 }], total: 25.00, delivery: 10.00, status: "pending", time: "2026-05-16T08:30:00", notes: "Please leave at gate" },
  { id: "FF-10483", name: "James Rivera", phone: "(340) 227-8834", address: "8 Raphune Hill, St. Thomas", items: [{ name: "Julie Mangoes", qty: 4, price: 5.00 }, { name: "Plantains", qty: 2, price: 3.50 }], total: 27.00, delivery: 10.00, status: "delivered", time: "2026-05-16T07:15:00", notes: "" },
  { id: "FF-10484", name: "Sandra Baptiste", phone: "(340) 643-9901", address: "22 Frenchtown, St. Thomas", items: [{ name: "Herb Bundle", qty: 1, price: 5.50 }, { name: "Vine Tomatoes", qty: 2, price: 4.00 }, { name: "Sweet Peppers", qty: 1, price: 4.50 }], total: 18.00, delivery: 0, status: "preparing", time: "2026-05-16T09:00:00", notes: "Call when arriving" },
  { id: "FF-10485", name: "David Francis", phone: "(340) 771-3345", address: "5 Contant, St. Thomas", items: [{ name: "Coconuts", qty: 6, price: 2.50 }, { name: "Pineapple", qty: 2, price: 5.00 }], total: 25.00, delivery: 10.00, status: "pending", time: "2026-05-16T09:45:00", notes: "" },
];

const STATUS_COLORS = {
  pending: { bg: "#fff8e6", text: "#b8740a", border: "#fde68a" },
  preparing: { bg: "#e6f0ff", text: "#1e40af", border: "#bfdbfe" },
  delivered: { bg: "#eef5ee", text: "#166534", border: "#bbf7d0" },
  cancelled: { bg: "#fef2f2", text: "#991b1b", border: "#fecaca" },
};

const S = { bg: "#f4f1eb", card: "#ffffff", green: "#1e3a1e", gold: "#b8941f", text: "#1a2a1a", muted: "#6b7060", border: "#e2ddd0", tag: "#eef5ee" };

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [editingPrice, setEditingPrice] = useState(null);
  const [tempPrice, setTempPrice] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [saved, setSaved] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Load saved product data
    try {
      const s = localStorage.getItem("ff_products");
      if (s) {
        const overrides = JSON.parse(s);
        setProducts(prev => prev.map(p => {
          const o = overrides.find(x => x.id === p.id);
          return o ? { ...p, ...o } : p;
        }));
      }
    } catch (e) {}

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `
      * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
      .disp { font-family: 'Playfair Display', Georgia, serif !important; }
      @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      @keyframes slideRight { from { opacity:0; transform:translateX(-10px); } to { opacity:1; transform:translateX(0); } }
      @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
      @keyframes spin { to { transform: rotate(360deg); } }
      .fade-in { animation: fadeIn 0.3s ease forwards; }
      .slide-right { animation: slideRight 0.25s ease forwards; }
      .shake { animation: shake 0.3s ease; }
      .nav-btn { transition: all 0.2s ease; }
      .nav-btn:hover { background: rgba(255,255,255,0.12) !important; }
      .row-hover { transition: background 0.15s ease; cursor: pointer; }
      .row-hover:hover { background: #f8f6f0 !important; }
      .pill { display:inline-flex; align-items:center; gap:4px; padding:4px 10px; border-radius:50px; font-size:12px; font-weight:600; }
      .img-upload:hover .img-overlay { opacity: 1 !important; }
      ::placeholder { color: #b0a898; }
    `;
    document.head.appendChild(style);
  }, []);

  const saveProducts = (updated) => {
    try {
      localStorage.setItem("ff_products", JSON.stringify(updated.map(p => ({ id: p.id, price: p.price, inStock: p.inStock, image: p.image }))));
    } catch (e) {}
  };

  const flash = (msg) => { setSaved(msg); setTimeout(() => setSaved(null), 2200); };

  const login = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwError(false); }
    else { setPwError(true); setTimeout(() => setPwError(false), 600); }
  };

  const updateStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    if (selectedOrder?.id === id) setSelectedOrder(prev => ({ ...prev, status }));
  };

  const toggleStock = (id) => {
    const updated = products.map(p => p.id === id ? { ...p, inStock: !p.inStock } : p);
    setProducts(updated);
    saveProducts(updated);
    flash("Stock updated");
  };

  const savePrice = (id) => {
    const val = parseFloat(tempPrice);
    if (!isNaN(val) && val > 0) {
      const updated = products.map(p => p.id === id ? { ...p, price: val } : p);
      setProducts(updated);
      saveProducts(updated);
      flash("Price updated");
    }
    setEditingPrice(null);
  };

  const handleImageUpload = (id, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const updated = products.map(p => p.id === id ? { ...p, image: e.target.result } : p);
      setProducts(updated);
      saveProducts(updated);
      setUploadingId(null);
      flash("Photo updated ✓");
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (id) => {
    const updated = products.map(p => p.id === id ? { ...p, image: null } : p);
    setProducts(updated);
    saveProducts(updated);
    flash("Photo removed");
  };

  const stats = {
    pending: orders.filter(o => o.status === "pending").length,
    today: orders.length,
    revenue: orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total + o.delivery, 0),
    delivered: orders.filter(o => o.status === "delivered").length,
  };

  const formatTime = (t) => new Date(t).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  if (!authed) return (
    <div style={{ minHeight: "100vh", background: S.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="fade-in" style={{ width: 380, background: S.card, borderRadius: 20, padding: 40, boxShadow: "0 8px 40px rgba(30,58,30,0.12)", border: `1px solid ${S.border}` }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, background: S.green, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <span style={{ fontSize: 24 }}>🌿</span>
          </div>
          <h1 className="disp" style={{ fontSize: 28, color: S.green, marginBottom: 6 }}>Francis Farms</h1>
          <p style={{ fontSize: 13, color: S.muted }}>Admin Dashboard</p>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, color: S.muted, letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Password</label>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} placeholder="Enter admin password"
            className={pwError ? "shake" : ""}
            style={{ width: "100%", padding: "12px 16px", borderRadius: 10, fontSize: 15, border: `1.5px solid ${pwError ? "#ef4444" : S.border}`, background: pwError ? "#fef2f2" : S.bg, color: S.text, outline: "none", transition: "all 0.2s" }} />
          {pwError && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>Incorrect password</p>}
        </div>
        <button onClick={login} style={{ width: "100%", background: S.green, color: "#fff", border: "none", borderRadius: 10, padding: "13px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Sign In</button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: S.bg }}>
      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={e => { if (uploadingId && e.target.files[0]) handleImageUpload(uploadingId, e.target.files[0]); e.target.value = ""; }} />

      {/* Sidebar */}
      <div style={{ width: 220, background: S.green, display: "flex", flexDirection: "column", padding: "24px 12px", position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 50 }}>
        <div style={{ padding: "0 12px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 22 }}>🌿</span>
            <span className="disp" style={{ fontSize: 18, color: "#fff", fontWeight: 700 }}>Francis Farms</span>
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1.5, textTransform: "uppercase", paddingLeft: 32 }}>Admin</div>
        </div>
        {[{ id: "orders", emoji: "📋", label: "Orders", badge: stats.pending }, { id: "inventory", emoji: "📦", label: "Inventory" }, { id: "pricing", emoji: "💰", label: "Pricing" }, { id: "photos", emoji: "📸", label: "Photos" }].map(item => (
          <button key={item.id} onClick={() => setTab(item.id)} className={`nav-btn ${tab === item.id ? "active" : ""}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", background: tab === item.id ? "rgba(255,255,255,0.18)" : "transparent", color: tab === item.id ? "#fff" : "rgba(255,255,255,0.55)", cursor: "pointer", fontSize: 14, fontWeight: tab === item.id ? 600 : 400, marginBottom: 4, width: "100%", textAlign: "left" }}>
            <span style={{ fontSize: 16 }}>{item.emoji}</span>
            {item.label}
            {item.badge > 0 && <span style={{ marginLeft: "auto", background: "#ef4444", color: "#fff", borderRadius: 50, width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{item.badge}</span>}
          </button>
        ))}
        <div style={{ marginTop: "auto" }}>
          <button onClick={() => setAuthed(false)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, border: "none", background: "transparent", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 13, width: "100%" }}>
            🚪 Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ marginLeft: 220, flex: 1, padding: "28px 32px" }}>
        {saved && <div style={{ position: "fixed", top: 20, right: 20, background: S.green, color: "#fff", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, zIndex: 999, boxShadow: "0 4px 20px rgba(30,58,30,0.3)" }}>✓ {saved}</div>}

        {/* ── ORDERS ── */}
        {tab === "orders" && (
          <div className="fade-in">
            <div style={{ marginBottom: 28 }}>
              <h1 className="disp" style={{ fontSize: 36, color: S.green, marginBottom: 4 }}>Orders</h1>
              <p style={{ color: S.muted, fontSize: 14 }}>Today · {stats.today} orders</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
              {[{ label: "Pending", value: stats.pending, emoji: "⏳", color: "#b8740a", bg: "#fff8e6" }, { label: "Delivered", value: stats.delivered, emoji: "✅", color: "#166534", bg: "#eef5ee" }, { label: "Total Orders", value: stats.today, emoji: "📋", color: S.green, bg: "#f0f5f0" }, { label: "Revenue", value: `$${stats.revenue.toFixed(2)}`, emoji: "💵", color: S.gold, bg: "#fdf8ee" }].map(stat => (
                <div key={stat.label} style={{ background: S.card, borderRadius: 14, padding: "18px 20px", border: `1px solid ${S.border}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 11, color: S.muted, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>{stat.label}</div>
                      <div className="disp" style={{ fontSize: 30, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                    </div>
                    <div style={{ width: 40, height: 40, background: stat.bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{stat.emoji}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: selectedOrder ? "1fr 1fr" : "1fr", gap: 20 }}>
              <div style={{ background: S.card, borderRadius: 16, border: `1px solid ${S.border}`, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${S.border}` }}><span style={{ fontSize: 15, fontWeight: 600, color: S.green }}>All Orders</span></div>
                {orders.map(order => (
                  <div key={order.id} className="row-hover" onClick={() => setSelectedOrder(order)} style={{ padding: "14px 20px", borderBottom: `1px solid ${S.border}`, background: selectedOrder?.id === order.id ? "#f0f5f0" : "transparent" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: S.text }}>{order.name}</span>
                          <span className="pill" style={{ background: STATUS_COLORS[order.status].bg, color: STATUS_COLORS[order.status].text, border: `1px solid ${STATUS_COLORS[order.status].border}` }}>{order.status}</span>
                        </div>
                        <div style={{ fontSize: 12, color: S.muted }}>{order.id} · {formatTime(order.time)} · {order.items.length} items</div>
                      </div>
                      <span className="disp" style={{ fontSize: 18, fontWeight: 700, color: S.green }}>${(order.total + order.delivery).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
              {selectedOrder && (
                <div className="slide-right" style={{ background: S.card, borderRadius: 16, border: `1px solid ${S.border}`, overflow: "hidden" }}>
                  <div style={{ padding: "16px 20px", borderBottom: `1px solid ${S.border}`, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: S.green }}>Order {selectedOrder.id}</span>
                    <button onClick={() => setSelectedOrder(null)} style={{ background: "none", border: "none", color: S.muted, cursor: "pointer", fontSize: 18 }}>×</button>
                  </div>
                  <div style={{ padding: 20 }}>
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{selectedOrder.name}</div>
                      <div style={{ fontSize: 13, color: S.muted, marginBottom: 2 }}>📍 {selectedOrder.address}</div>
                      <div style={{ fontSize: 13, color: S.muted }}>📞 {selectedOrder.phone}</div>
                      {selectedOrder.notes && <div style={{ fontSize: 13, color: S.gold, marginTop: 6 }}>💬 {selectedOrder.notes}</div>}
                    </div>
                    <div style={{ background: S.bg, borderRadius: 12, padding: 16, marginBottom: 20 }}>
                      {selectedOrder.items.map((item, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <span style={{ fontSize: 14 }}>{item.name} ×{item.qty}</span>
                          <span style={{ fontSize: 14, fontWeight: 500 }}>${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                      <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 10, marginTop: 6 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span className="disp" style={{ fontSize: 18, color: S.green }}>Total</span>
                          <span className="disp" style={{ fontSize: 22, fontWeight: 700, color: S.green }}>${(selectedOrder.total + selectedOrder.delivery).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: S.muted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Update Status</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {["pending", "preparing", "delivered", "cancelled"].map(s => (
                        <button key={s} onClick={() => updateStatus(selectedOrder.id, s)} style={{ padding: "9px", borderRadius: 8, border: `1.5px solid ${selectedOrder.status === s ? STATUS_COLORS[s].border : S.border}`, background: selectedOrder.status === s ? STATUS_COLORS[s].bg : "transparent", color: selectedOrder.status === s ? STATUS_COLORS[s].text : S.muted, fontSize: 13, fontWeight: selectedOrder.status === s ? 600 : 400, cursor: "pointer", textTransform: "capitalize" }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── INVENTORY ── */}
        {tab === "inventory" && (
          <div className="fade-in">
            <div style={{ marginBottom: 28 }}>
              <h1 className="disp" style={{ fontSize: 36, color: S.green, marginBottom: 4 }}>Inventory</h1>
              <p style={{ color: S.muted, fontSize: 14 }}>{products.filter(p => p.inStock).length} of {products.length} items in stock</p>
            </div>
            <div style={{ background: S.card, borderRadius: 16, border: `1px solid ${S.border}`, overflow: "hidden" }}>
              {products.map((p, i) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", padding: "16px 24px", borderBottom: i < products.length - 1 ? `1px solid ${S.border}` : "none", opacity: p.inStock ? 1 : 0.55 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, overflow: "hidden", marginRight: 14, background: S.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {p.image ? <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 24 }}>{p.emoji}</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: S.text }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: S.muted }}>{p.category} · ${p.price.toFixed(2)} / {p.unit}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span className="pill" style={{ background: p.inStock ? "#eef5ee" : "#fef2f2", color: p.inStock ? "#166534" : "#991b1b", border: `1px solid ${p.inStock ? "#bbf7d0" : "#fecaca"}` }}>{p.inStock ? "In Stock" : "Out of Stock"}</span>
                    <button onClick={() => toggleStock(p.id)} style={{ width: 44, height: 24, borderRadius: 50, border: "none", cursor: "pointer", background: p.inStock ? S.green : "#d1d5db", position: "relative", transition: "background 0.2s" }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: p.inStock ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PRICING ── */}
        {tab === "pricing" && (
          <div className="fade-in">
            <div style={{ marginBottom: 28 }}>
              <h1 className="disp" style={{ fontSize: 36, color: S.green, marginBottom: 4 }}>Pricing</h1>
              <p style={{ color: S.muted, fontSize: 14 }}>Click Edit to change any price</p>
            </div>
            <div style={{ background: S.card, borderRadius: 16, border: `1px solid ${S.border}`, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "12px 24px", borderBottom: `1px solid ${S.border}`, background: S.bg }}>
                {["Product", "Unit", "Price", "Action"].map(h => <span key={h} style={{ fontSize: 11, color: S.muted, textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 600 }}>{h}</span>)}
              </div>
              {products.map((p, i) => (
                <div key={p.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "14px 24px", borderBottom: i < products.length - 1 ? `1px solid ${S.border}` : "none", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, overflow: "hidden", background: S.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {p.image ? <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 18 }}>{p.emoji}</span>}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{p.name}</span>
                  </div>
                  <span style={{ fontSize: 13, color: S.muted }}>/ {p.unit}</span>
                  <div>
                    {editingPrice === p.id ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ color: S.muted }}>$</span>
                        <input autoFocus type="number" value={tempPrice} onChange={e => setTempPrice(e.target.value)} onKeyDown={e => { if (e.key === "Enter") savePrice(p.id); if (e.key === "Escape") setEditingPrice(null); }} style={{ width: 70, padding: "6px 8px", borderRadius: 8, border: `1.5px solid ${S.green}`, fontSize: 14, outline: "none" }} />
                      </div>
                    ) : <span className="disp" style={{ fontSize: 20, fontWeight: 700, color: S.green }}>${p.price.toFixed(2)}</span>}
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {editingPrice === p.id
                      ? <><button onClick={() => savePrice(p.id)} style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: S.green, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Save</button><button onClick={() => setEditingPrice(null)} style={{ padding: "6px 10px", borderRadius: 8, border: `1px solid ${S.border}`, background: "none", color: S.muted, fontSize: 12, cursor: "pointer" }}>✕</button></>
                      : <button onClick={() => { setEditingPrice(p.id); setTempPrice(p.price.toFixed(2)); }} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${S.border}`, background: "none", color: S.muted, fontSize: 12, cursor: "pointer" }}>Edit</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PHOTOS ── */}
        {tab === "photos" && (
          <div className="fade-in">
            <div style={{ marginBottom: 28 }}>
              <h1 className="disp" style={{ fontSize: 36, color: S.green, marginBottom: 4 }}>Product Photos</h1>
              <p style={{ color: S.muted, fontSize: 14 }}>Upload real photos to replace the emojis on the shop. Changes save instantly.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
              {products.map(p => (
                <div key={p.id} style={{ background: S.card, borderRadius: 16, border: `1px solid ${S.border}`, overflow: "hidden", boxShadow: "0 2px 8px rgba(30,58,30,0.05)" }}>
                  {/* Image area */}
                  <div className="img-upload" style={{ position: "relative", height: 160, background: S.bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    onClick={() => { setUploadingId(p.id); fileInputRef.current?.click(); }}>
                    {p.image
                      ? <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 48, marginBottom: 8 }}>{p.emoji}</div>
                          <div style={{ fontSize: 12, color: S.muted }}>No photo yet</div>
                        </div>}
                    {/* Hover overlay */}
                    <div className="img-overlay" style={{ position: "absolute", inset: 0, background: "rgba(30,58,30,0.65)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }}>
                      <div style={{ fontSize: 28, marginBottom: 6 }}>📷</div>
                      <div style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>{p.image ? "Change Photo" : "Upload Photo"}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>Click to browse</div>
                    </div>
                  </div>
                  {/* Info */}
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: S.text, marginBottom: 10 }}>{p.name}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => { setUploadingId(p.id); fileInputRef.current?.click(); }} style={{ flex: 1, padding: "8px", borderRadius: 8, border: `1.5px solid ${S.green}`, background: "none", color: S.green, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        {p.image ? "🔄 Change" : "📷 Upload"}
                      </button>
                      {p.image && (
                        <button onClick={() => removeImage(p.id)} style={{ padding: "8px 10px", borderRadius: 8, border: `1px solid #fecaca`, background: "#fef2f2", color: "#991b1b", fontSize: 12, cursor: "pointer" }}>
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, padding: "14px 18px", background: "#fff8e6", border: "1px solid #fde68a", borderRadius: 12 }}>
              <p style={{ fontSize: 13, color: "#b8740a" }}>💡 Photos are saved in your browser. For permanent storage across devices, connect Supabase Storage — ask Claude to set it up.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
