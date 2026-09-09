import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import InteractiveAbout3D from '../components/3d/InteractiveAbout3D.jsx';
import TiltCard from '../components/3d/TiltCard.jsx';
import { dataStore } from '../lib/dataStore';

export default function About() {
  const [content, setContent] = useState(dataStore.getSiteContent().about || {});
  const [reviews, setReviews] = useState(dataStore.getReviews());

  useEffect(() => {
    return dataStore.subscribe(() => {
      setContent(dataStore.getSiteContent().about || {});
      setReviews(dataStore.getReviews());
    });
  }, []);

  const pillars = content.pillars || [
    { num: '01', title: 'Engineers & Marketers in Constant Sync', body: 'Too often, developers build a product in a vacuum, and marketers struggle to convert its features. At BrandedCoders, our engineering stack and marketing funnels are designed together from day one.' },
    { num: '02', title: 'Content & Ops Independence for Clients', body: 'We don\u2019t believe in client lock-in. Every build ships with an intuitive custom CMS and clear documentation so your non-technical team can update copy, launch promotions, and view data effortlessly.' },
    { num: '03', title: 'Performance & Speed Obsessed', body: 'A slow site directly degrades your Google SEO ranking and ad conversion rates. We tune Core Web Vitals, write lean modular React code, and optimize server response times to guarantee sub-second page loads.' },
    { num: '04', title: 'Accountability & Direct Access', body: 'You communicate directly with the senior engineers and growth strategists building your project. No layers of non-technical account executives slowing down progress.' },
  ];

  const milestones = [
    { year: '2023', label: 'Founded in Ludhiana', desc: 'Started with specialized React & Next.js custom software builds.' },
    { year: '2024', label: 'Headless CMS Architecture', desc: 'Engineered our proprietary zero-code publishing systems for clients.' },
    { year: '2025', label: 'Full Digital Marketing Hub', desc: 'Integrated performance SEO & PPC ads directly into product development.' },
    { year: '2026', label: 'Cross-Border Scale', desc: 'Serving high-growth brands across India, North America, and the UK.' },
  ];

  return (
    <div className="bg-grid-subtle">
      {/* 3D ABOUT HERO (NO WASTED SPACE) */}
      <section style={{ padding: '44px 0 28px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 32, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span className="eyebrow" style={{ margin: 0 }}>
                {content.eyebrow || 'About the Studio'}
              </span>
              <span style={{ fontSize: '0.74rem', background: '#EFF6FF', color: '#1D4ED8', padding: '3px 8px', borderRadius: 999, fontWeight: 700 }}>
                ● Ludhiana, Punjab, India
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.2rem, 4.2vw, 3.2rem)', lineHeight: 1.15 }}>
              {content.title || 'We build software that grows businesses, not just portfolios.'}
            </h1>

            <p style={{ marginTop: 16, fontSize: '1.05rem', color: '#64748B', maxWidth: 560, lineHeight: 1.65 }}>
              {content.description || 'Founded in Ludhiana, Punjab, BrandedCoders is a specialized full-stack digital product and growth studio. We combine modern JavaScript & React web engineering with performance Digital Marketing to build assets that produce real business equity.'}
            </p>

            {/* STUDIO METRICS ROW */}
            <div className="compact-stats-row" style={{ marginTop: 24 }}>
              <TiltCard maxTilt={8} className="compact-stat-pill">
                <div>
                  <div className="compact-stat-num">100%</div>
                  <div className="compact-stat-label">In-House Engineers</div>
                </div>
              </TiltCard>
              <TiltCard maxTilt={8} className="compact-stat-pill">
                <div>
                  <div className="compact-stat-num" style={{ color: '#059669' }}>&lt; 0.8s</div>
                  <div className="compact-stat-label">Avg. Page Speed</div>
                </div>
              </TiltCard>
              <TiltCard maxTilt={8} className="compact-stat-pill">
                <div>
                  <div className="compact-stat-num" style={{ color: '#FF7A00' }}>4.9 ★</div>
                  <div className="compact-stat-label">Client Feedback</div>
                </div>
              </TiltCard>
              <TiltCard maxTilt={8} className="compact-stat-pill">
                <div>
                  <div className="compact-stat-num" style={{ color: '#2563EB' }}>0</div>
                  <div className="compact-stat-label">Lock-in or Jargon</div>
                </div>
              </TiltCard>
            </div>

            <div style={{ marginTop: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
              <Link to="/contact" className="btn btn-primary" style={{ padding: '11px 22px' }}>
                Start a Conversation →
              </Link>
              <Link to="/work" className="btn btn-ghost" style={{ padding: '11px 20px' }}>
                View Client Case Studies
              </Link>
            </div>
          </div>

          {/* RIGHT: INTERACTIVE 3D STUDIO ATOM */}
          <TiltCard maxTilt={6} className="hero-canvas" style={{ height: 380, display: 'flex', flexDirection: 'column' }}>
            <InteractiveAbout3D />
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 10,
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0F172A' }}>BrandedCoders Studio Node</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Ludhiana HQ · Global Digital Footprint</div>
              </div>
              <span className="badge badge-scheduled" style={{ fontSize: '0.72rem' }}>Online & Active</span>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* PHILOSOPHY & PILLARS (3D TILT CARDS) */}
      <section className="section" style={{ background: '#FFFFFF', borderTop: '1px solid var(--panel-line)', padding: '52px 0' }}>
        <div className="container">
          <div className="section-head" style={{ marginBottom: 28 }}>
            <div>
              <span className="eyebrow">Studio Principles</span>
              <h2>{content.storyTitle || 'How We Work Differently'}</h2>
            </div>
            <p>We built our operational model to eliminate everything clients dislike about typical creative agencies.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
            {pillars.map((p) => (
              <TiltCard
                key={p.num}
                maxTilt={10}
                className="panel-card"
                style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent)', marginBottom: 8 }}>
                    {p.num}
                  </div>
                  <h3 style={{ fontSize: '1.12rem', fontWeight: 700, marginBottom: 8 }}>{p.title}</h3>
                  <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: '#475569' }}>{p.body}</p>
                </div>
                <div style={{ marginTop: 18, paddingTop: 12, borderTop: '1px solid var(--panel-line)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563EB' }} />
                  <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Core Studio Standard</span>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* STUDIO TIMELINE / TRAJECTORY (COMPACT & MODERN) */}
      <section className="section" style={{ padding: '52px 0' }}>
        <div className="container">
          <div className="section-head" style={{ marginBottom: 28 }}>
            <div>
              <span className="eyebrow">Studio Journey</span>
              <h2>Focused on High-Impact Deliverables</h2>
            </div>
            <p>From local software engineering to scaling venture-backed and enterprise operations.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {milestones.map((m) => (
              <TiltCard key={m.year} maxTilt={8} className="panel-card" style={{ padding: '22px' }}>
                <span className="badge" style={{ background: '#EFF6FF', color: '#2563EB', fontWeight: 800, fontSize: '0.82rem', marginBottom: 10 }}>
                  {m.year}
                </span>
                <h4 style={{ fontSize: '1.02rem', fontWeight: 700, margin: '8px 0 6px', color: '#0F172A' }}>{m.label}</h4>
                <p style={{ fontSize: '0.84rem', lineHeight: 1.5, color: '#64748B' }}>{m.desc}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENT REVIEWS */}
      {reviews.length > 0 && (
        <section className="section" style={{ background: '#FFFFFF', borderTop: '1px solid var(--panel-line)', padding: '52px 0' }}>
          <div className="container">
            <div className="section-head" style={{ marginBottom: 28 }}>
              <div>
                <span className="eyebrow">Client Endorsements</span>
                <h2>What Founders & Operators Say</h2>
              </div>
              <p>Direct words from teams whose platforms and digital growth we power daily.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
              {reviews.slice(0, 3).map((r) => (
                <TiltCard key={r.id} maxTilt={8} className="panel-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ color: '#F59E0B', fontSize: '1rem', marginBottom: 10 }}>{'★'.repeat(r.rating || 5)}</div>
                    <p style={{ fontSize: '0.92rem', fontStyle: 'italic', lineHeight: 1.6, color: '#334155' }}>
                      "{r.comment}"
                    </p>
                  </div>
                  <div style={{ marginTop: 18, paddingTop: 12, borderTop: '1px solid var(--panel-line)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>{r.clientName}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{r.company} · {r.projectType}</div>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA SECTION */}
      <section style={{ padding: '48px 0', background: 'radial-gradient(circle at center, #EFF6FF 0%, #F8FAFC 100%)', borderTop: '1px solid var(--panel-line)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 680 }}>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 800 }}>{content.ctaTitle || 'Want to work together?'}</h2>
          <p style={{ fontSize: '0.96rem', color: '#475569', marginTop: 8 }}>
            {content.ctaDesc || 'We take on a limited number of client engagements each quarter to guarantee top quality.'}
          </p>
          <div style={{ marginTop: 22, display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/contact" className="btn btn-primary" style={{ padding: '12px 28px' }}>
              Schedule Scoping Call →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
