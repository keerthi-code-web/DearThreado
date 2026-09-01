import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const ProductCard = ({ product }) => {
  const imageUrl = product.primary_image || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="dt-card h-100 d-flex flex-column">
      <div className="position-relative overflow-hidden" style={{ height: '230px', backgroundColor: '#FAF8FF' }}>
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
            {product.subcategory_name || product.category_name || 'Handmade'}
          </div>
          <h5 className="fw-bold mb-2 text-dark line-clamp-2">
            {product.name}
          </h5>
          <p className="text-muted small line-clamp-2 mb-3">
            {product.description}
          </p>
        </div>

        <div>
          <div className="d-flex align-items-center justify-content-between pt-2 border-top">
            <span className="fs-5 fw-bold" style={{ color: '#7C3AED' }}>
              ${parseFloat(product.price).toFixed(2)}
            </span>
            <Link 
              to={`/product/${product.slug}`} 
              className="btn btn-sm btn-dt-primary text-decoration-none"
            >
              View Product <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
