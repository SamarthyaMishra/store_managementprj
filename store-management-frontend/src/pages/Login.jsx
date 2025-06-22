import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundImage from "../assets/login-bg.jpg";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/login", {
        username,
        password,
      });

      if (res.status === 200) {
        localStorage.setItem("token", res.data.token || "dummy-token");
        setError("");
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div
      className="fullscreen-bg"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="overlay-dark"></div>
      <form className="card-glass login-card" onSubmit={handleSubmit}>
        <h2 className="login-title"> Login Here </h2>
        <p className="login-subtitle"> Welcome To The Store Management </p>

        <input
          className="login-input"
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
        <input
          className="login-input"
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <button className="btn-primary" type="submit">
          Login
        </button>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

        {/* <p
          style={{ marginTop: "15px", cursor: "pointer", color: "#007bff" }}
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </p> */}
      </form>
    </div>
  );
}
