import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { usersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdminUsers = () => {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    usersAPI.getAll()
      .then(res => setUsers(res.data || []))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (id === me._id) { toast.error("Can't delete your own account"); return; }
    if (!window.confirm('Delete this user?')) return;
    setDeleting(id);
    try {
      await usersAPI.delete(id);
      setUsers(u => u.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch { toast.error('Delete failed'); }
    finally { setDeleting(null); }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const admins = users.filter(u => u.role === 'admin').length;
  const travelers = users.filter(u => u.role === 'user').length;

  return (
    <div style={{ paddingTop: 90 }}>
      <div className="container">
        <div style={{ marginBottom: 32 }}>
          <span className="tag tag-orange" style={{ marginBottom: 10, display: 'inline-block' }}>Admin</span>
          <h1 className="section-title" style={{ marginBottom: 0 }}>User Management</h1>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Total Users', value: users.length, icon: '👥', color: 'var(--accent)' },
            { label: 'Travelers', value: travelers, icon: '✈️', color: 'var(--accent3)' },
            { label: 'Admins', value: admins, icon: '🛡️', color: 'var(--accent2)' },
          ].map((s, i) => (
            <div key={i} className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: 28 }}>{s.icon}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="glass-card" style={{ padding: '14px 20px', marginBottom: 24 }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>🔍</span>
            <input className="input-3d" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users by name or email..."
              style={{ paddingLeft: 38, border: 'none', background: 'transparent', boxShadow: 'none' }} />
          </div>
        </div>

        {/* Users table */}
        {loading ? (
          <div className="loader" />
        ) : (
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 200px 120px 100px 120px', gap: 16, fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <span>USER</span><span>EMAIL</span><span>ROLE</span><span>TRIPS</span><span>ACTION</span>
            </div>
            {filtered.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No users found</div>
            ) : (
              filtered.map((u, i) => (
                <div key={u._id} style={{ padding: '14px 24px', display: 'grid', gridTemplateColumns: '1fr 200px 120px 100px 120px', gap: 16, alignItems: 'center', borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="avatar" style={{ width: 34, height: 34, fontSize: 13 }}>{u.name?.charAt(0).toUpperCase()}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                      {u._id === me._id && <div style={{ fontSize: 11, color: 'var(--accent)' }}>You</div>}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                  <span className={`badge ${u.role === 'admin' ? 'badge-hot' : 'badge-new'}`}>{u.role}</span>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{u.joinedTrips?.length || 0}</div>
                  <button onClick={() => handleDelete(u._id)} disabled={deleting === u._id || u._id === me._id}
                    style={{ padding: '6px 12px', fontSize: 12, background: u._id === me._id ? 'rgba(255,255,255,0.03)' : 'rgba(245,101,101,0.1)', border: `1px solid ${u._id === me._id ? 'var(--border)' : 'rgba(245,101,101,0.2)'}`, color: u._id === me._id ? 'var(--text-dim)' : '#fc8181', borderRadius: 'var(--radius-sm)', cursor: u._id === me._id ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s', opacity: u._id === me._id ? 0.4 : 1 }}>
                    {deleting === u._id ? '...' : 'Delete'}
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
