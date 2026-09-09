import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function EmployeeLogin() {
  const { loginEmployee } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await loginEmployee(email, password);
      navigate('/employee/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-shell" style={{ background: 'radial-gradient(circle at top, #FFF7ED 0%, #F8FAFC 100%)' }}>
      <div className="login-box">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img
            src="/logo.jpeg"
            alt="BrandedCoders"
            style={{ height: '48px', width: 'auto', margin: '0 auto 12px', display: 'block', objectFit: 'contain' }}
          />
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--ink)' }}>Employee Portal Login</h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--ink-dim)', marginTop: 4 }}>
            Sign in to access your dashboard, leads pipeline, and tasks
          </p>
        </div>

        {error && (
          <div className="status-msg status-err" style={{ marginBottom: 18 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="emp-email">Employee Work Email</label>
            <input
              id="emp-email"
              type="email"
              required
              placeholder="e.g. yourname@brandedcoders.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="emp-pass">Password</label>
            <input
              id="emp-pass"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-orange"
            style={{ width: '100%', padding: '12px', fontSize: '0.98rem', marginTop: 10 }}
            disabled={loading}
          >
            {loading ? 'Verifying session…' : 'Sign in to Employee Panel →'}
          </button>
        </form>

        <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--panel-line)', textAlign: 'center' }}>
          <Link to="/" style={{ display: 'inline-block', fontSize: '0.85rem', color: 'var(--ink-dim)' }}>
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
