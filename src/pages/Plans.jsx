import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { dataStore } from '../lib/dataStore';

export default function Plans() {
  const [searchParams] = useSearchParams();
  const [plans, setPlans] = useState(dataStore.getPlans());
  const [siteContent, setSiteContent] = useState(dataStore.getSiteContent());

  // Plan enrollment modal state
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    websiteUrl: '',
    planName: 'Growth & Scale AMC',
    requirements: '',
  });

  // Subscribe to dataStore changes
  useEffect(() => {
    return dataStore.subscribe((data) => {
      if (data.plans) setPlans(data.plans);
      if (data.siteContent) setSiteContent(data.siteContent);
    });
  }, []);

  // Pre-select plan if passed via URL query param
  useEffect(() => {
    const planParam = searchParams.get('plan');
    if (planParam) {
      const match = plans.find((p) => p.name.toLowerCase() === planParam.toLowerCase());
      if (match) {
        handleOpenModal(match);
      }
    }
  }, [searchParams, plans]);

  function handleOpenModal(plan) {
    setSelectedPlan(plan);
    setFormData((prev) => ({
      ...prev,
      planName: plan?.name || 'Growth & Scale AMC',
    }));
    setShowModal(true);
    setFormSubmitted(false);
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    // Save as lead into dataStore
    dataStore.addLead({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || 'Provided via form',
      company: formData.company || 'Website Lead',
      leadType: 'AMC Plan Enrollment',
      service: `Maintenance Plan: ${formData.planName}`,
      budget: selectedPlan ? selectedPlan.price : 'Custom',
      notes: `Website: ${formData.websiteUrl || 'N/A'}. Requirements: ${formData.requirements || 'Interested in enrolling in plan.'}`,
      status: 'New',
    });

    setFormSubmitted(true);
    setTimeout(() => {
      setShowModal(false);
      setFormSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        websiteUrl: '',
        planName: 'Growth & Scale AMC',
        requirements: '',
      });
    }, 2800);
  }

  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const plansFaqs = [
    {
      q: 'Can we change or cancel our maintenance plan at any time?',
      a: 'Yes, absolutely. Our monthly plans are billed month-to-month with zero long-term lock-in. You can upgrade, downgrade, or cancel your retainer with a simple 15-day written notice before your next billing cycle.',
    },
    {
      q: 'What counts as dedicated monthly development hours?',
      a: 'Dedicated hours can be used for new feature development, landing page builds, checkout flow improvements, third-party API integrations, bug fixes, or CMS tweaks. Any task that improves your platform qualifies.',
    },
    {
      q: 'What happens if we do not use all our dev hours in a month?',
      a: 'On our Growth & Scale and Enterprise plans, up to 50% of unused development hours rollover to the subsequent month, ensuring you always extract maximum commercial value from your retainer.',
    },
    {
      q: 'How fast do you respond if our website or application goes down?',
      a: 'For critical outages, our monitoring systems trigger immediate SMS & push alerts to our on-call engineers. On the Growth plan, our guaranteed response SLA is under 4 hours, and for Enterprise clients, our critical response SLA is under 1 hour, 24/7/365.',
    },
    {
      q: 'Do you take over maintenance for websites or apps built by other agencies?',
      a: 'Yes. We conduct a thorough Codebase & Infrastructure Audit during week one to document all dependencies, security vulnerabilities, and server credentials before formally taking over production monitoring.',
    },
  ];

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', }}>
      {/* 1. HERO HEADER */}
      <section style={{ padding: '40px 0 60px' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '820px' }}>
          {/* <span
            style={{
              fontSize: '0.82rem',
              fontWeight: 800,
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              background: '#EFF6FF',
              padding: '6px 14px',
              borderRadius: 999,
              border: '1px solid #DBEAFE',
              display: 'inline-block',
              marginBottom: 16,
            }}
          >
            {siteContent?.home?.plansEyebrow || 'Long-Term Partnership'}
          </span> */}

          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: 0, marginBottom: 16 }}>
            {siteContent?.home?.plansHeading || 'Website & App Maintenance Plans (AMC)'}
          </h1>

        

          {/* Trust Highlights */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginTop: 28, fontSize: '0.86rem', color: '#334155', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
              Guaranteed 99.9% Uptime SLA
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
              Month-to-Month (No Lock-In)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
              Direct Senior Engineers Only
            </span>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC PRICING TIERS */}
      <section style={{ paddingBottom: '70px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', alignItems: 'stretch' }}>
            {plans.map((plan) => {
              const isFeatured = plan.featured;
              return (
                <div
                  key={plan.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    border: isFeatured ? '2px solid #2563EB' : '1px solid #E2E8F0',
                    padding: '36px 30px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: isFeatured ? '0 16px 36px -6px rgba(37, 99, 235, 0.18)' : '0 4px 16px rgba(15, 23, 42, 0.04)',
                    position: 'relative',
                    transition: 'transform 0.25s ease',
                  }}
                >
                  {isFeatured && (
                    <div
                      style={{
                        position: 'absolute',
                        top: -13,
                        right: 28,
                        background: 'linear-gradient(90deg, #2563EB, #1D4ED8)',
                        color: '#FFFFFF',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        padding: '4px 14px',
                        borderRadius: 999,
                        letterSpacing: '0.04em',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                      }}
                    >
                      {plan.badge || 'Most Popular'}
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                      <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        {plan.name}
                      </h2>
                      {plan.sla && (
                        <span style={{ fontSize: '0.74rem', background: '#F1F5F9', color: '#334155', padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>
                          ⚡ {plan.sla}
                        </span>
                      )}
                    </div>

                    <p style={{ fontSize: '0.88rem', color: '#64748B', marginTop: 4, marginBottom: 24, minHeight: '40px' }}>
                      {plan.tagline}
                    </p>

                    {/* Price */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 28, paddingBottom: 22, borderBottom: '1px solid #F1F5F9' }}>
                      <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.03em' }}>
                        {plan.price}
                      </span>
                      <span style={{ fontSize: '0.88rem', color: '#64748B', fontWeight: 600 }}>{plan.period}</span>
                    </div>

                    {/* Feature list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        What's Included:
                      </span>
                      {(Array.isArray(plan.features) ? plan.features : []).map((feat) => (
                        <div key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.88rem', color: '#334155' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" style={{ marginTop: 2, flexShrink: 0 }}>
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span style={{ lineHeight: 1.45 }}>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenModal(plan)}
                    className={`btn ${isFeatured ? 'btn-primary' : 'btn-ghost'}`}
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '13px',
                      fontSize: '0.94rem',
                      fontWeight: 700,
                      borderRadius: '12px',
                      border: isFeatured ? 'none' : '1px solid #CBD5E1',
                      cursor: 'pointer',
                      boxShadow: isFeatured ? '0 6px 18px rgba(37, 99, 235, 0.25)' : 'none',
                    }}
                  >
                    {plan.cta || 'Choose Plan'} &rarr;
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. DETAILED COMPARISON MATRIX TABLE */}
      <section style={{ padding: '40px 0 80px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Feature Breakdown
            </span>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', marginTop: 6 }}>
              Comprehensive SLA &amp; Capability Matrix
            </h2>
          </div>

          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '18px',
              border: '1px solid #E2E8F0',
              overflowX: 'auto',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '680px' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '16px 20px', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Feature / Capability</th>
                  <th style={{ padding: '16px 20px', fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>Essential Care</th>
                  <th style={{ padding: '16px 20px', fontSize: '0.85rem', fontWeight: 800, color: '#2563EB' }}>Growth &amp; Scale AMC</th>
                  <th style={{ padding: '16px 20px', fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>Enterprise Retainer</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.86rem', color: '#334155' }}>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 600 }}>Critical Bug Fix Response SLA</td>
                  <td style={{ padding: '14px 20px' }}>Under 24 Hours</td>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: '#2563EB' }}>Under 4 Hours</td>
                  <td style={{ padding: '14px 20px', fontWeight: 700 }}>Under 1 Hour (24/7)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 600 }}>Dedicated Monthly Dev Edits</td>
                  <td style={{ padding: '14px 20px' }}>Up to 4 Hours</td>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: '#2563EB' }}>Up to 12 Hours</td>
                  <td style={{ padding: '14px 20px', fontWeight: 700 }}>30+ Hours / Month</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 600 }}>Uptime &amp; Health Monitoring</td>
                  <td style={{ padding: '14px 20px' }}>99.9% Automated</td>
                  <td style={{ padding: '14px 20px' }}>99.9% Automated</td>
                  <td style={{ padding: '14px 20px' }}>99.99% Multi-Region</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 600 }}>Core Web Vitals &amp; Speed Tuning</td>
                  <td style={{ padding: '14px 20px' }}>Monthly Checks</td>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: '#2563EB' }}>Bi-Weekly Continuous Tuning</td>
                  <td style={{ padding: '14px 20px', fontWeight: 700 }}>Real-time Edge Profiling</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 600 }}>Cloud Backups &amp; Rollback</td>
                  <td style={{ padding: '14px 20px' }}>Automated Daily</td>
                  <td style={{ padding: '14px 20px' }}>Automated Daily + Staging</td>
                  <td style={{ padding: '14px 20px' }}>Hourly Snapshots + Hot Failover</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 600 }}>Communication Channel</td>
                  <td style={{ padding: '14px 20px' }}>Email &amp; Ticket Portal</td>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: '#2563EB' }}>Dedicated WhatsApp Group</td>
                  <td style={{ padding: '14px 20px', fontWeight: 700 }}>Direct Slack + Founder Line</td>
                </tr>
                <tr>
                  <td style={{ padding: '14px 20px', fontWeight: 600 }}>Strategic Growth &amp; Arch Calls</td>
                  <td style={{ padding: '14px 20px' }}>Quarterly Report</td>
                  <td style={{ padding: '14px 20px' }}>Bi-Weekly Sync</td>
                  <td style={{ padding: '14px 20px', fontWeight: 700 }}>Weekly Standup with Architect</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. PLANS FAQ ACCORDION */}
      <section style={{ padding: '20px 0 60px' }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Common Inquiries
            </span>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', marginTop: 6 }}>
              Frequently Asked Questions About AMC
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {plansFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={faq.q}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 14,
                    border: '1px solid #E2E8F0',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '18px 22px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: '#0F172A',
                      fontWeight: 700,
                      fontSize: '1rem',
                    }}
                  >
                    <span>{faq.q}</span>
                    <span style={{ fontSize: '1.2rem', color: '#64748B' }}>{isOpen ? '−' : '+'}</span>
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 22px 20px', fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. ENROLLMENT / CONSULTATION MODAL */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              maxWidth: 540,
              width: '100%',
              padding: 32,
              boxShadow: '0 24px 48px rgba(15, 23, 42, 0.2)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {formSubmitted ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎉</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Enrollment Inquiry Received!
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#475569', marginTop: 8, lineHeight: 1.5 }}>
                  Our technical lead will review your requirements and reach out via WhatsApp &amp; Email within 2 hours to initiate your onboarding audit.
                </p>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      Enroll in Maintenance Plan
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 700, marginTop: 4 }}>
                      Selected: {formData.planName}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', color: '#94A3B8', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleFormSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', marginBottom: 6, color: '#0F172A' }}>
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Vikram Malhotra"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', marginBottom: 6, color: '#0F172A' }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="vikram@company.com"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', marginBottom: 6, color: '#0F172A' }}>
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', marginBottom: 6, color: '#0F172A' }}>
                        Company / Brand Name
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Zenith Organics"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', marginBottom: 6, color: '#0F172A' }}>
                      Current Website / App URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                      placeholder="e.g. https://mybrand.com"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                    />
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', marginBottom: 6, color: '#0F172A' }}>
                      Selected Plan Tier
                    </label>
                    <select
                      value={formData.planName}
                      onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.88rem', background: '#FFFFFF' }}
                    >
                      {plans.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name} ({p.price} {p.period})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', marginBottom: 6, color: '#0F172A' }}>
                      Key Priorities or Questions
                    </label>
                    <textarea
                      rows={3}
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      placeholder="Tell us about your tech stack, current bottlenecks, or immediate feature updates needed..."
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.88rem', resize: 'vertical' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '13px', borderRadius: 10, fontWeight: 700, fontSize: '0.95rem' }}
                  >
                    Confirm &amp; Request Onboarding Audit &rarr;
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
