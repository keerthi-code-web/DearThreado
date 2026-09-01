import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Package, User, Bell, LogOut, Shield, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg sticky-top bg-white border-bottom shadow-sm py-2">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img 
            src="/logo/logo with name.png" 
            alt="DearThreado" 
            height="44" 
            className="d-inline-block align-top"
            onError={(e) => { e.target.onerror = null; e.target.src = '/logo/logo.png'; }}
          />
        </Link>

        {/* Mobile Toggle Button */}
        <button 
          className="navbar-toggler border-0 shadow-none p-2" 
          type="button" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} color="#7C3AED" /> : <Menu size={24} color="#7C3AED" />}
        </button>

        {/* Locked Navigation Links */}
        <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show mt-3' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-lg-2 ms-lg-4">
            <li className="nav-item">
              <Link 
                className={`nav-link px-3 fw-semibold ${isActive('/') ? 'text-purple-primary border-bottom border-2 border-purple' : 'text-dark'}`} 
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: isActive('/') ? '#7C3AED' : '#1E1B4B' }}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link px-3 fw-semibold position-relative ${isActive('/cart') ? 'text-purple-primary border-bottom border-2 border-purple' : 'text-dark'}`} 
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: isActive('/cart') ? '#7C3AED' : '#1E1B4B' }}
              >
                <ShoppingBag size={18} className="me-1 mb-1" />
                Cart
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-purple" style={{ backgroundColor: '#7C3AED' }}>
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link px-3 fw-semibold ${isActive('/my-orders') ? 'text-purple-primary border-bottom border-2 border-purple' : 'text-dark'}`} 
                to="/my-orders"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: isActive('/my-orders') ? '#7C3AED' : '#1E1B4B' }}
              >
                <Package size={18} className="me-1 mb-1" />
                My Orders
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link px-3 fw-semibold ${isActive('/profile') ? 'text-purple-primary border-bottom border-2 border-purple' : 'text-dark'}`} 
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: isActive('/profile') ? '#7C3AED' : '#1E1B4B' }}
              >
                <User size={18} className="me-1 mb-1" />
                My Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link px-3 fw-semibold position-relative ${isActive('/notifications') ? 'text-purple-primary border-bottom border-2 border-purple' : 'text-dark'}`} 
                to="/notifications"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: isActive('/notifications') ? '#7C3AED' : '#1E1B4B' }}
              >
                <Bell size={18} className="me-1 mb-1" />
                Notifications
                {unreadCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger pulse-badge">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>

          {/* User Controls / Auth Buttons */}
          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            {user ? (
              <div className="d-flex align-items-center gap-3">
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="btn btn-sm btn-outline-purple d-flex align-items-center gap-1" style={{ color: '#7C3AED', borderColor: '#7C3AED' }}>
                    <Shield size={16} /> Admin Portal
                  </Link>
                )}
                <span className="fw-semibold text-truncate" style={{ maxWidth: '150px' }}>
                  Hi, {user.name.split(' ')[0]}!
                </span>
                <button 
                  onClick={() => { logout(); navigate('/'); }} 
                  className="btn btn-sm btn-light border text-muted d-flex align-items-center gap-1"
                  title="Logout"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn-dt-secondary py-2 px-3 fs-6">
                  Sign In
                </Link>
                <Link to="/register" className="btn-dt-primary py-2 px-3 fs-6">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
