import React, { useEffect, useState, useRef } from 'react';
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
  ChevronRight,
  Mail,
  MailOpen,
  Heart
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const emotionalMessages = [
  {
    id: 1,
    tag: "Ordinary Moments",
    title: "Making Days Special",
    peek: "Sometimes a gift doesn't make a special day better...",
    message: "Sometimes a gift doesn't make a special day better. It makes an ordinary day feel special.",
    accent: "#7C3AED",
    bg: "#FAF8FF"
  },
  {
    id: 2,
    tag: "Why We Gift",
    title: "Effort Connects Hearts",
    peek: "A gift is not just an object. It's a quiet message...",
    message: "A gift is not just an object. It's a quiet message saying: 'I spent time thinking about you.'",
    accent: "#6D28D9",
    bg: "#FAF8FF"
  },
  {
    id: 3,
    tag: "Handmade Touch",
    title: "Crafted With Purpose",
    peek: "Machine items fill shelves. Handmade items fill hearts...",
    message: "Machine-made items fill shelves. Handmade items fill hearts with warmth and intention.",
    accent: "#4C1D95",
    bg: "#FAF8FF"
  },
  {
    id: 4,
    tag: "DearThreado Purpose",
    title: "Wrapped With Care",
    peek: "A little piece of my time, wrapped in love...",
    message: "A little piece of my time, wrapped in love. DearThreado exists to turn simple moments into lasting memories.",
    accent: "#7C3AED",
    bg: "#FAF8FF"
  }
];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openEnvelopeId, setOpenEnvelopeId] = useState(null);
  const storyScrollRef = useRef(null);

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
      bg: '#FAF8FF',
      countLabel: `${stats.total_products || 0} Active Products`
    },
    {
      id: 'orders',
      title: 'Orders',
      description: 'View and manage customer orders and order status.',
      icon: Package,
      path: '/admin/orders',
      accent: '#10B981',
      bg: '#FAF8FF',
      countLabel: `${stats.total_orders || 0} Total Orders (${stats.new_orders || 0} New)`
    },
    {
      id: 'reviews',
      title: 'Reviews',
      description: 'Monitor customer reviews and ratings.',
      icon: Star,
      path: '/admin/reviews',
      accent: '#F59E0B',
      bg: '#FAF8FF',
      countLabel: `${stats.pending_reviews || 0} Pending Moderation`
    },
    {
      id: 'requests',
      title: 'Requests',
      description: 'Manage custom gift requests submitted by customers.',
      icon: MessageSquare,
      path: '/admin/requests',
      accent: '#3B82F6',
      bg: '#FAF8FF',
      countLabel: `${stats.pending_requests || 0} Open Requests`
    }
  ];

  return (
    <div className="container py-4 py-md-5">
      {/* ADMIN HERO SECTION (LOCKED) */}
      <div 
        className="rounded-4 p-4 p-md-5 mb-5 position-relative border"
        style={{ 
          backgroundColor: '#FAF8FF',
          borderColor: '#EDE9FE'
        }}
      >
        <div className="max-w-700">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3 border small fw-bold" style={{ backgroundColor: '#ffffff', borderColor: '#DDD6FE', color: '#7C3AED' }}>
            <ShieldCheck size={15} /> Central Operations Command
          </div>

          <h1 className="display-6 fw-extrabold text-dark mb-2" style={{ letterSpacing: '-0.5px' }}>
            Admin Management Portal
          </h1>
          <p className="lead text-muted mb-0" style={{ fontSize: '1.05rem' }}>
            Overview of DearThreado store performance &amp; requests
          </p>
        </div>
      </div>

      {/* SIX PRIMARY ADMIN STATISTICS (Restrained DearThreado Palette Accent Refinement) */}
      <div className="mb-5">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <Sparkles size={18} color="#7C3AED" /> Store Performance Metrics
          </h5>
          <span className="small text-muted">Real-time store metrics</span>
        </div>

        <div className="row g-3">
          {/* 1. Total Revenue (Purple Accent) */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="dt-card p-4 h-100 border-start border-4" style={{ backgroundColor: '#FAF8FF', borderColor: '#EDE9FE', borderLeftColor: '#7C3AED' }}>
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

          {/* 2. New Orders (Soft Golden / Yellow Accent) */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="dt-card p-4 h-100 border-start border-4" style={{ backgroundColor: '#FFFBEB', borderColor: '#FEF3C7', borderLeftColor: '#F59E0B' }}>
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

          {/* 3. New Requests (Blue Accent) */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="dt-card p-4 h-100 border-start border-4" style={{ backgroundColor: '#EFF6FF', borderColor: '#DBEAFE', borderLeftColor: '#3B82F6' }}>
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

          {/* 4. New Reviews (Pink Accent) */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="dt-card p-4 h-100 border-start border-4" style={{ backgroundColor: '#FDF2F8', borderColor: '#FCE7F3', borderLeftColor: '#EC4899' }}>
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

          {/* 5. Delivered Orders (Purple Accent) */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="dt-card p-4 h-100 border-start border-4" style={{ backgroundColor: '#FAF8FF', borderColor: '#EDE9FE', borderLeftColor: '#7C3AED' }}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="text-muted small fw-semibold text-uppercase" style={{ letterSpacing: '0.5px' }}>Delivered Orders</span>
                <div className="p-2 rounded-circle bg-white shadow-sm" style={{ color: '#7C3AED' }}>
                  <CheckCircle2 size={20} />
                </div>
              </div>
              <div className="fs-3 fw-extrabold text-dark mb-1">
                {stats.delivered_orders || 0}
              </div>
              <span className="small text-muted">Successfully fulfilled customer orders</span>
            </div>
          </div>

          {/* 6. Cancelled Orders (Soft Rose Pink Accent) */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="dt-card p-4 h-100 border-start border-4" style={{ backgroundColor: '#FFF1F2', borderColor: '#FFE4E6', borderLeftColor: '#E11D48' }}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="text-muted small fw-semibold text-uppercase" style={{ letterSpacing: '0.5px' }}>Cancelled Orders</span>
                <div className="p-2 rounded-circle bg-white shadow-sm" style={{ color: '#E11D48' }}>
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

      {/* STORE MANAGEMENT MODULES (LOCKED 5 FUNCTIONS) */}
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

      {/* RECENT OPERATIONAL ACTIVITY (LOCKED) */}
      <div className="row g-4 mb-5">
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

      {/* DEARTHREADO HEART / FEEL SECTION (Letters of Meaning / Envelopes) */}
      <section className="py-4 my-3 rounded-4 position-relative overflow-hidden" style={{ backgroundColor: '#FAF8FF' }}>
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="text-center mb-4 max-w-700 mx-auto">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2 border small fw-bold" style={{ backgroundColor: '#ffffff', borderColor: '#DDD6FE', color: '#7C3AED' }}>
              <Mail size={15} /> Letters of Meaning
            </div>
            <h3 className="fw-extrabold text-dark mb-2">The Heart Behind DearThreado</h3>
            <p className="text-muted small mb-0">
              Tap any envelope to open a little letter about why handmade gifts matter &amp; how effort connects hearts.
            </p>
          </div>

          <div 
            ref={storyScrollRef}
            className="d-flex gap-4 overflow-x-auto py-3 px-2 no-scrollbar align-items-start"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {emotionalMessages.map((item) => {
              const isOpen = openEnvelopeId === item.id;
              return (
                <div 
                  key={item.id} 
                  onClick={() => setOpenEnvelopeId(isOpen ? null : item.id)}
                  className="cursor-pointer select-none transition-all"
                  style={{ 
                    flex: '0 0 300px', 
                    minWidth: '300px',
                    cursor: 'pointer'
                  }}
                >
                  <div 
                    className="rounded-4 p-4 position-relative shadow-sm transition-all border"
                    style={{ 
                      backgroundColor: isOpen ? '#ffffff' : item.bg, 
                      borderColor: isOpen ? item.accent : '#EDE9FE',
                      minHeight: '250px',
                      transform: isOpen ? 'translateY(-4px)' : 'translateY(0)',
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <span className="badge rounded-pill fw-bold text-uppercase" style={{ backgroundColor: '#ffffff', color: item.accent, border: `1px solid ${item.accent}33`, fontSize: '0.7rem' }}>
                        {item.tag}
                      </span>
                      <div className="d-flex align-items-center gap-1">
                        {isOpen ? <MailOpen size={18} color={item.accent} /> : <Mail size={18} color={item.accent} />}
                        <Heart size={14} fill={item.accent} color={item.accent} />
                      </div>
                    </div>

                    <h5 className="fw-bold mb-2 text-dark">{item.title}</h5>

                    {!isOpen ? (
                      <div>
                        <p className="text-muted small mb-3 fst-italic line-clamp-2">
                          "{item.peek}"
                        </p>
                        <div className="p-2.5 rounded-3 text-center border border-dashed bg-white small fw-semibold" style={{ color: item.accent, borderColor: item.accent }}>
                          ✨ Tap to open letter
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-3 bg-white border shadow-sm animate-fadeIn" style={{ borderColor: `${item.accent}44` }}>
                        <p className="font-editorial fst-italic mb-0 text-dark" style={{ fontSize: '1rem', lineHeight: '1.5' }}>
                          "{item.message}"
                        </p>
                        <div className="text-end mt-2">
                          <span className="small text-muted fw-bold" style={{ fontSize: '0.75rem', color: item.accent }}>
                            &mdash; DearThreado Thoughts
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
