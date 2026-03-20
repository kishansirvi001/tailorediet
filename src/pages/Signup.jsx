import React, { useState } from "react";
import "./auth.css";

function Signup() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
    height: "",
    weight: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="auth-page">
      {/* LEFT PANEL */}
      <div className="auth-left">
        <h1>TailorDiet</h1>
        <p>Personalized nutrition for your body</p>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right">
        <h2>Create Account</h2>

        <form onSubmit={handleSignup}>
          
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="button"
                className="auth-btn"
                onClick={() => setStep(2)}
              >
                Next →
              </button>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" name="dob" onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select name="gender" onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="form-group">
                <label>Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  placeholder="Enter your height"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  placeholder="Enter your weight"
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className="auth-btn"
                  onClick={() => setStep(1)}
                >
                  ← Back
                </button>

                <button type="submit" className="auth-btn">
                  Signup
                </button>
              </div>
            </>
          )}
        </form>

        <p className="switch-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;