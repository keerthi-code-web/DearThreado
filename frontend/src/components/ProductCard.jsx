import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const ProductCard = ({ product }) => {
  const imageUrl = product.primary_image || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="dt-card h-100 d-flex flex-column">
      <div className="position-relative overflow-hidden" style={{ height: '220px', backgroundColor: '#FAF8FF' }}>
        <img 
          src={imageUrl} 
          alt={product.name} 
          className="w-100 h-100 object-fit-cover transition-transform"
          style={{ transition: 'transform 0.5s ease' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80';
          }}
        />
        {product.customization_enabled ? (
          <span className="position-absolute top-0 end-0 m-3 dt-badge-purple d-flex align-items-center gap-1 shadow-sm">
            <Sparkles size={13} /> Customizable
          </span>
        ) : null}
      </div>

      <div className="p-4 d-flex flex-column flex-grow-1 justify-content-between">
        <div>
          <div className="text-uppercase small fw-semibold text-muted mb-1" style={{ letterSpacing: '0.5px' }}>
            {product.subcategory_name || product.category_name}
          </div>
          <h5 className="fw-bold mb-3 text-dark line-clamp-2">
            {product.name}
          </h5>
        </div>

        {/* Clean, uncongested bottom footer with price & bottom-aligned full-width View Product button */}
        <div className="mt-auto pt-3 border-top">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="small text-muted fw-semibold">Price</span>
            <span className="fs-5 fw-extrabold" style={{ color: '#7C3AED' }}>
              ₹{parseFloat(product.price).toFixed(2)}
            </span>
          </div>
          <Link 
            to={`/product/${product.slug}`} 
            className="btn-dt-primary w-100 justify-content-center text-decoration-none py-2 fs-6"
          >
            View Product <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
