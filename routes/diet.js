import express from "express";

const router = express.Router();

/* ================= DIET DATABASE ================= */

const dietPlans = {
  "weight-loss": {
    Vegetarian: [
      "Breakfast: Oats + Almonds",
      "Snack: Apple",
      "Lunch: 2 Chapati + Dal + Salad",
      "Snack: Green Tea + Roasted Chana",
      "Dinner: Vegetable Soup + Paneer Salad"
    ],

    Vegan: [
      "Breakfast: Poha + Coconut",
      "Snack: Banana",
      "Lunch: Brown Rice + Rajma + Salad",
      "Snack: Fruit Bowl",
      "Dinner: Veg Soup + Tofu"
    ],

    Keto: [
      "Breakfast: Omelette + Avocado",
      "Snack: Nuts",
      "Lunch: Grilled Chicken + Salad",
      "Snack: Cheese Cubes",
      "Dinner: Paneer Stir Fry"
    ],

    None: [
      "Breakfast: Idli + Sambar",
      "Snack: Fruit",
      "Lunch: Rice + Dal + Veg",
      "Snack: Buttermilk",
      "Dinner: Roti + Sabzi"
    ]
  },

  muscle: {
    Vegetarian: [
      "Breakfast: Paneer Paratha + Curd",
      "Snack: Banana Shake",
      "Lunch: Rice + Dal + Paneer",
      "Snack: Peanut Butter Sandwich",
      "Dinner: Chapati + Soyabean Curry"
    ]
  },

  maintain: {
    Vegetarian: [
      "Breakfast: Upma",
      "Snack: Fruit",
      "Lunch: Dal + Rice + Veg",
      "Snack: Nuts",
      "Dinner: Chapati + Sabzi"
    ]
  }
};

/* ================= DIET API ================= */

router.get("/", (req, res) => {

  const { goal, diet } = req.query;

  if (!goal || !diet) {
    return res.json({
      plan: "Please select goal and diet preference."
    });
  }

  const goalPlans = dietPlans[goal];

  if (!goalPlans) {
    return res.json({
      plan: "Goal not supported."
    });
  }

  const selectedPlan = goalPlans[diet];

  if (!selectedPlan) {
    return res.json({
      plan: "Diet preference not supported."
    });
  }

  res.json({
    plan: selectedPlan.join("\n")
  });

});

export default router;