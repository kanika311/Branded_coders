import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api.js';

export default function WebDevelopment() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      await api.post('/messages', {
        ...form,
        projectType: 'Website Development',
        email: 'via-quick-form@servicepage.com',
      });
      setStatus({ ok: true, text: '🎉 Request received! Our engineering lead will call/WhatsApp you within 4 hours.' });
      setForm({ name: '', phone: '', message: '' });
    } catch {
      setStatus({ ok: false, text: 'Something went wrong. Please connect with us directly on WhatsApp.' });
    } finally {
      setSubmitting(false);
    }
  }

  const deliverables = [
    { title: 'Sub-Second React & Next.js Architecture', desc: 'Zero bloat, lightning fast server-rendered or static frontends built on modern React.' },
    { title: '95+ Google PageSpeed Guarantee', desc: 'Strict optimization for Core Web Vitals (LCP, FID, CLS) to maximize search rankings.' },
    { title: 'Mobile-First One-Handed Usability', desc: 'Tested across 15+ real device resolutions with intuitive touch tap-targets.' },
    { title: 'Bespoke Zero-Code CMS Integration', desc: 'Edit text, change images, and publish blogs effortlessly without touching code.' },
    { title: 'Automated SEO & Schema Markup', desc: 'Pre-configured OpenGraph tags, dynamic XML sitemaps, and LocalBusiness JSON-LD.' },
    { title: 'Lead Capture & CRM Sync', desc: 'Instant WhatsApp routing, automated email notices, and Google Analytics 4 integration.' },
  ];

  const process = [
    { step: '01', title: 'Audit & Wireframing', desc: 'Competitive analysis, information architecture, and high-conversion wireframing.' },
    { step: '02', title: 'Interactive Prototype', desc: 'Figma mockups with precise typographic hierarchy and conversion CTA positioning.' },
    { step: '03', title: 'Frontend Engineering', desc: 'Handcrafted clean modular React code, accessible components, and API integration.' },
    { step: '04', title: 'Launch & Lighthouse Audit', desc: '32-point pre-flight testing, CDN caching configuration, and domain rollout.' },
  ];

  return (
    <div style={{ background: '#F8FAFC', color: '#0F172A' }}>
      {/* Hero Section */}
      <section style={{ padding: '64px 0 48px', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container responsive-two-col" style={{ alignItems: 'center', gap: '48px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px', background: '#EFF6FF', borderRadius: 999, marginBottom: 16 }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1D4ED8' }}>● Core Discipline</span>
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Starting from ₹45,000</span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.3rem, 4.2vw, 3.4rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em' }}>
              High-Speed <span style={{ color: '#2563EB' }}>Web Development</span> Engineered to Convert
            </h1>

            <p style={{ marginTop: 18, fontSize: '1.08rem', color: '#475569', lineHeight: 1.65, maxWidth: 560 }}>
              We design and code bespoke marketing websites and React platforms that rank on Google, load in under 800ms, and turn casual visitors into paying customers.
            </p>

            <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <a href="#quote-form" className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: 10 }}>
                Get an Instant Project Quote &rarr;
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ padding: '12px 20px', borderRadius: 10, border: '1px solid #CBD5E1', color: '#16A34A' }}>
                💬 Chat on WhatsApp
              </a>
            </div>

            <div style={{ marginTop: 32, display: 'flex', gap: 24, alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>95+</div>
                <div style={{ fontSize: '0.76rem', color: '#64748B' }}>PageSpeed Score</div>
              </div>
              <div style={{ width: 1, height: 28, background: '#E2E8F0' }} />
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>2–4 Wks</div>
                <div style={{ fontSize: '0.76rem', color: '#64748B' }}>Typical Delivery</div>
              </div>
              <div style={{ width: 1, height: 28, background: '#E2E8F0' }} />
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>100%</div>
                <div style={{ fontSize: '0.76rem', color: '#64748B' }}>Source Code Ownership</div>
              </div>
            </div>
          </div>

          {/* Quick 3-Field Lead Form */}
          <div id="quote-form">
            <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #CBD5E1', padding: '32px 28px', boxShadow: '0 12px 32px -4px rgba(15, 23, 42, 0.08)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 6 }}>Request a Web Scoping Call</h3>
              <p style={{ fontSize: '0.84rem', color: '#64748B', marginBottom: 20 }}>
                Get a transparent fixed-price estimate and timeline within 4 business hours.
              </p>

              {status && (
                <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: '0.84rem', background: status.ok ? '#ECFDF5' : '#FEF2F2', color: status.ok ? '#065F46' : '#991B1B' }}>
                  {status.text}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6, color: '#334155' }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6, color: '#334155' }}>
                    Phone or WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6, color: '#334155' }}>
                    Project Requirements / Website Goals
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe what you want to build or redesign..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.9rem', resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px', borderRadius: 8, fontWeight: 700, marginTop: 4 }}
                >
                  {submitting ? 'Submitting…' : 'Get My Free Proposal &rarr;'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section style={{ padding: '72px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 48px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' }}>Deliverables</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: 8 }}>What Every Web Build Includes</h2>
            <p style={{ color: '#64748B', marginTop: 8 }}>Complete turnkey engineering from source code to search ranking.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {deliverables.map((d) => (
              <div key={d.title} style={{ background: '#FFFFFF', padding: '24px', borderRadius: 14, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '1.2rem', color: '#2563EB', marginBottom: 8 }}>✓</div>
                <h3 style={{ fontSize: '1.08rem', fontWeight: 700, marginBottom: 6 }}>{d.title}</h3>
                <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.55 }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section style={{ padding: '72px 0', background: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 48px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' }}>Workflow</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: 8 }}>How We Build Your Website</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {process.map((p) => (
              <div key={p.step} style={{ background: '#F8FAFC', padding: '24px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2563EB', fontFamily: 'Space Grotesk, monospace', marginBottom: 8 }}>{p.step}</div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 6 }}>{p.title}</h3>
                <p style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: 1.5 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Highlight */}
      <section style={{ padding: '64px 0', background: '#0F172A', color: '#FFFFFF' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 32 }}>
          <div style={{ maxWidth: 560 }}>
            <span style={{ fontSize: '0.78rem', color: '#38BDF8', fontWeight: 700, textTransform: 'uppercase' }}>Featured Case Study</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: 8 }}>Apex Global Brands Redesign</h3>
            <p style={{ color: '#94A3B8', marginTop: 10, lineHeight: 1.6 }}>
              Migrated an unranked, sluggish WordPress site to a custom Next.js architecture with Core Web Vitals optimization.
            </p>
            <div style={{ display: 'flex', gap: 24, marginTop: 18 }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38BDF8' }}>+320%</div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Inbound Inquiries</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38BDF8' }}>0.6s</div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Average Page Load</div>
              </div>
            </div>
          </div>

          <Link to="/contact" className="btn btn-primary" style={{ padding: '14px 28px', borderRadius: 10, fontSize: '0.96rem' }}>
            Build My Website With BrandedCoders &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
