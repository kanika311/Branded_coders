import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import Portfolio from './pages/Portfolio.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';

// Admin Pages
import AdminLogin from './pages/admin/Login.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import AssignTasks from './pages/admin/AssignTasks.jsx';
import AdminLeads from './pages/admin/AdminLeads.jsx';
import ManageServices from './pages/admin/ManageServices.jsx';
import ManagePortfolio from './pages/admin/ManagePortfolio.jsx';
import Messages from './pages/admin/Messages.jsx';
import ManageEmployees from './pages/admin/ManageEmployees.jsx';
import SiteContentCMS from './pages/admin/SiteContentCMS.jsx';
import AdminSecurity from './pages/admin/AdminSecurity.jsx';

import Privacy from './pages/Privacy.jsx';
import Terms from './pages/Terms.jsx';

// Employee Pages
import EmployeeLogin from './pages/employee/EmployeeLogin.jsx';
import EmployeeLayout from './pages/employee/EmployeeLayout.jsx';
import EmployeeDashboard from './pages/employee/EmployeeDashboard.jsx';
import EmployeeLeads from './pages/employee/EmployeeLeads.jsx';
import EmployeeTasks from './pages/employee/EmployeeTasks.jsx';
import EmployeeSettings from './pages/employee/EmployeeSettings.jsx';

import ProtectedRoute from './components/ProtectedRoute.jsx';

function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      {/* PUBLIC WEBSITE */}
      <Route path="/" element={<SiteLayout><Home /></SiteLayout>} />
      <Route path="/services" element={<SiteLayout><Services /></SiteLayout>} />
      <Route path="/work" element={<SiteLayout><Portfolio /></SiteLayout>} />
      <Route path="/about" element={<SiteLayout><About /></SiteLayout>} />
      <Route path="/contact" element={<SiteLayout><Contact /></SiteLayout>} />
      <Route path="/privacy" element={<SiteLayout><Privacy /></SiteLayout>} />
      <Route path="/terms" element={<SiteLayout><Terms /></SiteLayout>} />

      {/* ADMIN CMS ROUTES */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<AssignTasks />} />
        <Route path="leads" element={<AdminLeads />} />
        <Route path="services" element={<ManageServices />} />
        <Route path="portfolio" element={<ManagePortfolio />} />
        <Route path="messages" element={<Messages />} />
        <Route path="employees" element={<ManageEmployees />} />
        <Route path="content" element={<SiteContentCMS />} />
        <Route path="security" element={<AdminSecurity />} />
      </Route>

      {/* EMPLOYEE PORTAL ROUTES */}
      <Route path="/employee/login" element={<EmployeeLogin />} />
      <Route path="/employee" element={<Navigate to="/employee/dashboard" replace />} />
      <Route
        path="/employee/*"
        element={
          <ProtectedRoute role="employee">
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="leads" element={<EmployeeLeads />} />
        <Route path="tasks" element={<EmployeeTasks />} />
        <Route path="settings" element={<EmployeeSettings />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
