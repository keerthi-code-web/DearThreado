import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Calendar, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_name: user?.name || '',
    customer_email: user?.email || '',
    customer_phone: user?.phone || '',
    shipping_street: user?.street_address || '',
    shipping_city: user?.city || '',
    shipping_state: user?.state || '',
    shipping_zip: user?.zip_code || '',
    requested_delivery_date: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customer_name: user.name || prev.customer_name,
        customer_email: user.email || prev.customer_email,
        customer_phone: user.phone || prev.customer_phone,
        shipping_street: user.street_address || prev.shipping_street,
        shipping_city: user.city || prev.shipping_city,
        shipping_state: user.state || prev.shipping_state,
        shipping_zip: user.zip_code || prev.shipping_zip
      }));
    }
  }, [user]);

  if (!cartItems || cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setSubmitting(true);
      const res = await api.post('/orders', {
        ...formData,
        items: cartItems.map(item => ({
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          customization_values: item.customization_values
        }))
      });

      if (res.data.success) {
        navigate(`/order-confirmation/${res.data.order.id}`, { state: { order: res.data.order } });
      }
    } catch (err) {
      console.error('Checkout Error:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Min delivery date: tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  return (
    <div className="container py-5">
      <div className="max-w-900 mx-auto">
        <h2 className="fw-bold text-dark mb-4 text-center">Complete Your Handmade Gift Order</h2>

        {error && (
          <div className="alert alert-danger rounded-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            {/* Delivery Information Form */}
            <div className="col-lg-7">
              <div className="dt-card p-4">
                <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                  <Truck size={20} color="#7C3AED" /> Delivery & Recipient Information
                </h5>

                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label small fw-semibold">Recipient / Contact Name *</label>
                    <input 
                      type="text" 
                      className="form-control rounded-3" 
                      name="customer_name" 
                      value={formData.customer_name} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Email Address *</label>
                    <input 
                      type="email" 
                      className="form-control rounded-3" 
                      name="customer_email" 
                      value={formData.customer_email} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Phone Number *</label>
                    <input 
                      type="tel" 
                      className="form-control rounded-3" 
                      name="customer_phone" 
                      value={formData.customer_phone} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold">Street Address *</label>
                    <textarea 
                      className="form-control rounded-3" 
                      rows="2" 
                      name="shipping_street" 
                      value={formData.shipping_street} 
                      onChange={handleChange} 
                      required 
                    ></textarea>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">City *</label>
                    <input 
                      type="text" 
                      className="form-control rounded-3" 
                      name="shipping_city" 
                      value={formData.shipping_city} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">State / Province *</label>
                    <input 
                      type="text" 
                      className="form-control rounded-3" 
                      name="shipping_state" 
                      value={formData.shipping_state} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Zip / Postal Code *</label>
                    <input 
                      type="text" 
                      className="form-control rounded-3" 
                      name="shipping_zip" 
                      value={formData.shipping_zip} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>

                  <div className="col-12 mt-4 pt-3 border-top">
                    <label className="form-label small fw-semibold d-flex align-items-center gap-1">
                      <Calendar size={16} color="#7C3AED" /> Requested Delivery Date *
                    </label>
                    <input 
                      type="date" 
                      className="form-control rounded-3" 
                      name="requested_delivery_date" 
                      min={minDateStr}
                      value={formData.requested_delivery_date} 
                      onChange={handleChange} 
                      required 
                    />
                    <div className="form-text small text-muted">
                      Please allow sufficient crafting time for customized items.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary & COD Confirmation */}
            <div className="col-lg-5">
              <div className="dt-card p-4 mb-4">
                <h5 className="fw-bold text-dark mb-3">Order Summary ({cartItems.length} items)</h5>

                <div className="divide-y max-h-250 overflow-y-auto pe-1 mb-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                      <div>
                        <div className="fw-semibold small text-dark">{item.product_name} x {item.quantity}</div>
                        {item.customization_values && Object.keys(item.customization_values).length > 0 && (
                          <div className="small text-muted fst-italic">Customized</div>
                        )}
                      </div>
                      <div className="fw-bold small text-dark">${(parseFloat(item.unit_price) * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: '#FAF8FF', border: '1px solid #EDE9FE' }}>
                  <div className="d-flex align-items-center gap-2 text-purple-dark fw-bold mb-1" style={{ color: '#4C1D95' }}>
                    <ShieldCheck size={18} /> Payment Method: Cash on Delivery (COD)
                  </div>
                  <p className="small text-muted mb-0">
                    Payment status will remain <strong>Pending</strong> until delivery verification. You pay upon receiving your handmade package!
                  </p>
                </div>

                <div className="d-flex justify-content-between fs-5 fw-extrabold text-dark my-3">
                  <span>Total Amount:</span>
                  <span style={{ color: '#7C3AED' }}>${cartTotal.toFixed(2)}</span>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn-dt-primary w-100 justify-content-center py-3 fs-6"
                >
                  {submitting ? (
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                  ) : (
                    <>
                      <Heart size={18} fill="#ffffff" /> Confirm & Place COD Order
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
