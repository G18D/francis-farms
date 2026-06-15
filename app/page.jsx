"use client";
import { useState, useEffect, useRef } from "react";
import { ShoppingCart, X, Plus, Minus, Truck, Leaf, ArrowRight, Check, MapPin, Phone, Mail, Package, Star, ChevronRight, ArrowLeft, Search, Calendar, Clock, Tag, Gift, MessageCircle } from "lucide-react";

const S = {
  bg: "#f7f5f0", card: "#ffffff", green: "#1e3a1e", greenLight: "#2d5a2d",
  gold: "#b8941f", goldLight: "#c8a430", text: "#1a2a1a", muted: "#7a7060",
  border: "#e5dfd0", tag: "#eef5ee", tagText: "#2d5a2d"
};

// ── CHANGE THESE ──
const WHATSAPP_NUMBER = "13400000000"; // e.g. 13405551234
const FARM_PHONE = "(340) 000-0000";
const FARM_EMAIL = "orders@francisfarms.vi";

const PROMO_CODES = {
  "FRESH10": { discount: 0.10, label: "10% off" },
  "FARM20": { discount: 0.20, label: "20% off" },
  "FIRSTORDER": { discount: 0.15, label: "15% off first order" },
};

const DELIVERY_SLOTS = ["7:00 AM – 9:00 AM", "9:00 AM – 11:00 AM", "11:00 AM – 1:00 PM", "1:00 PM – 3:00 PM", "3:00 PM – 5:00 PM"];

const DEFAULT_PRODUCTS = [
  { id: 1, name: "Farm Fresh Eggs", price: 8.00, unit: "dozen", category: "Eggs", emoji: "🥚", inStock: true, desc: "Free-range, pasture-raised. Collected daily on St. Thomas.", longDesc: "Our hens roam freely on lush green pasture, eating a natural diet. Eggs are collected every morning — the freshest egg possible. Rich golden yolks. Great for baking, frying, or boiling.", rating: 4.9, reviews: [{ name: "Maria T.", rating: 5, text: "Freshest eggs I've ever had. Yolks are so rich and golden!", date: "May 2026" }, { name: "James R.", rating: 5, text: "Best eggs on the island. My family won't eat anything else.", date: "April 2026" }], image: null },
  { id: 2, name: "Plantains", price: 3.50, unit: "bunch", category: "Fruits", emoji: "🍌", inStock: true, desc: "Ripe and green available. Perfect for tostones or sweet fry.", longDesc: "Grown on the hillsides of St. Thomas in volcanic soil. We offer both green plantains for tostones and ripe yellow plantains for sweet maduros.", rating: 4.8, reviews: [{ name: "Sandra B.", rating: 5, text: "Perfect for tostones. Always fresh and the right ripeness.", date: "May 2026" }], image: null },
  { id: 3, name: "Julie Mangoes", price: 5.00, unit: "lb", category: "Fruits", emoji: "🥭", inStock: true, desc: "Local variety. Picked at peak ripeness, never refrigerated.", longDesc: "The Julie mango is the crown jewel of Caribbean fruit. Our trees are over 20 years old, producing intensely sweet, fiber-free mangoes with a buttery texture.", rating: 5.0, reviews: [{ name: "David F.", rating: 5, text: "Nothing like a ripe Julie mango. These are the real deal.", date: "May 2026" }, { name: "Lisa M.", rating: 5, text: "I buy these every week. Absolutely incredible.", date: "April 2026" }], image: null },
  { id: 4, name: "Breadfruit", price: 4.00, unit: "each", category: "Vegetables", emoji: "🟢", inStock: true, desc: "Versatile and filling. Great roasted, fried, or boiled.", longDesc: "A Caribbean staple that can replace potato, rice, or bread in almost any dish. Our breadfruit is harvested at the perfect stage — not too young, not overripe.", rating: 4.7, reviews: [{ name: "Anthony C.", rating: 5, text: "Roasted it whole and it was perfect. Great quality.", date: "April 2026" }], image: null },
  { id: 5, name: "Sweet Peppers", price: 4.50, unit: "lb", category: "Vegetables", emoji: "🫑", inStock: true, desc: "Mixed colors, grown without pesticides on local soil.", longDesc: "Crisp, sweet, and colorful. Mixed bags include red, yellow, and green. Great raw in salads, roasted, or stuffed.", rating: 4.8, reviews: [{ name: "Rosa P.", rating: 5, text: "So fresh and crispy. Love that there are no pesticides.", date: "May 2026" }], image: null },
  { id: 6, name: "Callaloo", price: 3.00, unit: "bundle", category: "Vegetables", emoji: "🥬", inStock: true, desc: "Fresh-cut Caribbean leafy green. Harvested same morning.", longDesc: "Callaloo is the backbone of Caribbean cooking. Packed with iron and vitamins. Cut the same morning as delivery.", rating: 4.9, reviews: [{ name: "Karen W.", rating: 5, text: "Cut fresh the same day. Makes the best callaloo soup.", date: "May 2026" }], image: null },
  { id: 7, name: "Coconuts", price: 2.50, unit: "each", category: "Fruits", emoji: "🥥", inStock: true, desc: "Green drinking coconuts. Cold and ready.", longDesc: "Nothing beats a cold green coconut on a St. Thomas afternoon. Sweet, hydrating coconut water inside — then crack it open for the soft jelly meat.", rating: 4.8, reviews: [{ name: "Mike D.", rating: 5, text: "Perfect for a hot day. So refreshing and sweet.", date: "April 2026" }], image: null },
  { id: 8, name: "Herb Bundle", price: 5.50, unit: "bundle", category: "Herbs", emoji: "🌿", inStock: true, desc: "Broad leaf thyme, basil, chives, shadow beni — all local.", longDesc: "Our signature herb bundle includes broad leaf thyme, fresh basil, chives, and shadow beni. Grown in rich organic soil with no chemicals.", rating: 5.0, reviews: [{ name: "Chef Jean", rating: 5, text: "Essential for my kitchen. The broad leaf thyme is incredible.", date: "May 2026" }], image: null },
  { id: 9, name: "Vine Tomatoes", price: 4.00, unit: "lb", category: "Vegetables", emoji: "🍅", inStock: true, desc: "Vine-ripened, no wax. Picked the day of delivery.", longDesc: "We let our tomatoes ripen fully on the vine. No wax coating, no gas ripening. Pure, sun-kissed tomatoes.", rating: 4.7, reviews: [{ name: "Grace T.", rating: 5, text: "Taste like tomatoes are supposed to taste. Amazing.", date: "April 2026" }], image: null },
  { id: 10, name: "Pineapple", price: 5.00, unit: "each", category: "Fruits", emoji: "🍍", inStock: true, desc: "Sweeter than any imported variety. Caribbean gold.", longDesc: "Caribbean pineapples are a completely different fruit. Smaller, more fragrant, and intensely sweet with lower acidity.", rating: 5.0, reviews: [{ name: "Tom A.", rating: 5, text: "Best pineapple I've ever had. Nothing like the store ones.", date: "May 2026" }], image: null },
];

const CATS = ["All", "Fruits", "Vegetables", "Eggs", "Herbs"];
const DELIVERY_FEE = 10.00;
const FREE_THRESHOLD = 90;
const POINTS_PER_DOLLAR = 1;

function FieldInput({ label, value, onChange, placeholder, type = "text", required }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 11, color: S.muted, display: "block", marginBottom: 6, letterSpacing: 1.5, textTransform: "uppercase" }}>{label}{required && <span style={{ color: "#ef4444" }}> *</span>}</label>
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
  const [search, setSearch] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliverySlot, setDeliverySlot] = useState("");
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [trackingNum, setTrackingNum] = useState("");
  const [trackingResult, setTrackingResult] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", notes: "", card: "", expiry: "", cvv: "", zip: "" });
  const searchRef = useRef(null);

  useEffect(() => {
    // Load product images from Supabase Storage
    const loadProductImages = async () => {
      try {
        const SUPABASE_URL = "https://nzessbozurpqchtjkakn.supabase.co";
        const SUPABASE_ANON = "sb_publishable_bzmzo3waDgQWJSivscAUNw_Vlxk3cGt";

        // Fetch list of files from product-images bucket
        const response = await fetch(`${SUPABASE_URL}/storage/v1/object/list/product-images`, {
          headers: { 'Authorization': `Bearer ${SUPABASE_ANON}` }
        });

        if (response.ok) {
          const files = await response.json();

          // Map files to products by matching "product-{id}.{ext}" pattern
          const imageMap = {};
          files.forEach(file => {
            const match = file.name.match(/^product-(\d+)\./);
            if (match) {
              const productId = parseInt(match[1]);
              imageMap[productId] = `${SUPABASE_URL}/storage/v1/object/public/product-images/${file.name}`;
            }
          });

          // Update products with image URLs from Supabase
          setProducts(prev => prev.map(p => ({
            ...p,
            image: imageMap[p.id] || p.image
          })));
        }
      } catch (e) {
        console.log('Could not load product images from Supabase:', e);
      }
    };

    // Load localStorage overrides for price/stock from admin
    try {
      const saved = localStorage.getItem("ff_products");
      if (saved) {
        const overrides = JSON.parse(saved);
        setProducts(prev => prev.map(p => {
          const o = overrides.find(x => x.id === p.id);
          return o ? { ...p, price: o.price, inStock: o.inStock, unit: o.unit } : p;
        }));
      }
      const pts = localStorage.getItem("ff_loyalty_points");
      if (pts) setLoyaltyPoints(parseInt(pts));
    } catch (e) {}

    // Load images from Supabase
    loadProductImages();

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Inter:wght@400;500;600&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `
      * { font-family: 'Inter', sans-serif; }
      .disp { font-family: 'Playfair Display', Georgia, serif !important; }
      @keyframes fadeUp { from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);} }
      @keyframes slideIn { from{transform:translateX(100%);}to{transform:translateX(0);} }
      @keyframes slideUp { from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);} }
      @keyframes spin { to{transform:rotate(360deg);} }
      @keyframes pulse { 0%,100%{transform:scale(1);}50%{transform:scale(1.08);} }
      .fade-up{animation:fadeUp 0.45s ease forwards;}
      .cart-slide{animation:slideIn 0.28s ease;}
      .slide-up{animation:slideUp 0.35s ease forwards;}
      .prod-card{transition:all 0.22s ease;cursor:pointer;}
      .prod-card:hover{transform:translateY(-4px);box-shadow:0 12px 28px rgba(30,58,30,0.12)!important;}
      .btn-green{transition:all 0.2s ease;}
      .btn-green:hover{background:#2d5a2d!important;transform:translateY(-1px);}
      .whatsapp-btn{animation:pulse 2.5s ease infinite;}
      .whatsapp-btn:hover{animation:none;transform:scale(1.1);}
      ::placeholder{color:#c5bfb0;}
      ::-webkit-scrollbar{width:4px;}
      ::-webkit-scrollbar-thumb{background:#d5cfc0;border-radius:2px;}
    `;
    document.head.appendChild(style);
  }, []);

  const addToCart = (p) => setCart(prev => { const ex = prev.find(i => i.id === p.id); if (ex) return prev.map(i => i.id === p.id ? {...i, qty: i.qty+1} : i); return [...prev, {...p, qty:1}]; });
  const updateQty = (id, d) => setCart(prev => prev.map(i => i.id===id ? {...i, qty:Math.max(0,i.qty+d)} : i).filter(i => i.qty>0));

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = subtotal >= FREE_THRESHOLD ? 0 : DELIVERY_FEE;
  const discount = promoApplied ? subtotal * promoApplied.discount : 0;
  const total = subtotal + delivery - discount;
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const pointsEarned = Math.floor(total * POINTS_PER_DOLLAR);

  const filtered = products
    .filter(p => p.inStock)
    .filter(p => category === "All" || p.category === category)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  const setF = (k, v) => setForm(prev => ({...prev, [k]: v}));

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setPromoApplied(PROMO_CODES[code]);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code");
      setTimeout(() => setPromoError(""), 2000);
    }
  };

  const getTodayDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const placeOrder = async () => {
    if (!deliveryDate || !deliverySlot) { alert("Please select a delivery date and time slot."); return; }
    if (!form.name || !form.address) { alert("Please fill in your name and address."); return; }

    setProcessing(true);

    try {
      const num = "FF-" + Math.floor(10000 + Math.random() * 90000);

      const orderData = {
        id: num,
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        items: cart.map(item => ({
          name: item.name,
          qty: item.qty,
          price: item.price,
        })),
        subtotal: subtotal,
        delivery: delivery,
        status: 'pending',
        deliveryDate: deliveryDate,
        deliverySlot: deliverySlot,
        notes: form.notes,
      };

      // Send order confirmation and save to Supabase
      const confirmRes = await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderData }),
      });

      if (!confirmRes.ok) {
        throw new Error('Failed to save order');
      }

      // Send SMS notification
      await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderData }),
      });

      setOrderNum(num);
      const newPoints = loyaltyPoints + pointsEarned;
      setLoyaltyPoints(newPoints);
      try { localStorage.setItem("ff_loyalty_points", newPoints); } catch(e){}

      setPage("confirmation");
      setCart([]);
      setPromoApplied(null);
      setPromoCode("");
      setForm({ name: "", email: "", phone: "", address: "", notes: "", card: "", expiry: "", cvv: "", zip: "" });
    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an error placing your order. Please try again or contact us via WhatsApp.');
    } finally {
      setProcessing(false);
    }
  };

  const trackOrder = () => {
    if (!trackingNum.trim()) return;
    setTrackingResult({
      id: trackingNum.toUpperCase(),
      status: "preparing",
      steps: [
        { label: "Order Placed", done: true, time: "9:00 AM" },
        { label: "Being Prepared", done: true, time: "9:30 AM" },
        { label: "Out for Delivery", done: false, time: "—" },
        { label: "Delivered", done: false, time: "—" },
      ]
    });
  };

  const whatsappMessage = () => {
    const items = cart.map(i => `${i.name} x${i.qty}`).join(", ");
    const msg = cart.length > 0
      ? `Hi Francis Farms! I'd like to order: ${items}. Total: $${total.toFixed(2)}`
      : `Hi Francis Farms! I'd like to place an order.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  const NavBar = () => (
    <nav style={{ position:"sticky", top:0, zIndex:100, display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 28px", background:"rgba(247,245,240,0.96)", backdropFilter:"blur(12px)", borderBottom:`1px solid ${S.border}`, boxShadow:"0 1px 10px rgba(30,58,30,0.07)" }}>
      <div onClick={() => { setPage("shop"); setSelectedProduct(null); }} style={{ display:"flex", alignItems:"center", gap:11, cursor:"pointer" }}>
        <div style={{ width:36, height:36, background:S.green, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}><Leaf size={17} color="#fff" /></div>
        <div>
          <div className="disp" style={{ fontSize:20, fontWeight:700, color:S.green, lineHeight:1.1 }}>Francis Farms</div>
          <div style={{ fontSize:10, color:S.muted, letterSpacing:1.5, textTransform:"uppercase" }}>St. Thomas, USVI</div>
        </div>
      </div>
      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
        {loyaltyPoints > 0 && (
          <div style={{ display:"flex", alignItems:"center", gap:5, background:S.tag, border:`1px solid #c5dcc5`, borderRadius:50, padding:"6px 12px" }}>
            <Gift size={12} color={S.tagText} />
            <span style={{ fontSize:12, color:S.tagText, fontWeight:600 }}>{loyaltyPoints} pts</span>
          </div>
        )}
        {(page !== "shop" || selectedProduct) && (
          <button onClick={() => { setPage("shop"); setSelectedProduct(null); }} style={{ background:"none", border:"none", color:S.muted, cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", gap:4 }}>
            <ArrowLeft size={14} /> Shop
          </button>
        )}
        <button onClick={() => setCartOpen(true)} style={{ background:S.card, border:`1.5px solid ${S.border}`, borderRadius:10, padding:"8px 18px", color:S.green, cursor:"pointer", display:"flex", alignItems:"center", gap:7, fontSize:14, fontWeight:500 }}>
          <ShoppingCart size={15} />
          Cart
          {cartCount > 0 && <span style={{ background:S.green, color:"#fff", borderRadius:"50%", width:18, height:18, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700 }}>{cartCount}</span>}
        </button>
      </div>
    </nav>
  );

  // ── PRODUCT DETAIL ──
  if (selectedProduct) {
    const p = selectedProduct;
    const inCart = cart.find(i => i.id === p.id);
    return (
      <div style={{ background:S.bg, minHeight:"100vh" }}>
        <NavBar />
        <div className="slide-up" style={{ maxWidth:900, margin:"0 auto", padding:"40px 24px 80px" }}>
          <button onClick={() => setSelectedProduct(null)} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", color:S.muted, cursor:"pointer", fontSize:14, marginBottom:28 }}>
            <ArrowLeft size={14} /> Back to shop
          </button>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:40, marginBottom:48 }}>
            <div style={{ background:S.card, borderRadius:20, border:`1px solid ${S.border}`, display:"flex", alignItems:"center", justifyContent:"center", minHeight:320, overflow:"hidden" }}>
              {p.image ? <img src={p.image} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <span style={{ fontSize:100 }}>{p.emoji}</span>}
            </div>
            <div style={{ display:"flex", flexDirection:"column", justifyContent:"center" }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:S.tag, border:"1px solid #c5dcc5", borderRadius:50, padding:"4px 12px", marginBottom:14, width:"fit-content" }}>
                <span style={{ fontSize:11, color:S.tagText, fontWeight:500, letterSpacing:1.5, textTransform:"uppercase" }}>{p.category}</span>
              </div>
              <h1 className="disp" style={{ fontSize:38, fontWeight:700, color:S.green, lineHeight:1.15, marginBottom:12 }}>{p.name}</h1>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
                {[...Array(5)].map((_,i) => <Star key={i} size={14} fill={S.gold} color={S.gold} />)}
                <span style={{ fontSize:13, color:S.gold, fontWeight:600 }}>{p.rating}</span>
                <span style={{ fontSize:13, color:S.muted }}>({p.reviews.length} reviews)</span>
              </div>
              <p style={{ fontSize:15, color:S.muted, lineHeight:1.8, marginBottom:28 }}>{p.longDesc}</p>
              <div style={{ marginBottom:28 }}>
                <span className="disp" style={{ fontSize:38, fontWeight:700, color:S.green }}>${p.price.toFixed(2)}</span>
                <span style={{ fontSize:14, color:S.muted, marginLeft:6 }}>/ {p.unit}</span>
              </div>
              {inCart ? (
                <div style={{ display:"flex", alignItems:"center", gap:16, background:S.card, border:`1.5px solid ${S.border}`, borderRadius:12, padding:"12px 16px", width:"fit-content" }}>
                  <button onClick={() => updateQty(p.id,-1)} style={{ width:32, height:32, borderRadius:"50%", border:`1.5px solid ${S.border}`, background:"none", color:S.green, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Minus size={14} /></button>
                  <span style={{ fontSize:18, fontWeight:700, color:S.green, minWidth:24, textAlign:"center" }}>{inCart.qty}</span>
                  <button onClick={() => updateQty(p.id,1)} style={{ width:32, height:32, borderRadius:"50%", border:`1.5px solid ${S.border}`, background:"none", color:S.green, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Plus size={14} /></button>
                  <span style={{ fontSize:14, color:S.muted }}>in cart · ${(p.price*inCart.qty).toFixed(2)}</span>
                </div>
              ) : (
                <button onClick={() => addToCart(p)} className="btn-green" style={{ background:S.green, color:"#fff", border:"none", borderRadius:12, padding:"14px 32px", fontSize:15, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:8, width:"fit-content" }}>
                  <Plus size={16} /> Add to Cart
                </button>
              )}
              <div style={{ marginTop:20, padding:"12px 16px", background:S.tag, borderRadius:10, fontSize:12, color:S.tagText }}>
                🌿 Earn {Math.ceil(p.price)} loyalty points with this purchase
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="disp" style={{ fontSize:28, color:S.green, marginBottom:20 }}>Customer Reviews</h2>
            <div style={{ display:"grid", gap:16 }}>
              {p.reviews.map((r, i) => (
                <div key={i} style={{ background:S.card, borderRadius:14, padding:20, border:`1px solid ${S.border}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600, color:S.text, marginBottom:4 }}>{r.name}</div>
                      <div style={{ display:"flex", gap:2 }}>{[...Array(r.rating)].map((_,j) => <Star key={j} size={12} fill={S.gold} color={S.gold} />)}</div>
                    </div>
                    <span style={{ fontSize:12, color:S.muted }}>{r.date}</span>
                  </div>
                  <p style={{ fontSize:14, color:S.muted, lineHeight:1.65 }}>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* WhatsApp float */}
        <a href={whatsappMessage()} target="_blank" rel="noreferrer" className="whatsapp-btn" style={{ position:"fixed", bottom:28, right:28, width:56, height:56, background:"#25D366", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 20px rgba(37,211,102,0.4)", zIndex:200, textDecoration:"none" }}>
          <MessageCircle size={24} color="#fff" fill="#fff" />
        </a>
      </div>
    );
  }

  return (
    <div style={{ background:S.bg, minHeight:"100vh", color:S.text }}>
      <NavBar />

      {/* ═══ SHOP ═══ */}
      {page === "shop" && (
        <div>
          <div className="fade-up" style={{ padding:"64px 28px 52px", textAlign:"center", background:"linear-gradient(170deg,#eaf4ea 0%,#f7f5f0 100%)", borderBottom:`1px solid ${S.border}` }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:S.tag, border:"1px solid #c5dcc5", borderRadius:50, padding:"6px 16px", marginBottom:22 }}>
              <Leaf size={12} color={S.tagText} />
              <span style={{ fontSize:11, color:S.tagText, letterSpacing:2.5, textTransform:"uppercase", fontWeight:500 }}>Fresh · Local · Delivered</span>
            </div>
            <h1 className="disp" style={{ fontSize:"clamp(38px,7vw,66px)", fontWeight:700, color:S.green, lineHeight:1.1, marginBottom:18 }}>
              Farm-Fresh Produce<br /><em style={{ color:S.goldLight }}>Delivered to You</em>
            </h1>
            <p style={{ color:S.muted, fontSize:16, maxWidth:400, margin:"0 auto 28px", lineHeight:1.8 }}>Grown on St. Thomas. Picked fresh. Delivered the same day.</p>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <a href="/about" style={{ padding:"10px 24px", borderRadius:50, background:S.green, color:"#fff", fontSize:13, fontWeight:600, textDecoration:"none" }}>About the Farm</a>
              <button onClick={() => setPage("track")} style={{ padding:"10px 24px", borderRadius:50, background:"none", border:`1.5px solid ${S.border}`, color:S.green, fontSize:13, fontWeight:600, cursor:"pointer" }}>Track Order</button>
            </div>
          </div>

          <div style={{ background:S.green, display:"flex", justifyContent:"center", gap:36, flexWrap:"wrap", padding:"13px 24px" }}>
            {[[<Truck size={13} />, `Free delivery over $${FREE_THRESHOLD}`],[<Leaf size={13} />, "No pesticides · No wax"],[<Check size={13} />, "Same-day delivery, Mon–Sat"],[<Gift size={13} />, "Earn loyalty points every order"]].map(([icon,text]) => (
              <div key={text} style={{ display:"flex", alignItems:"center", gap:7 }}>
                <span style={{ color:"#a8d8a8" }}>{icon}</span>
                <span style={{ fontSize:12, color:"#d0ead0" }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Search */}
          <div style={{ padding:"20px 28px 0" }}>
            <div style={{ position:"relative", maxWidth:400 }}>
              <Search size={16} color={S.muted} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)" }} />
              <input ref={searchRef} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ width:"100%", padding:"11px 14px 11px 40px", borderRadius:50, border:`1.5px solid ${S.border}`, background:S.card, color:S.text, fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit" }} />
            </div>
          </div>

          {/* Category pills */}
          <div style={{ display:"flex", gap:8, padding:"16px 28px 14px", overflowX:"auto" }}>
            {CATS.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{ padding:"8px 20px", borderRadius:50, border:`1.5px solid ${category===cat ? S.green : S.border}`, background:category===cat ? S.green : S.card, color:category===cat ? "#fff" : S.muted, fontSize:13, fontWeight:500, cursor:"pointer", whiteSpace:"nowrap", transition:"all 0.2s" }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Products */}
          {filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px 0", color:S.muted }}>
              <Package size={40} style={{ margin:"0 auto 14px", display:"block", opacity:0.3 }} />
              <p>No products found for "{search}"</p>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(255px,1fr))", gap:16, padding:"8px 28px 36px" }}>
              {filtered.map(p => (
                <div key={p.id} className="prod-card" onClick={() => setSelectedProduct(p)} style={{ background:S.card, borderRadius:16, padding:24, border:`1px solid ${S.border}`, boxShadow:"0 2px 8px rgba(30,58,30,0.05)" }}>
                  <div style={{ marginBottom:14, height:80, display:"flex", alignItems:"center" }}>
                    {p.image ? <img src={p.image} alt={p.name} style={{ width:80, height:80, objectFit:"cover", borderRadius:12 }} /> : <span style={{ fontSize:56 }}>{p.emoji}</span>}
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:7 }}>
                    <h3 className="disp" style={{ fontSize:20, fontWeight:700, color:S.green, lineHeight:1.2 }}>{p.name}</h3>
                    <div style={{ display:"flex", gap:3, alignItems:"center", marginLeft:8, flexShrink:0 }}>
                      <Star size={11} fill={S.gold} color={S.gold} />
                      <span style={{ fontSize:11, color:S.gold, fontWeight:600 }}>{p.rating}</span>
                    </div>
                  </div>
                  <p style={{ fontSize:13, color:S.muted, lineHeight:1.65, marginBottom:18 }}>{p.desc}</p>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <span className="disp" style={{ fontSize:25, fontWeight:700, color:S.green }}>${p.price.toFixed(2)}</span>
                      <span style={{ fontSize:12, color:S.muted, marginLeft:4 }}>/ {p.unit}</span>
                    </div>
                    <button onClick={e => { e.stopPropagation(); addToCart(p); }} className="btn-green" style={{ background:S.green, color:"#fff", border:"none", borderRadius:10, padding:"9px 18px", fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
                      <Plus size={13} /> Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Map */}
          <div style={{ padding:"0 28px 56px" }}>
            <div style={{ background:S.card, borderRadius:20, border:`1px solid ${S.border}`, overflow:"hidden", boxShadow:"0 2px 16px rgba(30,58,30,0.08)" }}>
              <div style={{ padding:"26px 28px 18px", display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:40, height:40, background:S.tag, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><MapPin size={18} color={S.green} /></div>
                <div>
                  <h3 className="disp" style={{ fontSize:24, fontWeight:700, color:S.green, marginBottom:2 }}>Find Us</h3>
                  <p style={{ fontSize:13, color:S.muted }}>Near Cost U Less · Weymouth Rhymer Hwy, St. Thomas</p>
                </div>
              </div>
              <iframe title="Francis Farms Location" src="https://maps.google.com/maps?q=18.3485,-64.9312&t=&z=15&ie=UTF8&iwloc=&output=embed" width="100%" height="340" style={{ border:0, display:"block" }} allowFullScreen loading="lazy" />
              <div style={{ padding:"16px 28px", borderTop:`1px solid ${S.border}`, display:"flex", gap:24, flexWrap:"wrap" }}>
                {[[<Phone size={13} />, FARM_PHONE],[<Mail size={13} />, FARM_EMAIL],[<Truck size={13} />, "Mon – Sat · 7 AM – 5 PM"]].map(([icon,text]) => (
                  <div key={text} style={{ display:"flex", alignItems:"center", gap:7 }}><span style={{ color:S.green }}>{icon}</span><span style={{ fontSize:13, color:S.muted }}>{text}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TRACK ORDER ═══ */}
      {page === "track" && (
        <div className="fade-up" style={{ maxWidth:560, margin:"0 auto", padding:"60px 24px" }}>
          <h2 className="disp" style={{ fontSize:42, color:S.green, marginBottom:8 }}>Track Your Order</h2>
          <p style={{ color:S.muted, marginBottom:36 }}>Enter your order number to see the status.</p>
          <div style={{ display:"flex", gap:10, marginBottom:32 }}>
            <input value={trackingNum} onChange={e => setTrackingNum(e.target.value)} onKeyDown={e => e.key==="Enter" && trackOrder()} placeholder="e.g. FF-10482" style={{ flex:1, padding:"12px 16px", borderRadius:10, border:`1.5px solid ${S.border}`, background:S.card, color:S.text, fontSize:15, outline:"none", fontFamily:"inherit" }} />
            <button onClick={trackOrder} className="btn-green" style={{ background:S.green, color:"#fff", border:"none", borderRadius:10, padding:"12px 24px", fontSize:14, fontWeight:600, cursor:"pointer" }}>Track</button>
          </div>
          {trackingResult && (
            <div style={{ background:S.card, borderRadius:16, border:`1px solid ${S.border}`, padding:28 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
                <span className="disp" style={{ fontSize:22, color:S.green }}>{trackingResult.id}</span>
                <span style={{ background:S.tag, color:S.tagText, padding:"4px 12px", borderRadius:50, fontSize:12, fontWeight:600, textTransform:"capitalize" }}>{trackingResult.status}</span>
              </div>
              <div style={{ position:"relative" }}>
                {trackingResult.steps.map((step, i) => (
                  <div key={i} style={{ display:"flex", gap:16, marginBottom:i < trackingResult.steps.length-1 ? 24 : 0, alignItems:"flex-start" }}>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                      <div style={{ width:32, height:32, borderRadius:"50%", background:step.done ? S.green : S.border, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {step.done ? <Check size={16} color="#fff" /> : <div style={{ width:10, height:10, borderRadius:"50%", background:"#fff" }} />}
                      </div>
                      {i < trackingResult.steps.length-1 && <div style={{ width:2, height:32, background:step.done ? S.green : S.border, marginTop:4 }} />}
                    </div>
                    <div style={{ paddingTop:4 }}>
                      <div style={{ fontSize:14, fontWeight:600, color:step.done ? S.text : S.muted }}>{step.label}</div>
                      <div style={{ fontSize:12, color:S.muted }}>{step.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ CHECKOUT ═══ */}
      {page === "checkout" && (
        <div className="fade-up" style={{ maxWidth:900, margin:"0 auto", padding:"40px 20px 80px" }}>
          <h2 className="disp" style={{ fontSize:42, color:S.green, marginBottom:36 }}>Checkout</h2>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:28 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              {/* Delivery info */}
              <div style={{ background:S.card, borderRadius:16, padding:24, border:`1px solid ${S.border}` }}>
                <h3 className="disp" style={{ fontSize:24, color:S.green, marginBottom:20 }}>Delivery Details</h3>
                <FieldInput label="Full Name" value={form.name} onChange={v=>setF("name",v)} placeholder="Your name" required />
                <FieldInput label="Phone" value={form.phone} onChange={v=>setF("phone",v)} placeholder="+1 (340) 000-0000" required />
                <FieldInput label="Email" value={form.email} onChange={v=>setF("email",v)} placeholder="you@email.com" type="email" required />
                <FieldInput label="Delivery Address" value={form.address} onChange={v=>setF("address",v)} placeholder="Street address, St. Thomas" required />
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:11, color:S.muted, display:"block", marginBottom:6, letterSpacing:1.5, textTransform:"uppercase" }}>Notes</label>
                  <textarea value={form.notes} onChange={e=>setF("notes",e.target.value)} placeholder="Gate code, landmark, special instructions..." rows={2} style={{ width:"100%", background:S.bg, border:`1.5px solid ${S.border}`, borderRadius:10, padding:"11px 14px", color:S.text, fontSize:14, resize:"none", outline:"none", boxSizing:"border-box", fontFamily:"inherit" }} />
                </div>
              </div>

              {/* Scheduled delivery */}
              <div style={{ background:S.card, borderRadius:16, padding:24, border:`1px solid ${S.border}` }}>
                <h3 className="disp" style={{ fontSize:22, color:S.green, marginBottom:18, display:"flex", alignItems:"center", gap:8 }}>
                  <Calendar size={18} /> Delivery Schedule
                </h3>
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:11, color:S.muted, display:"block", marginBottom:6, letterSpacing:1.5, textTransform:"uppercase" }}>Delivery Date <span style={{ color:"#ef4444" }}>*</span></label>
                  <input type="date" value={deliveryDate} min={getTodayDate()} onChange={e=>setDeliveryDate(e.target.value)} style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1.5px solid ${S.border}`, background:S.bg, color:S.text, fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit" }} />
                </div>
                <div>
                  <label style={{ fontSize:11, color:S.muted, display:"block", marginBottom:8, letterSpacing:1.5, textTransform:"uppercase" }}>Time Slot <span style={{ color:"#ef4444" }}>*</span></label>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    {DELIVERY_SLOTS.map(slot => (
                      <button key={slot} onClick={() => setDeliverySlot(slot)} style={{ padding:"9px 12px", borderRadius:8, border:`1.5px solid ${deliverySlot===slot ? S.green : S.border}`, background:deliverySlot===slot ? S.tag : "transparent", color:deliverySlot===slot ? S.green : S.muted, fontSize:12, fontWeight:deliverySlot===slot ? 600 : 400, cursor:"pointer", transition:"all 0.15s", display:"flex", alignItems:"center", gap:5 }}>
                        <Clock size={11} /> {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div style={{ background:S.card, borderRadius:16, padding:24, border:`1px solid ${S.border}` }}>
                <h3 className="disp" style={{ fontSize:22, color:S.green, marginBottom:4 }}>Payment</h3>
                <p style={{ fontSize:12, color:S.muted, marginBottom:20 }}>Secured by Stripe · 256-bit SSL</p>
                <FieldInput label="Card Number" value={form.card} onChange={v=>setF("card",v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim())} placeholder="1234 5678 9012 3456" />
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
                  <FieldInput label="Expiry" value={form.expiry} onChange={v=>setF("expiry",v)} placeholder="MM/YY" />
                  <FieldInput label="CVV" value={form.cvv} onChange={v=>setF("cvv",v.replace(/\D/g,"").slice(0,4))} placeholder="•••" />
                  <FieldInput label="ZIP" value={form.zip} onChange={v=>setF("zip",v)} placeholder="00801" />
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div>
              <div style={{ background:S.card, borderRadius:16, padding:24, border:`1px solid ${S.border}`, position:"sticky", top:80 }}>
                <h3 className="disp" style={{ fontSize:24, color:S.green, marginBottom:20 }}>Order Summary</h3>
                <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:16 }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display:"flex", justifyContent:"space-between" }}>
                      <div><div style={{ fontSize:14 }}>{item.emoji} {item.name}</div><div style={{ fontSize:12, color:S.muted }}>×{item.qty} {item.unit}</div></div>
                      <span style={{ fontSize:14, fontWeight:500 }}>${(item.price*item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Promo code */}
                <div style={{ marginBottom:16 }}>
                  <div style={{ display:"flex", gap:8 }}>
                    <div style={{ position:"relative", flex:1 }}>
                      <Tag size={13} color={S.muted} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)" }} />
                      <input value={promoCode} onChange={e=>setPromoCode(e.target.value.toUpperCase())} placeholder="Promo code" style={{ width:"100%", padding:"9px 10px 9px 30px", borderRadius:8, border:`1.5px solid ${promoApplied ? S.green : promoError ? "#ef4444" : S.border}`, background:S.bg, color:S.text, fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:"inherit" }} />
                    </div>
                    <button onClick={applyPromo} style={{ padding:"9px 16px", borderRadius:8, border:"none", background:S.green, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }}>Apply</button>
                  </div>
                  {promoApplied && <p style={{ fontSize:12, color:S.greenLight, marginTop:6 }}>✓ {promoApplied.label} applied!</p>}
                  {promoError && <p style={{ fontSize:12, color:"#ef4444", marginTop:6 }}>{promoError}</p>}
                </div>

                <div style={{ borderTop:`1px solid ${S.border}`, paddingTop:16 }}>
                  {[["Subtotal", `$${subtotal.toFixed(2)}`],["Delivery", delivery===0 ? "FREE" : `$${delivery.toFixed(2)}`],...(promoApplied ? [["Discount", `-$${discount.toFixed(2)}`]] : [])].map(([l,v]) => (
                    <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                      <span style={{ fontSize:13, color:S.muted }}>{l}</span>
                      <span style={{ fontSize:13, fontWeight:500, color: l==="Discount" ? S.greenLight : (l==="Delivery"&&delivery===0) ? S.greenLight : S.text }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:14, paddingTop:14, borderTop:`1px solid ${S.border}` }}>
                    <span className="disp" style={{ fontSize:22, color:S.green }}>Total</span>
                    <span className="disp" style={{ fontSize:28, fontWeight:700, color:S.green }}>${total.toFixed(2)}</span>
                  </div>
                  <div style={{ marginTop:10, padding:"8px 12px", background:S.tag, borderRadius:8, fontSize:12, color:S.tagText }}>
                    🎁 You'll earn {pointsEarned} loyalty points on this order
                  </div>
                </div>
                <button onClick={placeOrder} disabled={processing || !form.name || !form.address || !deliveryDate || !deliverySlot} className="btn-green" style={{ width:"100%", background:S.green, color:"#fff", border:"none", borderRadius:12, padding:15, fontSize:15, fontWeight:600, cursor:processing?"wait":"pointer", marginTop:20, opacity:(!form.name||!form.address||!deliveryDate||!deliverySlot)?0.4:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                  {processing ? <><span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.35)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"spin 0.7s linear infinite" }} />Processing...</> : <>Place Order · ${total.toFixed(2)} <ChevronRight size={15} /></>}
                </button>
                <a href={whatsappMessage()} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginTop:12, padding:"12px", borderRadius:12, border:`1.5px solid #25D366`, color:"#128C7E", fontSize:14, fontWeight:600, textDecoration:"none" }}>
                  <MessageCircle size={16} /> Order via WhatsApp instead
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ CONFIRMATION ═══ */}
      {page === "confirmation" && (
        <div style={{ minHeight:"80vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div className="fade-up" style={{ textAlign:"center", maxWidth:480 }}>
            <div style={{ width:80, height:80, background:S.tag, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}>
              <Check size={34} color={S.green} />
            </div>
            <h2 className="disp" style={{ fontSize:52, color:S.green, marginBottom:10 }}>Order Placed!</h2>
            <p style={{ color:S.muted, fontSize:15, lineHeight:1.8, marginBottom:20 }}>Your fresh produce is being prepared.<br />A confirmation will be sent to your phone and email.</p>
            <div style={{ background:S.card, border:`1px solid ${S.border}`, borderRadius:16, padding:22, marginBottom:16 }}>
              <div style={{ fontSize:11, color:S.muted, letterSpacing:2.5, textTransform:"uppercase", marginBottom:6 }}>Order Number</div>
              <div className="disp" style={{ fontSize:34, fontWeight:700, color:S.green }}>{orderNum}</div>
            </div>
            <div style={{ background:S.tag, border:"1px solid #c5dcc5", borderRadius:12, padding:"14px 20px", marginBottom:24 }}>
              <div style={{ fontSize:14, color:S.tagText, fontWeight:600 }}>🎁 +{pointsEarned} loyalty points earned!</div>
              <div style={{ fontSize:13, color:S.muted, marginTop:2 }}>Total balance: {loyaltyPoints} points</div>
            </div>
            <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:24, flexWrap:"wrap" }}>
              <button onClick={() => setPage("track")} style={{ display:"flex", alignItems:"center", gap:7, padding:"9px 18px", background:S.card, border:`1px solid ${S.border}`, borderRadius:50, fontSize:13, color:S.green, cursor:"pointer", fontWeight:500 }}>
                <MapPin size={13} /> Track Order
              </button>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", gap:7, padding:"9px 18px", background:S.card, border:"1px solid #25D366", borderRadius:50, fontSize:13, color:"#128C7E", textDecoration:"none", fontWeight:500 }}>
                <MessageCircle size={13} /> WhatsApp Us
              </a>
            </div>
            <button onClick={() => setPage("shop")} className="btn-green" style={{ background:S.green, color:"#fff", border:"none", borderRadius:12, padding:"14px 36px", fontSize:14, fontWeight:600, cursor:"pointer" }}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* ═══ CART SIDEBAR ═══ */}
      {cartOpen && (
        <div style={{ position:"fixed", inset:0, zIndex:200 }}>
          <div onClick={() => setCartOpen(false)} style={{ position:"absolute", inset:0, background:"rgba(30,58,30,0.3)" }} />
          <div className="cart-slide" style={{ position:"absolute", right:0, top:0, bottom:0, width:"min(390px,100vw)", background:S.card, borderLeft:`1px solid ${S.border}`, display:"flex", flexDirection:"column", boxShadow:"-8px 0 32px rgba(30,58,30,0.12)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 24px", borderBottom:`1px solid ${S.border}` }}>
              <span className="disp" style={{ fontSize:26, fontWeight:700, color:S.green }}>Your Cart</span>
              <button onClick={() => setCartOpen(false)} style={{ background:"none", border:"none", color:S.muted, cursor:"pointer" }}><X size={20} /></button>
            </div>
            <div style={{ flex:1, overflowY:"auto", padding:"16px 24px" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign:"center", padding:"60px 0" }}>
                  <Package size={38} color={S.border} style={{ margin:"0 auto 14px", display:"block" }} />
                  <p style={{ color:S.muted, fontSize:14 }}>Your cart is empty</p>
                </div>
              ) : cart.map(item => (
                <div key={item.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:`1px solid ${S.border}` }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:500, marginBottom:2 }}>{item.emoji} {item.name}</div>
                    <div style={{ fontSize:13, color:S.green, fontWeight:600 }}>${(item.price*item.qty).toFixed(2)}</div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                    <button onClick={() => updateQty(item.id,-1)} style={{ width:28, height:28, borderRadius:"50%", border:`1.5px solid ${S.border}`, background:"none", color:S.green, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Minus size={12} /></button>
                    <span style={{ fontSize:14, fontWeight:600, minWidth:20, textAlign:"center" }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id,1)} style={{ width:28, height:28, borderRadius:"50%", border:`1.5px solid ${S.border}`, background:"none", color:S.green, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Plus size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div style={{ padding:"20px 24px", borderTop:`1px solid ${S.border}` }}>
                {delivery > 0 && <p style={{ fontSize:12, color:S.muted, marginBottom:10, textAlign:"center" }}>Add ${(FREE_THRESHOLD-subtotal).toFixed(2)} more for free delivery</p>}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                  <span style={{ color:S.muted, fontSize:14 }}>Subtotal</span>
                  <span className="disp" style={{ fontSize:24, fontWeight:700, color:S.green }}>${subtotal.toFixed(2)}</span>
                </div>
                <button onClick={() => { setCartOpen(false); setPage("checkout"); }} className="btn-green" style={{ width:"100%", background:S.green, color:"#fff", border:"none", borderRadius:12, padding:14, fontSize:15, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginBottom:8 }}>
                  Checkout <ArrowRight size={15} />
                </button>
                <a href={whatsappMessage()} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"12px", borderRadius:12, border:"1.5px solid #25D366", color:"#128C7E", fontSize:13, fontWeight:600, textDecoration:"none" }}>
                  <MessageCircle size={14} /> Order via WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* WhatsApp float button */}
      {page === "shop" && !selectedProduct && (
        <a href={whatsappMessage()} target="_blank" rel="noreferrer" className="whatsapp-btn" style={{ position:"fixed", bottom:28, right:28, width:56, height:56, background:"#25D366", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 20px rgba(37,211,102,0.4)", zIndex:200, textDecoration:"none" }}>
          <MessageCircle size={24} color="#fff" fill="#fff" />
        </a>
      )}
    </div>
  );
}
