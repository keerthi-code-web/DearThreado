import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';

const Cart = () => {
  const { cartItems, cartTotal, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleCheckoutClick = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      navigate('/checkout');
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="p-5 rounded-4 bg-white border max-w-600 mx-auto">
          <div className="d-inline-flex p-3 rounded-circle bg-lavender mb-3" style={{ backgroundColor: '#FAF8FF', color: '#7C3AED' }}>
            <ShoppingBag size={48} />
          </div>
          <h3 className="fw-bold text-dark mb-2">Your Cart is Empty</h3>
          <p className="text-muted mb-4">Looks like you haven't added any handmade gifts to your cart yet.</p>
          <Link to="/" className="btn-dt-primary">
            Explore Gifts <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold text-dark mb-4">Your Shopping Cart</h2>

      <div className="row g-4">
        {/* Cart Items List */}
        <div className="col-lg-8">
          <div className="d-flex flex-column gap-3">
            {cartItems.map((item) => (
              <div key={item.id} className="dt-card p-3 p-md-4">
                <div className="row align-items-center g-3">
                  <div className="col-3 col-md-2">
                    <img 
                      src={item.primary_image || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=300&q=80'} 
                      alt={item.product_name}
                      className="w-100 rounded-3 object-fit-cover"
                      style={{ height: '90px' }}
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=300&q=80'; }}
                    />
                  </div>

                  <div className="col-9 col-md-5">
                    <h6 className="fw-bold text-dark mb-1">{item.product_name}</h6>
                    <div className="text-purple-primary fw-semibold small mb-2" style={{ color: '#7C3AED' }}>
                      ₹{parseFloat(item.unit_price).toFixed(2)} each
                    </div>

                    {/* Preserved Customization Values */}
                    {item.customization_values && Object.keys(item.customization_values).length > 0 && (
                      <div className="p-2 rounded bg-light small border text-muted">
                        <div className="fw-bold text-purple-dark small mb-1 d-flex align-items-center gap-1" style={{ color: '#4C1D95' }}>
                          <Sparkles size={12} /> Custom Details:
                        </div>
                        {Object.entries(item.customization_values).map(([key, val]) => (
                          <div key={key} className="text-truncate">
                            <strong className="text-dark">{key}:</strong> {String(val)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="col-6 col-md-3">
                    <div className="d-flex align-items-center border rounded-pill p-1 bg-white" style={{ width: '110px' }}>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="btn btn-sm btn-light rounded-circle px-2 text-muted fw-bold"
                      >-</button>
                      <span className="mx-auto fw-bold text-dark">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="btn btn-sm btn-light rounded-circle px-2 text-muted fw-bold"
                      >+</button>
                    </div>
                  </div>

                  <div className="col-6 col-md-2 text-end">
                    <div className="fw-bold fs-6 text-dark mb-2">
                      ₹{(parseFloat(item.unit_price) * item.quantity).toFixed(2)}
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="btn btn-sm text-danger border-0 p-0"
                      title="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <button onClick={clearCart} className="btn btn-sm btn-outline-danger rounded-pill px-3">
              Clear Entire Cart
            </button>
            <Link to="/" className="text-decoration-none text-purple-primary fw-semibold small" style={{ color: '#7C3AED' }}>
              + Add More Gifts
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="dt-card p-4 sticky-top" style={{ top: '100px', zIndex: 10 }}>
            <h5 className="fw-bold text-dark mb-3">Order Summary</h5>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Subtotal</span>
              <span className="fw-bold text-dark">₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Payment Method</span>
              <span className="badge bg-light text-dark border">Cash on Delivery</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Delivery Charge</span>
              <span className="text-success fw-bold">FREE</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between mb-4">
              <span className="fw-bold text-dark fs-5">Total</span>
              <span className="fw-extrabold fs-4" style={{ color: '#7C3AED' }}>₹{cartTotal.toFixed(2)}</span>
            </div>

            <button 
              onClick={handleCheckoutClick}
              className="btn-dt-primary w-100 justify-content-center py-3 fs-6"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Auth Intercept Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        redirectPath="/checkout"
        title="Your DearThreado Order Awaits"
        message="Creating an account or logging in ensures your personalized gift details and order status are safely saved to your account."
      />
    </div>
  );
};

export default Cart;
