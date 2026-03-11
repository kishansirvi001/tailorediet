import React from "react";
import "./Features.css"; // make sure this CSS file exists

function Features() {
  const features = [
    {
      title: "Custom Diet Plans",
      description: "Personalized meal plans based on your goal and preference.",
    },
    {
      title: "Nutrition Tracking",
      description: "Easily track calories, macros, and nutrients for better results.",
    },
    {
      title: "Expert Tips",
      description: "Receive guidance and tips from nutrition experts.",
    },
    {
      title: "Quick & Easy",
      description: "Simple, easy-to-follow plans that fit your daily routine.",
    },
    {
      title: "Flexible Choices",
      description: "Choose vegetarian, vegan, keto, or balanced meals.",
    },
    {
      title: "Results Guaranteed",
      description: "Follow the plan and see measurable results over time.",
    },
  ];

  return (
    <div className="features-container">
  <div className="feature-grid">
    {features.map((feature, index) => (
      <div className="feature-card" key={index}>
        <div className="icon">{feature.icon}</div>
        <h3>{feature.title}</h3>
        <p>{feature.description}</p>
      </div>
    ))}
  </div>
</div>
  );
}

export default Features;