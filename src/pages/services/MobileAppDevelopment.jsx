import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api.js';

export default function MobileAppDevelopment() {
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
        projectType: 'Mobile Application',
        email: 'mobileapp-lead@servicepage.com',
      });
      setStatus({ ok: true, text: '🎉 Scoping request received! Our mobile engineering lead will reach out within 4 hours.' });
      setForm({ name: '', phone: '', message: '' });
    } catch {
      setStatus({ ok: false, text: 'Something went wrong. Please connect with us directly on WhatsApp.' });
    } finally {
      setSubmitting(false);
    }
  }

  const deliverables = [
    { title: 'Cross-Platform React Native Codebase', desc: 'A single, high-performance TypeScript codebase delivering native-feel performance on both iOS and Android simultaneously.' },
    { title: 'App Store & Google Play Publishing', desc: 'End-to-end guidance through Apple Developer Program and Google Play Console guidelines, certificates, and approval.' },
    { title: 'Offline-First & Background Sync', desc: 'Local SQLite/WatermelonDB storage allowing users to interact smoothly without dropping data in low-connectivity areas.' },
    { title: 'Push Notifications & Deep Linking', desc: 'Firebase Cloud Messaging (FCM) & Apple APNs integration for transactional reminders, updates, and custom campaign deep links.' },
    { title: 'Biometric & Native Device Hardware', desc: 'Face ID, fingerprint authentication, camera integration, GPS geolocation, and Bluetooth low energy (BLE) support.' },
    { title: 'High-Throughput Secure Backend API', desc: 'Encrypted Node.js REST and WebSockets backend powering real-time chat, bookings, and instant payment settlement.' },
  ];

  const process = [
    { step: '01', title: 'User Journey & UX Wireframes', desc: 'Mapping user interactions, onboarding flows, and thumb-zone ergonomics for mobile screens.' },
    { step: '02', title: 'Interactive Clickable Prototype', desc: 'High-fidelity Figma prototypes allowing you to test app interactions on real phones before coding.' },
    { step: '03', title: 'React Native & API Sprints', desc: 'Component engineering, native modules bridging, and API integration with TestFlight/APK test builds.' },
    { step: '04', title: 'App Store Submission & QA', desc: 'Automated UI test passes, compliance checklist verification, and launch support on both app stores.' },
  ];

  return (
    <div style={{ background: '#F8FAFC', color: '#0F172A' }}>
      {/* Hero Section */}
      <section style={{ padding: '64px 0 48px', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container responsive-two-col" style={{ alignItems: 'center', gap: '48px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px', background: '#ECFDF5', borderRadius: 999, marginBottom: 16 }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669' }}>● Cross-Platform Mobile Engineering</span>
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Starting from ₹1,80,000</span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.3rem, 4.2vw, 3.4rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em' }}>
              Native-Speed <span style={{ color: '#059669' }}>Mobile Applications</span> for iOS &amp; Android
            </h1>

            <p style={{ marginTop: 18, fontSize: '1.08rem', color: '#475569', lineHeight: 1.65, maxWidth: 560 }}>
              Launch your mobile product faster with half the maintenance cost. We engineer cross-platform React Native apps that feel buttery smooth on iPhone and Android.
            </p>

            <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <a href="#mobile-quote" className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: 10, background: '#059669', borderColor: '#059669' }}>
                Scope Your Mobile App &rarr;
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ padding: '12px 20px', borderRadius: 10, border: '1px solid #CBD5E1', color: '#16A34A' }}>
                💬 Chat on WhatsApp
              </a>
            </div>

            <div style={{ marginTop: 32, display: 'flex', gap: 24, alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>iOS + Android</div>
                <div style={{ fontSize: '0.76rem', color: '#64748B' }}>Single Codebase</div>
              </div>
              <div style={{ width: 1, height: 28, background: '#E2E8F0' }} />
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>60 FPS</div>
                <div style={{ fontSize: '0.76rem', color: '#64748B' }}>Fluid Frame Rate</div>
              </div>
              <div style={{ width: 1, height: 28, background: '#E2E8F0' }} />
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>100%</div>
                <div style={{ fontSize: '0.76rem', color: '#64748B' }}>Store Approval Track Record</div>
              </div>
            </div>
          </div>

          {/* Quick 3-Field Lead Form */}
          <div id="mobile-quote">
            <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #CBD5E1', padding: '32px 28px', boxShadow: '0 12px 32px -4px rgba(15, 23, 42, 0.08)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 6 }}>Scope Your Mobile App</h3>
              <p style={{ fontSize: '0.84rem', color: '#64748B', marginBottom: 20 }}>
                Get an architectural roadmap, feature breakdown, and estimated app store launch date.
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
                    placeholder="e.g. Rohini Chawla"
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
                    App Concept / Key Features
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe what your app does and who will use it..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.9rem', resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px', borderRadius: 8, fontWeight: 700, background: '#059669', borderColor: '#059669' }}
                >
                  {submitting ? 'Submitting…' : 'Schedule Free Mobile Scoping Call &rarr;'}
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
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>Native Experience</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: 8 }}>Complete Mobile App Deliverables</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {deliverables.map((d) => (
              <div key={d.title} style={{ background: '#FFFFFF', padding: '24px', borderRadius: 14, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '1.2rem', color: '#059669', marginBottom: 8 }}>📱</div>
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
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>Mobile Lifecycle</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: 8 }}>How We Build &amp; Publish Your App</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {process.map((p) => (
              <div key={p.step} style={{ background: '#F8FAFC', padding: '24px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#059669', fontFamily: 'Space Grotesk, monospace', marginBottom: 8 }}>{p.step}</div>
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
            <span style={{ fontSize: '0.78rem', color: '#34D399', fontWeight: 700, textTransform: 'uppercase' }}>Case Study Impact</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: 8 }}>Pulse Clinic Companion</h3>
            <p style={{ color: '#94A3B8', marginTop: 10, lineHeight: 1.6 }}>
              Cross-platform React Native companion app enabling over 45,000 patients to book appointments, consult specialists, and receive instant lab results.
            </p>
            <div style={{ display: 'flex', gap: 24, marginTop: 18 }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34D399' }}>45,000+</div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Active Users</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34D399' }}>4.9 ★</div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>App Store Rating</div>
              </div>
            </div>
          </div>

          <Link to="/contact" className="btn btn-primary" style={{ padding: '14px 28px', borderRadius: 10, fontSize: '0.96rem', background: '#059669', borderColor: '#059669' }}>
            Build My Mobile App &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
