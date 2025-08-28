import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { getImageUrl } from "@/lib/utils";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [amount, setAmount] = useState(1);

  const isLoggedIn = !!localStorage.getItem("token");

  // --- FETCH PRODUCT FROM BACKEND ---
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        const prod = res.data;
        // Map image path
        prod.image = getImageUrl(prod.image);
        setProduct(prod);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10">Loading product details...</p>;
  }

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

  const handleAddToBag = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token) {
      navigate("/signin", { state: { from: location.pathname } });
      return;
    }

    if (!userId) {
      alert("User ID not found. Please sign in again.");
      navigate("/signin");
      return;
    }

    if (!selectedColor) {
      alert("Please select a color first.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/cart/add",
        {
          userId: parseInt(userId),
          productId: parseInt(product.id),
          quantity: amount,
          color: selectedColor
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert(`${product.title} added to your bag!`);
      
      // Optionally redirect to cart or stay on page
      if (window.confirm("Item added to cart! Would you like to view your cart?")) {
        navigate("/cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      const errorMessage = error.response?.data?.error || "Failed to add item to cart";
      alert(`Error: ${errorMessage}`);
    }
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
              className="border border-gray-300 rounded-lg p-2 w-32 bg-gray-900"
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Add to Bag */}
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
