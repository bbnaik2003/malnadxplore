import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { tripsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TripDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeImg, setActiveImg] = useState(0);
  const [bookingForm, setBookingForm] = useState({ name: user?.name || '', age: '', contact: '' });
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    tripsAPI.getById(id)
      .then(res => setTrip(res.data))
      .catch(() => toast.error('Trip not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const hasJoined = trip?.travelers?.some(t => t.user?._id === user?._id || t.user === user?._id);
  const spotsLeft = trip ? trip.maxTravelers - (trip.travelers?.length || 0) : 0;

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setJoining(true);
    try {
      await tripsAPI.join(id, bookingForm);
      toast.success('🎉 Successfully joined the trip!');
      setShowBooking(false);
      const res = await tripsAPI.getById(id);
      setTrip(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join trip');
    } finally { setJoining(false); }
  };

  const TABS = ['overview', 'schedule', 'documents', 'travelers'];

  if (loading) return <div style={{ paddingTop: 120 }}><div className="loader" /></div>;
  if (!trip) return <div style={{ paddingTop: 120, textAlign: 'center' }}>Trip not found</div>;

  const imgBase = process.env.REACT_APP_API_URL?.replace('/api', '') || '';

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero image gallery */}
      <div style={{ height: 420, position: 'relative', overflow: 'hidden' }}>
        {trip.images?.length > 0 ? (
          <>
            <img src={`${imgBase}/uploads/${trip.images[activeImg]}`} alt={trip.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.4s' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(10,10,26,0.9))' }} />
            {trip.images.length > 1 && (
              <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
                {trip.images.map((_, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    style={{ width: i === activeImg ? 24 : 8, height: 8, borderRadius: 4, background: i === activeImg ? 'var(--accent)' : 'rgba(255,255,255,0.3)', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(99,179,237,0.1), rgba(167,139,250,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>🌍</div>
        )}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <div className="container" style={{ paddingBottom: 24 }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
              {trip.tags?.map((t, i) => <span key={i} className="tag">{t}</span>)}
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800 }}>{trip.title}</h1>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Info bar */}
        <div className="glass-card" style={{ padding: '20px 28px', margin: '-20px 0 32px', display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'center' }}>
          <div><div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>LOCATION</div><div style={{ fontWeight: 600 }}>📍 {trip.location}</div></div>
          <div><div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>DURATION</div><div style={{ fontWeight: 600 }}>📅 {trip.duration} days</div></div>
          <div><div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>TRAVELERS</div><div style={{ fontWeight: 600 }}>👥 {trip.travelers?.length || 0}/{trip.maxTravelers}</div></div>
          <div><div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>PRICE</div><div className="price-badge">₹{trip.price?.toLocaleString()}</div></div>
          <div style={{ marginLeft: 'auto' }}>
            {hasJoined ? (
              <span className="tag tag-green" style={{ padding: '10px 20px', fontSize: 14 }}>✓ You've joined this trip</span>
            ) : spotsLeft > 0 ? (
              <button className="btn-primary" onClick={() => user ? setShowBooking(true) : navigate('/login')} style={{ fontSize: 16, padding: '12px 28px' }}>
                Book Now — ₹{trip.price?.toLocaleString()}
              </button>
            ) : (
              <span className="badge badge-full" style={{ padding: '10px 20px', fontSize: 14 }}>Sold Out</span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 32, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: activeTab === tab ? 'var(--accent)' : 'var(--text-muted)', borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent', marginBottom: -1, textTransform: 'capitalize', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}>
              {tab}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'start' }}>
          {/* Tab content */}
          <div>
            {activeTab === 'overview' && (
              <div className="glass-card" style={{ padding: 28 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, marginBottom: 16 }}>About this trip</h2>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: 15, whiteSpace: 'pre-line' }}>{trip.description}</p>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div>
                {trip.schedule?.length > 0 ? trip.schedule.map((day, i) => (
                  <div key={i} className="glass-card" style={{ padding: '20px 24px', marginBottom: 16, display: 'flex', gap: 20 }}>
                    <div style={{ width: 50, height: 50, borderRadius: 12, background: 'rgba(99,179,237,0.1)', border: '1px solid rgba(99,179,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, flexDirection: 'column' }}>
                      <div style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 600 }}>DAY</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--accent)' }}>{day.day}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 6 }}>{day.time && <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 13, marginRight: 8 }}>⏰ {day.time}</span>}{day.activities}</div>
                    </div>
                  </div>
                )) : <div className="glass-card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No schedule available yet.</div>}
              </div>
            )}

            {activeTab === 'documents' && (
              <div>
                {trip.documents?.length > 0 ? trip.documents.map((doc, i) => (
                  <div key={i} className="glass-card" style={{ padding: '16px 20px', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ fontSize: 24 }}>📄</div>
                      <div><div style={{ fontWeight: 500 }}>{doc}</div><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>PDF Document</div></div>
                    </div>
                    <a href={`${imgBase}/uploads/${doc}`} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ textDecoration: 'none', fontSize: 13 }}>Download</a>
                  </div>
                )) : <div className="glass-card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No documents uploaded yet.</div>}
              </div>
            )}

            {activeTab === 'travelers' && (
              <div>
                {trip.travelers?.length > 0 ? trip.travelers.map((t, i) => (
                  <div key={i} className="glass-card" style={{ padding: '14px 20px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div className="avatar">{t.name?.charAt(0) || '?'}</div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Age {t.age} · {t.contact}</div>
                    </div>
                  </div>
                )) : <div className="glass-card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No travelers yet. Be the first!</div>}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 20 }}>Trip Summary</h3>
              {[
                { icon: '📍', label: 'Location', value: trip.location },
                { icon: '📅', label: 'Duration', value: `${trip.duration} days` },
                { icon: '💰', label: 'Price', value: `₹${trip.price?.toLocaleString()}` },
                { icon: '👥', label: 'Group Size', value: `Max ${trip.maxTravelers} people` },
                { icon: '🎟️', label: 'Spots Left', value: `${spotsLeft} available` },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{item.icon} {item.label}</span>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{item.value}</span>
                </div>
              ))}
            </div>
            {!hasJoined && spotsLeft > 0 && (
              <button className="btn-primary" style={{ width: '100%', fontSize: 16, padding: '14px' }}
                onClick={() => user ? setShowBooking(true) : navigate('/login')}>
                Join This Trip
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowBooking(false)}>
          <div className="glass-card" style={{ width: '100%', maxWidth: 460, padding: 36 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, marginBottom: 8 }}>Book Your Spot</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 28 }}>{trip.title} · ₹{trip.price?.toLocaleString()}</p>
            <form onSubmit={handleJoin}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="input-3d" value={bookingForm.name} onChange={e => setBookingForm(f => ({ ...f, name: e.target.value }))} required placeholder="Your name" />
              </div>
              <div className="form-group">
                <label className="form-label">Age</label>
                <input className="input-3d" type="number" min="18" max="75" value={bookingForm.age} onChange={e => setBookingForm(f => ({ ...f, age: e.target.value }))} required placeholder="Your age" />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Number</label>
                <input className="input-3d" type="tel" value={bookingForm.contact} onChange={e => setBookingForm(f => ({ ...f, contact: e.target.value }))} required placeholder="+91 98765 43210" />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="button" className="btn-secondary" onClick={() => setShowBooking(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={joining} style={{ flex: 2 }}>
                  {joining ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .trip-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default TripDetailPage;
