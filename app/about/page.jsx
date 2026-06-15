"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Leaf, Sun, Heart, MapPin, Users, Award } from "lucide-react";
import { useEffect } from "react";

const S = {
  bg: "#f7f5f0",
  card: "#ffffff",
  green: "#1e3a1e",
  greenLight: "#2d5a2d",
  gold: "#b8941f",
  text: "#1a2a1a",
  muted: "#7a7060",
  border: "#e5dfd0",
  tag: "#eef5ee",
  tagText: "#2d5a2d",
};

export default function AboutPage() {
  const router = useRouter();

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Inter:wght@400;500;600&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.textContent = `
      * { font-family: 'Inter', sans-serif; }
      .disp { font-family: 'Playfair Display', Georgia, serif !important; }
      @keyframes fadeUp { from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);} }
      .fade-up{animation:fadeUp 0.45s ease forwards;}
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div style={{ background: S.bg, minHeight: "100vh" }}>
      {/* Header */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 28px", background: "rgba(247,245,240,0.96)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${S.border}` }}>
        <div onClick={() => router.push("/")} style={{ display: "flex", alignItems: "center", gap: 11, cursor: "pointer" }}>
          <div style={{ width: 36, height: 36, background: S.green, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Leaf size={17} color="#fff" />
          </div>
          <div>
            <div className="disp" style={{ fontSize: 20, fontWeight: 700, color: S.green, lineHeight: 1.1 }}>Francis Farms</div>
            <div style={{ fontSize: 10, color: S.muted, letterSpacing: 1.5, textTransform: "uppercase" }}>St. Thomas, USVI</div>
          </div>
        </div>
        <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: S.muted, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 4 }}>
          <ArrowLeft size={14} /> Back to Shop
        </button>
      </nav>

      {/* Hero */}
      <div className="fade-up" style={{ padding: "64px 28px 52px", textAlign: "center", background: "linear-gradient(170deg,#eaf4ea 0%,#f7f5f0 100%)", borderBottom: `1px solid ${S.border}` }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: S.tag, border: "1px solid #c5dcc5", borderRadius: 50, padding: "6px 16px", marginBottom: 22 }}>
          <Leaf size={12} color={S.tagText} />
          <span style={{ fontSize: 11, color: S.tagText, letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 500 }}>Our Story</span>
        </div>
        <h1 className="disp" style={{ fontSize: "clamp(38px, 7vw, 66px)", fontWeight: 700, color: S.green, lineHeight: 1.1, marginBottom: 18 }}>
          Growing Fresh,<br /><em style={{ color: S.gold }}>Grown Local</em>
        </h1>
        <p style={{ color: S.muted, fontSize: 16, maxWidth: 600, margin: "0 auto", lineHeight: 1.8 }}>
          Family-owned and operated on St. Thomas for over 15 years. We're passionate about bringing fresh, pesticide-free produce directly from our farm to your table.
        </p>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 28px 80px" }}>
        {/* Our Mission */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 48 }}>
            {[
              { icon: <Sun size={24} color={S.green} />, title: "Fresh Daily", desc: "Harvested the same morning we deliver. No cold storage, no warehouses — just farm-to-table freshness." },
              { icon: <Leaf size={24} color={S.green} />, title: "No Pesticides", desc: "We grow everything naturally, without harsh chemicals or synthetic fertilizers. Just rich volcanic soil and Caribbean sunshine." },
              { icon: <Heart size={24} color={S.green} />, title: "Family Owned", desc: "Three generations of farming on St. Thomas. We treat every customer like family and every plant with care." },
            ].map((item, i) => (
              <div key={i} style={{ background: S.card, borderRadius: 16, padding: 24, border: `1px solid ${S.border}`, textAlign: "center" }}>
                <div style={{ width: 56, height: 56, background: S.tag, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  {item.icon}
                </div>
                <h3 className="disp" style={{ fontSize: 22, fontWeight: 700, color: S.green, marginBottom: 10 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Story */}
          <div style={{ background: S.card, borderRadius: 20, padding: 40, border: `1px solid ${S.border}`, marginBottom: 40 }}>
            <h2 className="disp" style={{ fontSize: 36, fontWeight: 700, color: S.green, marginBottom: 24 }}>The Francis Farms Story</h2>
            <div style={{ display: "grid", gap: 20, fontSize: 15, color: S.text, lineHeight: 1.8 }}>
              <p>
                Francis Farms started in 2009 when our founder, Francis Emmanuel, decided to transform his family's unused hillside land into something meaningful. What began as a small vegetable garden has grown into one of St. Thomas's most trusted sources for fresh, local produce.
              </p>
              <p>
                We grow everything on rich volcanic soil that's been in our family for three generations. No imported fertilizers, no pesticides — just time-tested farming methods passed down through the years, combined with modern sustainable practices.
              </p>
              <p>
                Every morning before sunrise, we're out in the fields harvesting what's ripe and ready. By mid-morning, those same vegetables, fruits, and herbs are being delivered to your door. That's the Francis Farms difference — you get produce at its absolute peak, the way nature intended.
              </p>
              <p style={{ color: S.green, fontWeight: 600, fontSize: 16 }}>
                "We don't just grow food — we grow relationships. Every tomato, every mango, every bundle of herbs represents our commitment to quality and our love for this island." — Francis Emmanuel, Founder
              </p>
            </div>
          </div>

          {/* What We Grow */}
          <div style={{ marginBottom: 40 }}>
            <h2 className="disp" style={{ fontSize: 36, fontWeight: 700, color: S.green, marginBottom: 24 }}>What We Grow</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              {[
                { category: "Vegetables", items: "Callaloo, Sweet Peppers, Vine Tomatoes, Breadfruit, Cucumbers, Eggplant" },
                { category: "Fruits", items: "Julie Mangoes, Plantains, Pineapples, Coconuts, Papaya, Passion Fruit" },
                { category: "Herbs", items: "Broad Leaf Thyme, Basil, Shadow Beni, Chives, Oregano, Parsley" },
                { category: "Specialty", items: "Farm Fresh Eggs from Free-Range Hens, Seasonal Produce, Custom Orders" },
              ].map((section, i) => (
                <div key={i} style={{ background: S.card, borderRadius: 14, padding: 24, border: `1px solid ${S.border}` }}>
                  <h3 className="disp" style={{ fontSize: 20, fontWeight: 700, color: S.green, marginBottom: 12 }}>{section.category}</h3>
                  <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.7 }}>{section.items}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sustainability */}
          <div style={{ background: S.tag, borderRadius: 20, padding: 40, border: "1px solid #c5dcc5", marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <Award size={28} color={S.green} />
              <h2 className="disp" style={{ fontSize: 32, fontWeight: 700, color: S.green }}>Our Commitment to Sustainability</h2>
            </div>
            <div style={{ display: "grid", gap: 16, fontSize: 15, color: S.text, lineHeight: 1.8 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <span style={{ color: S.green, fontWeight: 700 }}>•</span>
                <p style={{ margin: 0 }}>
                  <strong>Water Conservation:</strong> We use drip irrigation and rainwater collection to minimize water waste
                </p>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <span style={{ color: S.green, fontWeight: 700 }}>•</span>
                <p style={{ margin: 0 }}>
                  <strong>Composting:</strong> All plant waste goes back into the soil as nutrient-rich compost
                </p>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <span style={{ color: S.green, fontWeight: 700 }}>•</span>
                <p style={{ margin: 0 }}>
                  <strong>Zero Pesticides:</strong> We rely on companion planting and natural pest control methods
                </p>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <span style={{ color: S.green, fontWeight: 700 }}>•</span>
                <p style={{ margin: 0 }}>
                  <strong>Minimal Packaging:</strong> Reusable containers and biodegradable materials whenever possible
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="disp" style={{ fontSize: 36, fontWeight: 700, color: S.green, marginBottom: 24 }}>Visit Us</h2>
            <div style={{ background: S.card, borderRadius: 20, border: `1px solid ${S.border}`, overflow: "hidden" }}>
              <div style={{ padding: "26px 28px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, background: S.tag, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <MapPin size={18} color={S.green} />
                </div>
                <div>
                  <h3 className="disp" style={{ fontSize: 24, fontWeight: 700, color: S.green, marginBottom: 2 }}>Farm Location</h3>
                  <p style={{ fontSize: 13, color: S.muted }}>Near Cost U Less · Weymouth Rhymer Hwy, St. Thomas</p>
                </div>
              </div>
              <iframe title="Francis Farms Location" src="https://maps.google.com/maps?q=18.3485,-64.9312&t=&z=15&ie=UTF8&iwloc=&output=embed" width="100%" height="340" style={{ border: 0, display: "block" }} allowFullScreen loading="lazy" />
              <div style={{ padding: "20px 28px", borderTop: `1px solid ${S.border}` }}>
                <p style={{ fontSize: 14, color: S.muted, marginBottom: 16 }}>
                  We welcome visitors! Stop by Monday through Saturday, 7 AM to 5 PM. See the farm, meet our team, and pick up fresh produce directly from the source.
                </p>
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontSize: 14, color: S.text }}>
                  <div><strong>Phone:</strong> (340) 000-0000</div>
                  <div><strong>Email:</strong> orders@francisfarms.vi</div>
                  <div><strong>Hours:</strong> Mon–Sat, 7 AM – 5 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <button onClick={() => router.push("/")} style={{ background: S.green, color: "#fff", border: "none", borderRadius: 12, padding: "16px 40px", fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", boxShadow: "0 4px 16px rgba(30,58,30,0.2)" }}>
            Start Shopping →
          </button>
        </div>
      </div>
    </div>
  );
}
