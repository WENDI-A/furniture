import React from "react";
import { Link } from "react-router-dom";
import AvantGardeLamp from "../Assets/AvantGardeLamp.jpg";
import CoffeTable from "../Assets/CoffeTable.jpg";
import ComfyBed from "../Assets/ComfyBed.jpg";
import hotelsofa from "../Assets/hotelsofa.jpg";
import hoteltv from "../Assets/hoteltv.jpg";
import hoteltable from "../Assets/hoteltable.jpg";

import { products } from "../data/products";

function Home() {
  // Featured product list (by title)
  const featuredProducts = [
    { title: "Avant-Garde Lamp", image: AvantGardeLamp },
    { title: "Comfy Bed", image: ComfyBed },
    { title: "Coffee Table", image: CoffeTable },
  ].map((product) => {
    const matchedProduct = products.find((p) => p.title === product.title);
    return {
      ...product,
      id: matchedProduct?.id || 0,
      price: matchedProduct?.price?.toFixed(2) || "0.00",
    };
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
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
          {[hotelsofa, hoteltable, hoteltv].map((img, i) => (
            <img
              key={i}
              src={img}
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
