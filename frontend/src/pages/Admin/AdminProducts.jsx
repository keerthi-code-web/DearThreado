import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Sparkles, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [prodForm, setProdForm] = useState({
    category_id: '',
    subcategory_id: '',
    name: '',
    slug: '',
    description: '',
    price: '',
    is_available: 1,
    customization_enabled: 1,
    size: '',
    color: '',
    specifications: '',
    images: [''],
    customizations: []
  });

  const fetchProductsAndCategories = async () => {
    try {
      setLoading(true);
      const [pRes, cRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);
      if (pRes.data.success) setProducts(pRes.data.products || []);
      if (cRes.data.success) setCategories(cRes.data.categories || []);
    } catch (err) {
      console.error('Fetch Products Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const handleCategoryChange = (catId) => {
    const selectedCat = categories.find(c => c.id === parseInt(catId));
    const firstSubId = selectedCat?.subcategories[0]?.id || '';
    setProdForm(prev => ({ ...prev, category_id: catId, subcategory_id: firstSubId }));
  };

  const handleAddCustomizationField = () => {
    setProdForm(prev => ({
      ...prev,
      customizations: [
        ...prev.customizations,
        { field_label: '', field_type: 'text', options: '', is_required: 0, placeholder: '' }
      ]
    }));
  };

  const handleRemoveCustomizationField = (index) => {
    setProdForm(prev => ({
      ...prev,
      customizations: prev.customizations.filter((_, i) => i !== index)
    }));
  };

  const handleCustomizationChange = (index, field, val) => {
    const newCust = [...prodForm.customizations];
    newCust[index][field] = val;
    setProdForm({ ...prodForm, customizations: newCust });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, prodForm);
      } else {
        await api.post('/products', prodForm);
      }
      setShowProductModal(false);
      fetchProductsAndCategories();
    } catch (err) {
      alert('Failed to save product.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProductsAndCategories();
    } catch (err) {
      alert('Failed to delete product.');
    }
  };

  const currentCategory = categories.find(c => c.id === parseInt(prodForm.category_id));

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-purple" style={{ color: '#7C3AED' }} role="status"></div>
        <p className="text-muted mt-2">Loading Products & Customizations...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Product & Customization Management</h2>
          <p className="text-muted small mb-0">Manage handmade gifts and configure product-specific customization fields</p>
        </div>

        <button 
          onClick={() => {
            const firstCat = categories[0];
            const firstSub = firstCat?.subcategories[0];
            setEditingProduct(null);
            setProdForm({
              category_id: firstCat?.id || '',
              subcategory_id: firstSub?.id || '',
              name: '',
              slug: '',
              description: '',
              price: '',
              is_available: 1,
              customization_enabled: 1,
              size: '',
              color: '',
              specifications: '',
              images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'],
              customizations: [
                { field_label: 'Custom Text / Message', field_type: 'text', is_required: 1, placeholder: 'Enter text...' }
              ]
            });
            setShowProductModal(true);
          }}
          className="btn-dt-primary btn-sm"
        >
          <Plus size={16} /> Add Handmade Product
        </button>
      </div>

      {/* Product List Table */}
      <div className="dt-card p-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category / Subcategory</th>
                <th>Price</th>
                <th>Customizable</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod.id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <img src={prod.primary_image} alt={prod.name} className="rounded-3" width="45" height="45" style={{ objectFit: 'cover' }} />
                      <div>
                        <div className="fw-bold text-dark">{prod.name}</div>
                        <div className="small text-muted font-mono">{prod.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="small fw-semibold">{prod.category_name}</div>
                    <div className="small text-muted">{prod.subcategory_name}</div>
                  </td>
                  <td className="fw-bold" style={{ color: '#7C3AED' }}>
                    ₹{parseFloat(prod.price).toFixed(2)}
                  </td>
                  <td>
                    {prod.customization_enabled ? (
                      <span className="dt-badge-purple small d-inline-flex align-items-center gap-1">
                        <Sparkles size={12} /> Yes
                      </span>
                    ) : (
                      <span className="badge bg-light text-dark">No</span>
                    )}
                  </td>
                  <td>
                    {prod.is_available ? (
                      <span className="badge bg-success-subtle text-success">Available</span>
                    ) : (
                      <span className="badge bg-secondary">Unavailable</span>
                    )}
                  </td>
                  <td>
                    <button 
                      onClick={async () => {
                        setEditingProduct(prod);
                        const detailRes = await api.get(`/products/${prod.slug}`);
                        const fullProd = detailRes.data.product;
                        setProdForm({
                          category_id: fullProd.category_id,
                          subcategory_id: fullProd.subcategory_id,
                          name: fullProd.name,
                          slug: fullProd.slug,
                          description: fullProd.description || '',
                          price: fullProd.price,
                          is_available: fullProd.is_available,
                          customization_enabled: fullProd.customization_enabled,
                          size: fullProd.size || '',
                          color: fullProd.color || '',
                          specifications: fullProd.specifications || '',
                          images: fullProd.images?.length > 0 ? fullProd.images : [''],
                          customizations: fullProd.customization_fields || []
                        });
                        setShowProductModal(true);
                      }}
                      className="btn btn-sm btn-light me-1"
                    >
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDeleteProduct(prod.id)} className="btn btn-sm btn-light text-danger">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal with Clean Scrollability */}
      {showProductModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{editingProduct ? 'Edit Product & Customization' : 'Create Handmade Product'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowProductModal(false)}></button>
              </div>
              <form onSubmit={handleSaveProduct}>
                <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Category *</label>
                      <select 
                        className="form-select rounded-3"
                        value={prodForm.category_id}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        required
                      >
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Subcategory *</label>
                      <select 
                        className="form-select rounded-3"
                        value={prodForm.subcategory_id}
                        onChange={(e) => setProdForm({ ...prodForm, subcategory_id: e.target.value })}
                        required
                      >
                        {currentCategory?.subcategories?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Product Name *</label>
                      <input 
                        type="text" 
                        className="form-control rounded-3"
                        value={prodForm.name}
                        onChange={(e) => setProdForm({ ...prodForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Price (₹) *</label>
                      <input 
                        type="number" 
                        step="0.01"
                        className="form-control rounded-3"
                        value={prodForm.price}
                        onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Description</label>
                      <textarea 
                        className="form-control rounded-3" 
                        rows="3"
                        value={prodForm.description}
                        onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                      ></textarea>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Primary Image URL</label>
                      <input 
                        type="text" 
                        className="form-control rounded-3"
                        value={prodForm.images[0] || ''}
                        onChange={(e) => {
                          const newImgs = [...prodForm.images];
                          newImgs[0] = e.target.value;
                          setProdForm({ ...prodForm, images: newImgs });
                        }}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Availability</label>
                      <select 
                        className="form-select rounded-3"
                        value={prodForm.is_available}
                        onChange={(e) => setProdForm({ ...prodForm, is_available: parseInt(e.target.value) })}
                      >
                        <option value={1}>Available</option>
                        <option value={0}>Unavailable</option>
                      </select>
                    </div>

                    {/* DYNAMIC CUSTOMIZATION CONFIGURATION */}
                    <div className="col-12 mt-4 pt-3 border-top">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-1">
                          <Sparkles size={16} color="#7C3AED" /> Configure Customization Fields
                        </h6>
                        <button type="button" onClick={handleAddCustomizationField} className="btn btn-sm btn-outline-purple">
                          + Add Field
                        </button>
                      </div>

                      <div className="d-flex flex-column gap-3">
                        {prodForm.customizations.map((cust, idx) => (
                          <div key={idx} className="p-3 rounded-3 bg-light border">
                            <div className="row g-2 align-items-center">
                              <div className="col-md-4">
                                <label className="form-label small fw-semibold">Field Label *</label>
                                <input 
                                  type="text"
                                  className="form-control form-control-sm rounded-2"
                                  placeholder="e.g. Custom Message"
                                  value={cust.field_label}
                                  onChange={(e) => handleCustomizationChange(idx, 'field_label', e.target.value)}
                                  required
                                />
                              </div>

                              <div className="col-md-3">
                                <label className="form-label small fw-semibold">Type</label>
                                <select 
                                  className="form-select form-select-sm rounded-2"
                                  value={cust.field_type}
                                  onChange={(e) => handleCustomizationChange(idx, 'field_type', e.target.value)}
                                >
                                  <option value="text">Text Input</option>
                                  <option value="textarea">Text Area</option>
                                  <option value="dropdown">Dropdown Selection</option>
                                  <option value="color">Color Picker</option>
                                  <option value="image_upload">Image Upload</option>
                                </select>
                              </div>

                              {cust.field_type === 'dropdown' && (
                                <div className="col-md-3">
                                  <label className="form-label small fw-semibold">Dropdown Options (JSON)</label>
                                  <input 
                                    type="text"
                                    className="form-control form-control-sm rounded-2"
                                    placeholder='["Option 1", "Option 2"]'
                                    value={typeof cust.options === 'string' ? cust.options : JSON.stringify(cust.options || [])}
                                    onChange={(e) => handleCustomizationChange(idx, 'options', e.target.value)}
                                  />
                                </div>
                              )}

                              <div className="col-md-2 d-flex align-items-center gap-2 mt-4">
                                <div className="form-check">
                                  <input 
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={Boolean(cust.is_required)}
                                    onChange={(e) => handleCustomizationChange(idx, 'is_required', e.target.checked ? 1 : 0)}
                                  />
                                  <label className="form-check-label small">Req</label>
                                </div>
                                <button type="button" onClick={() => handleRemoveCustomizationField(idx)} className="btn btn-sm text-danger border-0 p-0">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowProductModal(false)}>Cancel</button>
                  <button type="submit" className="btn-dt-primary">Save Product</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
