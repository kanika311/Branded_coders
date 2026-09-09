import { useState, useEffect } from 'react';
import { dataStore } from '../../lib/dataStore';

const emptyLead = {
  name: '',
  phone: '',
  email: '',
  company: '',
  leadType: 'Digital Marketing Lead',
  service: 'Digital Marketing & Growth',
  status: 'New',
  budget: '',
  notes: '',
  assignedTo: 'Kanika Aggarwal',
};

export default function AdminLeads() {
  const [leads, setLeads] = useState(dataStore.getLeads());
  const [employees, setEmployees] = useState(dataStore.getEmployees());
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState(emptyLead);

  useEffect(() => {
    return dataStore.subscribe((data) => {
      setLeads(data.leads);
      setEmployees(data.employees);
    });
  }, []);

  function handleAddLead(e) {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    dataStore.addLead(form);
    setForm(emptyLead);
    setShowAddModal(false);
  }

  function handleStatusChange(leadId, newStatus) {
    dataStore.updateLead(leadId, { status: newStatus });
  }

  function handleAssigneeChange(leadId, newAssignee) {
    dataStore.updateLead(leadId, { assignedTo: newAssignee });
  }

  function handleDeleteLead(leadId) {
    if (confirm('Delete this lead record?')) {
      dataStore.deleteLead(leadId);
    }
  }

  const filteredLeads = leads.filter((l) => {
    const term = search.toLowerCase();
    const matchesSearch =
      l.name.toLowerCase().includes(term) ||
      l.phone.toLowerCase().includes(term) ||
      (l.company && l.company.toLowerCase().includes(term)) ||
      (l.email && l.email.toLowerCase().includes(term));
    const matchesType = typeFilter === 'All' || l.leadType === typeFilter;
    const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const leadTypes = ['All', 'Digital Marketing Lead', 'Website Inbound', 'Cold Call', 'Referral', 'Instagram Campaign', 'WhatsApp Inquiry'];
  const leadStatuses = ['All', 'New', 'Contacted', 'Demo scheduled', 'Active', 'No response', 'Closed'];

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 24 }}>
        <div>
          <h1>Central Lead Management</h1>
          <p style={{ marginTop: 4 }}>Company-wide repository of inbound inquiries, cold contacts, and digital marketing leads.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          + Add New Lead
        </button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="panel-card" style={{ padding: '18px 20px', marginBottom: 24 }}>
        <div className="actions-bar" style={{ margin: 0 }}>
          <input
            className="search-input"
            placeholder="🔍 Search leads by contact name, phone, company, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {leadTypes.map((t) => (
              <option key={t} value={t}>{t === 'All' ? 'All Lead Types' : t}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {leadStatuses.map((s) => (
              <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* LEADS TABLE */}
      <div className="panel-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Lead Contact & Company</th>
                <th>Phone & Reach Details</th>
                <th>Type of Lead</th>
                <th>Service Required</th>
                <th>Status</th>
                <th>Assigned Employee</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((l) => (
                <tr key={l.id}>
                  <td>
                    <strong>{l.name}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ink-dim)' }}>
                      {l.company || 'Direct Client'} · {l.email}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--ink)' }}>
                      {l.phone}
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                      <a
                        href={`https://wa.me/${l.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="badge"
                        style={{ background: '#ECFDF5', color: '#059669', fontSize: '0.7rem' }}
                      >
                        WhatsApp 💬
                      </a>
                      <a
                        href={`tel:${l.phone}`}
                        className="badge"
                        style={{ background: '#EFF6FF', color: '#1D4ED8', fontSize: '0.7rem' }}
                      >
                        Call 📞
                      </a>
                    </div>
                  </td>
                  <td>
                    <span className="tag-pill">{l.leadType}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{l.service}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--ink-dim)' }}>Budget: {l.budget}</div>
                  </td>
                  <td>
                    <select
                      value={l.status}
                      onChange={(e) => handleStatusChange(l.id, e.target.value)}
                      style={{ fontSize: '0.8rem', padding: '4px 8px', borderRadius: 4, border: '1px solid var(--panel-line)' }}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Demo scheduled">Demo Scheduled</option>
                      <option value="Active">Active</option>
                      <option value="No response">No Response</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={l.assignedTo}
                      onChange={(e) => handleAssigneeChange(l.id, e.target.value)}
                      style={{ fontSize: '0.8rem', padding: '4px 8px', borderRadius: 4, border: '1px solid var(--panel-line)' }}
                    >
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.name}>{emp.name}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      className="icon-btn"
                      onClick={() => handleDeleteLead(l.id)}
                      style={{ color: '#EF4444' }}
                      title="Delete lead"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}

              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--ink-dim)' }}>
                    No leads found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD LEAD MODAL */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>×</button>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>Add New Lead</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-dim)', marginBottom: 20 }}>
              Enter contact information, lead category, and assign to an employee.
            </p>

            <form onSubmit={handleAddLead}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="field">
                  <label>Contact Person Name *</label>
                  <input
                    required
                    placeholder="e.g. Vikram Malhotra"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Phone Number *</label>
                  <input
                    required
                    placeholder="e.g. +91 98112 34567"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="vikram@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Company / Organization</label>
                  <input
                    placeholder="Malhotra Enterprises"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="field">
                  <label>Type of Lead</label>
                  <select
                    value={form.leadType}
                    onChange={(e) => setForm({ ...form, leadType: e.target.value })}
                  >
                    <option>Digital Marketing Lead</option>
                    <option>Website Inbound</option>
                    <option>Cold Call</option>
                    <option>Referral</option>
                    <option>Instagram Campaign</option>
                    <option>WhatsApp Inquiry</option>
                    <option>LinkedIn Outreach</option>
                  </select>
                </div>
                <div className="field">
                  <label>Service Needed</label>
                  <select
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                  >
                    <option>Digital Marketing & Growth</option>
                    <option>Website Design & Development</option>
                    <option>Custom Headless & MERN CMS</option>
                    <option>Dashboards & Operational Tools</option>
                    <option>Web & Mobile Applications</option>
                    <option>AI-Integrated Platforms</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="field">
                  <label>Assign To Employee</label>
                  <select
                    value={form.assignedTo}
                    onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.name}>{emp.name}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Budget Range</label>
                  <input
                    placeholder="e.g. ₹50,000 / mo"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  />
                </div>
              </div>

              <div className="field">
                <label>Discussion Notes / Details</label>
                <textarea
                  placeholder="Key pain points, client goals, follow-up timeline..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Save & Add Lead
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
