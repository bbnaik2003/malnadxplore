import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error("Passwords don't match"); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome to MalnadXplore 🌍');
      navigate('/trips');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const PERKS = ['Browse 80+ Malnad expeditions', 'Connect with nature explorers', 'Secure booking system', 'Trip documents & guides'];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 40px' }}>
      <div style={{ width: '100%', maxWidth: 900, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
        {/* Left */}
        <div className="desktop-only">
          <div style={{ marginBottom: 16 }}>
            <span className="tag">Join MalnadXplore</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(32px, 4vw, 44px)', lineHeight: 1.1, marginBottom: 16 }}>
            Start your Malnad adventure today
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
            Join thousands of travelers who plan, book, and experience the world through MalnadXplore.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {PERKS.map((perk, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(104,211,145,0.15)', border: '1px solid rgba(104,211,145,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--accent3)', flexShrink: 0 }}>✓</div>
                <span style={{ fontSize: 15, color: 'var(--text-muted)' }}>{perk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: 32 }} className="mobile-only">
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28 }}>Create Account</h1>
          </div>
          <div className="glass-card" style={{ padding: 36 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, marginBottom: 24 }}>Create your account</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="input-3d" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="input-3d" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="you@email.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="input-3d" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required placeholder="Min. 6 characters" />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input className="input-3d" type="password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} required placeholder="Re-enter password" />
              </div>
              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', fontSize: 16, padding: '14px', marginTop: 8 }}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
            <div className="divider" style={{ margin: '20px 0' }} />
            <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
              Already have an account? <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Sign in →</Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .desktop-only { display: none !important; }
        }
        @media (min-width: 701px) {
          .mobile-only { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
