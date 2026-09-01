import React, { useEffect, useState } from 'react';
import { Package, Calendar, CheckCircle, AlertTriangle, Eye, XCircle } from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [adminCancelReason, setAdminCancelReason] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = statusFilter ? `/orders/admin/all?status=${statusFilter}` : '/orders/admin/all';
      const res = await api.get(url);
      if (res.data.success) {
        setOrders(res.data.orders || []);
      }
    } catch (err) {
      console.error('Fetch Admin Orders Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status.');
    }
  };

  const handleUpdatePayment = async (orderId, paymentStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/payment`, { payment_status: paymentStatus });
      if (res.data.success) {
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, payment_status: paymentStatus });
        }
      }
    } catch (err) {
      alert('Failed to update payment status.');
    }
  };

  const handleAdminCancelOrder = async () => {
    if (!adminCancelReason) {
      alert('Cancellation reason is required.');
      return;
    }

    try {
      const res = await api.post(`/orders/${cancelModalOrder.id}/admin-cancel`, { cancellation_reason: adminCancelReason });
      if (res.data.success) {
        setCancelModalOrder(null);
        setAdminCancelReason('');
        fetchOrders();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order.');
    }
  };

  const openOrderDetail = async (orderId) => {
    try {
      const res = await api.get(`/orders/${orderId}`);
      if (res.data.success) {
        setSelectedOrder(res.data.order);
        setShowDetailModal(true);
      }
    } catch (err) {
      alert('Failed to load order details.');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-purple" style={{ color: '#7C3AED' }} role="status"></div>
        <p className="text-muted mt-2">Loading Orders...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Order Management & Tracking</h2>
          <p className="text-muted small mb-0">Manage customer order status, Cash on Delivery payments, and delivery details</p>
        </div>

        {/* Status Filter Pills */}
        <div className="d-flex align-items-center gap-2 overflow-x-auto">
          {['', 'Placed', 'Confirmed', 'Preparing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`btn btn-sm rounded-pill px-3 fw-semibold ${statusFilter === st ? 'btn-dt-primary' : 'btn-dt-secondary'}`}
            >
              {st || 'All Orders'}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="dt-card p-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle small">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Delivery Date</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Advance Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord.id}>
                  <td className="fw-bold">{ord.order_number}</td>
                  <td>
                    <div className="fw-semibold text-dark">{ord.customer_name}</div>
                    <div className="text-muted">{ord.customer_phone}</div>
                  </td>
                  <td>{new Date(ord.requested_delivery_date).toLocaleDateString()}</td>
                  <td className="fw-bold" style={{ color: '#7C3AED' }}>${parseFloat(ord.total_amount).toFixed(2)}</td>
                  <td>
                    <select
                      className="form-select form-select-sm rounded-2"
                      value={ord.payment_status}
                      onChange={(e) => handleUpdatePayment(ord.id, e.target.value)}
                    >
                      <option value="Pending">Pending (COD)</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </td>
                  <td><StatusBadge status={ord.status} /></td>
                  <td>
                    {ord.status !== 'Cancelled' && ord.status !== 'Delivered' && (
                      <select 
                        className="form-select form-select-sm rounded-2"
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                      >
                        <option value="Placed" disabled={ord.status !== 'Placed'}>Placed</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <button onClick={() => openOrderDetail(ord.id)} className="btn btn-sm btn-light" title="View details">
                        <Eye size={16} />
                      </button>
                      {ord.status !== 'Cancelled' && ord.status !== 'Delivered' && (
                        <button onClick={() => setCancelModalOrder(ord)} className="btn btn-sm btn-light text-danger" title="Admin Cancel">
                          <XCircle size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 p-3">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Order Details #{selectedOrder.order_number}</h5>
                <button type="button" className="btn-close" onClick={() => setShowDetailModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <h6 className="fw-bold text-dark mb-1">Customer Info</h6>
                    <div className="small text-muted">{selectedOrder.customer_name} ({selectedOrder.customer_email})</div>
                    <div className="small text-muted">Phone: {selectedOrder.customer_phone}</div>
                  </div>

                  <div className="col-md-6">
                    <h6 className="fw-bold text-dark mb-1">Shipping Address</h6>
                    <div className="small text-muted">{selectedOrder.shipping_street}, {selectedOrder.shipping_city}, {selectedOrder.shipping_state} - {selectedOrder.shipping_zip}</div>
                  </div>
                </div>

                <h6 className="fw-bold text-dark mb-2">Items & Customization Snapshots</h6>
                <div className="divide-y max-h-250 overflow-y-auto mb-3">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="py-2 border-bottom d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold small">{item.product_name} x {item.quantity}</div>
                        {item.customization_values && Object.keys(item.customization_values).length > 0 && (
                          <div className="small text-muted fst-italic">
                            {Object.entries(item.customization_values).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                          </div>
                        )}
                      </div>
                      <div className="fw-bold small">${parseFloat(item.subtotal).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Cancel Modal */}
      {cancelModalOrder && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 p-3">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Admin Cancel Order #{cancelModalOrder.order_number}</h5>
                <button type="button" className="btn-close" onClick={() => setCancelModalOrder(null)}></button>
              </div>
              <div className="modal-body">
                <label className="form-label small fw-semibold">Cancellation Reason (Required) *</label>
                <textarea 
                  className="form-control rounded-3" 
                  rows="3"
                  placeholder="Provide reason for cancellation due to fulfillment/stock issue..."
                  value={adminCancelReason}
                  onChange={(e) => setAdminCancelReason(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="modal-footer border-0">
                <button className="btn btn-light" onClick={() => setCancelModalOrder(null)}>Close</button>
                <button className="btn btn-danger" onClick={handleAdminCancelOrder}>Confirm Cancellation</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
