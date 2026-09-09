import { useState, useEffect, useRef } from 'react';
import { dataStore } from '../../lib/dataStore';
import { processAndCompressSheet, downloadAttachment } from '../../lib/sheetCompressor';

const initialTaskForm = {
  title: '',
  description: '',
  assignedTo: 'Kanika Aggarwal',
  priority: 'High',
  category: 'Lead Follow-up',
  deadline: 'Today, 06:00 PM',
};

export default function AssignTasks() {
  const [tasks, setTasks] = useState(dataStore.getTasks());
  const [employees, setEmployees] = useState(dataStore.getEmployees());
  const [form, setForm] = useState(initialTaskForm);
  const [filterEmp, setFilterEmp] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [statusMsg, setStatusMsg] = useState(null);

  // XLS Sheet compression state (Optional)
  const [attachment, setAttachment] = useState(null);
  const [compressing, setCompressing] = useState(false);
  const [previewTaskId, setPreviewTaskId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return dataStore.subscribe((data) => {
      setTasks(data.tasks);
      setEmployees(data.employees);
    });
  }, []);

  function updateForm(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressing(true);
    try {
      const compressedObj = await processAndCompressSheet(file);
      setAttachment(compressedObj);
    } catch (err) {
      console.error('Sheet compression failed', err);
      alert('Could not compress spreadsheet. Please try another file.');
    } finally {
      setCompressing(false);
    }
  }

  function removeAttachment() {
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleAssign(e) {
    e.preventDefault();
    if (!form.title.trim()) return;

    const empObj = employees.find((emp) => emp.name === form.assignedTo);
    dataStore.addTask({
      ...form,
      employeeId: empObj ? empObj.id : 'emp-1',
      attachment: attachment || null, // Optional compressed sheet
    });

    setStatusMsg(`✅ Task successfully assigned to ${form.assignedTo} ${attachment ? 'with attached compressed spreadsheet' : ''}`);
    setForm(initialTaskForm);
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setTimeout(() => setStatusMsg(null), 4000);
  }

  function handleStatusChange(taskId, newStatus) {
    dataStore.updateTask(taskId, { status: newStatus });
  }

  function handleDelete(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
      dataStore.deleteTask(taskId);
    }
  }

  const filteredTasks = tasks.filter((t) => {
    const matchesEmp = filterEmp === 'All' || t.assignedTo === filterEmp;
    const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
    return matchesSearchOrFilter(t);
  });

  function matchesSearchOrFilter(t) {
    const matchesEmp = filterEmp === 'All' || t.assignedTo === filterEmp;
    const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
    return matchesEmp && matchesStatus;
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 24 }}>
        <div>
          <h1>Task Assignment & Tracking Center</h1>
          <p style={{ marginTop: 4 }}>
            Assign duties, client spreadsheets, and lead follow-ups to employees and track execution remarks.
          </p>
        </div>
      </div>

      {statusMsg && (
        <div className="status-msg status-ok" style={{ marginBottom: 20 }}>
          {statusMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 28, alignItems: 'start' }}>
        {/* CREATE TASK FORM */}
        <form onSubmit={handleAssign} className="panel-card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 16 }}>Assign New Task</h3>

          <div className="field">
            <label>Task Title *</label>
            <input
              required
              placeholder="e.g. Call back Vikram Malhotra regarding SEO proposal"
              value={form.title}
              onChange={(e) => updateForm('title', e.target.value)}
            />
          </div>

          <div className="field">
            <label>Instructions / Description *</label>
            <textarea
              required
              placeholder="Detail the action items, customer expectations, links or remarks needed..."
              value={form.description}
              onChange={(e) => updateForm('description', e.target.value)}
              style={{ minHeight: 90 }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="field">
              <label>Assign To Employee *</label>
              <select
                value={form.assignedTo}
                onChange={(e) => updateForm('assignedTo', e.target.value)}
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.name}>
                    {emp.name} ({emp.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Priority *</label>
              <select
                value={form.priority}
                onChange={(e) => updateForm('priority', e.target.value)}
              >
                <option value="High">🔴 High Priority</option>
                <option value="Medium">🟡 Medium Priority</option>
                <option value="Low">🔵 Normal Priority</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="field">
              <label>Category</label>
              <select
                value={form.category}
                onChange={(e) => updateForm('category', e.target.value)}
              >
                <option>Lead Follow-up</option>
                <option>PPC Campaign</option>
                <option>SEO Audit</option>
                <option>Web Dev Task</option>
                <option>Client Meeting</option>
                <option>Cold Outreach</option>
              </select>
            </div>

            <div className="field">
              <label>Deadline / Due Date</label>
              <input
                placeholder="e.g. Today 05:00 PM"
                value={form.deadline}
                onChange={(e) => updateForm('deadline', e.target.value)}
              />
            </div>
          </div>

          {/* XLS SPREADSHEET UPLOAD FIELD (OPTIONAL, LOW-DATA COMPRESSED) */}
          <div className="field" style={{ marginTop: 4 }}>
            <div className="flex-between" style={{ marginBottom: 4 }}>
              <label style={{ fontSize: '0.86rem', fontWeight: 600 }}>
                Attach Spreadsheet Sheet (Optional)
              </label>
              <span style={{ fontSize: '0.74rem', color: '#10B981', fontWeight: 600 }}>
                ⚡ Auto-compressed for low data
              </span>
            </div>

            {!attachment ? (
              <div
                style={{
                  border: '2px dashed var(--panel-line)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px',
                  textAlign: 'center',
                  background: '#F8FAFC',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s',
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>📊</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>
                  {compressing ? 'Compressing sheet data...' : 'Click to select .xlsx, .xls, or .csv sheet'}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--ink-dim)', marginTop: 2 }}>
                  Not required • Automatically compressed into low data payload
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: '12px 14px',
                  background: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <div className="flex-between">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '1.4rem' }}>📊</span>
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: '#065F46' }}>
                        {attachment.fileName}
                      </strong>
                      <div style={{ fontSize: '0.76rem', color: '#047857' }}>
                        Compressed: {attachment.compressedSizeText} ({attachment.compressionRatioText}) · Original: {attachment.originalSizeText}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeAttachment}
                    className="icon-btn"
                    style={{ color: '#EF4444', borderColor: '#FECACA', background: '#FFF' }}
                    title="Remove attached sheet"
                  >
                    Remove ×
                  </button>
                </div>
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}>
            + Assign Task to Employee
          </button>
        </form>

        {/* TASK LIST & MONITORING */}
        <div>
          {/* FILTER BAR */}
          <div className="panel-card" style={{ padding: '16px 20px', marginBottom: 20 }}>
            <div className="flex-between">
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink-dim)' }}>Filter by:</span>
                <select
                  className="filter-select"
                  value={filterEmp}
                  onChange={(e) => setFilterEmp(e.target.value)}
                >
                  <option value="All">All Employees</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.name}>{emp.name}</option>
                  ))}
                </select>

                <select
                  className="filter-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink-dim)' }}>
                Showing {filteredTasks.length} tasks
              </span>
            </div>
          </div>

          {/* TASKS LIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredTasks.map((t) => (
              <div
                key={t.id}
                className="panel-card"
                style={{
                  borderLeft: `4px solid ${t.priority === 'High' ? '#DC2626' : t.priority === 'Medium' ? '#D97706' : '#2563EB'}`,
                }}
              >
                <div className="flex-between">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span
                      className={`badge ${
                        t.status === 'Completed' ? 'badge-closed' :
                        t.status === 'In Progress' ? 'badge-contacted' : 'badge-new'
                      }`}
                    >
                      {t.status}
                    </span>
                    <span className="tag-pill">{t.category}</span>
                    <span className={t.priority === 'High' ? 'priority-high' : 'priority-medium'} style={{ fontSize: '0.8rem' }}>
                      {t.priority}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <select
                      value={t.status}
                      onChange={(e) => handleStatusChange(t.id, e.target.value)}
                      style={{ fontSize: '0.78rem', padding: '4px 8px', borderRadius: 4, border: '1px solid var(--panel-line)' }}
                    >
                      <option value="Pending">Mark Pending</option>
                      <option value="In Progress">Mark In Progress</option>
                      <option value="Completed">Mark Completed</option>
                    </select>
                    <button className="icon-btn" onClick={() => handleDelete(t.id)} style={{ color: '#EF4444', padding: '4px 8px' }}>
                      🗑️
                    </button>
                  </div>
                </div>

                <h4 style={{ fontSize: '1.08rem', fontWeight: 700, margin: '10px 0 6px' }}>{t.title}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--ink-dim)', lineHeight: 1.5 }}>{t.description}</p>

                {/* ATTACHED SPREADSHEET (IF ANY) */}
                {t.attachment && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: '10px 14px',
                      background: '#F0FDF4',
                      border: '1px solid #BBF7D0',
                      borderRadius: 6,
                    }}
                  >
                    <div className="flex-between">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '1.2rem' }}>📊</span>
                        <div>
                          <strong style={{ fontSize: '0.85rem', color: '#166534' }}>
                            {t.attachment.fileName}
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: '#15803D', marginLeft: 8 }}>
                            ({t.attachment.compressedSizeText} · {t.attachment.compressionRatioText})
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 8 }}>
                        {t.attachment.previewRows?.length > 0 && (
                          <button
                            type="button"
                            className="icon-btn"
                            style={{ fontSize: '0.76rem', padding: '4px 8px' }}
                            onClick={() => setPreviewTaskId(previewTaskId === t.id ? null : t.id)}
                          >
                            {previewTaskId === t.id ? 'Hide Preview' : 'Preview Rows'}
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-sm btn-ghost"
                          style={{ fontSize: '0.76rem', padding: '4px 10px', background: '#FFF' }}
                          onClick={() => downloadAttachment(t.attachment)}
                        >
                          ⬇️ Download Sheet
                        </button>
                      </div>
                    </div>

                    {/* MINI PREVIEW TABLE (IF CLICKED) */}
                    {previewTaskId === t.id && t.attachment.previewRows?.length > 0 && (
                      <div style={{ marginTop: 10, background: '#FFF', border: '1px solid #DCFCE7', borderRadius: 6, overflowX: 'auto' }}>
                        <table style={{ width: '100%', fontSize: '0.78rem', borderCollapse: 'collapse' }}>
                          <tbody>
                            {t.attachment.previewRows.map((row, rIdx) => (
                              <tr key={rIdx} style={{ background: rIdx === 0 ? '#F0FDF4' : 'transparent', fontWeight: rIdx === 0 ? 700 : 400 }}>
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} style={{ padding: '6px 10px', borderBottom: '1px solid #E2E8F0' }}>
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* EMPLOYEE REMARKS SECTION */}
                {t.remarks ? (
                  <div style={{ marginTop: 12, padding: '10px 14px', background: '#FEF3C7', borderRadius: 6, border: '1px solid #FDE68A', fontSize: '0.85rem' }}>
                    <strong style={{ color: '#92400E' }}>Employee Remarks:</strong>
                    <div style={{ color: '#78350F', marginTop: 2 }}>{t.remarks}</div>
                  </div>
                ) : (
                  <div style={{ marginTop: 10, fontSize: '0.8rem', color: '#94A3B8', fontStyle: 'italic' }}>
                    No completion remarks submitted by employee yet.
                  </div>
                )}

                <div className="flex-between" style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--panel-line)', fontSize: '0.82rem', color: 'var(--ink-dim)' }}>
                  <span>Assigned to: <strong style={{ color: 'var(--ink)' }}>{t.assignedTo}</strong></span>
                  <span>Due: <strong>{t.deadline}</strong></span>
                </div>
              </div>
            ))}

            {filteredTasks.length === 0 && (
              <div className="panel-card" style={{ textAlign: 'center', padding: '40px' }}>
                <p>No tasks match your selected filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
