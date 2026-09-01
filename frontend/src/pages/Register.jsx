import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserPlus, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const returnTo = location.state?.returnTo || '/';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    street_address: '',
    city: '',
    state: '',
    zip_code: ''
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setSubmitting(true);
      const res = await register(formData);
      if (res.success) {
        navigate(returnTo);
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="max-w-500 mx-auto dt-card p-4 p-md-5">
        <div className="text-center mb-4">
          <div className="d-inline-flex p-3 rounded-circle mb-2" style={{ backgroundColor: '#FAF8FF', color: '#7C3AED' }}>
            <Heart size={32} fill="#7C3AED" />
          </div>
          <h3 className="fw-bold text-dark">Join DearThreado</h3>
          <p className="text-muted small">Create an account for personalized handmade gifting</p>
        </div>

        {error && (
          <div className="alert alert-danger rounded-3 small mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Full Name *</label>
            <input 
              type="text" 
              className="form-control rounded-3" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Email Address *</label>
            <input 
              type="email" 
              className="form-control rounded-3" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Password *</label>
            <input 
              type="password" 
              className="form-control rounded-3" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold">Phone Number</label>
            <input 
              type="tel" 
              className="form-control rounded-3" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <button 
            type="submit" 
            className="btn-dt-primary w-100 justify-content-center py-2.5 fs-6 mb-3"
            disabled={submitting}
          >
            {submitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center small text-muted">
          Already have an account?{' '}
          <Link to="/login" state={{ returnTo }} className="fw-bold text-purple-primary text-decoration-none" style={{ color: '#7C3AED' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
