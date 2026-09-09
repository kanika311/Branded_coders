import { useEffect, useState } from 'react';
import api from '../../lib/api.js';

export default function Messages() {
  const [messages, setMessages] = useState([]);

  function load() {
    api.get('/messages').then((res) => setMessages(res.data)).catch(() => {});
  }

  useEffect(load, []);

  async function markRead(id, read) {
    await api.put(`/messages/${id}`, { read });
    load();
  }

  async function remove(id) {
    if (!confirm('Delete this message?')) return;
    await api.delete(`/messages/${id}`);
    load();
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 24 }}>
        <div>
          <h1>Inbound Inquiries & Messages</h1>
          <p style={{ marginTop: 4 }}>Prospective client inquiries submitted via public contact form. These are automatically synced to the Lead Pipeline.</p>
        </div>
      </div>

      <div className="panel-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Sender & Company</th>
                <th>Service & Budget</th>
                <th>Message Content</th>
                <th>Date & Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m._id}>
                  <td>
                    <strong>{m.name}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ink-dim)' }}>{m.email}</div>
                    {m.phone && <div style={{ fontSize: '0.78rem', fontFamily: 'monospace' }}>{m.phone}</div>}
                    {m.company && <div style={{ fontSize: '0.76rem', color: 'var(--accent)' }}>{m.company}</div>}
                  </td>
                  <td>
                    <span className="tag-pill">{m.projectType}</span>
                    {m.budget && <div style={{ fontSize: '0.8rem', color: 'var(--ink-dim)', marginTop: 4 }}>{m.budget}</div>}
                  </td>
                  <td style={{ maxWidth: 360, fontSize: '0.88rem', lineHeight: 1.5 }}>
                    {m.message}
                  </td>
                  <td>
                    <span className={`badge ${m.read ? 'badge-noresponse' : 'badge-new'}`}>
                      {m.read ? 'Read' : 'New Inbound'}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ink-dim)', marginTop: 4 }}>
                      {m.createdAt || 'Recent'}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="icon-btn" onClick={() => markRead(m._id, !m.read)}>
                        {m.read ? 'Mark New' : 'Mark Read'}
                      </button>
                      <button className="icon-btn" onClick={() => remove(m._id)} style={{ color: '#EF4444' }}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {messages.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--ink-dim)' }}>
                    No messages received yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
