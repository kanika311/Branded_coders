import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataStore } from '../../lib/dataStore';
import { downloadAttachment, processAndCompressSheet } from '../../lib/sheetCompressor';

export default function EmployeeTasks() {
  const { employee } = useAuth();
  const [tasks, setTasks] = useState(dataStore.getTasks());
  const [filter, setFilter] = useState('All');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [remarkInput, setRemarkInput] = useState('');
  const [statusMsg, setStatusMsg] = useState(null);

  // Optional XLS attachment on remark
  const [remarkAttachment, setRemarkAttachment] = useState(null);
  const [compressing, setCompressing] = useState(false);
  const remarkFileRef = useRef(null);

  useEffect(() => {
    return dataStore.subscribe((data) => {
      setTasks(data.tasks);
    });
  }, []);

  const currentEmpName = employee?.name || 'Kanika Aggarwal';
  const myTasks = tasks.filter((t) => t.assignedTo === currentEmpName);

  const filteredTasks = myTasks.filter((t) => {
    if (filter === 'All') return true;
    return t.status === filter;
  });

  function handleStatusChange(taskId, newStatus) {
    dataStore.updateTask(taskId, { status: newStatus });
    setStatusMsg(`Task marked as ${newStatus}`);
    setTimeout(() => setStatusMsg(null), 3000);
  }

  function openRemarkEditor(task) {
    setEditingTaskId(task.id);
    setRemarkInput(task.remarks || '');
    setRemarkAttachment(task.remarkAttachment || null);
  }

  async function handleRemarkFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCompressing(true);
    try {
      const comp = await processAndCompressSheet(file);
      setRemarkAttachment(comp);
    } catch (err) {
      console.error(err);
      alert('Could not compress spreadsheet.');
    } finally {
      setCompressing(false);
    }
  }

  function saveRemark(taskId) {
    dataStore.updateTask(taskId, {
      remarks: remarkInput,
      remarkAttachment: remarkAttachment || null,
      status: 'Completed',
    });
    setEditingTaskId(null);
    setRemarkAttachment(null);
    setStatusMsg('Remarks and optional sheet submitted to Admin successfully!');
    setTimeout(() => setStatusMsg(null), 3000);
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 24 }}>
        <div>
          <h1>My Assigned Tasks</h1>
          <p style={{ marginTop: 4 }}>
            Tasks assigned to you by the Admin team. View client spreadsheets, update status, and submit completion remarks.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {['All', 'Pending', 'In Progress', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`btn btn-sm ${filter === tab ? 'btn-orange' : 'btn-ghost'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {statusMsg && (
        <div className="status-msg status-ok" style={{ marginBottom: 20 }}>
          ✅ {statusMsg}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
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
                  {t.priority} Priority
                </span>
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {t.status !== 'In Progress' && t.status !== 'Completed' && (
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => handleStatusChange(t.id, 'In Progress')}
                  >
                    Start Working
                  </button>
                )}
                {t.status !== 'Completed' && (
                  <button
                    className="btn btn-sm btn-orange"
                    onClick={() => openRemarkEditor(t)}
                  >
                    Mark Done & Add Remarks
                  </button>
                )}
              </div>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '12px 0 6px' }}>{t.title}</h3>
            <p style={{ fontSize: '0.94rem', color: 'var(--ink)', lineHeight: 1.6 }}>{t.description}</p>

            {/* SPREADSHEET ATTACHED BY ADMIN */}
            {t.attachment && (
              <div
                style={{
                  marginTop: 12,
                  padding: '12px 14px',
                  background: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: 8,
                }}
              >
                <div className="flex-between">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '1.4rem' }}>📊</span>
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: '#166534' }}>
                        Attached Client Sheet: {t.attachment.fileName}
                      </strong>
                      <div style={{ fontSize: '0.76rem', color: '#15803D' }}>
                        Compressed low-data ({t.attachment.compressedSizeText} · {t.attachment.compressionRatioText})
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-sm btn-ghost"
                    style={{ background: '#FFF', fontSize: '0.8rem' }}
                    onClick={() => downloadAttachment(t.attachment)}
                  >
                    ⬇️ Download & Open Sheet
                  </button>
                </div>
              </div>
            )}

            {/* REMARKS DISPLAY OR EDITOR */}
            {editingTaskId === t.id ? (
              <div style={{ marginTop: 14, padding: 16, background: '#F8FAFC', borderRadius: 8, border: '1px solid var(--panel-line)' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)' }}>
                  Submit Completion Remarks for Admin:
                </label>
                <textarea
                  placeholder="e.g. Spoke with client, reviewed attached lead numbers, schedule confirmed for Friday..."
                  value={remarkInput}
                  onChange={(e) => setRemarkInput(e.target.value)}
                  style={{ width: '100%', minHeight: 70, marginTop: 6, padding: 10, borderRadius: 6, border: '1px solid var(--panel-line)' }}
                />

                {/* OPTIONAL ATTACH SHEET WITH REMARK */}
                <div style={{ marginTop: 10 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-dim)' }}>
                    Attach Updated Sheet (Optional):
                  </span>
                  {!remarkAttachment ? (
                    <div style={{ marginTop: 4 }}>
                      <input
                        ref={remarkFileRef}
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        onChange={handleRemarkFile}
                        style={{ fontSize: '0.8rem' }}
                      />
                      {compressing && <span style={{ fontSize: '0.78rem', color: '#10B981', marginLeft: 8 }}>Compressing...</span>}
                    </div>
                  ) : (
                    <div style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 10px', background: '#ECFDF5', borderRadius: 6, fontSize: '0.8rem', color: '#065F46' }}>
                      <span>📊 {remarkAttachment.fileName} ({remarkAttachment.compressedSizeText})</span>
                      <button
                        type="button"
                        onClick={() => setRemarkAttachment(null)}
                        style={{ border: 'none', background: 'transparent', color: '#EF4444', cursor: 'pointer', fontWeight: 700 }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                  <button className="btn btn-sm btn-orange" onClick={() => saveRemark(t.id)}>
                    Save Remarks & Complete Task
                  </button>
                  <button className="btn btn-sm btn-ghost" onClick={() => setEditingTaskId(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : t.remarks ? (
              <div style={{ marginTop: 12, padding: '10px 14px', background: '#FEF3C7', borderRadius: 6, border: '1px solid #FDE68A', fontSize: '0.85rem' }}>
                <div className="flex-between">
                  <strong style={{ color: '#92400E' }}>Your Submitted Remarks:</strong>
                  <button
                    onClick={() => openRemarkEditor(t)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
                  >
                    Edit
                  </button>
                </div>
                <div style={{ color: '#78350F', marginTop: 3 }}>{t.remarks}</div>
                {t.remarkAttachment && (
                  <div style={{ marginTop: 6, fontSize: '0.78rem' }}>
                    <button
                      onClick={() => downloadAttachment(t.remarkAttachment)}
                      className="icon-btn"
                      style={{ fontSize: '0.74rem', padding: '2px 8px' }}
                    >
                      📊 Download {t.remarkAttachment.fileName}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ marginTop: 10 }}>
                <button
                  onClick={() => openRemarkEditor(t)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--orange)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, padding: 0 }}
                >
                  + Add task remarks for Admin
                </button>
              </div>
            )}

            <div className="flex-between" style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--panel-line)', fontSize: '0.82rem', color: 'var(--ink-dim)' }}>
              <span>Assigned By: <strong>{t.assignedBy || 'Admin'}</strong></span>
              <span>Deadline: <strong style={{ color: '#DC2626' }}>{t.deadline}</strong></span>
              <span>Created: {t.createdAt}</span>
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="panel-card" style={{ textAlign: 'center', padding: '48px' }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>🎉</div>
            <h3>No tasks in this category</h3>
            <p style={{ marginTop: 4 }}>You have handled all tasks under this filter!</p>
          </div>
        )}
      </div>
    </div>
  );
}
