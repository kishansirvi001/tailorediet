import React from "react";
import "./Testimonials.css";
function Testimonials() {
 const testimonials = [
  {
    name: "Alice Johnson",
    feedback: "TailorDiet helped me lose 10kg in 3 months! Highly recommend.",
  },
  {
    name: "Mark Smith",
    feedback: "I love the personalized plans. Gained muscle and never felt hungry.",
  },
  {
    name: "Priya Singh",
    feedback: "Easy to follow and very flexible. I could stick to my vegan diet easily.",
  },
  {
    name: "John Doe",
    feedback: "The best online diet planner I’ve used. Clear instructions and amazing results.",
  },
  {
    name: "Rahul Sharma",
    feedback: "The Indian diet options were perfect. I lost 6kg while still eating home food.",
  },
  {
    name: "Ananya Gupta",
    feedback: "Very simple and practical diet plans. I finally found something that fits my lifestyle.",
  }
];

  return (
    <section className="testimonials">

<h2>What Our Users Say</h2>

<div className="testimonial-slider">
  <div className="testimonial-track">

    <div className="testimonial-card">
      <p>"This diet calculator helped me plan my meals perfectly!"</p>
      <h4>Rahul Sharma</h4>
    </div>

    <div className="testimonial-card">
      <p>"Very easy to use and the results are accurate."</p>
      <h4>Priya Patel</h4>
    </div>

    <div className="testimonial-card">
      <p>"Amazing tool for tracking calories and diet plans."</p>
      <h4>Amit Verma</h4>
    </div>

  </div>
</div>

</section>
  );
}

export default Testimonials;