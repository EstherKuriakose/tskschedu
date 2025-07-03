import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // new state for password
  const navigate = useNavigate();

  const handleLogin = () => {
    // For now, just mocking login by saving to localStorage
    localStorage.setItem("user", username);
    localStorage.setItem("password", password); // optional (not secure in real apps)
    navigate("/dashboard");
  };
  const handleSignupRedirect = () => {
    navigate("/signup"); // this should match your signup route
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
          onClick={handleSignupRedirect}
          style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
        >
          Sign Up
        </span>
      </div>
    </div>
  );
};

export default Login;

