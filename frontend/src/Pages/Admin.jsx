import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Check, Trash2, Users, PackagePlus, Shield } from "lucide-react";

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
      active
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-transparent text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20"
    }`}
  >
    {children}
  </button>
);

export default function Admin() {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    sku: "",
    title: "",
    short_description: "",
    description: "",
    category: "",
    company: "",
    price: "",
    image: "",
    is_active: true,
    is_featured: false,
  });
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole") || JSON.parse(localStorage.getItem("user") || "{}").role;

  useEffect(() => {
    if (!token || role !== "admin") {
      navigate("/home");
      return;
    }
    if (tab === "users") fetchUsers();
    if (tab === "products") fetchProducts();
  }, [tab]);

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users", authHeader);
      setUsers(res.data);
    } catch (e) {
      console.error(e);
      alert("Failed to load users");
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (e) {
      console.error(e);
      alert("Failed to load products");
    }
  };

  const setRole = async (id, newRole) => {
    try {
      await axios.patch(`http://localhost:5000/api/admin/users/${id}/role`, { role: newRole }, authHeader);
      fetchUsers();
    } catch (e) {
      console.error(e);
      alert("Failed to update role");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, authHeader);
      fetchUsers();
    } catch (e) {
      console.error(e);
      alert("Failed to delete user");
    }
  };

  const createProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, price: Number(form.price) };
      await axios.post("http://localhost:5000/api/products", payload, authHeader);
      setForm({ sku: "", title: "", short_description: "", description: "", category: "", company: "", price: "", image: "", is_active: true, is_featured: false });
      fetchProducts();
      alert("Product created");
    } catch (e) {
      console.error(e);
      alert("Failed to create product");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, authHeader);
      fetchProducts();
    } catch (e) {
      console.error(e);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-2">
            <TabButton active={tab === "users"} onClick={() => setTab("users")}>
              <Users className="w-4 h-4 inline mr-2" /> Users
            </TabButton>
            <TabButton active={tab === "products"} onClick={() => setTab("products")}>
              <PackagePlus className="w-4 h-4 inline mr-2" /> Products
            </TabButton>
          </div>
        </div>

        {tab === "users" && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" /> Manage Users
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-left text-gray-600 dark:text-gray-300">
                  <tr>
                    <th className="py-2">ID</th>
                    <th className="py-2">Name</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Role</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t border-gray-200 dark:border-gray-800">
                      <td className="py-2">{u.id}</td>
                      <td className="py-2">{u.first_name} {u.last_name}</td>
                      <td className="py-2">{u.email}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
                          {u.role || 'user'}
                        </span>
                      </td>
                      <td className="py-2 space-x-2">
                        {u.role !== 'admin' ? (
                          <button
                            onClick={() => setRole(u.id, 'admin')}
                            className="px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
                          >
                            Make Admin
                          </button>
                        ) : (
                          <button
                            onClick={() => setRole(u.id, 'user')}
                            className="px-3 py-1 text-xs rounded bg-gray-600 text-white hover:bg-gray-700"
                          >
                            Make User
                          </button>
                        )}
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "products" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">All Products</h2>
              <div className="space-y-3">
                {products.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg border-gray-200 dark:border-gray-800">
                    <div>
                      <div className="font-medium">{p.title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">SKU: {p.sku} • ${Number(p.price).toFixed(2)}</div>
                    </div>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <PackagePlus className="w-5 h-5" /> Add Product
              </h2>
              <form onSubmit={createProduct} className="space-y-3">
                <input className="w-full p-2 border rounded bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800" placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
                <input className="w-full p-2 border rounded bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                <input className="w-full p-2 border rounded bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800" placeholder="Short Description" value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} />
                <textarea className="w-full p-2 border rounded bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="3" />
                <input className="w-full p-2 border rounded bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                <input className="w-full p-2 border rounded bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800" placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                <input type="number" step="0.01" className="w-full p-2 border rounded bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                <input className="w-full p-2 border rounded bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800" placeholder="Image filename (e.g., ModernSofa.jpg)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />

                <div className="flex items-center gap-3 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                    Active
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
                    Featured
                  </label>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                  Create Product
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-3">Note: images are served from backend/Assets via /images/filename</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
