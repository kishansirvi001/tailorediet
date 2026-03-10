import React from "react";

function CTA({ start }) {
  return (
    <div className="cta">
      <h2>Ready to start your plan?</h2>
      <button onClick={start}>Start Questionnaire</button>
    </div>
  );
}

export default CTA;