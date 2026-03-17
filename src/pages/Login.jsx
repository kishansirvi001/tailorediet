import React, { useState } from "react";
import "./auth.css";

function Login() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/login",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body: JSON.stringify({email,password})
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="auth-container">

      <h2>Login</h2>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

      </form>

      <p className="switch-text">
        Don't have an account? <a href="/signup">Signup</a>
      </p>

    </div>
  );
}

export default Login;