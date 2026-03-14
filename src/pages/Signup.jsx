import React, { useState } from "react";
import "./Auth.css";

function Signup() {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/signup",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({name,email,password})
    });

    const data = await res.json();

    alert("Signup successful");
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h2>Create Account</h2>
        <p>Join TailorDiet and get your custom diet plan</p>

        <form onSubmit={handleSignup}>

          <input
            type="text"
            placeholder="Name"
            onChange={(e)=>setName(e.target.value)}
            required
          />

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

          <button type="submit">Signup</button>

        </form>

      </div>

    </div>
  );
}

export default Signup;