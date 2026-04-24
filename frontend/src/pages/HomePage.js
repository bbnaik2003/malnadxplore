import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero/Hero';
import TripCard from '../components/TripCard/TripCard';
import { tripsAPI } from '../services/api';

const FEATURES = [
  { icon:'🌧', title:'Monsoon Treks', desc:'Experience the magic of Malnad rains on guided trails through dense shola forests.' },
  { icon:'☕', title:'Coffee Estate Stays', desc:'Sleep in heritage bungalows surrounded by coffee and spice plantations.' },
  { icon:'🦚', title:'Wildlife Safaris', desc:'Spot elephants, leopards, and hornbills in Bhadra, Kudremukh & BRT sanctuaries.' },
  { icon:'💬', title:'Explorer Community', desc:'Chat with fellow nature lovers, share routes, and plan group treks together.' },
  { icon:'🗺', title:'Trail Documents', desc:'Detailed maps, permits, safety guides all available before your trip begins.' },
  { icon:'🔒', title:'Verified Guides', desc:'All expeditions led by certified Malnad-local naturalists and trek leaders.' },
];

const TESTIMONIALS = [
  { name:'Rohith Kamath', trip:'Kudremukh Peak Trek', text:'The mist-covered peaks took our breath away. The local guide knew every hidden trail. Pure magic!', rating:5, avatar:'R' },
  { name:'Preethi Nair', trip:'Agumbe Rainforest Stay', text:'Woke up to hornbills and the smell of coffee. Best weekend escape from Bengaluru I\'ve ever done.', rating:5, avatar:'P' },
  { name:'Suresh Bhat', trip:'Jog Falls & Yana Caves', text:'The Yana rock formations are surreal. MalnadXplore handled all logistics perfectly — 10/10!', rating:5, avatar:'S' },
];

const REGIONS = [
  { name:'Shivamogga', desc:'Rainforests & Waterfalls', icon:'🌊', color:'rgba(126,200,200,0.1)', border:'rgba(126,200,200,0.2)' },
  { name:'Chikmagalur', desc:'Coffee Hills & Peaks', icon:'☕', color:'rgba(212,162,78,0.1)', border:'rgba(212,162,78,0.2)' },
  { name:'Kodagu / Coorg', desc:'Spice Gardens & Forts', icon:'🌶', color:'rgba(163,217,119,0.1)', border:'rgba(163,217,119,0.2)' },
  { name:'Hassan', desc:'Temples & Forests', icon:'🛕', color:'rgba(74,186,74,0.1)', border:'rgba(74,186,74,0.2)' },
  { name:'Dakshina Kannada', desc:'Coastal Ghats Junction', icon:'🏖', color:'rgba(212,162,78,0.1)', border:'rgba(212,162,78,0.2)' },
  { name:'Uttara Kannada', desc:'Beaches Meets Jungle', icon:'🌿', color:'rgba(126,200,200,0.1)', border:'rgba(126,200,200,0.2)' },
];

const HomePage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripsAPI.getAll({ limit: 6 })
      .then(res => setTrips(res.data.trips || []))
      .catch(() => setTrips([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Hero />

      {/* Regions strip */}
      <section style={{ padding:'40px 0', borderBottom:'1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display:'flex', gap:12, overflowX:'auto', paddingBottom:4 }}>
            {REGIONS.map((r,i) => (
              <Link key={i} to={`/trips?search=${r.name}`} style={{ flexShrink:0, textDecoration:'none', display:'flex', alignItems:'center', gap:10, padding:'10px 18px', borderRadius:'var(--radius-sm)', background:r.color, border:`1px solid ${r.border}`, transition:'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
                <span style={{ fontSize:20 }}>{r.icon}</span>
                <div>
                  <div style={{ fontWeight:600, fontSize:13, color:'var(--text)', whiteSpace:'nowrap' }}>{r.name}</div>
                  <div style={{ fontSize:11, color:'var(--text-muted)', whiteSpace:'nowrap' }}>{r.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <span className="tag" style={{ marginBottom:16, display:'inline-block' }}>Why MalnadXplore</span>
            <h2 className="section-title">Everything for your Malnad adventure</h2>
            <p style={{ color:'var(--text-muted)', fontSize:16, maxWidth:480, margin:'0 auto' }}>
              A platform built by Malnad locals, for everyone who wants to discover Karnataka's hidden natural treasures.
            </p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:20 }}>
            {FEATURES.map((f,i) => (
              <div key={i} className="glass-card" style={{ padding:'24px' }}>
                <div style={{ fontSize:32, marginBottom:14 }}>{f.icon}</div>
                <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:17, marginBottom:8 }}>{f.title}</h3>
                <p style={{ fontSize:14, color:'var(--text-muted)', lineHeight:1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Trips */}
      <section className="section" style={{ paddingTop:0 }}>
        <div className="container">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:40, flexWrap:'wrap', gap:16 }}>
            <div>
              <span className="tag" style={{ marginBottom:12, display:'inline-block' }}>Featured</span>
              <h2 className="section-title" style={{ marginBottom:0 }}>Popular Expeditions</h2>
            </div>
            <Link to="/trips" className="btn-secondary" style={{ textDecoration:'none' }}>All expeditions →</Link>
          </div>
          {loading ? (
            <div className="loader" />
          ) : trips.length === 0 ? (
            <div style={{ textAlign:'center', padding:80, color:'var(--text-muted)' }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🌿</div>
              <p>No expeditions yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid-3">
              {trips.map(trip => <TripCard key={trip._id} trip={trip} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ paddingTop:0 }}>
        <div className="container">
          <div className="glass-card" style={{ padding:'60px 40px', textAlign:'center', background:'linear-gradient(135deg,rgba(74,186,74,0.08),rgba(212,162,78,0.06))', borderColor:'rgba(74,186,74,0.15)' }}>
            <div style={{ fontSize:48, marginBottom:20 }}>🌿</div>
            <h2 className="section-title" style={{ marginBottom:16 }}>Ready to explore the Malnad?</h2>
            <p style={{ color:'var(--text-muted)', marginBottom:32, fontSize:16 }}>Join 6,200+ explorers discovering Karnataka's most breathtaking landscapes.</p>
            <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
              <Link to="/register" className="btn-primary" style={{ textDecoration:'none', fontSize:16, padding:'14px 36px' }}>Start Exploring</Link>
              <Link to="/trips" className="btn-secondary" style={{ textDecoration:'none', fontSize:16, padding:'14px 36px' }}>Browse Expeditions</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" style={{ paddingTop:0 }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <span className="tag" style={{ marginBottom:12, display:'inline-block' }}>Explorer Stories</span>
            <h2 className="section-title">What adventurers say</h2>
          </div>
          <div className="grid-3">
            {TESTIMONIALS.map((t,i) => (
              <div key={i} className="glass-card" style={{ padding:'24px 28px' }}>
                <div className="stars" style={{ marginBottom:14 }}>{'★'.repeat(t.rating)}</div>
                <p style={{ fontSize:15, color:'var(--text-muted)', lineHeight:1.7, marginBottom:20, fontStyle:'italic' }}>"{t.text}"</p>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div className="avatar">{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:14 }}>{t.name}</div>
                    <div style={{ fontSize:12, color:'var(--text-dim)' }}>{t.trip}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
