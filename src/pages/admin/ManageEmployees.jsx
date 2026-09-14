import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataStore } from '../../lib/dataStore';
import { processAndCompressSheet, downloadAttachment } from '../../lib/sheetCompressor';

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

const emptyTeamMemberForm = {
  name: '',
  role: '',
  location: 'Ludhiana, Punjab',
  bio: '',
  image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  expertise: 'Full-Stack JavaScript, Next.js & React, System Architecture',
};

const initialTaskForm = {
  title: '',
  description: '',
  assignedTo: 'Kanika Aggarwal',
  priority: 'High',
  category: 'Lead Follow-up',
  deadline: 'Today, 06:00 PM',
};

const AVATAR_PRESETS = [
  { label: 'Architect (Male)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
  { label: 'Growth Strategist (Female)', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80' },
  { label: 'Engineer (Modern)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
  { label: 'Lead Specialist (Studio)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80' },
];

function compressImageFile(file, maxWidth = 480, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ManageEmployees() {
  const { impersonateEmployee } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Tab: 'team' (Website CMS) | 'tasks' (Assign Tasks) | 'staff' (Internal Directory)
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(
    tabFromUrl === 'tasks' ? 'tasks' : tabFromUrl === 'staff' ? 'staff' : 'team'
  );

  // Synchronize tab with searchParams
  function switchTab(tabKey) {
    setActiveTab(tabKey);
    setSearchParams({ tab: tabKey });
  }

  // Reactive data from CentralDataStore
  const [employees, setEmployees] = useState(dataStore.getEmployees());
  const [teamMembers, setTeamMembers] = useState(dataStore.getTeamMembers());
  const [tasks, setTasks] = useState(dataStore.getTasks());
  const [leads, setLeads] = useState(dataStore.getLeads());
  const [siteContent, setSiteContent] = useState(dataStore.getSiteContent());
  const [statusMsg, setStatusMsg] = useState(null);

  // Profile photo upload state
  const teamPhotoInputRef = useRef(null);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  async function handleTeamPhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    setIsPhotoUploading(true);
    try {
      const dataUrl = await compressImageFile(file, 480, 0.85);
      setTeamForm((prev) => ({ ...prev, image: dataUrl }));
      setStatusMsg('📷 Photo uploaded & optimized successfully!');
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err) {
      console.error('Image upload failed', err);
      alert('Could not process image. Please try another image file.');
    } finally {
      setIsPhotoUploading(false);
      if (teamPhotoInputRef.current) teamPhotoInputRef.current.value = '';
    }
  }

  // Subscribe to store updates
  useEffect(() => {
    return dataStore.subscribe((data) => {
      if (data.employees) setEmployees(data.employees);
      if (data.teamMembers) setTeamMembers(data.teamMembers);
      if (data.tasks) setTasks(data.tasks);
      if (data.leads) setLeads(data.leads);
      if (data.siteContent) setSiteContent(data.siteContent);
    });
  }, []);

  // Update tab if URL changes
  useEffect(() => {
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  // ==========================================
  // TAB 1: WEBSITE TEAM / LEADERSHIP CMS (CRUD)
  // ==========================================
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState(null);
  const [teamForm, setTeamForm] = useState(emptyTeamMemberForm);
  const [showSectionHeadingModal, setShowSectionHeadingModal] = useState(false);
  const [headingForm, setHeadingForm] = useState({
    teamEyebrow: siteContent?.home?.teamEyebrow || 'Leadership & Accountability',
    teamHeading: siteContent?.home?.teamHeading || 'Direct Access to the Engineers Building Your Product',
    teamSubheading: siteContent?.home?.teamSubheading || 'No non-technical middle managers. You work directly with senior founders and hands-on architects.',
  });

  function openAddTeamModal() {
    setEditingTeamMember(null);
    setTeamForm(emptyTeamMemberForm);
    setShowTeamModal(true);
  }

  function openEditTeamModal(tm) {
    setEditingTeamMember(tm);
    setTeamForm({
      name: tm.name,
      role: tm.role,
      location: tm.location || 'Ludhiana, Punjab',
      bio: tm.bio || '',
      image: tm.image || '',
      expertise: Array.isArray(tm.expertise) ? tm.expertise.join(', ') : tm.expertise || '',
    });
    setShowTeamModal(true);
  }

  function handleSaveTeamMember(e) {
    e.preventDefault();
    if (!teamForm.name.trim() || !teamForm.role.trim()) {
      alert('Please fill out Member Name and Role');
      return;
    }

    if (editingTeamMember) {
      dataStore.updateTeamMember(editingTeamMember.id, teamForm);
      setStatusMsg(`✅ Team member "${teamForm.name}" updated successfully.`);
    } else {
      dataStore.addTeamMember(teamForm);
      setStatusMsg(`✅ New team member "${teamForm.name}" added to website.`);
    }

    setShowTeamModal(false);
    setEditingTeamMember(null);
    setTimeout(() => setStatusMsg(null), 4000);
  }

  function handleDeleteTeamMember(tm) {
    if (confirm(`Are you sure you want to delete ${tm.name} from the website? This will remove the card from the Home page.`)) {
      dataStore.deleteTeamMember(tm.id);
      setStatusMsg(`🗑️ Deleted ${tm.name} from website team.`);
      setTimeout(() => setStatusMsg(null), 3000);
    }
  }

  function handleSaveHeadings(e) {
    e.preventDefault();
    dataStore.updateSiteContent({
      home: {
        ...siteContent.home,
        ...headingForm,
      },
    });
    setShowSectionHeadingModal(false);
    setStatusMsg('✅ Section titles and subheading updated successfully on website.');
    setTimeout(() => setStatusMsg(null), 4000);
  }

  // ==========================================
  // TAB 2: ASSIGN TASKS STATE & LOGIC
  // ==========================================
  const [taskForm, setTaskForm] = useState(initialTaskForm);
  const [filterEmp, setFilterEmp] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [attachment, setAttachment] = useState(null);
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef(null);

  function updateTaskField(field, value) {
    setTaskForm((f) => ({ ...f, [field]: value }));
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

  function handleAssignTask(e) {
    e.preventDefault();
    if (!taskForm.title.trim()) {
      alert('Please fill out task title.');
      return;
    }

    const empObj = employees.find((emp) => emp.name === taskForm.assignedTo);
    dataStore.addTask({
      ...taskForm,
      employeeId: empObj ? empObj.id : 'emp-1',
      attachment: attachment || null,
    });

    setStatusMsg(`✅ Task successfully assigned to ${taskForm.assignedTo} ${attachment ? 'with attached compressed spreadsheet' : ''}`);
    setTaskForm(initialTaskForm);
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setTimeout(() => setStatusMsg(null), 4000);
  }

  function handleStatusChange(taskId, newStatus) {
    dataStore.updateTask(taskId, { status: newStatus });
  }

  function handleDeleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
      dataStore.deleteTask(taskId);
      setStatusMsg('🗑️ Task removed.');
      setTimeout(() => setStatusMsg(null), 3000);
    }
  }

  const filteredTasks = tasks.filter((t) => {
    const matchesEmp = filterEmp === 'All' || t.assignedTo === filterEmp;
    const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
    return matchesEmp && matchesStatus;
  });

  // ==========================================
  // TAB 3: INTERNAL STAFF DIRECTORY STATE & LOGIC
  // ==========================================
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [staffForm, setStaffForm] = useState(emptyEmployeeForm);
  const [sessionPreviewEmp, setSessionPreviewEmp] = useState(null);

  function openAddStaffModal() {
    setEditingStaff(null);
    setStaffForm(emptyEmployeeForm);
    setShowStaffModal(true);
  }

  function openEditStaffModal(emp) {
    setEditingStaff(emp);
    setStaffForm({
      name: emp.name,
      email: emp.email,
      password: emp.password || 'employee123',
      role: emp.role || '',
      phone: emp.phone || '',
      salary: emp.salary || '20000',
      bonusToday: emp.bonusToday || '₹500',
      bonusGoal: emp.bonusGoal || '10 tasks with remarks',
    });
    setShowStaffModal(true);
  }

  function handleSaveStaff(e) {
    e.preventDefault();
    if (!staffForm.name || !staffForm.email) return;

    if (editingStaff) {
      dataStore.updateEmployee(editingStaff.id, staffForm);
      setStatusMsg(`✅ Employee "${staffForm.name}" updated successfully.`);
      setEditingStaff(null);
    } else {
      dataStore.addEmployee(staffForm);
      setStatusMsg(`✅ New employee "${staffForm.name}" added successfully.`);
    }

    setShowStaffModal(false);
    setStaffForm(emptyEmployeeForm);
    setTimeout(() => setStatusMsg(null), 4000);
  }

  function handleToggleStaffActive(emp) {
    dataStore.toggleEmployeeActive(emp.id);
    const nextStatus = emp.isActive === false ? 'Activated' : 'Deactivated';
    setStatusMsg(`Account for ${emp.name} is now ${nextStatus}.`);
    setTimeout(() => setStatusMsg(null), 3000);
  }

  function handleDeleteStaff(emp) {
    if (confirm(`Are you sure you want to delete ${emp.name} from the roster? This cannot be undone.`)) {
      dataStore.deleteEmployee(emp.id);
      setStatusMsg(`Deleted ${emp.name} from employees.`);
      setTimeout(() => setStatusMsg(null), 3000);
    }
  }

  function handleOpenEmployeeDashboard(emp) {
    impersonateEmployee(emp.id);
    window.open('/employee/dashboard', '_blank');
  }

  return (
    <div>
      {/* PAGE HEADER */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
              Team &amp; Activity Hub
            </h1>
            <p style={{ marginTop: 6, color: '#64748B', fontSize: '0.95rem' }}>
              Unified management for public website team CMS, duty task assignment, and employee live sessions.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link
              to="/#team"
              target="_blank"
              className="btn btn-ghost"
              style={{ border: '1px solid #CBD5E1', padding: '8px 16px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600 }}
            >
              🌐 View Live Team on Site
            </Link>
            {activeTab === 'team' && (
              <button className="btn btn-primary" onClick={openAddTeamModal} style={{ padding: '8px 18px', borderRadius: 8, fontSize: '0.88rem', fontWeight: 700 }}>
                + Add Team Member
              </button>
            )}
            {activeTab === 'staff' && (
              <button className="btn btn-primary" onClick={openAddStaffModal} style={{ padding: '8px 18px', borderRadius: 8, fontSize: '0.88rem', fontWeight: 700 }}>
                + Create New Employee
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TOP TAB NAVIGATION BAR */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          background: '#F1F5F9',
          padding: 6,
          borderRadius: 12,
          marginBottom: 26,
          border: '1px solid #E2E8F0',
          overflowX: 'auto',
        }}
      >
        <button
          type="button"
          onClick={() => switchTab('team')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            borderRadius: 8,
            fontSize: '0.9rem',
            fontWeight: 700,
            background: activeTab === 'team' ? '#FFFFFF' : 'transparent',
            color: activeTab === 'team' ? '#2563EB' : '#475569',
            boxShadow: activeTab === 'team' ? '0 2px 8px rgba(15, 23, 42, 0.08)' : 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <span>👥 Website Team CMS</span>
          <span
            style={{
              fontSize: '0.72rem',
              padding: '2px 7px',
              borderRadius: 999,
              background: activeTab === 'team' ? '#EFF6FF' : '#E2E8F0',
              color: activeTab === 'team' ? '#2563EB' : '#64748B',
              fontWeight: 800,
            }}
          >
            {teamMembers.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => switchTab('tasks')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            borderRadius: 8,
            fontSize: '0.9rem',
            fontWeight: 700,
            background: activeTab === 'tasks' ? '#FFFFFF' : 'transparent',
            color: activeTab === 'tasks' ? '#2563EB' : '#475569',
            boxShadow: activeTab === 'tasks' ? '0 2px 8px rgba(15, 23, 42, 0.08)' : 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <span>📋 Assign Tasks</span>
          <span
            style={{
              fontSize: '0.72rem',
              padding: '2px 7px',
              borderRadius: 999,
              background: activeTab === 'tasks' ? '#EFF6FF' : '#E2E8F0',
              color: activeTab === 'tasks' ? '#2563EB' : '#64748B',
              fontWeight: 800,
            }}
          >
            {tasks.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => switchTab('staff')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            borderRadius: 8,
            fontSize: '0.9rem',
            fontWeight: 700,
            background: activeTab === 'staff' ? '#FFFFFF' : 'transparent',
            color: activeTab === 'staff' ? '#2563EB' : '#475569',
            boxShadow: activeTab === 'staff' ? '0 2px 8px rgba(15, 23, 42, 0.08)' : 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <span>⚡ Staff Directory &amp; Sessions</span>
          <span
            style={{
              fontSize: '0.72rem',
              padding: '2px 7px',
              borderRadius: 999,
              background: activeTab === 'staff' ? '#EFF6FF' : '#E2E8F0',
              color: activeTab === 'staff' ? '#2563EB' : '#64748B',
              fontWeight: 800,
            }}
          >
            {employees.length}
          </span>
        </button>
      </div>

      {statusMsg && (
        <div
          style={{
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            color: '#166534',
            padding: '12px 18px',
            borderRadius: 10,
            marginBottom: 20,
            fontSize: '0.9rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{statusMsg}</span>
          <button type="button" onClick={() => setStatusMsg(null)} style={{ background: 'transparent', border: 'none', color: '#166534', cursor: 'pointer', fontWeight: 700 }}>✕</button>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 1: WEBSITE TEAM CMS (Full CRUD matching second screenshot) */}
      {/* ============================================================ */}
      {activeTab === 'team' && (
        <div>
          {/* Section Heading Customizer Bar */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 14,
              padding: '18px 24px',
              marginBottom: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 16,
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {siteContent?.home?.teamEyebrow || 'Leadership & Accountability'}
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginTop: 4, marginBottom: 4 }}>
                {siteContent?.home?.teamHeading || 'Direct Access to the Engineers Building Your Product'}
              </h2>
              <p style={{ fontSize: '0.86rem', color: '#64748B', margin: 0 }}>
                {siteContent?.home?.teamSubheading || 'No non-technical middle managers. You work directly with senior founders and hands-on architects.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setHeadingForm({
                    teamEyebrow: siteContent?.home?.teamEyebrow || 'Leadership & Accountability',
                    teamHeading: siteContent?.home?.teamHeading || 'Direct Access to the Engineers Building Your Product',
                    teamSubheading: siteContent?.home?.teamSubheading || 'No non-technical middle managers. You work directly with senior founders and hands-on architects.',
                  });
                  setShowSectionHeadingModal(true);
                }}
                style={{ border: '1px solid #CBD5E1', padding: '7px 14px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 600 }}
              >
                ✏️ Edit Headings
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={openAddTeamModal}
                style={{ padding: '7px 16px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700 }}
              >
                + Add Member
              </button>
            </div>
          </div>

          {/* Cards Grid: Matching Exact Website Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 24 }}>
            {teamMembers.map((tm) => (
              <div
                key={tm.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid #E2E8F0',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
                  position: 'relative',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <div>
                  {/* Top Bar: Member Photo, Info, and Action Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <img
                        src={tm.image}
                        alt={tm.name}
                        style={{
                          width: 72,
                          height: 72,
                          borderRadius: '16px',
                          objectFit: 'cover',
                          border: '2px solid #F1F5F9',
                          boxShadow: '0 3px 10px rgba(15, 23, 42, 0.08)',
                        }}
                      />
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                          {tm.name}
                        </h3>
                        <span style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 700, display: 'block', marginTop: 2 }}>
                          {tm.role}
                        </span>
                        <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: 2 }}>
                          📍 {tm.location || 'Ludhiana, Punjab'}
                        </div>
                      </div>
                    </div>

                    {/* CRUD Actions */}
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => openEditTeamModal(tm)}
                        title="Edit Member"
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 8,
                          background: '#F1F5F9',
                          border: '1px solid #CBD5E1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: '#334155',
                          fontSize: '0.9rem',
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTeamMember(tm)}
                        title="Delete Member"
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 8,
                          background: '#FEE2E2',
                          border: '1px solid #FECACA',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: '#DC2626',
                          fontSize: '0.9rem',
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Bio */}
                  <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.55, marginBottom: 18 }}>
                    {tm.bio}
                  </p>
                </div>

                {/* Specialized Focus Tags */}
                <div style={{ paddingTop: 14, borderTop: '1px solid #E2E8F0', marginTop: 'auto' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Specialized Focus:
                  </span>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                    {(Array.isArray(tm.expertise) ? tm.expertise : []).map((exp) => (
                      <span
                        key={exp}
                        style={{
                          fontSize: '0.72rem',
                          background: '#F8FAFC',
                          border: '1px solid #CBD5E1',
                          padding: '3px 8px',
                          borderRadius: 6,
                          fontWeight: 600,
                          color: '#334155',
                        }}
                      >
                        {exp}
                      </span>
                    ))}
                  </div>

                  <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
                      Live on Website
                    </span>
                    <button
                      type="button"
                      onClick={() => openEditTeamModal(tm)}
                      style={{ background: 'transparent', border: 'none', color: '#2563EB', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                    >
                      Edit Details &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: ASSIGN TASKS (Full layout matching first screenshot)   */}
      {/* ============================================================ */}
      {activeTab === 'tasks' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 480px) 1fr', gap: 28, alignItems: 'flex-start' }}>
          {/* LEFT COLUMN: ASSIGN NEW TASK FORM */}
          <div className="panel-card" style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E2E8F0', padding: 24, boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 16, color: '#0F172A' }}>
              Assign New Task
            </h2>

            <form onSubmit={handleAssignTask}>
              {/* Task Title */}
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: 6, color: '#0F172A' }}>
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => updateTaskField('title', e.target.value)}
                  placeholder="e.g. Call back Vikram Malhotra regarding SEO proposal"
                  className="form-control"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                />
              </div>

              {/* Instructions / Description */}
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: 6, color: '#0F172A' }}>
                  Instructions / Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={taskForm.description}
                  onChange={(e) => updateTaskField('description', e.target.value)}
                  placeholder="Detail the action items, customer expectations, links or remarks needed..."
                  className="form-control"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.9rem', resize: 'vertical' }}
                />
              </div>

              {/* Assign to Employee & Priority */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: 6, color: '#0F172A' }}>
                    Assign to Employee *
                  </label>
                  <select
                    value={taskForm.assignedTo}
                    onChange={(e) => updateTaskField('assignedTo', e.target.value)}
                    className="form-control"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.85rem', background: '#FFFFFF' }}
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.name}>
                        {emp.name} ({emp.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: 6, color: '#0F172A' }}>
                    Priority *
                  </label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => updateTaskField('priority', e.target.value)}
                    className="form-control"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.85rem', background: '#FFFFFF' }}
                  >
                    <option value="High">🔴 High Priority</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="Low">🟢 Low</option>
                  </select>
                </div>
              </div>

              {/* Category & Deadline */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: 6, color: '#0F172A' }}>
                    Category
                  </label>
                  <select
                    value={taskForm.category}
                    onChange={(e) => updateTaskField('category', e.target.value)}
                    className="form-control"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.85rem', background: '#FFFFFF' }}
                  >
                    <option value="Lead Follow-up">Lead Follow-up</option>
                    <option value="Marketing Audit">Marketing Audit</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Client Demo">Client Demo</option>
                    <option value="SEO Optimization">SEO Optimization</option>
                    <option value="Content Update">Content Update</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: 6, color: '#0F172A' }}>
                    Deadline / Due Date
                  </label>
                  <input
                    type="text"
                    value={taskForm.deadline}
                    onChange={(e) => updateTaskField('deadline', e.target.value)}
                    placeholder="e.g. Today, 06:00 PM"
                    className="form-control"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Attach Spreadsheet Sheet (Optional) */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>
                    Attach Spreadsheet Sheet (Optional)
                  </label>
                  <span style={{ fontSize: '0.72rem', color: '#0284C7', fontWeight: 600 }}>
                    ⚡ Auto-compressed for low data
                  </span>
                </div>

                <div
                  style={{
                    border: '2px dashed #CBD5E1',
                    borderRadius: 10,
                    padding: 16,
                    textAlign: 'center',
                    background: '#F8FAFC',
                    cursor: 'pointer',
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                  />

                  {compressing ? (
                    <div style={{ fontSize: '0.85rem', color: '#2563EB', fontWeight: 600 }}>
                      ⏳ Compressing spreadsheet payload...
                    </div>
                  ) : attachment ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1' }}>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                          📊 {attachment.fileName}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                          Rows: {attachment.rowCount} | Size: {(attachment.compressedSize / 1024).toFixed(1)} KB (Saved {attachment.compressionRatio}%)
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAttachment();
                        }}
                        style={{ background: 'transparent', border: 'none', color: '#EF4444', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>📊</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                        Click to select .xlsx, .xls, or .csv sheet
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: 2 }}>
                        Not required • Automatically compressed into low data payload
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', borderRadius: 8, fontWeight: 700, fontSize: '0.95rem' }}
              >
                Assign Task Now &rarr;
              </button>
            </form>
          </div>

          {/* RIGHT COLUMN: TASK LIST & FILTERS */}
          <div>
            {/* Filter Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Filter by:</span>
                <select
                  value={filterEmp}
                  onChange={(e) => setFilterEmp(e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.82rem', background: '#FFFFFF' }}
                >
                  <option value="All">All Employees</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.name}>{emp.name}</option>
                  ))}
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.82rem', background: '#FFFFFF' }}
                >
                  <option value="All">All Statuses</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>
                Showing {filteredTasks.length} tasks
              </div>
            </div>

            {/* Task Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {filteredTasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', color: '#64748B' }}>
                  No tasks match the selected filters.
                </div>
              ) : (
                filteredTasks.map((t) => {
                  const isHigh = t.priority === 'High';
                  const isDone = t.status === 'Completed';

                  return (
                    <div
                      key={t.id}
                      style={{
                        background: '#FFFFFF',
                        borderRadius: 14,
                        border: '1px solid #E2E8F0',
                        borderLeft: `5px solid ${isHigh ? '#EF4444' : isDone ? '#10B981' : '#F59E0B'}`,
                        padding: '18px 20px',
                        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                      }}
                    >
                      {/* Top Badges & Actions */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: 6,
                              background: t.status === 'Completed' ? '#ECFDF5' : t.status === 'In Progress' ? '#EFF6FF' : '#FEF3C7',
                              color: t.status === 'Completed' ? '#059669' : t.status === 'In Progress' ? '#2563EB' : '#D97706',
                            }}
                          >
                            {t.status}
                          </span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: '#F1F5F9', color: '#475569' }}>
                            {t.category}
                          </span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: isHigh ? '#EF4444' : '#F59E0B' }}>
                            {t.priority}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <select
                            value={t.status}
                            onChange={(e) => handleStatusChange(t.id, e.target.value)}
                            style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: '0.78rem', background: '#FFFFFF' }}
                          >
                            <option value="Pending">Mark Pending</option>
                            <option value="In Progress">Mark In Progress</option>
                            <option value="Completed">Mark Completed</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => handleDeleteTask(t.id)}
                            title="Delete Task"
                            style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '0.95rem' }}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0, marginBottom: 6 }}>
                        {t.title}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, margin: 0, marginBottom: 12 }}>
                        {t.description}
                      </p>

                      {/* Attached Spreadsheet Download Button */}
                      {t.attachment && (
                        <div style={{ marginBottom: 12 }}>
                          <button
                            type="button"
                            onClick={() => downloadAttachment(t.attachment)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '5px 12px',
                              borderRadius: 6,
                              background: '#F0FDF4',
                              border: '1px solid #86EFAC',
                              color: '#166534',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            📥 Download Attached Sheet ({t.attachment.fileName})
                          </button>
                        </div>
                      )}

                      {/* Employee Remarks Box (Matches first screenshot) */}
                      {t.remarks ? (
                        <div style={{ background: '#FEF9C3', border: '1px solid #FDE047', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#854D0E' }}>
                            Employee Remarks:
                          </div>
                          <div style={{ fontSize: '0.82rem', color: '#713F12', marginTop: 3 }}>
                            {t.remarks}
                          </div>
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontStyle: 'italic', marginBottom: 10 }}>
                          No completion remarks submitted by employee yet.
                        </div>
                      )}

                      {/* Card Footer Info */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#64748B', paddingTop: 8, borderTop: '1px solid #F1F5F9' }}>
                        <div>Assigned to: <strong style={{ color: '#0F172A' }}>{t.assignedTo}</strong></div>
                        <div>Due: <strong style={{ color: '#0F172A' }}>{t.deadline || 'Today, 06:00 PM'}</strong></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: STAFF DIRECTORY & LIVE SESSIONS (Internal staff roster)*/}
      {/* ============================================================ */}
      {activeTab === 'staff' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
            {employees.map((emp) => {
              const empTasks = tasks.filter((t) => t.assignedTo === emp.name);
              const doneTasks = empTasks.filter((t) => t.status === 'Completed');
              const hrs = Math.floor((emp.timerSeconds || 0) / 3600);
              const mins = Math.floor(((emp.timerSeconds || 0) % 3600) / 60);
              const secs = (emp.timerSeconds || 0) % 60;
              const isActive = emp.isActive !== false;

              return (
                <div
                  key={emp.id}
                  className="panel-card"
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 16,
                    border: '1px solid #E2E8F0',
                    borderLeft: `4px solid ${!isActive ? '#94A3B8' : emp.isOnline ? '#10B981' : '#CBD5E1'}`,
                    padding: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
                    opacity: !isActive ? 0.75 : 1,
                  }}
                >
                  <div>
                    {/* Top Row: Avatar & Online Status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: '50%',
                            background: !isActive ? '#94A3B8' : 'linear-gradient(135deg, #FF7A00, #FF5500)',
                            color: '#FFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '1.1rem',
                          }}
                        >
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{emp.name}</h3>
                          <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{emp.role}</div>
                        </div>
                      </div>

                      <div>
                        {!isActive ? (
                          <span style={{ fontSize: '0.72rem', background: '#FEE2E2', color: '#DC2626', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
                            🔴 Deactivated
                          </span>
                        ) : emp.isOnline ? (
                          emp.onBreak ? (
                            <span style={{ fontSize: '0.72rem', background: '#FEF3C7', color: '#B45309', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
                              🟡 On Break
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.72rem', background: '#ECFDF5', color: '#059669', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
                              🟢 Active Session
                            </span>
                          )
                        ) : (
                          <span style={{ fontSize: '0.72rem', background: '#F1F5F9', color: '#64748B', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
                            ⚪ Offline
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Live Session Metrics */}
                    <div style={{ margin: '14px 0', padding: '12px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Active Session Clock</span>
                        <span style={{ fontSize: '0.88rem', fontWeight: 800, color: emp.isOnline ? '#059669' : '#0F172A', fontFamily: 'monospace' }}>
                          {hrs}h {mins}m {secs}s
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748B' }}>
                        <span>Today's Bonus: <strong>{emp.bonusToday || '₹0'}</strong></span>
                        <span>First Login: <strong>{emp.firstLogin || 'Not today'}</strong></span>
                      </div>
                    </div>

                    {/* Performance & Duties */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                      <div style={{ padding: '8px 10px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, textAlign: 'center' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2563EB' }}>
                          {doneTasks.length}/{empTasks.length}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Tasks Completed</div>
                      </div>
                      <div style={{ padding: '8px 10px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, textAlign: 'center' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                          {emp.monthlySalaryText || '₹20,000'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Monthly Salary</div>
                      </div>
                    </div>

                    {/* Contact details */}
                    <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: 16 }}>
                      <div>📧 {emp.email}</div>
                      <div style={{ marginTop: 2 }}>📞 {emp.phone || '+91 98765 43210'}</div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div style={{ display: 'flex', gap: 8, paddingTop: 14, borderTop: '1px solid #E2E8F0', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenEmployeeDashboard(emp)}
                      className="btn btn-ghost"
                      style={{ flex: 1, padding: '7px 0', fontSize: '0.78rem', fontWeight: 700, border: '1px solid #CBD5E1', borderRadius: 6 }}
                    >
                      🚀 Inspect Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditStaffModal(emp)}
                      style={{ padding: '7px 12px', fontSize: '0.78rem', fontWeight: 700, background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 6, cursor: 'pointer' }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleStaffActive(emp)}
                      style={{
                        padding: '7px 10px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        background: isActive ? '#FEF2F2' : '#ECFDF5',
                        border: `1px solid ${isActive ? '#FECACA' : '#A7F3D0'}`,
                        color: isActive ? '#DC2626' : '#059669',
                        borderRadius: 6,
                        cursor: 'pointer',
                      }}
                    >
                      {isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteStaff(emp)}
                      title="Delete Employee"
                      style={{ padding: '7px 10px', fontSize: '0.78rem', background: '#FEE2E2', border: '1px solid #FECACA', color: '#DC2626', borderRadius: 6, cursor: 'pointer' }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: ADD / EDIT WEBSITE TEAM MEMBER                       */}
      {/* ============================================================ */}
      {showTeamModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setShowTeamModal(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 16,
              maxWidth: 580,
              width: '100%',
              padding: 28,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                {editingTeamMember ? 'Edit Website Team Member' : 'Add New Team Member to Website'}
              </h2>
              <button
                type="button"
                onClick={() => setShowTeamModal(false)}
                style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94A3B8' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTeamMember}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: 6, color: '#0F172A' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={teamForm.name}
                    onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                    placeholder="e.g. Sushant Aggarwal"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: 6, color: '#0F172A' }}>
                    Role / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={teamForm.role}
                    onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                    placeholder="e.g. Founder & Principal Engineer"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: 6, color: '#0F172A' }}>
                  Location Tag
                </label>
                <input
                  type="text"
                  value={teamForm.location}
                  onChange={(e) => setTeamForm({ ...teamForm, location: e.target.value })}
                  placeholder="e.g. Ludhiana, Punjab"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                />
              </div>

              {/* Profile Photo Upload & Options */}
              <div style={{ marginBottom: 18, background: '#F8FAFC', padding: '14px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: 8, color: '#0F172A' }}>
                  Profile Photo *
                </label>

                {/* Upload & Preview Box */}
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12 }}>
                  {/* Photo Preview */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img
                      src={teamForm.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                      alt="Preview"
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 14,
                        objectFit: 'cover',
                        border: '2px solid #2563EB',
                        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)',
                      }}
                    />
                    {isPhotoUploading && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(15, 23, 42, 0.65)',
                          borderRadius: 14,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                        }}
                      >
                        ⏳
                      </div>
                    )}
                  </div>

                  {/* Upload from Computer/Device button */}
                  <div style={{ flex: 1 }}>
                    <input
                      ref={teamPhotoInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleTeamPhotoUpload}
                    />

                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => teamPhotoInputRef.current?.click()}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          background: '#2563EB',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: 8,
                          padding: '8px 16px',
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
                        }}
                      >
                        📁 Upload Photo from Device
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        style={{
                          background: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          color: '#475569',
                          borderRadius: 8,
                          padding: '7px 12px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {showUrlInput ? 'Hide URL & Presets' : '🔗 Paste URL / Presets'}
                      </button>
                    </div>

                    <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: 5 }}>
                      PNG, JPG, or WEBP from your phone or PC. Automatically compressed for fast loading.
                    </div>
                  </div>
                </div>

                {/* Optional: URL Input & Presets */}
                {showUrlInput && (
                  <div style={{ paddingTop: 12, borderTop: '1px dashed #CBD5E1', marginTop: 10 }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <input
                        type="text"
                        value={teamForm.image}
                        onChange={(e) => setTeamForm({ ...teamForm, image: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        style={{ flex: 1, padding: '7px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Preset Avatars:</span>
                      {AVATAR_PRESETS.map((p) => (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => setTeamForm({ ...teamForm, image: p.url })}
                          style={{
                            padding: '3px 8px',
                            borderRadius: 6,
                            border: '1px solid #CBD5E1',
                            background: teamForm.image === p.url ? '#EFF6FF' : '#FFFFFF',
                            color: teamForm.image === p.url ? '#2563EB' : '#475569',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bio */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: 6, color: '#0F172A' }}>
                  Bio / Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={teamForm.bio}
                  onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                  placeholder="Full-stack software architect with 8+ years building enterprise web apps..."
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.88rem', resize: 'vertical' }}
                />
              </div>

              {/* Specialized Focus Tags */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: 4, color: '#0F172A' }}>
                  Specialized Focus Tags (Comma-separated)
                </label>
                <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block', marginBottom: 6 }}>
                  Tags shown at bottom of the card, e.g: Full-Stack JavaScript, Next.js &amp; React, System Architecture
                </span>
                <input
                  type="text"
                  value={teamForm.expertise}
                  onChange={(e) => setTeamForm({ ...teamForm, expertise: e.target.value })}
                  placeholder="e.g. Next.js, SEO Strategy, Performance Marketing"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowTeamModal(false)}
                  style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid #CBD5E1' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '9px 24px', borderRadius: 8, fontWeight: 700 }}
                >
                  {editingTeamMember ? 'Save Changes' : 'Add Team Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: EDIT SECTION HEADINGS                                */}
      {/* ============================================================ */}
      {showSectionHeadingModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setShowSectionHeadingModal(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 16,
              maxWidth: 540,
              width: '100%',
              padding: 28,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                Edit Team Section Headings
              </h2>
              <button
                type="button"
                onClick={() => setShowSectionHeadingModal(false)}
                style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94A3B8' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveHeadings}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: 6, color: '#0F172A' }}>
                  Section Eyebrow
                </label>
                <input
                  type="text"
                  value={headingForm.teamEyebrow}
                  onChange={(e) => setHeadingForm({ ...headingForm, teamEyebrow: e.target.value })}
                  placeholder="e.g. Leadership & Accountability"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: 6, color: '#0F172A' }}>
                  Section Heading *
                </label>
                <input
                  type="text"
                  required
                  value={headingForm.teamHeading}
                  onChange={(e) => setHeadingForm({ ...headingForm, teamHeading: e.target.value })}
                  placeholder="e.g. Direct Access to the Engineers Building Your Product"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: 6, color: '#0F172A' }}>
                  Section Subheading
                </label>
                <textarea
                  rows={3}
                  value={headingForm.teamSubheading}
                  onChange={(e) => setHeadingForm({ ...headingForm, teamSubheading: e.target.value })}
                  placeholder="e.g. No non-technical middle managers. You work directly with senior founders and hands-on architects."
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.88rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowSectionHeadingModal(false)}
                  style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid #CBD5E1' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '9px 24px', borderRadius: 8, fontWeight: 700 }}
                >
                  Save Headings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: ADD / EDIT INTERNAL STAFF EMPLOYEE                  */}
      {/* ============================================================ */}
      {showStaffModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setShowStaffModal(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 16,
              maxWidth: 520,
              width: '100%',
              padding: 28,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                {editingStaff ? 'Edit Staff Credentials' : 'Create New Employee Account'}
              </h2>
              <button
                type="button"
                onClick={() => setShowStaffModal(false)}
                style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94A3B8' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStaff}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: 6, color: '#0F172A' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  placeholder="e.g. Vikram Malhotra"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: 6, color: '#0F172A' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={staffForm.email}
                    onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                    placeholder="emp@brandedcoders.com"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: 6, color: '#0F172A' }}>
                    Password *
                  </label>
                  <input
                    type="text"
                    required
                    value={staffForm.password}
                    onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                    placeholder="employee123"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: 6, color: '#0F172A' }}>
                    Job Role
                  </label>
                  <input
                    type="text"
                    value={staffForm.role}
                    onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                    placeholder="e.g. Digital Marketing Lead"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: 6, color: '#0F172A' }}>
                    Monthly Salary (₹)
                  </label>
                  <input
                    type="text"
                    value={staffForm.salary}
                    onChange={(e) => setStaffForm({ ...staffForm, salary: e.target.value })}
                    placeholder="25000"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowStaffModal(false)}
                  style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid #CBD5E1' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '9px 24px', borderRadius: 8, fontWeight: 700 }}
                >
                  {editingStaff ? 'Save Employee' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
