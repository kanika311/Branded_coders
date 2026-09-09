import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import InteractiveServices3D from '../components/3d/InteractiveServices3D.jsx';
import TiltCard from '../components/3d/TiltCard.jsx';
import api from '../lib/api.js';

const marketingPillars = [
  {
    icon: '🎯',
    title: 'Google & Meta Performance Ads',
    desc: 'Laser-targeted PPC campaigns engineered to maximize ROAS. Campaign structure, creative copy, and algorithmic bidding.',
    metrics: 'Avg. 3.8x - 5.2x ROAS',
    highlight: 'High ROAS',
  },
  {
    icon: '🔍',
    title: 'Technical & Programmatic SEO',
    desc: 'Core Web Vitals optimization, programmatic SEO landing pages, backlink architecture, and search intent dominance.',
    metrics: '+240% Organic Traffic',
    highlight: 'Long-term Moat',
  },
  {
    icon: '📱',
    title: 'Social Content & Brand Media',
    desc: 'High-converting social creative, video hooks, carousel designs, and executive brand positioning across LinkedIn & Instagram.',
    metrics: '3x Higher Engagement',
    highlight: 'Viral Distribution',
  },
  {
    icon: '⚡',
    title: 'Conversion Rate Optimization (CRO)',
    desc: 'Heatmap session audits, page speed tune-ups, checkout friction reduction, and multivariate headline testing.',
    metrics: '+35% Form Submissions',
    highlight: 'Instant Lift',
  },
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState('digital-marketing');

  // ROI Calculator state (Interactive widget)
  const [monthlyTraffic, setMonthlyTraffic] = useState(12000);
  const [conversionRate, setConversionRate] = useState(2.4);
  const [avgOrderValue, setAvgOrderValue] = useState(180);

  useEffect(() => {
    api.get('/services')
      .then((res) => setServices(res.data.filter((s) => s.published !== false)))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  // Calculated estimates
  const currentLeads = Math.round((monthlyTraffic * (conversionRate / 100)));
  const estimatedRevenue = Math.round(currentLeads * avgOrderValue);
  const projectedRevenue = Math.round(estimatedRevenue * 1.65); // Projected 65% lift

  const activeService = services.find((s) => s.slug === selectedSlug) || services[0] || {
    title: 'Digital Marketing & Growth',
    summary: 'Data-driven SEO, Google Ads, Meta Ads, and full-funnel conversion optimization.',
    highlights: ['Google & Meta Ads PPC', 'Technical & Local SEO', 'Conversion Rate Optimization (CRO)', 'Content & Social Strategy'],
  };

  return (
    <div className="bg-grid-subtle">
      {/* 3D SERVICE HERO WITH INTERACTIVE 3D MATRIX (NO WASTED SPACE) */}
      <section style={{ padding: '44px 0 28px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 32, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span className="eyebrow" style={{ margin: 0 }}>Studio Capabilities</span>
              <span style={{ fontSize: '0.74rem', background: '#FFF7ED', color: '#EA580C', padding: '3px 8px', borderRadius: 999, fontWeight: 700 }}>
                ● Full-Funnel Integration
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', lineHeight: 1.15 }}>
              Engineering & <span className="hero-gradient-text">Digital Marketing</span> in complete alignment.
            </h1>

            <p style={{ marginTop: 14, fontSize: '1.02rem', color: '#64748B', maxWidth: 520, lineHeight: 1.6 }}>
              We eliminate handoff friction. The same studio that crafts your high-speed web application tunes its SEO structure, launches its ad campaigns, and scales revenue.
            </p>

            {/* INTERACTIVE SERVICE PILLS (UPDATES 3D MATRIX) */}
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                Select Discipline to Inspect 3D Matrix:
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[
                  { slug: 'digital-marketing', label: '📈 Digital Marketing' },
                  { slug: 'websites', label: '🌐 Websites & Web Apps' },
                  { slug: 'cms', label: '⚡ Headless & MERN CMS' },
                  { slug: 'dashboards', label: '📊 Live Dashboards' },
                  { slug: 'apps', label: '📱 Mobile Applications' },
                  { slug: 'ai-platforms', label: '🧠 AI Platforms' },
                ].map((item) => (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => setSelectedSlug(item.slug)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 8,
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: selectedSlug === item.slug ? '#2563EB' : '#FFFFFF',
                      color: selectedSlug === item.slug ? '#FFFFFF' : '#334155',
                      border: selectedSlug === item.slug ? '1px solid #1D4ED8' : '1px solid #E2E8F0',
                      boxShadow: selectedSlug === item.slug ? '0 2px 8px rgba(37, 99, 235, 0.25)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
              <Link to="/contact" className="btn btn-primary" style={{ padding: '11px 22px' }}>
                Schedule Scoping Session →
              </Link>
              <a href="#calculator" className="btn btn-ghost" style={{ padding: '11px 18px' }}>
                Estimate Growth ROI ↓
              </a>
            </div>
          </div>

          {/* RIGHT: INTERACTIVE 3D SERVICES MATRIX */}
          <TiltCard maxTilt={6} className="hero-canvas" style={{ height: 380, display: 'flex', flexDirection: 'column' }}>
            <InteractiveServices3D activeServiceSlug={selectedSlug} />
            <div
              style={{
                position: 'absolute',
                top: 14,
                left: 14,
                right: 14,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(8px)',
                border: '1px solid #E2E8F0',
                borderRadius: 10,
                padding: '10px 14px',
                zIndex: 10,
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#0F172A' }}>{activeService.title}</div>
              <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeService.summary || activeService.description}
              </p>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* FEATURED: DIGITAL MARKETING RETINERS (3D TILT CARDS) */}
      <section className="section" style={{ background: '#FFFFFF', borderTop: '1px solid var(--panel-line)', padding: '52px 0' }}>
        <div className="container">
          <div className="section-head" style={{ marginBottom: 28 }}>
            <div>
              <span className="eyebrow" style={{ background: 'var(--orange-light)', color: 'var(--orange)' }}>
                🚀 Performance Growth
              </span>
              <h2>Data-Driven Digital Marketing That Multiplies Revenue</h2>
            </div>
            <p>
              Stop paying for vanity impressions. We build full-funnel acquisition engines that turn anonymous clicks into qualified pipeline.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
            {marketingPillars.map((p) => (
              <TiltCard
                key={p.title}
                maxTilt={10}
                className="panel-card"
                style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ fontSize: '1.8rem' }}>{p.icon}</div>
                    <span className="badge" style={{ background: '#FFF7ED', color: '#C2410C', fontSize: '0.72rem', fontWeight: 700 }}>
                      {p.highlight}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.12rem', fontWeight: 700, marginBottom: 6 }}>{p.title}</h3>
                  <p style={{ fontSize: '0.86rem', lineHeight: 1.55 }}>{p.desc}</p>
                </div>
                <div style={{ marginTop: 18, paddingTop: 12, borderTop: '1px solid var(--panel-line)' }}>
                  <span className="badge badge-active" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                    {p.metrics}
                  </span>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE 3D ROI & PIPELINE CALCULATOR (HIGH UTILITY, ZERO WASTED SPACE) */}
      <section id="calculator" className="section" style={{ padding: '52px 0' }}>
        <div className="container">
          <div className="section-head" style={{ marginBottom: 28 }}>
            <div>
              <span className="eyebrow">Interactive Estimator</span>
              <h2>Projected Revenue Lift Calculator</h2>
            </div>
            <p>
              Adjust your current traffic and metrics to see the compounding impact of combined engineering speed and targeted digital marketing.
            </p>
          </div>

          <TiltCard maxTilt={5} className="chart-card" style={{ padding: '32px', background: '#FFFFFF', border: '1px solid #CBD5E1' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 36, alignItems: 'center' }}>
              {/* SLIDERS COLUMN */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1E293B' }}>Monthly Website Visitors</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#2563EB' }}>
                      {monthlyTraffic.toLocaleString()} visitors
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="100000"
                    step="1000"
                    value={monthlyTraffic}
                    onChange={(e) => setMonthlyTraffic(Number(e.target.value))}
                    className="interactive-calc-slider"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94A3B8', marginTop: 4 }}>
                    <span>1,000</span>
                    <span>50,000</span>
                    <span>100,000+</span>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1E293B' }}>Conversion Rate (Forms / Signups)</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FF7A00' }}>
                      {conversionRate}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="8.0"
                    step="0.1"
                    value={conversionRate}
                    onChange={(e) => setConversionRate(Number(e.target.value))}
                    className="interactive-calc-slider"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94A3B8', marginTop: 4 }}>
                    <span>0.5% (Industry avg)</span>
                    <span>4.0%</span>
                    <span>8.0% (CRO optimized)</span>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1E293B' }}>Average Customer Deal Value</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#059669' }}>
                      ₹{(avgOrderValue * 85).toLocaleString('en-IN')} (${avgOrderValue})
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="2000"
                    step="20"
                    value={avgOrderValue}
                    onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                    className="interactive-calc-slider"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94A3B8', marginTop: 4 }}>
                    <span>$20</span>
                    <span>$1,000</span>
                    <span>$2,000+</span>
                  </div>
                </div>
              </div>

              {/* ESTIMATE DISPLAY COLUMN */}
              <div
                style={{
                  background: 'linear-gradient(145deg, #0F172A, #1E293B)',
                  borderRadius: 14,
                  padding: '28px',
                  color: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', fontWeight: 700 }}>
                    Projected Revenue Potential
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 800, color: '#38BDF8', margin: '10px 0 4px' }}>
                    ₹{(projectedRevenue * 85).toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>
                    Estimated monthly pipeline (${projectedRevenue.toLocaleString()} USD)
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.12)', paddingTop: 16, marginTop: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
                    <span style={{ color: '#94A3B8' }}>Current Est. Monthly Leads:</span>
                    <strong style={{ color: '#FFFFFF' }}>{currentLeads.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 16 }}>
                    <span style={{ color: '#94A3B8' }}>Expected Lift with BrandedCoders:</span>
                    <strong style={{ color: '#34D399' }}>+65% qualified growth</strong>
                  </div>
                  <Link
                    to="/contact"
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '11px', textAlign: 'center', fontWeight: 700 }}
                  >
                    Unlock This Growth Pipeline →
                  </Link>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* COMPREHENSIVE SERVICE CATALOG FROM CMS */}
      <section className="section" style={{ background: '#FFFFFF', borderTop: '1px solid var(--panel-line)', padding: '52px 0' }}>
        <div className="container">
          <div className="section-head" style={{ marginBottom: 28 }}>
            <div>
              <span className="eyebrow">Catalog Overview</span>
              <h2>All Available Studio Services</h2>
            </div>
            <p>Every offering is backed by senior engineers and performance growth marketers.</p>
          </div>

          {loading ? (
            <p>Loading services…</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 18 }}>
              {services.map((s, i) => (
                <TiltCard
                  key={s._id || i}
                  maxTilt={8}
                  className="panel-card"
                  style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span className="eyebrow" style={{ margin: 0, fontSize: '0.72rem' }}>
                        Discipline {String(i + 1).padStart(2, '0')}
                      </span>
                      {s.badge && (
                        <span className="badge badge-scheduled" style={{ fontSize: '0.72rem' }}>{s.badge}</span>
                      )}
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
                    <p style={{ fontSize: '0.88rem', lineHeight: 1.55 }}>{s.description || s.summary}</p>

                    {s.highlights && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 16 }}>
                        {s.highlights.map((h) => (
                          <span key={h} className="service-pill" style={{ fontSize: '0.72rem' }}>{h}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid var(--panel-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>● Ready for Retainer</span>
                    <Link to="/contact" style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 700 }}>
                      Inquire Details →
                    </Link>
                  </div>
                </TiltCard>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
