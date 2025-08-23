import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { products } from "../data/products";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedColor, setSelectedColor] = useState("");
  const [amount, setAmount] = useState(1);

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <p className="text-center text-red-500 mt-10">
        Product not found
      </p>
    );
  }

  const displayCompany = product.company
    ? (String(product.company).startsWith("Company")
        ? product.company
        : `Company ${product.company}`)
    : "—";

  const isLoggedIn = !!localStorage.getItem("token");

  const handleAddToBag = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (!selectedColor) {
      alert("Please select a color first.");
      return;
    }

    // Add to cart logic
    console.log("Added to bag:", {
      id: product.id,
      title: product.title,
      selectedColor,
      amount,
    });
    alert(`${product.title} added to your bag!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div className="w-full">
          <img
            src={product.image}
            alt={product.title}
            className="rounded-2xl shadow-lg w-full h-[400px] object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            {typeof product.price === "number" && (
              <p className="text-xl text-indigo-600 font-semibold mt-2">
                {product.price.toFixed(2)} Birr
              </p>
            )}
            <p className="text-gray-600 mt-4">
              {product.description || "No description available."}
            </p>
            <div className="mt-4 text-sm text-gray-500 space-y-1">
              {product.category && <p><strong>Category:</strong> {product.category}</p>}
              {product.company && <p><strong>Company:</strong> {displayCompany}</p>}
            </div>
          </div>

          {/* Colors */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Colors</h3>
            <div className="flex gap-3">
              {["green", "blue", "red", "black"].map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition ${
                    selectedColor === color
                      ? "border-black scale-110"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={color}
                />
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Amount</h3>
            <select
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="border border-gray-300 rounded-lg p-2 w-32"
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Unified CTA Button */}
          <button
            onClick={handleAddToBag}
            className={`px-6 py-3 rounded-xl shadow-lg transition text-white ${
              isLoggedIn
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-800 hover:bg-gray-900"
            }`}
            title={!isLoggedIn
              ? "Sign in to add to bag"
              : !selectedColor
              ? "Select a color first"
              : "Add to bag"}
          >
            {isLoggedIn ? "ADD TO BAG" : "SIGN IN TO ADD"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
