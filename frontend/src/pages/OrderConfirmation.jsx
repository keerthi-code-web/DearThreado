import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Heart } from 'lucide-react';
import api from '../services/api';

const OrderConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    if (!order) {
      api.get(`/orders/${id}`)
        .then(res => {
          if (res.data.success) setOrder(res.data.order);
        })
        .catch(err => console.error('Fetch Order Error:', err))
        .finally(() => setLoading(false));
    }
  }, [id, order]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-purple" style={{ color: '#7C3AED' }} role="status"></div>
        <p className="text-muted mt-2">Finalizing your order...</p>
      </div>
    );
  }

  return (
    <div className="container py-5 text-center">
      <div className="max-w-600 mx-auto dt-card p-5">
        <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ backgroundColor: '#FAF8FF', color: '#7C3AED' }}>
          <CheckCircle size={56} />
        </div>

        <h2 className="fw-extrabold text-dark mb-2">Thank You for Your Order!</h2>
        <p className="text-muted lead fs-6 mb-4">
          Your handmade gift order has been received with love and is officially placed!
        </p>

        {order && (
          <div className="p-3 rounded-4 mb-4 text-start" style={{ backgroundColor: '#FAF8FF', border: '1px solid #EDE9FE' }}>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Order Number:</span>
              <span className="fw-bold text-dark">{order.order_number}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Total Amount:</span>
              <span className="fw-bold text-purple-primary" style={{ color: '#7C3AED' }}>${parseFloat(order.total_amount).toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Payment Method:</span>
              <span className="badge bg-light text-dark border">Cash on Delivery (Pending)</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-muted">Status:</span>
              <span className="badge bg-purple text-white" style={{ backgroundColor: '#7C3AED' }}>{order.status || 'Placed'}</span>
            </div>
          </div>
        )}

        <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
          <Link to={`/orders/${id}`} className="btn-dt-primary">
            <Package size={18} /> View & Track Order
          </Link>
          <Link to="/" className="btn-dt-secondary">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
