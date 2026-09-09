import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function EmployeeSettings() {
  const { employee } = useAuth();
  const [saved, setSaved] = useState(false);
  const [phone, setPhone] = useState(employee?.phone || '+91 98765 43210');

  function handleSave(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 24 }}>
        <div>
          <h1>Employee Profile & Settings</h1>
          <p style={{ marginTop: 4 }}>Manage your contact preferences, view salary and bonus terms.</p>
        </div>
      </div>

      {saved && (
        <div className="status-msg status-ok" style={{ marginBottom: 20 }}>
          ✅ Profile preferences updated successfully!
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
        <form onSubmit={handleSave} className="panel-card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 16 }}>Personal Details</h3>

          <div className="field">
            <label>Full Name</label>
            <input disabled value={employee?.name || 'Kanika Aggarwal'} />
          </div>

          <div className="field">
            <label>Work Email</label>
            <input disabled value={employee?.email || 'kanika@brandedcoders.com'} />
          </div>

          <div className="field">
            <label>Designation / Role</label>
            <input disabled value={employee?.role || 'Lead Business Development & Growth'} />
          </div>

          <div className="field">
            <label>Direct Phone Number</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <button type="submit" className="btn btn-orange" style={{ marginTop: 10 }}>
            Save Changes
          </button>
        </form>

        <div className="panel-card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 16 }}>Compensation & Incentives</h3>

          <div style={{ padding: '14px', background: 'var(--bg-soft)', borderRadius: 'var(--radius-sm)', marginBottom: 14 }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--ink-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Monthly Base Salary</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--emerald)', marginTop: 4 }}>
              {employee?.monthlySalaryText || '₹15,000'}
            </div>
            <p style={{ fontSize: '0.82rem', marginTop: 4 }}>Disbursed on the 1st of every calendar month.</p>
          </div>

          <div style={{ padding: '14px', background: 'var(--bg-soft)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--ink-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Performance Bonus Terms</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--amber)', marginTop: 4 }}>
              {employee?.bonusToday || '₹850'} today
            </div>
            <p style={{ fontSize: '0.82rem', marginTop: 6, lineHeight: 1.5 }}>
              Earn daily bonus for logging customer conversations and completing assigned task remarks. Goal: 10 completed tasks with customer remarks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
