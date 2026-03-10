import React from "react";

function HowItWorks() {
  const steps = [
    {
      title: "Choose Your Goal",
      description: "Select whether you want to lose weight, gain muscle, or maintain your weight.",
    },
    {
      title: "Select Diet Preference",
      description: "Pick from Vegetarian, Vegan, Keto, or None for a balanced plan.",
    },
    {
      title: "Get Personalized Plan",
      description: "Receive a diet plan tailored specifically to your goal and preference.",
    },
  ];

  return (
    <div className="how-it-works">
      <h2>How It Works</h2>
      <div className="steps">
        {steps.map((step, index) => (
          <div className="step-card" key={index}>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HowItWorks;