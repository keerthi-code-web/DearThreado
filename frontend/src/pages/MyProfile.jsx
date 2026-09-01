import React, { useState } from 'react';
import { User, MapPin, Phone, Mail, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MyProfile = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street_address: user?.street_address || '',
    city: user?.city || '',
    state: user?.state || '',
    zip_code: user?.zip_code || ''
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <h4>Please log in to view your profile.</h4>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateProfile(formData);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="max-w-600 mx-auto dt-card p-4 p-md-5">
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="d-inline-flex p-3 rounded-circle" style={{ backgroundColor: '#FAF8FF', color: '#7C3AED' }}>
            <User size={32} />
          </div>
          <div>
            <h3 className="fw-bold text-dark mb-0">{user.name}</h3>
            <span className="text-muted small">{user.email}</span>
          </div>
        </div>

        {successMsg && (
          <div className="alert alert-success rounded-3 d-flex align-items-center gap-2 mb-4">
            <Check size={18} /> {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label small fw-semibold">Full Name</label>
              <input 
                type="text" 
                className="form-control rounded-3" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label small fw-semibold">Phone Number</label>
              <input 
                type="tel" 
                className="form-control rounded-3" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 pt-3 border-top">
              <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-1">
                <MapPin size={16} color="#7C3AED" /> Primary Delivery Address
              </h6>
            </div>

            <div className="col-12">
              <label className="form-label small fw-semibold">Street Address</label>
              <textarea 
                className="form-control rounded-3" 
                rows="2"
                name="street_address"
                value={formData.street_address}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold">City</label>
              <input 
                type="text" 
                className="form-control rounded-3" 
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold">State</label>
              <input 
                type="text" 
                className="form-control rounded-3" 
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold">Zip Code</label>
              <input 
                type="text" 
                className="form-control rounded-3" 
                name="zip_code"
                value={formData.zip_code}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 mt-4">
              <button type="submit" className="btn-dt-primary w-100 justify-content-center py-2.5" disabled={saving}>
                {saving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;
