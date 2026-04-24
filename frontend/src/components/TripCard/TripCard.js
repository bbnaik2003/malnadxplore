import React from 'react';
import { Link } from 'react-router-dom';

const TripCard = ({ trip }) => {
  const spotsLeft = trip.maxTravelers - (trip.travelers?.length || 0);
  const fillPct = Math.min(100, Math.round(((trip.travelers?.length || 0) / (trip.maxTravelers || 1)) * 100));

  const getStatusBadge = () => {
    if (spotsLeft === 0) return { text: 'SOLD OUT', cls: 'badge-full' };
    if (spotsLeft <= 3) return { text: 'HOT', cls: 'badge-hot' };
    return { text: 'OPEN', cls: 'badge-new' };
  };

  const badge = getStatusBadge();

  return (
    <div className="glass-card" style={{ cursor: 'pointer' }}>
      {/* Image */}
      <div style={{ height: 200, overflow: 'hidden', borderRadius: 'var(--radius) var(--radius) 0 0', position: 'relative' }}>
        {trip.images?.[0] ? (
          <img
            src={`${process.env.REACT_APP_API_URL?.replace('/api','') || ''}/uploads/${trip.images[0]}`}
            alt={trip.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(99,179,237,0.15), rgba(167,139,250,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
            🌍
          </div>
        )}
        {/* Gradient overlay */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to top, rgba(10,10,26,0.8), transparent)' }} />
        {/* Badge */}
        <span className={`badge ${badge.cls}`} style={{ position: 'absolute', top: 12, right: 12 }}>{badge.text}</span>
        {/* Duration overlay */}
        <div style={{ position: 'absolute', bottom: 12, left: 14, fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
          📅 {trip.duration} days
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, lineHeight: 1.3 }}>{trip.title}</h3>
          <div className="price-badge" style={{ fontSize: 18, flexShrink: 0, marginLeft: 8 }}>
            ₹{trip.price?.toLocaleString()}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, color: 'var(--text-muted)', fontSize: 13 }}>
          <span>📍</span>
          <span>{trip.location}</span>
        </div>

        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {trip.description}
        </p>

        {/* Tags */}
        {trip.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            {trip.tags.slice(0, 3).map((t, i) => (
              <span key={i} className="tag" style={{ fontSize: 11 }}>{t}</span>
            ))}
          </div>
        )}

        {/* Progress */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
            <span>{trip.travelers?.length || 0} joined</span>
            <span>{spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full'}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${fillPct}%` }} />
          </div>
        </div>

        <Link
          to={`/trips/${trip._id}`}
          className="btn-primary"
          style={{ display: 'block', textAlign: 'center', textDecoration: 'none', width: '100%' }}
        >
          {spotsLeft > 0 ? 'View Details' : 'View Trip'}
        </Link>
      </div>
    </div>
  );
};

export default TripCard;
