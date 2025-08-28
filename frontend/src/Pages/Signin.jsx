import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ✅ for redirect

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      console.log("Login successful:", res.data);

      // ✅ Save token, userId and role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("userRole", res.data.role || "user");

      // ✅ Save first name and role for Navbar
      const fullName = res.data.name || email.split("@")[0]; // fallback to email
      const firstName = fullName.split(" ")[0];
      localStorage.setItem("user", JSON.stringify({ firstName, role: res.data.role || "user" }));

      alert("Login successful!");

      // ✅ Redirect to home
      navigate("/home");

    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Login failed!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-black-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Login</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>
    </div>
  );
}
