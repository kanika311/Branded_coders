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
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand-col">
            <Link to="/" style={{ display: 'inline-block' }}>
              <img
                src="/logo.png"
                alt="BrandedCoders"
                style={{ height: '48px', width: 'auto', display: 'block', objectFit: 'contain' }}
              />
            </Link>
            <p style={{ marginTop: 10, maxWidth: 290, fontSize: '0.84rem', lineHeight: 1.5 }}>
              {footer.bio || 'Full-stack digital studio designing, engineering high-speed web apps, MERN platforms, and scaling them with data-driven Digital Marketing.'}
            </p>
            <div style={{ marginTop: 12 }}>
              <Link to="/employee/login" className="nav-badge-link" style={{ fontSize: '0.74rem', padding: '4px 10px' }}>
                Employee Portal Login
              </Link>
            </div>
          </div>

          <div className="footer-cols">
            <div className="footer-col">
              <h5>Services</h5>
              <Link to="/services">Digital Marketing & Growth</Link>
              <Link to="/services">Website Design & Dev</Link>
              <Link to="/services">Custom MERN CMS</Link>
              <Link to="/services">Dashboards & Internal Tools</Link>
              <Link to="/services">Mobile Apps & AI Platforms</Link>
            </div>

            <div className="footer-col">
              <h5>Studio & Work</h5>
              <Link to="/services">All Services</Link>
              <Link to="/work">Portfolio & Case Studies</Link>
              <Link to="/about">About Studio</Link>
              <Link to="/contact">Book Scoping Call</Link>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms & Conditions</Link>
            </div>

            <div className="footer-col">
              <h5>Direct Contact</h5>
              <span>{footer.email || 'hello@brandedcoders.com'}</span>
              <span>{footer.phone || '+91 98765 43210'}</span>
              <span>{footer.address || 'Ludhiana, Punjab, India'}</span>
              <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>● Accepting New Clients</span>
            </div>

            <div className="footer-col">
              <h5>Follow Us</h5>
              <a href={footer.linkedin || '#'} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={footer.github || '#'} target="_blank" rel="noreferrer">GitHub</a>
              <a href={footer.instagram || '#'} target="_blank" rel="noreferrer">Instagram</a>
              <a href={footer.youtube || footer.twitter || 'https://youtube.com'} target="_blank" rel="noreferrer">YouTube</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>{footer.copyright || '© 2026 BrandedCoders Studio. All rights reserved.'}</span>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link to="/privacy" style={{ color: 'var(--ink-dim)' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: 'var(--ink-dim)' }}>Terms of Service</Link>
            <Link to="/employee/login" style={{ color: 'var(--ink-dim)', fontWeight: 600 }}>Employee Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
