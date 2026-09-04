import React from 'react';
import { Bell, CheckCheck, Package, MessageSquare, Star } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { Link } from 'react-router-dom';
import { formatDateTime } from '../utils/formatters';

const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case 'order_status':
        return <Package size={20} color="#7C3AED" />;
      case 'product_request':
        return <MessageSquare size={20} color="#3B82F6" />;
      case 'review_moderation':
        return <Star size={20} color="#F59E0B" />;
      default:
        return <Bell size={20} color="#7C3AED" />;
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Notifications</h2>
          <p className="text-muted small mb-0">Updates on your orders, requests, and reviews</p>
        </div>

        {notifications.length > 0 && (
          <button onClick={markAllAsRead} className="btn btn-sm btn-outline-purple d-flex align-items-center gap-1" style={{ color: '#7C3AED', borderColor: '#7C3AED' }}>
            <CheckCheck size={16} /> Mark All as Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="dt-card p-5 text-center max-w-600 mx-auto">
          <div className="d-inline-flex p-3 rounded-circle bg-lavender mb-3" style={{ backgroundColor: '#FAF8FF', color: '#7C3AED' }}>
            <Bell size={48} />
          </div>
          <h4 className="fw-bold text-dark mb-2">No Notifications</h4>
          <p className="text-muted mb-0">You're all caught up! Updates regarding your orders and requests will appear here.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3 max-w-800 mx-auto">
          {notifications.map((n) => (
            <div 
              key={n.id} 
              className={`dt-card p-4 d-flex align-items-start gap-3 ${!n.is_read ? 'border-purple border-2' : ''}`}
              style={{ backgroundColor: !n.is_read ? '#FAF8FF' : '#ffffff' }}
            >
              <div className="p-2.5 rounded-circle bg-white shadow-sm">
                {getIcon(n.type)}
              </div>

              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <h6 className="fw-bold text-dark mb-0">{n.title}</h6>
                  <span className="small text-muted">{formatDateTime(n.created_at)}</span>
                </div>
                <p className="text-muted small mb-2">{n.message}</p>

                {n.target_id && n.type === 'order_status' && (
                  <Link to={`/orders/${n.target_id}`} className="fw-bold small text-purple-primary text-decoration-none" style={{ color: '#7C3AED' }}>
                    View Order Details &rarr;
                  </Link>
                )}
              </div>

              {!n.is_read && (
                <button 
                  onClick={() => markAsRead(n.id)}
                  className="btn btn-sm text-purple-primary border-0 p-0"
                  style={{ color: '#7C3AED' }}
                  title="Mark as read"
                >
                  <CheckCheck size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
