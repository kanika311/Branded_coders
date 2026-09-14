import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataStore } from '../../lib/dataStore';

const emptyPlanForm = {
  name: '',
  tagline: '',
  price: '₹19,999',
  period: '/ month',
  sla: '< 4h SLA',
  badge: '',
  featured: false,
  cta: 'Choose Plan',
  featuresText: '99.9% Uptime & Health Monitoring\nWeekly Security & Dependency Patches\nAutomated Daily Cloud Backups\nCore Web Vitals & Speed Monitoring\nUp to 8 Hours dedicated monthly dev edits\nPriority WhatsApp & Email Support',
};

export default function ManagePlans() {
  const [plans, setPlans] = useState(dataStore.getPlans());
  const [siteContent, setSiteContent] = useState(dataStore.getSiteContent());
  const [statusMsg, setStatusMsg] = useState(null);

  // Modal states
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [planForm, setPlanForm] = useState(emptyPlanForm);

  // Section headings state
  const [showHeadingsCard, setShowHeadingsCard] = useState(false);
  const [headingsForm, setHeadingsForm] = useState({
    plansEyebrow: siteContent?.home?.plansEyebrow || 'Long-Term Partnership',
    plansHeading: siteContent?.home?.plansHeading || 'Website & App Maintenance Plans (AMC)',
    plansSubheading: siteContent?.home?.plansSubheading || "We don't disappear after launch. Protect your investment with 99.9% uptime monitoring, speed tuning, and SLA-backed bug fixes.",
  });

  useEffect(() => {
    return dataStore.subscribe(() => {
      setPlans(dataStore.getPlans());
      const sc = dataStore.getSiteContent();
      setSiteContent(sc);
      setHeadingsForm({
        plansEyebrow: sc?.home?.plansEyebrow || '',
        plansHeading: sc?.home?.plansHeading || 'Website & App Maintenance Plans (AMC)',
 
      });
    });
  }, []);

  function notify(text, isError = false) {
    setStatusMsg({ text, isError });
    setTimeout(() => setStatusMsg(null), 3500);
  }

  function handleOpenCreateModal() {
    setEditingPlanId(null);
    setPlanForm(emptyPlanForm);
    setShowPlanModal(true);
  }

  function handleOpenEditModal(plan) {
    setEditingPlanId(plan.id);
    setPlanForm({
      name: plan.name || '',
      tagline: plan.tagline || '',
      price: plan.price || '',
      period: plan.period || '/ month',
      sla: plan.sla || '',
      badge: plan.badge || '',
      featured: !!plan.featured,
      cta: plan.cta || 'Choose Plan',
      featuresText: Array.isArray(plan.features) ? plan.features.join('\n') : '',
    });
    setShowPlanModal(true);
  }

  function handleSavePlan(e) {
    e.preventDefault();
    if (!planForm.name.trim() || !planForm.price.trim()) {
      notify('Plan Name and Price are required.', true);
      return;
    }

    const featuresList = planForm.featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const payload = {
      name: planForm.name.trim(),
      tagline: planForm.tagline.trim(),
      price: planForm.price.trim(),
      period: planForm.period.trim() || '/ month',
      sla: planForm.sla.trim(),
      badge: planForm.badge.trim(),
      featured: !!planForm.featured,
      cta: planForm.cta.trim() || 'Choose Plan',
      features: featuresList,
    };

    if (editingPlanId) {
      dataStore.updatePlan(editingPlanId, payload);
      notify(`✅ Plan "${payload.name}" updated successfully!`);
    } else {
      dataStore.addPlan(payload);
      notify(`✅ New plan "${payload.name}" created and published!`);
    }

    setShowPlanModal(false);
  }

  function handleDeletePlan(id, name) {
    if (confirm(`Are you sure you want to delete the plan "${name}"? This will immediately remove it from both the Home page and /plans page.`)) {
      dataStore.deletePlan(id);
      notify(`🗑️ Plan "${name}" deleted.`);
    }
  }

  function handleToggleFeatured(plan) {
    dataStore.updatePlan(plan.id, { featured: !plan.featured });
    notify(`Updated badge status for "${plan.name}".`);
  }

  function handleSaveHeadings(e) {
    e.preventDefault();
    dataStore.updateSiteContent('home', {
      plansEyebrow: headingsForm.plansEyebrow,
      plansHeading: headingsForm.plansHeading,
      plansSubheading: headingsForm.plansSubheading,
    });
    notify('✅ Section titles and headings updated across website!');
    setShowHeadingsCard(false);
  }

  function handleResetDefaults() {
    if (confirm('Reset all maintenance plans to the default agency tiers (Essential, Growth, Enterprise)? Any custom plans will be replaced.')) {
      dataStore.resetPlans();
      notify('🔄 Plans restored to default agency configuration.');
    }
  }

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* 1. TOP HEADER & BREADCRUMB */}
      <div className="flex-between" style={{ marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: 4, fontWeight: 600 }}>
            ADMIN PORTAL &rarr; PLANS &amp; AMC CMS
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Maintenance &amp; AMC Plans CMS
          </h1>
          <p style={{ marginTop: 6, color: '#475569', fontSize: '0.92rem', maxWidth: '640px' }}>
            Manage public website maintenance tiers, engineering retainers, prices, SLAs, and feature checklists. Changes reflect immediately on both the Home page and dedicated <Link to="/plans" target="_blank" style={{ color: 'var(--accent)', fontWeight: 600 }}>/plans</Link> page.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link
            to="/plans"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.88rem', background: '#FFFFFF' }}
          >
            <span>Live /plans Page</span>
            <span>&rarr;</span>
          </Link>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setShowHeadingsCard(!showHeadingsCard)}
            style={{ fontSize: '0.88rem', background: '#FFFFFF' }}
          >
            ✏️ {showHeadingsCard ? 'Hide Headings' : 'Edit Headings'}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleOpenCreateModal}
            style={{ fontSize: '0.88rem', fontWeight: 700 }}
          >
            + Create New Plan
          </button>
        </div>
      </div>

      {/* 2. NOTIFICATION TOAST */}
      {statusMsg && (
        <div
          className={`status-msg ${statusMsg.isError ? 'status-err' : 'status-ok'}`}
          style={{ marginBottom: 20, animation: 'fadeIn 0.2s ease' }}
        >
          {statusMsg.text}
        </div>
      )}

      {/* 3. QUICK STATS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="panel-card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
            Active Plans
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: 4 }}>
            {plans.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#10B981', marginTop: 4, fontWeight: 600 }}>
            Live on Website &amp; Catalog
          </div>
        </div>

        <div className="panel-card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
            Featured / Highlighted
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent)', marginTop: 4 }}>
            {plans.find((p) => p.featured)?.name || 'None Selected'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 4 }}>
            Glowing border &amp; badge
          </div>
        </div>

        <div className="panel-card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
            Fastest SLA Tier
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10B981', marginTop: 4 }}>
            1-Hour Critical
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 4 }}>
            Enterprise Retainer SLA
          </div>
        </div>

        <div className="panel-card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
            Central Storage
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: 4 }}>
            Instant Sync
          </div>
          <button
            type="button"
            onClick={handleResetDefaults}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              fontSize: '0.76rem',
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: 0,
              marginTop: 4,
            }}
          >
            Reset to Defaults
          </button>
        </div>
      </div>

      {/* 4. OPTIONAL EDIT SECTION HEADINGS FORM */}
      {showHeadingsCard && (
        <form onSubmit={handleSaveHeadings} className="panel-card" style={{ marginBottom: 24, borderLeft: '4px solid var(--accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Section Titles &amp; Subheadings
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
              Used on Home AMC section and /plans hero banner
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14, marginBottom: 12 }}>
            <div className="field">
              <label>Eyebrow Tag / Pill</label>
              <input
                type="text"
                value={headingsForm.plansEyebrow}
                onChange={(e) => setHeadingsForm({ ...headingsForm, plansEyebrow: e.target.value })}
                placeholder="e.g. Long-Term Partnership"
              />
            </div>

            <div className="field">
              <label>Main Section Heading *</label>
              <input
                type="text"
                required
                value={headingsForm.plansHeading}
                onChange={(e) => setHeadingsForm({ ...headingsForm, plansHeading: e.target.value })}
                placeholder="Website & App Maintenance Plans (AMC)"
              />
            </div>
          </div>

          <div className="field" style={{ marginBottom: 16 }}>
            <label>Subheading / Guarantee Statement</label>
            <textarea
              rows={2}
              value={headingsForm.plansSubheading}
              onChange={(e) => setHeadingsForm({ ...headingsForm, plansSubheading: e.target.value })}
              placeholder="We don't disappear after launch..."
            />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.88rem' }}>
              Save Section Headings
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setShowHeadingsCard(false)}
              style={{ padding: '10px 16px', fontSize: '0.88rem' }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* 5. PLANS LIST (CARDS GRID WITH LIVE PREVIEW) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {plans.map((plan) => {
          const isFeatured = !!plan.featured;
          return (
            <div
              key={plan.id}
              className="panel-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                border: isFeatured ? '2px solid #2563EB' : '1px solid #E2E8F0',
                boxShadow: isFeatured ? '0 12px 30px -6px rgba(37, 99, 235, 0.15)' : 'none',
                background: '#FFFFFF',
              }}
            >
              {/* Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {plan.name}
                    </h3>
                    {isFeatured && (
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#2563EB', color: '#FFFFFF', padding: '2px 8px', borderRadius: 999 }}>
                        {plan.badge || 'Featured'}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: 4 }}>
                    {plan.tagline || 'No tagline set'}
                  </div>
                </div>

                {plan.sla && (
                  <span style={{ fontSize: '0.74rem', background: '#F1F5F9', color: '#334155', fontWeight: 700, padding: '4px 8px', borderRadius: 6 }}>
                    ⚡ {plan.sla}
                  </span>
                )}
              </div>

              {/* Price */}
              <div style={{ padding: '14px 0', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', fontFamily: 'Space Grotesk, sans-serif' }}>
                    {plan.price}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
                    {plan.period}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: 4 }}>
                  CTA Button: <strong>"{plan.cta || 'Choose Plan'}"</strong>
                </div>
              </div>

              {/* Features count & items */}
              <div style={{ flex: 1, marginBottom: 20 }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 8 }}>
                  Included Features ({Array.isArray(plan.features) ? plan.features.length : 0})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: '200px', overflowY: 'auto' }}>
                  {(Array.isArray(plan.features) ? plan.features : []).map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: '#334155' }}>
                      <span style={{ color: '#10B981', fontWeight: 800 }}>✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', gap: 8, paddingTop: 14, borderTop: '1px solid #F1F5F9', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => handleToggleFeatured(plan)}
                  style={{
                    fontSize: '0.78rem',
                    padding: '8px 12px',
                    color: isFeatured ? '#2563EB' : '#64748B',
                    fontWeight: 600,
                  }}
                >
                  {isFeatured ? '★ Featured' : '☆ Make Featured'}
                </button>

                <div style={{ flex: 1 }} />

                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => handleOpenEditModal(plan)}
                  style={{ fontSize: '0.82rem', padding: '8px 14px', fontWeight: 700 }}
                >
                  ✏️ Edit
                </button>

                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => handleDeletePlan(plan.id, plan.name)}
                  style={{ fontSize: '0.82rem', padding: '8px 14px', color: '#EF4444', fontWeight: 700 }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {plans.length === 0 && (
        <div className="panel-card" style={{ textAlign: 'center', padding: '48px 20px' }}>
          <p style={{ color: '#64748B', fontSize: '1rem', margin: 0 }}>
            No maintenance plans found.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleResetDefaults}
            style={{ marginTop: 14 }}
          >
            Restore Default Agency Plans
          </button>
        </div>
      )}

      {/* 6. CREATE / EDIT PLAN MODAL */}
      {showPlanModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setShowPlanModal(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 18,
              maxWidth: 580,
              width: '100%',
              padding: 28,
              boxShadow: '0 24px 48px rgba(15, 23, 42, 0.25)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {editingPlanId ? 'Edit Maintenance Plan' : 'Create New Maintenance Plan'}
              </h3>
              <button
                type="button"
                onClick={() => setShowPlanModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', color: '#94A3B8', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePlan}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12, marginBottom: 12 }}>
                <div className="field">
                  <label>Plan Name *</label>
                  <input
                    type="text"
                    required
                    value={planForm.name}
                    onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                    placeholder="e.g. Growth & Scale AMC"
                  />
                </div>

                <div className="field">
                  <label>SLA Response Time</label>
                  <input
                    type="text"
                    value={planForm.sla}
                    onChange={(e) => setPlanForm({ ...planForm, sla: e.target.value })}
                    placeholder="e.g. < 4h SLA or 24h SLA"
                  />
                </div>
              </div>

              <div className="field" style={{ marginBottom: 12 }}>
                <label>Short Tagline / Target Audience</label>
                <input
                  type="text"
                  value={planForm.tagline}
                  onChange={(e) => setPlanForm({ ...planForm, tagline: e.target.value })}
                  placeholder="e.g. For revenue-generating platforms & apps"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div className="field">
                  <label>Price Display *</label>
                  <input
                    type="text"
                    required
                    value={planForm.price}
                    onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                    placeholder="e.g. ₹29,999 or Custom"
                  />
                </div>

                <div className="field">
                  <label>Billing Period</label>
                  <input
                    type="text"
                    value={planForm.period}
                    onChange={(e) => setPlanForm({ ...planForm, period: e.target.value })}
                    placeholder="e.g. / month or tailored SLA"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div className="field">
                  <label>Highlight Badge</label>
                  <input
                    type="text"
                    value={planForm.badge}
                    onChange={(e) => setPlanForm({ ...planForm, badge: e.target.value })}
                    placeholder="e.g. Most Popular, Best Value"
                  />
                </div>

                <div className="field">
                  <label>Button Call to Action (CTA)</label>
                  <input
                    type="text"
                    value={planForm.cta}
                    onChange={(e) => setPlanForm({ ...planForm, cta: e.target.value })}
                    placeholder="e.g. Choose Growth AMC"
                  />
                </div>
              </div>

              <div className="field" style={{ flexDirection: 'row', alignItems: 'center', gap: 10, margin: '14px 0' }}>
                <input
                  type="checkbox"
                  id="plan-featured"
                  checked={planForm.featured}
                  onChange={(e) => setPlanForm({ ...planForm, featured: e.target.checked })}
                  style={{ width: 18, height: 18, cursor: 'pointer' }}
                />
                <label htmlFor="plan-featured" style={{ margin: 0, fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}>
                  Highlight this plan as "Most Popular" (Blue glowing border &amp; badge)
                </label>
              </div>

              <div className="field" style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <label style={{ margin: 0 }}>Included Features (One per line) *</label>
                  <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                    {planForm.featuresText.split('\n').filter((s) => s.trim()).length} features entered
                  </span>
                </div>
                <textarea
                  rows={6}
                  required
                  value={planForm.featuresText}
                  onChange={(e) => setPlanForm({ ...planForm, featuresText: e.target.value })}
                  placeholder="99.9% Uptime & Health Monitoring&#10;Weekly Security & Dependency Patches&#10;Automated Daily Cloud Backups&#10;Core Web Vitals & Speed Monitoring&#10;Up to 12 Hours dedicated feature updates"
                  style={{ fontSize: '0.86rem', lineHeight: 1.5 }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowPlanModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '11px 24px', fontWeight: 700 }}
                >
                  {editingPlanId ? 'Save Changes' : 'Create & Publish Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
