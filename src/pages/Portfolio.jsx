import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api.js';

export default function Portfolio() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    api.get('/portfolio')
      .then((res) => {
        const pub = res.data.filter((p) => p.published !== false);
        setItems(pub);
        if (pub.length > 0 && !selectedId) {
          setSelectedId(pub[0]._id);
        }
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(items.map((p) => p.category).filter(Boolean))];

  const filteredItems = activeCategory === 'All'
    ? items
    : items.filter((p) => p.category === activeCategory);

  const activeProject = items.find((p) => p._id === selectedId) || filteredItems[0] || items[0];

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '32px 0 72px' }}>
      <div className="container" style={{ maxWidth: '1280px' }}>
        
        {/* Compact Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #E2E8F0' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB', display: 'inline-block' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Interactive Case Studies
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.025em', margin: 0 }}>
              Production Systems &amp; Case Studies
            </h1>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setActiveCategory(c);
                  const firstInCat = c === 'All' ? items[0] : items.find((p) => p.category === c);
                  if (firstInCat) setSelectedId(firstInCat._id);
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: 999,
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: activeCategory === c ? '1px solid #2563EB' : '1px solid #CBD5E1',
                  background: activeCategory === c ? '#2563EB' : '#FFFFFF',
                  color: activeCategory === c ? '#FFFFFF' : '#334155',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: activeCategory === c ? '0 2px 8px rgba(37, 99, 235, 0.25)' : 'none',
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading && <p style={{ textAlign: 'center', padding: '40px' }}>Loading projects…</p>}

        {!loading && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '360px 1fr',
              gap: '24px',
              alignItems: 'start',
            }}
            className="portfolio-two-panel-grid"
          >
            {/* LEFT PANEL: Interactive Project Selector List (Fixed/Sticky) */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '16px',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
                position: 'sticky',
                top: '90px',
                maxHeight: 'calc(100vh - 120px)',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ padding: '4px 8px 10px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Select Project ({filteredItems.length})
                </span>
                <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700 }}>● Live Builds</span>
              </div>

              {filteredItems.map((p) => {
                const isSelected = activeProject?._id === p._id;
                return (
                  <div
                    key={p._id}
                    onClick={() => setSelectedId(p._id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 12px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      border: isSelected ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                      background: isSelected ? '#EFF6FF' : '#FFFFFF',
                      transition: 'all 0.18s ease',
                      boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.12)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = '#F8FAFC';
                        e.currentTarget.style.borderColor = '#CBD5E1';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = '#FFFFFF';
                        e.currentTarget.style.borderColor = '#E2E8F0';
                      }
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      style={{
                        width: '58px',
                        height: '52px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      <img
                        src={p.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&auto=format&fit=crop&q=80'}
                        alt={p.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.86rem',
                          fontWeight: 700,
                          color: isSelected ? '#1D4ED8' : '#0F172A',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {p.client || p.title}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                        {p.category}
                      </div>
                    </div>

                    {/* Indicator arrow */}
                    <div style={{ color: isSelected ? '#2563EB' : '#CBD5E1', fontSize: '0.8rem', fontWeight: 800 }}>
                      &rarr;
                    </div>
                  </div>
                );
              })}

              <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid #F1F5F9' }}>
                <Link
                  to="/contact"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '10px 0', fontSize: '0.84rem', borderRadius: 8, fontWeight: 700 }}
                >
                  Book Free Scoping Call &rarr;
                </Link>
              </div>
            </div>

            {/* RIGHT / CENTER PANEL: Live Detailed Showcase of Selected Project */}
            {activeProject && (
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid #E2E8F0',
                  padding: '32px',
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)',
                }}
              >
                {/* Meta Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '0.76rem', background: '#EFF6FF', color: '#1D4ED8', padding: '3px 12px', borderRadius: 999, fontWeight: 700 }}>
                      {activeProject.category}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>
                      Client: <strong style={{ color: '#0F172A' }}>{activeProject.client || 'Confidential Client'}</strong>
                    </span>
                  </div>

                  <span style={{ fontSize: '0.74rem', background: '#ECFDF5', color: '#059669', padding: '3px 10px', borderRadius: 999, fontWeight: 700 }}>
                    ● Production Shipped &amp; Verified
                  </span>
                </div>

                {/* Project Title */}
                <h2 style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)', fontWeight: 800, color: '#0F172A', lineHeight: 1.2, marginBottom: 14, letterSpacing: '-0.025em' }}>
                  {activeProject.title}
                </h2>

                {/* Project Large Screenshot / Reference Preview */}
                <div
                  style={{
                    width: '100%',
                    height: '320px',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    border: '1px solid #E2E8F0',
                    marginBottom: '24px',
                    position: 'relative',
                    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)',
                  }}
                >
                  <img
                    src={activeProject.image || 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=900&auto=format&fit=crop&q=80'}
                    alt={activeProject.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(15, 23, 42, 0.6) 0%, transparent 40%)',
                    }}
                  />
                  <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#FFFFFF' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: 6 }}>
                      Active Live Production Interface
                    </span>
                    {activeProject.link && (
                      <a
                        href={activeProject.link}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: '0.8rem',
                          background: '#2563EB',
                          color: '#FFFFFF',
                          padding: '5px 12px',
                          borderRadius: 6,
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        Visit Live Site &rarr;
                      </a>
                    )}
                  </div>
                </div>

                {/* Impact Metric Strip */}
                {activeProject.metrics && (
                  <div
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                    }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                      📈
                    </div>
                    <div>
                      <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Commercial Results Delivered
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2563EB', marginTop: 2 }}>
                        {activeProject.metrics}
                      </div>
                    </div>
                  </div>
                )}

                {/* Project Description & Architecture Details */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
                    Project Architecture &amp; Delivery
                  </h4>
                  <p style={{ fontSize: '0.98rem', color: '#475569', lineHeight: 1.68 }}>
                    {activeProject.summary}
                  </p>
                </div>

                {/* Tech Stack Tags */}
                {activeProject.tags?.length > 0 && (
                  <div style={{ marginBottom: '28px' }}>
                    <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                      Engineered With:
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {activeProject.tags.map((t) => (
                        <span key={t} style={{ fontSize: '0.78rem', background: '#F1F5F9', border: '1px solid #E2E8F0', padding: '4px 12px', borderRadius: 6, fontWeight: 600, color: '#334155' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Row */}
                <div style={{ paddingTop: '20px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
                  <div style={{ fontSize: '0.84rem', color: '#64748B' }}>
                    Want a similar architecture for your company?
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <a
                      href="https://wa.me/919876543210"
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-ghost"
                      style={{ padding: '10px 18px', borderRadius: 8, fontSize: '0.86rem', color: '#16A34A', border: '1px solid #CBD5E1' }}
                    >
                      💬 WhatsApp
                    </a>
                    <Link
                      to="/contact"
                      className="btn btn-primary"
                      style={{ padding: '10px 22px', borderRadius: 8, fontSize: '0.86rem', fontWeight: 700 }}
                    >
                      Scope This Project &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
