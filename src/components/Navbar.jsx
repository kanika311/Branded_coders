import { Link, NavLink } from 'react-router-dom';

const links = [
  { to: '/services', label: 'Services' },
  { to: '/work', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <img
            src="/logo.jpeg"
            alt="BrandedCoders"
            style={{ height: '54px', width: 'auto', display: 'block', objectFit: 'contain' }}
          />
        </Link>
        <nav className="nav-links">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="nav-badges">
          <Link to="/employee/dashboard" className="nav-badge-link" title="Employee Portal">
            <span style={{ color: '#FF7A00' }}>●</span> Employee Portal
          </Link>
          <Link to="/contact" className="btn btn-primary btn-sm">
            Get a Quote
          </Link>
        </div>
      </div>
    </header>
  );
}
