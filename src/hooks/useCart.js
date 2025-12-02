import { useState, useEffect, useCallback } from 'react';

const CART_STORAGE_KEY = 'cart';
const CART_UPDATE_EVENT = 'cart-updated';

export const useCart = () => {
  const getCartFromStorage = () => {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
  };

  const [cartItems, setCartItems] = useState(getCartFromStorage);

  // Écouter les changements du panier (depuis d'autres composants)
  useEffect(() => {
    const handleCartUpdate = () => {
      setCartItems(getCartFromStorage());
    };

    window.addEventListener(CART_UPDATE_EVENT, handleCartUpdate);
    return () => window.removeEventListener(CART_UPDATE_EVENT, handleCartUpdate);
  }, []);

  const saveCart = useCallback((items) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(CART_UPDATE_EVENT));
  }, []);

  const addToCart = useCallback((book) => {
    const cart = getCartFromStorage();
    const existingIndex = cart.findIndex(item => item.id === book.id);
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: book.id,
        slug: book.slug,
        title: book.title,
        image: book.coverImg,
        quantity: 1,
        unitPrice: parseFloat(book.raw?.prix_euros) || 0,
      });
    }
    
    saveCart(cart);
    return cart;
  }, [saveCart]);

  const updateQuantity = useCallback((id, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: parseInt(newQuantity) } : item
    );
    setCartItems(updatedItems);
    saveCart(updatedItems);
  }, [cartItems, saveCart]);

  const removeItem = useCallback((id) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    saveCart(updatedItems);
  }, [cartItems, saveCart]);

  const getCartCount = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [cartItems]);

  return {
    cartItems,
    addToCart,
    updateQuantity,
    removeItem,
    getCartCount,
    getCartTotal,
  };
};

export default useCart;
