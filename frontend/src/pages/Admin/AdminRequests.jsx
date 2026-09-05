import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Check, Send, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import { formatDateTime } from '../../utils/formatters';

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const [respondingReq, setRespondingReq] = useState(null);
  const [respStatus, setRespStatus] = useState('Reviewed');
  const [adminResponseText, setAdminResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const url = statusFilter ? `/requests/admin/all?status=${statusFilter}` : '/requests/admin/all';
      const res = await api.get(url);
      if (res.data.success) {
        setRequests(res.data.requests || []);
      }
    } catch (err) {
      console.error('Fetch Admin Requests Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const handleSendResponse = async (e) => {
    e.preventDefault();
    if (!respondingReq) return;

    try {
      setSubmitting(true);
      const res = await api.put(`/requests/${respondingReq.id}/respond`, {
        status: respStatus,
        admin_response: adminResponseText
      });
      if (res.data.success) {
        setRespondingReq(null);
        setAdminResponseText('');
        fetchRequests();
      }
    } catch (err) {
      alert('Failed to send response.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-purple" style={{ color: '#7C3AED' }} role="status"></div>
        <p className="text-muted mt-2">Loading Gift Requests...</p>
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
          <h2 className="fw-bold text-dark mb-1">Product Request & Feedback Queue</h2>
          <p className="text-muted small mb-0">Customer gift ideas submitted via "Can't find what you're imagining?"</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {['', 'Submitted', 'Reviewed', 'Planned', 'Not Planned'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`btn btn-sm rounded-pill px-3 fw-semibold ${statusFilter === st ? 'btn-dt-primary' : 'btn-dt-secondary'}`}
            >
              {st || 'All Requests'}
            </button>
          ))}
        </div>
      </div>

      <div className="row g-4">
        {requests.map((req) => {
          const formattedBudget = req.budget_range 
            ? (req.budget_range.includes('$') ? req.budget_range.replace(/\$/g, '₹') : req.budget_range)
            : 'N/A';

          return (
            <div key={req.id} className="col-12">
              <div className="dt-card p-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start mb-3 gap-2 border-bottom pb-3">
                  <div>
                    <h5 className="fw-bold text-dark mb-1">{req.title || 'Custom Gift Request'}</h5>
                    <div className="small text-muted">
                      Submitted by <strong className="text-dark">{req.customer_name}</strong> ({req.customer_email} &bull; {req.customer_phone})
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <span className={`badge ${req.status === 'Planned' ? 'bg-success' : req.status === 'Reviewed' ? 'bg-info' : req.status === 'Not Planned' ? 'bg-secondary' : 'bg-warning text-dark'}`}>
                      {req.status}
                    </span>
                    <button 
                      onClick={() => {
                        setRespondingReq(req);
                        setRespStatus(req.status === 'Submitted' ? 'Reviewed' : req.status);
                        setAdminResponseText(req.admin_response || '');
                      }} 
                      className="btn btn-sm btn-dt-primary"
                    >
                      Respond / Update
                    </button>
                  </div>
                </div>

                {/* Customer Request / Message Box */}
                <div className="p-3 bg-light rounded-3 mb-3 border">
                  <div className="fw-bold text-purple-dark small mb-1" style={{ color: '#4C1D95', fontSize: '0.78rem', letterSpacing: '0.5px' }}>
                    REQUEST / CUSTOMER MESSAGE:
                  </div>
                  <p className="text-dark small mb-0" style={{ whiteSpace: 'pre-wrap' }}>{req.description}</p>
                </div>
                
                <div className="d-flex flex-wrap gap-4 text-muted small mb-3">
                  <div>Budget Range: <strong className="text-dark">{formattedBudget}</strong></div>
                  <div>Submitted Date: <strong className="text-dark">{formatDateTime(req.created_at)}</strong></div>
                </div>

                {req.reference_image_url && (
                  <div className="mb-3 p-3 bg-white border rounded-3 d-flex align-items-center justify-content-between gap-3">
                    <div className="d-flex align-items-center gap-3">
                      <img src={req.reference_image_url} alt="Reference" className="rounded-3 border" width="60" height="60" style={{ objectFit: 'cover' }} />
                      <div>
                        <span className="small fw-bold text-dark d-block">Reference Photo</span>
                        <a href={req.reference_image_url} target="_blank" rel="noopener noreferrer" className="small text-purple text-decoration-none" style={{ color: '#7C3AED' }}>
                          View Original Image ↗
                        </a>
                      </div>
                    </div>
                    <a 
                      href={req.reference_image_url} 
                      download 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-sm btn-outline-purple py-1 px-3 rounded-2"
                      style={{ color: '#7C3AED', borderColor: '#DDD6FE' }}
                    >
                      Download Photo
                    </a>
                  </div>
                )}

                {req.admin_response && (
                  <div className="p-3 rounded-3 bg-light border-start border-4 border-purple mt-3">
                    <div className="fw-bold small text-purple-dark" style={{ color: '#4C1D95' }}>Admin Response:</div>
                    <p className="small text-muted mb-0">{req.admin_response}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Response Modal */}
      {respondingReq && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 p-3">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Respond to Request "{respondingReq.title}"</h5>
                <button type="button" className="btn-close" onClick={() => setRespondingReq(null)}></button>
              </div>
              <form onSubmit={handleSendResponse}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Status *</label>
                    <select 
                      className="form-select rounded-3"
                      value={respStatus}
                      onChange={(e) => setRespStatus(e.target.value)}
                    >
                      <option value="Reviewed">Reviewed</option>
                      <option value="Planned">Planned</option>
                      <option value="Not Planned">Not Planned</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Admin Response Message *</label>
                    <textarea 
                      className="form-control rounded-3" 
                      rows="4"
                      placeholder="Write your response to the customer regarding their custom gift idea..."
                      value={adminResponseText}
                      onChange={(e) => setAdminResponseText(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-light" onClick={() => setRespondingReq(null)}>Cancel</button>
                  <button type="submit" className="btn-dt-primary" disabled={submitting}>
                    {submitting ? 'Sending...' : 'Send Response'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRequests;
