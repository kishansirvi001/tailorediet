import { useState, useEffect } from "react";

function Questionnaire() {
  const [goal, setGoal] = useState("");
  const [diet, setDiet] = useState("");
  const [activity, setActivity] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [plan, setPlan] = useState("");

  // Auto-fetch diet plan whenever inputs change
  useEffect(() => {
    const fetchPlan = async () => {
      if (!goal || !diet || !activity) return;

      try {
        const response = await fetch(
          `http://localhost:5000/diet?goal=${goal}&diet=${diet}&activity=${activity}&weight=${targetWeight}`
        );
        const data = await response.json();
        setPlan(data.plan);
      } catch (err) {
        console.error(err);
        setPlan("Unable to fetch diet plan.");
      }
    };

    fetchPlan();
  }, [goal, diet, activity, targetWeight]);

  return (
    <div className="page" style={{ maxWidth: "800px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>TailorDiet Planner</h1>

      <div className="form" style={{ display: "grid", gap: "20px" }}>
        <div>
          <label>Your Goal</label>
          <select onChange={e => setGoal(e.target.value)} value={goal} style={{ width: "100%", padding: "8px" }}>
            <option value="">Select Goal</option>
            <option value="weight-loss">Weight Loss</option>
            <option value="muscle">Muscle Gain</option>
            <option value="maintain">Maintain Weight</option>
          </select>
        </div>

        <div>
          <label>Target Weight Change (kg)</label>
          <input
            type="number"
            value={targetWeight}
            onChange={e => setTargetWeight(e.target.value)}
            placeholder="e.g., 5"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div>
          <label>Activity Level</label>
          <select onChange={e => setActivity(e.target.value)} value={activity} style={{ width: "100%", padding: "8px" }}>
            <option value="">Select Activity</option>
            <option value="Sedentary">Sedentary</option>
            <option value="Light">Light</option>
            <option value="Moderate">Moderate</option>
            <option value="Active">Active</option>
          </select>
        </div>

        <div>
          <label>Diet Preference</label>
          <select onChange={e => setDiet(e.target.value)} value={diet} style={{ width: "100%", padding: "8px" }}>
            <option value="">Select Diet</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Keto">Keto</option>
            <option value="None">None</option>
          </select>
        </div>
      </div>
<div className="result" style={{ marginTop: "40px" }}>
  <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Your Personalized Indian Diet Plan</h2>

  <div
    style={{
      display: "flex",
      flexWrap: "wrap",      // wrap cards to next line if space is not enough
      gap: "15px",
      justifyContent: "center",
      background: "#e6f3d9",
      padding: "20px",
      borderRadius: "12px",
    }}
  >
    {plan.split("\n").filter(line => line.trim() !== "").map((line, index) => (
      <div
        key={index}
        style={{
          background: "#ffffff",
          padding: "15px 20px",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          minWidth: "150px",     // ensures cards have reasonable width
          flex: "1 1 150px",     // allows cards to shrink/grow
          textAlign: "center",
        }}
      >
        {line}
      </div>
    ))}
  </div>
</div>
      
    </div>
  );
}

export default Questionnaire;