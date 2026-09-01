import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, MessageCircleHeart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-top mt-5 pt-5 pb-4">
      <div className="container">
        <div className="row g-4 justify-content-between align-items-center">
          <div className="col-md-5">
            <Link to="/" className="d-inline-block mb-3">
              <img 
                src="/logo/logo with name.png" 
                alt="DearThreado" 
                height="46" 
                onError={(e) => { e.target.onerror = null; e.target.src = '/logo/logo.png'; }}
              />
            </Link>
            <p className="text-muted mb-2 fw-medium">
              "Crafted with care, chosen with heart."
            </p>
            <p className="text-muted small">
              Made with care • Gift with meaning.
            </p>
          </div>

          <div className="col-md-6 col-lg-5 text-md-end">
            <div className="p-3 rounded-4" style={{ backgroundColor: '#FAF8FF', border: '1px dashed #DDD6FE' }}>
              <div className="d-flex align-items-center justify-content-md-end gap-2 mb-2 text-purple-primary" style={{ color: '#7C3AED' }}>
                <Sparkles size={18} />
                <span className="fw-bold">Have a unique gift idea in mind?</span>
              </div>
              <p className="small text-muted mb-3">
                Tell us what you're imagining and we'll help bring your custom gift to life!
              </p>
              <Link to="/request-gift" className="btn btn-sm btn-dt-primary">
                <MessageCircleHeart size={16} /> Can't find what you're imagining?
              </Link>
            </div>
          </div>
        </div>

        <hr className="my-4 text-muted opacity-25" />

        <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2 small text-muted">
          <div>
            &copy; {new Date().getFullYear()} DearThreado. All rights reserved.
          </div>
          <div className="d-flex align-items-center gap-1">
            Connected with <Heart size={14} fill="#7C3AED" color="#7C3AED" className="mx-1" /> for special moments.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
