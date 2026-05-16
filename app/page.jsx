"use client";
import { useState, useEffect } from "react";
import {
  ShoppingCart, X, Plus, Minus, Truck, Leaf, ArrowRight,
  Check, MapPin, Phone, Mail, Package, Star, ChevronRight, ArrowLeft
} from "lucide-react";

const S = {
  bg: "#f7f5f0", card: "#ffffff", green: "#1e3a1e", greenLight: "#2d5a2d",
  gold: "#b8941f", goldLight: "#c8a430", text: "#1a2a1a", muted: "#7a7060",
  border: "#e5dfd0", tag: "#eef5ee", tagText: "#2d5a2d"
};

const DEFAULT_PRODUCTS = [
  { id: 1, name: "Farm Fresh Eggs", price: 8.00, unit: "dozen", category: "Eggs", emoji: "🥚", inStock: true, desc: "Free-range, pasture-raised. Collected daily on St. Thomas.", longDesc: "Our hens roam freely on lush green pasture, eating a natural diet supplemented with local produce. Eggs are collected every morning and never refrigerated before delivery — meaning you get the freshest egg possible. Rich golden yolks. Great for baking, frying, or boiling.", rating: 4.9, reviews: 47, image: null },
  { id: 2, name: "Plantains", price: 3.50, unit: "bunch", category: "Fruits", emoji: "🍌", inStock: true, desc: "Ripe and green available. Perfect for tostones or sweet fry.", longDesc: "Grown on the hillsides of St. Thomas in volcanic soil. We offer both green plantains (for tostones and chips) and ripe yellow plantains (for sweet maduros). Let us know your preference in the order notes.", rating: 4.8, reviews: 62, image: null },
  { id: 3, name: "Julie Mangoes", price: 5.00, unit: "lb", category: "Fruits", emoji: "🥭", inStock: true, desc: "Local variety. Picked at peak ripeness, never refrigerated.", longDesc: "The Julie mango is the crown jewel of Caribbean fruit. Our trees are over 20 years old, producing intensely sweet, fiber-free mangoes with a buttery texture. Picked only when fully ripe — never green and ripened in transit like imported fruit.", rating: 5.0, reviews: 89, image: null },
  { id: 4, name: "Breadfruit", price: 4.00, unit: "each", category: "Vegetables", emoji: "🟢", inStock: true, desc: "Versatile and filling. Great roasted, fried, or boiled.", longDesc: "A Caribbean staple that can replace potato, rice, or bread in almost any dish. Our breadfruit is harvested at the perfect stage — not too young, not overripe. Roast it whole in the oven, fry it in slices, or boil it as a side dish.", rating: 4.7, reviews: 31, image: null },
  { id: 5, name: "Sweet Peppers", price: 4.50, unit: "lb", category: "Vegetables", emoji: "🫑", inStock: true, desc: "Mixed colors, grown without pesticides on local soil.", longDesc: "Crisp, sweet, and colorful — our peppers are grown entirely without pesticides or synthetic fertilizers. Mixed bags include red, yellow, and green. Great raw in salads, roasted, or stuffed.", rating: 4.8, reviews: 28, image: null },
  { id: 6, name: "Callaloo", price: 3.00, unit: "bundle", category: "Vegetables", emoji: "🥬", inStock: true, desc: "Fresh-cut Caribbean leafy green. Harvested same morning.", longDesc: "Callaloo is the backbone of Caribbean cooking. Packed with iron, calcium, and vitamins. Our callaloo is cut the same morning as delivery — you can't get it fresher. Use it in soups, sautéed with garlic, or in traditional callaloo stew.", rating: 4.9, reviews: 55, image: null },
  { id: 7, name: "Coconuts", price: 2.50, unit: "each", category: "Fruits", emoji: "🥥", inStock: true, desc: "Green drinking coconuts. Cold and ready.", longDesc: "Nothing beats a cold green coconut on a St. Thomas afternoon. We top them fresh so you can drink straight away. Sweet, hydrating coconut water inside — then crack it open for the soft jelly meat. Can be chilled or served at room temp.", rating: 4.8, reviews: 73, image: null },
  { id: 8, name: "Herb Bundle", price: 5.50, unit: "bundle", category: "Herbs", emoji: "🌿", inStock: true, desc: "Broad leaf thyme, basil, chives, shadow beni — all local.", longDesc: "Our signature herb bundle brings together the essential aromatics of Caribbean cooking. Each bundle includes broad leaf thyme (the backbone of VI seasoning), fresh basil, chives, and shadow beni (culantro). Grown in rich organic soil with no chemicals.", rating: 5.0, reviews: 41, image: null },
  { id: 9, name: "Vine Tomatoes", price: 4.00, unit: "lb", category: "Vegetables", emoji: "🍅", inStock: true, desc: "Vine-ripened, no wax. Picked the day of delivery.", longDesc: "We let our tomatoes ripen fully on the vine before picking — this is the secret to real tomato flavor. No wax coating, no ethylene gas ripening. Just pure, sun-kissed tomatoes. Perfect for salads, cooking, or eating raw with a pinch of sea salt.", rating: 4.7, reviews: 36, image: null },
  { id: 10, name: "Pineapple", price: 5.00, unit: "each", category: "Fruits", emoji: "🍍", inStock: true, desc: "Sweeter than any imported variety. Caribbean gold.", longDesc: "Caribbean pineapples are a completely different fruit from what you buy in the supermarket. Smaller, more fragrant, and intensely sweet with lower acidity. Ours are picked fully golden — no green patches, no sourness. A true island treat.", rating: 5.0, reviews: 58, image: null },
];

const CATS = ["All", "Fruits", "Vegetables", "Eggs", "Herbs"];
const DELIVERY_FEE = 10.00;
const FREE_THRESHOLD = 90;

function FieldInput({ label, value, onChange, placeholder, type = "text" }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 11, color: S.muted, display: "block", marginBottom: 6, letterSpacing: 1.5, textTransform: "uppercase" }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ width: "100%", background: focus ? "#fff" : S.bg, border: `1.5px solid ${focus ? S.greenLight : S.border}`, borderRadius: 10, padding: "11px 14px", color: S.text, fontSize: 14, outline: "none", boxSizing: "border-box", transition: "all 0.2s", fontFamily: "inherit" }} />
    </div>
  );
}

export default function FrancisFarms() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState("shop");
  const [orderNum, setOrderNum] = useState("");
  const [processing, setProcessing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", notes: "", card: "", expiry: "", cvv: "", zip: "" });

  useEffect(() => {
    // Load admin overrides (prices, stock, images) from localStorage
    try {
      const saved = localStorage.getItem("ff_products");
      if (saved) {
        const overrides = JSON.parse(saved);
        setProducts(prev => prev.map(p => {
          const o = overrides.find(x => x.id === p.id);
          return o ? { ...p, price: o.price ?? p.price, inStock: o.inStock ?? p.inStock, image: o.image ?? p.image } : p;
        }));
      }
    } catch (e) {}

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Inter:wght@400;500;600&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `
      * { font-family: 'Inter', sans-serif; }
      .disp { font-family: 'Playfair Display', Georgia, serif !important; }
      @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
      @keyframes slideIn { from { transform:translateX(100%); } to { transform:translateX(0); } }
      @keyframes slideUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
      @keyframes spin { to { transform:rotate(360deg); } }
      .fade-up { animation: fadeUp 0.45s ease forwards; }
      .cart-slide { animation: slideIn 0.28s ease; }
      .slide-up { animation: slideUp 0.35s ease forwards; }
      .prod-card { transition: all 0.22s ease; cursor: pointer; }
      .prod-card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(30,58,30,0.12) !important; }
      .btn-green { transition: all 0.2s ease; }
      .btn-green:hover { background: #2d5a2d !important; transform: translateY(-1px); }
      .cat-btn { transition: all 0.2s ease; }
      ::placeholder { color: #c5bfb0; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-thumb { background: #d5cfc0; border-radius: 2px; }
    `;
    document.head.appendChild(style);
  }, []);

  const addToCart = (p) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...p, qty: 1 }];
    });
  };
  const updateQty = (id, d) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + d) } : i).filter(i => i.qty > 0));
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = subtotal >= FREE_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const filtered = (category === "All" ? products : products.filter(p => p.category === category)).filter(p => p.inStock);
  const setF = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const placeOrder = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    setOrderNum("FF-" + Math.floor(10000 + Math.random() * 90000));
    setPage("confirmation");
    setProcessing(false);
    setCart([]);
  };

  const NavBar = () => (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 28px", background: "rgba(247,245,240,0.96)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${S.border}`, boxShadow: "0 1px 10px rgba(30,58,30,0.07)" }}>
      <div onClick={() => { setPage("shop"); setSelectedProduct(null); }} style={{ display: "flex", alignItems: "center", gap: 11, cursor: "pointer" }}>
        <div style={{ width: 36, height: 36, background: S.green, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Leaf size={17} color="#fff" />
        </div>
        <div>
          <div className="disp" style={{ fontSize: 20, fontWeight: 700, color: S.green, lineHeight: 1.1 }}>Francis Farms</div>
          <div style={{ fontSize: 10, color: S.muted, letterSpacing: 1.5, textTransform: "uppercase" }}>St. Thomas, USVI</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {(page !== "shop" || selectedProduct) && (
          <button onClick={() => { setPage("shop"); setSelectedProduct(null); }} style={{ background: "none", border: "none", color: S.muted, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 4 }}>
            <ArrowLeft size={14} /> Shop
          </button>
        )}
        <button onClick={() => setCartOpen(true)} className="cat-btn" style={{ background: S.card, border: `1.5px solid ${S.border}`, borderRadius: 10, padding: "8px 18px", color: S.green, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 500 }}>
          <ShoppingCart size={15} />
          Cart
          {cartCount > 0 && <span style={{ background: S.green, color: "#fff", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{cartCount}</span>}
        </button>
      </div>
    </nav>
  );

  // ── PRODUCT DETAIL PAGE ──
  if (selectedProduct) {
    const p = selectedProduct;
    const inCart = cart.find(i => i.id === p.id);
    return (
      <div style={{ background: S.bg, minHeight: "100vh" }}>
        <NavBar />
        <div className="slide-up" style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 80px" }}>
          <button onClick={() => setSelectedProduct(null)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: S.muted, cursor: "pointer", fontSize: 14, marginBottom: 28 }}>
            <ArrowLeft size={14} /> Back to shop
          </button>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
            {/* Image / emoji */}
            <div style={{ background: S.card, borderRadius: 20, border: `1px solid ${S.border}`, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 320, boxShadow: "0 2px 16px rgba(30,58,30,0.07)", overflow: "hidden" }}>
              {p.image
                ? <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: 100 }}>{p.emoji}</span>}
            </div>
            {/* Info */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: S.tag, border: "1px solid #c5dcc5", borderRadius: 50, padding: "4px 12px", marginBottom: 14, width: "fit-content" }}>
                <span style={{ fontSize: 11, color: S.tagText, fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase" }}>{p.category}</span>
              </div>
              <h1 className="disp" style={{ fontSize: 38, fontWeight: 700, color: S.green, lineHeight: 1.15, marginBottom: 12 }}>{p.name}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 2 }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={S.gold} color={S.gold} />)}
                </div>
                <span style={{ fontSize: 13, color: S.gold, fontWeight: 600 }}>{p.rating}</span>
                <span style={{ fontSize: 13, color: S.muted }}>({p.reviews} reviews)</span>
              </div>
              <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.8, marginBottom: 28 }}>{p.longDesc}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
                <div>
                  <span className="disp" style={{ fontSize: 38, fontWeight: 700, color: S.green }}>${p.price.toFixed(2)}</span>
                  <span style={{ fontSize: 14, color: S.muted, marginLeft: 6 }}>/ {p.unit}</span>
                </div>
              </div>
              {inCart ? (
                <div style={{ display: "flex", alignItems: "center", gap: 16, background: S.card, border: `1.5px solid ${S.border}`, borderRadius: 12, padding: "12px 16px", width: "fit-content" }}>
                  <button onClick={() => updateQty(p.id, -1)} style={{ width: 32, height: 32, borderRadius: "50%", border: `1.5px solid ${S.border}`, background: "none", color: S.green, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Minus size={14} /></button>
                  <span style={{ fontSize: 18, fontWeight: 700, color: S.green, minWidth: 24, textAlign: "center" }}>{inCart.qty}</span>
                  <button onClick={() => updateQty(p.id, 1)} style={{ width: 32, height: 32, borderRadius: "50%", border: `1.5px solid ${S.border}`, background: "none", color: S.green, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={14} /></button>
                  <span style={{ fontSize: 14, color: S.muted }}>in cart · ${(p.price * inCart.qty).toFixed(2)}</span>
                </div>
              ) : (
                <button onClick={() => addToCart(p)} className="btn-green" style={{ background: S.green, color: "#fff", border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, width: "fit-content" }}>
                  <Plus size={16} /> Add to Cart
                </button>
              )}
              <div style={{ marginTop: 24, padding: "14px 16px", background: S.tag, borderRadius: 10 }}>
                <div style={{ fontSize: 12, color: S.tagText, fontWeight: 500 }}>🚚 Free delivery on orders over ${FREE_THRESHOLD} · Otherwise $10 flat</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: S.bg, minHeight: "100vh", color: S.text }}>
      <NavBar />

      {/* ═══ SHOP ═══ */}
      {page === "shop" && (
        <div>
          <div className="fade-up" style={{ padding: "64px 28px 52px", textAlign: "center", background: "linear-gradient(170deg,#eaf4ea 0%,#f7f5f0 100%)", borderBottom: `1px solid ${S.border}` }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: S.tag, border: "1px solid #c5dcc5", borderRadius: 50, padding: "6px 16px", marginBottom: 22 }}>
              <Leaf size={12} color={S.tagText} />
              <span style={{ fontSize: 11, color: S.tagText, letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 500 }}>Fresh · Local · Delivered</span>
            </div>
            <h1 className="disp" style={{ fontSize: "clamp(38px, 7vw, 66px)", fontWeight: 700, color: S.green, lineHeight: 1.1, marginBottom: 18 }}>
              Farm-Fresh Produce<br /><em style={{ color: S.goldLight }}>Delivered to You</em>
            </h1>
            <p style={{ color: S.muted, fontSize: 16, maxWidth: 400, margin: "0 auto", lineHeight: 1.8 }}>Grown right here on St. Thomas. Picked fresh. Delivered the same day.</p>
          </div>

          <div style={{ background: S.green, display: "flex", justifyContent: "center", gap: 36, flexWrap: "wrap", padding: "13px 24px" }}>
            {[[<Truck size={13} />, `Free delivery over $${FREE_THRESHOLD}`], [<Leaf size={13} />, "No pesticides · No wax"], [<Check size={13} />, "Same-day delivery, Mon–Sat"]].map(([icon, text]) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ color: "#a8d8a8" }}>{icon}</span>
                <span style={{ fontSize: 12, color: "#d0ead0" }}>{text}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, padding: "22px 28px 14px", overflowX: "auto" }}>
            {CATS.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} className="cat-btn" style={{ padding: "8px 20px", borderRadius: 50, border: `1.5px solid ${category === cat ? S.green : S.border}`, background: category === cat ? S.green : S.card, color: category === cat ? "#fff" : S.muted, fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }}>
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(255px,1fr))", gap: 16, padding: "8px 28px 36px" }}>
            {filtered.map(p => (
              <div key={p.id} className="prod-card" onClick={() => setSelectedProduct(p)} style={{ background: S.card, borderRadius: 16, padding: 24, border: `1px solid ${S.border}`, boxShadow: "0 2px 8px rgba(30,58,30,0.05)" }}>
                <div style={{ marginBottom: 14, height: 80, display: "flex", alignItems: "center" }}>
                  {p.image
                    ? <img src={p.image} alt={p.name} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 12 }} />
                    : <span style={{ fontSize: 56 }}>{p.emoji}</span>}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 7 }}>
                  <h3 className="disp" style={{ fontSize: 20, fontWeight: 700, color: S.green, lineHeight: 1.2 }}>{p.name}</h3>
                  <div style={{ display: "flex", gap: 3, alignItems: "center", marginLeft: 8, flexShrink: 0 }}>
                    <Star size={11} fill={S.gold} color={S.gold} />
                    <span style={{ fontSize: 11, color: S.gold, fontWeight: 600 }}>{p.rating}</span>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.65, marginBottom: 18 }}>{p.desc}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span className="disp" style={{ fontSize: 25, fontWeight: 700, color: S.green }}>${p.price.toFixed(2)}</span>
                    <span style={{ fontSize: 12, color: S.muted, marginLeft: 4 }}>/ {p.unit}</span>
                  </div>
                  <button onClick={e => { e.stopPropagation(); addToCart(p); }} className="btn-green" style={{ background: S.green, color: "#fff", border: "none", borderRadius: 10, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                    <Plus size={13} /> Add
                  </button>
                </div>
                <div style={{ marginTop: 12, fontSize: 12, color: S.tagText, display: "flex", alignItems: "center", gap: 4 }}>
                  <span>Tap to see details</span> <ChevronRight size={11} />
                </div>
              </div>
            ))}
          </div>

          {/* Map pinned near Cost U Less */}
          <div style={{ padding: "0 28px 56px" }}>
            <div style={{ background: S.card, borderRadius: 20, border: `1px solid ${S.border}`, overflow: "hidden", boxShadow: "0 2px 16px rgba(30,58,30,0.08)" }}>
              <div style={{ padding: "26px 28px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, background: S.tag, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <MapPin size={18} color={S.green} />
                </div>
                <div>
                  <h3 className="disp" style={{ fontSize: 24, fontWeight: 700, color: S.green, marginBottom: 2 }}>Find Us</h3>
                  <p style={{ fontSize: 13, color: S.muted }}>Near Cost U Less · Weymouth Rhymer Hwy, St. Thomas</p>
                </div>
              </div>
              <iframe
                title="Francis Farms Location"
                src="https://maps.google.com/maps?q=18.3485,-64.9312&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="380"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
              />
              <div style={{ padding: "16px 28px", borderTop: `1px solid ${S.border}`, display: "flex", gap: 24, flexWrap: "wrap" }}>
                {[[<Phone size={13} />, "(340) 000-0000"], [<Mail size={13} />, "orders@francisfarms.vi"], [<Truck size={13} />, "Mon – Sat · 7 AM – 5 PM"]].map(([icon, text]) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ color: S.green }}>{icon}</span>
                    <span style={{ fontSize: 13, color: S.muted }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ CHECKOUT ═══ */}
      {page === "checkout" && (
        <div className="fade-up" style={{ maxWidth: 860, margin: "0 auto", padding: "40px 20px 80px" }}>
          <h2 className="disp" style={{ fontSize: 42, color: S.green, marginBottom: 36 }}>Checkout</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: S.card, borderRadius: 16, padding: 24, border: `1px solid ${S.border}` }}>
                <h3 className="disp" style={{ fontSize: 24, color: S.green, marginBottom: 20 }}>Delivery Details</h3>
                <FieldInput label="Full Name" value={form.name} onChange={v => setF("name", v)} placeholder="Your name" />
                <FieldInput label="Phone" value={form.phone} onChange={v => setF("phone", v)} placeholder="+1 (340) 000-0000" />
                <FieldInput label="Email" value={form.email} onChange={v => setF("email", v)} placeholder="you@email.com" type="email" />
                <FieldInput label="Delivery Address" value={form.address} onChange={v => setF("address", v)} placeholder="Street address, St. Thomas" />
                <div>
                  <label style={{ fontSize: 11, color: S.muted, display: "block", marginBottom: 6, letterSpacing: 1.5, textTransform: "uppercase" }}>Notes</label>
                  <textarea value={form.notes} onChange={e => setF("notes", e.target.value)} placeholder="Gate code, landmark, time preference..." rows={3} style={{ width: "100%", background: S.bg, border: `1.5px solid ${S.border}`, borderRadius: 10, padding: "11px 14px", color: S.text, fontSize: 14, resize: "none", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                </div>
              </div>
              <div style={{ background: S.card, borderRadius: 16, padding: 24, border: `1px solid ${S.border}` }}>
                <h3 className="disp" style={{ fontSize: 24, color: S.green, marginBottom: 4 }}>Payment</h3>
                <p style={{ fontSize: 12, color: S.muted, marginBottom: 20 }}>Secured by Stripe · 256-bit SSL</p>
                <FieldInput label="Card Number" value={form.card} onChange={v => setF("card", v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim())} placeholder="1234 5678 9012 3456" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  <FieldInput label="Expiry" value={form.expiry} onChange={v => setF("expiry", v)} placeholder="MM/YY" />
                  <FieldInput label="CVV" value={form.cvv} onChange={v => setF("cvv", v.replace(/\D/g, "").slice(0, 4))} placeholder="•••" />
                  <FieldInput label="ZIP" value={form.zip} onChange={v => setF("zip", v)} placeholder="00801" />
                </div>
              </div>
            </div>
            <div>
              <div style={{ background: S.card, borderRadius: 16, padding: 24, border: `1px solid ${S.border}`, position: "sticky", top: 80 }}>
                <h3 className="disp" style={{ fontSize: 24, color: S.green, marginBottom: 20 }}>Order Summary</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 14 }}>{item.emoji} {item.name}</div>
                        <div style={{ fontSize: 12, color: S.muted }}>×{item.qty} {item.unit}</div>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 16 }}>
                  {[["Subtotal", `$${subtotal.toFixed(2)}`], ["Delivery", delivery === 0 ? "FREE" : `$${delivery.toFixed(2)}`]].map(([l, v]) => (
                    <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: S.muted }}>{l}</span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: (l === "Delivery" && delivery === 0) ? S.greenLight : S.text }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, paddingTop: 14, borderTop: `1px solid ${S.border}` }}>
                    <span className="disp" style={{ fontSize: 22, color: S.green }}>Total</span>
                    <span className="disp" style={{ fontSize: 28, fontWeight: 700, color: S.green }}>${total.toFixed(2)}</span>
                  </div>
                </div>
                <button onClick={placeOrder} disabled={processing || !form.name || !form.address} className="btn-green" style={{ width: "100%", background: S.green, color: "#fff", border: "none", borderRadius: 12, padding: 15, fontSize: 15, fontWeight: 600, cursor: processing ? "wait" : "pointer", marginTop: 20, opacity: (!form.name || !form.address) ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {processing ? <><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> Processing...</> : <>Place Order · ${total.toFixed(2)} <ChevronRight size={15} /></>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ CONFIRMATION ═══ */}
      {page === "confirmation" && (
        <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div className="fade-up" style={{ textAlign: "center", maxWidth: 460 }}>
            <div style={{ width: 80, height: 80, background: S.tag, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 4px 20px rgba(30,58,30,0.15)" }}>
              <Check size={34} color={S.green} />
            </div>
            <h2 className="disp" style={{ fontSize: 52, color: S.green, marginBottom: 10 }}>Order Placed!</h2>
            <p style={{ color: S.muted, fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>Your fresh produce is being prepared.<br />You'll receive a confirmation shortly.</p>
            <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 16, padding: 22, marginBottom: 28 }}>
              <div style={{ fontSize: 11, color: S.muted, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 6 }}>Order Number</div>
              <div className="disp" style={{ fontSize: 34, fontWeight: 700, color: S.green }}>{orderNum}</div>
            </div>
            <button onClick={() => setPage("shop")} className="btn-green" style={{ background: S.green, color: "#fff", border: "none", borderRadius: 12, padding: "14px 36px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* ═══ CART ═══ */}
      {cartOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
          <div onClick={() => setCartOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(30,58,30,0.3)" }} />
          <div className="cart-slide" style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "min(390px,100vw)", background: S.card, borderLeft: `1px solid ${S.border}`, display: "flex", flexDirection: "column", boxShadow: "-8px 0 32px rgba(30,58,30,0.12)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: `1px solid ${S.border}` }}>
              <span className="disp" style={{ fontSize: 26, fontWeight: 700, color: S.green }}>Your Cart</span>
              <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", color: S.muted, cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <Package size={38} color={S.border} style={{ margin: "0 auto 14px", display: "block" }} />
                  <p style={{ color: S.muted, fontSize: 14 }}>Your cart is empty</p>
                </div>
              ) : cart.map(item => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${S.border}` }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{item.emoji} {item.name}</div>
                    <div style={{ fontSize: 13, color: S.green, fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <button onClick={() => updateQty(item.id, -1)} style={{ width: 28, height: 28, borderRadius: "50%", border: `1.5px solid ${S.border}`, background: "none", color: S.green, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Minus size={12} /></button>
                    <span style={{ fontSize: 14, fontWeight: 600, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} style={{ width: 28, height: 28, borderRadius: "50%", border: `1.5px solid ${S.border}`, background: "none", color: S.green, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div style={{ padding: "20px 24px", borderTop: `1px solid ${S.border}` }}>
                {delivery > 0 && <p style={{ fontSize: 12, color: S.muted, marginBottom: 10, textAlign: "center" }}>Add ${(FREE_THRESHOLD - subtotal).toFixed(2)} more for free delivery</p>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <span style={{ color: S.muted, fontSize: 14 }}>Subtotal</span>
                  <span className="disp" style={{ fontSize: 24, fontWeight: 700, color: S.green }}>${subtotal.toFixed(2)}</span>
                </div>
                <button onClick={() => { setCartOpen(false); setPage("checkout"); }} className="btn-green" style={{ width: "100%", background: S.green, color: "#fff", border: "none", borderRadius: 12, padding: 15, fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  Checkout <ArrowRight size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
