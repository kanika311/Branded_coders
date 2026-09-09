import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataStore } from '../../lib/dataStore';

const emptyLead = {
  name: '',
  phone: '',
  email: '',
  company: '',
  leadType: 'Cold Call',
  service: 'Digital Marketing & Growth',
  status: 'New',
  budget: '',
  notes: '',
};

export default function EmployeeLeads() {
  const { employee } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [leads, setLeads] = useState(dataStore.getLeads());
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState(emptyLead);
  const [statusMsg, setStatusMsg] = useState(null);

  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setShowAddModal(true);
      searchParams.delete('add');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    return dataStore.subscribe((data) => {
      setLeads(data.leads);
    });
  }, []);

  function handleAddLead(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;

    dataStore.addLead({
      ...form,
      assignedTo: employee?.name || 'Kanika Aggarwal',
    });

    setStatusMsg(`✅ Lead "${form.name}" added successfully!`);
    setForm(emptyLead);
    setShowAddModal(false);
    setTimeout(() => setStatusMsg(null), 4000);
  }

  function handleStatusChange(leadId, newStatus) {
    dataStore.updateLead(leadId, {
      status: newStatus,
      lastContacted: `Updated ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    });
  }

  function handleAddRemark(leadId) {
    const remark = prompt('Enter follow-up conversation notes for this contact:');
    if (remark) {
      const currentLead = leads.find((l) => l.id === leadId);
      const updatedNotes = currentLead.notes ? `${currentLead.notes} | ${remark}` : remark;
      dataStore.updateLead(leadId, {
        notes: updatedNotes,
        lastContacted: `Note added at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      });
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
      {/* HEADER */}
      <div className="flex-between" style={{ marginBottom: 24 }}>
        <div>
          <h1>Contact Leads & Pipeline</h1>
          <p style={{ marginTop: 4 }}>
            Record prospective clients, log contact details, type of lead, and track conversation progress.
          </p>
        </div>
        <button
          className="btn btn-orange"
          onClick={() => setShowAddModal(true)}
          style={{ padding: '10px 20px', fontSize: '0.94rem' }}
        >
          + Add New Lead
        </button>
      </div>

      {statusMsg && (
        <div className="status-msg status-ok" style={{ marginBottom: 20 }}>
          {statusMsg}
        </div>
      )}

      {/* FILTER & SEARCH BAR */}
      <div className="panel-card" style={{ padding: '16px 20px', marginBottom: 24 }}>
        <div className="actions-bar" style={{ margin: 0 }}>
          <input
            className="search-input"
            placeholder="🔍 Search by name, phone number, company..."
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
                <th>Contact Person & Company</th>
                <th>Phone Number (Direct Action)</th>
                <th>Type of Lead</th>
                <th>Service Required</th>
                <th>Status (1-Click Update)</th>
                <th>Follow-up Notes / Details</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((l) => (
                <tr key={l.id}>
                  <td>
                    <strong>{l.name}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ink-dim)' }}>
                      {l.company || 'Individual Client'}
                    </div>
                    {l.email && (
                      <div style={{ fontSize: '0.76rem', color: 'var(--accent)' }}>
                        <a href={`mailto:${l.email}`}>{l.email}</a>
                      </div>
                    )}
                  </td>

                  <td>
                    <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink)' }}>
                      {l.phone}
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                      <a
                        href={`https://wa.me/${l.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="badge"
                        style={{ background: '#ECFDF5', color: '#059669', fontSize: '0.72rem', textDecoration: 'none' }}
                        title="Open WhatsApp Chat"
                      >
                        💬 WhatsApp
                      </a>
                      <a
                        href={`tel:${l.phone}`}
                        className="badge"
                        style={{ background: '#EFF6FF', color: '#1D4ED8', fontSize: '0.72rem', textDecoration: 'none' }}
                        title="Click to Call"
                      >
                        📞 Call
                      </a>
                    </div>
                  </td>

                  <td>
                    <span className="tag-pill" style={{ background: '#FFF7ED', color: '#C2410C', borderColor: '#FFEDD5' }}>
                      {l.leadType}
                    </span>
                  </td>

                  <td>
                    <div style={{ fontSize: '0.86rem', fontWeight: 600 }}>{l.service}</div>
                    {l.budget && (
                      <div style={{ fontSize: '0.76rem', color: 'var(--emerald)', fontWeight: 600 }}>
                        {l.budget}
                      </div>
                    )}
                  </td>

                  <td>
                    <select
                      value={l.status}
                      onChange={(e) => handleStatusChange(l.id, e.target.value)}
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        padding: '6px 8px',
                        borderRadius: 6,
                        border: '1px solid var(--panel-line)',
                        background:
                          l.status === 'New' ? '#FEF3C7' :
                          l.status === 'Contacted' ? '#EFF6FF' :
                          l.status === 'Demo scheduled' ? '#F5F3FF' :
                          l.status === 'Active' ? '#ECFDF5' :
                          l.status === 'Closed' ? '#F0FDF4' : '#F1F5F9',
                        color:
                          l.status === 'New' ? '#B45309' :
                          l.status === 'Contacted' ? '#1D4ED8' :
                          l.status === 'Demo scheduled' ? '#6D28D9' :
                          l.status === 'Active' ? '#047857' :
                          l.status === 'Closed' ? '#15803D' : '#475569',
                      }}
                    >
                      <option value="New">🟡 New</option>
                      <option value="Contacted">🔵 Contacted</option>
                      <option value="Demo scheduled">🟣 Demo Scheduled</option>
                      <option value="Active">🟢 Active / Negotiating</option>
                      <option value="No response">⚪ No Response</option>
                      <option value="Closed">🔴 Closed / Won</option>
                    </select>
                  </td>

                  <td style={{ maxWidth: 260 }}>
                    <div style={{ fontSize: '0.84rem', color: 'var(--ink)', lineHeight: 1.4 }}>
                      {l.notes || 'No discussion notes yet.'}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--ink-dim)', marginTop: 4 }}>
                      {l.lastContacted}
                    </div>
                  </td>

                  <td>
                    <button
                      className="icon-btn"
                      onClick={() => handleAddRemark(l.id)}
                      title="Add follow-up note"
                    >
                      + Note
                    </button>
                  </td>
                </tr>
              ))}

              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-dim)' }}>
                    No leads found. Click "+ Add New Lead" above to record one!
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
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 6 }}>Add New Contact Lead</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-dim)', marginBottom: 20 }}>
              Enter prospective client contact details, choose the lead type, and log initial discussion notes.
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
                    placeholder="vikram@malhotratech.in"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Company Name</label>
                  <input
                    placeholder="e.g. Malhotra Tech"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="field">
                  <label>Type of Lead *</label>
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
                  <label>Service Needed *</label>
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
                  <label>Lead Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="New">🟡 New</option>
                    <option value="Contacted">🔵 Contacted</option>
                    <option value="Demo scheduled">🟣 Demo Scheduled</option>
                    <option value="Active">🟢 Active / In Discussion</option>
                    <option value="No response">⚪ No Response</option>
                    <option value="Closed">🔴 Closed / Won</option>
                  </select>
                </div>
                <div className="field">
                  <label>Budget / Value Estimate</label>
                  <input
                    placeholder="e.g. ₹50,000 / mo or ₹1.5 Lakhs"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  />
                </div>
              </div>

              <div className="field">
                <label>Discussion Details & Notes</label>
                <textarea
                  placeholder="Key conversation points, client goals, follow-up date..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  style={{ minHeight: 80 }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button type="submit" className="btn btn-orange" style={{ flex: 1 }}>
                  Save Lead Record
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
