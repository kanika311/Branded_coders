import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import InteractiveHero3D from '../components/3d/InteractiveHero3D.jsx';
import TiltCard from '../components/3d/TiltCard.jsx';
import api from '../lib/api.js';
import { dataStore } from '../lib/dataStore.js';

export default function Home() {
  const [services, setServices] = useState([]);
  const [content, setContent] = useState(dataStore.getSiteContent().home || {});
  const [faqs, setFaqs] = useState(dataStore.getFaqs());
  const [reviews, setReviews] = useState(dataStore.getReviews());
  const [openFaqId, setOpenFaqId] = useState(null);

  useEffect(() => {
    api.get('/services').then((res) => {
      if (res.data?.length) {
        setServices(res.data.filter((s) => s.published !== false));
      }
    }).catch(() => {});

    return dataStore.subscribe(() => {
      setContent(dataStore.getSiteContent().home || {});
      setFaqs(dataStore.getFaqs());
      setReviews(dataStore.getReviews());
    });
  }, []);

  const process = [
    { step: '01', title: 'Discover & Strategy', body: 'Deep audit of your market, competitors, and growth bottlenecks before any code.' },
    { step: '02', title: 'Architecture & UI/UX', body: 'Figma prototypes and conversion-first wireframes tuned for fast user activation.' },
    { step: '03', title: 'Full-Stack Engineering', body: 'Sub-second React frontends, robust Node APIs, and bespoke CMS architecture.' },
    { step: '04', title: 'Digital Marketing & Scale', body: 'Google/Meta PPC ads, technical SEO, and conversion optimization to drive revenue.' },
  ];

  return (
    <div className="bg-grid-subtle">
      {/* HERO SECTION WITH INTERACTIVE 3D & COMPACT STATS */}
      <section className="hero" style={{ padding: '48px 0 32px' }}>
        <div className="container hero-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <span className="eyebrow" style={{ margin: 0 }}>
                {content.heroEyebrow || '✨ Digital Product Studio & Growth Agency'}
              </span>
              <span style={{ fontSize: '0.74rem', background: '#ECFDF5', color: '#059669', padding: '3px 8px', borderRadius: 999, fontWeight: 700 }}>
                ● Accepting Q3/Q4 Projects
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.75rem, 4.2vw, 3.4rem)', lineHeight: 1.15 }}>
              {content.heroHeadline || 'We build high-converting software and scale it with Digital Marketing.'}
            </h1>

            <p className="lede" style={{ marginTop: 16, fontSize: '1.05rem', maxWidth: 540 }}>
              {content.heroDescription || 'BrandedCoders designs and engineers fast websites, bespoke CMS platforms, operational dashboards, and mobile apps — paired with data-driven SEO and paid acquisition to drive measurable revenue.'}
            </p>

            <div className="hero-actions" style={{ marginTop: 24 }}>
              <Link to="/contact" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '0.96rem' }}>
                Book a Scoping Call →
              </Link>
              <Link to="/services" className="btn btn-ghost" style={{ padding: '12px 20px', fontSize: '0.96rem' }}>
                Explore Services
              </Link>
            </div>

            {/* COMPACT STATS ROW (NO EMPTY WASTED SPACE) */}
            <div className="compact-stats-row" style={{ marginTop: 28 }}>
              <TiltCard maxTilt={8} className="compact-stat-pill">
                <div>
                  <div className="compact-stat-num">{content.stat1Number || '60+'}</div>
                  <div className="compact-stat-label">{content.stat1Label || 'Products Shipped'}</div>
                </div>
              </TiltCard>

              <TiltCard maxTilt={8} className="compact-stat-pill">
                <div>
                  <div className="compact-stat-num">{content.stat2Number || '4.9/5'}</div>
                  <div className="compact-stat-label">{content.stat2Label || 'Client Rating'}</div>
                </div>
              </TiltCard>

              <TiltCard maxTilt={8} className="compact-stat-pill">
                <div>
                  <div className="compact-stat-num" style={{ color: '#FF7A00' }}>{content.stat3Number || '+280%'}</div>
                  <div className="compact-stat-label">{content.stat3Label || 'Avg. Growth'}</div>
                </div>
              </TiltCard>

              <TiltCard maxTilt={8} className="compact-stat-pill">
                <div>
                  <div className="compact-stat-num" style={{ color: '#2563EB' }}>{content.stat4Number || '100%'}</div>
                  <div className="compact-stat-label">{content.stat4Label || 'In-House Team'}</div>
                </div>
              </TiltCard>
            </div>
          </div>

          {/* RIGHT: INTERACTIVE 3D WEBGL CORE */}
          <div className="hero-canvas">
            <InteractiveHero3D />
          </div>
        </div>
      </section>

      {/* COMPACT DIGITAL MARKETING STRIP */}
      <section style={{ background: '#FFFFFF', borderTop: '1px solid var(--panel-line)', borderBottom: '1px solid var(--panel-line)', padding: '24px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, flexShrink: 0, borderRadius: 10, background: 'var(--orange-light)', color: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 800 }}>
                📈
              </div>
              <div>
                <h3 style={{ fontSize: '1.12rem', fontWeight: 700, color: '#0F172A' }}>
                  {content.marketingBannerTitle || 'Now Offering End-to-End Digital Marketing Services'}
                </h3>
                <p style={{ fontSize: '0.86rem', color: '#64748B', marginTop: 2 }}>
                  {content.marketingBannerDesc || 'Google & Meta Ads management, Technical SEO audits, Social Media Growth, and Conversion Rate Optimization.'}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Link to="/services" className="btn btn-secondary btn-sm" style={{ padding: '8px 16px', fontWeight: 600 }}>
                Explore Growth Retainers →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES (3D TILT SERVICE CARDS) */}
      <section className="section" style={{ padding: '56px 0' }}>
        <div className="container">
          <div className="section-head" style={{ marginBottom: 32 }}>
            <div>
              <span className="eyebrow">Studio Capabilities</span>
              <h2>Engineering & Growth under one roof.</h2>
            </div>
            <p>
              No finger-pointing between developers and marketing teams. We build digital products designed from day one to attract, convert, and retain clients.
            </p>
          </div>

          <div className="service-grid">
            {services.map((s, i) => (
              <TiltCard
                key={s._id || s.slug || i}
                maxTilt={10}
                className={`service-card ${s.badge ? 'highlight' : ''}`}
                style={{ padding: '24px' }}
              >
                <div>
                  <div className="service-card-top">
                    <span className="eyebrow" style={{ margin: 0, fontSize: '0.72rem', padding: '2px 8px' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {s.badge && (
                      <span className="badge badge-scheduled" style={{ fontSize: '0.72rem' }}>{s.badge}</span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.18rem', marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: '0.88rem', lineHeight: 1.55 }}>{s.summary || s.description}</p>
                </div>

                {s.highlights && (
                  <div className="service-tags" style={{ marginTop: 18 }}>
                    {s.highlights.slice(0, 3).map((h) => (
                      <span key={h} className="service-pill" style={{ fontSize: '0.74rem' }}>{h}</span>
                    ))}
                  </div>
                )}
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* 4-STEP PROCESS (COMPACT HORIZONTAL FLOW) */}
      <section className="section" style={{ background: '#FFFFFF', borderTop: '1px solid var(--panel-line)', padding: '56px 0' }}>
        <div className="container">
          <div className="section-head" style={{ marginBottom: 32 }}>
            <div>
              <span className="eyebrow">Structured Execution</span>
              <h2>How We Deliver High-Growth Digital Products</h2>
            </div>
            <p>From initial market research to live product scaling, every milestone is structured and measurable.</p>
          </div>

          <div className="responsive-cards-grid">
            {process.map((p) => (
              <TiltCard key={p.step} maxTilt={9} className="panel-card" style={{ padding: '24px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)', marginBottom: 8 }}>
                  {p.step}
                </div>
                <h3 style={{ fontSize: '1.08rem', fontWeight: 700, marginBottom: 6 }}>{p.title}</h3>
                <p style={{ fontSize: '0.86rem', lineHeight: 1.55 }}>{p.body}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENT REVIEWS & TESTIMONIALS (3D TILT CARDS) */}
      {reviews.length > 0 && (
        <section className="section" style={{ padding: '56px 0' }}>
          <div className="container">
            <div className="section-head" style={{ marginBottom: 32 }}>
              <div>
                <span className="eyebrow">Proof of Quality</span>
                <h2>Client Endorsements & Measurable ROI</h2>
              </div>
              <p>Trusted by founders, logistics leaders, and high-growth retail brands across India and globally.</p>
            </div>

            <div className="responsive-cards-grid">
              {reviews.map((r) => (
                <TiltCard key={r.id} maxTilt={8} className="panel-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ color: '#F59E0B', fontSize: '1rem', letterSpacing: 2 }}>
                        {'★'.repeat(r.rating || 5)}
                      </div>
                      <span className="badge" style={{ background: '#EFF6FF', color: '#2563EB', fontSize: '0.72rem' }}>
                        {r.projectType || 'Verified Client'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.92rem', fontStyle: 'italic', lineHeight: 1.6, color: '#334155' }}>
                      "{r.comment}"
                    </p>
                  </div>
                  <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid var(--panel-line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>{r.clientName}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{r.company}</div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{r.date}</span>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FREQUENTLY ASKED QUESTIONS */}
      {faqs.length > 0 && (
        <section className="section" style={{ background: '#FFFFFF', borderTop: '1px solid var(--panel-line)', padding: '56px 0' }}>
          <div className="container" style={{ maxWidth: 860 }}>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <span className="eyebrow">Clear Answers</span>
              <h2 style={{ marginTop: 8 }}>Frequently Asked Questions</h2>
              <p style={{ marginTop: 8, fontSize: '0.95rem' }}>
                Everything you need to know about engaging with BrandedCoders.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {faqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="panel-card"
                    style={{
                      padding: '18px 24px',
                      cursor: 'pointer',
                      transition: 'border-color 0.18s, box-shadow 0.18s',
                      borderColor: isOpen ? 'var(--accent)' : 'var(--panel-line)',
                    }}
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: isOpen ? 'var(--accent)' : '#0F172A' }}>
                        {faq.question}
                      </h4>
                      <span style={{ fontSize: '1.2rem', color: isOpen ? 'var(--accent)' : '#64748B', transition: 'transform 0.2s', transform: isOpen ? 'rotate(45deg)' : 'none' }}>
                        +
                      </span>
                    </div>
                    {isOpen && (
                      <p style={{ marginTop: 12, fontSize: '0.9rem', lineHeight: 1.6, color: '#475569', borderTop: '1px solid #F1F5F9', paddingTop: 12 }}>
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* BOTTOM ACTION BANNER (TIGHT & PURPOSEFUL) */}
      <section style={{ padding: '48px 0', background: 'radial-gradient(circle at center, #EFF6FF 0%, #F8FAFC 100%)', borderTop: '1px solid var(--panel-line)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 680 }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.8vw, 2.2rem)', fontWeight: 800 }}>
            {content.ctaHeadline || 'Ready to launch or accelerate your digital product?'}
          </h2>
          <p style={{ marginTop: 10, fontSize: '1rem', color: '#475569' }}>
            {content.ctaDesc || "Share your requirements with our team. We'll reply within one business day with a structured scoping estimate and strategy."}
          </p>
          <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '0.98rem' }}>
              Start Scoping Call →
            </Link>
            <Link to="/work" className="btn btn-ghost" style={{ padding: '12px 22px', fontSize: '0.98rem' }}>
              View Case Studies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
