import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, Truck, Calendar, MapPin, AlertTriangle, Star, Sparkles, XCircle, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Review submission state
  const [reviewProduct, setReviewProduct] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/${id}`);
      if (res.data.success) {
        setOrder(res.data.order);
      }
    } catch (err) {
      console.error('Fetch Order Detail Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      const res = await api.post(`/orders/${id}/cancel`, { reason: cancelReason });
      if (res.data.success) {
        setShowCancelModal(false);
        fetchOrder();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setCancelling(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewProduct) return;

    try {
      setSubmittingReview(true);
      const res = await api.post('/reviews', {
        product_id: reviewProduct.product_id,
        rating: reviewRating,
        comment: reviewComment
      });

      if (res.data.success) {
        alert('Review submitted! It will appear publicly after admin moderation.');
        setReviewProduct(null);
        setReviewComment('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-purple" style={{ color: '#7C3AED' }} role="status"></div>
        <p className="text-muted mt-2">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <h4>Order not found</h4>
        <Link to="/my-orders" className="btn btn-dt-primary mt-3">Back to My Orders</Link>
      </div>
    );
  }

  const steps = ['Placed', 'Confirmed', 'Preparing', 'Shipped', 'Delivered'];
  const currentStepIdx = steps.indexOf(order.status);
  const isCancelled = order.status === 'Cancelled';
  const canCancel = order.status === 'Placed' || order.status === 'Confirmed';
  const isDelivered = order.status === 'Delivered';

  return (
    <div className="container py-5">
      <Link to="/my-orders" className="text-decoration-none text-muted small d-inline-flex align-items-center gap-1 mb-4">
        <ArrowLeft size={16} /> Back to My Orders
      </Link>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Order #{order.order_number}</h2>
          <span className="text-muted small">Placed on {new Date(order.created_at).toLocaleString()}</span>
        </div>
        <div className="d-flex align-items-center gap-3">
          <StatusBadge status={order.status} />
          {canCancel && (
            <button onClick={() => setShowCancelModal(true)} className="btn btn-sm btn-outline-danger rounded-pill">
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Status Progress Timeline */}
      {!isCancelled ? (
        <div className="dt-card p-4 mb-4">
          <h6 className="fw-bold text-dark mb-4">Order Progress</h6>
          <div className="d-flex justify-content-between position-relative px-2">
            <div className="position-absolute top-50 start-0 end-0 translate-middle-y bg-light" style={{ height: '4px', zIndex: 1 }}></div>
            <div 
              className="position-absolute top-50 start-0 translate-middle-y" 
              style={{ 
                height: '4px', 
                backgroundColor: '#7C3AED', 
                width: `${Math.max(0, (currentStepIdx / (steps.length - 1)) * 100)}%`, 
                zIndex: 1, 
                transition: 'width 0.5s ease' 
              }}
            ></div>

            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStepIdx;
              return (
                <div key={step} className="text-center position-relative" style={{ zIndex: 2 }}>
                  <div 
                    className={`rounded-circle d-inline-flex align-items-center justify-content-center border fw-bold small mb-2 ${isCompleted ? 'bg-purple text-white border-purple' : 'bg-white text-muted border-secondary'}`}
                    style={{ width: '36px', height: '36px', backgroundColor: isCompleted ? '#7C3AED' : '#ffffff', borderColor: isCompleted ? '#7C3AED' : '#CBD5E1' }}
                  >
                    {idx + 1}
                  </div>
                  <div className={`small fw-semibold ${isCompleted ? 'text-purple-dark' : 'text-muted'}`}>
                    {step}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="alert alert-danger rounded-4 mb-4 p-3 d-flex align-items-center gap-3">
          <XCircle size={24} />
          <div>
            <div className="fw-bold">This order has been cancelled.</div>
            {order.cancellation_reason && <div className="small">Reason: {order.cancellation_reason}</div>}
          </div>
        </div>
      )}

      <div className="row g-4">
        {/* Order Items */}
        <div className="col-lg-8">
          <div className="dt-card p-4 mb-4">
            <h5 className="fw-bold text-dark mb-3">Order Items</h5>

            <div className="divide-y">
              {order.items?.map((item) => (
                <div key={item.id} className="py-3 border-bottom d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <img 
                      src={item.primary_image || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=200&q=80'} 
                      alt={item.product_name}
                      className="rounded-3 object-fit-cover"
                      width="70"
                      height="70"
                    />
                    <div>
                      <h6 className="fw-bold text-dark mb-1">{item.product_name}</h6>
                      <div className="small text-muted">₹{parseFloat(item.product_price).toFixed(2)} x {item.quantity}</div>

                      {item.customization_values && Object.keys(item.customization_values).length > 0 && (
                        <div className="p-2 rounded bg-light small mt-2 border text-muted">
                          <strong className="text-purple-dark" style={{ color: '#4C1D95' }}>Customization:</strong>
                          {Object.entries(item.customization_values).map(([k, v]) => (
                            <div key={k}><span>{k}:</span> {String(v)}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-sm-end">
                    <div className="fw-bold text-dark mb-2">₹{parseFloat(item.subtotal).toFixed(2)}</div>
                    {isDelivered && (
                      <button 
                        onClick={() => setReviewProduct(item)}
                        className="btn btn-sm btn-outline-purple rounded-pill"
                        style={{ color: '#7C3AED', borderColor: '#7C3AED' }}
                      >
                        <Star size={14} className="me-1" /> Write Review
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Details Sidebar */}
        <div className="col-lg-4">
          <div className="dt-card p-4 mb-4">
            <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <MapPin size={18} color="#7C3AED" /> Preserved Delivery Address
            </h6>

            <p className="small text-dark mb-1 fw-semibold">{order.customer_name}</p>
            <p className="small text-muted mb-1">{order.customer_phone}</p>
            <p className="small text-muted mb-1">{order.customer_email}</p>
            <p className="small text-muted mb-0">{order.shipping_street}, {order.shipping_city}, {order.shipping_state} - {order.shipping_zip}</p>

            <hr />

            <div className="small text-muted mb-1 d-flex justify-content-between">
              <span>Requested Delivery Date:</span>
              <span className="fw-bold text-dark">{new Date(order.requested_delivery_date).toLocaleDateString()}</span>
            </div>

            {order.actual_delivery_date && (
              <div className="small text-muted mb-1 d-flex justify-content-between">
                <span>Actual Delivery Date:</span>
                <span className="fw-bold text-success">{new Date(order.actual_delivery_date).toLocaleDateString()}</span>
              </div>
            )}

            <div className="small text-muted d-flex justify-content-between">
              <span>Payment Method:</span>
              <span className="fw-bold text-dark">COD ({order.payment_status})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Cancellation Modal */}
      {showCancelModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Cancel Order #{order.order_number}</h5>
                <button type="button" className="btn-close" onClick={() => setShowCancelModal(false)}></button>
              </div>
              <div className="modal-body">
                <p className="small text-muted mb-3">
                  Cancellation is permitted before your handmade order enters the "Preparing" phase. Please let us know the reason for cancellation:
                </p>
                <textarea 
                  className="form-control rounded-3" 
                  rows="3" 
                  placeholder="Reason for cancellation..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                ></textarea>
              </div>
              <div className="modal-footer border-0">
                <button className="btn btn-light" onClick={() => setShowCancelModal(false)}>Keep Order</button>
                <button className="btn btn-danger" onClick={handleCancelOrder} disabled={cancelling}>
                  {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Submission Modal */}
      {reviewProduct && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 p-3">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Review "{reviewProduct.product_name}"</h5>
                <button type="button" className="btn-close" onClick={() => setReviewProduct(null)}></button>
              </div>
              <form onSubmit={handleSubmitReview}>
                <div className="modal-body">
                  <div className="mb-3 text-center">
                    <label className="form-label small fw-semibold text-muted d-block">Rating</label>
                    <div className="d-flex justify-content-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="btn btn-link p-0 text-warning border-0"
                        >
                          <Star size={32} fill={star <= reviewRating ? '#F59E0B' : 'none'} color="#F59E0B" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Your Review Comment *</label>
                    <textarea 
                      className="form-control rounded-3" 
                      rows="4"
                      placeholder="How was your handmade gifting experience? Describe the item and quality..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-light" onClick={() => setReviewProduct(null)}>Cancel</button>
                  <button type="submit" className="btn-dt-primary" disabled={submittingReview}>
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
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

export default OrderDetail;
