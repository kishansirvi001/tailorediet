import { useState } from "react";

function Questionnaire() {
  const [goal, setGoal] = useState("");
  const [diet, setDiet] = useState("");
  const [result, setResult] = useState("");

  const generateDiet = () => {
    if (goal === "weight-loss") {
      setResult("Breakfast: Oats\nLunch: Brown Rice + Veggies\nDinner: Salad + Soup");
    } else if (goal === "muscle") {
      setResult("Breakfast: Eggs + Toast\nLunch: Chicken + Rice\nDinner: Protein Shake + Veggies");
    } else {
      setResult("Balanced diet: Fruits, Whole grains, Lean protein.");
    }
  };

  return (
    <div className="page">
      <div className="form">
        <h2>Your Goal</h2>
        <select onChange={(e) => setGoal(e.target.value)}>
          <option>Select Goal</option>
          <option value="weight-loss">Weight Loss</option>
          <option value="muscle">Muscle Gain</option>
          <option value="maintain">Maintain Weight</option>
        </select>

        <h2>Diet Preference</h2>
        <select onChange={(e) => setDiet(e.target.value)}>
          <option>None</option>
          <option>Vegetarian</option>
          <option>Vegan</option>
          <option>Keto</option>
        </select>

        <button onClick={generateDiet}>Submit</button>

        {result && (
          <div className="result">
            <h3>Your Diet Plan</h3>
            <p style={{ whiteSpace: "pre-line" }}>{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Questionnaire;