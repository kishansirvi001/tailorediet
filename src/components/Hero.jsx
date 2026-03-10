import React from "react";

function Hero({ start }) {
  return (
    <div className="hero">
      <h1>Welcome to TailorDiet</h1>
      <p>Personalized diet plans for your goals.</p>
      <button onClick={start}>Get Started</button>
    </div>
  );
}

export default Hero;