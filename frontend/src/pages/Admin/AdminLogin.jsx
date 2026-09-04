import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setSubmitting(true);
      const res = await adminLogin(email, password);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setError(res.message || 'Admin authentication failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="max-w-450 mx-auto dt-card p-4 p-md-5">
        <div className="text-center mb-4">
          <div className="d-inline-flex p-3 rounded-circle mb-2" style={{ backgroundColor: '#FAF8FF', color: '#7C3AED' }}>
            <ShieldCheck size={36} />
          </div>
          <h3 className="fw-bold text-dark">DearThreado Admin Portal</h3>
          <p className="text-muted small">Protected single-admin authentication</p>
        </div>

        {error && (
          <div className="alert alert-danger rounded-3 small mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Admin Email</label>
            <input 
              type="email" 
              className="form-control rounded-3" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@dearthreado.com"
              autoComplete="username email"
              required 
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold">Admin Password</label>
            <input 
              type="password" 
              className="form-control rounded-3" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn-dt-primary w-100 justify-content-center py-2.5 fs-6"
            disabled={submitting}
          >
            {submitting ? 'Authenticating...' : 'Sign In to Admin Portal'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
