import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/theme.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import CategoryView from './pages/CategoryView';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import MyOrders from './pages/MyOrders';
import OrderDetail from './pages/OrderDetail';
import MyProfile from './pages/MyProfile';
import Notifications from './pages/Notifications';
import ProductRequest from './pages/ProductRequest';
import Login from './pages/Login';
import Register from './pages/Register';

import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminCategories from './pages/Admin/AdminCategories';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminReviews from './pages/Admin/AdminReviews';
import AdminRequests from './pages/Admin/AdminRequests';

// Protected Route Component for Customer
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-5 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Protected Route Component for Admin
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-5 text-center">Loading...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/admin/login" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <Router>
            <div className="d-flex flex-column min-vh-100 bg-lavender">
              <Navbar />
              <main className="flex-grow-1">
                <Routes>
                  {/* Public Customer Storefront Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/category/:slug" element={<CategoryView />} />
                  <Route path="/category/:slug/:subSlug" element={<CategoryView />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/request-gift" element={<ProductRequest />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected Customer Routes */}
                  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="/order-confirmation/:id" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
                  <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                  <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
                  <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

                  {/* Admin Portal Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
                  <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                  <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
                  <Route path="/admin/reviews" element={<AdminRoute><AdminReviews /></AdminRoute>} />
                  <Route path="/admin/requests" element={<AdminRoute><AdminRequests /></AdminRoute>} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
