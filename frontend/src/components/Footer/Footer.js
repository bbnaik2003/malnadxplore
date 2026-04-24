import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ borderTop:'1px solid var(--border)', padding:'60px 0 32px', marginTop:80 }}>
    <div className="container">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:40, marginBottom:48 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:'linear-gradient(135deg,#3da83d,#2e8c2e)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🌿</div>
            <span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:17 }}>MalnadXplore</span>
          </div>
          <p style={{ fontSize:14, color:'var(--text-muted)', lineHeight:1.7 }}>
            Explore the Western Ghats, Malnad region, Karnataka. Treks, waterfalls, coffee trails, and wildlife — all in one platform.
          </p>
          <div style={{ marginTop:16, fontSize:13, color:'var(--text-muted)' }}>
            🌿 Karnataka's premier nature expedition platform
          </div>
        </div>
        <div>
          <h4 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:16, fontSize:15 }}>Explore</h4>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {['Expeditions', 'Trekking', 'Waterfalls', 'Coffee Trails', 'Wildlife'].map(item => (
              <Link key={item} to="/trips" style={{ color:'var(--text-muted)', textDecoration:'none', fontSize:14, transition:'color 0.2s' }}
                onMouseEnter={e => e.target.style.color='var(--text)'}
                onMouseLeave={e => e.target.style.color='var(--text-muted)'}>
                {item}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:16, fontSize:15 }}>Account</h4>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {[['Join Us', '/register'],['Login', '/login'],['Dashboard', '/dashboard'],['Community', '/chat']].map(([label, path]) => (
              <Link key={label} to={path} style={{ color:'var(--text-muted)', textDecoration:'none', fontSize:14, transition:'color 0.2s' }}
                onMouseEnter={e => e.target.style.color='var(--text)'}
                onMouseLeave={e => e.target.style.color='var(--text-muted)'}>
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:16, fontSize:15 }}>Contact</h4>
          <div style={{ display:'flex', flexDirection:'column', gap:10, fontSize:14, color:'var(--text-muted)' }}>
            <span>📧 hello@malnadxplore.in</span>
            <span>📞 +91 7760475349</span>
            <span>📍 Shivamogga, Karnataka</span>
          </div>
          <div style={{ display:'flex', gap:10, marginTop:20 }}>
            {['🐦','📸','▶️','💼'].map((icon, i) => (
              <div key={i} style={{ width:36, height:36, borderRadius:9, background:'var(--card)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:16, transition:'all 0.2s' }}
                onMouseEnter={e => { e.target.style.background='rgba(74,186,74,0.1)'; e.target.style.borderColor='var(--accent)'; }}
                onMouseLeave={e => { e.target.style.background='var(--card)'; e.target.style.borderColor='var(--border)'; }}>
                {icon}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="divider" style={{ margin:'0 0 24px' }} />
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
        <span style={{ fontSize:13, color:'var(--text-dim)' }}>© 2024 MalnadXplore. Proudly from Karnataka 🌿</span>
        <div style={{ display:'flex', gap:24 }}>
          {['Privacy','Terms','Safety'].map(item => (
            <a key={item} href="#" style={{ color:'var(--text-dim)', textDecoration:'none', fontSize:13 }}>{item}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
