import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null); // user state
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

  const handleSignOut = () => {
    localStorage.removeItem("user"); // clear user data
    localStorage.removeItem("token"); // clear token if used
    setUser(null);
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
              {/* Circle Avatar with first letter */}
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white font-bold">
                {user.firstName?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium">{user.firstName}</span>
              <Button variant="secondary" onClick={handleSignOut}>
                Sign Out
              </Button>
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
