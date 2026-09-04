import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';
import api from '../../services/api';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [catForm, setCatForm] = useState({ name: '', slug: '', description: '', image_url: '' });

  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [subForm, setSubForm] = useState({ category_id: '', name: '', slug: '', description: '', image_url: '' });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.categories || []);
      }
    } catch (err) {
      console.error('Fetch Categories Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, catForm);
      } else {
        await api.post('/categories', catForm);
      }
      setShowCategoryModal(false);
      fetchCategories();
    } catch (err) {
      alert('Failed to save category.');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category and all its subcategories?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert('Failed to delete category.');
    }
  };

  const handleSaveSubcategory = async (e) => {
    e.preventDefault();
    try {
      if (editingSubcategory) {
        await api.put(`/subcategories/${editingSubcategory.id}`, subForm);
      } else {
        await api.post('/subcategories', subForm);
      }
      setShowSubcategoryModal(false);
      fetchCategories();
    } catch (err) {
      alert('Failed to save subcategory.');
    }
  };

  const handleDeleteSubcategory = async (id) => {
    if (!window.confirm('Delete this subcategory?')) return;
    try {
      await api.delete(`/subcategories/${id}`);
      fetchCategories();
    } catch (err) {
      alert('Failed to delete subcategory.');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-purple" style={{ color: '#7C3AED' }} role="status"></div>
        <p className="text-muted mt-2">Loading Category Hierarchy...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Category & Subcategory Management</h2>
          <p className="text-muted small mb-0">Organize Category &rarr; Subcategory handmade product discovery</p>
        </div>

        <div className="d-flex gap-2">
          <button 
            onClick={() => {
              setEditingCategory(null);
              setCatForm({ name: '', slug: '', description: '', image_url: '' });
              setShowCategoryModal(true);
            }} 
            className="btn-dt-primary btn-sm"
          >
            <Plus size={16} /> Add Category
          </button>

          <button 
            onClick={() => {
              setEditingSubcategory(null);
              setSubForm({ category_id: categories[0]?.id || '', name: '', slug: '', description: '', image_url: '' });
              setShowSubcategoryModal(true);
            }} 
            className="btn-dt-secondary btn-sm"
          >
            <Plus size={16} /> Add Subcategory
          </button>
        </div>
      </div>

      <div className="row g-4">
        {categories.map((cat) => (
          <div key={cat.id} className="col-12">
            <div className="dt-card p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-3">
                  <img src={cat.image_url} alt={cat.name} className="rounded-3" width="50" height="50" style={{ objectFit: 'cover' }} />
                  <div>
                    <h5 className="fw-bold text-dark mb-0">{cat.name} <span className="small text-muted font-mono">({cat.slug})</span></h5>
                    <p className="small text-muted mb-0">{cat.description}</p>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button 
                    onClick={() => {
                      setEditingCategory(cat);
                      setCatForm({ name: cat.name, slug: cat.slug, description: cat.description || '', image_url: cat.image_url || '' });
                      setShowCategoryModal(true);
                    }}
                    className="btn btn-sm btn-light"
                  >
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="btn btn-sm btn-light text-danger">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Subcategories list */}
              <div className="ms-4 ps-3 border-start">
                <h6 className="fw-bold text-dark small mb-2 text-uppercase" style={{ letterSpacing: '0.5px' }}>Subcategories ({cat.subcategories?.length || 0})</h6>
                <div className="row g-2">
                  {cat.subcategories?.map((sub) => (
                    <div key={sub.id} className="col-md-6 col-lg-4">
                      <div className="p-2.5 rounded-3 bg-light d-flex align-items-center justify-content-between border">
                        <div>
                          <div className="fw-semibold small text-dark">{sub.name}</div>
                          <div className="small text-muted font-mono" style={{ fontSize: '0.75rem' }}>{sub.slug}</div>
                        </div>
                        <div className="d-flex gap-1">
                          <button 
                            onClick={() => {
                              setEditingSubcategory(sub);
                              setSubForm({ category_id: sub.category_id, name: sub.name, slug: sub.slug, description: sub.description || '', image_url: sub.image_url || '' });
                              setShowSubcategoryModal(true);
                            }}
                            className="btn btn-sm p-1 border-0"
                          >
                            <Edit size={14} />
                          </button>
                          <button onClick={() => handleDeleteSubcategory(sub.id)} className="btn btn-sm p-1 border-0 text-danger">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{editingCategory ? 'Edit Category' : 'Create Category'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowCategoryModal(false)}></button>
              </div>
              <form onSubmit={handleSaveCategory}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Category Name *</label>
                    <input 
                      type="text" 
                      className="form-control rounded-3" 
                      value={catForm.name} 
                      onChange={(e) => setCatForm({ ...catForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Slug *</label>
                    <input type="text" className="form-control rounded-3" value={catForm.slug} onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Description</label>
                    <textarea className="form-control rounded-3" rows="2" value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Image URL</label>
                    <input type="text" className="form-control rounded-3" value={catForm.image_url} onChange={(e) => setCatForm({ ...catForm, image_url: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowCategoryModal(false)}>Cancel</button>
                  <button type="submit" className="btn-dt-primary">Save Category</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Subcategory Modal */}
      {showSubcategoryModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{editingSubcategory ? 'Edit Subcategory' : 'Create Subcategory'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowSubcategoryModal(false)}></button>
              </div>
              <form onSubmit={handleSaveSubcategory}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Parent Category *</label>
                    <select 
                      className="form-select rounded-3" 
                      value={subForm.category_id} 
                      onChange={(e) => setSubForm({ ...subForm, category_id: e.target.value })}
                      required
                    >
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Subcategory Name *</label>
                    <input 
                      type="text" 
                      className="form-control rounded-3" 
                      value={subForm.name} 
                      onChange={(e) => setSubForm({ ...subForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Slug *</label>
                    <input type="text" className="form-control rounded-3" value={subForm.slug} onChange={(e) => setSubForm({ ...subForm, slug: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Description</label>
                    <textarea className="form-control rounded-3" rows="2" value={subForm.description} onChange={(e) => setSubForm({ ...subForm, description: e.target.value })}></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Image URL</label>
                    <input type="text" className="form-control rounded-3" value={subForm.image_url} onChange={(e) => setSubForm({ ...subForm, image_url: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowSubcategoryModal(false)}>Cancel</button>
                  <button type="submit" className="btn-dt-primary">Save Subcategory</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
