import React, { useEffect } from "react";

/* Components */
import Hero from "../components/Hero";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";

/* Pages */
import About from "./About";

/* Styles */
import "./Home.css";

function Home() {

  /* 🔥 Scroll Animation Logic */
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-up");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home">

      {/* Hero Section (no animation needed) */}
      <Hero />

      {/* About Section */}
      <section className="about-section fade-up">
        <div className="container">
          <About />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section fade-up">
        <div className="container">
          <Features />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section fade-up">
        <div className="container">
          <Testimonials />
        </div>
      </section>

    </div>
  );
}

export default Home;