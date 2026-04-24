import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TripCard from '../components/TripCard/TripCard';
import { tripsAPI } from '../services/api';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'duration_asc', label: 'Shortest First' },
];

const TripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    minPrice: '', maxPrice: '', duration: '', sort: 'newest',
  });

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await tripsAPI.getAll(filters);
      setTrips(res.data.trips || []);
      setTotal(res.data.total || 0);
    } catch { setTrips([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTrips(); }, [filters]);

  const handleFilter = (key, val) => setFilters(f => ({ ...f, [key]: val }));

  return (
    <div style={{ paddingTop: 90 }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 className="section-title">Discover Expeditions</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>
            {total > 0 ? `${total} trips available` : "Explore Malnad's best expeditions"}
          </p>
        </div>

        {/* Search + Filters */}
        <div className="glass-card" style={{ padding: '20px 24px', marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '2 1 240px' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>🔍</span>
              <input
                className="input-3d"
                type="text"
                placeholder="Search destinations, trips..."
                value={filters.search}
                onChange={e => handleFilter('search', e.target.value)}
                style={{ paddingLeft: 38 }}
              />
            </div>
            <input className="input-3d" type="number" placeholder="Min ₹" value={filters.minPrice}
              onChange={e => handleFilter('minPrice', e.target.value)} style={{ flex: '1 1 100px', width: 'auto' }} />
            <input className="input-3d" type="number" placeholder="Max ₹" value={filters.maxPrice}
              onChange={e => handleFilter('maxPrice', e.target.value)} style={{ flex: '1 1 100px', width: 'auto' }} />
            <input className="input-3d" type="number" placeholder="Days" value={filters.duration}
              onChange={e => handleFilter('duration', e.target.value)} style={{ flex: '1 1 80px', width: 'auto' }} />
            <select className="input-3d" value={filters.sort} onChange={e => handleFilter('sort', e.target.value)}
              style={{ flex: '1 1 180px', width: 'auto' }}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} style={{ background: '#0d1117' }}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="loader" />
        ) : trips.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>🔭</div>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>No trips found</h3>
            <p>Try adjusting your filters or search terms.</p>
            <button className="btn-primary" style={{ marginTop: 24 }} onClick={() => setFilters({ search: '', minPrice: '', maxPrice: '', duration: '', sort: 'newest' })}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid-3">
            {trips.map(trip => <TripCard key={trip._id} trip={trip} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripsPage;
