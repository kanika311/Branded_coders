import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminLayout() {
  const { logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  function onLogout() {
    logoutAdmin();
    navigate('/admin/login');
  }

  const closeSidebar = () => setMobileOpen(false);

  return (
    <div className="emp-shell" style={{ background: '#F8FAFC' }}>
      {/* MOBILE TOPBAR FOR SCREENS <= 900PX */}
      <div className="emp-mobile-topbar">
        <div className="emp-mobile-topbar-brand">
          <img
            src="/logo-dark.png"
            alt="BrandedCoders Admin"
            style={{ height: '32px', width: 'auto', display: 'block', objectFit: 'contain' }}
          />
          <span>Admin Portal</span>
        </div>
        <button
          type="button"
          className="emp-mobile-hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle admin navigation"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* MOBILE BACKDROP */}
      {mobileOpen && (
        <div
          className="emp-sidebar-backdrop"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className={`emp-sidebar ${mobileOpen ? 'mobile-open' : ''}`} style={{ background: '#0F172A' }}>
        <div>
          <div className="emp-brand" style={{ padding: '4px 0', justifyContent: 'space-between' }}>
            <Link to="/admin" onClick={closeSidebar} style={{ display: 'block' }}>
              <img
                src="/logo-dark.png"
                alt="BrandedCoders Admin"
                style={{ height: '38px', width: 'auto', display: 'block', objectFit: 'contain' }}
              />
            </Link>
            {mobileOpen && (
              <button
                type="button"
                onClick={closeSidebar}
                style={{ background: 'transparent', color: '#94A3B8', fontSize: '1.2rem', padding: '4px 8px' }}
              >
                ✕
              </button>
            )}
          </div>

          <nav className="emp-nav-menu">
            <NavLink to="/admin" end onClick={closeSidebar} className={({ isActive }) => `emp-nav-item ${isActive ? 'active' : ''}`}>
              Overview
            </NavLink>
            <NavLink to="/admin/leads" onClick={closeSidebar} className={({ isActive }) => `emp-nav-item ${isActive ? 'active' : ''}`}>
              Lead Pipeline
            </NavLink>
            <NavLink to="/admin/services" onClick={closeSidebar} className={({ isActive }) => `emp-nav-item ${isActive ? 'active' : ''}`}>
              Services CMS
            </NavLink>
            <NavLink to="/admin/portfolio" onClick={closeSidebar} className={({ isActive }) => `emp-nav-item ${isActive ? 'active' : ''}`}>
              Portfolio CMS
            </NavLink>
            <NavLink to="/admin/plans" onClick={closeSidebar} className={({ isActive }) => `emp-nav-item ${isActive ? 'active' : ''}`}>
              Plans &amp; AMC CMS
            </NavLink>
            <NavLink to="/admin/messages" onClick={closeSidebar} className={({ isActive }) => `emp-nav-item ${isActive ? 'active' : ''}`}>
              Inquiries
            </NavLink>
            <NavLink to="/admin/employees" onClick={closeSidebar} className={({ isActive }) => `emp-nav-item ${isActive ? 'active' : ''}`}>
              Team & Activity
            </NavLink>
            <NavLink to="/admin/content" onClick={closeSidebar} className={({ isActive }) => `emp-nav-item ${isActive ? 'active' : ''}`}>
              Site Content CMS
            </NavLink>
            <NavLink to="/admin/security" onClick={closeSidebar} className={({ isActive }) => `emp-nav-item ${isActive ? 'active' : ''}`}>
              Security & Admins
            </NavLink>
          </nav>
        </div>

        <div className="emp-sidebar-bottom">
          <button className="emp-logout-btn" onClick={onLogout}>
            Sign Out Admin
          </button>
        </div>
      </aside>

      <main className="emp-main">
        <Outlet />
      </main>
    </div>
  );
}
