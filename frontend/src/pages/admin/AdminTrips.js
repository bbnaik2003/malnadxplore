import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { tripsAPI } from '../../services/api';

const EMPTY_FORM = {
  title: '', location: '', description: '', price: '', duration: '',
  maxTravelers: 20, tags: '', images: [], documents: [],
  schedule: [{ day: 1, activities: '', time: '' }],
};

const AdminTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const imgBase = process.env.REACT_APP_API_URL?.replace('/api', '') || '';

  const fetchTrips = () => {
    setLoading(true);
    tripsAPI.getAll({ limit: 100 })
      .then(res => setTrips(res.data.trips || []))
      .catch(() => toast.error('Failed to load trips'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTrips(); }, []);

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); };
  const openEdit = (trip) => {
    setForm({
      title: trip.title || '', location: trip.location || '',
      description: trip.description || '', price: trip.price || '',
      duration: trip.duration || '', maxTravelers: trip.maxTravelers || 20,
      tags: trip.tags?.join(', ') || '',
      schedule: trip.schedule?.length ? trip.schedule : [{ day: 1, activities: '', time: '' }],
      images: [], documents: [],
    });
    setEditId(trip._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      ['title', 'location', 'description', 'price', 'duration', 'maxTravelers'].forEach(k => fd.append(k, form[k]));
      fd.append('tags', form.tags);
      fd.append('schedule', JSON.stringify(form.schedule));
      form.images.forEach(f => fd.append('images', f));
      form.documents.forEach(f => fd.append('documents', f));

      if (editId) {
        await tripsAPI.update(editId, fd);
        toast.success('Trip updated!');
      } else {
        await tripsAPI.create(fd);
        toast.success('Trip created! 🎉');
      }
      setShowForm(false);
      fetchTrips();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this trip?')) return;
    setDeleting(id);
    try {
      await tripsAPI.delete(id);
      toast.success('Trip deleted');
      fetchTrips();
    } catch { toast.error('Delete failed'); }
    finally { setDeleting(null); }
  };

  const addScheduleDay = () => setForm(f => ({ ...f, schedule: [...f.schedule, { day: f.schedule.length + 1, activities: '', time: '' }] }));
  const updateSchedule = (i, key, val) => setForm(f => ({ ...f, schedule: f.schedule.map((d, idx) => idx === i ? { ...d, [key]: val } : d) }));
  const removeScheduleDay = (i) => setForm(f => ({ ...f, schedule: f.schedule.filter((_, idx) => idx !== i) }));

  return (
    <div style={{ paddingTop: 90 }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span className="tag tag-orange" style={{ marginBottom: 10, display: 'inline-block' }}>Admin</span>
            <h1 className="section-title" style={{ marginBottom: 0 }}>Manage Trips</h1>
          </div>
          <button className="btn-primary" onClick={openCreate} style={{ fontSize: 15, padding: '12px 24px' }}>+ Create Trip</button>
        </div>

        {loading ? (
          <div className="loader" />
        ) : trips.length === 0 ? (
          <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🧳</div>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>No trips yet. Create your first trip!</p>
            <button className="btn-primary" onClick={openCreate}>Create Trip</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {trips.map(trip => (
              <div key={trip._id} className="glass-card" style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
                <div style={{ width: 72, height: 52, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: 'rgba(99,179,237,0.08)' }}>
                  {trip.images?.[0]
                    ? <img src={`${imgBase}/uploads/${trip.images[0]}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🌍</div>
                  }
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{trip.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>📍 {trip.location} · 📅 {trip.duration} days</div>
                </div>
                <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent2)', fontSize: 17 }}>₹{trip.price?.toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>price</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: 17 }}>{trip.travelers?.length || 0}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>joined</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-ghost" onClick={() => openEdit(trip)} style={{ padding: '7px 14px', fontSize: 13 }}>✏️ Edit</button>
                    <button onClick={() => handleDelete(trip._id)} disabled={deleting === trip._id}
                      style={{ padding: '7px 14px', fontSize: 13, background: 'rgba(245,101,101,0.1)', border: '1px solid rgba(245,101,101,0.2)', color: '#fc8181', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}>
                      {deleting === trip._id ? '...' : '🗑️ Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="glass-card" style={{ width: '100%', maxWidth: 680, maxHeight: '90vh', overflowY: 'auto', padding: '36px 40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24 }}>
                {editId ? 'Edit Trip' : 'Create New Trip'}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Basic info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Trip Title *</label>
                  <input className="input-3d" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="Bali Adventure 7D" />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Location *</label>
                  <input className="input-3d" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required placeholder="Bali, Indonesia" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="input-3d" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Trip description..." style={{ resize: 'vertical' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Price (₹) *</label>
                  <input className="input-3d" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required placeholder="15000" />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Duration (days) *</label>
                  <input className="input-3d" type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} required placeholder="7" />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Max Travelers</label>
                  <input className="input-3d" type="number" value={form.maxTravelers} onChange={e => setForm(f => ({ ...f, maxTravelers: e.target.value }))} placeholder="20" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input className="input-3d" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="Adventure, Beach, Culture" />
              </div>

              {/* Schedule */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <label className="form-label" style={{ margin: 0 }}>Day-wise Schedule</label>
                  <button type="button" onClick={addScheduleDay} className="btn-ghost" style={{ padding: '5px 12px', fontSize: 12 }}>+ Add Day</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {form.schedule.map((day, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '48px 1fr 100px 32px', gap: 8, alignItems: 'center' }}>
                      <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, color: 'var(--accent)', background: 'rgba(99,179,237,0.1)', borderRadius: 8, padding: '8px 4px' }}>D{day.day}</div>
                      <input className="input-3d" value={day.activities} onChange={e => updateSchedule(i, 'activities', e.target.value)} placeholder="Activities for this day" style={{ fontSize: 13 }} />
                      <input className="input-3d" value={day.time} onChange={e => updateSchedule(i, 'time', e.target.value)} placeholder="9:00 AM" style={{ fontSize: 13 }} />
                      <button type="button" onClick={() => removeScheduleDay(i)} style={{ background: 'none', border: 'none', color: '#fc8181', cursor: 'pointer', fontSize: 16, padding: 4 }}>×</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Files */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Trip Images</label>
                  <input type="file" accept="image/*" multiple onChange={e => setForm(f => ({ ...f, images: Array.from(e.target.files) }))}
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', color: 'var(--text-muted)', fontSize: 13, width: '100%', cursor: 'pointer' }} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Documents (PDF)</label>
                  <input type="file" accept=".pdf" multiple onChange={e => setForm(f => ({ ...f, documents: Array.from(e.target.files) }))}
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', color: 'var(--text-muted)', fontSize: 13, width: '100%', cursor: 'pointer' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving} style={{ flex: 2, fontSize: 15, padding: '13px' }}>
                  {saving ? 'Saving...' : editId ? 'Update Trip' : 'Create Trip'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTrips;
