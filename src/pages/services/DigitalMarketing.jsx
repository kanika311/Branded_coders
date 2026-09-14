import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api.js';

export default function DigitalMarketing() {
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
        projectType: 'Digital Marketing & Growth',
        email: 'marketing-lead@servicepage.com',
      });
      setStatus({ ok: true, text: '🎉 Growth consultation booked! Our head of acquisition will reach out within 4 hours.' });
      setForm({ name: '', phone: '', message: '' });
    } catch {
      setStatus({ ok: false, text: 'Something went wrong. Please reach out via WhatsApp.' });
    } finally {
      setSubmitting(false);
    }
  }

  const deliverables = [
    { title: 'Laser-Targeted Google Search & Intent PPC', desc: 'Capture in-market prospects searching for your exact services with high-converting ad copy and negative keyword pruning.' },
    { title: 'Technical & Programmatic SEO Audits', desc: 'Core Web Vitals compliance, programmatic landing page generation, and authority backlink strategies.' },
    { title: 'Meta (Facebook & Instagram) Direct Response', desc: 'High-performing creative formats, hook-rate optimization, and retargeting funnels that drive direct sales.' },
    { title: 'Conversion Rate Optimization (CRO)', desc: 'Heatmap recording analysis, A/B landing page testing, and frictionless form redesign to maximize lead conversion.' },
    { title: 'Automated Multi-Touch Retargeting', desc: 'Re-engage lost visitors across Google Display, YouTube, and Meta with tailored social proof ads.' },
    { title: 'Live Transparent ROI Dashboard', desc: 'Real-time reporting connecting advertising spend directly to closed deals, cost-per-lead, and ROAS.' },
  ];

  const process = [
    { step: '01', title: 'Funnel & Competitor Audit', desc: 'We dissect your existing ad spend, keyword gaps, and competitor strategies to pinpoint high-margin opportunities.' },
    { step: '02', title: 'Landing Page & Creative Prep', desc: 'We build dedicated high-converting landing pages and craft proven ad hooks before turning on spend.' },
    { step: '03', title: 'Campaign Launch & Bidding', desc: 'Structured testing of audiences, manual target CPA controls, and automated conversion tracking setup.' },
    { step: '04', title: 'Scale & Budget Compounding', desc: 'Scale winning ad sets, cut non-performing keywords, and expand into lookalike audience segments.' },
  ];

  return (
    <div style={{ background: '#F8FAFC', color: '#0F172A' }}>
      {/* Hero Section */}
      <section style={{ padding: '64px 0 48px', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container responsive-two-col" style={{ alignItems: 'center', gap: '48px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px', background: '#FFF7ED', borderRadius: 999, marginBottom: 16 }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#C2410C' }}>● Performance Marketing</span>
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Avg. 4.2x ROAS</span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.3rem, 4.2vw, 3.4rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em' }}>
              Data-Driven <span style={{ color: '#EA580C' }}>Digital Marketing</span> Built for Predictable Revenue
            </h1>

            <p style={{ marginTop: 18, fontSize: '1.08rem', color: '#475569', lineHeight: 1.65, maxWidth: 560 }}>
              Stop wasting money on vanity impressions. We build full-funnel acquisition systems combining Google PPC, Technical SEO, and CRO that directly generate paying customers.
            </p>

            <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <a href="#marketing-quote" className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: 10, background: '#EA580C', borderColor: '#EA580C' }}>
                Get a Free Marketing Audit &rarr;
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ padding: '12px 20px', borderRadius: 10, border: '1px solid #CBD5E1', color: '#16A34A' }}>
                💬 Chat on WhatsApp
              </a>
            </div>

            <div style={{ marginTop: 32, display: 'flex', gap: 24, alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>₹1.5Cr+</div>
                <div style={{ fontSize: '0.76rem', color: '#64748B' }}>Profitable Ad Spend</div>
              </div>
              <div style={{ width: 1, height: 28, background: '#E2E8F0' }} />
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>4.2x</div>
                <div style={{ fontSize: '0.76rem', color: '#64748B' }}>Average ROAS</div>
              </div>
              <div style={{ width: 1, height: 28, background: '#E2E8F0' }} />
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>0%</div>
                <div style={{ fontSize: '0.76rem', color: '#64748B' }}>Vanity Metric Fluff</div>
              </div>
            </div>
          </div>

          {/* Quick 3-Field Lead Form */}
          <div id="marketing-quote">
            <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #CBD5E1', padding: '32px 28px', boxShadow: '0 12px 32px -4px rgba(15, 23, 42, 0.08)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 6 }}>Request a Growth Audit</h3>
              <p style={{ fontSize: '0.84rem', color: '#64748B', marginBottom: 20 }}>
                We will analyze your current search rankings and ad campaigns with zero obligation.
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
                    placeholder="e.g. Ankit Verma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6, color: '#334155' }}>
                    Phone or WhatsApp *
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
                    Website / Business Details
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter your website URL or current monthly marketing goals..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.9rem', resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px', borderRadius: 8, fontWeight: 700, background: '#EA580C', borderColor: '#EA580C' }}
                >
                  {submitting ? 'Submitting…' : 'Claim My Free Marketing Audit &rarr;'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section style={{ padding: '72px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 48px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#EA580C', textTransform: 'uppercase' }}>Capabilities</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: 8 }}>Everything You Need to Scale Inbound Leads</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {deliverables.map((d) => (
              <div key={d.title} style={{ background: '#FFFFFF', padding: '24px', borderRadius: 14, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '1.2rem', color: '#EA580C', marginBottom: 8 }}>📈</div>
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
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#EA580C', textTransform: 'uppercase' }}>Protocol</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: 8 }}>Our Continuous Optimization Loop</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {process.map((p) => (
              <div key={p.step} style={{ background: '#F8FAFC', padding: '24px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#EA580C', fontFamily: 'Space Grotesk, monospace', marginBottom: 8 }}>{p.step}</div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 6 }}>{p.title}</h3>
                <p style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: 1.5 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section style={{ padding: '64px 0', background: '#0F172A', color: '#FFFFFF' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 32 }}>
          <div style={{ maxWidth: 560 }}>
            <span style={{ fontSize: '0.78rem', color: '#F97316', fontWeight: 700, textTransform: 'uppercase' }}>Case Study Impact</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: 8 }}>Apex Scale Paid Acquisition</h3>
            <p style={{ color: '#94A3B8', marginTop: 10, lineHeight: 1.6 }}>
              Restructured Google search campaigns, launched targeted long-tail programmatic landing pages, and established a 4.4x return on ad spend within 90 days.
            </p>
            <div style={{ display: 'flex', gap: 24, marginTop: 18 }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F97316' }}>4.4x</div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Verified ROAS</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F97316' }}>-42%</div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Cost Per Acquisition</div>
              </div>
            </div>
          </div>

          <Link to="/contact" className="btn btn-primary" style={{ padding: '14px 28px', borderRadius: 10, fontSize: '0.96rem', background: '#EA580C', borderColor: '#EA580C' }}>
            Scale My Acquisition With BrandedCoders &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
