import React, { useEffect, useState } from 'react';
import { MessageSquare, Check, Send } from 'lucide-react';
import api from '../../services/api';

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
        {requests.map((req) => (
          <div key={req.id} className="col-12">
            <div className="dt-card p-4">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start mb-3 gap-2">
                <div>
                  <h5 className="fw-bold text-dark mb-1">{req.title}</h5>
                  <div className="small text-muted">
                    Submitted by <strong>{req.customer_name}</strong> ({req.customer_email} &bull; {req.customer_phone})
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

              <p className="text-dark small mb-2">{req.description}</p>
              
              <div className="d-flex flex-wrap gap-3 text-muted small mb-3">
                <span>Budget: <strong>{req.budget_range || 'N/A'}</strong></span>
                <span>Submitted: <strong>{new Date(req.created_at).toLocaleDateString()}</strong></span>
              </div>

              {req.reference_image_url && (
                <div className="mb-3">
                  <span className="small fw-semibold text-muted d-block mb-1">Reference Photo:</span>
                  <img src={req.reference_image_url} alt="Reference" className="rounded-3 border" width="100" height="100" style={{ objectFit: 'cover' }} />
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
        ))}
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
                      <option value="Planned">Planned (In Crafting Pipeline)</option>
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
