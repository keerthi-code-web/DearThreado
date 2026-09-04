import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, FolderTree, Star, MessageSquare, DollarSign, Users, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard/stats')
      .then(res => {
        if (res.data.success) setData(res.data);
      })
      .catch(err => console.error('Admin Dashboard Error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-purple" style={{ color: '#7C3AED' }} role="status"></div>
        <p className="text-muted mt-2">Loading Admin Dashboard...</p>
      </div>
    );
  }

  const stats = data?.stats || {};

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
        <div>
          <h2 className="fw-bold text-dark mb-1">Admin Management Portal</h2>
          <p className="text-muted small mb-0">Overview of DearThreado store performance & requests</p>
        </div>

        {/* Admin Navigation Quick Links */}
        <div className="d-flex flex-wrap gap-2">
          <Link to="/admin/categories" className="btn btn-sm btn-outline-purple">
            <FolderTree size={16} /> Categories
          </Link>
          <Link to="/admin/products" className="btn btn-sm btn-outline-purple">
            <ShoppingBag size={16} /> Products
          </Link>
          <Link to="/admin/orders" className="btn btn-sm btn-outline-purple">
            <Package size={16} /> Orders ({stats.new_orders || 0})
          </Link>
          <Link to="/admin/reviews" className="btn btn-sm btn-outline-purple">
            <Star size={16} /> Reviews ({stats.pending_reviews || 0})
          </Link>
          <Link to="/admin/requests" className="btn btn-sm btn-outline-purple">
            <MessageSquare size={16} /> Requests ({stats.pending_requests || 0})
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="row g-3 mb-5">
        <div className="col-6 col-md-3">
          <div className="dt-card p-3 border-start border-4 border-purple">
            <div className="text-muted small">Total Revenue</div>
            <div className="fs-4 fw-bold text-dark">₹{stats.total_revenue?.toFixed(2) || '0.00'}</div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="dt-card p-3 border-start border-4 border-warning">
            <div className="text-muted small">New Orders</div>
            <div className="fs-4 fw-bold text-dark">{stats.new_orders || 0}</div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="dt-card p-3 border-start border-4 border-info">
            <div className="text-muted small">Pending Requests</div>
            <div className="fs-4 fw-bold text-dark">{stats.pending_requests || 0}</div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="dt-card p-3 border-start border-4 border-success">
            <div className="text-muted small">Delivered Orders</div>
            <div className="fs-4 fw-bold text-dark">{stats.delivered_orders || 0}</div>
          </div>
        </div>
      </div>

      {/* Recent Orders & Recent Requests */}
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="dt-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-dark mb-0">Recent Orders</h5>
              <Link to="/admin/orders" className="small text-purple-primary fw-bold text-decoration-none" style={{ color: '#7C3AED' }}>View All &rarr;</Link>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle small">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.recent_orders?.map((ord) => (
                    <tr key={ord.id}>
                      <td className="fw-bold">{ord.order_number}</td>
                      <td>{ord.customer_name}</td>
                      <td className="fw-bold">₹{parseFloat(ord.total_amount).toFixed(2)}</td>
                      <td><StatusBadge status={ord.status} /></td>
                      <td>
                        <Link to="/admin/orders" className="btn btn-sm btn-light">Manage</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="dt-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-dark mb-0">Recent Custom Gift Requests</h5>
              <Link to="/admin/requests" className="small text-purple-primary fw-bold text-decoration-none" style={{ color: '#7C3AED' }}>View All &rarr;</Link>
            </div>

            <div className="divide-y">
              {data?.recent_requests?.map((req) => (
                <div key={req.id} className="py-2 border-bottom">
                  <div className="fw-bold text-dark">{req.title}</div>
                  <div className="small text-muted">{req.customer_name} &bull; <span className="badge bg-light text-dark">{req.status}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
