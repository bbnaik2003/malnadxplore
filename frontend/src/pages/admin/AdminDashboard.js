import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { tripsAPI, usersAPI, bookingsAPI } from '../../services/api';

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className="glass-card" style={{ padding: '24px 28px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
      <div style={{ fontSize: 28 }}>{icon}</div>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
    </div>
    <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, marginBottom: 4 }}>{value}</div>
    <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
    {sub && <div style={{ fontSize: 12, color: 'var(--accent3)' }}>{sub}</div>}
  </div>
);

const AdminDashboard = () => {
  const [trips, setTrips] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      tripsAPI.getAll({ limit: 100 }),
      usersAPI.getAll(),
    ]).then(([tripsRes, usersRes]) => {
      setTrips(tripsRes.data.trips || []);
      setUsers(usersRes.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const totalRevenue = trips.reduce((s, t) => s + (t.price * (t.travelers?.length || 0)), 0);
  const totalTravelers = trips.reduce((s, t) => s + (t.travelers?.length || 0), 0);
  const recentTrips = [...trips].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const recentUsers = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const imgBase = process.env.REACT_APP_API_URL?.replace('/api', '') || '';

  if (loading) return <div style={{ paddingTop: 120 }}><div className="loader" /></div>;

  return (
    <div style={{ paddingTop: 90 }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span className="tag tag-orange" style={{ marginBottom: 12, display: 'inline-block' }}>Admin Panel</span>
            <h1 className="section-title" style={{ marginBottom: 0 }}>Dashboard Overview</h1>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/admin/trips" className="btn-primary" style={{ textDecoration: 'none' }}>+ Add Trip</Link>
            <Link to="/admin/users" className="btn-secondary" style={{ textDecoration: 'none' }}>Manage Users</Link>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, marginBottom: 40 }}>
          <StatCard icon="🧳" label="Total Trips" value={trips.length} sub="+3 this week" color="#63b3ed" />
          <StatCard icon="👥" label="Registered Users" value={users.length} sub={`${users.filter(u => u.role === 'user').length} travelers`} color="#68d391" />
          <StatCard icon="🎫" label="Total Bookings" value={totalTravelers} sub="All time" color="#f6ad55" />
          <StatCard icon="💰" label="Revenue" value={`₹${(totalRevenue / 1000).toFixed(0)}K`} sub="Estimated" color="#a78bfa" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
          {/* Recent Trips */}
          <div className="glass-card" style={{ padding: '24px 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>Recent Trips</h2>
              <Link to="/admin/trips" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: 13 }}>Manage →</Link>
            </div>
            {recentTrips.map((trip, i) => (
              <div key={trip._id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < recentTrips.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: 42, height: 36, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: 'rgba(99,179,237,0.1)' }}>
                  {trip.images?.[0]
                    ? <img src={`${imgBase}/uploads/${trip.images[0]}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🌍</div>
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{trip.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{trip.travelers?.length || 0}/{trip.maxTravelers} travelers</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--accent2)' }}>₹{trip.price?.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{trip.duration}d</div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Users */}
          <div className="glass-card" style={{ padding: '24px 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>Recent Users</h2>
              <Link to="/admin/users" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: 13 }}>View all →</Link>
            </div>
            {recentUsers.map((u, i) => (
              <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < recentUsers.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div className="avatar" style={{ width: 36, height: 36, fontSize: 13 }}>{u.name?.charAt(0).toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.email}</div>
                </div>
                <span className={`badge ${u.role === 'admin' ? 'badge-hot' : 'badge-new'}`}>{u.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="glass-card" style={{ padding: '24px 28px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Quick Actions</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { label: '+ New Trip', to: '/admin/trips', primary: true },
              { label: '👥 Users', to: '/admin/users' },
              { label: '🏠 Home', to: '/' },
              { label: '✈️ All Trips', to: '/trips' },
            ].map((a, i) => (
              <Link key={i} to={a.to} className={a.primary ? 'btn-primary' : 'btn-ghost'} style={{ textDecoration: 'none' }}>{a.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
