import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Lock, UserPlus, LogIn, X } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, redirectPath, title, message }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleAction = (target) => {
    onClose();
    navigate(target, { state: { returnTo: redirectPath } });
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(76, 29, 149, 0.4)', backdropFilter: 'blur(4px)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
          <div className="modal-header border-0 pb-0 position-relative">
            <button 
              type="button" 
              className="btn-close position-absolute top-0 end-0 m-3" 
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body text-center p-4 pt-2">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle p-3 mb-3" style={{ backgroundColor: '#FAF8FF', color: '#7C3AED' }}>
              <Heart size={36} fill="#7C3AED" />
            </div>
            
            <h4 className="fw-bold mb-2" style={{ color: '#1E1B4B' }}>
              {title || 'A Little Connection Needed'}
            </h4>
            
            <p className="text-muted mb-4 px-2">
              {message || 'Your DearThreado order deserves a little introduction. Please log in or create an account to keep your custom items saved to your account.'}
            </p>

            <div className="d-grid gap-2">
              <button 
                onClick={() => handleAction('/login')} 
                className="btn btn-dt-primary py-2.5 fs-6 w-100 justify-content-center"
              >
                <LogIn size={18} /> Sign In to Continue
              </button>

              <button 
                onClick={() => handleAction('/register')} 
                className="btn btn-dt-secondary py-2.5 fs-6 w-100 justify-content-center"
              >
                <UserPlus size={18} /> Create New Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
