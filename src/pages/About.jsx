import React from "react";
import "./About.css";

function About() {
  return (
    <section className="about" id="about">

      <div className="about-container">

        <div className="about-text">
          <h2>About TailorDiet</h2>

          <p>
            TailorDiet helps you generate personalized diet plans based on
            your goals, lifestyle, and dietary preferences.
          </p>

          <p>
            Whether you want to lose weight, gain muscle, or maintain a
            healthy lifestyle, our platform provides structured meal plans
            designed to help you succeed.
          </p>

          <p>
            Our mission is to make healthy eating simple, personalized,
            and accessible for everyone.
          </p>
        </div>

        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061"
            alt="Healthy food"
          />
        </div>

      </div>

    </section>
  );
}

export default About;