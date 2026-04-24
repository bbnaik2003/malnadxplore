import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tripsAPI } from '../services/api';

const DashboardPage = () => {
  const { user } = useAuth();
  const [myTrips, setMyTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const imgBase = process.env.REACT_APP_API_URL?.replace('/api', '') || '';

  useEffect(() => {
    // Get all trips and filter ones the user joined
    tripsAPI.getAll({ limit: 100 })
      .then(res => {
        const all = res.data.trips || [];
        const joined = all.filter(t => t.travelers?.some(tr => tr.user?._id === user._id || tr.user === user._id));
        setMyTrips(joined);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user._id]);

  const stats = [
    { label: 'Trips Joined', value: myTrips.length, icon: '✈️' },
    { label: 'Countries', value: new Set(myTrips.map(t => t.location?.split(',').pop().trim())).size, icon: '🌍' },
    { label: 'Days Traveled', value: myTrips.reduce((s, t) => s + (t.duration || 0), 0), icon: '📅' },
    { label: 'Co-travelers', value: myTrips.reduce((s, t) => s + (t.travelers?.length || 0), 0), icon: '👥' },
  ];

  return (
    <div style={{ paddingTop: 90 }}>
      <div className="container">
        {/* Profile header */}
        <div className="glass-card" style={{ padding: '32px 36px', marginBottom: 32, display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #4299e1, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, flexShrink: 0 }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, marginBottom: 6 }}>Welcome, {user.name} 👋</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>{user.email} · Member since 2024</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/trips" className="btn-primary" style={{ textDecoration: 'none' }}>Browse Expeditions</Link>
            <Link to="/chat" className="btn-secondary" style={{ textDecoration: 'none' }}>💬 Chat</Link>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
          {stats.map((s, i) => (
            <div key={i} className="glass-card" style={{ padding: '20px 24px' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* My Trips */}
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22 }}>My Trips</h2>
          <Link to="/trips" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: 14 }}>Browse more →</Link>
        </div>

        {loading ? (
          <div className="loader" />
        ) : myTrips.length === 0 ? (
          <div className="glass-card" style={{ padding: '60px 40px', textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>🌍</div>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8, fontSize: 22 }}>No expeditions yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>You haven't joined any trips yet. Start exploring!</p>
            <Link to="/trips" className="btn-primary" style={{ textDecoration: 'none' }}>Explore Expeditions</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {myTrips.map(trip => (
              <div key={trip._id} className="glass-card" style={{ padding: '20px 24px', display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ width: 80, height: 60, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: 'linear-gradient(135deg, rgba(99,179,237,0.1), rgba(167,139,250,0.1))' }}>
                  {trip.images?.[0] ? (
                    <img src={`${imgBase}/uploads/${trip.images[0]}`} alt={trip.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🌍</div>}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{trip.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>📍 {trip.location} · 📅 {trip.duration} days</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <div className="price-badge" style={{ fontSize: 18 }}>₹{trip.price?.toLocaleString()}</div>
                  <span className="tag tag-green" style={{ fontSize: 12 }}>✓ Joined</span>
                </div>
                <Link to={`/trips/${trip._id}`} className="btn-ghost" style={{ textDecoration: 'none', fontSize: 13 }}>View Details</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
