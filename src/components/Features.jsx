import React from "react";
import "./Features.css";

function Features() {
  return (
    <section className="features-section">

      <div className="features-container">

        <div className="features-header">
          <h2>Why Choose TailorDiet</h2>
          <p>
            Smart tools that help you build the perfect diet plan
            based on your lifestyle and health goals.
          </p>
        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="icon-circle">🥗</div>
            <h3>Personalized Diet Plans</h3>
            <p>
              Get diet recommendations tailored to your body,
              goals, and daily routine.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon-circle">⚡</div>
            <h3>Instant Calculations</h3>
            <p>
              Calculate calories, BMI, and nutritional needs
              instantly using our smart tools.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon-circle">📊</div>
            <h3>Track Your Progress</h3>
            <p>
              Monitor your diet performance and improve your
              health step by step.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon-circle">📱</div>
            <h3>Mobile Friendly</h3>
            <p>
              Use TailorDiet easily on any device with a
              fully responsive design.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon-circle">🧠</div>
            <h3>Smart Recommendations</h3>
            <p>
              Advanced algorithms help suggest the best
              nutrition strategy for you.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon-circle">🚀</div>
            <h3>Reach Your Goals Faster</h3>
            <p>
              Stay consistent with structured plans that
              help you achieve results quickly.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}

export default Features;
