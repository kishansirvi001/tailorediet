
import React from "react";
import "./Hero.css";

function Hero({ start }) {

  const handleStart = () => {
    if (start) {
      start();
    }
  };

  return (
    <section className="hero">
      <div className="hero-content">

        <h1>Build Your Perfect Diet Plan</h1>

        <p>
          TailorDiet creates personalized diet plans based on your
          body, lifestyle, and fitness goals.
        </p>

        <button className="hero-btn" onClick={handleStart}>
          Start Now
        </button>

      </div>
    </section>
  );
}

export default Hero;
