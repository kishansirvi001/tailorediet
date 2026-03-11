import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./pages/About";
import Calculator from "./pages/Calculator";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import CTA from "./components/CTA";

/* Global app styles */
import "./App.css";

/* Component-specific styles */
import "./components/Navbar.css";
import "./components/Hero.css";
import "./components/Features.css";
import "./components/Testimonials.css";
import "./components/CTA.css";

/* Page-specific styles */
import "./pages/About.css";
import "./pages/Calculator.css";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <About />
      <Features />
      <Testimonials />
      <CTA />
      <Calculator />
    </div>
  );
}

export default App;