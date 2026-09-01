import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeStyle = (st) => {
    switch (st) {
      case 'Placed':
        return { bg: '#E0E7FF', color: '#3730A3', label: 'Placed' };
      case 'Confirmed':
        return { bg: '#EDE9FE', color: '#5B21B6', label: 'Confirmed' };
      case 'Preparing':
        return { bg: '#FEF3C7', color: '#92400E', label: 'Preparing' };
      case 'Shipped':
        return { bg: '#DBEAFE', color: '#1E40AF', label: 'Shipped' };
      case 'Delivered':
        return { bg: '#D1FAE5', color: '#065F46', label: 'Delivered' };
      case 'Cancelled':
        return { bg: '#FEE2E2', color: '#991B1B', label: 'Cancelled' };
      default:
        return { bg: '#F3F4F6', color: '#374151', label: st };
    }
  };

  const style = getBadgeStyle(status);

  return (
    <span 
      className="badge px-3 py-1.5 rounded-pill fw-semibold"
      style={{ backgroundColor: style.bg, color: style.color, fontSize: '0.85rem' }}
    >
      {style.label}
    </span>
  );
};

export default StatusBadge;
