import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // new state for password
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please enter both name and password.");
      return;
    }

    try {
      const response = await fetch(" http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name:username, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data.user));
    
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignup= () => {
    navigate("/signup");
  };


  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem" }}
      />
      <br />
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem" }}
      />
      <br />
      <button onClick={handleLogin} style={{ padding: "0.5rem 1rem" }}>
        Login
      </button>
      <div style={{ marginTop: "1rem", fontSize: "0.85rem", fontStyle: "italic" }}>
        New user?{" "}
        <span
          onClick={handleSignup}
          style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
        >
          Sign Up
        </span>
      </div>
    </div>
  );
};

export default Login;

