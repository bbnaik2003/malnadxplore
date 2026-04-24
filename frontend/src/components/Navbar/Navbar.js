import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, zIndex:100,
      padding: scrolled ? '12px 0' : '20px 0',
      background: scrolled ? 'rgba(8,15,8,0.88)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(74,186,74,0.1)' : 'none',
      transition:'all 0.3s ease',
    }}>
      <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Link to="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#3da83d,#2e8c2e)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, boxShadow:'0 4px 12px rgba(61,168,61,0.4)' }}>🌿</div>
          <div>
            <span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:18, color:'var(--text)', letterSpacing:'-0.01em' }}>MalnadXplore</span>
          </div>
        </Link>

        <div style={{ display:'flex', alignItems:'center', gap:32 }} className="desktop-nav">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link to="/trips" className={`nav-link ${isActive('/trips') ? 'active' : ''}`}>Expeditions</Link>
          {user && <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link>}
          {user && <Link to="/chat" className={`nav-link ${isActive('/chat') ? 'active' : ''}`}>Community</Link>}
          {user?.role === 'admin' && <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`} style={{ color:'var(--accent2)' }}>Admin</Link>}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {user ? (
            <>
              <Link to="/profile" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none' }}>
                <div className="avatar" style={{ width:34, height:34, fontSize:13 }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize:14, color:'var(--text-muted)' }} className="desktop-nav">{user.name?.split(' ')[0]}</span>
              </Link>
              <button className="btn-ghost" onClick={handleLogout} style={{ padding:'7px 16px', fontSize:14 }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary" style={{ textDecoration:'none', padding:'9px 20px', fontSize:14 }}>Login</Link>
              <Link to="/register" className="btn-primary" style={{ textDecoration:'none', padding:'9px 20px', fontSize:14 }}>Join Us</Link>
            </>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ display:'none', background:'none', border:'none', color:'var(--text)', fontSize:22, cursor:'pointer', padding:4 }} className="mobile-menu-btn">☰</button>
        </div>
      </div>

      {menuOpen && (
        <div style={{ background:'rgba(8,15,8,0.97)', backdropFilter:'blur(20px)', borderTop:'1px solid var(--border)', padding:'16px 24px' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/trips" className="nav-link" onClick={() => setMenuOpen(false)}>Expeditions</Link>
            {user && <Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>}
            {user && <Link to="/chat" className="nav-link" onClick={() => setMenuOpen(false)}>Community</Link>}
          </div>
        </div>
      )}
      <style>{`@media(max-width:768px){.desktop-nav{display:none!important}.mobile-menu-btn{display:block!important}}`}</style>
    </nav>
  );
};

export default Navbar;
