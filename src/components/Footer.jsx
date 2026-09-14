import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dataStore } from '../lib/dataStore';

export default function Footer() {
  const [footer, setFooter] = useState(dataStore.getSiteContent().footer || {});

  useEffect(() => {
    return dataStore.subscribe(() => {
      setFooter(dataStore.getSiteContent().footer || {});
    });
  }, []);

  return (
    <footer className="footer" style={{ background: '#0F172A', color: '#94A3B8', padding: '64px 0 24px', borderTop: '1px solid #1E293B' }}>
      <div className="container">
        <div className="footer-top" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          {/* Brand Info */}
          <div style={{ maxWidth: '320px' }}>
            <Link to="/" className="brand-logo" style={{ display: 'inline-flex', padding: 0, marginBottom: 14 }}>
              <div className="brand-logo-img-wrap" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <img
                  src="/logo-mark.png"
                  alt="BrandedCoders"
                  style={{ height: '44px', width: 'auto', display: 'block', objectFit: 'contain' }}
                />
              </div>
              <div className="brand-logo-text" style={{ marginLeft: 10 }}>
                <span className="brand-name" style={{ fontSize: '1.24rem', color: '#FFFFFF' }}>
                  Branded<span className="brand-name-accent" style={{ color: '#38BDF8' }}>Coders</span>
                </span>
                <span className="brand-tagline" style={{ color: '#64748B' }}>GROWTH &amp; CODE STUDIO</span>
              </div>
            </Link>
            <p style={{ marginTop: 12, fontSize: '0.86rem', lineHeight: 1.6, color: '#94A3B8' }}>
              Full-stack digital engineering &amp; performance growth studio. We design, code, and scale high-growth web products, mobile apps, and high-ROAS marketing funnels.
            </p>
            <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block', boxShadow: '0 0 8px #10B981' }} />
              <span style={{ fontSize: '0.82rem', color: '#E2E8F0', fontWeight: 600 }}>Accepting Q3/Q4 Projects</span>
            </div>
          </div>

          {/* Core Services Column */}
          <div>
            <h5 style={{ color: '#FFFFFF', fontSize: '0.94rem', fontWeight: 700, marginBottom: '16px', letterSpacing: '0.02em' }}>
              Core Services
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
              <Link to="/web-development" style={{ color: '#94A3B8', transition: 'color 0.15s' }}>Web Development</Link>
              <Link to="/digital-marketing" style={{ color: '#94A3B8', transition: 'color 0.15s' }}>Digital Marketing &amp; SEO</Link>
              <Link to="/web-app-development" style={{ color: '#94A3B8', transition: 'color 0.15s' }}>Web App &amp; Dashboards</Link>
              <Link to="/mobile-app-development" style={{ color: '#94A3B8', transition: 'color 0.15s' }}>Mobile App Development</Link>
              <Link to="/services" style={{ color: '#38BDF8', fontWeight: 600, marginTop: 4 }}>View All Services &rarr;</Link>
            </div>
          </div>

          {/* Company & Trust Column */}
          <div>
            <h5 style={{ color: '#FFFFFF', fontSize: '0.94rem', fontWeight: 700, marginBottom: '16px', letterSpacing: '0.02em' }}>
              Studio &amp; Trust
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
              <Link to="/work" style={{ color: '#94A3B8' }}>Verified Case Studies</Link>
              <Link to="/plans" style={{ color: '#38BDF8', fontWeight: 600 }}>Website &amp; App AMC Plans</Link>
              <Link to="/about" style={{ color: '#94A3B8' }}>About &amp; Founders</Link>
              <Link to="/contact" style={{ color: '#94A3B8' }}>Free 1-Hour Consultation</Link>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', fontWeight: 600 }}>
                💬 Chat on WhatsApp
              </a>
              <Link to="/privacy" style={{ color: '#94A3B8' }}>Privacy Policy</Link>
              <Link to="/terms" style={{ color: '#94A3B8' }}>Terms &amp; Conditions</Link>
            </div>
          </div>

          {/* Direct Contact & Location */}
          <div>
            <h5 style={{ color: '#FFFFFF', fontSize: '0.94rem', fontWeight: 700, marginBottom: '16px', letterSpacing: '0.02em' }}>
              Direct Contact
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', color: '#94A3B8' }}>
              <span>📍 Ludhiana, Punjab, India</span>
              <span>📧 {footer.email || 'hello@brandedcoders.in'}</span>
              <span>📞 {footer.phone || '+91 98765 43210'}</span>
              <span style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 4 }}>
                Response time: Under 4 business hours
              </span>
              <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
                <a href={footer.linkedin || 'https://linkedin.com'} target="_blank" rel="noreferrer" style={{ color: '#E2E8F0', fontSize: '0.8rem' }}>LinkedIn</a>
                <span style={{ color: '#334155' }}>·</span>
                <a href={footer.github || 'https://github.com'} target="_blank" rel="noreferrer" style={{ color: '#E2E8F0', fontSize: '0.8rem' }}>GitHub</a>
                <span style={{ color: '#334155' }}>·</span>
                <a href={footer.instagram || 'https://instagram.com'} target="_blank" rel="noreferrer" style={{ color: '#E2E8F0', fontSize: '0.8rem' }}>Instagram</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ paddingTop: '24px', borderTop: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: '0.82rem' }}>
          <span>&copy; {new Date().getFullYear()} BrandedCoders Studio. Built for long-term growth.</span>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Link to="/privacy" style={{ color: '#64748B' }}>Privacy</Link>
            <Link to="/terms" style={{ color: '#64748B' }}>Terms</Link>
            <Link to="/admin/login" style={{ color: '#94A3B8', fontWeight: 600 }}>Admin Console &rarr;</Link>
            <Link to="/employee/login" style={{ color: '#38BDF8', fontWeight: 600 }}>Employee Login &rarr;</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
