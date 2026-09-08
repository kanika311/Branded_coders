import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataStore } from '../../lib/dataStore';

const ROLES = [
  { id: 'Super Admin', label: 'Super Admin', desc: 'Full console permissions: CMS, employee sessions, leads, and security access.' },
  { id: 'Content Manager', label: 'Content Manager', desc: 'Can publish services, portfolio case studies, and update site content.' },
  { id: 'Operations Admin', label: 'Operations Admin', desc: 'Can assign tasks, manage leads, and oversee employee live sessions.' },
];

export default function AdminSecurity() {
  const { admin, updateCurrentAdminPassword } = useAuth();

  const [admins, setAdmins] = useState(dataStore.getAdmins());
  const [activeTab, setActiveTab] = useState('password'); // 'password' | 'admins'
  const [search, setSearch] = useState('');

  // Password update form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passSuccess, setPassSuccess] = useState(null);
  const [passError, setPassError] = useState(null);

  // Add Admin modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('Super Admin');
  const [newAdminPassword, setNewAdminPassword] = useState('admin123');
  const [newAdminConfirmPass, setNewAdminConfirmPass] = useState('admin123');
  const [showAddPass, setShowAddPass] = useState(false);
  const [addAdminError, setAddAdminError] = useState(null);
  const [addAdminSuccess, setAddAdminSuccess] = useState(null);

  // Edit Admin modal state
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('Super Admin');

  // Reset password modal state
  const [resettingAdmin, setResettingAdmin] = useState(null);
  const [resetNewPass, setResetNewPass] = useState('');
  const [resetConfirmPass, setResetConfirmPass] = useState('');
  const [resetError, setResetError] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(null);

  // Status banner
  const [globalStatus, setGlobalStatus] = useState(null);

  useEffect(() => {
    return dataStore.subscribe((data) => {
      setAdmins(data.admins || dataStore.getAdmins());
    });
  }, []);

  // Update current logged-in admin password
  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    if (!currentPassword) {
      setPassError('Please enter your current administrator password.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setPassError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('New password and confirm password do not match.');
      return;
    }

    setPassLoading(true);
    try {
      await updateCurrentAdminPassword(currentPassword, newPassword);
      setPassSuccess('Your administrator password has been updated successfully! Please remember it for your next sign-in.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPassSuccess(null), 6000);
    } catch (err) {
      setPassError(err.message || 'Failed to update password. Please verify current password.');
    } finally {
      setPassLoading(false);
    }
  }

  // Generate strong random password
  function generateRandomPassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let res = 'BC#';
    for (let i = 0; i < 7; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res + '!';
  }

  // Handle Add New Admin
  function handleAddAdminSubmit(e) {
    e.preventDefault();
    setAddAdminError(null);

    const cleanEmail = newAdminEmail.trim().toLowerCase();
    if (!newAdminName.trim()) {
      setAddAdminError('Please enter the administrator full name.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setAddAdminError('Please provide a valid email address.');
      return;
    }

    // Check duplicate email
    const exists = admins.some((a) => a.email.toLowerCase() === cleanEmail);
    if (exists) {
      setAddAdminError(`An administrator account with email "${cleanEmail}" already exists.`);
      return;
    }

    if (!newAdminPassword || newAdminPassword.length < 6) {
      setAddAdminError('Initial password must be at least 6 characters.');
      return;
    }

    if (newAdminPassword !== newAdminConfirmPass) {
      setAddAdminError('Passwords do not match.');
      return;
    }

    const created = dataStore.addAdmin({
      name: newAdminName.trim(),
      email: cleanEmail,
      role: newAdminRole,
      password: newAdminPassword,
    });

    setGlobalStatus(`✅ New administrator "${created.name}" created successfully.`);
    setTimeout(() => setGlobalStatus(null), 5000);

    // Reset modal form
    setNewAdminName('');
    setNewAdminEmail('');
    setNewAdminRole('Super Admin');
    setNewAdminPassword('admin123');
    setNewAdminConfirmPass('admin123');
    setShowAddModal(false);
  }

  // Handle Edit Admin
  function handleEditAdminSubmit(e) {
    e.preventDefault();
    if (!editingAdmin) return;

    dataStore.updateAdmin(editingAdmin.id, {
      name: editName.trim(),
      role: editRole,
    });

    setGlobalStatus(`✅ Administrator details for "${editName}" updated.`);
    setTimeout(() => setGlobalStatus(null), 4000);
    setEditingAdmin(null);
  }

  // Handle Reset Password for another admin
  function handleResetPasswordSubmit(e) {
    e.preventDefault();
    setResetError(null);

    if (!resetNewPass || resetNewPass.length < 6) {
      setResetError('New password must be at least 6 characters long.');
      return;
    }
    if (resetNewPass !== resetConfirmPass) {
      setResetError('Passwords do not match.');
      return;
    }

    dataStore.updateAdminPasswordById(resettingAdmin.id, resetNewPass);
    setGlobalStatus(`✅ Password for "${resettingAdmin.name}" has been reset.`);
    setTimeout(() => setGlobalStatus(null), 4000);

    setResettingAdmin(null);
    setResetNewPass('');
    setResetConfirmPass('');
  }

  // Handle Delete Admin
  function handleDeleteAdmin(adm) {
    if (admins.length <= 1) {
      alert('Security Protection: You cannot delete the only administrator account on the system.');
      return;
    }

    if (adm.email.toLowerCase() === admin?.email?.toLowerCase()) {
      alert('Security Protection: You cannot delete your own currently active administrator account.');
      return;
    }

    if (confirm(`Are you sure you want to delete administrator "${adm.name}" (${adm.email})? This action cannot be undone.`)) {
      try {
        dataStore.deleteAdmin(adm.id);
        setGlobalStatus(`Deleted administrator "${adm.name}".`);
        setTimeout(() => setGlobalStatus(null), 4000);
      } catch (err) {
        alert(err.message);
      }
    }
  }

  // Filtered admins
  const filteredAdmins = admins.filter((a) => {
    const q = search.toLowerCase();
    return a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.role.toLowerCase().includes(q);
  });

  const superAdminsCount = admins.filter((a) => a.role === 'Super Admin').length;

  return (
    <div>
      {/* HEADER */}
      <div className="flex-between" style={{ marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1.4rem' }}>🛡️</span>
            <h1>Admin Security & Passwords</h1>
          </div>
          <p style={{ marginTop: 4, color: 'var(--ink-dim)', fontSize: '0.94rem' }}>
            Update your administrator credentials, create new admin accounts, and configure permissions.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <span>+</span> Add New Admin
          </button>
        </div>
      </div>

      {/* GLOBAL STATUS BANNER */}
      {globalStatus && (
        <div
          style={{
            background: '#ECFDF5',
            color: '#065F46',
            border: '1px solid #A7F3D0',
            padding: '12px 18px',
            borderRadius: '8px',
            marginBottom: 24,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{globalStatus}</span>
          <button
            type="button"
            onClick={() => setGlobalStatus(null)}
            style={{ background: 'none', border: 'none', color: '#065F46', cursor: 'pointer', fontSize: '1.1rem' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* TOP METRICS ROW */}
      <div className="yogsathi-metrics-grid" style={{ marginBottom: 28 }}>
        <div className="metric-card">
          <div className="metric-card-header">
            <div className="metric-icon-box icon-blue">👥</div>
            <div>
              <span className="metric-card-label">Total Admins</span>
            </div>
          </div>
          <div className="metric-card-value">{admins.length}</div>
          <div className="metric-card-footer">
            <span><strong>{superAdminsCount}</strong> Super {superAdminsCount === 1 ? 'Admin' : 'Admins'}</span>
            <span className="badge badge-accent" style={{ background: '#EFF6FF', color: '#2563EB' }}>Active Roster</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-header">
            <div className="metric-icon-box icon-orange">🔑</div>
            <div>
              <span className="metric-card-label">Current Session</span>
            </div>
          </div>
          <div style={{ margin: '12px 0 6px' }}>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {admin?.name || 'Administrator'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {admin?.email || 'admin@brandedcoders.com'}
            </div>
          </div>
          <div className="metric-card-footer">
            <span className="status-dot dot-green"></span>
            <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>Active Session</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-header">
            <div className="metric-icon-box icon-green">🔒</div>
            <div>
              <span className="metric-card-label">Stealth Admin URL</span>
            </div>
          </div>
          <div className="metric-card-value" style={{ fontSize: '1.25rem', color: '#059669' }}>
            Hidden
          </div>
          <div className="metric-card-footer">
            <span>Zero public links on homepage</span>
            <span className="badge" style={{ background: '#ECFDF5', color: '#059669' }}>100% Secret</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-header">
            <div className="metric-icon-box icon-yellow">🛡️</div>
            <div>
              <span className="metric-card-label">Access Protection</span>
            </div>
          </div>
          <div className="metric-card-value" style={{ fontSize: '1.25rem', color: '#D97706' }}>
            RBAC Enabled
          </div>
          <div className="metric-card-footer">
            <span>Single-admin lockout prevention</span>
            <span className="badge" style={{ background: '#FEF3C7', color: '#D97706' }}>Safe Guarded</span>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, borderBottom: '1px solid #E2E8F0', paddingBottom: 12 }}>
        <button
          type="button"
          onClick={() => setActiveTab('password')}
          className={`btn ${activeTab === 'password' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px' }}
        >
          <span>🔑</span> Update My Password
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('admins')}
          className={`btn ${activeTab === 'admins' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px' }}
        >
          <span>👥</span> Manage Administrators ({admins.length})
        </button>
      </div>

      {/* TAB 1: UPDATE PASSWORD */}
      {activeTab === 'password' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 24 }}>
          {/* PASSWORD FORM CARD */}
          <div className="chart-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  color: '#2563EB',
                }}
              >
                🔐
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Change Admin Password</h3>
                <p style={{ fontSize: '0.84rem', color: '#64748B' }}>
                  Update password for logged in account: <strong>{admin?.email}</strong>
                </p>
              </div>
            </div>

            {passSuccess && (
              <div
                style={{
                  background: '#ECFDF5',
                  color: '#065F46',
                  border: '1px solid #A7F3D0',
                  padding: '14px 16px',
                  borderRadius: 8,
                  marginBottom: 20,
                  fontSize: '0.9rem',
                }}
              >
                🎉 {passSuccess}
              </div>
            )}

            {passError && (
              <div
                style={{
                  background: '#FEF2F2',
                  color: '#991B1B',
                  border: '1px solid #FECACA',
                  padding: '14px 16px',
                  borderRadius: 8,
                  marginBottom: 20,
                  fontSize: '0.9rem',
                }}
              >
                ⚠️ {passError}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit}>
              {/* CURRENT PASSWORD */}
              <div className="field">
                <label htmlFor="currentPass" style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.88rem' }}>
                  Current Administrator Password <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="currentPass"
                    type={showCurrentPass ? 'text' : 'password'}
                    required
                    placeholder="Enter your current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    style={{ paddingRight: 44, width: '100%' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      color: '#64748B',
                    }}
                    title={showCurrentPass ? 'Hide password' : 'Show password'}
                  >
                    {showCurrentPass ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* NEW PASSWORD */}
              <div className="field" style={{ marginTop: 16 }}>
                <label htmlFor="newPass" style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.88rem' }}>
                  New Secure Password <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="newPass"
                    type={showNewPass ? 'text' : 'password'}
                    required
                    placeholder="At least 6 characters (e.g. Studio#2026!)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ paddingRight: 44, width: '100%' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      color: '#64748B',
                    }}
                    title={showNewPass ? 'Hide password' : 'Show password'}
                  >
                    {showNewPass ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>

                {/* Password strength indicator */}
                {newPassword && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem' }}>
                      <span style={{ color: newPassword.length >= 6 ? '#059669' : '#DC2626' }}>
                        {newPassword.length >= 6 ? '✓ Minimum 6 characters met' : '✗ Must be at least 6 characters'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* CONFIRM NEW PASSWORD */}
              <div className="field" style={{ marginTop: 16 }}>
                <label htmlFor="confirmPass" style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.88rem' }}>
                  Confirm New Password <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="confirmPass"
                    type={showConfirmPass ? 'text' : 'password'}
                    required
                    placeholder="Re-enter your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ paddingRight: 44, width: '100%' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      color: '#64748B',
                    }}
                    title={showConfirmPass ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPass ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>

                {confirmPassword && (
                  <div style={{ marginTop: 6, fontSize: '0.78rem' }}>
                    {newPassword === confirmPassword ? (
                      <span style={{ color: '#059669', fontWeight: 600 }}>✓ Passwords match perfectly</span>
                    ) : (
                      <span style={{ color: '#DC2626', fontWeight: 600 }}>✗ Passwords do not match</span>
                    )}
                  </div>
                )}
              </div>

              <div style={{ marginTop: 24 }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={passLoading || (newPassword && newPassword !== confirmPassword)}
                  style={{ width: '100%', padding: '12px 18px', fontSize: '0.96rem', fontWeight: 700 }}
                >
                  {passLoading ? 'Updating Secure Credentials…' : 'Update Administrator Password →'}
                </button>
              </div>
            </form>
          </div>

          {/* SECURITY GUIDELINES & ACTIVE SESSION CARD */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="chart-card" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>
                🛡️ Security Best Practices
              </h3>
              <ul style={{ paddingLeft: 18, color: '#475569', fontSize: '0.86rem', lineHeight: 1.6 }}>
                <li>Keep administrator passwords unique and do not share them via unencrypted chat.</li>
                <li>Ensure passwords combine uppercase letters, lowercase letters, numbers, and special symbols.</li>
                <li>The administrator console URL is kept strictly confidential from the public website.</li>
                <li>Changes to passwords take effect immediately in the local store and on subsequent logins.</li>
              </ul>
            </div>

            <div className="chart-card">
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>
                👤 Current Account Details
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 8 }}>
                  <span style={{ color: '#64748B' }}>Display Name</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{admin?.name || 'Studio Administrator'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 8 }}>
                  <span style={{ color: '#64748B' }}>Admin Email</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{admin?.email || 'admin@brandedcoders.com'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 8 }}>
                  <span style={{ color: '#64748B' }}>Assigned Role</span>
                  <span className="badge" style={{ background: '#EFF6FF', color: '#2563EB', fontWeight: 700 }}>
                    {admin?.role || 'Super Admin'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Console Scope</span>
                  <span style={{ color: '#059669', fontWeight: 600 }}>Unrestricted Studio Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE ADMINISTRATORS */}
      {activeTab === 'admins' && (
        <div>
          {/* SEARCH & ADD BAR */}
          <div className="actions-bar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: 380 }}>
              <input
                type="text"
                placeholder="Search admins by name, email, or role…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
                style={{ width: '100%' }}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <span>+</span> Add New Admin
            </button>
          </div>

          {/* ADMINS ROSTER TABLE */}
          <div className="chart-card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '14px 20px' }}>Administrator</th>
                  <th style={{ padding: '14px 20px' }}>Assigned Role</th>
                  <th style={{ padding: '14px 20px' }}>Created Date</th>
                  <th style={{ padding: '14px 20px' }}>Status</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.map((adm) => {
                  const isCurrent = adm.email.toLowerCase() === admin?.email?.toLowerCase();
                  const initials = adm.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase();

                  return (
                    <tr key={adm.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: 10,
                              background: isCurrent ? 'linear-gradient(135deg, #2563EB, #1D4ED8)' : 'linear-gradient(135deg, #0F172A, #334155)',
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              flexShrink: 0,
                            }}
                          >
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
                              {adm.name}
                              {isCurrent && (
                                <span style={{ fontSize: '0.72rem', background: '#DBEAFE', color: '#1E40AF', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                                  You
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.82rem', color: '#64748B' }}>{adm.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span
                          className="badge"
                          style={{
                            background: adm.role === 'Super Admin' ? '#EFF6FF' : adm.role === 'Content Manager' ? '#ECFDF5' : '#FEF3C7',
                            color: adm.role === 'Super Admin' ? '#2563EB' : adm.role === 'Content Manager' ? '#059669' : '#D97706',
                            fontWeight: 700,
                          }}
                        >
                          {adm.role || 'Super Admin'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', color: '#64748B', fontSize: '0.85rem' }}>
                        {adm.createdAt || '2026-09-08'}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: '#059669', fontWeight: 600 }}>
                          <span className="status-dot dot-green"></span> Active
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingAdmin(adm);
                              setEditName(adm.name);
                              setEditRole(adm.role || 'Super Admin');
                            }}
                            className="btn btn-ghost"
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                            title="Edit Administrator Details"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setResettingAdmin(adm);
                              setResetNewPass('');
                              setResetConfirmPass('');
                              setResetError(null);
                            }}
                            className="btn btn-ghost"
                            style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#2563EB' }}
                            title="Reset Administrator Password"
                          >
                            🔑 Reset Pass
                          </button>
                          {!isCurrent && (
                            <button
                              type="button"
                              onClick={() => handleDeleteAdmin(adm)}
                              className="btn btn-ghost"
                              style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#DC2626' }}
                              title="Delete Administrator Account"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW ADMIN */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setShowAddModal(false)}
            >
              ✕
            </button>

            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>+ Add New Administrator</h2>
              <p style={{ fontSize: '0.88rem', color: '#64748B', marginTop: 4 }}>
                Create administrative credentials for a team member to access the BrandedCoders console.
              </p>
            </div>

            {addAdminError && (
              <div style={{ background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA', padding: '12px 14px', borderRadius: 8, marginBottom: 16, fontSize: '0.88rem' }}>
                ⚠️ {addAdminError}
              </div>
            )}

            <form onSubmit={handleAddAdminSubmit}>
              <div className="field">
                <label htmlFor="newAdminName" style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.88rem' }}>
                  Full Name <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  id="newAdminName"
                  type="text"
                  required
                  placeholder="e.g. Devika Sharma"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                />
              </div>

              <div className="field" style={{ marginTop: 14 }}>
                <label htmlFor="newAdminEmail" style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.88rem' }}>
                  Administrator Email <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  id="newAdminEmail"
                  type="email"
                  required
                  placeholder="e.g. devika@brandedcoders.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                />
              </div>

              <div className="field" style={{ marginTop: 14 }}>
                <label htmlFor="newAdminRole" style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.88rem' }}>
                  Administrative Role <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <select
                  id="newAdminRole"
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E1' }}
                >
                  {ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label} — {r.desc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field" style={{ marginTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label htmlFor="newAdminPassword" style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.88rem' }}>
                    Initial Password <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const gen = generateRandomPassword();
                      setNewAdminPassword(gen);
                      setNewAdminConfirmPass(gen);
                    }}
                    style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    🎲 Generate Strong Password
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    id="newAdminPassword"
                    type={showAddPass ? 'text' : 'password'}
                    required
                    placeholder="At least 6 characters"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    style={{ paddingRight: 44, width: '100%' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowAddPass(!showAddPass)}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      color: '#64748B',
                    }}
                  >
                    {showAddPass ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div className="field" style={{ marginTop: 14 }}>
                <label htmlFor="newAdminConfirmPass" style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.88rem' }}>
                  Confirm Password <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  id="newAdminConfirmPass"
                  type={showAddPass ? 'text' : 'password'}
                  required
                  placeholder="Repeat password"
                  value={newAdminConfirmPass}
                  onChange={(e) => setNewAdminConfirmPass(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '10px 20px', fontWeight: 700 }}
                >
                  + Create Administrator Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT ADMIN */}
      {editingAdmin && (
        <div className="modal-overlay" onClick={() => setEditingAdmin(null)}>
          <div className="modal-content" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setEditingAdmin(null)}
            >
              ✕
            </button>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
              Edit Administrator
            </h2>
            <p style={{ fontSize: '0.86rem', color: '#64748B', marginBottom: 20 }}>
              Update display name and permission tier for <strong>{editingAdmin.email}</strong>
            </p>

            <form onSubmit={handleEditAdminSubmit}>
              <div className="field">
                <label style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.88rem' }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div className="field" style={{ marginTop: 14 }}>
                <label style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.88rem' }}>Administrative Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E1' }}
                >
                  {ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setEditingAdmin(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '10px 20px', fontWeight: 700 }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESET ADMIN PASSWORD */}
      {resettingAdmin && (
        <div className="modal-overlay" onClick={() => setResettingAdmin(null)}>
          <div className="modal-content" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setResettingAdmin(null)}
            >
              ✕
            </button>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
              Reset Administrator Password
            </h2>
            <p style={{ fontSize: '0.86rem', color: '#64748B', marginBottom: 18 }}>
              Set a new password for <strong>{resettingAdmin.name}</strong> ({resettingAdmin.email})
            </p>

            {resetError && (
              <div style={{ background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA', padding: '12px 14px', borderRadius: 8, marginBottom: 16, fontSize: '0.88rem' }}>
                ⚠️ {resetError}
              </div>
            )}

            <form onSubmit={handleResetPasswordSubmit}>
              <div className="field">
                <label style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.88rem' }}>
                  New Password <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={resetNewPass}
                  onChange={(e) => setResetNewPass(e.target.value)}
                />
              </div>

              <div className="field" style={{ marginTop: 14 }}>
                <label style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.88rem' }}>
                  Confirm Password <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={resetConfirmPass}
                  onChange={(e) => setResetConfirmPass(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setResettingAdmin(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '10px 20px', fontWeight: 700 }}
                >
                  Set New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
