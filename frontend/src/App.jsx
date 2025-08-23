import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";

import Home from "./Pages/Home";
import Product from "./Pages/Product";
import About from "./Pages/About";
import ProductDetails from "./Pages/ProductDetails";
import Signin from "./Pages/Signin";
import Register from "./Pages/Register";
import Navbar from "./Components/Navbar"; // <-- import Navbar
import "./App.css";

function AppWrapper() {
  const location = useLocation();

  // Show Navbar on all pages except Signin / Register
  const showNavbar = !["/signin", "/register", "/createaccount"].includes(location.pathname);

  return (
    <div>
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
