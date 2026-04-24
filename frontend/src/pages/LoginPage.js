import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}! ✈️`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 40px', position: 'relative' }}>
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(99,179,237,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      </div>

      <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #4299e1, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(66,153,225,0.3)' }}>✈</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30, marginBottom: 8 }}>Welcome back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Sign in to continue your adventure</p>
        </div>

        <div className="glass-card" style={{ padding: 36 }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="input-3d" type="email" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="you@email.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="input-3d" type="password" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required placeholder="••••••••" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
              <a href="#" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>Forgot password?</a>
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', fontSize: 16, padding: '14px' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="divider" style={{ margin: '24px 0' }} />

          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Create one free →</Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="glass-card" style={{ padding: '14px 20px', marginTop: 16, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: 11, color: 'var(--text-dim)', display: 'block', marginBottom: 2 }}>User demo</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>user@demo.com / demo123</span>
          </div>
          <div style={{ width: 1, background: 'var(--border)' }} />
          <div>
            <span style={{ fontSize: 11, color: 'var(--text-dim)', display: 'block', marginBottom: 2 }}>Admin demo</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>admin@demo.com / admin123</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
