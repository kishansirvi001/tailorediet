import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ add this
import "./Hero.css";

function Hero() {
  const navigate = useNavigate(); // ✅ add this

  return (
    <section className="hero">
      <div className="container hero-container">

        {/* LEFT CONTENT */}
        <div className="hero-left">
          <h1>Smart Diet & Health Calculator</h1>

          <p>
            Generate personalized diet plans and calculate your health metrics instantly.
          </p>

          <div className="hero-buttons">
            <button
              className="btn-primary"
              onClick={() => navigate("/questionnaire")} // ✅ add this
            >
              Get Started
            </button>

            <button className="btn-secondary">Learn More</button>
            <button className="btn-outline">Try Demo</button>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hero-right">
          <img src="/images/diet-hero.jpg" alt="Healthy Diet" />
        </div>

      </div>
    </section>
  );
}

export default Hero;