import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Calendar } from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { formatDateTime, formatDate } from '../utils/formatters';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my-orders')
      .then(res => {
        if (res.data.success) setOrders(res.data.orders || []);
      })
      .catch(err => console.error('Get My Orders Error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-purple" style={{ color: '#7C3AED' }} role="status"></div>
        <p className="text-muted mt-2">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold text-dark mb-4">My Orders</h2>

      {orders.length === 0 ? (
        <div className="dt-card p-5 text-center max-w-600 mx-auto">
          <div className="d-inline-flex p-3 rounded-circle bg-lavender mb-3" style={{ backgroundColor: '#FAF8FF', color: '#7C3AED' }}>
            <Package size={48} />
          </div>
          <h4 className="fw-bold text-dark mb-2">No Orders Found</h4>
          <p className="text-muted mb-4">You haven't placed any orders yet. Choose a special handmade gift for someone dear today!</p>
          <Link to="/" className="btn-dt-primary">
            Explore Catalog <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {orders.map((order) => (
            <div key={order.id} className="dt-card p-4">
              <div className="row align-items-center g-3">
                <div className="col-md-3">
                  <div className="fw-bold text-dark fs-6">{order.order_number}</div>
                  <div className="small text-muted d-flex align-items-center gap-1 mt-1">
                    <Calendar size={14} /> Placed on {formatDateTime(order.created_at)}
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="small text-muted">Delivery Dates</div>
                  <div className="fw-medium small text-dark">Req: {formatDate(order.requested_delivery_date)}</div>
                  {order.actual_delivery_date && (
                    <div className="small text-success fw-bold">Delivered: {formatDate(order.actual_delivery_date)}</div>
                  )}
                </div>

                <div className="col-6 col-md-2">
                  <div className="small text-muted">Total Amount</div>
                  <div className="fw-bold" style={{ color: '#7C3AED' }}>₹{parseFloat(order.total_amount).toFixed(2)}</div>
                </div>

                <div className="col-6 col-md-2">
                  <StatusBadge status={order.status} />
                </div>

                <div className="col-md-2 text-md-end">
                  <Link to={`/orders/${order.id}`} className="btn btn-sm btn-dt-secondary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
