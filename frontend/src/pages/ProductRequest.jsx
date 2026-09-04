import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MessageCircleHeart, CheckCircle, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import api from '../services/api';

const ProductRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget_range: 'Under ₹500',
    reference_image_url: ''
  });

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const data = new FormData();
      data.append('image', file);
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setFormData(prev => ({ ...prev, reference_image_url: res.data.image_url }));
      }
    } catch (err) {
      alert('Failed to upload image reference.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/requests', formData);
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        setFormData({ title: '', description: '', budget_range: 'Under ₹500', reference_image_url: '' });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="max-w-750 mx-auto">
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill mb-3 border" style={{ backgroundColor: '#FAF8FF', borderColor: '#DDD6FE', color: '#7C3AED' }}>
            <Sparkles size={16} />
            <span className="small fw-bold">Custom Gift Co-Creation</span>
          </div>

          <h2 className="fw-extrabold text-dark mb-2">Can't find what you're imagining?</h2>
          <p className="text-muted lead fs-6">
            Tell us about your unique gift idea or requirement. DearThreado will review your vision and reply with crafting possibilities!
          </p>
        </div>

        {successMsg && (
          <div className="alert alert-success rounded-4 p-4 text-center mb-4">
            <CheckCircle size={36} className="mb-2 text-success" />
            <h5 className="fw-bold mb-1">Request Received!</h5>
            <p className="small mb-0">{successMsg}</p>
          </div>
        )}

        <div className="dt-card p-4 p-md-5">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-12">
                <label className="form-label fw-semibold text-dark">Gift Idea Title *</label>
                <input 
                  type="text" 
                  className="form-control rounded-3" 
                  name="title"
                  placeholder="e.g. Personalized Wooden Clock with Embroidered Thread Border"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold text-dark">Describe Your Vision & Details *</label>
                <textarea 
                  className="form-control rounded-3" 
                  rows="4"
                  name="description"
                  placeholder="Include details like colors, names, date, occasion, or any specific theme you are looking for..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold text-dark">Estimated Budget Range</label>
                <select 
                  className="form-select rounded-3"
                  name="budget_range"
                  value={formData.budget_range}
                  onChange={handleChange}
                >
                  <option value="Under ₹500">Under ₹500</option>
                  <option value="₹500 - ₹1,000">₹500 - ₹1,000</option>
                  <option value="₹1,000 - ₹2,500">₹1,000 - ₹2,500</option>
                  <option value="₹2,500+">₹2,500+</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold text-dark">Reference Photo (Optional)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  className="d-none"
                  id="request-file-input"
                  onChange={handleFileUpload}
                />
                <label 
                  htmlFor="request-file-input" 
                  className="btn btn-outline-purple w-100 py-2.5 rounded-3 d-flex align-items-center justify-content-center gap-2"
                  style={{ borderColor: '#DDD6FE', color: '#7C3AED' }}
                >
                  {uploading ? <span className="spinner-border spinner-border-sm" role="status"></span> : <Upload size={16} />}
                  {formData.reference_image_url ? 'Change Photo' : 'Upload Sketch or Reference'}
                </label>
                {formData.reference_image_url && (
                  <span className="small text-success d-block mt-1">Photo uploaded!</span>
                )}
              </div>

              <div className="col-12 mt-4">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn-dt-primary w-100 justify-content-center py-3 fs-6"
                >
                  {submitting ? (
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                  ) : (
                    <>
                      <MessageCircleHeart size={20} /> Submit Gift Request
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Auth Intercept Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        redirectPath="/request-gift"
        title="Account Required for Requests"
        message="Please log in or register so your gift request stays connected to your account and you can receive notifications when our admin responds!"
      />
    </div>
  );
};

export default ProductRequest;
