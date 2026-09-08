import { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api';
import { dataStore } from '../lib/dataStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Restore admin session
    const storedAdmin = localStorage.getItem('bc_admin');
    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch (e) {
        console.error(e);
      }
    }

    // Restore employee session
    const storedEmp = localStorage.getItem('bc_employee');
    if (storedEmp) {
      try {
        const empObj = JSON.parse(storedEmp);
        // Refresh with latest from store
        const liveEmp = dataStore.getEmployeeById(empObj.id) || empObj;
        setEmployee(liveEmp);
        dataStore.setEmployeeOnline(liveEmp.id, true);
      } catch (e) {
        console.error(e);
      }
    }

    setReady(true);

    // Subscribe to store updates for employee changes (timer, onBreak status)
    const unsubscribe = dataStore.subscribe((data) => {
      setEmployee((prev) => {
        if (!prev) return null;
        const fresh = data.employees.find((e) => e.id === prev.id);
        return fresh ? { ...prev, ...fresh } : prev;
      });
      setAdmin((prev) => {
        if (!prev) return null;
        const fresh = data.admins?.find((a) => a.email.toLowerCase() === prev.email.toLowerCase());
        return fresh ? { ...prev, name: fresh.name, role: fresh.role } : prev;
      });
    });

    return () => unsubscribe();
  }, []);

  async function loginAdmin(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('bc_token', data.token);
    localStorage.setItem('bc_admin', JSON.stringify(data.admin));
    setAdmin(data.admin);
    return data.admin;
  }

  // Backwards compatible login function for admin
  async function login(email, password) {
    return loginAdmin(email, password);
  }

  async function updateCurrentAdminPassword(currentPassword, newPassword) {
    if (!admin?.email) {
      throw new Error('You must be logged in as an administrator to change your password.');
    }
    const cleanEmail = admin.email.trim().toLowerCase();
    const liveAdmin = dataStore.getAdminByEmail(cleanEmail);
    const storedPass = liveAdmin?.password || 'admin123';

    if (storedPass !== currentPassword) {
      throw new Error('The current password entered is incorrect. Please re-enter.');
    }

    if (!newPassword || newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long.');
    }

    dataStore.updateAdminPassword(admin.email, newPassword);

    const updated = {
      ...admin,
      ...(liveAdmin ? { name: liveAdmin.name, role: liveAdmin.role } : {}),
    };
    localStorage.setItem('bc_admin', JSON.stringify(updated));
    setAdmin(updated);
    return true;
  }

  function logoutAdmin() {
    localStorage.removeItem('bc_token');
    localStorage.removeItem('bc_admin');
    setAdmin(null);
  }

  function logout() {
    logoutAdmin();
  }

  async function loginEmployee(email, password) {
    const cleanEmail = email.trim().toLowerCase();
    let emp = dataStore.getEmployeeByEmail(cleanEmail);

    if (!emp) {
      throw new Error('Invalid email address or employee account not found.');
    }

    if (emp.isActive === false) {
      throw new Error('Your employee account has been deactivated by the administrator. Please contact admin.');
    }

    const validPass = emp.password ? emp.password === password : (password === 'employee123' || password === 'password123');
    if (!validPass) {
      throw new Error('Incorrect password. Please try again.');
    }

    dataStore.setEmployeeOnline(emp.id, true);
    localStorage.setItem('bc_employee_token', 'emp-token-' + Date.now());
    localStorage.setItem('bc_employee', JSON.stringify(emp));
    setEmployee(emp);
    return emp;
  }

  function impersonateEmployee(empId) {
    const target = dataStore.getEmployeeById(empId);
    if (target) {
      localStorage.setItem('bc_employee_token', 'emp-token-' + Date.now());
      localStorage.setItem('bc_employee', JSON.stringify(target));
      setEmployee(target);
      return target;
    }
    return null;
  }

  function logoutEmployee() {
    if (employee) {
      dataStore.setEmployeeOnline(employee.id, false);
    }
    localStorage.removeItem('bc_employee_token');
    localStorage.removeItem('bc_employee');
    setEmployee(null);
  }

  function toggleEmployeeBreak() {
    if (employee) {
      dataStore.toggleBreak(employee.id);
      const updated = dataStore.getEmployeeById(employee.id);
      if (updated) {
        setEmployee(updated);
        localStorage.setItem('bc_employee', JSON.stringify(updated));
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        admin,
        employee,
        ready,
        login,
        loginAdmin,
        logout,
        logoutAdmin,
        loginEmployee,
        logoutEmployee,
        toggleEmployeeBreak,
        impersonateEmployee,
        updateCurrentAdminPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
