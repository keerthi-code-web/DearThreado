import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Heart, Gift, MessageCircleHeart, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import ThreadCurve from '../components/ThreadCurve';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?limit=8')
        ]);
        if (catRes.data.success) setCategories(catRes.data.categories || []);
        if (prodRes.data.success) setProducts(prodRes.data.products || []);
      } catch (err) {
        console.error('Home Page Data Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="pb-5">
      {/* Hero Section */}
      <section className="py-5 text-center position-relative overflow-hidden" style={{ backgroundColor: '#FAF8FF' }}>
        <div className="container py-4 position-relative" style={{ zIndex: 2 }}>
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill mb-3 border" style={{ backgroundColor: '#ffffff', borderColor: '#DDD6FE', color: '#7C3AED' }}>
            <Sparkles size={16} />
            <span className="small fw-bold">Handmade-First Gifting</span>
          </div>

          <h1 className="display-4 fw-extrabold mb-3 text-dark max-w-700 mx-auto" style={{ letterSpacing: '-0.5px' }}>
            Make every moment a little more special.
          </h1>

          <p className="lead text-muted mb-4 mx-auto" style={{ maxWidth: '640px', fontSize: '1.15rem' }}>
            A beautiful little place where you find something made meaningful for someone you care about.
          </p>

          <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3">
            <a href="#categories" className="btn-dt-primary fs-6 px-4 py-3">
              Explore Gifts <ArrowRight size={18} />
            </a>
            <Link to="/request-gift" className="btn-dt-secondary fs-6 px-4 py-3">
              <MessageCircleHeart size={18} /> Can't find what you're imagining?
            </Link>
          </div>
        </div>
      </section>

      <ThreadCurve />

      {/* Categories Discovery Section */}
      <section id="categories" className="py-4">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark mb-1">Handmade Categories</h2>
            <p className="text-muted small">Explore gift collections crafted with heart</p>
          </div>

          <div className="row g-4">
            {categories.map((cat) => (
              <div key={cat.id} className="col-6 col-md-3">
                <Link to={`/category/${cat.slug}`} className="text-decoration-none">
                  <div className="dt-card h-100 text-center p-3">
                    <div className="rounded-4 overflow-hidden mb-3" style={{ height: '140px' }}>
                      <img 
                        src={cat.image_url} 
                        alt={cat.name} 
                        className="w-100 h-100 object-fit-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=600&q=80'; }}
                      />
                    </div>
                    <h6 className="fw-bold text-dark mb-1">{cat.name}</h6>
                    <span className="small text-purple-primary fw-semibold" style={{ color: '#7C3AED' }}>
                      {cat.subcategories?.length || 0} collections &rarr;
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between mb-4">
            <div>
              <h2 className="fw-bold text-dark mb-1">Customizable Gifts</h2>
              <p className="text-muted small mb-0">Personalize with names, dates, colors, and heartfelt messages</p>
            </div>
            <a href="#categories" className="btn btn-link text-purple-primary text-decoration-none fw-bold mt-2 mt-sm-0" style={{ color: '#7C3AED' }}>
              View All Categories &rarr;
            </a>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-purple" style={{ color: '#7C3AED' }} role="status"></div>
              <p className="text-muted mt-2 small">Loading handmade gifts...</p>
            </div>
          ) : (
            <div className="row g-4">
              {products.map((product) => (
                <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product Request / Feedback Banner */}
      <section className="py-5 my-3" style={{ backgroundColor: '#FAF8FF', borderTop: '1px solid #EDE9FE', borderBottom: '1px solid #EDE9FE' }}>
        <div className="container">
          <div className="row align-items-center justify-content-between g-4">
            <div className="col-md-7">
              <div className="d-inline-flex align-items-center gap-1 text-purple-primary mb-2" style={{ color: '#7C3AED' }}>
                <Heart size={18} fill="#7C3AED" />
                <span className="fw-bold small text-uppercase" style={{ letterSpacing: '1px' }}>Custom Gift Requests</span>
              </div>
              <h3 className="fw-extrabold text-dark mb-3">
                Have a special gift idea in your mind?
              </h3>
              <p className="text-muted mb-4" style={{ fontSize: '1.05rem' }}>
                If you cannot find the exact handmade item you are imagining, send us your request! Our artisan team will review your unique requirement and bring it to life.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <div className="d-flex align-items-center gap-2 small text-dark fw-medium">
                  <CheckCircle2 size={16} color="#7C3AED" /> Share your vision
                </div>
                <div className="d-flex align-items-center gap-2 small text-dark fw-medium">
                  <CheckCircle2 size={16} color="#7C3AED" /> Direct admin response
                </div>
                <div className="d-flex align-items-center gap-2 small text-dark fw-medium">
                  <CheckCircle2 size={16} color="#7C3AED" /> Custom crafting
                </div>
              </div>
            </div>

            <div className="col-md-4 text-md-end">
              <Link to="/request-gift" className="btn-dt-primary fs-6 px-4 py-3 shadow-lg">
                <MessageCircleHeart size={20} /> Request Custom Gift
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Emotional Brand Statement */}
      <section className="py-4 text-center">
        <div className="container">
          <blockquote className="font-editorial fst-italic display-6 text-dark my-4" style={{ color: '#4C1D95' }}>
            "Only special persons deserve handmade gifts."
          </blockquote>
          <p className="text-muted small">Crafted with care • Gifted with heart</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
