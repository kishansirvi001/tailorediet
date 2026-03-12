import React from "react";
import "./Features.css";
import { FaAppleAlt, FaChartLine, FaUserMd } from "react-icons/fa";

function Features() {
  const features = [
    {
      icon: <FaAppleAlt />,
      title: "Custom Diet Plans",
      description:
        "Personalized meal plans designed according to your goals and dietary preferences.",
    },
    {
      icon: <FaChartLine />,
      title: "Nutrition Tracking",
      description:
        "Track calories, macros, and nutrients easily to stay consistent with your health goals.",
    },
    {
      icon: <FaUserMd />,
      title: "Expert Guidance",
      description:
        "Get professional diet recommendations backed by nutrition research.",
    },
  ];

  return (
    <section className="features-section">
      <div className="features-header">
        <h2>Powerful Features</h2>
        <p>
          Everything you need to build healthy eating habits and achieve your
          fitness goals faster.
        </p>
      </div>

      <div className="features-container">
        <div className="feature-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
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