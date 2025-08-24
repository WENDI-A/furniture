import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Product() {
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("a-z");
  const [price, setPrice] = useState(1000);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");

  const itemsPerPage = 6;

  // --- FETCH PRODUCTS FROM BACKEND ---
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        // Map image paths
        const backendProducts = res.data.map((p) => ({
          ...p,
          image: `http://localhost:5000/images/${p.image}`,
        }));
        setProducts(backendProducts);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // --- FILTERING ---
  let filteredProducts = [...products];

  if (query.trim() !== "") {
    filteredProducts = filteredProducts.filter((p) =>
      p.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  filteredProducts = filteredProducts.filter((p) => p.price <= Number(price));

  if (categoryFilter !== "all") {
    filteredProducts = filteredProducts.filter(
      (p) => p.category.toLowerCase() === categoryFilter.toLowerCase()
    );
  }

  if (companyFilter !== "all") {
    filteredProducts = filteredProducts.filter(
      (p) => `Company ${p.company}` === companyFilter
    );
  }

  // --- SORTING ---
  if (sortOrder === "a-z") filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
  if (sortOrder === "z-a") filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
  if (sortOrder === "price-low") filteredProducts.sort((a, b) => a.price - b.price);
  if (sortOrder === "price-high") filteredProducts.sort((a, b) => b.price - a.price);

  // --- PAGINATION ---
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const visibleProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // --- ACTIONS ---
  const handleSearch = () => {
    setQuery(searchInput);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchInput("");
    setQuery("");
    setPrice(1000);
    setCategoryFilter("all");
    setCompanyFilter("all");
    setSortOrder("a-z");
    setCurrentPage(1);
  };

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Search */}
        <div>
          <h5 className="font-semibold mb-2">Search Product</h5>
          <input
            type="text"
            placeholder="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full border rounded p-2"
          />
          <div className="mt-4">
            <h5 className="font-semibold mb-2">Select Price</h5>
            <div className="flex justify-between text-sm">
              <span>0</span>
              <strong>{price} Birr</strong>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={price}
              onChange={(e) => {
                setPrice(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full mt-2"
            />
            <span className="text-sm">Max: $1,000</span>
          </div>
        </div>

        {/* Category */}
        <div>
          <h5 className="font-semibold mb-2">Select Category</h5>
          <select
            className="w-full border rounded p-2"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            {["all", "Table", "Chair", "Kids", "Sofa", "Bed", "Lamp", "Shelf", "Electronics"].map(
              (cat) => (
                <option key={cat}>{cat}</option>
              )
            )}
          </select>
        </div>

        {/* Company */}
        <div>
          <h5 className="font-semibold mb-2">Select Company</h5>
          <select
            className="w-full border rounded p-2"
            value={companyFilter}
            onChange={(e) => {
              setCompanyFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            {["all", "Company A", "Company B", "Company C"].map((comp) => (
              <option key={comp}>{comp}</option>
            ))}
          </select>
          <button
            onClick={handleSearch}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            SEARCH
          </button>
        </div>

        {/* Sort */}
        <div>
          <h5 className="font-semibold mb-2">Sort By</h5>
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border rounded p-2"
          >
            <option value="a-z">a-z</option>
            <option value="z-a">z-a</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
          <button
            onClick={handleReset}
            className="mt-4 w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
          >
            RESET
          </button>
        </div>
      </div>

      {/* Products */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleProducts.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
          >
            <img
              src={product.image}
              alt={product.title}
              className="h-60 object-cover rounded-md"
            />
            <div className="mt-4 text-center">
              <h5 className="font-semibold">{product.title}</h5>
              <p className="text-gray-600 text-sm">{product.description}</p>
              <h5 className="mt-2 font-bold">{Number(product.price).toFixed(2)} Birr
</h5>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-2 rounded ${
              currentPage === page ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Product;
