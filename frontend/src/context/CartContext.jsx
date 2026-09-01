import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/cart');
      if (res.data.success) {
        setCartItems(res.data.items || []);
        setCartTotal(res.data.total_amount || 0);
      }
    } catch (err) {
      console.error('Fetch Cart Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart, user]);

  const addToCart = async (productId, quantity, customizationValues) => {
    const res = await api.post('/cart/items', {
      product_id: productId,
      quantity,
      customization_values: customizationValues
    });
    if (res.data.success) {
      await fetchCart();
    }
    return res.data;
  };

  const updateQuantity = async (itemId, quantity) => {
    const res = await api.put(`/cart/items/${itemId}`, { quantity });
    if (res.data.success) {
      await fetchCart();
    }
    return res.data;
  };

  const removeItem = async (itemId) => {
    const res = await api.delete(`/cart/items/${itemId}`);
    if (res.data.success) {
      await fetchCart();
    }
    return res.data;
  };

  const clearCart = async () => {
    const res = await api.delete('/cart');
    if (res.data.success) {
      setCartItems([]);
      setCartTotal(0);
    }
    return res.data;
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartTotal, cartCount, loading, addToCart, updateQuantity, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
