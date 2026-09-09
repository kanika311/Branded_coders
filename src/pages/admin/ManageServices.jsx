import { useEffect, useState } from 'react';
import api from '../../lib/api.js';

const empty = {
  title: '',
  slug: '',
  badge: '',
  summary: '',
  description: '',
  highlights: '',
  order: 0,
  published: true,
};

export default function ManageServices() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState(null);

  function load() {
    api.get('/services').then((res) => setItems(res.data)).catch(() => {});
  }

  useEffect(load, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function edit(item) {
    setEditingId(item._id);
    setForm({
      title: item.title,
      slug: item.slug,
      badge: item.badge || '',
      summary: item.summary,
      description: item.description || '',
      highlights: (item.highlights || []).join(', '),
      order: item.order || 0,
      published: item.published !== false,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(empty);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus(null);
    const payload = {
      ...form,
      highlights: form.highlights ? form.highlights.split(',').map((h) => h.trim()).filter(Boolean) : [],
    };
    try {
      if (editingId) {
        await api.put(`/services/${editingId}`, payload);
        setStatus({ ok: true, text: 'Service updated successfully.' });
      } else {
        await api.post('/services', payload);
        setStatus({ ok: true, text: 'Service created successfully.' });
      }
      resetForm();
      load();
    } catch (err) {
      setStatus({ ok: false, text: err.response?.data?.error || 'Save failed.' });
    }
  }

  async function onDelete(id) {
    if (!confirm('Are you sure you want to delete this service?')) return;
    await api.delete(`/services/${id}`);
    load();
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 24 }}>
        <div>
          <h1>Services CMS</h1>
          <p style={{ marginTop: 4 }}>Add, edit, or toggle services published on the public website (including Digital Marketing & engineering).</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 28, alignItems: 'start' }}>
        <form onSubmit={onSubmit} className="panel-card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 16 }}>
            {editingId ? 'Edit Service' : 'Add New Service'}
          </h3>

          {status && (
            <div className={`status-msg ${status.ok ? 'status-ok' : 'status-err'}`}>
              {status.text}
            </div>
          )}

          <div className="field">
            <label>Service Title *</label>
            <input
              required
              placeholder="e.g. Digital Marketing & Growth"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field">
              <label>Slug (URL) *</label>
              <input
                required
                value={form.slug}
                onChange={(e) => update('slug', e.target.value)}
                placeholder="digital-marketing"
              />
            </div>
            <div className="field">
              <label>Badge / Tag</label>
              <input
                value={form.badge}
                onChange={(e) => update('badge', e.target.value)}
                placeholder="e.g. High ROI, Popular"
              />
            </div>
          </div>

          <div className="field">
            <label>Short Summary *</label>
            <input
              required
              placeholder="1-2 sentences for hero & grid previews"
              value={form.summary}
              onChange={(e) => update('summary', e.target.value)}
            />
          </div>

          <div className="field">
            <label>Detailed Description</label>
            <textarea
              placeholder="Comprehensive description displayed on the full services catalog..."
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              style={{ minHeight: 80 }}
            />
          </div>

          <div className="field">
            <label>Highlights (Comma separated)</label>
            <input
              placeholder="Google Ads PPC, Technical SEO, CRO"
              value={form.highlights}
              onChange={(e) => update('highlights', e.target.value)}
            />
          </div>

          <div className="field" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <input
              type="checkbox"
              id="published"
              checked={form.published}
              onChange={(e) => update('published', e.target.checked)}
              style={{ width: 18, height: 18 }}
            />
            <label htmlFor="published" style={{ margin: 0, fontWeight: 600 }}>
              Publish on Public Website
            </label>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button className="btn btn-primary" type="submit">
              {editingId ? 'Save Changes' : 'Create Service'}
            </button>
            {editingId && (
              <button type="button" className="btn btn-ghost" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="panel-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Title & Slug</th>
                  <th>Badge</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <strong>{s.title}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--ink-dim)' }}>/{s.slug}</div>
                    </td>
                    <td>
                      {s.badge ? <span className="badge badge-scheduled">{s.badge}</span> : '—'}
                    </td>
                    <td>
                      <span className={`badge ${s.published !== false ? 'badge-active' : 'badge-noresponse'}`}>
                        {s.published !== false ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="icon-btn" onClick={() => edit(s)}>Edit</button>
                        <button className="icon-btn" onClick={() => onDelete(s._id)} style={{ color: '#EF4444' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center' }}>No services published yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
