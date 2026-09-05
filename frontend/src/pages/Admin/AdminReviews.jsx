import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import api from '../../services/api';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const url = statusFilter ? `/reviews/admin/all?status=${statusFilter}` : '/reviews/admin/all';
      const res = await api.get(url);
      if (res.data.success) {
        setReviews(res.data.reviews || []);
      }
    } catch (err) {
      console.error('Fetch Admin Reviews Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await api.put(`/reviews/${id}/status`, { status });
      if (res.data.success) {
        fetchReviews();
      }
    } catch (err) {
      alert('Failed to update review status.');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-purple" style={{ color: '#7C3AED' }} role="status"></div>
        <p className="text-muted mt-2">Loading Reviews Queue...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mb-3">
        <Link to="/admin/dashboard" className="btn btn-sm btn-outline-purple d-inline-flex align-items-center gap-1.5 fw-semibold rounded-pill px-3" style={{ color: '#7C3AED', borderColor: '#DDD6FE', backgroundColor: '#ffffff' }}>
          <ArrowLeft size={16} /> Back to Admin Portal
        </Link>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Customer Reviews Moderation Queue</h2>
          <p className="text-muted small mb-0">Approve or reject customer product reviews before public display</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {['', 'Pending', 'Approved', 'Rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`btn btn-sm rounded-pill px-3 fw-semibold ${statusFilter === st ? 'btn-dt-primary' : 'btn-dt-secondary'}`}
            >
              {st || 'All Reviews'}
            </button>
          ))}
        </div>
      </div>

      <div className="row g-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="col-md-6">
            <div className="dt-card p-4 h-100">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h6 className="fw-bold text-dark mb-0">{rev.product_name}</h6>
                  <span className="small text-muted">By {rev.reviewer_name} ({rev.reviewer_email})</span>
                </div>
                <span className={`badge ${rev.status === 'Approved' ? 'bg-success' : rev.status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                  {rev.status}
                </span>
              </div>

              <div className="d-flex text-warning mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < rev.rating ? '#F59E0B' : 'none'} color="#F59E0B" />
                ))}
              </div>

              <p className="small text-muted mb-3">{rev.comment}</p>

              {rev.image_url && (
                <img src={rev.image_url} alt="Review photo" className="rounded-3 mb-3" width="65" height="65" style={{ objectFit: 'cover' }} />
              )}

              <div className="d-flex gap-2 pt-2 border-top">
                <button 
                  onClick={() => handleUpdateStatus(rev.id, 'Approved')} 
                  disabled={rev.status === 'Approved'}
                  className="btn btn-sm btn-outline-success d-flex align-items-center gap-1 flex-grow-1 justify-content-center"
                >
                  <CheckCircle size={16} /> Approve
                </button>
                <button 
                  onClick={() => handleUpdateStatus(rev.id, 'Rejected')} 
                  disabled={rev.status === 'Rejected'}
                  className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 flex-grow-1 justify-content-center"
                >
                  <XCircle size={16} /> Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReviews;
