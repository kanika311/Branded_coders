import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const links = [
  { to: '/services', label: 'Services' },
  { to: '/work', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open & listen for escape key
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setMobileMenuOpen(false);
        }
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

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="container nav-inner">
          {/* Brand Logo with sharp mark and gradient title */}
          <Link to="/" className="brand-logo" title="BrandedCoders Home" onClick={closeMenu}>
            <div className="brand-logo-img-wrap">
              <img
                src="/logo-mark.png"
                alt="BrandedCoders"
                className="brand-logo-img"
              />
            </div>
            <div className="brand-logo-text">
              <span className="brand-name">
                Branded<span className="brand-name-accent">Coders</span>
              </span>
              <span className="brand-tagline">GROWTH &amp; CODE</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="nav-links">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `nav-link-item ${isActive ? 'active' : ''}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Action Badges & Interactive CTAs */}
          <div className="nav-badges">
            <Link
              to="/employee/dashboard"
              className="interactive-badge"
              title="Employee Portal"
            >
              <span className="pulse-beacon" />
              <span>Employee Portal</span>
            </Link>
            <Link to="/contact" className="nav-cta-btn">
              <span>Get a Quote</span>
              <svg
                className="nav-cta-arrow"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
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
          <div className="mobile-menu-drawer">
            <div className="mobile-menu-links">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `mobile-nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <div className="mobile-menu-divider" />
              <Link to="/employee/dashboard" onClick={closeMenu} className="mobile-badge-link">
                <span className="pulse-beacon" />
                <span>Employee Portal</span>
              </Link>
              <Link to="/contact" onClick={closeMenu} className="btn btn-primary mobile-cta-btn">
                Get a Quote
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Overlay Backdrop */}
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
