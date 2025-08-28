import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag, Settings, Sun, Moon } from "lucide-react";
import axios from "axios";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [theme, setTheme] = useState("light");
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Products", path: "/product" },
    { name: "About", path: "/about" },
  ];

  // Apply theme to <html> element
  const applyTheme = (t) => {
    const root = document.documentElement;
    if (t === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    // Optional: improve native form/scrollbar colors
    root.style.colorScheme = t;
  };

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = stored || (prefersDark ? "dark" : "light");
      setTheme(initial);
      applyTheme(initial);
    } catch (_) {
      // Fallback to light if localStorage fails
      setTheme("light");
      applyTheme("light");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try { localStorage.setItem("theme", next); } catch (_) {}
    applyTheme(next);
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("userRole");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setRole(parsed.role || storedRole || null);
    } else if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  // Fetch cart count when user is logged in
  useEffect(() => {
    const fetchCartCount = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      if (token && userId) {
        try {
          const response = await axios.get(`http://localhost:5000/api/cart/count/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCartCount(response.data.count);
        } catch (error) {
          console.error("Error fetching cart count:", error);
        }
      } else {
        setCartCount(0);
      }
    };

    fetchCartCount();
    const interval = setInterval(fetchCartCount, 30000);

    const handleCartUpdate = (event) => {
      setCartCount(event.detail.count);
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [user]);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    setUser(null);
    setCartCount(0);
    navigate("/signin");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/home" className="text-2xl font-bold">
          MyFurniture
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "hover:text-blue-600 dark:hover:text-blue-400 transition-colors",
                location.pathname === link.path && "text-blue-600 dark:text-blue-400 font-medium"
              )}
            >
              {link.name}
            </Link>
          ))}

          {role === 'admin' && (
            <Link
              to="/admin"
              className={cn(
                "hover:text-blue-600 dark:hover:text-blue-400 transition-colors",
                location.pathname === "/admin" && "text-blue-600 dark:text-blue-400 font-medium"
              )}
            >
              Admin
            </Link>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              {/* Cart Icon with Badge */}
              <Link to="/cart" className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
              
              {/* Circle Avatar with first letter */}
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold cursor-pointer hover:bg-blue-500 transition-colors">
                {user.firstName?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium">{user.firstName}</span>
              
              {/* Profile Dropdown */}
              <div className="relative group">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      Order History
                    </Link>
                    <Link
                      to="/addresses"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      Manage Addresses
                    </Link>
                    <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link
                to="/signin"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Sign In
              </Link>
              <Button variant="secondary" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between py-2">
            <div className="text-sm text-gray-600 dark:text-gray-300">Theme</div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "block text-sm hover:text-blue-600 dark:hover:text-blue-400",
                location.pathname === link.path && "text-blue-600 dark:text-blue-400 font-medium"
              )}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {user && role === 'admin' && (
            <Link
              to="/admin"
              className={cn(
                "block text-sm hover:text-blue-600 dark:hover:text-blue-400",
                location.pathname === "/admin" && "text-blue-600 dark:text-blue-400 font-medium"
              )}
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3 mt-3">
              <Link
                to="/cart"
                className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors w-full"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold ml-auto">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
              
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                {user.firstName?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium">{user.firstName}</span>
              <Button
                variant="secondary"
                onClick={handleSignOut}
                className="w-full"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Button variant="secondary" asChild className="w-full mt-2">
              <Link to="/register">Register</Link>
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
