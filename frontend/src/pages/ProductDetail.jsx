import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Star, Sparkles, Check, ArrowLeft, Heart } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import CustomizationForm from '../components/CustomizationForm';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customizationValues, setCustomizationValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${slug}`);
        if (res.data.success) {
          const prod = res.data.product;
          setProduct(prod);
          if (prod.images && prod.images.length > 0) {
            setSelectedImage(prod.images[0]);
          }
        }
      } catch (err) {
        console.error('Fetch Product Detail Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-purple" style={{ color: '#7C3AED' }} role="status"></div>
        <p className="text-muted mt-2">Loading gift details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h4>Product not found</h4>
        <Link to="/" className="btn btn-dt-primary mt-3">Back to Home</Link>
      </div>
    );
  }

  const handleAddToCart = async () => {
    // Validate required customization fields
    if (product.customization_fields) {
      for (const field of product.customization_fields) {
        if (field.is_required && !customizationValues[field.field_label]) {
          alert(`Please complete the required customization field: "${field.field_label}"`);
          return;
        }
      }
    }

    try {
      setAdding(true);
      await addToCart(product.id, quantity, customizationValues);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 3000);
    } catch (err) {
      console.error('Add to cart error:', err);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="container py-5">
      <Link to="/" className="text-decoration-none text-muted small d-inline-flex align-items-center gap-1 mb-4">
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      <div className="row g-5">
        {/* Images Gallery */}
        <div className="col-md-6">
          <div className="dt-card p-2 mb-3 bg-white">
            <div className="rounded-4 overflow-hidden" style={{ height: '420px', backgroundColor: '#FAF8FF' }}>
              <img 
                src={selectedImage || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'} 
                alt={product.name}
                className="w-100 h-100 object-fit-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'; }}
              />
            </div>
          </div>

          {product.images && product.images.length > 1 && (
            <div className="d-flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`btn p-0 border rounded-3 overflow-hidden ${selectedImage === img ? 'border-purple border-2' : ''}`}
                  style={{ width: '70px', height: '70px' }}
                >
                  <img src={img} alt="thumbnail" className="w-100 h-100 object-fit-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="col-md-6">
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="dt-badge-purple">
              {product.subcategory_name}
            </span>
            {product.customization_enabled ? (
              <span className="dt-badge-gold d-flex align-items-center gap-1">
                <Sparkles size={13} /> Customizable Gift
              </span>
            ) : null}
          </div>

          <h1 className="fw-bold text-dark mb-2">{product.name}</h1>

          {/* Rating Summary */}
          <div className="d-flex align-items-center gap-2 mb-3">
            <div className="d-flex text-warning">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill={i < Math.round(product.average_rating || 5) ? '#F59E0B' : 'none'} color="#F59E0B" />
              ))}
            </div>
            <span className="fw-bold small">{product.average_rating || 5.0}</span>
            <span className="text-muted small">({product.review_count || 0} reviews)</span>
          </div>

          <div className="display-6 fw-bold mb-4" style={{ color: '#7C3AED' }}>
            ${parseFloat(product.price).toFixed(2)}
          </div>

          <p className="text-muted mb-4 lead fs-6">
            {product.description}
          </p>

          {/* Dynamic Customization Form */}
          {product.customization_fields && product.customization_fields.length > 0 && (
            <CustomizationForm
              fields={product.customization_fields}
              values={customizationValues}
              onChange={setCustomizationValues}
            />
          )}

          {/* Quantity & Add to Cart */}
          <div className="d-flex align-items-center gap-3 mt-4">
            <div className="d-flex align-items-center border rounded-pill p-1 bg-white" style={{ width: '130px' }}>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="btn btn-sm btn-light rounded-circle px-2 text-muted fw-bold"
              >-</button>
              <span className="mx-auto fw-bold text-dark">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="btn btn-sm btn-light rounded-circle px-2 text-muted fw-bold"
              >+</button>
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={adding}
              className="btn-dt-primary flex-grow-1 justify-content-center py-3 fs-6"
            >
              {adding ? (
                <span className="spinner-border spinner-border-sm" role="status"></span>
              ) : addedSuccess ? (
                <>
                  <Check size={20} /> Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingBag size={20} /> Add to Cart
                </>
              )}
            </button>
          </div>

          {addedSuccess && (
            <div className="alert alert-success mt-3 rounded-3 d-flex align-items-center justify-content-between py-2 px-3 small">
              <span>Item added to your cart with your customization!</span>
              <Link to="/cart" className="fw-bold text-success text-decoration-none">View Cart &rarr;</Link>
            </div>
          )}

          {/* Product Specifications */}
          {product.specifications && (
            <div className="mt-5 pt-4 border-top">
              <h6 className="fw-bold text-dark mb-2">Handmade Details & Materials</h6>
              <p className="text-muted small mb-0">{product.specifications}</p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="mt-5 pt-5 border-top">
        <h3 className="fw-bold text-dark mb-4">Customer Reviews & Memories</h3>
        
        {!product.reviews || product.reviews.length === 0 ? (
          <div className="p-4 text-center rounded-4 bg-white border text-muted small">
            No public reviews yet for this handmade piece. Reviews appear after verified delivered orders!
          </div>
        ) : (
          <div className="row g-4">
            {product.reviews.map((rev) => (
              <div key={rev.id} className="col-md-6">
                <div className="dt-card p-4 h-100">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="fw-bold text-dark">{rev.reviewer_name}</span>
                    <div className="d-flex text-warning">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < rev.rating ? '#F59E0B' : 'none'} color="#F59E0B" />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted small mb-0">{rev.comment}</p>
                  {rev.image_url && (
                    <img src={rev.image_url} alt="Review photo" className="rounded-3 mt-3" width="70" height="70" style={{ objectFit: 'cover' }} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
