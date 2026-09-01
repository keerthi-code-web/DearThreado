import React, { useState } from 'react';
import { Upload, Sparkles, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';

const CustomizationForm = ({ fields, values, onChange }) => {
  const [uploadingField, setUploadingField] = useState(null);

  if (!fields || fields.length === 0) return null;

  const handleChange = (fieldLabel, val) => {
    onChange({
      ...values,
      [fieldLabel]: val
    });
  };

  const handleFileUpload = async (fieldLabel, file) => {
    if (!file) return;
    try {
      setUploadingField(fieldLabel);
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        handleChange(fieldLabel, res.data.image_url);
      }
    } catch (err) {
      console.error('File Upload Error:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingField(null);
    }
  };

  return (
    <div className="p-4 rounded-4 my-3" style={{ backgroundColor: '#FAF8FF', border: '1.5px dashed #DDD6FE' }}>
      <div className="d-flex align-items-center gap-2 mb-3 text-purple-primary" style={{ color: '#7C3AED' }}>
        <Sparkles size={18} />
        <h6 className="fw-bold m-0">Personalize Your Gift</h6>
      </div>

      <div className="row g-3">
        {fields.map((field) => {
          const val = values[field.field_label] || '';

          return (
            <div key={field.id || field.field_label} className="col-12">
              <label className="form-label fw-semibold small text-dark mb-1">
                {field.field_label}
                {field.is_required ? <span className="text-danger ms-1">*</span> : null}
              </label>

              {/* Text Input */}
              {field.field_type === 'text' && (
                <input
                  type="text"
                  className="form-control rounded-3 border-purple-light"
                  placeholder={field.placeholder || `Enter ${field.field_label}`}
                  value={val}
                  onChange={(e) => handleChange(field.field_label, e.target.value)}
                  required={Boolean(field.is_required)}
                />
              )}

              {/* Textarea */}
              {field.field_type === 'textarea' && (
                <textarea
                  className="form-control rounded-3 border-purple-light"
                  rows="3"
                  placeholder={field.placeholder || `Enter ${field.field_label}`}
                  value={val}
                  onChange={(e) => handleChange(field.field_label, e.target.value)}
                  required={Boolean(field.is_required)}
                ></textarea>
              )}

              {/* Dropdown Selection */}
              {field.field_type === 'dropdown' && (
                <select
                  className="form-select rounded-3 border-purple-light"
                  value={val}
                  onChange={(e) => handleChange(field.field_label, e.target.value)}
                  required={Boolean(field.is_required)}
                >
                  <option value="">{field.placeholder || `-- Select ${field.field_label} --`}</option>
                  {Array.isArray(field.options) && field.options.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              )}

              {/* Color Picker */}
              {field.field_type === 'color' && (
                <div className="d-flex align-items-center gap-3">
                  <input
                    type="color"
                    className="form-control form-control-color rounded-circle border-0 p-1"
                    style={{ width: '42px', height: '42px', cursor: 'pointer' }}
                    value={val || '#7C3AED'}
                    onChange={(e) => handleChange(field.field_label, e.target.value)}
                  />
                  <span className="small text-muted fw-mono">{val || '#7C3AED'}</span>
                </div>
              )}

              {/* Image Upload */}
              {field.field_type === 'image_upload' && (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    className="d-none"
                    id={`file-upload-${field.id || field.field_label}`}
                    onChange={(e) => handleFileUpload(field.field_label, e.target.files[0])}
                  />
                  <label
                    htmlFor={`file-upload-${field.id || field.field_label}`}
                    className="btn btn-outline-purple w-100 py-2.5 rounded-3 d-flex align-items-center justify-content-center gap-2"
                    style={{ borderColor: '#DDD6FE', color: '#7C3AED', backgroundColor: '#ffffff' }}
                  >
                    {uploadingField === field.field_label ? (
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                    ) : (
                      <Upload size={16} />
                    )}
                    {val ? 'Change Photo' : 'Upload Photo Reference'}
                  </label>

                  {val && (
                    <div className="mt-2 d-flex align-items-center gap-2 p-2 bg-white rounded border">
                      <img src={val} alt="Uploaded preview" className="rounded" width="40" height="40" style={{ objectFit: 'cover' }} />
                      <span className="small text-truncate text-muted">{val}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomizationForm;
