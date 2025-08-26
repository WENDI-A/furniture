import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";

const Cart = () => {
  const [cart, setCart] = useState({ cartItems: [], summary: { subtotal: 0, tax: 0, total: 0, itemCount: 0 } });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || !userId) {
      navigate("/signin");
      return;
    }
    fetchCart();
  }, [userId, token, navigate]);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/cart/${userId}`, {
        headers: { Authorization: token }
      });
      setCart(response.data);
      setLoading(false);
      
      // Update cart count in localStorage for navbar
      localStorage.setItem("cartCount", response.data.summary.itemCount.toString());
      
      // Dispatch custom event to update navbar cart count
      window.dispatchEvent(new CustomEvent("cartUpdated", { 
        detail: { count: response.data.summary.itemCount } 
      }));
    } catch (error) {
      console.error("Error fetching cart:", error);
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(true);
    try {
      await axios.put(`http://localhost:5000/api/cart/item/${cartItemId}`, 
        { quantity: newQuantity },
        { headers: { Authorization: token } }
      );
      await fetchCart(); // Refresh cart data
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity");
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (cartItemId) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/cart/item/${cartItemId}`, {
        headers: { Authorization: token }
      });
      await fetchCart(); // Refresh cart data
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item");
    }
  };

  const clearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your entire cart?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/cart/${userId}`, {
        headers: { Authorization: token }
      });
      setCart({ cartItems: [], summary: { subtotal: 0, tax: 0, total: 0, itemCount: 0 } });
    } catch (error) {
      console.error("Error clearing cart:", error);
      alert("Failed to clear cart");
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400 animate-pulse" />
          <p className="text-lg text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cart.cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any items yet.</p>
          <button
            onClick={() => navigate("/product")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {cart.summary.itemCount} {cart.summary.itemCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-800 font-medium transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              {cart.cartItems.map((item) => (
                <div key={item.id} className="p-6 border-b last:border-b-0">
                  <div className="flex items-start gap-4">
                    {/* Product Image */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    
                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Color: <span className="capitalize">{item.color}</span></span>
                        <span>Category: {item.category}</span>
                      </div>
                    </div>

                    {/* Price and Quantity */}
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900 mb-3">
                        ${item.totalPrice}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={updating || item.quantity <= 1}
                          className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={updating}
                          className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="mt-3 text-red-600 hover:text-red-800 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.summary.itemCount} items)</span>
                  <span>${cart.summary.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (15%)</span>
                  <span>${cart.summary.tax}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>${cart.summary.total}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={cart.cartItems.length === 0}
              >
                Proceed to Checkout
              </button>

              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate("/product")}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 