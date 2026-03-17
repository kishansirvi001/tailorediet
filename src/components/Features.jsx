import React from "react";
import "./Features.css";

/* Import icons from react-icons */
import { FaAppleAlt, FaRunning, FaHeartbeat } from "react-icons/fa";

function Features() {
  const featuresData = [
    {
      icon: <FaAppleAlt />,
      title: "Healthy Nutrition",
      description: "Personalized meal plans tailored to your body type and goals.",
    },
    {
      icon: <FaRunning />,
      title: "Fitness Tracking",
      description: "Track your workouts and monitor progress over time.",
    },
    {
      icon: <FaHeartbeat />,
      title: "Health Metrics",
      description: "Calculate BMI, BMR, calories, and ideal weight easily.",
    },
    {
      icon: <FaAppleAlt />,
      title: "Diet Tips",
      description: "Expert-backed tips to improve your diet and lifestyle.",
    },
    {
      icon: <FaRunning />,
      title: "Exercise Plans",
      description: "Customized routines for beginners and advanced users.",
    },
    {
      icon: <FaHeartbeat />,
      title: "Wellness Insights",
      description: "Understand your body and health trends over time.",
    },
  ];

  return (
    <section className="features-section">
      <div className="container">
        <h2>Our Key Features</h2>
        <div className="features-container">
          {featuresData.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;