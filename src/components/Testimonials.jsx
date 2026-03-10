import React from "react";

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
  ];

  return (
    <div className="testimonials">
      <h2>What Our Users Say</h2>
      <div className="testimonial-grid">
        {testimonials.map((item, index) => (
          <div className="testimonial-card" key={index}>
            <p>"{item.feedback}"</p>
            <h4>- {item.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Testimonials;