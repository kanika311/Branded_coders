import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TiltCard from '../components/3d/TiltCard.jsx';
import api from '../lib/api.js';

export default function Portfolio() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    api.get('/portfolio')
      .then((res) => setItems(res.data.filter((p) => p.published !== false)))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(items.map((p) => p.category).filter(Boolean))];

  const filteredItems = activeFilter === 'All'
    ? items
    : items.filter((p) => p.category === activeFilter);

  return (
    <div className="bg-grid-subtle">
      <section style={{ padding: '44px 0 24px' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span className="eyebrow" style={{ margin: 0 }}>Case Studies & Work</span>
            <span style={{ fontSize: '0.74rem', background: '#ECFDF5', color: '#059669', padding: '3px 8px', borderRadius: 999, fontWeight: 700 }}>
              ● Verified Production Results
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 4.2vw, 3.2rem)', lineHeight: 1.15, maxWidth: 740 }}>
            Proven results shipped for <span className="hero-gradient-text">ambitious businesses</span>.
          </h1>

          <p style={{ marginTop: 14, maxWidth: 580, fontSize: '1.02rem', color: '#64748B', lineHeight: 1.6 }}>
            Explore our featured software builds, operational dashboards, and high-impact digital marketing campaigns.
          </p>

          {/* Filter Pills (Clean, no wasted space) */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 24 }}>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActiveFilter(c)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 8,
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  background: activeFilter === c ? '#2563EB' : '#FFFFFF',
                  color: activeFilter === c ? '#FFFFFF' : '#334155',
                  border: activeFilter === c ? '1px solid #1D4ED8' : '1px solid #E2E8F0',
                  boxShadow: activeFilter === c ? '0 2px 8px rgba(37, 99, 235, 0.25)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '24px 0 56px' }}>
        <div className="container">
          {loading && <p>Loading projects…</p>}
          {!loading && filteredItems.length === 0 && <p>No projects in this category yet.</p>}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
            {filteredItems.map((p) => (
              <TiltCard key={p._id || p.title} maxTilt={8} className="portfolio-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="portfolio-thumb">
                    <h4>{p.title}</h4>
                    <span className="client-name">Client: {p.client || 'Confidential Client'}</span>
                  </div>
                  <div className="portfolio-body">
                    <span className="portfolio-tag">{p.category}</span>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.55 }}>{p.summary}</p>

                    {p.metrics && (
                      <div className="portfolio-metrics" style={{ marginTop: 14 }}>
                        📈 {p.metrics}
                      </div>
                    )}

                    {p.tags?.length > 0 && (
                      <div style={{ marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {p.tags.map((t) => (
                          <span key={t} className="tag-pill" style={{ fontSize: '0.74rem' }}>{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ padding: '16px 24px', borderTop: '1px solid var(--panel-line)', background: '#FAFAFA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>● Shipped & Live</span>
                  <Link to="/contact" style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 700 }}>
                    Build Something Similar →
                  </Link>
                </div>
              </TiltCard>
            ))}
          </div>

          <div style={{ marginTop: 48, textAlign: 'center' }}>
            <Link to="/contact" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '0.98rem' }}>
              Launch Your Next Project With Us →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
