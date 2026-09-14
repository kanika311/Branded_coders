import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminLogin() {
  const { loginAdmin } = useAuth();
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
      await loginAdmin(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Access denied. Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-shell">
      <div className="login-box">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img
            src="/logo-mark.png"
            alt="BrandedCoders"
            style={{ height: '72px', width: 'auto', margin: '0 auto 12px', display: 'block', objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(37,99,235,0.25))' }}
          />
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Management Sign In</h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--ink-dim)', marginTop: 4 }}>
            Authorized administrator session
          </p>
        </div>

        {error && (
          <div className="status-msg status-err" style={{ marginBottom: 18 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="email">Administrator Email</label>
            <input
              id="email"
              type="email"
              required
              placeholder="admin@brandedcoders.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Security Password</label>
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-secondary"
            style={{ width: '100%', padding: '12px', fontSize: '0.96rem', marginTop: 10 }}
            disabled={loading}
          >
            {loading ? 'Authenticating…' : 'Sign in to Console →'}
          </button>

          <button
            type="button"
            onClick={() => {
              setEmail('admin@brandedcoders.com');
              setPassword('admin123');
              loginAdmin('admin@brandedcoders.com', 'admin123').then(() => navigate('/admin'));
            }}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '0.84rem',
              fontWeight: 700,
              marginTop: 10,
              background: '#EFF6FF',
              color: '#1D4ED8',
              border: '1px solid #BFDBFE',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            ⚡ 1-Click Demo Admin Login (CRUD Console)
          </button>
        </form>

        <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--panel-line)', textAlign: 'center' }}>
          <Link to="/" style={{ display: 'inline-block', fontSize: '0.82rem', color: 'var(--ink-dim)' }}>
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
