import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderTree, 
  ShoppingBag, 
  Package, 
  Star, 
  MessageSquare, 
  IndianRupee, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
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

  const modules = [
    {
      id: 'categories',
      title: 'Categories',
      description: "Manage the store's product categories and subcategories.",
      icon: FolderTree,
      path: '/admin/categories',
      accent: '#7C3AED',
      bg: '#FAF8FF',
      countLabel: `${stats.total_categories || 0} Categories`
    },
    {
      id: 'products',
      title: 'Products',
      description: 'Manage handmade products, details and availability.',
      icon: ShoppingBag,
      path: '/admin/products',
      accent: '#4F46E5',
      bg: '#F5F3FF',
      countLabel: `${stats.total_products || 0} Active Products`
    },
    {
      id: 'orders',
      title: 'Orders',
      description: 'View and manage customer orders and order status.',
      icon: Package,
      path: '/admin/orders',
      accent: '#10B981',
      bg: '#ECFDF5',
      countLabel: `${stats.total_orders || 0} Total Orders (${stats.new_orders || 0} New)`
    },
    {
      id: 'reviews',
      title: 'Reviews',
      description: 'Monitor customer reviews and ratings.',
      icon: Star,
      path: '/admin/reviews',
      accent: '#F59E0B',
      bg: '#FFFBEB',
      countLabel: `${stats.pending_reviews || 0} Pending Moderation`
    },
    {
      id: 'requests',
      title: 'Requests',
      description: 'Manage custom gift requests submitted by customers.',
      icon: MessageSquare,
      path: '/admin/requests',
      accent: '#3B82F6',
      bg: '#EFF6FF',
      countLabel: `${stats.pending_requests || 0} Open Requests`
    }
  ];

  return (
    <div className="container py-4 py-md-5">
      {/* SECTION 1: Admin Hero Section */}
      <div 
        className="rounded-4 p-4 p-md-5 mb-5 position-relative overflow-hidden shadow-sm"
        style={{ 
          background: 'linear-gradient(135deg, #4C1D95 0%, #6D28D9 50%, #7C3AED 100%)', 
          color: '#ffffff' 
        }}
      >
        <div className="position-relative" style={{ zIndex: 2 }}>
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill mb-3 border border-white-20" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)' }}>
            <ShieldCheck size={16} color="#FDE047" />
            <span className="small fw-semibold text-white">Central Operations Command</span>
          </div>

          <h1 className="display-6 fw-extrabold mb-2" style={{ letterSpacing: '-0.5px' }}>
            Admin Management Portal
          </h1>
          <p className="lead mb-0 text-white-80" style={{ fontSize: '1.05rem', maxWidth: '650px' }}>
            Overview of DearThreado store performance &amp; requests
          </p>
        </div>

        {/* Decorative subtle background thread element */}
        <div className="position-absolute end-0 bottom-0 opacity-10 pe-4 pb-2 d-none d-md-block pointer-events-none">
          <Sparkles size={180} color="#ffffff" />
        </div>
      </div>

      {/* SECTION 2: Six Primary Admin Statistics */}
      <div className="mb-5">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <Sparkles size={18} color="#7C3AED" /> Store Performance Metrics
          </h5>
          <span className="small text-muted">Real-time store metrics</span>
        </div>

        <div className="row g-3">
          {/* 1. Total Revenue */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="dt-card p-4 h-100 border-start border-4" style={{ borderColor: '#7C3AED', backgroundColor: '#FAF8FF' }}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="text-muted small fw-semibold text-uppercase" style={{ letterSpacing: '0.5px' }}>Total Revenue</span>
                <div className="p-2 rounded-circle bg-white shadow-sm" style={{ color: '#7C3AED' }}>
                  <IndianRupee size={20} />
                </div>
              </div>
              <div className="fs-3 fw-extrabold text-dark mb-1">
                ₹{stats.total_revenue ? stats.total_revenue.toFixed(2) : '0.00'}
              </div>
              <span className="small text-muted">Completed &amp; paid store orders</span>
            </div>
          </div>

          {/* 2. New Orders */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="dt-card p-4 h-100 border-start border-4" style={{ borderColor: '#F59E0B', backgroundColor: '#FFFBEB' }}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="text-muted small fw-semibold text-uppercase" style={{ letterSpacing: '0.5px' }}>New Orders</span>
                <div className="p-2 rounded-circle bg-white shadow-sm" style={{ color: '#F59E0B' }}>
                  <Package size={20} />
                </div>
              </div>
              <div className="fs-3 fw-extrabold text-dark mb-1">
                {stats.new_orders || 0}
              </div>
              <span className="small text-muted">Newly placed orders awaiting dispatch</span>
            </div>
          </div>

          {/* 3. New Requests */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="dt-card p-4 h-100 border-start border-4" style={{ borderColor: '#3B82F6', backgroundColor: '#EFF6FF' }}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="text-muted small fw-semibold text-uppercase" style={{ letterSpacing: '0.5px' }}>New Requests</span>
                <div className="p-2 rounded-circle bg-white shadow-sm" style={{ color: '#3B82F6' }}>
                  <MessageSquare size={20} />
                </div>
              </div>
              <div className="fs-3 fw-extrabold text-dark mb-1">
                {stats.pending_requests || 0}
              </div>
              <span className="small text-muted">Custom gift requests submitted by customers</span>
            </div>
          </div>

          {/* 4. New Reviews */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="dt-card p-4 h-100 border-start border-4" style={{ borderColor: '#EC4899', backgroundColor: '#FDF2F8' }}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="text-muted small fw-semibold text-uppercase" style={{ letterSpacing: '0.5px' }}>New Reviews</span>
                <div className="p-2 rounded-circle bg-white shadow-sm" style={{ color: '#EC4899' }}>
                  <Star size={20} />
                </div>
              </div>
              <div className="fs-3 fw-extrabold text-dark mb-1">
                {stats.pending_reviews || 0}
              </div>
              <span className="small text-muted">Customer product ratings in queue</span>
            </div>
          </div>

          {/* 5. Delivered Orders */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="dt-card p-4 h-100 border-start border-4" style={{ borderColor: '#10B981', backgroundColor: '#ECFDF5' }}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="text-muted small fw-semibold text-uppercase" style={{ letterSpacing: '0.5px' }}>Delivered Orders</span>
                <div className="p-2 rounded-circle bg-white shadow-sm" style={{ color: '#10B981' }}>
                  <CheckCircle2 size={20} />
                </div>
              </div>
              <div className="fs-3 fw-extrabold text-dark mb-1">
                {stats.delivered_orders || 0}
              </div>
              <span className="small text-muted">Successfully fulfilled customer orders</span>
            </div>
          </div>

          {/* 6. Cancelled Orders */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="dt-card p-4 h-100 border-start border-4" style={{ borderColor: '#EF4444', backgroundColor: '#FEF2F2' }}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="text-muted small fw-semibold text-uppercase" style={{ letterSpacing: '0.5px' }}>Cancelled Orders</span>
                <div className="p-2 rounded-circle bg-white shadow-sm" style={{ color: '#EF4444' }}>
                  <XCircle size={20} />
                </div>
              </div>
              <div className="fs-3 fw-extrabold text-dark mb-1">
                {stats.cancelled_orders || 0}
              </div>
              <span className="small text-muted">Cancelled or refunded order requests</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Main Administrative Modules (5 Function Areas) */}
      <div className="mb-5">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h5 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
              <Layers size={18} color="#7C3AED" /> Store Management Modules
            </h5>
            <p className="text-muted small mb-0">Select a management module to control products, orders, and customer interactions</p>
          </div>
        </div>

        <div className="row g-3">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div key={mod.id} className="col-12 col-md-6 col-lg-4">
                <Link 
                  to={mod.path}
                  className="dt-card p-4 h-100 d-flex flex-column justify-content-between text-decoration-none text-dark transition-all hover-elevate border position-relative overflow-hidden"
                  style={{ backgroundColor: '#ffffff', borderColor: '#EDE9FE' }}
                >
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="p-3 rounded-3" style={{ backgroundColor: mod.bg, color: mod.accent }}>
                        <Icon size={24} />
                      </div>
                      <span className="badge rounded-pill fw-semibold" style={{ backgroundColor: mod.bg, color: mod.accent, border: `1px solid ${mod.accent}33` }}>
                        {mod.countLabel}
                      </span>
                    </div>

                    <h5 className="fw-bold text-dark mb-2">{mod.title}</h5>
                    <p className="text-muted small mb-3">{mod.description}</p>
                  </div>

                  <div className="d-flex align-items-center gap-1 fw-bold small mt-2" style={{ color: mod.accent }}>
                    Manage {mod.title} <ChevronRight size={16} />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: Recent Operational Activity */}
      <div className="row g-4 mb-4">
        {/* Recent Orders */}
        <div className="col-lg-7">
          <div className="dt-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold text-dark mb-0">Recent Orders</h5>
                <span className="text-muted small">Latest customer purchases</span>
              </div>
              <Link to="/admin/orders" className="btn btn-sm btn-outline-purple d-flex align-items-center gap-1">
                View All Orders <ArrowRight size={14} />
              </Link>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle small mb-0">
                <thead>
                  <tr className="table-light">
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.recent_orders?.length > 0 ? (
                    data.recent_orders.map((ord) => (
                      <tr key={ord.id}>
                        <td className="fw-bold text-dark">{ord.order_number}</td>
                        <td>{ord.customer_name}</td>
                        <td className="fw-bold" style={{ color: '#7C3AED' }}>₹{parseFloat(ord.total_amount).toFixed(2)}</td>
                        <td><StatusBadge status={ord.status} /></td>
                        <td>
                          <Link to="/admin/orders" className="btn btn-sm btn-light border text-muted">Manage</Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-3">No recent orders.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Custom Gift Requests */}
        <div className="col-lg-5">
          <div className="dt-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold text-dark mb-0">Recent Gift Requests</h5>
                <span className="text-muted small">Custom customer inquiries</span>
              </div>
              <Link to="/admin/requests" className="btn btn-sm btn-outline-purple d-flex align-items-center gap-1">
                View All <ArrowRight size={14} />
              </Link>
            </div>

            <div className="divide-y">
              {data?.recent_requests?.length > 0 ? (
                data.recent_requests.map((req) => (
                  <div key={req.id} className="py-2.5 border-bottom d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold text-dark small">{req.title}</div>
                      <div className="text-muted" style={{ fontSize: '0.78rem' }}>
                        By {req.customer_name}
                      </div>
                    </div>
                    <span className={`badge ${req.status === 'Submitted' ? 'bg-warning text-dark' : 'bg-light text-dark border'}`}>
                      {req.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-muted small py-3 mb-0 text-center">No custom gift requests found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
