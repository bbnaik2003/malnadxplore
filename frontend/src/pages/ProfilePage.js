import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, email: user.email });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      const res = await authAPI.updateProfile(formData);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  return (
    <div style={{ paddingTop: 90 }}>
      <div className="container" style={{ maxWidth: 720 }}>
        <h1 className="section-title" style={{ marginBottom: 32 }}>My Profile</h1>

        <div className="glass-card" style={{ padding: '32px 36px', marginBottom: 24 }}>
          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #4299e1, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800 }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, marginBottom: 4 }}>{user.name}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{user.email}</p>
              <span className={`badge ${user.role === 'admin' ? 'badge-hot' : 'badge-new'}`} style={{ marginTop: 8, display: 'inline-flex' }}>
                {user.role?.toUpperCase()}
              </span>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="input-3d" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="input-3d" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <button type="submit" className="btn-primary" disabled={saving} style={{ marginTop: 8 }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        <div className="glass-card" style={{ padding: '24px 32px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 20 }}>Account Details</h3>
          {[
            { label: 'Member ID', value: user._id?.slice(-8).toUpperCase() },
            { label: 'Account Type', value: user.role },
            { label: 'Status', value: 'Active' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{item.label}</span>
              <span style={{ fontWeight: 500, fontSize: 14, textTransform: 'capitalize' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
