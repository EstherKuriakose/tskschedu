import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSignup = async () => {
  const { name, phone, password, confirmPassword } = formData;

  if (!name || !phone || !password || !confirmPassword) {
    alert("Please fill in all fields");
    return;
  }

  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    alert("Incorrect phone number. Please enter a 10-digit number.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const response = await fetch(" http://127.0.0.1:8000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, phone, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Signup failed");
    }

    alert("Account created successfully! Redirecting to login...");
     setFormData({
  name: "",
  phone: "",
  password: "",
  confirmPassword: "",
});

    navigate("/login");
  } catch (error) {
    alert(error.message);
  }
};


  const goToLogin = () => {
   
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: "400px", margin: "3rem auto", textAlign: "center" }}>
      <h2>Sign Up</h2>

      <input
        type="text"
        name="name"
        placeholder="Enter your name"
        value={formData.name}
        onChange={handleChange}
        style={{ margin: "0.5rem 0", padding: "0.5rem", width: "100%" }}
      />

      <input
        type="tel"
        name="phone"
        placeholder="Enter phone number"
        value={formData.phone}
        onChange={handleChange}
        style={{ margin: "0.5rem 0", padding: "0.5rem", width: "100%" }}
      />

      <input
        type="password"
        name="password"
        placeholder="Create password"
        value={formData.password}
        onChange={handleChange}
        style={{ margin: "0.5rem 0", padding: "0.5rem", width: "100%" }}
      />

      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm password"
        value={formData.confirmPassword}
        onChange={handleChange}
        style={{ margin: "0.5rem 0", padding: "0.5rem", width: "100%" }}
      />

      <button
        onClick={handleSignup}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem", width: "100%" }}
      >
        Create Account
      </button>

      <div style={{ marginTop: "1rem", fontSize: "0.85rem", fontStyle: "italic" }}>
        Already have an account?{" "}
        <span
          onClick={goToLogin}
          style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
        >
          Login
        </span>
      </div>
    </div>
  );
};

export default Signup;
