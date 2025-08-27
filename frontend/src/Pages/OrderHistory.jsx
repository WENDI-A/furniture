import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  Truck, 
  Package, 
  AlertCircle,
  Eye,
  Calendar,
  DollarSign,
  MapPin
} from "lucide-react";
import axios from "axios";
import { getImageUrl } from "@/lib/utils";

const OrderHistory = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || !userId) {
      navigate("/signin");
      return;
    }
    
    if (orderId) {
      fetchOrderDetails(orderId);
    } else {
      fetchOrders();
    }
  }, [userId, token, navigate, orderId]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data;
      const IMAGE_FIXES = {
        "LoungChair.jpg": "LoungeChair.jpg",
        "StramlinedTable.jpg": "StreamlinedTable.jpg",
        "CoffeTable.jpg": "Coffee Table.jpg"
      };
      const normalized = data.map(order => ({
        ...order,
        items: order.items.map(it => ({
          ...it,
          image: getImageUrl(IMAGE_FIXES[it.image] || it.image)
        }))
      }));
      setOrders(normalized);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/${id}?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const IMAGE_FIXES = {
        "LoungChair.jpg": "LoungeChair.jpg",
        "StramlinedTable.jpg": "StreamlinedTable.jpg",
        "CoffeTable.jpg": "Coffee Table.jpg"
      };
      const details = response.data;
      details.items = details.items.map(it => ({
        ...it,
        image: getImageUrl(IMAGE_FIXES[it.image] || it.image)
      }));
      setSelectedOrder(details);
      setShowOrderDetails(true);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-purple-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-indigo-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Loading orders...</p>
        </div>
      </div>
    );
  }

  // Show order details if viewing a specific order
  if (showOrderDetails && selectedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => {
                setShowOrderDetails(false);
                setSelectedOrder(null);
                navigate("/orders");
              }}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
            >
              ← Back to Orders
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600 mt-2">Order #{selectedOrder.order_number}</p>
          </div>

          {/* Order Status */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Order Status</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.order_status)}`}>
                {selectedOrder.order_status.charAt(0).toUpperCase() + selectedOrder.order_status.slice(1)}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Ordered: {formatDate(selectedOrder.created_at)}</span>
              </div>
              {selectedOrder.estimated_delivery && (
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>Estimated Delivery: {formatDate(selectedOrder.estimated_delivery)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {selectedOrder.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                  <img
                    src={item.image}
                    alt={item.product_name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product_name}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <div className="text-sm text-gray-500 mt-1">
                      SKU: {item.product_sku} • Qty: {item.quantity}
                      {item.selected_color && ` • Color: ${item.selected_color}`}
                      {item.selected_size && ` • Size: ${item.selected_size}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(item.unit_price)}</div>
                    <div className="text-sm text-gray-600">Total: {formatCurrency(item.total_price)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Billing Address</h3>
                <div className="text-sm text-gray-600">
                  <div>{selectedOrder.billing_address.first_name} {selectedOrder.billing_address.last_name}</div>
                  <div>{selectedOrder.billing_address.address_line1}</div>
                  {selectedOrder.billing_address.address_line2 && (
                    <div>{selectedOrder.billing_address.address_line2}</div>
                  )}
                  <div>
                    {selectedOrder.billing_address.city}, {selectedOrder.billing_address.state} {selectedOrder.billing_address.postal_code}
                  </div>
                  <div>{selectedOrder.billing_address.country}</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Shipping Address</h3>
                <div className="text-sm text-gray-600">
                  <div>{selectedOrder.shipping_address.first_name} {selectedOrder.shipping_address.last_name}</div>
                  <div>{selectedOrder.shipping_address.address_line1}</div>
                  {selectedOrder.shipping_address.address_line2 && (
                    <div>{selectedOrder.shipping_address.address_line2}</div>
                  )}
                  <div>
                    {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postal_code}
                  </div>
                  <div>{selectedOrder.shipping_address.country}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          {selectedOrder.shipping_info && (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Shipping Method</div>
                  <div className="font-medium">{selectedOrder.shipping_info.method}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Status</div>
                  <div className="font-medium">{selectedOrder.shipping_info.status}</div>
                </div>
                {selectedOrder.shipping_info.tracking_number && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Tracking Number</div>
                    <div className="font-medium">{selectedOrder.shipping_info.tracking_number}</div>
                  </div>
                )}
                {selectedOrder.shipping_info.carrier && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Carrier</div>
                    <div className="font-medium">{selectedOrder.shipping_info.carrier}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(selectedOrder.subtotal)}</span>
              </div>
              {selectedOrder.discount_amount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(selectedOrder.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatCurrency(selectedOrder.tax_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatCurrency(selectedOrder.shipping_amount)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(selectedOrder.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show order list
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Track your orders and view order details</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-12 text-center">
            <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-gray-300" />
            <h2 className="text-2xl font-bold text-gray-700 mb-4">No Orders Yet</h2>
            <p className="text-gray-500 mb-6">Start shopping to see your order history here.</p>
            <button
              onClick={() => navigate("/product")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.order_status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.order_status)}`}>
                        {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Order #{order.order_number}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-lg">{formatCurrency(order.total_amount)}</div>
                    <div className="text-sm text-gray-600">{formatDate(order.created_at)}</div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{item.product_name}</div>
                          <div className="text-sm text-gray-600">
                            Qty: {item.quantity} • {item.selected_color}
                          </div>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">
                          +{order.items.length - 3} more items
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''} • 
                    Payment: {order.payment_status}
                  </div>
                  <button
                    onClick={() => fetchOrderDetails(order.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory; 