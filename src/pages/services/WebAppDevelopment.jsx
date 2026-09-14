import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api.js';

export default function WebAppDevelopment() {
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
        projectType: 'Web App & Dashboards',
        email: 'webapp-lead@servicepage.com',
      });
      setStatus({ ok: true, text: '🎉 Scoping request received! Our software architect will reach out within 4 hours.' });
      setForm({ name: '', phone: '', message: '' });
    } catch {
      setStatus({ ok: false, text: 'Something went wrong. Please connect with us directly on WhatsApp.' });
    } finally {
      setSubmitting(false);
    }
  }

  const deliverables = [
    { title: 'Full-Stack MERN / Node Architecture', desc: 'Secure Express/Node.js REST or GraphQL APIs paired with dynamic React frontends and MongoDB or PostgreSQL.' },
    { title: 'Role-Based Access Control (RBAC)', desc: 'Multi-tenant architecture with granular user permissions: Super Admin, Manager, Field Employee, and Client view.' },
    { title: 'Live Dashboards & Real-Time Sync', desc: 'WebSockets and Redis pub/sub for instant order notifications, telemetry graphs, and status changes.' },
    { title: 'Custom Headless CMS Engine', desc: 'Content modeling tailored specifically to your data entities so non-technical teams can manage operations.' },
    { title: 'Third-Party API & Webhook Integrations', desc: 'Stripe, Razorpay, WhatsApp Business API, AWS S3, Google Maps, and custom ERP connectors.' },
    { title: 'Enterprise Security & Automated Backups', desc: 'JWT token auth, CSRF protection, rate limiting, and automated encrypted daily cloud backups.' },
  ];

  const process = [
    { step: '01', title: 'Data Modeling & Architecture', desc: 'Defining database schemas, user roles, security boundaries, and API interaction diagrams.' },
    { step: '02', title: 'UI/UX Wireframes & Flows', desc: 'Clickable wireframes validating every employee and client workflow before backend development.' },
    { step: '03', title: 'Full-Stack Sprint Builds', desc: 'Modular backend endpoints paired with responsive React interfaces deployed to staging weekly.' },
    { step: '04', title: 'Stress Testing & Production Rollout', desc: 'Load testing with simulated traffic, penetration sanity audits, and seamless database migration.' },
  ];

  return (
    <div style={{ background: '#F8FAFC', color: '#0F172A' }}>
      {/* Hero Section */}
      <section style={{ padding: '64px 0 48px', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container responsive-two-col" style={{ alignItems: 'center', gap: '48px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px', background: '#F5F3FF', borderRadius: 999, marginBottom: 16 }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#7C3AED' }}>● Custom Software Engineering</span>
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Starting from ₹1,50,000</span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.3rem, 4.2vw, 3.4rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em' }}>
              Custom <span style={{ color: '#7C3AED' }}>Web Applications</span> &amp; Operational Dashboards
            </h1>

            <p style={{ marginTop: 18, fontSize: '1.08rem', color: '#475569', lineHeight: 1.65, maxWidth: 560 }}>
              Replace clunky spreadsheets and expensive SaaS lock-in. We engineer secure, tailored web applications, client portals, and real-time operational hubs.
            </p>

            <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <a href="#app-quote" className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: 10, background: '#7C3AED', borderColor: '#7C3AED' }}>
                Scope Your Application &rarr;
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ padding: '12px 20px', borderRadius: 10, border: '1px solid #CBD5E1', color: '#16A34A' }}>
                💬 Chat on WhatsApp
              </a>
            </div>

            <div style={{ marginTop: 32, display: 'flex', gap: 24, alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>MERN</div>
                <div style={{ fontSize: '0.76rem', color: '#64748B' }}>Core Tech Stack</div>
              </div>
              <div style={{ width: 1, height: 28, background: '#E2E8F0' }} />
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>99.9%</div>
                <div style={{ fontSize: '0.76rem', color: '#64748B' }}>Uptime SLA</div>
              </div>
              <div style={{ width: 1, height: 28, background: '#E2E8F0' }} />
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>100%</div>
                <div style={{ fontSize: '0.76rem', color: '#64748B' }}>IP Ownership</div>
              </div>
            </div>
          </div>

          {/* Quick 3-Field Lead Form */}
          <div id="app-quote">
            <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #CBD5E1', padding: '32px 28px', boxShadow: '0 12px 32px -4px rgba(15, 23, 42, 0.08)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 6 }}>Scope Your Web Application</h3>
              <p style={{ fontSize: '0.84rem', color: '#64748B', marginBottom: 20 }}>
                Speak directly with our senior software architect to evaluate features, architecture, and timeline.
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
                    placeholder="e.g. Gurpreet Singh"
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
                    Application Scope / Core Functionality
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe user roles, dashboards, or manual processes you want to automate..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.9rem', resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px', borderRadius: 8, fontWeight: 700, background: '#7C3AED', borderColor: '#7C3AED' }}
                >
                  {submitting ? 'Submitting…' : 'Schedule Free Architecture Call &rarr;'}
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
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase' }}>Specifications</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: 8 }}>Engineered for Reliability and Scale</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {deliverables.map((d) => (
              <div key={d.title} style={{ background: '#FFFFFF', padding: '24px', borderRadius: 14, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '1.2rem', color: '#7C3AED', marginBottom: 8 }}>⚡</div>
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
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase' }}>SDLC Methodology</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: 8 }}>From Schema Design to Deployment</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {process.map((p) => (
              <div key={p.step} style={{ background: '#F8FAFC', padding: '24px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#7C3AED', fontFamily: 'Space Grotesk, monospace', marginBottom: 8 }}>{p.step}</div>
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
            <span style={{ fontSize: '0.78rem', color: '#A78BFA', fontWeight: 700, textTransform: 'uppercase' }}>Case Study Impact</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: 8 }}>Northline Freight Hub</h3>
            <p style={{ color: '#94A3B8', marginTop: 10, lineHeight: 1.6 }}>
              Replaced 4 disconnected spreadsheet workflows with a centralized real-time MERN dispatch portal processing 12,000+ logistics transactions daily.
            </p>
            <div style={{ display: 'flex', gap: 24, marginTop: 18 }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#A78BFA' }}>40%</div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Faster Turnaround</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#A78BFA' }}>0 min</div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Spreadsheet Data Entry</div>
              </div>
            </div>
          </div>

          <Link to="/contact" className="btn btn-primary" style={{ padding: '14px 28px', borderRadius: 10, fontSize: '0.96rem', background: '#7C3AED', borderColor: '#7C3AED' }}>
            Build My Web Application &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
