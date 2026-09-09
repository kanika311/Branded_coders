import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataStore } from '../../lib/dataStore';

const emptyEmployeeForm = {
  name: '',
  email: '',
  password: 'employee123',
  role: 'Business Development & Growth',
  phone: '+91 ',
  salary: '25000',
  bonusToday: '₹500',
  bonusGoal: '10 tasks with remarks',
};

export default function ManageEmployees() {
  const { impersonateEmployee } = useAuth();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState(dataStore.getEmployees());
  const [tasks, setTasks] = useState(dataStore.getTasks());
  const [leads, setLeads] = useState(dataStore.getLeads());

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);
  const [form, setForm] = useState(emptyEmployeeForm);
  const [statusMsg, setStatusMsg] = useState(null);
  const [sessionPreviewEmp, setSessionPreviewEmp] = useState(null);

  useEffect(() => {
    return dataStore.subscribe((data) => {
      setEmployees(data.employees);
      setTasks(data.tasks);
      setLeads(data.leads);
    });
  }, []);

  function handleAddOrEdit(e) {
    e.preventDefault();
    if (!form.name || !form.email) return;

    if (editingEmp) {
      dataStore.updateEmployee(editingEmp.id, form);
      setStatusMsg(`✅ Employee "${form.name}" updated successfully.`);
      setEditingEmp(null);
    } else {
      dataStore.addEmployee(form);
      setStatusMsg(`✅ New employee "${form.name}" added successfully.`);
      setShowAddModal(false);
    }

    setForm(emptyEmployeeForm);
    setTimeout(() => setStatusMsg(null), 4000);
  }

  function startEdit(emp) {
    setEditingEmp(emp);
    setForm({
      name: emp.name,
      email: emp.email,
      password: emp.password || 'employee123',
      role: emp.role || '',
      phone: emp.phone || '',
      salary: emp.salary || '20000',
      bonusToday: emp.bonusToday || '₹500',
      bonusGoal: emp.bonusGoal || '10 tasks with remarks',
    });
  }

  function handleToggleActive(emp) {
    dataStore.toggleEmployeeActive(emp.id);
    const nextStatus = emp.isActive === false ? 'Activated' : 'Deactivated';
    setStatusMsg(`Account for ${emp.name} is now ${nextStatus}.`);
    setTimeout(() => setStatusMsg(null), 3000);
  }

  function handleDelete(emp) {
    if (confirm(`Are you sure you want to delete ${emp.name} from the roster? This cannot be undone.`)) {
      dataStore.deleteEmployee(emp.id);
      setStatusMsg(`Deleted ${emp.name} from employees.`);
      setTimeout(() => setStatusMsg(null), 3000);
    }
  }

  function handleInspectSession(emp) {
    setSessionPreviewEmp(emp);
  }

  function handleOpenEmployeeDashboard(emp) {
    impersonateEmployee(emp.id);
    window.open('/employee/dashboard', '_blank');
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex-between" style={{ marginBottom: 24 }}>
        <div>
          <h1>Employee Management & Session Hub</h1>
          <p style={{ marginTop: 4 }}>
            Create employees, toggle active/deactivated accounts, edit credentials, and inspect live employee dashboard sessions.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingEmp(null);
            setForm(emptyEmployeeForm);
            setShowAddModal(true);
          }}
        >
          + Create New Employee
        </button>
      </div>

      {statusMsg && (
        <div className="status-msg status-ok" style={{ marginBottom: 20 }}>
          {statusMsg}
        </div>
      )}

      {/* EMPLOYEES ROSTER */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
        {employees.map((emp) => {
          const empTasks = tasks.filter((t) => t.assignedTo === emp.name);
          const doneTasks = empTasks.filter((t) => t.status === 'Completed');
          const empLeads = leads.filter((l) => l.assignedTo === emp.name);

          const hrs = Math.floor((emp.timerSeconds || 0) / 3600);
          const mins = Math.floor(((emp.timerSeconds || 0) % 3600) / 60);
          const secs = (emp.timerSeconds || 0) % 60;

          const isActive = emp.isActive !== false;

          return (
            <div
              key={emp.id}
              className="panel-card panel-card-hover"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: `4px solid ${!isActive ? '#94A3B8' : emp.isOnline ? '#10B981' : '#CBD5E1'}`,
                opacity: !isActive ? 0.75 : 1,
              }}
            >
              <div>
                {/* CARD TOP */}
                <div className="flex-between">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: '50%',
                        background: !isActive ? '#94A3B8' : 'linear-gradient(135deg, #FF7A00, #FF5500)',
                        color: '#FFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1.2rem',
                      }}
                    >
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{emp.name}</h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--ink-dim)' }}>{emp.role}</div>
                    </div>
                  </div>

                  <div>
                    {!isActive ? (
                      <span className="badge" style={{ background: '#FEE2E2', color: '#DC2626' }}>
                        🔴 Deactivated
                      </span>
                    ) : emp.isOnline ? (
                      emp.onBreak ? (
                        <span className="badge" style={{ background: '#FEF3C7', color: '#B45309' }}>
                          🟡 On Break
                        </span>
                      ) : (
                        <span className="badge" style={{ background: '#ECFDF5', color: '#059669' }}>
                          🟢 Active Session
                        </span>
                      )
                    ) : (
                      <span className="badge badge-noresponse">⚪ Offline</span>
                    )}
                  </div>
                </div>

                {/* LIVE SESSION METRICS */}
                <div
                  style={{
                    margin: '18px 0',
                    padding: '14px',
                    background: 'var(--bg-soft)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--panel-line)',
                  }}
                >
                  <div className="flex-between" style={{ fontSize: '0.84rem', marginBottom: 6 }}>
                    <span style={{ color: 'var(--ink-dim)' }}>Live Today's Timer:</span>
                    <strong style={{ fontFamily: 'monospace', fontSize: '0.94rem', color: emp.isOnline ? '#059669' : 'inherit' }}>
                      {hrs} Hr {mins} Min {secs} Sec
                    </strong>
                  </div>
                  <div className="flex-between" style={{ fontSize: '0.84rem', marginBottom: 6 }}>
                    <span style={{ color: 'var(--ink-dim)' }}>First Login Today:</span>
                    <span style={{ fontWeight: 600 }}>{emp.firstLogin || 'None'}</span>
                  </div>
                  <div className="flex-between" style={{ fontSize: '0.84rem', marginBottom: 6 }}>
                    <span style={{ color: 'var(--ink-dim)' }}>Work Email:</span>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{emp.email}</span>
                  </div>
                  <div className="flex-between" style={{ fontSize: '0.84rem' }}>
                    <span style={{ color: 'var(--ink-dim)' }}>Direct Phone:</span>
                    <span style={{ fontFamily: 'monospace' }}>{emp.phone}</span>
                  </div>
                </div>

                {/* METRICS ROW */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, textAlign: 'center', marginBottom: 16 }}>
                  <div style={{ padding: '8px 4px', background: '#FFFFFF', border: '1px solid var(--panel-line)', borderRadius: 8 }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent)' }}>{empTasks.length}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--ink-dim)', textTransform: 'uppercase' }}>Tasks</div>
                  </div>
                  <div style={{ padding: '8px 4px', background: '#FFFFFF', border: '1px solid var(--panel-line)', borderRadius: 8 }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--emerald)' }}>{doneTasks.length}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--ink-dim)', textTransform: 'uppercase' }}>Done</div>
                  </div>
                  <div style={{ padding: '8px 4px', background: '#FFFFFF', border: '1px solid var(--panel-line)', borderRadius: 8 }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--orange)' }}>{empLeads.length}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--ink-dim)', textTransform: 'uppercase' }}>Leads</div>
                  </div>
                </div>

                <div className="flex-between" style={{ paddingBottom: 14, fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--ink-dim)', textTransform: 'uppercase' }}>Salary: </span>
                    <strong style={{ color: 'var(--emerald)', fontSize: '1.05rem' }}>{emp.monthlySalaryText}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--ink-dim)', textTransform: 'uppercase' }}>Bonus: </span>
                    <strong style={{ color: 'var(--amber)' }}>{emp.bonusToday}</strong>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS (EDIT, ACTIVE/DEACTIVE, CHECK SESSION, DELETE) */}
              <div style={{ paddingTop: 14, borderTop: '1px solid var(--panel-line)', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="icon-btn"
                  style={{ fontSize: '0.78rem' }}
                  onClick={() => handleInspectSession(emp)}
                  title="Check dashboard session stats"
                >
                  👁️ Check Session
                </button>

                <button
                  type="button"
                  className="icon-btn"
                  style={{ fontSize: '0.78rem' }}
                  onClick={() => startEdit(emp)}
                >
                  ✏️ Edit
                </button>

                <button
                  type="button"
                  className="icon-btn"
                  style={{
                    fontSize: '0.78rem',
                    color: isActive ? '#DC2626' : '#059669',
                    borderColor: isActive ? '#FECACA' : '#A7F3D0',
                    background: isActive ? '#FEF2F2' : '#ECFDF5',
                  }}
                  onClick={() => handleToggleActive(emp)}
                >
                  {isActive ? 'Deactivate' : 'Activate'}
                </button>

                <button
                  type="button"
                  className="icon-btn"
                  style={{ fontSize: '0.78rem', color: '#EF4444', marginLeft: 'auto' }}
                  onClick={() => handleDelete(emp)}
                  title="Delete employee"
                >
                  🗑️
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT EMPLOYEE MODAL */}
      {(showAddModal || editingEmp) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close-btn"
              onClick={() => {
                setShowAddModal(false);
                setEditingEmp(null);
              }}
            >
              ×
            </button>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 6 }}>
              {editingEmp ? `Edit Employee: ${editingEmp.name}` : 'Create New Employee'}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-dim)', marginBottom: 20 }}>
              Set credentials, designation, contact numbers, and payroll terms.
            </p>

            <form onSubmit={handleAddOrEdit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="field">
                  <label>Full Name *</label>
                  <input
                    required
                    placeholder="e.g. Ankit Mehra"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label>Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="ankit@brandedcoders.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="field">
                  <label>Portal Login Password *</label>
                  <input
                    required
                    placeholder="e.g. employee123"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label>Phone Number *</label>
                  <input
                    required
                    placeholder="+91 98765 00000"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14 }}>
                <div className="field">
                  <label>Designation / Role *</label>
                  <input
                    required
                    placeholder="e.g. Senior SEO Strategist"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label>Monthly Salary *</label>
                  <input
                    required
                    placeholder="e.g. 25000"
                    value={form.salary}
                    onChange={(e) => setForm({ ...form, salary: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 14 }}>
                <div className="field">
                  <label>Daily Bonus Term</label>
                  <input
                    placeholder="e.g. ₹600"
                    value={form.bonusToday}
                    onChange={(e) => setForm({ ...form, bonusToday: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label>Bonus Milestone</label>
                  <input
                    placeholder="10 tasks with remarks"
                    value={form.bonusGoal}
                    onChange={(e) => setForm({ ...form, bonusGoal: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editingEmp ? 'Save Changes' : 'Create Employee Record'}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingEmp(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHECK SESSION MODAL */}
      {sessionPreviewEmp && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 640 }}>
            <button className="modal-close-btn" onClick={() => setSessionPreviewEmp(null)}>×</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FF7A00', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem' }}>
                {sessionPreviewEmp.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  Dashboard Session: {sessionPreviewEmp.name}
                </h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--ink-dim)' }}>
                  {sessionPreviewEmp.role} · {sessionPreviewEmp.email}
                </div>
              </div>
            </div>

            <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid var(--panel-line)', marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.92rem', marginBottom: 12, color: 'var(--ink)' }}>Live Session Telemetry</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--ink-dim)' }}>Current Status: </span>
                  <strong>
                    {sessionPreviewEmp.isOnline ? (
                      sessionPreviewEmp.onBreak ? '🟡 On Break' : '🟢 Online & Working'
                    ) : '⚪ Offline'}
                  </strong>
                </div>
                <div>
                  <span style={{ color: 'var(--ink-dim)' }}>Account Status: </span>
                  <strong>{sessionPreviewEmp.isActive !== false ? '✅ Active' : '🔴 Deactivated'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--ink-dim)' }}>Today's Live Timer: </span>
                  <strong style={{ fontFamily: 'monospace' }}>
                    {Math.floor((sessionPreviewEmp.timerSeconds || 0) / 3600)} Hr {Math.floor(((sessionPreviewEmp.timerSeconds || 0) % 3600) / 60)} Min
                  </strong>
                </div>
                <div>
                  <span style={{ color: 'var(--ink-dim)' }}>First Login: </span>
                  <strong>{sessionPreviewEmp.firstLogin || 'Not logged in today'}</strong>
                </div>
              </div>
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 10 }}>Assigned Tasks in this Session:</h4>
            <div style={{ maxHeight: 180, overflowY: 'auto', marginBottom: 20 }}>
              {tasks.filter((t) => t.assignedTo === sessionPreviewEmp.name).map((t) => (
                <div key={t.id} style={{ padding: '8px 12px', background: '#FFF', border: '1px solid var(--panel-line)', borderRadius: 6, marginBottom: 6, fontSize: '0.84rem' }}>
                  <div className="flex-between">
                    <strong>{t.title}</strong>
                    <span className="badge badge-scheduled">{t.status}</span>
                  </div>
                  {t.remarks && (
                    <div style={{ fontSize: '0.78rem', color: '#B45309', marginTop: 4 }}>
                      Remarks: {t.remarks}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-orange"
                onClick={() => handleOpenEmployeeDashboard(sessionPreviewEmp)}
              >
                Launch Dashboard as {sessionPreviewEmp.name} →
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setSessionPreviewEmp(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
