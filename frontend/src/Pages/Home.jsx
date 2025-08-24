import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Home() {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // Fetch products from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        setProducts(res.data);

        // Pick featured products by title
        const featuredTitles = ["Avant-Garde Lamp", "Comfy Bed", "Coffee Table"];
        const featured = res.data
  .filter((p) => featuredTitles.includes(p.title))
  .map((p) => ({
    id: p.id,
    title: p.title,
    image: `http://localhost:5000/images/${p.image}`,
    price: Number(p.price).toFixed(2), // <- convert to number first
  }));

        setFeaturedProducts(featured);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            We are changing <br />
            the way people <br />
            shop
          </h1>
          <p className="text-lg text-gray-400 mb-6 font-medium">WELCOME!</p>
          <Link to="/product">
            <button className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white font-bold py-2 px-6 rounded-lg shadow-lg">
              PRODUCTS
            </button>
          </Link>
        </div>

        {/* Images Scroll */}
        <div className="flex space-x-6 overflow-x-auto p-4 rounded-xl border border-gray-700 bg-gray-800 scroll-smooth scrollbar-thin scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-400 transition-all duration-300">
          {["hotelsofa.jpg", "hoteltable.jpg", "hoteltv.jpg"].map((img, i) => (
            <img
              key={i}
              src={`http://localhost:5000/images/${img}`}
              alt={`hotel-${i}`}
              className="w-[300px] h-[400px] rounded-2xl object-cover border-4 border-gray-600 hover:scale-105 transition-transform duration-500"
            />
          ))}
        </div>
      </section>

      {/* Featured Section */}
      <section>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-10 text-center md:text-left">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group transition-transform duration-300 hover:scale-105"
              >
                <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-lg hover:shadow-2xl overflow-hidden transition-shadow duration-300">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4 text-center">
                    <h5 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {product.title}
                    </h5>
                    <p className="text-blue-600 font-bold">${product.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
