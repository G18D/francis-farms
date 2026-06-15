"use client";
import { useState, useEffect, useRef } from "react";

// ── CONFIG ──────────────────────────────────────────────────
const ADMIN_PASSWORD = "francis2024"; // Change before going live

// 🔌 SUPABASE — paste your project URL and anon key here
const SUPABASE_URL  = ""; // e.g. https://xxxx.supabase.co
const SUPABASE_ANON = ""; // your anon/public key
const STORAGE_BUCKET = "product-images";
// ────────────────────────────────────────────────────────────

const DEFAULT_PRODUCTS = [
  { id:1,  name:"Farm Fresh Eggs",  price:8.00,  unit:"dozen",  category:"Eggs",       emoji:"🥚", inStock:true, image:null },
  { id:2,  name:"Plantains",        price:3.50,  unit:"bunch",  category:"Fruits",     emoji:"🍌", inStock:true, image:null },
  { id:3,  name:"Julie Mangoes",    price:5.00,  unit:"lb",     category:"Fruits",     emoji:"🥭", inStock:true, image:null },
  { id:4,  name:"Breadfruit",       price:4.00,  unit:"each",   category:"Vegetables", emoji:"🟢", inStock:true, image:null },
  { id:5,  name:"Sweet Peppers",    price:4.50,  unit:"lb",     category:"Vegetables", emoji:"🫑", inStock:true, image:null },
  { id:6,  name:"Callaloo",         price:3.00,  unit:"bundle", category:"Vegetables", emoji:"🥬", inStock:true, image:null },
  { id:7,  name:"Coconuts",         price:2.50,  unit:"each",   category:"Fruits",     emoji:"🥥", inStock:true, image:null },
  { id:8,  name:"Herb Bundle",      price:5.50,  unit:"bundle", category:"Herbs",      emoji:"🌿", inStock:true, image:null },
  { id:9,  name:"Vine Tomatoes",    price:4.00,  unit:"lb",     category:"Vegetables", emoji:"🍅", inStock:true, image:null },
  { id:10, name:"Pineapple",        price:5.00,  unit:"each",   category:"Fruits",     emoji:"🍍", inStock:true, image:null },
];

const SAMPLE_ORDERS = [
  { id:"FF-10495", name:"Maria Thomas",    phone:"(340) 514-2201", email:"maria@email.com",   address:"14 Crown Bay, St. Thomas",    items:[{name:"Farm Fresh Eggs",qty:2,price:8.00},{name:"Callaloo",qty:3,price:3.00}],          subtotal:25.00, delivery:10.00, status:"pending",   date:"2026-05-16", slot:"9AM–11AM",  notes:"Leave at gate" },
  { id:"FF-10494", name:"James Rivera",    phone:"(340) 227-8834", email:"james@email.com",   address:"8 Raphune Hill, St. Thomas",  items:[{name:"Julie Mangoes",qty:4,price:5.00},{name:"Plantains",qty:2,price:3.50}],           subtotal:27.00, delivery:10.00, status:"preparing", date:"2026-05-16", slot:"7AM–9AM",   notes:"" },
  { id:"FF-10493", name:"Sandra Baptiste", phone:"(340) 643-9901", email:"sandra@email.com",  address:"22 Frenchtown, St. Thomas",   items:[{name:"Herb Bundle",qty:1,price:5.50},{name:"Vine Tomatoes",qty:2,price:4.00}],         subtotal:13.50, delivery:0,     status:"delivered", date:"2026-05-16", slot:"7AM–9AM",   notes:"Call on arrival" },
  { id:"FF-10492", name:"David Francis",   phone:"(340) 771-3345", email:"david@email.com",   address:"5 Contant, St. Thomas",       items:[{name:"Coconuts",qty:6,price:2.50},{name:"Pineapple",qty:2,price:5.00}],               subtotal:25.00, delivery:10.00, status:"pending",   date:"2026-05-16", slot:"11AM–1PM",  notes:"" },
  { id:"FF-10491", name:"Grace Williams",  phone:"(340) 443-7712", email:"grace@email.com",   address:"3 Estate Thomas, St. Thomas", items:[{name:"Farm Fresh Eggs",qty:3,price:8.00},{name:"Julie Mangoes",qty:2,price:5.00}],     subtotal:34.00, delivery:10.00, status:"delivered", date:"2026-05-15", slot:"1PM–3PM",   notes:"" },
  { id:"FF-10490", name:"Tony Browne",     phone:"(340) 332-9910", email:"tony@email.com",    address:"9 Bovoni, St. Thomas",        items:[{name:"Breadfruit",qty:2,price:4.00},{name:"Sweet Peppers",qty:2,price:4.50}],         subtotal:17.00, delivery:10.00, status:"delivered", date:"2026-05-15", slot:"3PM–5PM",   notes:"" },
  { id:"FF-10489", name:"Lisa Martin",     phone:"(340) 550-2200", email:"lisa@email.com",    address:"17 Sub Base, St. Thomas",     items:[{name:"Callaloo",qty:4,price:3.00},{name:"Vine Tomatoes",qty:3,price:4.00}],           subtotal:24.00, delivery:10.00, status:"cancelled", date:"2026-05-14", slot:"9AM–11AM",  notes:"" },
  { id:"FF-10488", name:"Peter Jacobs",    phone:"(340) 881-4456", email:"peter@email.com",   address:"2 Havensight, St. Thomas",    items:[{name:"Pineapple",qty:3,price:5.00},{name:"Coconuts",qty:4,price:2.50}],              subtotal:25.00, delivery:10.00, status:"delivered", date:"2026-05-14", slot:"11AM–1PM",  notes:"Ring bell" },
];

const CATEGORIES  = ["Fruits","Vegetables","Eggs","Herbs","Other"];
const UNITS       = ["lb","bunch","dozen","each","bundle","kg","oz","bag","box","quart"];
const EMOJIS      = ["🥚","🍌","🥭","🟢","🫑","🥬","🥥","🌿","🍅","🍍","🌽","🫙","🍠","🧅","🧄","🫚","🍋","🍊","🍇","🍓"];
const SLOTS       = ["7AM–9AM","9AM–11AM","11AM–1PM","1PM–3PM","3PM–5PM"];
const STATUS_CFG  = {
  pending:   { bg:"#fff8e6", text:"#92600a", border:"#fde68a", label:"Pending"   },
  preparing: { bg:"#eff6ff", text:"#1d4ed8", border:"#bfdbfe", label:"Preparing" },
  delivered: { bg:"#f0fdf4", text:"#166534", border:"#bbf7d0", label:"Delivered" },
  cancelled: { bg:"#fef2f2", text:"#991b1b", border:"#fecaca", label:"Cancelled" },
};

const G   = "#1e3a1e";
const BG  = "#f2efe8";
const CARD = "#ffffff";
const BR  = "#e8e2d8";

const TABS = [
  { id:"overview",  icon:"📊", label:"Overview"   },
  { id:"orders",    icon:"📋", label:"Orders"     },
  { id:"schedule",  icon:"🚚", label:"Schedule"   },
  { id:"customers", icon:"👥", label:"Customers"  },
  { id:"analytics", icon:"📈", label:"Analytics"  },
  { id:"inventory", icon:"📦", label:"Inventory"  },
  { id:"pricing",   icon:"💰", label:"Pricing"    },
  { id:"photos",    icon:"📸", label:"Photos"     },
];

// ── Helpers ─────────────────────────────────────────────────
const fmt     = t => new Date(t+"T00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"});
const today   = () => new Date().toISOString().split("T")[0];
const uid     = () => Math.floor(10000+Math.random()*90000);

// ── Supabase Storage helpers ─────────────────────────────────
const supabaseUpload = async (file, path) => {
  if (!SUPABASE_URL || !SUPABASE_ANON) return null;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${path}`, {
    method:"POST", headers:{ "Authorization":`Bearer ${SUPABASE_ANON}`, "Content-Type": file.type, "x-upsert":"true" },
    body: file
  });
  if (!res.ok) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;
};

// ── Mini bar chart ────────────────────────────────────────────
function BarChart({ data, color="#1e3a1e", height=120 }) {
  const max = Math.max(...data.map(d=>d.value), 1);
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:6, height }}>
      {data.map((d,i) => (
        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4, height:"100%" }}>
          <div style={{ flex:1, width:"100%", display:"flex", alignItems:"flex-end" }}>
            <div style={{ width:"100%", background: color, borderRadius:"4px 4px 0 0", height:`${Math.max((d.value/max)*100,2)}%`, transition:"height 0.5s ease", opacity:0.85 }} />
          </div>
          <span style={{ fontSize:10, color:"#8a8070", whiteSpace:"nowrap" }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────
function Stat({ label, value, sub, emoji, bg, color }) {
  return (
    <div style={{ background:CARD, borderRadius:16, padding:"20px 22px", border:`1px solid ${BR}`, boxShadow:"0 2px 8px rgba(30,58,30,0.04)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ fontSize:11, color:"#8a8070", textTransform:"uppercase", letterSpacing:1.2, marginBottom:10 }}>{label}</div>
          <div className="disp" style={{ fontSize:32, fontWeight:700, color, lineHeight:1 }}>{value}</div>
          {sub && <div style={{ fontSize:12, color:"#a89888", marginTop:6 }}>{sub}</div>}
        </div>
        <div style={{ width:42, height:42, background:bg, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{emoji}</div>
      </div>
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────────
function Modal({ title, onClose, children, width=480 }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(30,58,30,0.35)" }} />
      <div style={{ position:"relative", background:CARD, borderRadius:20, width:"100%", maxWidth:width, maxHeight:"90vh", overflow:"auto", boxShadow:"0 16px 56px rgba(30,58,30,0.18)", border:`1px solid ${BR}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 24px", borderBottom:`1px solid ${BR}`, position:"sticky", top:0, background:CARD, zIndex:1 }}>
          <span className="disp" style={{ fontSize:22, color:G, fontWeight:700 }}>{title}</span>
          <button onClick={onClose} style={{ background:"#f2efe8", border:"none", borderRadius:8, width:30, height:30, cursor:"pointer", fontSize:16, color:"#8a8070", display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
        </div>
        <div style={{ padding:24 }}>{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children, required }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ fontSize:11, color:"#8a8070", letterSpacing:1.5, textTransform:"uppercase", display:"block", marginBottom:7 }}>{label}{required&&<span style={{color:"#ef4444"}}> *</span>}</label>
      {children}
    </div>
  );
}

const inp = { width:"100%", padding:"11px 14px", borderRadius:10, border:`1.5px solid ${BR}`, background:BG, color:"#1a2a1a", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit", transition:"border-color 0.2s" };

// ════════════════════════════════════════════════════════════
export default function Admin() {
  const [auth,       setAuth]       = useState(false);
  const [pw,         setPw]         = useState("");
  const [pwErr,      setPwErr]      = useState(false);
  const [tab,        setTab]        = useState("overview");
  const [products,   setProducts]   = useState(DEFAULT_PRODUCTS);
  const [orders,     setOrders]     = useState(SAMPLE_ORDERS);
  const [selected,   setSelected]   = useState(null);
  const [toast,      setToast]      = useState(null);
  const [search,     setSearch]     = useState("");
  const [filter,     setFilter]     = useState("all");
  const [uploadId,   setUploadId]   = useState(null);
  const [uploading,  setUploading]  = useState(false);

  // Editing states
  const [editPrice,  setEditPrice]  = useState(null);
  const [editPVal,   setEditPVal]   = useState("");
  const [editUnit,   setEditUnit]   = useState(null);
  const [editUVal,   setEditUVal]   = useState("");

  // Modals
  const [showAddItem,   setShowAddItem]   = useState(false);
  const [showDeleteCfm, setShowDeleteCfm] = useState(null); // order id
  const [showPushCfm,   setShowPushCfm]   = useState(false);
  const [newItem, setNewItem] = useState({ name:"", price:"", unit:"lb", category:"Fruits", emoji:"🍅", inStock:true });

  const fileRef = useRef(null);

  // ── Load saved data ──────────────────────────────────────
  useEffect(() => {
    try {
      const s = localStorage.getItem("ff_products_v2");
      if (s) { const d=JSON.parse(s); setProducts(p=>p.map(x=>{const o=d.find(y=>y.id===x.id);return o?{...x,...o}:x;})); }
      const o = localStorage.getItem("ff_orders_v2");
      if (o) setOrders(JSON.parse(o));
    } catch(e){}

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap";
    document.head.appendChild(link);
    const s = document.createElement("style");
    s.textContent = `
      *, *::before, *::after { box-sizing:border-box; font-family:'DM Sans',sans-serif; }
      .disp { font-family:'Playfair Display',Georgia,serif!important; }
      body  { margin:0; background:${BG}; }
      @keyframes fadeIn  { from{opacity:0;transform:translateY(8px);}  to{opacity:1;transform:translateY(0);} }
      @keyframes slideR  { from{opacity:0;transform:translateX(12px);} to{opacity:1;transform:translateX(0);} }
      @keyframes shake   { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
      @keyframes toastIn { from{opacity:0;transform:translateY(14px);} to{opacity:1;transform:translateY(0);} }
      @keyframes spin    { to{transform:rotate(360deg)} }
      .fade  { animation:fadeIn  0.3s ease both; }
      .slide { animation:slideR  0.25s ease both; }
      .shake { animation:shake   0.35s ease; }
      .toast-anim { animation:toastIn 0.3s ease both; }
      .tab-btn { transition:all 0.2s ease; }
      .tab-btn:hover { background:rgba(255,255,255,0.1)!important; }
      .tab-btn.on    { background:rgba(255,255,255,0.18)!important; color:#fff!important; }
      .row { transition:background 0.12s ease; cursor:pointer; }
      .row:hover { background:#f9f7f2!important; }
      .row.sel { background:#eef5ee!important; }
      .img-card:hover .img-cover { opacity:1!important; }
      input:focus,select:focus,textarea:focus { outline:none; border-color:${G}!important; }
      ::placeholder { color:#b8b0a0; }
      ::-webkit-scrollbar { width:4px; height:4px; }
      ::-webkit-scrollbar-thumb { background:#d0cac0; border-radius:2px; }
    `;
    document.head.appendChild(s);
  }, []);

  // ── Persist ──────────────────────────────────────────────
  const saveProducts = (u) => {
    setProducts(u);
    try { localStorage.setItem("ff_products_v2", JSON.stringify(u.map(p=>({id:p.id,price:p.price,unit:p.unit,inStock:p.inStock,image:p.image,name:p.name,category:p.category,emoji:p.emoji})))); } catch(e){}
  };

  const saveOrders = (u) => {
    setOrders(u);
    try { localStorage.setItem("ff_orders_v2", JSON.stringify(u)); } catch(e){}
  };

  const flash = (msg, type="ok") => { setToast({msg,type}); setTimeout(()=>setToast(null),2800); };

  // ── Auth ────────────────────────────────────────────────
  const login = () => {
    if (pw===ADMIN_PASSWORD) { setAuth(true); setPwErr(false); }
    else { setPwErr(true); setTimeout(()=>setPwErr(false),700); }
  };

  // ── Orders ──────────────────────────────────────────────
  const updateStatus = (id, status) => {
    const u = orders.map(o=>o.id===id?{...o,status}:o);
    saveOrders(u);
    if (selected?.id===id) setSelected(s=>({...s,status}));
    flash(`Marked as ${status}`);
  };

  const deleteOrder = (id) => {
    const u = orders.filter(o=>o.id!==id);
    saveOrders(u);
    if (selected?.id===id) setSelected(null);
    setShowDeleteCfm(null);
    flash("Order deleted","ok");
  };

  // ── Products ────────────────────────────────────────────
  const toggleStock = (id) => { const u=products.map(p=>p.id===id?{...p,inStock:!p.inStock}:p); saveProducts(u); flash("Stock updated"); };

  const savePrice = (id) => {
    const v=parseFloat(editPVal);
    if(!isNaN(v)&&v>0){const u=products.map(p=>p.id===id?{...p,price:v}:p);saveProducts(u);flash("Price saved");}
    setEditPrice(null);
  };

  const saveUnit = (id) => {
    if(editUVal.trim()){const u=products.map(p=>p.id===id?{...p,unit:editUVal.trim()}:p);saveProducts(u);flash("Unit saved");}
    setEditUnit(null);
  };

  const addItem = () => {
    if(!newItem.name||!newItem.price){flash("Name and price are required","err");return;}
    const item = { id: Date.now(), name:newItem.name, price:parseFloat(newItem.price), unit:newItem.unit, category:newItem.category, emoji:newItem.emoji, inStock:true, image:null };
    saveProducts([...products, item]);
    setShowAddItem(false);
    setNewItem({name:"",price:"",unit:"lb",category:"Fruits",emoji:"🍅",inStock:true});
    flash(`${item.name} added to inventory`);
  };

  const deleteItem = (id) => {
    saveProducts(products.filter(p=>p.id!==id));
    flash("Item removed");
  };

  // ── Photos ──────────────────────────────────────────────
  const uploadPhoto = async (id, file) => {
    setUploading(true);
    let url = null;
    if (SUPABASE_URL && SUPABASE_ANON) {
      const ext = file.name.split(".").pop();
      url = await supabaseUpload(file, `product-${id}.${ext}`);
    }
    if (!url) {
      // Fallback to base64 local
      await new Promise(res => {
        const r = new FileReader();
        r.onload = e => { url = e.target.result; res(); };
        r.readAsDataURL(file);
      });
    }
    const u = products.map(p=>p.id===id?{...p,image:url}:p);
    saveProducts(u);
    setUploading(false);
    flash(SUPABASE_URL ? "Photo uploaded to Supabase ✓" : "Photo saved locally ✓");
  };

  const removePhoto = (id) => { saveProducts(products.map(p=>p.id===id?{...p,image:null}:p)); flash("Photo removed"); };

  // ── Push notifications ──────────────────────────────────
  const requestPush = async () => {
    if (!("Notification" in window)) { flash("Browser doesn't support notifications","err"); return; }
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      new Notification("Francis Farms Admin", { body:"You'll be notified when new orders come in!", icon:"/favicon.ico" });
      flash("Push notifications enabled ✓");
    } else { flash("Permission denied","err"); }
    setShowPushCfm(false);
  };

  // ── Analytics data ───────────────────────────────────────
  const weeklyRevenue = [
    {label:"Mon", value:42},
    {label:"Tue", value:68},
    {label:"Wed", value:55},
    {label:"Thu", value:91},
    {label:"Fri", value:77},
    {label:"Sat", value:115},
    {label:"Sun", value:34},
  ];

  const topProducts = products.map(p => ({
    name: p.name,
    count: orders.filter(o=>o.status!=="cancelled").reduce((s,o)=>s+o.items.filter(i=>i.name===p.name).reduce((a,b)=>a+b.qty,0),0)
  })).sort((a,b)=>b.count-a.count).slice(0,5);

  // ── Computed ────────────────────────────────────────────
  const revenue    = orders.filter(o=>o.status!=="cancelled").reduce((s,o)=>s+o.subtotal+o.delivery,0);
  const pending    = orders.filter(o=>o.status==="pending").length;
  const delivered  = orders.filter(o=>o.status==="delivered").length;
  const inStock    = products.filter(p=>p.inStock).length;

  const todayOrders = orders.filter(o=>o.date===today());

  const visibleOrders = orders
    .filter(o=>filter==="all"||o.status===filter)
    .filter(o=>o.name.toLowerCase().includes(search.toLowerCase())||o.id.toLowerCase().includes(search.toLowerCase()));

  const customers = Object.values(
    orders.reduce((acc,o) => {
      if (!acc[o.phone]) acc[o.phone] = { name:o.name, phone:o.phone, email:o.email, address:o.address, orders:0, spent:0, lastOrder:o.date };
      acc[o.phone].orders++;
      acc[o.phone].spent += o.subtotal + o.delivery;
      if (o.date > acc[o.phone].lastOrder) acc[o.phone].lastOrder = o.date;
      return acc;
    }, {})
  ).sort((a,b)=>b.spent-a.spent);

  // ════════════════════════════════════════════════════════
  // LOGIN
  // ════════════════════════════════════════════════════════
  if (!auth) return (
    <div style={{minHeight:"100vh",background:BG,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:380,background:CARD,borderRadius:24,padding:44,boxShadow:"0 8px 48px rgba(30,58,30,0.1)",border:`1px solid ${BR}`}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{width:60,height:60,background:G,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",fontSize:26}}>🌿</div>
          <h1 className="disp" style={{fontSize:30,color:G,marginBottom:6}}>Francis Farms</h1>
          <p style={{fontSize:13,color:"#8a8070"}}>Admin Dashboard</p>
        </div>
        <label style={{fontSize:11,color:"#8a8070",letterSpacing:1.5,textTransform:"uppercase",display:"block",marginBottom:8}}>Password</label>
        <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()} placeholder="Enter password"
          className={pwErr?"shake":""} style={{...inp,marginBottom:6,border:`1.5px solid ${pwErr?"#ef4444":BR}`,background:pwErr?"#fef2f2":BG}} />
        {pwErr&&<p style={{color:"#ef4444",fontSize:12,marginBottom:4}}>Incorrect password</p>}
        <button onClick={login} style={{width:"100%",background:G,color:"#fff",border:"none",borderRadius:12,padding:14,fontSize:15,fontWeight:600,cursor:"pointer",marginTop:16}}>
          Sign In →
        </button>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════
  // DASHBOARD
  // ════════════════════════════════════════════════════════
  return (
    <div style={{display:"flex",minHeight:"100vh",background:BG}}>

      {/* Toast */}
      {toast && (
        <div className="toast-anim" style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",background:toast.type==="err"?"#dc2626":G,color:"#fff",padding:"12px 24px",borderRadius:50,fontSize:14,fontWeight:600,zIndex:999,boxShadow:"0 4px 24px rgba(0,0,0,0.18)",whiteSpace:"nowrap"}}>
          {toast.type==="err"?"✕ ":"✓ "}{toast.msg}
        </div>
      )}

      {/* File input */}
      <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}}
        onChange={e=>{if(uploadId&&e.target.files[0])uploadPhoto(uploadId,e.target.files[0]);e.target.value="";setUploadId(null);}} />

      {/* Delete confirm modal */}
      {showDeleteCfm && (
        <Modal title="Delete Order?" onClose={()=>setShowDeleteCfm(null)} width={400}>
          <p style={{color:"#8a8070",marginBottom:24}}>Order <strong>{showDeleteCfm}</strong> will be permanently deleted. This cannot be undone.</p>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>deleteOrder(showDeleteCfm)} style={{flex:1,padding:"11px",borderRadius:10,border:"none",background:"#dc2626",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer"}}>Delete</button>
            <button onClick={()=>setShowDeleteCfm(null)} style={{flex:1,padding:"11px",borderRadius:10,border:`1px solid ${BR}`,background:"none",color:"#8a8070",fontSize:14,cursor:"pointer"}}>Cancel</button>
          </div>
        </Modal>
      )}

      {/* Push notification confirm */}
      {showPushCfm && (
        <Modal title="Enable Notifications" onClose={()=>setShowPushCfm(false)} width={420}>
          <p style={{color:"#8a8070",marginBottom:8}}>Get notified the moment a new order comes in — even when the admin page isn't open.</p>
          <p style={{color:"#8a8070",marginBottom:24,fontSize:13}}>Your browser will ask for permission. Make sure Francis Farms is allowed.</p>
          <div style={{display:"flex",gap:10}}>
            <button onClick={requestPush} style={{flex:1,padding:"11px",borderRadius:10,border:"none",background:G,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer"}}>Enable Now</button>
            <button onClick={()=>setShowPushCfm(false)} style={{flex:1,padding:"11px",borderRadius:10,border:`1px solid ${BR}`,background:"none",color:"#8a8070",fontSize:14,cursor:"pointer"}}>Later</button>
          </div>
        </Modal>
      )}

      {/* Add Item modal */}
      {showAddItem && (
        <Modal title="Add New Product" onClose={()=>setShowAddItem(false)}>
          <Field label="Product Name" required>
            <input value={newItem.name} onChange={e=>setNewItem(x=>({...x,name:e.target.value}))} placeholder="e.g. Dragon Fruit" style={inp} />
          </Field>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <Field label="Price ($)" required>
              <input type="number" step="0.50" value={newItem.price} onChange={e=>setNewItem(x=>({...x,price:e.target.value}))} placeholder="0.00" style={inp} />
            </Field>
            <Field label="Unit">
              <select value={newItem.unit} onChange={e=>setNewItem(x=>({...x,unit:e.target.value}))} style={inp}>
                {UNITS.map(u=><option key={u}>{u}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Category">
            <select value={newItem.category} onChange={e=>setNewItem(x=>({...x,category:e.target.value}))} style={inp}>
              {CATEGORIES.map(c=><option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Emoji Icon">
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:8}}>
              {EMOJIS.map(e=>(
                <button key={e} onClick={()=>setNewItem(x=>({...x,emoji:e}))} style={{width:38,height:38,borderRadius:8,border:`2px solid ${newItem.emoji===e?G:BR}`,background:newItem.emoji===e?"#eef5ee":"transparent",fontSize:20,cursor:"pointer"}}>
                  {e}
                </button>
              ))}
            </div>
          </Field>
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <button onClick={addItem} style={{flex:1,padding:"12px",borderRadius:10,border:"none",background:G,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer"}}>Add Product</button>
            <button onClick={()=>setShowAddItem(false)} style={{flex:1,padding:"12px",borderRadius:10,border:`1px solid ${BR}`,background:"none",color:"#8a8070",fontSize:14,cursor:"pointer"}}>Cancel</button>
          </div>
        </Modal>
      )}

      {/* ── SIDEBAR ── */}
      <aside style={{width:230,background:G,display:"flex",flexDirection:"column",padding:"28px 14px",position:"fixed",top:0,bottom:0,left:0,zIndex:50,boxShadow:"4px 0 24px rgba(30,58,30,0.15)"}}>
        <div style={{padding:"0 10px 28px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
            <span style={{fontSize:22}}>🌿</span>
            <span className="disp" style={{fontSize:19,color:"#fff",fontWeight:700}}>Francis Farms</span>
          </div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",letterSpacing:2,textTransform:"uppercase",paddingLeft:32}}>Admin Panel</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:2}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} className={`tab-btn${tab===t.id?" on":""}`}
              style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:10,border:"none",background:"transparent",color:tab===t.id?"#fff":"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:14,fontWeight:tab===t.id?600:400,textAlign:"left",width:"100%"}}>
              <span style={{fontSize:17}}>{t.icon}</span>
              {t.label}
              {t.id==="orders"&&pending>0&&<span style={{marginLeft:"auto",background:"#ef4444",color:"#fff",borderRadius:50,minWidth:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,padding:"0 5px"}}>{pending}</span>}
              {t.id==="schedule"&&todayOrders.length>0&&<span style={{marginLeft:"auto",background:"rgba(255,255,255,0.2)",color:"#fff",borderRadius:50,minWidth:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,padding:"0 5px"}}>{todayOrders.length}</span>}
            </button>
          ))}
        </div>
        <div style={{marginTop:"auto",borderTop:"1px solid rgba(255,255,255,0.1)",paddingTop:16}}>
          <button onClick={()=>setShowPushCfm(true)} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 14px",borderRadius:10,border:"none",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:13,width:"100%",marginBottom:2}}>
            🔔 Push Notifications
          </button>
          <a href="/" style={{display:"flex",alignItems:"center",gap:8,padding:"9px 14px",borderRadius:10,color:"rgba(255,255,255,0.4)",fontSize:13,textDecoration:"none",marginBottom:2}}>🏪 View Shop</a>
          <button onClick={()=>setAuth(false)} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 14px",borderRadius:10,border:"none",background:"transparent",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:13,width:"100%"}}>🚪 Sign Out</button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{marginLeft:230,flex:1,padding:"32px 36px"}}>

        {/* ── OVERVIEW ── */}
        {tab==="overview" && (
          <div className="fade">
            <h1 className="disp" style={{fontSize:38,color:G,marginBottom:4}}>Good morning 🌤</h1>
            <p style={{color:"#8a8070",marginBottom:32,fontSize:15}}>Here's what's happening at Francis Farms today.</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:32}}>
              <Stat label="Today's Orders"  value={todayOrders.length}    sub={`${pending} pending`}          emoji="📋" bg="#fff8e6" color="#92600a" />
              <Stat label="Total Revenue"   value={`$${revenue.toFixed(2)}`} sub="All time"                  emoji="💵" bg="#eef5ee" color={G} />
              <Stat label="Delivered Today" value={todayOrders.filter(o=>o.status==="delivered").length} sub="Completed" emoji="✅" bg="#f0fdf4" color="#166534" />
              <Stat label="In Stock"        value={`${inStock}/${products.length}`} sub={`${products.length-inStock} out of stock`} emoji="📦" bg="#eff6ff" color="#1d4ed8" />
            </div>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20,marginBottom:20}}>
              {/* Recent orders */}
              <div style={{background:CARD,borderRadius:16,border:`1px solid ${BR}`,overflow:"hidden",boxShadow:"0 2px 8px rgba(30,58,30,0.04)"}}>
                <div style={{padding:"16px 22px",borderBottom:`1px solid #f0ece4`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:15,fontWeight:600,color:G}}>Recent Orders</span>
                  <button onClick={()=>setTab("orders")} style={{fontSize:13,color:G,background:"none",border:"none",cursor:"pointer",fontWeight:500}}>View all →</button>
                </div>
                {orders.slice(0,5).map((o,i)=>(
                  <div key={o.id} style={{display:"flex",alignItems:"center",padding:"13px 22px",borderBottom:i<4?`1px solid #f5f1eb`:"none",gap:14}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:600,color:"#1a2a1a",marginBottom:2}}>{o.name}</div>
                      <div style={{fontSize:12,color:"#8a8070"}}>{o.id} · {fmt(o.date)}</div>
                    </div>
                    <span style={{fontSize:11,fontWeight:600,padding:"3px 9px",borderRadius:50,background:STATUS_CFG[o.status].bg,color:STATUS_CFG[o.status].text,border:`1px solid ${STATUS_CFG[o.status].border}`}}>{STATUS_CFG[o.status].label}</span>
                    <span className="disp" style={{fontSize:18,fontWeight:700,color:G}}>${(o.subtotal+o.delivery).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              {/* Quick stats */}
              <div style={{display:"flex",flexDirection:"column",gap:16}}>
                <div style={{background:CARD,borderRadius:16,border:`1px solid ${BR}`,padding:20,boxShadow:"0 2px 8px rgba(30,58,30,0.04)"}}>
                  <div style={{fontSize:13,fontWeight:600,color:G,marginBottom:14}}>Revenue This Week</div>
                  <BarChart data={weeklyRevenue} color={G} height={100} />
                </div>
                {products.some(p=>!p.inStock) && (
                  <div style={{background:"#fff8e6",border:"1px solid #fde68a",borderRadius:14,padding:"14px 18px"}}>
                    <div style={{fontSize:13,fontWeight:600,color:"#92600a",marginBottom:4}}>⚠️ Out of Stock</div>
                    <div style={{fontSize:12,color:"#a8780a"}}>{products.filter(p=>!p.inStock).map(p=>p.name).join(", ")}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab==="orders" && (
          <div className="fade">
            <h1 className="disp" style={{fontSize:38,color:G,marginBottom:24}}>Orders</h1>
            <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap"}}>
              <div style={{position:"relative",flex:"1",minWidth:200}}>
                <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)"}}>🔍</span>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name or order #" style={{...inp,paddingLeft:40}} />
              </div>
              {["all",...Object.keys(STATUS_CFG)].map(f=>(
                <button key={f} onClick={()=>setFilter(f)} style={{padding:"10px 18px",borderRadius:10,border:`1.5px solid ${filter===f?G:BR}`,background:filter===f?G:CARD,color:filter===f?"#fff":"#8a8070",fontSize:13,fontWeight:filter===f?600:400,cursor:"pointer",textTransform:"capitalize",transition:"all 0.15s"}}>
                  {f==="all"?"All":STATUS_CFG[f]?.label}
                  {f==="pending"&&pending>0&&<span style={{marginLeft:6,background:"#ef4444",color:"#fff",borderRadius:50,padding:"1px 6px",fontSize:11}}>{pending}</span>}
                </button>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:selected?"1fr 1fr":"1fr",gap:20}}>
              <div style={{background:CARD,borderRadius:16,border:`1px solid ${BR}`,overflow:"hidden",boxShadow:"0 2px 8px rgba(30,58,30,0.04)"}}>
                {visibleOrders.length===0
                  ? <div style={{padding:48,textAlign:"center",color:"#a89888"}}>No orders found</div>
                  : visibleOrders.map(o=>(
                    <div key={o.id} className={`row${selected?.id===o.id?" sel":""}`} onClick={()=>setSelected(o)} style={{padding:"15px 20px",borderBottom:`1px solid #f5f1eb`}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                            <span style={{fontSize:14,fontWeight:600,color:"#1a2a1a"}}>{o.name}</span>
                            <span style={{fontSize:11,fontWeight:600,padding:"3px 9px",borderRadius:50,background:STATUS_CFG[o.status].bg,color:STATUS_CFG[o.status].text,border:`1px solid ${STATUS_CFG[o.status].border}`}}>{STATUS_CFG[o.status].label}</span>
                          </div>
                          <div style={{fontSize:12,color:"#8a8070"}}>{o.id} · {fmt(o.date)} · {o.slot}</div>
                        </div>
                        <div style={{textAlign:"right"}}>
                          <span className="disp" style={{fontSize:20,fontWeight:700,color:G,display:"block"}}>${(o.subtotal+o.delivery).toFixed(2)}</span>
                          <span style={{fontSize:11,color:"#a89888"}}>{o.items.length} item{o.items.length!==1?"s":""}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {selected && (
                <div className="slide" style={{background:CARD,borderRadius:16,border:`1px solid ${BR}`,overflow:"hidden",boxShadow:"0 2px 8px rgba(30,58,30,0.04)"}}>
                  <div style={{padding:"16px 20px",borderBottom:`1px solid #f0ece4`,display:"flex",justifyContent:"space-between",alignItems:"center",background:"#fafaf8"}}>
                    <div>
                      <span className="disp" style={{fontSize:20,color:G,fontWeight:700}}>{selected.id}</span>
                      <span style={{marginLeft:10,fontSize:11,fontWeight:600,padding:"3px 9px",borderRadius:50,background:STATUS_CFG[selected.status].bg,color:STATUS_CFG[selected.status].text,border:`1px solid ${STATUS_CFG[selected.status].border}`}}>{STATUS_CFG[selected.status].label}</span>
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={()=>setShowDeleteCfm(selected.id)} style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"6px 12px",color:"#991b1b",fontSize:12,fontWeight:600,cursor:"pointer"}}>🗑 Delete</button>
                      <button onClick={()=>setSelected(null)} style={{background:"#f2efe8",border:"none",borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:16,color:"#8a8070",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
                    </div>
                  </div>
                  <div style={{padding:20}}>
                    <div style={{background:"#f9f7f2",borderRadius:12,padding:"14px 16px",marginBottom:18}}>
                      <div style={{fontSize:16,fontWeight:600,color:"#1a2a1a",marginBottom:8}}>{selected.name}</div>
                      <div style={{fontSize:13,color:"#8a8070",marginBottom:3}}>📍 {selected.address}</div>
                      <div style={{fontSize:13,color:"#8a8070",marginBottom:3}}>📞 {selected.phone}</div>
                      <div style={{fontSize:13,color:"#8a8070",marginBottom:3}}>✉️ {selected.email}</div>
                      <div style={{fontSize:13,color:"#8a8070"}}>🕐 {selected.slot} · {fmt(selected.date)}</div>
                      {selected.notes&&<div style={{fontSize:13,color:"#b8740a",marginTop:8,padding:"8px 10px",background:"#fff8e6",borderRadius:8}}>💬 {selected.notes}</div>}
                    </div>
                    <div style={{marginBottom:18}}>
                      {selected.items.map((item,i)=>(
                        <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid #f5f1eb`}}>
                          <span style={{fontSize:14}}>{item.name} <span style={{color:"#8a8070"}}>×{item.qty}</span></span>
                          <span style={{fontSize:14,fontWeight:500}}>${(item.price*item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                      <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid #f5f1eb`}}>
                        <span style={{fontSize:13,color:"#8a8070"}}>Delivery</span>
                        <span style={{fontSize:13,color:selected.delivery===0?"#166534":"#1a2a1a"}}>{selected.delivery===0?"FREE":`$${selected.delivery.toFixed(2)}`}</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",paddingTop:10}}>
                        <span className="disp" style={{fontSize:20,color:G}}>Total</span>
                        <span className="disp" style={{fontSize:24,fontWeight:700,color:G}}>${(selected.subtotal+selected.delivery).toFixed(2)}</span>
                      </div>
                    </div>
                    <div style={{fontSize:11,color:"#8a8070",letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>Update Status</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                      {Object.entries(STATUS_CFG).map(([k,v])=>(
                        <button key={k} onClick={()=>updateStatus(selected.id,k)} style={{padding:"10px",borderRadius:10,border:`1.5px solid ${selected.status===k?v.border:BR}`,background:selected.status===k?v.bg:"transparent",color:selected.status===k?v.text:"#8a8070",fontSize:13,fontWeight:selected.status===k?600:400,cursor:"pointer",transition:"all 0.15s"}}>
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── DELIVERY SCHEDULE ── */}
        {tab==="schedule" && (
          <div className="fade">
            <h1 className="disp" style={{fontSize:38,color:G,marginBottom:4}}>Delivery Schedule</h1>
            <p style={{color:"#8a8070",marginBottom:28,fontSize:15}}>Today's deliveries grouped by time slot.</p>
            {todayOrders.length===0
              ? <div style={{background:CARD,borderRadius:16,border:`1px solid ${BR}`,padding:56,textAlign:"center",color:"#a89888"}}>No deliveries scheduled today.</div>
              : SLOTS.map(slot=>{
                  const slotOrders = todayOrders.filter(o=>o.slot===slot);
                  if(!slotOrders.length) return null;
                  return (
                    <div key={slot} style={{marginBottom:24}}>
                      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                        <div style={{background:G,color:"#fff",borderRadius:50,padding:"5px 16px",fontSize:13,fontWeight:600}}>🕐 {slot}</div>
                        <span style={{fontSize:13,color:"#8a8070"}}>{slotOrders.length} order{slotOrders.length!==1?"s":""}</span>
                      </div>
                      <div style={{display:"grid",gap:10}}>
                        {slotOrders.map(o=>(
                          <div key={o.id} style={{background:CARD,borderRadius:14,border:`1px solid ${BR}`,padding:"16px 20px",boxShadow:"0 2px 8px rgba(30,58,30,0.04)"}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                              <div>
                                <div style={{fontSize:15,fontWeight:600,color:"#1a2a1a",marginBottom:3}}>{o.name}</div>
                                <div style={{fontSize:13,color:"#8a8070",marginBottom:2}}>📍 {o.address}</div>
                                <div style={{fontSize:13,color:"#8a8070"}}>📞 {o.phone}</div>
                                {o.notes&&<div style={{fontSize:12,color:"#b8740a",marginTop:6}}>💬 {o.notes}</div>}
                              </div>
                              <div style={{textAlign:"right"}}>
                                <span style={{fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:50,background:STATUS_CFG[o.status].bg,color:STATUS_CFG[o.status].text,border:`1px solid ${STATUS_CFG[o.status].border}`,display:"block",marginBottom:8}}>{STATUS_CFG[o.status].label}</span>
                                <span className="disp" style={{fontSize:18,fontWeight:700,color:G}}>${(o.subtotal+o.delivery).toFixed(2)}</span>
                              </div>
                            </div>
                            <div style={{background:"#f9f7f2",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#8a8070"}}>
                              {o.items.map((i,idx)=><span key={idx}>{i.name} ×{i.qty}{idx<o.items.length-1?", ":""}</span>)}
                            </div>
                            <div style={{display:"flex",gap:8,marginTop:12}}>
                              {o.status!=="delivered"&&<button onClick={()=>updateStatus(o.id,"delivered")} style={{flex:1,padding:"9px",borderRadius:8,border:"none",background:"#f0fdf4",color:"#166534",fontSize:13,fontWeight:600,cursor:"pointer"}}>✓ Mark Delivered</button>}
                              {o.status==="pending"&&<button onClick={()=>updateStatus(o.id,"preparing")} style={{flex:1,padding:"9px",borderRadius:8,border:"none",background:"#eff6ff",color:"#1d4ed8",fontSize:13,fontWeight:600,cursor:"pointer"}}>🔄 Mark Preparing</button>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
            }
          </div>
        )}

        {/* ── CUSTOMERS ── */}
        {tab==="customers" && (
          <div className="fade">
            <h1 className="disp" style={{fontSize:38,color:G,marginBottom:4}}>Customers</h1>
            <p style={{color:"#8a8070",marginBottom:28,fontSize:15}}>{customers.length} unique customers · sorted by total spend</p>
            <div style={{background:CARD,borderRadius:16,border:`1px solid ${BR}`,overflow:"hidden",boxShadow:"0 2px 8px rgba(30,58,30,0.04)"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr auto auto auto auto",padding:"12px 22px",borderBottom:`1px solid #f0ece4`,background:"#fafaf8",gap:16}}>
                {["Customer","Phone","Orders","Spent","Last Order"].map((h,i)=><span key={i} style={{fontSize:11,color:"#8a8070",textTransform:"uppercase",letterSpacing:1.2,fontWeight:600}}>{h}</span>)}
              </div>
              {customers.map((c,i)=>(
                <div key={c.phone} style={{display:"grid",gridTemplateColumns:"1fr auto auto auto auto",padding:"14px 22px",borderBottom:i<customers.length-1?`1px solid #f5f1eb`:"none",gap:16,alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:600,color:"#1a2a1a"}}>{c.name}</div>
                    <div style={{fontSize:12,color:"#8a8070"}}>{c.email||"—"}</div>
                    <div style={{fontSize:12,color:"#8a8070"}}>{c.address}</div>
                  </div>
                  <span style={{fontSize:13,color:"#8a8070"}}>{c.phone}</span>
                  <span style={{fontSize:14,fontWeight:600,color:"#1a2a1a",textAlign:"center"}}>{c.orders}</span>
                  <span className="disp" style={{fontSize:18,fontWeight:700,color:G}}>${c.spent.toFixed(2)}</span>
                  <span style={{fontSize:12,color:"#8a8070"}}>{fmt(c.lastOrder)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ANALYTICS ── */}
        {tab==="analytics" && (
          <div className="fade">
            <h1 className="disp" style={{fontSize:38,color:G,marginBottom:28}}>Analytics</h1>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:28}}>
              <Stat label="Total Revenue"    value={`$${revenue.toFixed(2)}`}        sub="All orders"           emoji="💵" bg="#eef5ee" color={G} />
              <Stat label="Total Orders"     value={orders.length}                    sub={`${delivered} delivered`} emoji="📋" bg="#fff8e6" color="#92600a" />
              <Stat label="Avg Order Value"  value={`$${orders.length?(revenue/orders.filter(o=>o.status!=="cancelled").length).toFixed(2):"0"}`} sub="Per order" emoji="📊" bg="#eff6ff" color="#1d4ed8" />
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
              <div style={{background:CARD,borderRadius:16,border:`1px solid ${BR}`,padding:24,boxShadow:"0 2px 8px rgba(30,58,30,0.04)"}}>
                <div style={{fontSize:15,fontWeight:600,color:G,marginBottom:20}}>Revenue This Week</div>
                <BarChart data={weeklyRevenue} color={G} height={140} />
              </div>
              <div style={{background:CARD,borderRadius:16,border:`1px solid ${BR}`,padding:24,boxShadow:"0 2px 8px rgba(30,58,30,0.04)"}}>
                <div style={{fontSize:15,fontWeight:600,color:G,marginBottom:20}}>Order Status Breakdown</div>
                {Object.entries(STATUS_CFG).map(([k,v])=>{
                  const count=orders.filter(o=>o.status===k).length;
                  const pct=orders.length?Math.round(count/orders.length*100):0;
                  return(
                    <div key={k} style={{marginBottom:14}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                        <span style={{fontSize:13,color:"#1a2a1a"}}>{v.label}</span>
                        <span style={{fontSize:13,fontWeight:600,color:"#1a2a1a"}}>{count} ({pct}%)</span>
                      </div>
                      <div style={{height:8,background:"#f2efe8",borderRadius:50,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${pct}%`,background:v.text,borderRadius:50,transition:"width 0.5s ease"}} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{background:CARD,borderRadius:16,border:`1px solid ${BR}`,padding:24,boxShadow:"0 2px 8px rgba(30,58,30,0.04)"}}>
              <div style={{fontSize:15,fontWeight:600,color:G,marginBottom:20}}>Top Selling Products</div>
              {topProducts.map((p,i)=>(
                <div key={p.name} style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
                  <span style={{fontSize:14,fontWeight:700,color:"#b0a890",width:20}}>#{i+1}</span>
                  <span style={{fontSize:14,flex:1,color:"#1a2a1a",fontWeight:500}}>{p.name}</span>
                  <div style={{width:160,height:8,background:"#f2efe8",borderRadius:50,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${topProducts[0].count?p.count/topProducts[0].count*100:0}%`,background:G,borderRadius:50}} />
                  </div>
                  <span style={{fontSize:13,color:"#8a8070",width:60,textAlign:"right"}}>{p.count} sold</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── INVENTORY ── */}
        {tab==="inventory" && (
          <div className="fade">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:28}}>
              <div>
                <h1 className="disp" style={{fontSize:38,color:G,marginBottom:4}}>Inventory</h1>
                <p style={{color:"#8a8070",fontSize:15}}>{inStock} of {products.length} in stock</p>
              </div>
              <button onClick={()=>setShowAddItem(true)} style={{display:"flex",alignItems:"center",gap:8,padding:"11px 22px",borderRadius:10,border:"none",background:G,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer"}}>
                + Add Product
              </button>
            </div>
            <div style={{background:CARD,borderRadius:16,border:`1px solid ${BR}`,overflow:"hidden",boxShadow:"0 2px 8px rgba(30,58,30,0.04)"}}>
              <div style={{display:"grid",gridTemplateColumns:"auto 1fr auto auto auto",padding:"12px 22px",borderBottom:`1px solid #f0ece4`,background:"#fafaf8",gap:16,alignItems:"center"}}>
                {["","Product","Price","Stock","Remove"].map((h,i)=><span key={i} style={{fontSize:11,color:"#8a8070",textTransform:"uppercase",letterSpacing:1.2,fontWeight:600}}>{h}</span>)}
              </div>
              {products.map((p,i)=>(
                <div key={p.id} style={{display:"grid",gridTemplateColumns:"auto 1fr auto auto auto",padding:"14px 22px",borderBottom:i<products.length-1?`1px solid #f5f1eb`:"none",gap:16,alignItems:"center",opacity:p.inStock?1:0.5}}>
                  <div style={{width:44,height:44,borderRadius:10,overflow:"hidden",background:"#f5f1eb",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {p.image?<img src={p.image} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}} />:<span style={{fontSize:24}}>{p.emoji}</span>}
                  </div>
                  <div>
                    <div style={{fontSize:15,fontWeight:600,color:"#1a2a1a"}}>{p.name}</div>
                    <div style={{fontSize:12,color:"#8a8070"}}>{p.category} · per {p.unit}</div>
                  </div>
                  <span className="disp" style={{fontSize:20,fontWeight:700,color:G}}>${p.price.toFixed(2)}</span>
                  <div style={{cursor:"pointer",display:"flex",alignItems:"center",gap:10}} onClick={()=>toggleStock(p.id)}>
                    <div style={{width:48,height:26,borderRadius:50,background:p.inStock?G:"#d1ccc4",position:"relative",transition:"background 0.2s",flexShrink:0}}>
                      <div style={{width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:p.inStock?25:3,transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}} />
                    </div>
                    <span style={{fontSize:12,color:p.inStock?"#166534":"#8a8070",fontWeight:500}}>{p.inStock?"In Stock":"Out"}</span>
                  </div>
                  <button onClick={()=>deleteItem(p.id)} style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"6px 10px",color:"#991b1b",fontSize:12,cursor:"pointer"}}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PRICING ── */}
        {tab==="pricing" && (
          <div className="fade">
            <div style={{marginBottom:28}}>
              <h1 className="disp" style={{fontSize:38,color:G,marginBottom:4}}>Pricing</h1>
              <p style={{color:"#8a8070",fontSize:15}}>Edit price and unit for any product inline.</p>
            </div>
            <div style={{background:CARD,borderRadius:16,border:`1px solid ${BR}`,overflow:"hidden",boxShadow:"0 2px 8px rgba(30,58,30,0.04)"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr auto auto auto",padding:"12px 22px",borderBottom:`1px solid #f0ece4`,background:"#fafaf8",gap:16}}>
                {["Product","Unit","Price","Actions"].map((h,i)=><span key={i} style={{fontSize:11,color:"#8a8070",textTransform:"uppercase",letterSpacing:1.2,fontWeight:600}}>{h}</span>)}
              </div>
              {products.map((p,i)=>(
                <div key={p.id} style={{display:"grid",gridTemplateColumns:"1fr auto auto auto",padding:"14px 22px",borderBottom:i<products.length-1?`1px solid #f5f1eb`:"none",gap:16,alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:36,height:36,borderRadius:8,overflow:"hidden",background:"#f5f1eb",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      {p.image?<img src={p.image} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}} />:<span style={{fontSize:18}}>{p.emoji}</span>}
                    </div>
                    <span style={{fontSize:14,fontWeight:500,color:"#1a2a1a"}}>{p.name}</span>
                  </div>

                  {/* Unit edit */}
                  <div style={{minWidth:100}}>
                    {editUnit===p.id
                      ? <div style={{display:"flex",gap:4}}>
                          <select value={editUVal} onChange={e=>setEditUVal(e.target.value)} style={{...inp,padding:"6px 10px",width:90}}>
                            {UNITS.map(u=><option key={u}>{u}</option>)}
                          </select>
                          <button onClick={()=>saveUnit(p.id)} style={{padding:"6px 10px",borderRadius:8,border:"none",background:G,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>✓</button>
                          <button onClick={()=>setEditUnit(null)} style={{padding:"6px 8px",borderRadius:8,border:`1px solid ${BR}`,background:"none",color:"#8a8070",fontSize:12,cursor:"pointer"}}>✕</button>
                        </div>
                      : <span style={{fontSize:13,color:"#8a8070",cursor:"pointer",padding:"4px 8px",borderRadius:6,border:`1px solid ${BR}`,background:"#f9f7f2"}} onClick={()=>{setEditUnit(p.id);setEditUVal(p.unit);}}>/ {p.unit} ✎</span>
                    }
                  </div>

                  {/* Price edit */}
                  <div style={{minWidth:110}}>
                    {editPrice===p.id
                      ? <div style={{display:"flex",alignItems:"center",gap:4}}>
                          <span style={{color:"#8a8070"}}>$</span>
                          <input autoFocus type="number" step="0.50" value={editPVal} onChange={e=>setEditPVal(e.target.value)}
                            onKeyDown={e=>{if(e.key==="Enter")savePrice(p.id);if(e.key==="Escape")setEditPrice(null);}}
                            style={{...inp,width:72,padding:"7px 10px"}} />
                          <button onClick={()=>savePrice(p.id)} style={{padding:"7px 10px",borderRadius:8,border:"none",background:G,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>✓</button>
                          <button onClick={()=>setEditPrice(null)} style={{padding:"7px 8px",borderRadius:8,border:`1px solid ${BR}`,background:"none",color:"#8a8070",fontSize:12,cursor:"pointer"}}>✕</button>
                        </div>
                      : <span className="disp" style={{fontSize:22,fontWeight:700,color:G}}>${p.price.toFixed(2)}</span>
                    }
                  </div>

                  <button onClick={()=>{setEditPrice(p.id);setEditPVal(p.price.toFixed(2));}} style={{padding:"7px 16px",borderRadius:8,border:`1px solid ${BR}`,background:"none",color:"#8a8070",fontSize:13,cursor:"pointer"}}>Edit Price</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PHOTOS ── */}
        {tab==="photos" && (
          <div className="fade">
            <div style={{marginBottom:28}}>
              <h1 className="disp" style={{fontSize:38,color:G,marginBottom:4}}>Product Photos</h1>
              <p style={{color:"#8a8070",fontSize:15}}>
                {SUPABASE_URL ? "📡 Connected to Supabase Storage" : "💾 Saving locally — add Supabase credentials for cloud storage"}
              </p>
            </div>
            {!SUPABASE_URL && (
              <div style={{background:"#fff8e6",border:"1px solid #fde68a",borderRadius:12,padding:"14px 18px",marginBottom:24,display:"flex",alignItems:"flex-start",gap:10}}>
                <span style={{fontSize:18}}>🔌</span>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:"#92600a",marginBottom:4}}>Connect Supabase Storage for permanent cloud photos</div>
                  <div style={{fontSize:12,color:"#a8780a"}}>1. Create a free project at supabase.com<br/>2. Create a storage bucket called <strong>product-images</strong><br/>3. Paste your project URL and anon key at the top of this file (SUPABASE_URL and SUPABASE_ANON)</div>
                </div>
              </div>
            )}
            {uploading && (
              <div style={{background:"#eef5ee",border:"1px solid #bbf7d0",borderRadius:12,padding:"12px 18px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:16,height:16,border:`2px solid ${G}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.7s linear infinite",flexShrink:0}} />
                <span style={{fontSize:13,color:G,fontWeight:600}}>Uploading photo{SUPABASE_URL?" to Supabase":""}…</span>
              </div>
            )}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(195px,1fr))",gap:16}}>
              {products.map(p=>(
                <div key={p.id} className="img-card" style={{background:CARD,borderRadius:16,border:`1px solid ${BR}`,overflow:"hidden",boxShadow:"0 2px 8px rgba(30,58,30,0.04)"}}>
                  <div style={{position:"relative",height:158,background:"#f5f1eb",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}
                    onClick={()=>{setUploadId(p.id);fileRef.current?.click();}}>
                    {p.image?<img src={p.image} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}} />
                      :<div style={{textAlign:"center"}}><div style={{fontSize:52,marginBottom:6}}>{p.emoji}</div><div style={{fontSize:11,color:"#a89888"}}>No photo yet</div></div>}
                    <div className="img-cover" style={{position:"absolute",inset:0,background:"rgba(30,58,30,0.72)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",opacity:0,transition:"opacity 0.2s"}}>
                      <div style={{fontSize:28,marginBottom:6}}>📷</div>
                      <div style={{fontSize:13,color:"#fff",fontWeight:600}}>{p.image?"Change Photo":"Upload Photo"}</div>
                    </div>
                  </div>
                  <div style={{padding:"12px 14px"}}>
                    <div style={{fontSize:13,fontWeight:600,color:"#1a2a1a",marginBottom:10}}>{p.name}</div>
                    <div style={{display:"flex",gap:6}}>
                      <button onClick={()=>{setUploadId(p.id);fileRef.current?.click();}} style={{flex:1,padding:"8px",borderRadius:8,border:`1.5px solid ${G}`,background:"none",color:G,fontSize:12,fontWeight:600,cursor:"pointer"}}>
                        {p.image?"🔄 Change":"📷 Upload"}
                      </button>
                      {p.image&&<button onClick={()=>removePhoto(p.id)} style={{padding:"8px 10px",borderRadius:8,border:"1px solid #fecaca",background:"#fef2f2",color:"#991b1b",fontSize:12,cursor:"pointer"}}>✕</button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
