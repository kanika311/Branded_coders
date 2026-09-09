import { useEffect, useState } from 'react';
import api from '../../lib/api.js';

const empty = {
  title: '',
  client: '',
  category: 'Digital Marketing',
  summary: '',
  metrics: '',
  tags: '',
  order: 0,
  published: true,
};

export default function ManagePortfolio() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState(null);

  function load() {
    api.get('/portfolio').then((res) => setItems(res.data)).catch(() => {});
  }

  useEffect(load, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function edit(item) {
    setEditingId(item._id);
    setForm({
      title: item.title,
      client: item.client || '',
      category: item.category || 'Digital Marketing',
      summary: item.summary,
      metrics: item.metrics || '',
      tags: (item.tags || []).join(', '),
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
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    };
    try {
      if (editingId) {
        await api.put(`/portfolio/${editingId}`, payload);
        setStatus({ ok: true, text: 'Project updated.' });
      } else {
        await api.post('/portfolio', payload);
        setStatus({ ok: true, text: 'Project created.' });
      }
      resetForm();
      load();
    } catch (err) {
      setStatus({ ok: false, text: err.response?.data?.error || 'Save failed.' });
    }
  }

  async function onDelete(id) {
    if (!confirm('Delete this project?')) return;
    await api.delete(`/portfolio/${id}`);
    load();
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 24 }}>
        <div>
          <h1>Portfolio CMS</h1>
          <p style={{ marginTop: 4 }}>Manage client case studies, engineering builds, and digital marketing results.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 28, alignItems: 'start' }}>
        <form onSubmit={onSubmit} className="panel-card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 16 }}>
            {editingId ? 'Edit Project' : 'New Project'}
          </h3>
          {status && <div className={`status-msg ${status.ok ? 'status-ok' : 'status-err'}`}>{status.text}</div>}

          <div className="field">
            <label>Project Title *</label>
            <input required placeholder="e.g. Apex Scale Marketing Engine" value={form.title} onChange={(e) => update('title', e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field">
              <label>Client Name</label>
              <input placeholder="Apex Global Brands" value={form.client} onChange={(e) => update('client', e.target.value)} />
            </div>
            <div className="field">
              <label>Category *</label>
              <select value={form.category} onChange={(e) => update('category', e.target.value)}>
                <option>Digital Marketing</option>
                <option>Web App & CMS</option>
                <option>Dashboard</option>
                <option>Mobile App</option>
                <option>AI Platform</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Results / Metrics Highlight</label>
            <input placeholder="e.g. +320% Qualified Leads · 4.4x ROAS" value={form.metrics} onChange={(e) => update('metrics', e.target.value)} />
          </div>

          <div className="field">
            <label>Project Summary *</label>
            <textarea required placeholder="Brief description of the challenge and outcome..." value={form.summary} onChange={(e) => update('summary', e.target.value)} />
          </div>

          <div className="field">
            <label>Tags (Comma separated)</label>
            <input value={form.tags} onChange={(e) => update('tags', e.target.value)} placeholder="Google Ads, SEO, React, Node.js" />
          </div>

          <div className="field" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <input type="checkbox" id="port-pub" checked={form.published} onChange={(e) => update('published', e.target.checked)} style={{ width: 18, height: 18 }} />
            <label htmlFor="port-pub" style={{ margin: 0, fontWeight: 600 }}>Published on Website</label>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button className="btn btn-primary" type="submit">{editingId ? 'Save Changes' : 'Create Project'}</button>
            {editingId && <button type="button" className="btn btn-ghost" onClick={resetForm}>Cancel</button>}
          </div>
        </form>

        <div className="panel-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Title & Client</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <strong>{p.title}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--ink-dim)' }}>{p.client}</div>
                    </td>
                    <td>
                      <span className="tag-pill">{p.category}</span>
                    </td>
                    <td>
                      <span className={`badge ${p.published !== false ? 'badge-active' : 'badge-noresponse'}`}>
                        {p.published !== false ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="icon-btn" onClick={() => edit(p)}>Edit</button>
                        <button className="icon-btn" onClick={() => onDelete(p._id)} style={{ color: '#EF4444' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center' }}>No portfolio case studies yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
