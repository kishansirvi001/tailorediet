import React from "react";

/* Components */
import Hero from "../components/Hero";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";

/* Pages */
import About from "./About";

/* Styles */
import "./Home.css";

function Home() {
  return (
    <div className="home">

      {/* Hero Section */}
      <section className="hero-section">
        <Hero />
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <About />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <Features />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <Testimonials />
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <CTA />
        </div>
      </section>

    </div>
  );
}

export default Home;
