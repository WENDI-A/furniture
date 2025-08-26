import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag, Settings } from "lucide-react";
import axios from "axios";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null); // user state
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Products", path: "/product" },
    { name: "About", path: "/about" },
  ];

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
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
    
    // Set up interval to refresh cart count every 30 seconds
    const interval = setInterval(fetchCartCount, 30000);
    
    // Listen for cart updates from other components
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
    localStorage.removeItem("user"); // clear user data
    localStorage.removeItem("token"); // clear token if used
    localStorage.removeItem("userId"); // clear userId
    setUser(null);
    setCartCount(0); // clear cart count
    navigate("/signin"); // redirect to sign in
  };

  return (
    <nav className="sticky top-0 z-50 bg-background border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/home" className="text-2xl font-bold text-foreground">
          MyFurniture
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "hover:text-primary transition-colors",
                location.pathname === link.path && "text-primary font-medium"
              )}
            >
              {link.name}
            </Link>
          ))}

          {user ? (
            <div className="flex items-center gap-3">
              {/* Cart Icon with Badge */}
              <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
              
              {/* Circle Avatar with first letter */}
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white font-bold cursor-pointer hover:bg-primary/90 transition-colors">
                {user.firstName?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium">{user.firstName}</span>
              
              {/* Profile Dropdown */}
              <div className="relative group">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Order History
                    </Link>
                    <Link
                      to="/addresses"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Manage Addresses
                    </Link>
                    <div className="border-t mt-2 pt-2">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
                className="hover:text-primary transition-colors"
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
          className="md:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "block text-sm hover:text-primary",
                location.pathname === link.path && "text-primary font-medium"
              )}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {user ? (
            <div className="flex items-center gap-3 mt-3">
              {/* Mobile Cart Link */}
              <Link
                to="/cart"
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors w-full"
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
              
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white font-bold">
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
