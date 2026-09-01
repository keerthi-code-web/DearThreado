import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const returnTo = location.state?.returnTo || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setSubmitting(true);
      const res = await login(email, password);
      if (res.success) {
        navigate(returnTo);
      } else {
        setError(res.message || 'Login failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="max-w-450 mx-auto dt-card p-4 p-md-5">
        <div className="text-center mb-4">
          <div className="d-inline-flex p-3 rounded-circle mb-2" style={{ backgroundColor: '#FAF8FF', color: '#7C3AED' }}>
            <Heart size={32} fill="#7C3AED" />
          </div>
          <h3 className="fw-bold text-dark">Welcome to DearThreado</h3>
          <p className="text-muted small">Sign in to your account</p>
        </div>

        {error && (
          <div className="alert alert-danger rounded-3 small mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Email Address</label>
            <input 
              type="email" 
              className="form-control rounded-3" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold">Password</label>
            <input 
              type="password" 
              className="form-control rounded-3" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn-dt-primary w-100 justify-content-center py-2.5 fs-6 mb-3"
            disabled={submitting}
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center small text-muted">
          Don't have an account yet?{' '}
          <Link to="/register" state={{ returnTo }} className="fw-bold text-purple-primary text-decoration-none" style={{ color: '#7C3AED' }}>
            Create Account
          </Link>
        </div>

        <div className="mt-4 pt-3 border-top text-center">
          <Link to="/admin/login" className="small text-muted text-decoration-none">
            Are you an Admin? Access Admin Portal &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
