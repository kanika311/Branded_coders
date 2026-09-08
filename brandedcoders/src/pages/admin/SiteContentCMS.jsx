import { useState, useEffect } from 'react';
import { dataStore } from '../../lib/dataStore';

export default function SiteContentCMS() {
  const [activeTab, setActiveTab] = useState('home');
  const [siteContent, setSiteContent] = useState(dataStore.getSiteContent());
  const [statusMsg, setStatusMsg] = useState(null);

  // Home Form state
  const [homeForm, setHomeForm] = useState(siteContent.home || {});
  // About Form state
  const [aboutForm, setAboutForm] = useState(siteContent.about || {});
  // Contact Form state
  const [contactForm, setContactForm] = useState(siteContent.contact || {});
  // Footer Form state
  const [footerForm, setFooterForm] = useState(siteContent.footer || {});
  // Legal Form state
  const [privacyPolicy, setPrivacyPolicy] = useState(siteContent.privacyPolicy || '');
  const [termsAndConditions, setTermsAndConditions] = useState(siteContent.termsAndConditions || '');

  // FAQs state
  const [faqs, setFaqs] = useState(dataStore.getFaqs());
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '', order: 1 });
  const [showFaqModal, setShowFaqModal] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState(dataStore.getReviews());
  const [editingReview, setEditingReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({ clientName: '', company: '', rating: 5, comment: '', projectType: '' });
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    return dataStore.subscribe(() => {
      const fresh = dataStore.getSiteContent();
      setSiteContent(fresh);
      setFaqs(dataStore.getFaqs());
      setReviews(dataStore.getReviews());
    });
  }, []);

  function notify(msg) {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 3500);
  }

  function handleSaveHome(e) {
    e.preventDefault();
    dataStore.updateSiteContent('home', homeForm);
    notify('✅ Home page text & statistics updated successfully!');
  }

  function handleSaveAbout(e) {
    e.preventDefault();
    dataStore.updateSiteContent('about', aboutForm);
    notify('✅ About page content & studio pillars updated!');
  }

  function handleSaveContact(e) {
    e.preventDefault();
    dataStore.updateSiteContent('contact', contactForm);
    notify('✅ Contact page details, phone, and email updated!');
  }

  function handleSaveFooter(e) {
    e.preventDefault();
    dataStore.updateSiteContent('footer', footerForm);
    notify('✅ Footer information & social links updated!');
  }

  function handleSaveLegal(e) {
    e.preventDefault();
    dataStore.updateSiteContent('privacyPolicy', privacyPolicy);
    dataStore.updateSiteContent('termsAndConditions', termsAndConditions);
    notify('✅ Privacy Policy & Terms and Conditions updated!');
  }

  // FAQ CRUD
  function handleSaveFaq(e) {
    e.preventDefault();
    if (!faqForm.question || !faqForm.answer) return;

    if (editingFaq) {
      dataStore.updateFaq(editingFaq.id, faqForm);
      notify('FAQ updated.');
      setEditingFaq(null);
    } else {
      dataStore.addFaq(faqForm);
      notify('New FAQ added.');
      setShowFaqModal(false);
    }
    setFaqForm({ question: '', answer: '', order: 1 });
  }

  function handleDeleteFaq(id) {
    if (confirm('Delete this FAQ?')) {
      dataStore.deleteFaq(id);
      notify('FAQ deleted.');
    }
  }

  // Review CRUD
  function handleSaveReview(e) {
    e.preventDefault();
    if (!reviewForm.clientName || !reviewForm.comment) return;

    if (editingReview) {
      dataStore.updateReview(editingReview.id, reviewForm);
      notify('Review updated.');
      setEditingReview(null);
    } else {
      dataStore.addReview(reviewForm);
      notify('New client review added.');
      setShowReviewModal(false);
    }
    setReviewForm({ clientName: '', company: '', rating: 5, comment: '', projectType: '' });
  }

  function handleDeleteReview(id) {
    if (confirm('Delete this review?')) {
      dataStore.deleteReview(id);
      notify('Review deleted.');
    }
  }

  const tabs = [
    { id: 'home', label: '🏠 Home Page' },
    { id: 'about', label: 'ℹ️ About Page' },
    { id: 'contact', label: '📞 Contact Page' },
    { id: 'faqs', label: '❓ FAQs Manager' },
    { id: 'reviews', label: '⭐ Client Reviews' },
    { id: 'footer', label: '🦶 Footer & Branding' },
    { id: 'legal', label: '📄 Privacy & Terms' },
  ];

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <div>
          <h1>Full Site CMS & Text Control</h1>
          <p style={{ marginTop: 4 }}>
            Control every headline, paragraph, stat, FAQ, review, and legal policy on the website in real time.
          </p>
        </div>
      </div>

      {statusMsg && (
        <div className="status-msg status-ok" style={{ marginBottom: 20 }}>
          {statusMsg}
        </div>
      )}

      {/* TABS NAVIGATION */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--panel-line)', paddingBottom: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`btn btn-sm ${activeTab === t.id ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 8, padding: '8px 14px' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: HOME PAGE CMS */}
      {activeTab === 'home' && (
        <form onSubmit={handleSaveHome} className="panel-card" style={{ maxWidth: 880 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 18 }}>Home Page Content & Stats</h3>

          <div className="field">
            <label>Hero Eyebrow Badge</label>
            <input
              value={homeForm.heroEyebrow || ''}
              onChange={(e) => setHomeForm({ ...homeForm, heroEyebrow: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Hero Headline *</label>
            <input
              required
              value={homeForm.heroHeadline || ''}
              onChange={(e) => setHomeForm({ ...homeForm, heroHeadline: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Hero Subtitle / Description *</label>
            <textarea
              required
              rows={3}
              value={homeForm.heroDescription || ''}
              onChange={(e) => setHomeForm({ ...homeForm, heroDescription: e.target.value })}
            />
          </div>

          <h4 style={{ fontSize: '1rem', margin: '20px 0 12px', color: 'var(--ink)' }}>Hero Stats Counters</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            <div className="field">
              <label>Stat 1 Value</label>
              <input
                value={homeForm.stat1Number || ''}
                onChange={(e) => setHomeForm({ ...homeForm, stat1Number: e.target.value })}
              />
              <input
                placeholder="Label"
                style={{ marginTop: 4 }}
                value={homeForm.stat1Label || ''}
                onChange={(e) => setHomeForm({ ...homeForm, stat1Label: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Stat 2 Value</label>
              <input
                value={homeForm.stat2Number || ''}
                onChange={(e) => setHomeForm({ ...homeForm, stat2Number: e.target.value })}
              />
              <input
                placeholder="Label"
                style={{ marginTop: 4 }}
                value={homeForm.stat2Label || ''}
                onChange={(e) => setHomeForm({ ...homeForm, stat2Label: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Stat 3 Value</label>
              <input
                value={homeForm.stat3Number || ''}
                onChange={(e) => setHomeForm({ ...homeForm, stat3Number: e.target.value })}
              />
              <input
                placeholder="Label"
                style={{ marginTop: 4 }}
                value={homeForm.stat3Label || ''}
                onChange={(e) => setHomeForm({ ...homeForm, stat3Label: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Stat 4 Value</label>
              <input
                value={homeForm.stat4Number || ''}
                onChange={(e) => setHomeForm({ ...homeForm, stat4Number: e.target.value })}
              />
              <input
                placeholder="Label"
                style={{ marginTop: 4 }}
                value={homeForm.stat4Label || ''}
                onChange={(e) => setHomeForm({ ...homeForm, stat4Label: e.target.value })}
              />
            </div>
          </div>

          <h4 style={{ fontSize: '1rem', margin: '20px 0 12px', color: 'var(--ink)' }}>Digital Marketing Spotlight Banner</h4>
          <div className="field">
            <label>Banner Title</label>
            <input
              value={homeForm.marketingBannerTitle || ''}
              onChange={(e) => setHomeForm({ ...homeForm, marketingBannerTitle: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Banner Subtitle</label>
            <input
              value={homeForm.marketingBannerDesc || ''}
              onChange={(e) => setHomeForm({ ...homeForm, marketingBannerDesc: e.target.value })}
            />
          </div>

          <h4 style={{ fontSize: '1rem', margin: '20px 0 12px', color: 'var(--ink)' }}>Bottom Call-To-Action Banner</h4>
          <div className="field">
            <label>CTA Headline</label>
            <input
              value={homeForm.ctaHeadline || ''}
              onChange={(e) => setHomeForm({ ...homeForm, ctaHeadline: e.target.value })}
            />
          </div>
          <div className="field">
            <label>CTA Subtext</label>
            <input
              value={homeForm.ctaDesc || ''}
              onChange={(e) => setHomeForm({ ...homeForm, ctaDesc: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: 16 }}>
            Save Home Page Changes
          </button>
        </form>
      )}

      {/* TAB 2: ABOUT PAGE CMS */}
      {activeTab === 'about' && (
        <form onSubmit={handleSaveAbout} className="panel-card" style={{ maxWidth: 880 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 18 }}>About Page Story & Pillars</h3>

          <div className="field">
            <label>Eyebrow</label>
            <input
              value={aboutForm.eyebrow || ''}
              onChange={(e) => setAboutForm({ ...aboutForm, eyebrow: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Page Title / Headline</label>
            <input
              required
              value={aboutForm.title || ''}
              onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Studio Story / Description</label>
            <textarea
              rows={4}
              value={aboutForm.description || ''}
              onChange={(e) => setAboutForm({ ...aboutForm, description: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Pillars Section Title</label>
            <input
              value={aboutForm.storyTitle || ''}
              onChange={(e) => setAboutForm({ ...aboutForm, storyTitle: e.target.value })}
            />
          </div>

          <h4 style={{ fontSize: '1rem', margin: '20px 0 12px', color: 'var(--ink)' }}>Studio Pillars / Values</h4>
          {(aboutForm.pillars || []).map((pillar, idx) => (
            <div key={idx} style={{ padding: 14, background: 'var(--bg-soft)', borderRadius: 8, marginBottom: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: 10, marginBottom: 8 }}>
                <input
                  value={pillar.num}
                  placeholder="01"
                  onChange={(e) => {
                    const next = [...aboutForm.pillars];
                    next[idx].num = e.target.value;
                    setAboutForm({ ...aboutForm, pillars: next });
                  }}
                />
                <input
                  value={pillar.title}
                  placeholder="Pillar Title"
                  onChange={(e) => {
                    const next = [...aboutForm.pillars];
                    next[idx].title = e.target.value;
                    setAboutForm({ ...aboutForm, pillars: next });
                  }}
                />
              </div>
              <textarea
                rows={2}
                value={pillar.body}
                placeholder="Pillar Description"
                onChange={(e) => {
                  const next = [...aboutForm.pillars];
                  next[idx].body = e.target.value;
                  setAboutForm({ ...aboutForm, pillars: next });
                }}
              />
            </div>
          ))}

          <button type="submit" className="btn btn-primary" style={{ marginTop: 16 }}>
            Save About Page Changes
          </button>
        </form>
      )}

      {/* TAB 3: CONTACT PAGE CMS */}
      {activeTab === 'contact' && (
        <form onSubmit={handleSaveContact} className="panel-card" style={{ maxWidth: 880 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 18 }}>Contact Page Details</h3>

          <div className="field">
            <label>Eyebrow</label>
            <input
              value={contactForm.eyebrow || ''}
              onChange={(e) => setContactForm({ ...contactForm, eyebrow: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Page Headline</label>
            <input
              required
              value={contactForm.title || ''}
              onChange={(e) => setContactForm({ ...contactForm, title: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Introduction Description</label>
            <textarea
              rows={3}
              value={contactForm.description || ''}
              onChange={(e) => setContactForm({ ...contactForm, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="field">
              <label>Official Email Address</label>
              <input
                value={contactForm.email || ''}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              />
              <input
                placeholder="Subtext e.g. Reply time: under 4 hours"
                style={{ marginTop: 4 }}
                value={contactForm.emailSubtext || ''}
                onChange={(e) => setContactForm({ ...contactForm, emailSubtext: e.target.value })}
              />
            </div>

            <div className="field">
              <label>Call / WhatsApp Direct Phone</label>
              <input
                value={contactForm.phone || ''}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
              />
              <input
                placeholder="Working Hours e.g. Mon-Sat 09:30 AM to 07:00 PM"
                style={{ marginTop: 4 }}
                value={contactForm.phoneTimings || ''}
                onChange={(e) => setContactForm({ ...contactForm, phoneTimings: e.target.value })}
              />
            </div>
          </div>

          <div className="field">
            <label>Studio Physical Location</label>
            <input
              value={contactForm.address || ''}
              onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
            />
            <input
              placeholder="Regional coverage note"
              style={{ marginTop: 4 }}
              value={contactForm.addressSubtext || ''}
              onChange={(e) => setContactForm({ ...contactForm, addressSubtext: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: 16 }}>
            Save Contact Page Changes
          </button>
        </form>
      )}

      {/* TAB 4: FAQS MANAGER */}
      {activeTab === 'faqs' && (
        <div>
          <div className="flex-between" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Frequently Asked Questions ({faqs.length})</h3>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setEditingFaq(null);
                setFaqForm({ question: '', answer: '', order: faqs.length + 1 });
                setShowFaqModal(true);
              }}
            >
              + Add New FAQ
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {faqs.map((f, i) => (
              <div key={f.id} className="panel-card" style={{ padding: '18px 22px' }}>
                <div className="flex-between">
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                    Q{i + 1}: {f.question}
                  </h4>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="icon-btn"
                      onClick={() => {
                        setEditingFaq(f);
                        setFaqForm({ question: f.question, answer: f.answer, order: f.order || i + 1 });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="icon-btn"
                      style={{ color: '#EF4444' }}
                      onClick={() => handleDeleteFaq(f.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p style={{ marginTop: 8, fontSize: '0.92rem', color: 'var(--ink-dim)', lineHeight: 1.6 }}>
                  {f.answer}
                </p>
              </div>
            ))}
          </div>

          {/* FAQ MODAL */}
          {(showFaqModal || editingFaq) && (
            <div className="modal-overlay">
              <div className="modal-content">
                <button
                  className="modal-close-btn"
                  onClick={() => {
                    setShowFaqModal(false);
                    setEditingFaq(null);
                  }}
                >
                  ×
                </button>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 16 }}>
                  {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
                </h3>
                <form onSubmit={handleSaveFaq}>
                  <div className="field">
                    <label>Question *</label>
                    <input
                      required
                      placeholder="e.g. What is your turnaround time?"
                      value={faqForm.question}
                      onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>Answer *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Detailed answer explaining process, terms, or tech..."
                      value={faqForm.answer}
                      onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                      Save FAQ
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => {
                        setShowFaqModal(false);
                        setEditingFaq(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: REVIEWS & TESTIMONIALS */}
      {activeTab === 'reviews' && (
        <div>
          <div className="flex-between" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Client Reviews & Ratings ({reviews.length})</h3>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setEditingReview(null);
                setReviewForm({ clientName: '', company: '', rating: 5, comment: '', projectType: '' });
                setShowReviewModal(true);
              }}
            >
              + Add Client Review
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {reviews.map((r) => (
              <div key={r.id} className="panel-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="flex-between">
                    <div>
                      <strong>{r.clientName}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--ink-dim)' }}>{r.company}</div>
                    </div>
                    <div style={{ color: '#F59E0B', fontSize: '1.1rem' }}>
                      {'★'.repeat(r.rating || 5)}
                    </div>
                  </div>
                  <p style={{ marginTop: 12, fontSize: '0.9rem', fontStyle: 'italic', lineHeight: 1.6 }}>
                    "{r.comment}"
                  </p>
                  {r.projectType && (
                    <span className="tag-pill" style={{ marginTop: 12 }}>
                      {r.projectType}
                    </span>
                  )}
                </div>

                <div className="flex-between" style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--panel-line)' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--ink-dim)' }}>{r.date}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className="icon-btn"
                      style={{ fontSize: '0.76rem' }}
                      onClick={() => {
                        setEditingReview(r);
                        setReviewForm({
                          clientName: r.clientName,
                          company: r.company || '',
                          rating: r.rating || 5,
                          comment: r.comment,
                          projectType: r.projectType || '',
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="icon-btn"
                      style={{ fontSize: '0.76rem', color: '#EF4444' }}
                      onClick={() => handleDeleteReview(r.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* REVIEW MODAL */}
          {(showReviewModal || editingReview) && (
            <div className="modal-overlay">
              <div className="modal-content">
                <button
                  className="modal-close-btn"
                  onClick={() => {
                    setShowReviewModal(false);
                    setEditingReview(null);
                  }}
                >
                  ×
                </button>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 16 }}>
                  {editingReview ? 'Edit Review' : 'Add Client Review'}
                </h3>
                <form onSubmit={handleSaveReview}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="field">
                      <label>Client Name *</label>
                      <input
                        required
                        placeholder="e.g. Rajesh Singhania"
                        value={reviewForm.clientName}
                        onChange={(e) => setReviewForm({ ...reviewForm, clientName: e.target.value })}
                      />
                    </div>
                    <div className="field">
                      <label>Company / Title</label>
                      <input
                        placeholder="Singhania Logistics Ltd"
                        value={reviewForm.company}
                        onChange={(e) => setReviewForm({ ...reviewForm, company: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="field">
                      <label>Project Type</label>
                      <input
                        placeholder="e.g. Digital Marketing Retainer"
                        value={reviewForm.projectType}
                        onChange={(e) => setReviewForm({ ...reviewForm, projectType: e.target.value })}
                      />
                    </div>
                    <div className="field">
                      <label>Star Rating (1 - 5)</label>
                      <select
                        value={reviewForm.rating}
                        onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                      >
                        <option value={5}>★★★★★ (5 Stars)</option>
                        <option value={4}>★★★★☆ (4 Stars)</option>
                        <option value={3}>★★★☆☆ (3 Stars)</option>
                      </select>
                    </div>
                  </div>

                  <div className="field">
                    <label>Testimonial Comment *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="What did the client appreciate about the build, team, or marketing results?"
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                      Save Review
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => {
                        setShowReviewModal(false);
                        setEditingReview(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: FOOTER & BRANDING */}
      {activeTab === 'footer' && (
        <form onSubmit={handleSaveFooter} className="panel-card" style={{ maxWidth: 880 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 18 }}>Footer & Global Branding</h3>

          <div className="field">
            <label>Footer Studio Summary Bio</label>
            <textarea
              rows={3}
              value={footerForm.bio || ''}
              onChange={(e) => setFooterForm({ ...footerForm, bio: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="field">
              <label>Footer Contact Phone</label>
              <input
                value={footerForm.phone || ''}
                onChange={(e) => setFooterForm({ ...footerForm, phone: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Footer Contact Email</label>
              <input
                value={footerForm.email || ''}
                onChange={(e) => setFooterForm({ ...footerForm, email: e.target.value })}
              />
            </div>
          </div>

          <div className="field">
            <label>Footer Office Address</label>
            <input
              value={footerForm.address || ''}
              onChange={(e) => setFooterForm({ ...footerForm, address: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Copyright Notice</label>
            <input
              value={footerForm.copyright || ''}
              onChange={(e) => setFooterForm({ ...footerForm, copyright: e.target.value })}
            />
          </div>

          <h4 style={{ fontSize: '1rem', margin: '20px 0 12px', color: 'var(--ink)' }}>Social Profile Links</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field">
              <label>LinkedIn URL</label>
              <input
                value={footerForm.linkedin || ''}
                onChange={(e) => setFooterForm({ ...footerForm, linkedin: e.target.value })}
              />
            </div>
            <div className="field">
              <label>GitHub URL</label>
              <input
                value={footerForm.github || ''}
                onChange={(e) => setFooterForm({ ...footerForm, github: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Instagram URL</label>
              <input
                value={footerForm.instagram || ''}
                onChange={(e) => setFooterForm({ ...footerForm, instagram: e.target.value })}
              />
            </div>
            <div className="field">
              <label>YouTube URL</label>
              <input
                placeholder="https://youtube.com/@brandedcoders"
                value={footerForm.youtube !== undefined ? footerForm.youtube : (footerForm.twitter || 'https://youtube.com')}
                onChange={(e) => setFooterForm({ ...footerForm, youtube: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: 16 }}>
            Save Footer Changes
          </button>
        </form>
      )}

      {/* TAB 7: PRIVACY & TERMS */}
      {activeTab === 'legal' && (
        <form onSubmit={handleSaveLegal} className="panel-card" style={{ maxWidth: 880 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 18 }}>Legal Policies Content CMS</h3>

          <div className="field">
            <label style={{ fontSize: '1rem', fontWeight: 700 }}>Privacy Policy Page Text / Markdown</label>
            <p style={{ fontSize: '0.8rem', color: 'var(--ink-dim)', marginBottom: 8 }}>
              This content appears on the public <a href="/privacy" target="_blank" style={{ color: 'var(--accent)' }}>/privacy</a> page.
            </p>
            <textarea
              rows={10}
              style={{ fontFamily: 'monospace', fontSize: '0.88rem' }}
              value={privacyPolicy}
              onChange={(e) => setPrivacyPolicy(e.target.value)}
            />
          </div>

          <div className="field" style={{ marginTop: 24 }}>
            <label style={{ fontSize: '1rem', fontWeight: 700 }}>Terms and Conditions Page Text / Markdown</label>
            <p style={{ fontSize: '0.8rem', color: 'var(--ink-dim)', marginBottom: 8 }}>
              This content appears on the public <a href="/terms" target="_blank" style={{ color: 'var(--accent)' }}>/terms</a> page.
            </p>
            <textarea
              rows={10}
              style={{ fontFamily: 'monospace', fontSize: '0.88rem' }}
              value={termsAndConditions}
              onChange={(e) => setTermsAndConditions(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: 16 }}>
            Save Legal Policies
          </button>
        </form>
      )}
    </div>
  );
}
