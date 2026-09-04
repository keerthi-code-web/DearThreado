import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-top mt-5 py-4">
      <div className="container text-center">
        <p className="font-editorial fst-italic fs-5 mb-2" style={{ color: '#4C1D95' }}>
          "Crafted with care, chosen with heart."
        </p>

        <div className="d-flex flex-column flex-sm-row align-items-center justify-content-center gap-2 small text-muted my-2">
          <span>&copy; {new Date().getFullYear()} DearThreado. All rights reserved.</span>
          <span className="d-none d-sm-inline">&bull;</span>
          <span className="d-flex align-items-center gap-1">
            Connected with <Heart size={14} fill="#7C3AED" color="#7C3AED" className="mx-1" /> for special moments.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
