import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CreditCard,
  Truck,
  MapPin,
  ShoppingBag,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { getImageUrl } from "@/lib/utils";

const Checkout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState({
    cartItems: [],
    summary: { subtotal: 0, tax: 0, total: 0, itemCount: 0 },
  });
  const [addresses, setAddresses] = useState([]);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [orderNotes, setOrderNotes] = useState("");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Derived amounts for display
  const shippingCost = 15.99;
  const computedSubtotal = Number(cart.summary?.subtotal || 0);
  const computedTax = Number(cart.summary?.tax || 0);
  const finalTotal = (
    computedSubtotal +
    computedTax +
    shippingCost -
    (couponApplied ? couponDiscount : 0)
  ).toFixed(2);

  useEffect(() => {
    if (!token || !userId) {
      navigate("/signin");
      return;
    }
    fetchCart();
    fetchAddresses();
  }, [userId, token, navigate]);

  const fetchCart = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/cart/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data;
      const IMAGE_FIXES = {
        "LoungChair.jpg": "LoungeChair.jpg",
        "StramlinedTable.jpg": "StreamlinedTable.jpg",
        "CoffeTable.jpg": "Coffee Table.jpg",
      };

      const items = (data.cartItems || []).map((it) => ({
        ...it,
        image: getImageUrl(IMAGE_FIXES[it.image] || it.image),
      }));

      setCart({ ...data, cartItems: items });

      // Update cart count for navbar consistency
      try {
        localStorage.setItem(
          "cartCount",
          String(data.summary?.itemCount || items.reduce((s, i) => s + (i.quantity || 0), 0))
        );
        window.dispatchEvent(
          new CustomEvent("cartUpdated", {
            detail: { count: data.summary?.itemCount || 0 },
          })
        );
      } catch (_) {}
    } catch (error) {
      console.error("Error fetching cart:", error);
      navigate("/cart");
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/addresses/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAddresses(response.data || []);

      // Set default addresses
      const defaultAddress = (response.data || []).find((addr) => addr.is_default);
      if (defaultAddress) {
        setSelectedBillingAddress(defaultAddress.id);
        setSelectedShippingAddress(defaultAddress.id);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleAddressSelection = (type, addressId) => {
    if (type === "billing") {
      setSelectedBillingAddress(addressId);
      if (useSameAddress) {
        setSelectedShippingAddress(addressId);
      }
    } else {
      setSelectedShippingAddress(addressId);
    }
  };

  const handleUseSameAddress = (checked) => {
    setUseSameAddress(checked);
    if (checked) {
      setSelectedShippingAddress(selectedBillingAddress);
    }
  };

  const handleCouponApply = async () => {
    if (!couponCode.trim()) return;

    try {
      // Simulate a 10% discount for now
      setCouponApplied(true);
      setCouponDiscount(computedSubtotal * 0.1);
      alert("Coupon applied successfully!");
    } catch (error) {
      alert("Invalid coupon code");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedBillingAddress || !selectedShippingAddress) {
      alert("Please select billing and shipping addresses");
      return;
    }

    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        userId: parseInt(userId),
        billingAddressId: selectedBillingAddress,
        shippingAddressId: selectedShippingAddress,
        paymentMethod: paymentMethod,
        couponCode: couponApplied ? couponCode : null,
        notes: orderNotes,
      };

      const response = await axios.post(
        "http://localhost:5000/api/orders/create",
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Order placed successfully! Order #: " + response.data.order.order_number);

      // Clear cart count in navbar
      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { count: 0 } }));

      navigate("/orders");
    } catch (error) {
      console.error("Error placing order:", error);
      const errorMessage = error.response?.data?.error || "Failed to place order";
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (cart.cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 dark:text-gray-300 mb-6">Add some items to your cart before checkout.</p>
          <button
            onClick={() => navigate("/product")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Checkout</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Addresses Section */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping & Billing Addresses
              </h2>

              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                  <p className="text-gray-600 dark:text-gray-300 mb-4">No addresses found</p>
                  <button
                    onClick={() => navigate("/addresses")}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Billing Address */}
                  <div>
                    <h3 className="font-medium mb-2">Billing Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {addresses.map((address) => (
                        <label key={address.id} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="billingAddress"
                            value={address.id}
                            checked={selectedBillingAddress === address.id}
                            onChange={() => handleAddressSelection("billing", address.id)}
                            className="text-blue-600"
                          />
                          <div className="flex-1 p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                            <div className="font-medium">
                              {address.first_name} {address.last_name}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              {address.address_line1}
                              {address.address_line2 && <br />}
                              {address.address_line2}
                              <br />
                              {address.city}, {address.state} {address.postal_code}
                              <br />
                              {address.country}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Same Address Checkbox */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="sameAddress"
                      checked={useSameAddress}
                      onChange={(e) => handleUseSameAddress(e.target.checked)}
                      className="text-blue-600"
                    />
                    <label htmlFor="sameAddress" className="text-sm">
                      Use same address for shipping
                    </label>
                  </div>

                  {/* Shipping Address */}
                  {!useSameAddress && (
                    <div>
                      <h3 className="font-medium mb-2">Shipping Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {addresses.map((address) => (
                          <label key={address.id} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name="shippingAddress"
                              value={address.id}
                              checked={selectedShippingAddress === address.id}
                              onChange={() => handleAddressSelection("shipping", address.id)}
                              className="text-blue-600"
                            />
                            <div className="flex-1 p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                              <div className="font-medium">
                                {address.first_name} {address.last_name}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">
                                {address.address_line1}
                                {address.address_line2 && <br />}
                                {address.address_line2}
                                <br />
                                {address.city}, {address.state} {address.postal_code}
                                <br />
                                {address.country}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Payment Method Section */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </h2>

              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit_card"
                    checked={paymentMethod === "credit_card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-blue-600"
                  />
                  <span>Credit Card</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-blue-600"
                  />
                  <span>PayPal</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={paymentMethod === "bank_transfer"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-blue-600"
                  />
                  <span>Bank Transfer</span>
                </label>
              </div>

              {/* Payment Form Placeholder */}
              {paymentMethod === "credit_card" && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Credit card form would be integrated here with a payment gateway like Stripe.
                  </p>
                </div>
              )}
            </div>

            {/* Order Notes */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-semibold mb-4">Order Notes</h2>
              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Any special instructions or notes for your order..."
                className="w-full p-3 border border-gray-200 dark:border-gray-800 rounded-lg resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                rows="3"
              />
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-6">
                {cart.cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Qty: {item.quantity} • {item.color}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${Number(item.totalPrice).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Code */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code"
                    className="flex-1 p-2 border border-gray-200 dark:border-gray-800 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    disabled={couponApplied}
                  />
                  <button
                    onClick={handleCouponApply}
                    disabled={couponApplied || !couponCode.trim()}
                    className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && (
                  <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Coupon applied! -${couponDiscount.toFixed(2)}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>Subtotal ({cart.summary.itemCount} {cart.summary.itemCount === 1 ? 'item' : 'items'})</span>
                  <span>${Number(cart.summary.subtotal || 0).toFixed(2)}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>- ${couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>Tax (15%)</span>
                  <span>${Number(cart.summary.tax || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>Shipping</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-800 pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${finalTotal}</span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading || !selectedBillingAddress || !selectedShippingAddress}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>

              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate("/cart")}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Back to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
