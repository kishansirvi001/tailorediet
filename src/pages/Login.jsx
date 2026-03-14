import React, { useState } from "react";
import "./Auth.css";

function Login() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({email,password})
    });

    const data = await res.json();

    localStorage.setItem("token",data.token);

    alert("Login successful");
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h2>Welcome Back</h2>
        <p>Login to your TailorDiet account</p>

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

      </div>

    </div>
  );
}

export default Login;