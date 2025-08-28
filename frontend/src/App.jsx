import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";

import Home from "./Pages/Home";
import Product from "./Pages/Product";
import About from "./Pages/About";
import ProductDetails from "./Pages/ProductDetails";
import Signin from "./Pages/Signin";
import Register from "./Pages/Register";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import UserProfile from "./Pages/UserProfile";
import OrderHistory from "./Pages/OrderHistory";
import AddressManagement from "./Pages/AddressManagement";
import Navbar from "./components/Navbar"; // <-- import Navbar
import "./App.css";
import Admin from "./Pages/Admin";

function AppWrapper() {
  const location = useLocation();

  // Show Navbar on all pages except Signin / Register
  const showNavbar = !["/signin", "/register", "/createaccount"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {showNavbar && <Navbar />} {/* <-- render Navbar */}
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/createaccount" element={<Signin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/about" element={<About />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/orders/:orderId" element={<OrderHistory />} />
        <Route path="/addresses" element={<AddressManagement />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
