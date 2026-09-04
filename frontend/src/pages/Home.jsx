import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Heart, MessageCircleHeart, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import ThreadCurve from '../components/ThreadCurve';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?limit=12')
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

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const customizableProducts = products.filter(p => p.customization_enabled);
  const displayProducts = customizableProducts.length > 0 ? customizableProducts : products;

  return (
    <div className="pb-5">
      {/* Hero Section */}
      <section className="py-5 position-relative overflow-hidden" style={{ backgroundColor: '#FAF8FF' }}>
        <div className="container py-4 position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center g-4">
            <div className="col-lg-7 text-start">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill mb-3 border" style={{ backgroundColor: '#ffffff', borderColor: '#DDD6FE', color: '#7C3AED' }}>
                <Sparkles size={16} />
                <span className="small fw-bold">Handmade-First Gifting</span>
              </div>

              <h1 className="display-4 fw-extrabold mb-3 text-dark" style={{ letterSpacing: '-0.5px' }}>
                Make every moment a little more special.
              </h1>

              <p className="lead text-muted mb-4" style={{ fontSize: '1.15rem', maxWidth: '580px' }}>
                A beautiful little place where you find something made meaningful for someone you care about.
              </p>

              <div className="d-flex flex-column flex-sm-row justify-content-start align-items-sm-center gap-3">
                <a href="#categories" className="btn-dt-primary fs-6 px-4 py-3">
                  Explore Gifts <ArrowRight size={18} />
                </a>
                <Link to="/request-gift" className="btn-dt-secondary fs-6 px-4 py-3">
                  <MessageCircleHeart size={18} /> Can't find what you're imagining?
                </Link>
              </div>
            </div>

            <div className="col-lg-5 text-center position-relative">
              <div className="p-4 rounded-4 hero-logo-float bg-white shadow-sm border" style={{ borderColor: '#EDE9FE' }}>
                <img 
                  src="/logo/logo with name.png" 
                  alt="DearThreado" 
                  className="img-fluid"
                  style={{ maxHeight: '240px', objectFit: 'contain' }}
                  onError={(e) => { e.target.onerror = null; e.target.src = '/logo/logo.png'; }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ThreadCurve />

      {/* Categories Discovery Section */}
      <section id="categories" className="py-4">
        <div className="container">
          <div className="text-center mb-4">
            <span className="fst-italic text-purple-primary small fw-semibold d-block mb-1" style={{ color: '#7C3AED' }}>
              "A little piece of my time, wrapped in love."
            </span>
            <h2 className="fw-bold text-dark mb-1">Handmade Discovery Collections</h2>
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

      {/* MODIFICATION #1: Clean Product-Focused Carousel for Customizable Gifts */}
      <section className="py-5 overflow-hidden">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h2 className="fw-bold text-dark mb-1">Customizable Gifts</h2>
              <p className="text-muted small mb-0">Personalize with names, dates, colors, and heartfelt messages</p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button 
                onClick={() => scroll('left')} 
                className="btn btn-sm btn-light border rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center"
                style={{ width: '40px', height: '40px' }}
                aria-label="Previous Products"
              >
                <ChevronLeft size={20} color="#7C3AED" />
              </button>
              <button 
                onClick={() => scroll('right')} 
                className="btn btn-sm btn-light border rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center"
                style={{ width: '40px', height: '40px' }}
                aria-label="Next Products"
              >
                <ChevronRight size={20} color="#7C3AED" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-purple" style={{ color: '#7C3AED' }} role="status"></div>
              <p className="text-muted mt-2 small">Loading customizable gifts...</p>
            </div>
          ) : (
            <div 
              ref={scrollRef} 
              className="d-flex gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {displayProducts.map((product) => (
                <div key={product.id} style={{ flex: '0 0 290px', minWidth: '290px' }}>
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
