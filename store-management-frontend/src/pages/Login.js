import React from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/login-bg.jpg";

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div
      className="fullscreen-bg"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="overlay-dark">
      </div>
      <form
        className="card-glass login-card"
        onSubmit={handleSubmit}
      >
         <h2 className="login-title"> Login Here </h2>
         <p className="login-subtitle"> Welcome To The Store Management </p>
        <input
          className="login-input"
          type="text"
          placeholder="Username"
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
        />
        <button
          className="btn-primary"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
}

