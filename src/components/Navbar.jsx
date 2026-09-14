import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const servicesList = [
  {
    to: '/web-development',
    title: 'Web Development',
    desc: 'High-speed React & Next.js websites built to rank and convert.',
    icon: '🌐',
  },
  {
    to: '/digital-marketing',
    title: 'Digital Marketing',
    desc: 'Google PPC, Meta Ads & Technical SEO driving qualified leads.',
    icon: '📈',
  },
  {
    to: '/web-app-development',
    title: 'Web App Development',
    desc: 'Custom MERN platforms, client portals & operational dashboards.',
    icon: '⚡',
  },
  {
    to: '/mobile-app-development',
    title: 'Mobile App Development',
    desc: 'Cross-platform iOS & Android mobile applications with React Native.',
    icon: '📱',
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer and dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  }, [location.pathname]);

  // Handle outside click for services dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setServicesDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setMobileMenuOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  };

  return (
    <>
      <header
        className={`nav ${scrolled ? 'nav-scrolled' : ''}`}
        style={{
          transition: 'all 0.25s ease',
          background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(248, 250, 252, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: scrolled ? '1px solid #E2E8F0' : '1px solid transparent',
        }}
      >
        <div className="container nav-inner" style={{ minHeight: 70 }}>
          {/* Brand Logo */}
          <Link to="/" className="brand-logo" title="BrandedCoders Home" onClick={closeMenu}>
            <div className="brand-logo-img-wrap">
              <img
                src="/logo-mark.png"
                alt="BrandedCoders"
                className="brand-logo-img"
              />
            </div>
            <div className="brand-logo-text">
              <span className="brand-name" style={{ letterSpacing: '-0.02em', fontSize: '1.24rem' }}>
                Branded<span className="brand-name-accent">Coders</span>
              </span>
              <span className="brand-tagline">DIGITAL PRODUCT STUDIO</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="nav-links" style={{ gap: '6px' }}>
            {/* Services with dropdown */}
            <div
              ref={dropdownRef}
              style={{ position: 'relative' }}
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                className={`nav-link-item ${location.pathname.includes('/service') || location.pathname.includes('-development') || location.pathname.includes('digital-marketing') ? 'active' : ''}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  background: 'none',
                  cursor: 'pointer',
                  border: 'none',
                  fontFamily: 'inherit',
                  padding: '8px 14px',
                }}
                aria-expanded={servicesDropdownOpen}
              >
                <span>Services</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={{
                    transform: servicesDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Mega Dropdown */}
              {servicesDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '-20px',
                    width: '380px',
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    boxShadow: '0 16px 36px -8px rgba(15, 23, 42, 0.14), 0 4px 12px rgba(15, 23, 42, 0.06)',
                    border: '1px solid #E2E8F0',
                    padding: '12px',
                    zIndex: 100,
                    animation: 'dropdownFade 0.2s ease-out',
                  }}
                >
                  <div style={{ padding: '6px 12px 10px', borderBottom: '1px solid #F1F5F9', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Core Offerings
                    </span>
                  </div>
                  {servicesList.map((s) => (
                    <Link
                      key={s.to}
                      to={s.to}
                      onClick={() => setServicesDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12,
                        padding: '10px 12px',
                        borderRadius: '10px',
                        transition: 'background 0.15s',
                        color: 'inherit',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span style={{ fontSize: '1.25rem', marginTop: 2 }}>{s.icon}</span>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>
                          {s.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.4, marginTop: 2 }}>
                          {s.desc}
                        </div>
                      </div>
                    </Link>
                  ))}
                  <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #F1F5F9' }}>
                    <Link
                      to="/services"
                      onClick={() => setServicesDropdownOpen(false)}
                      style={{
                        display: 'block',
                        textAlign: 'center',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: 'var(--accent)',
                        padding: '6px 0',
                      }}
                    >
                      View All Capabilities & ROI Calculator →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <NavLink
              to="/work"
              className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
            >
              Portfolio &amp; Results
            </NavLink>
            <NavLink
              to="/plans"
              className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
            >
              Plans &amp; AMC
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
            >
              Contact
            </NavLink>
          </nav>

          {/* Main Consultation CTA */}
          <div className="nav-badges" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link
              to="/contact"
              className="btn btn-primary"
              style={{
                padding: '10px 20px',
                fontSize: '0.88rem',
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.28)',
                borderRadius: '10px',
              }}
            >
              <span>Get a Free Consultation</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginLeft: 6 }}
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className={`nav-hamburger ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="hamburger-line line-1" />
            <span className="hamburger-line line-2" />
            <span className="hamburger-line line-3" />
          </button>
        </div>

        {/* Responsive Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-menu-drawer" style={{ padding: '24px 20px' }}>
            <div className="mobile-menu-links">
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>
                Services
              </div>
              {servicesList.map((s) => (
                <NavLink
                  key={s.to}
                  to={s.to}
                  onClick={closeMenu}
                  className="mobile-nav-link"
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', fontSize: '0.96rem' }}
                >
                  <span>{s.icon}</span>
                  <span>{s.title}</span>
                </NavLink>
              ))}

              <div className="mobile-menu-divider" style={{ margin: '14px 0' }} />

              <NavLink key="/work" to="/work" onClick={closeMenu} className="mobile-nav-link">
                Portfolio &amp; Results
              </NavLink>
              <NavLink key="/plans" to="/plans" onClick={closeMenu} className="mobile-nav-link">
                Plans &amp; AMC Retainers
              </NavLink>
              <NavLink key="/about" to="/about" onClick={closeMenu} className="mobile-nav-link">
                About Studio
              </NavLink>
              <NavLink key="/contact" to="/contact" onClick={closeMenu} className="mobile-nav-link">
                Contact &amp; Scoping
              </NavLink>

              <div className="mobile-menu-divider" style={{ margin: '14px 0' }} />

              <Link
                to="/contact"
                onClick={closeMenu}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              >
                Get a Free Consultation
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="mobile-backdrop"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}
