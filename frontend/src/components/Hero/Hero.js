import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PLACES = ['Agumbe Rainforest', 'Kudremukh Peak', 'Jog Falls', 'Chikmagalur Coffee Estates', 'Bisle Ghat'];

const Hero = () => {
  const [search, setSearch] = useState('');
  const [placeIdx, setPlaceIdx] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setPlaceIdx(i => (i + 1) % PLACES.length), 2600);
    return () => clearInterval(t);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/trips?search=${search}`);
  };

  const stats = [
    { value: '120+', label: 'Expeditions' },
    { value: '38', label: 'Malnad Trails' },
    { value: '6,200+', label: 'Explorers' },
    { value: '4.9★', label: 'Avg Rating' },
  ];

  return (
    <section style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'120px 24px 80px', position:'relative', overflow:'hidden' }}>
      {/* Background orbs */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'8%', left:'-8%', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(74,186,74,0.07) 0%,transparent 70%)', filter:'blur(40px)' }} />
        <div style={{ position:'absolute', bottom:'10%', right:'-5%', width:480, height:480, borderRadius:'50%', background:'radial-gradient(circle,rgba(212,162,78,0.06) 0%,transparent 70%)', filter:'blur(40px)' }} />
        <div style={{ position:'absolute', top:'50%', right:'15%', width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle,rgba(126,200,200,0.05) 0%,transparent 70%)', filter:'blur(30px)' }} />
      </div>

      {/* Floating info cards */}
      <div style={{ position:'absolute', right:'7%', top:'22%', animation:'float 5s ease-in-out infinite', opacity:0.75 }} className="glass-card desktop-only">
        <div style={{ padding:'14px 18px', minWidth:170 }}>
          <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:4, fontWeight:500 }}>UPCOMING TREK</div>
          <div style={{ fontSize:15, fontWeight:600 }}>Kudremukh Peak</div>
          <div style={{ fontSize:13, color:'var(--accent4)', marginTop:4 }}>✓ 4 slots left</div>
        </div>
      </div>
      <div style={{ position:'absolute', left:'5%', top:'32%', animation:'float 6s ease-in-out infinite 1s', opacity:0.65 }} className="glass-card desktop-only">
        <div style={{ padding:'14px 18px', minWidth:160 }}>
          <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:4, fontWeight:500 }}>TRENDING</div>
          <div style={{ fontSize:15, fontWeight:600 }}>🌿 Agumbe Rainforest</div>
          <div style={{ fontSize:13, color:'var(--accent2)', marginTop:4 }}>From ₹4,500</div>
        </div>
      </div>
      <div style={{ position:'absolute', left:'7%', bottom:'22%', animation:'float 4.5s ease-in-out infinite 0.5s', opacity:0.6 }} className="glass-card desktop-only">
        <div style={{ padding:'12px 16px', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ fontSize:22 }}>⭐</div>
          <div>
            <div style={{ fontSize:13, fontWeight:600 }}>Just reviewed</div>
            <div style={{ fontSize:11, color:'var(--text-muted)' }}>Rohan V. — Jog Falls</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ textAlign:'center', maxWidth:800, position:'relative', zIndex:1 }}>
        <div style={{ marginBottom:24, display:'inline-flex', alignItems:'center', gap:8, padding:'6px 14px', background:'rgba(74,186,74,0.1)', border:'1px solid rgba(74,186,74,0.2)', borderRadius:100, fontSize:13, color:'var(--accent)' }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--accent4)', display:'inline-block', animation:'glow 2s infinite' }}></span>
          Western Ghats · Malnad Region · Karnataka
        </div>

        <h1 className="display-text" style={{ fontSize:'clamp(40px,7vw,80px)', marginBottom:8 }}>
          Discover the
        </h1>
        <h1 className="display-text gradient-text" style={{ fontSize:'clamp(40px,7vw,80px)', marginBottom:28 }}>
          Soul of Malnad
        </h1>

        <p style={{ fontSize:18, color:'var(--text-muted)', lineHeight:1.7, marginBottom:40, maxWidth:560, margin:'0 auto 40px' }}>
          Trek through misty rainforests, sip fresh filter coffee, chase waterfalls, and sleep under stars in the heart of Karnataka's Western Ghats.
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ display:'flex', gap:0, maxWidth:560, margin:'0 auto 16px', background:'rgba(255,255,255,0.04)', border:'1px solid var(--border)', borderRadius:14, overflow:'hidden', padding:6 }}>
          <div style={{ position:'relative', flex:1 }}>
            <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', opacity:0.4, fontSize:16 }}>🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`Search ${PLACES[placeIdx]}...`}
              style={{ background:'none', border:'none', outline:'none', padding:'12px 14px 12px 40px', fontSize:15, color:'var(--text)', fontFamily:'var(--font-body)', width:'100%' }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ borderRadius:10, padding:'12px 24px', flexShrink:0 }}>
            Explore
          </button>
        </form>

        <p style={{ fontSize:13, color:'var(--text-dim)' }}>
          Popular: Agumbe · Chikmagalur · Coorg · Sakleshpur · Kudremukh · Bhadra
        </p>
      </div>

      {/* Stats */}
      <div style={{ display:'flex', gap:40, marginTop:72, flexWrap:'wrap', justifyContent:'center', position:'relative', zIndex:1 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign:'center' }}>
            <div style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:800, letterSpacing:'-0.02em' }}>{s.value}</div>
            <div style={{ fontSize:13, color:'var(--text-muted)', marginTop:4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:6, opacity:0.4 }}>
        <span style={{ fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase' }}>explore</span>
        <div style={{ width:1, height:32, background:'linear-gradient(to bottom,var(--text),transparent)' }} />
      </div>

      <style>{`@media(max-width:900px){.desktop-only{display:none!important}}`}</style>
    </section>
  );
};

export default Hero;
