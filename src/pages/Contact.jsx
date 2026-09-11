import { useState, useEffect } from 'react';
import InteractiveContact3D from '../components/3d/InteractiveContact3D.jsx';
import TiltCard from '../components/3d/TiltCard.jsx';
import api from '../lib/api.js';
import { dataStore } from '../lib/dataStore.js';

const initialForm = {
  name: '',
  phone: '',
  email: '',
  company: '',
  projectType: 'Digital Marketing & Growth',
  budget: '$5k–$10k',
  timeline: '2–4 weeks',
  message: '',
};

const PROJECT_TYPES = [
  'Digital Marketing & Growth',
  'Website Development',
  'Custom MERN CMS',
  'Operational Dashboard',
  'Mobile Application',
  'AI Integration',
];

const BUDGET_TIERS = [
  '₹50k–₹1.5L ($1k–$2k)',
  '₹1.5L–₹3L ($2k–$4k)',
  '₹3L–₹6L ($4k–$8k)',
  '₹6L+ ($8k+)',
];

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState(dataStore.getSiteContent().contact || {});

  useEffect(() => {
    return dataStore.subscribe(() => {
      setContent(dataStore.getSiteContent().contact || {});
    });
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      await api.post('/messages', form);
      setStatus({
        ok: true,
        text: 'Thank you! Your project inquiry has been received. Our engineering & growth team will review your requirements and reach out within 4 business hours.',
      });
      setForm(initialForm);
    } catch (err) {
      setStatus({
        ok: false,
        text: err.response?.data?.error || 'Something went wrong. Please check your details and try again.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-grid-subtle">
      <section style={{ padding: '44px 0 48px' }}>
        <div className="container contact-grid" style={{ gap: 32, alignItems: 'start' }}>
          {/* LEFT COLUMN: 3D BEACON + DIRECT CONTACT CHANNELS (TIGHT & PURPOSEFUL) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span className="eyebrow" style={{ margin: 0 }}>
                  {content.eyebrow || 'Start a Conversation'}
                </span>
                <span style={{ fontSize: '0.74rem', background: '#ECFDF5', color: '#059669', padding: '3px 8px', borderRadius: 999, fontWeight: 700 }}>
                  ● Response under 4 hours
                </span>
              </div>

              <h1 style={{ fontSize: 'clamp(2.1rem, 3.8vw, 2.9rem)', lineHeight: 1.15 }}>
                {content.title || "Let's build or scale your digital presence."}
              </h1>

              <p style={{ marginTop: 12, fontSize: '0.98rem', color: '#64748B', lineHeight: 1.6 }}>
                {content.description || 'Tell us about your project, timeline, and growth goals. We will review your requirements and schedule a productive 15-minute scoping call.'}
              </p>
            </div>

            {/* 3D TRANSMISSION BEACON CARD */}
            <TiltCard maxTilt={6} className="hero-canvas" style={{ borderRadius: 'var(--radius-md)' }}>
              <InteractiveContact3D />
            </TiltCard>

            {/* 3 COMPACT CONTACT TILES */}
            <div className="responsive-cards-grid" style={{ gap: 12 }}>
              <TiltCard maxTilt={8} className="panel-card" style={{ padding: '16px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Direct Email
                </span>
                <p style={{ color: '#0F172A', fontWeight: 700, fontSize: '0.92rem', marginTop: 4 }}>
                  {content.email || 'hello@brandedcoders.com'}
                </p>
                <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 2 }}>
                  {content.emailSubtext || 'Average reply: under 4 hrs'}
                </p>
              </TiltCard>

              <TiltCard maxTilt={8} className="panel-card" style={{ padding: '16px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  WhatsApp / Phone
                </span>
                <p style={{ color: '#0F172A', fontWeight: 700, fontSize: '0.92rem', marginTop: 4 }}>
                  {content.phone || '+91 98765 43210'}
                </p>
                <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 2 }}>
                  {content.phoneTimings || 'Mon–Sat, 09:30 AM to 07:00 PM IST'}
                </p>
              </TiltCard>

              <TiltCard maxTilt={8} className="panel-card" style={{ padding: '16px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--emerald)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Studio Location
                </span>
                <p style={{ color: '#0F172A', fontWeight: 700, fontSize: '0.92rem', marginTop: 4 }}>
                  {content.address || 'Ludhiana, Punjab, India'}
                </p>
                <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 2 }}>
                  {content.addressSubtext || 'Serving India, USA & Europe'}
                </p>
              </TiltCard>
            </div>
          </div>

          {/* RIGHT COLUMN: INTERACTIVE SCOPING & INQUIRY FORM (TILT CARD WITH NO WASTED SPACE) */}
          <TiltCard maxTilt={5} className="chart-card" style={{ background: '#FFFFFF', border: '1px solid #CBD5E1' }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                  {content.formTitle || 'Project Inquiry Form'}
                </h3>
                <span className="badge badge-active" style={{ fontSize: '0.72rem' }}>Scoping Q3/Q4</span>
              </div>
              <p style={{ fontSize: '0.86rem', color: '#64748B', marginTop: 4 }}>
                {content.formSubtext || 'Fill out this form and a lead will be routed immediately to our growth team.'}
              </p>
            </div>

            {status && (
              <div
                style={{
                  background: status.ok ? '#ECFDF5' : '#FEF2F2',
                  color: status.ok ? '#065F46' : '#991B1B',
                  border: `1px solid ${status.ok ? '#A7F3D0' : '#FECACA'}`,
                  padding: '12px 16px',
                  borderRadius: 8,
                  marginBottom: 18,
                  fontSize: '0.88rem',
                }}
              >
                {status.ok ? '✅ ' : '⚠️ '}{status.text}
              </div>
            )}

            <form onSubmit={onSubmit}>
              {/* INTERACTIVE PROJECT TYPE SELECTOR */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', display: 'block', marginBottom: 6 }}>
                  1. Select Primary Project Scope:
                </label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {PROJECT_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => update('projectType', type)}
                      style={{
                        padding: '6px 11px',
                        borderRadius: 8,
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        background: form.projectType === type ? '#2563EB' : '#F1F5F9',
                        color: form.projectType === type ? '#FFFFFF' : '#334155',
                        border: form.projectType === type ? '1px solid #1D4ED8' : '1px solid #E2E8F0',
                        cursor: 'pointer',
                        transition: 'all 0.12s',
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* BUDGET SELECTION */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', display: 'block', marginBottom: 6 }}>
                  2. Anticipated Investment Bracket:
                </label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {BUDGET_TIERS.map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => update('budget', tier)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: 6,
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        background: form.budget === tier ? '#FF7A00' : '#F8FAFC',
                        color: form.budget === tier ? '#FFFFFF' : '#475569',
                        border: form.budget === tier ? '1px solid #EA580C' : '1px solid #E2E8F0',
                        cursor: 'pointer',
                        transition: 'all 0.12s',
                      }}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* INPUT FIELDS (2 COLUMNS) */}
              <div className="form-two-col">
                <div className="field" style={{ marginBottom: 12 }}>
                  <label htmlFor="name" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Your Name *</label>
                  <input
                    id="name"
                    required
                    placeholder="e.g. Vikram Malhotra"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    style={{ padding: '9px 12px', fontSize: '0.88rem' }}
                  />
                </div>

                <div className="field" style={{ marginBottom: 12 }}>
                  <label htmlFor="phone" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Contact Number *</label>
                  <input
                    id="phone"
                    required
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    style={{ padding: '9px 12px', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div className="form-two-col">
                <div className="field" style={{ marginBottom: 12 }}>
                  <label htmlFor="email" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Work Email *</label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="vikram@company.com"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    style={{ padding: '9px 12px', fontSize: '0.88rem' }}
                  />
                </div>

                <div className="field" style={{ marginBottom: 12 }}>
                  <label htmlFor="company" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Company Name</label>
                  <input
                    id="company"
                    placeholder="Company or Startup name"
                    value={form.company}
                    onChange={(e) => update('company', e.target.value)}
                    style={{ padding: '9px 12px', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div className="field" style={{ marginBottom: 18 }}>
                <label htmlFor="message" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Project Goals & Deliverables *</label>
                <textarea
                  id="message"
                  required
                  rows={3}
                  placeholder="Share details about your product requirements, current challenges, or marketing growth targets…"
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  style={{ padding: '9px 12px', fontSize: '0.88rem', resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
                style={{ width: '100%', padding: '12px', fontSize: '0.96rem', fontWeight: 700 }}
              >
                {submitting ? 'Transmitting to Scoping Team…' : 'Submit Project Inquiry →'}
              </button>

              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
                  🔒 Non-Disclosure Protected · Zero Spam Guarantee · 4-Hour Response Time
                </span>
              </div>
            </form>
          </TiltCard>
        </div>
      </section>
    </div>
  );
}
