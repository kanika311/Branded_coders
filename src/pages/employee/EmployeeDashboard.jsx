import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { dataStore } from '../../lib/dataStore.js';

export default function EmployeeDashboard() {
  const { employee, toggleEmployeeBreak } = useAuth();
  const [data, setData] = useState({
    leads: dataStore.getLeads(),
    tasks: dataStore.getTasks(),
  });

  useEffect(() => {
    return dataStore.subscribe(() => {
      setData({
        leads: dataStore.getLeads(),
        tasks: dataStore.getTasks(),
      });
    });
  }, []);

  // Filter tasks for this employee
  const currentEmpName = employee?.name || 'Kanika Aggarwal';
  const myTasks = data.tasks.filter((t) => t.assignedTo === currentEmpName);
  const openTasks = myTasks.filter((t) => t.status !== 'Completed');
  const completedTasks = myTasks.filter((t) => t.status === 'Completed');

  // Leads stats
  const totalLeads = data.leads.length;
  const newLeads = data.leads.filter((l) => l.status === 'New').length;
  const contactedLeads = data.leads.filter((l) => l.status === 'Contacted').length;
  const demoLeads = data.leads.filter((l) => l.status === 'Demo scheduled').length;
  const activeLeads = data.leads.filter((l) => l.status === 'Active').length;
  const noResponseLeads = data.leads.filter((l) => l.status === 'No response').length;
  const closedLeads = data.leads.filter((l) => l.status === 'Closed').length;

  // Live timer calculation
  const totalSeconds = employee?.timerSeconds || 1121;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const todayDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div>
      {/* TOP BAR - EXACTLY LIKE YOGSATHI SCREENSHOT */}
      <div className="emp-topbar">
        <div className="emp-topbar-title">
          <h1>My Dashboard</h1>
          <div className="emp-topbar-subtitle">
            Welcome, {currentEmpName} • Auto logout after 10 min idle
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            type="button"
            className={`btn-break ${employee?.onBreak ? 'on-break' : ''}`}
            onClick={toggleEmployeeBreak}
          >
            {employee?.onBreak ? '☕ Resume Work (On Break)' : '☕ Take a break'}
          </button>

          <Link to="/employee/leads?add=true" className="btn btn-orange btn-sm" style={{ padding: '9px 16px' }}>
            + Add New Lead
          </Link>
        </div>
      </div>

      {/* 4 METRIC CARDS ROW */}
      <div className="yogsathi-metrics-grid">
        {/* CARD 1: TODAY'S LOGIN TIME */}
        <div className="metric-card">
          <div className="metric-card-header">
            <div className="metric-icon-box icon-orange">⏱️</div>
            <div>
              <span className="metric-card-label">Today's Login Time</span>
            </div>
          </div>
          <div className="metric-card-value">
            {hours} Hr {minutes} Min {seconds} Sec
          </div>
          <div className="metric-card-footer" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span>Date</span>
              <strong style={{ color: 'var(--ink)' }}>{todayDateStr}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span>First login</span>
              <span>{employee?.firstLogin || '06:26 PM'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 2 }}>
              <span>Status</span>
              <span>
                {employee?.onBreak ? (
                  <><span className="status-dot dot-amber" />On Break</>
                ) : (
                  <><span className="status-dot dot-green" />Online</>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* CARD 2: TOTAL TASKS */}
        <div className="metric-card">
          <div className="metric-card-header">
            <div className="metric-icon-box icon-blue">📋</div>
            <div>
              <span className="metric-card-label">Total Tasks</span>
            </div>
          </div>
          <div className="metric-card-value">{myTasks.length}</div>
          <div className="metric-card-footer">
            <span>
              <strong style={{ color: 'var(--amber)' }}>{openTasks.length}</strong> open •{' '}
              <strong style={{ color: 'var(--emerald)' }}>{completedTasks.length}</strong> completed
            </span>
          </div>
          <div style={{ marginTop: 8 }}>
            <Link to="/employee/tasks" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.85rem' }}>
              Open task table →
            </Link>
          </div>
        </div>

        {/* CARD 3: MONTHLY SALARY */}
        <div className="metric-card">
          <div className="metric-card-header">
            <div className="metric-icon-box icon-green">₹</div>
            <div>
              <span className="metric-card-label">Monthly Salary</span>
            </div>
          </div>
          <div className="metric-card-value" style={{ color: 'var(--emerald)' }}>
            {employee?.monthlySalaryText || '₹15,000'}
          </div>
          <div className="metric-card-footer">
            <span>Fixed Monthly Base</span>
            <span className="badge badge-active">Active Payroll</span>
          </div>
        </div>

        {/* CARD 4: TODAY'S BONUS */}
        <div className="metric-card">
          <div className="metric-card-header">
            <div className="metric-icon-box icon-yellow">🎁</div>
            <div>
              <span className="metric-card-label">Today's Bonus</span>
            </div>
          </div>
          <div className="metric-card-value" style={{ color: 'var(--amber)' }}>
            {employee?.bonusToday || '₹850'}
          </div>
          <div className="metric-card-footer">
            <span>{completedTasks.length}/10 tasks with remarks</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--ink-dim)' }}>Performance Goal</span>
          </div>
        </div>
      </div>

      {/* ANALYTICS DONUT CHARTS (LIKE YOGSATHI SCREENSHOT) */}
      <div className="analytics-grid">
        {/* CHART 1: APPOINTMENT / LEAD PIPELINE STATUS */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#2563EB', fontSize: '1.2rem' }}>📅</span>
              <div>
                <h3>LEAD PIPELINE STATUS</h3>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ink)' }}>761</div>
              </div>
            </div>
            <Link to="/employee/leads" style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>
              View all →
            </Link>
          </div>

          <div className="chart-donut-wrap">
            {/* SVG DONUT CHART */}
            <div className="donut-visual">
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#E2E8F0" strokeWidth="3.8" />
                {/* Segments */}
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#F59E0B" strokeWidth="3.8" strokeDasharray="32 100" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#3B82F6" strokeWidth="3.8" strokeDasharray="24 100" strokeDashoffset="-32" />
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#8B5CF6" strokeWidth="3.8" strokeDasharray="8 100" strokeDashoffset="-56" />
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#94A3B8" strokeWidth="3.8" strokeDasharray="26 100" strokeDashoffset="-64" />
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#EF4444" strokeWidth="3.8" strokeDasharray="10 100" strokeDashoffset="-90" />
              </svg>
              <div className="donut-center-text">
                <span className="donut-center-label">TOTAL</span>
                <span className="donut-center-num">761</span>
              </div>
            </div>

            {/* LEGEND MATCHING SCREENSHOT */}
            <div className="donut-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#F59E0B' }} />
                <div className="legend-info">
                  <span className="legend-label">New</span>
                  <span className="legend-count">{249 + newLeads}</span>
                </div>
              </div>

              <div className="legend-item">
                <div className="legend-color" style={{ background: '#3B82F6' }} />
                <div className="legend-info">
                  <span className="legend-label">Contacted</span>
                  <span className="legend-count">{178 + contactedLeads}</span>
                </div>
              </div>

              <div className="legend-item">
                <div className="legend-color" style={{ background: '#8B5CF6' }} />
                <div className="legend-info">
                  <span className="legend-label">Demo scheduled</span>
                  <span className="legend-count">{6 + demoLeads}</span>
                </div>
              </div>

              <div className="legend-item">
                <div className="legend-color" style={{ background: '#94A3B8' }} />
                <div className="legend-info">
                  <span className="legend-label">No response</span>
                  <span className="legend-count">{247 + noResponseLeads}</span>
                </div>
              </div>

              <div className="legend-item">
                <div className="legend-color" style={{ background: '#10B981' }} />
                <div className="legend-info">
                  <span className="legend-label">Active</span>
                  <span className="legend-count">{6 + activeLeads}</span>
                </div>
              </div>

              <div className="legend-item">
                <div className="legend-color" style={{ background: '#EF4444' }} />
                <div className="legend-info">
                  <span className="legend-label">Closed</span>
                  <span className="legend-count">{75 + closedLeads}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CHART 2: LEADS SUMMARY */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#8B5CF6', fontSize: '1.2rem' }}>👤</span>
              <div>
                <h3>LEADS</h3>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ink)' }}>3494</div>
              </div>
            </div>
            <Link to="/employee/leads" style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>
              View all →
            </Link>
          </div>

          <div className="chart-donut-wrap">
            <div className="donut-visual">
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#E2E8F0" strokeWidth="4.2" />
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#FF7A00" strokeWidth="4.2" strokeDasharray="98 100" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#3B82F6" strokeWidth="4.2" strokeDasharray="2 100" strokeDashoffset="-98" />
              </svg>
              <div className="donut-center-text">
                <span className="donut-center-label">TOTAL</span>
                <span className="donut-center-num">3494</span>
              </div>
            </div>

            <div className="donut-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#FF7A00' }} />
                <div className="legend-info">
                  <span className="legend-label">New</span>
                  <span className="legend-count">3485</span>
                </div>
              </div>

              <div className="legend-item">
                <div className="legend-color" style={{ background: '#3B82F6' }} />
                <div className="legend-info">
                  <span className="legend-label">Contacted</span>
                  <span className="legend-count">9</span>
                </div>
              </div>

              <div className="legend-item">
                <div className="legend-color" style={{ background: '#10B981' }} />
                <div className="legend-info">
                  <span className="legend-label">Closed</span>
                  <span className="legend-count">0</span>
                </div>
              </div>
            </div>
          </div>

          <p style={{ marginTop: 20, fontSize: '0.78rem', color: '#94A3B8', borderTop: '1px solid var(--panel-line)', paddingTop: 12 }}>
            Contact Us and website lead submissions combined
          </p>
        </div>
      </div>

      {/* BOTTOM ROW: SERVICES CONCERN & QUICK CONTACT LEADS TABLE */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24 }}>
        {/* SERVICES CATEGORY BREAKDOWN */}
        <div className="panel-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 16 }}>
            Inquiries by Service Category
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { name: 'Digital Marketing & Growth', count: 184, percent: 85, color: '#FF7A00' },
              { name: 'Website Design & Dev', count: 142, percent: 65, color: '#2563EB' },
              { name: 'Custom MERN & Headless CMS', count: 98, percent: 45, color: '#10B981' },
              { name: 'Dashboards & Operational Tools', count: 76, percent: 35, color: '#8B5CF6' },
              { name: 'Mobile Apps & AI Platforms', count: 62, percent: 28, color: '#EC4899' },
            ].map((cat) => (
              <div key={cat.name}>
                <div className="flex-between" style={{ fontSize: '0.82rem', marginBottom: 4 }}>
                  <span>{cat.name}</span>
                  <strong>{cat.count} inquiries</strong>
                </div>
                <div style={{ height: 6, background: '#F1F5F9', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${cat.percent}%`, height: '100%', background: cat.color, borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MY ASSIGNED LEADS TO CONTACT */}
        <div className="panel-card">
          <div className="flex-between" style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Leads Assigned to You</h3>
            <Link to="/employee/leads" style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>
              Full Leads Table →
            </Link>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Contact Person</th>
                  <th>Phone Number</th>
                  <th>Type of Lead</th>
                  <th>Status</th>
                  <th>Quick Action</th>
                </tr>
              </thead>
              <tbody>
                {data.leads.slice(0, 4).map((l) => (
                  <tr key={l.id}>
                    <td>
                      <strong>{l.name}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--ink-dim)' }}>{l.company}</div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{l.phone}</span>
                    </td>
                    <td>
                      <span className="tag-pill">{l.leadType}</span>
                    </td>
                    <td>
                      <span className="badge badge-new">{l.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <a
                          href={`https://wa.me/${l.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-ghost"
                          style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#059669' }}
                        >
                          WhatsApp
                        </a>
                        <a
                          href={`tel:${l.phone}`}
                          className="btn btn-sm btn-ghost"
                          style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#2563EB' }}
                        >
                          Call
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
