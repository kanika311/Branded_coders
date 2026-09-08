import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dataStore } from '../../lib/dataStore';

export default function Dashboard() {
  const [data, setData] = useState({
    services: dataStore.getServices(),
    portfolio: dataStore.getPortfolio(),
    messages: dataStore.getMessages(),
    leads: dataStore.getLeads(),
    tasks: dataStore.getTasks(),
    employees: dataStore.getEmployees(),
    admins: dataStore.getAdmins(),
  });

  useEffect(() => {
    return dataStore.subscribe(() => {
      setData({
        services: dataStore.getServices(),
        portfolio: dataStore.getPortfolio(),
        messages: dataStore.getMessages(),
        leads: dataStore.getLeads(),
        tasks: dataStore.getTasks(),
        employees: dataStore.getEmployees(),
        admins: dataStore.getAdmins(),
      });
    });
  }, []);

  const pendingTasks = data.tasks.filter((t) => t.status !== 'Completed').length;
  const onlineEmployees = data.employees.filter((e) => e.isOnline).length;
  const newLeads = data.leads.filter((l) => l.status === 'New').length;

  return (
    <div>
      {/* HEADER */}
      <div className="flex-between" style={{ marginBottom: 28 }}>
        <div>
          <h1>Admin Overview & Control Center</h1>
          <p style={{ marginTop: 4 }}>Live operational dashboard for BrandedCoders services, leads, and employee tasks.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/admin/security" className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>🛡️</span> Security & Admins ({data.admins.length})
          </Link>
          <Link to="/admin/tasks" className="btn btn-primary">
            + Assign Task to Employee
          </Link>
          <Link to="/admin/services" className="btn btn-ghost">
            + Add Service
          </Link>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="yogsathi-metrics-grid">
        <div className="metric-card">
          <div className="metric-card-header">
            <div className="metric-icon-box icon-blue">👥</div>
            <div>
              <span className="metric-card-label">Total Leads</span>
            </div>
          </div>
          <div className="metric-card-value">{data.leads.length}</div>
          <div className="metric-card-footer">
            <span><strong>{newLeads}</strong> new inquiries</span>
            <Link to="/admin/leads" style={{ color: 'var(--accent)', fontWeight: 600 }}>Manage →</Link>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-header">
            <div className="metric-icon-box icon-orange">📝</div>
            <div>
              <span className="metric-card-label">Active Tasks</span>
            </div>
          </div>
          <div className="metric-card-value">{pendingTasks}</div>
          <div className="metric-card-footer">
            <span>{data.tasks.length - pendingTasks} completed</span>
            <Link to="/admin/tasks" style={{ color: 'var(--orange)', fontWeight: 600 }}>Assign →</Link>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-header">
            <div className="metric-icon-box icon-green">💼</div>
            <div>
              <span className="metric-card-label">Team Members</span>
            </div>
          </div>
          <div className="metric-card-value">{data.employees.length}</div>
          <div className="metric-card-footer">
            <span><span className="status-dot dot-green" />{onlineEmployees} Online now</span>
            <Link to="/admin/employees" style={{ color: 'var(--emerald)', fontWeight: 600 }}>Roster →</Link>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-header">
            <div className="metric-icon-box icon-yellow">⚡</div>
            <div>
              <span className="metric-card-label">Live Services</span>
            </div>
          </div>
          <div className="metric-card-value">{data.services.length}</div>
          <div className="metric-card-footer">
            <span>{data.portfolio.length} portfolio case studies</span>
            <Link to="/admin/services" style={{ color: 'var(--amber)', fontWeight: 600 }}>Edit CMS →</Link>
          </div>
        </div>
      </div>

      {/* TWO COLUMN SUMMARY */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
        {/* RECENT LEADS */}
        <div className="panel-card">
          <div className="flex-between" style={{ marginBottom: 18 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Pipeline Leads</h3>
            <Link to="/admin/leads" style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>View All Leads ({data.leads.length}) →</Link>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Contact Person</th>
                  <th>Lead Type</th>
                  <th>Phone Number</th>
                  <th>Status</th>
                  <th>Assigned</th>
                </tr>
              </thead>
              <tbody>
                {data.leads.slice(0, 5).map((l) => (
                  <tr key={l.id}>
                    <td>
                      <strong>{l.name}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--ink-dim)' }}>{l.company || 'Direct Client'}</div>
                    </td>
                    <td>
                      <span className="tag-pill">{l.leadType}</span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{l.phone}</span>
                    </td>
                    <td>
                      <span className={`badge ${
                        l.status === 'New' ? 'badge-new' :
                        l.status === 'Contacted' ? 'badge-contacted' :
                        l.status === 'Active' ? 'badge-active' :
                        l.status === 'Closed' ? 'badge-closed' : 'badge-scheduled'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{l.assignedTo}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TEAM & TASK PROGRESS */}
        <div className="panel-card">
          <div className="flex-between" style={{ marginBottom: 18 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Employee Status & Tasks</h3>
            <Link to="/admin/tasks" style={{ fontSize: '0.85rem', color: 'var(--orange)', fontWeight: 600 }}>Task Board →</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {data.employees.map((emp) => {
              const empTasks = data.tasks.filter((t) => t.assignedTo === emp.name);
              const doneTasks = empTasks.filter((t) => t.status === 'Completed').length;
              const hrs = Math.floor((emp.timerSeconds || 0) / 3600);
              const mins = Math.floor(((emp.timerSeconds || 0) % 3600) / 60);

              return (
                <div key={emp.id} style={{ padding: '12px 14px', background: 'var(--bg-soft)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--panel-line)' }}>
                  <div className="flex-between">
                    <div>
                      <strong style={{ fontSize: '0.95rem' }}>{emp.name}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--ink-dim)' }}>{emp.role}</div>
                    </div>
                    <div>
                      {emp.isOnline ? (
                        emp.onBreak ? (
                          <span className="badge" style={{ background: '#FEF3C7', color: '#B45309' }}>🟡 On Break</span>
                        ) : (
                          <span className="badge" style={{ background: '#ECFDF5', color: '#059669' }}>🟢 Active ({hrs}h {mins}m)</span>
                        )
                      ) : (
                        <span className="badge badge-noresponse">⚪ Offline</span>
                      )}
                    </div>
                  </div>
                  <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--ink-dim)' }}>
                    <span>Assigned Tasks: <strong>{empTasks.length}</strong></span>
                    <span>Completed: <strong>{doneTasks}</strong></span>
                    <span>Salary: <strong>{emp.monthlySalaryText}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
