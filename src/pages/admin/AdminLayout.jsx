import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminLayout() {
  const { logoutAdmin } = useAuth();
  const navigate = useNavigate();

  function onLogout() {
    logoutAdmin();
    navigate('/admin/login');
  }

  return (
    <div className="emp-shell" style={{ background: '#F8FAFC' }}>
      <aside className="emp-sidebar" style={{ background: '#0F172A' }}>
        <div>
          <div className="emp-brand" style={{ padding: '4px 0' }}>
            <Link to="/admin" style={{ display: 'block' }}>
              <img
                src="/logo-dark.png"
                alt="BrandedCoders Admin"
                style={{ height: '38px', width: 'auto', display: 'block', objectFit: 'contain' }}
              />
            </Link>
          </div>

          <nav className="emp-nav-menu">
            <NavLink to="/admin" end className={({ isActive }) => `emp-nav-item ${isActive ? 'active' : ''}`}>
              Overview
            </NavLink>
            <NavLink to="/admin/tasks" className={({ isActive }) => `emp-nav-item ${isActive ? 'active' : ''}`}>
              Assign Tasks
            </NavLink>
            <NavLink to="/admin/leads" className={({ isActive }) => `emp-nav-item ${isActive ? 'active' : ''}`}>
              Lead Pipeline
            </NavLink>
            <NavLink to="/admin/services" className={({ isActive }) => `emp-nav-item ${isActive ? 'active' : ''}`}>
              Services CMS
            </NavLink>
            <NavLink to="/admin/portfolio" className={({ isActive }) => `emp-nav-item ${isActive ? 'active' : ''}`}>
              Portfolio CMS
            </NavLink>
            <NavLink to="/admin/messages" className={({ isActive }) => `emp-nav-item ${isActive ? 'active' : ''}`}>
              Inquiries
            </NavLink>
            <NavLink to="/admin/employees" className={({ isActive }) => `emp-nav-item ${isActive ? 'active' : ''}`}>
              Team & Activity
            </NavLink>
            <NavLink to="/admin/content" className={({ isActive }) => `emp-nav-item ${isActive ? 'active' : ''}`}>
              Site Content CMS
            </NavLink>
            <NavLink to="/admin/security" className={({ isActive }) => `emp-nav-item ${isActive ? 'active' : ''}`}>
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
