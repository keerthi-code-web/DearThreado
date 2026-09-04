import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const CategoryView = () => {
  const { slug, subSlug } = useParams();
  const [category, setCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/categories/${slug}`);
        if (res.data.success) {
          setCategory(res.data.category);
          
          if (subSlug) {
            const sub = res.data.category.subcategories?.find(s => s.slug === subSlug);
            setActiveSubcategory(sub || null);
            const pRes = await api.get(`/products?category=${slug}&subcategory=${subSlug}`);
            if (pRes.data.success) setProducts(pRes.data.products);
          } else {
            setActiveSubcategory(null);
            setProducts(res.data.category.products || []);
          }
        }
      } catch (err) {
        console.error('Category View Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [slug, subSlug]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-purple" style={{ color: '#7C3AED' }} role="status"></div>
        <p className="text-muted mt-2">Loading category...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container py-5 text-center">
        <h4>Category not found</h4>
        <Link to="/" className="btn btn-dt-primary mt-3">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Category Header */}
      <div className="p-4 p-md-5 rounded-4 mb-4" style={{ backgroundColor: '#FAF8FF', border: '1px solid #EDE9FE' }}>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb small mb-2">
            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
            <li className="breadcrumb-item"><Link to={`/category/${category.slug}`} className="text-decoration-none text-muted">{category.name}</Link></li>
            {activeSubcategory && (
              <li className="breadcrumb-item active text-purple-primary fw-bold" style={{ color: '#7C3AED' }}>{activeSubcategory.name}</li>
            )}
          </ol>
        </nav>
        <h1 className="fw-bold text-dark mb-2">
          {activeSubcategory ? activeSubcategory.name : category.name}
        </h1>
        <p className="text-muted mb-0 max-w-600">
          {activeSubcategory ? activeSubcategory.description : category.description}
        </p>
      </div>

      {/* Subcategory Pills Filter */}
      {category.subcategories && category.subcategories.length > 0 && (
        <div className="d-flex align-items-center gap-2 overflow-x-auto pb-3 mb-4">
          <Link 
            to={`/category/${category.slug}`}
            className={`btn btn-sm rounded-pill px-3 fw-semibold text-nowrap ${!activeSubcategory ? 'btn-dt-primary' : 'btn-dt-secondary'}`}
          >
            All {category.name}
          </Link>
          {category.subcategories.map((sub) => (
            <Link
              key={sub.id}
              to={`/category/${category.slug}/${sub.slug}`}
              className={`btn btn-sm rounded-pill px-3 fw-semibold text-nowrap ${activeSubcategory?.slug === sub.slug ? 'btn-dt-primary' : 'btn-dt-secondary'}`}
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border">
          <p className="text-muted mb-3">No products available in this subcategory yet.</p>
          <Link to="/" className="btn btn-dt-secondary">Explore Other Collections</Link>
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
  );
};

export default CategoryView;
