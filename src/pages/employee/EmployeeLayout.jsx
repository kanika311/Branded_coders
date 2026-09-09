import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function EmployeeLayout() {
  const { employee, logoutEmployee } = useAuth();
  const navigate = useNavigate();

  function onLogout() {
    logoutEmployee();
    navigate('/employee/login');
  }

  return (
    <div className="emp-shell">
    
      <aside className="emp-sidebar">
        <div>
          <div className="emp-brand" style={{ padding: '4px 0' }}>
            <Link to="/employee/dashboard" style={{ display: 'block' }}>
              <img
                src="/logo-dark.png"
                alt="BrandedCoders Employee"
                style={{ height: '60px', width: 'auto', display: 'block', objectFit: 'contain' }}
              />
            </Link>
          </div>

          <nav className="emp-nav-menu">
            <NavLink
              to="/employee/dashboard"
              end
              className={({ isActive }) => `emp-nav-item ${isActive ? 'active' : ''}`}
            >
              <span style={{ fontSize: '1.1rem' }}>📊</span> Dashboard
            </NavLink>

            <NavLink
              to="/employee/leads"
              className={({ isActive }) => `emp-nav-item ${isActive ? 'active' : ''}`}
            >
              <span style={{ fontSize: '1.1rem' }}>👥</span> Contact Leads
            </NavLink>

            <NavLink
              to="/employee/tasks"
              className={({ isActive }) => `emp-nav-item ${isActive ? 'active' : ''}`}
            >
              <span style={{ fontSize: '1.1rem' }}>📝</span> My Tasks
            </NavLink>

            <Link
              to="/employee/leads?add=true"
              className="emp-nav-item"
              style={{ color: '#FFB13D', background: 'rgba(255, 177, 61, 0.08)' }}
            >
              <span style={{ fontSize: '1.1rem' }}>➕</span> Add New Lead
            </Link>

            <NavLink
              to="/employee/settings"
              className={({ isActive }) => `emp-nav-item ${isActive ? 'active' : ''}`}
            >
              <span style={{ fontSize: '1.1rem' }}>⚙️</span> Settings & Profile
            </NavLink>
          </nav>
        </div>

        <div className="emp-sidebar-bottom">
          {/* LANGUAGE SELECTOR AS IN SCREENSHOT */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', color: '#94A3B8', fontSize: '0.82rem' }}>
            <span>🌐</span>
            <span>Language: <strong>EN (English)</strong></span>
          </div>

          <div style={{ padding: '10px 14px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 8 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>
              {employee?.name || 'Kanika Aggarwal'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
              {employee?.role || 'Lead Business Development'}
            </div>
          </div>

          <button className="emp-logout-btn" onClick={onLogout}>
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="emp-main">
        <Outlet />
      </main>
    </div>
  );
}
