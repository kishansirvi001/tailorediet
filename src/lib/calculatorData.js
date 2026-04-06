export const activityOptions = [
  { value: 'sedentary', label: 'Sedentary', multiplier: 1.2 },
  { value: 'light', label: 'Light', multiplier: 1.375 },
  { value: 'moderate', label: 'Moderate', multiplier: 1.55 },
  { value: 'active', label: 'Active', multiplier: 1.725 },
  { value: 'very-active', label: 'Very active', multiplier: 1.9 },
]

export const goalOptions = [
  {
    value: 'weight-loss',
    label: 'Weight loss',
    calorieOffset: -450,
    pace: '0.4 to 0.5 kg / week',
    direction: 'Focus on satiety, high protein, and a steady calorie deficit.',
  },
  {
    value: 'maintain',
    label: 'Maintain',
    calorieOffset: 0,
    pace: 'Weight stable',
    direction: 'Keep calories steady and prioritize long-term consistency.',
  },
  {
    value: 'muscle-gain',
    label: 'Muscle gain',
    calorieOffset: 280,
    pace: '0.2 to 0.3 kg / week',
    direction: 'Support training with a modest surplus and recovery meals.',
  },
]
