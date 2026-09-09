import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children, role = 'admin' }) {
  const { admin, employee, ready } = useAuth();
  if (!ready) return null;

  if (role === 'admin') {
    if (!admin) return <Navigate to="/admin/login" replace />;
  } else if (role === 'employee') {
    if (!employee) return <Navigate to="/employee/login" replace />;
  }

  return children;
}
