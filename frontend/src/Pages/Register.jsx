import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate(); // ✅ for redirecting after registration

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Split full name into first/last for backend schema
		const [first_name, ...rest] = name.trim().split(" ");
		const last_name = rest.join(" ");
		const userData = { first_name, last_name, email, password, name };

		try {
			const response = await fetch("http://localhost:5000/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(userData),
			});

			const data = await response.json();

			if (response.ok) {
				// ✅ Save userId and first name to localStorage
				const firstName = first_name;
				localStorage.setItem("userId", data.userId);
				localStorage.setItem("user", JSON.stringify({ firstName }));

				// Clear form
				setName("");
				setEmail("");
				setPassword("");

				// ✅ Redirect to home
				navigate("/home");
			} else {
				alert("Error: " + (data.message || "Registration failed"));
			}
		} catch (error) {
			console.error("Error:", error);
			alert("Something went wrong!");
		}
	};

	return (
		<Card className="max-w-md mx-auto mt-10 shadow-lg">
			<CardHeader>
				<CardTitle className="text-center">Create Account</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<Label htmlFor="name">Full Name</Label>
						<Input
							id="name"
							type="text"
							placeholder="John Doe"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>
					<div>
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div>
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<Button type="submit" className="w-full">
						Register
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};

export default RegisterForm;
