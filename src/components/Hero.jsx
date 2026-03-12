import React from "react";

function Hero({ start }) {
  const handleStart = () => {
    if (start) {
      start();
    }
  };

  return (
    <section className="hero">
      <h1>Welcome to TailorDiet</h1>
      <p>Personalized diet plans for your goals.</p>

      <button onClick={handleStart}>
        Start Now
      </button>
    </section>
  );
}

export default Hero;