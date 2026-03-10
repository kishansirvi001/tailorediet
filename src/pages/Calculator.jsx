import React, { useState } from "react";

function Calculator() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState("");

  const calcBMI = () => {
    if (!weight || !height) return;
    const h = height / 100;
    const bmiValue = weight / (h * h);
    setBmi(bmiValue.toFixed(2));
  };

  return (
    <div className="calculator-page">
      <div className="calculator-card">
        <h1>BMI Calculator</h1>
        <input
          type="number"
          placeholder="Weight (kg)"
          onChange={(e) => setWeight(e.target.value)}
        />
        <input
          type="number"
          placeholder="Height (cm)"
          onChange={(e) => setHeight(e.target.value)}
        />
        <button onClick={calcBMI}>Calculate BMI</button>
        {bmi && (
          <div className="bmi-result">
            <h2>Your BMI: {bmi}</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default Calculator;