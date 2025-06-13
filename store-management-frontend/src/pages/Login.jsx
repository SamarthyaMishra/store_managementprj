// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import backgroundImage from "../assets/login-bg.jpg";

// const users = [
//   { username: "admin", password: "admin123", mobile: "7755888840" },
//   { username: "user", password: "user123", mobile: "8888888888" },
// ];

// export default function Login() {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const user = users.find(
//       (u) => u.username === username && u.password === password
//     );
//     if (user) {
//       setError("");
//       navigate("/dashboard"); // Or pass user info as needed
//     } else {
//       setError("Invalid username or password");
//     }
//   };

//   return (
//     <div
//       className="fullscreen-bg"
//       style={{ backgroundImage: `url(${backgroundImage})` }}
//     >
//       <div className="overlay-dark"></div>
//       <form className="card-glass login-card" onSubmit={handleSubmit}>
//         <h2 className="login-title"> Login Here </h2>
//         <p className="login-subtitle"> Welcome To The Store Management </p>
//         <input
//           className="login-input"
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//         />
//         <input
//           className="login-input"
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button className="btn-primary" type="submit">
//           Login
//         </button>
//         {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

//         {/* Forgot Password link */}
//         <p style={{ marginTop: "15px", cursor: "pointer", color: "#007bff" }}
//            onClick={() => alert("Implement forgot password flow here")}>
//           Forgot Password?
//         </p>
//       </form>
//     </div>
//   );
// }

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
      const res = await axios.post("http://localhost:8080/api/login", { username, password });
      // res.data should have the JWT token
      // alert(res.data);
      if (res.status === 200) {
  console.log("Login success:", res.data); // Debug response
  localStorage.setItem("token", res.data.token || "dummy-token");
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
  type="text"
  name="username"
  placeholder="Username"
  value={username}
  onChange={(e) => {
    console.log("Username typed:", e.target.value); // Debug
    setUsername(e.target.value);
  }}
  autoComplete="username"
/>
<input
  type="password"
  name="password"
  placeholder="Password"
  value={password}
  onChange={(e) => {
    console.log("Password typed:", e.target.value); // Debug
    setPassword(e.target.value);
  }}
  autoComplete="current-password"
/>

        <button className="btn-primary" type="submit">
          Login
        </button>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

        <p
          style={{ marginTop: "15px", cursor: "pointer", color: "#007bff" }}
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </p>
      </form>
    </div>
  );
}
