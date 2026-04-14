const DEFAULT_SITE_NAME = 'TailorDiet'
const DEFAULT_TITLE = 'TailorDiet | Nutrition Calculators, Diet Plans, and Workout Planner'
const DEFAULT_DESCRIPTION =
  'TailorDiet helps you calculate calories, BMI, macros, water intake, and build personalized diet plans and workout routines in one place.'
const DEFAULT_IMAGE = '/favicon.svg'

function buildWebPageSchema({ title, description, canonicalUrl }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: canonicalUrl,
  }
}

export const seoConfig = {
  '/': {
    title: DEFAULT_TITLE,
    description:
      'Use TailorDiet to calculate calories, BMI, macros, and hydration needs, then turn those numbers into personalized diet plans and guided workouts.',
    keywords:
      'calorie calculator, bmi calculator, macro calculator, diet plan, workout planner, water intake calculator, health calculators',
    structuredData: ({ canonicalUrl }) => [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: DEFAULT_SITE_NAME,
        url: canonicalUrl,
        description: DEFAULT_DESCRIPTION,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: DEFAULT_SITE_NAME,
        url: canonicalUrl,
      },
    ],
  },
  '/calculators': {
    title: 'Health Calculators | Calories, BMI, Macros, Water Intake | TailorDiet',
    description:
      'Explore TailorDiet health calculators for calories, calorie deficit, calorie surplus, BMI, body fat, ideal weight, macros, water intake, and workout planning.',
    keywords:
      'health calculators, calorie calculator, bmi calculator, body fat calculator, ideal weight calculator, macro calculator, water intake calculator',
  },
  '/calculators/calorie': {
    title: 'Calorie Calculator | Daily Calorie Needs | TailorDiet',
    description:
      'Estimate maintenance calories and daily calorie targets based on your age, height, weight, activity level, and goal.',
    keywords: 'calorie calculator, daily calorie needs, maintenance calories, calorie target',
  },
  '/calculators/calorie-deficit': {
    title: 'Calorie Deficit Calculator | Fat Loss Target | TailorDiet',
    description:
      'Plan a calorie deficit for weight loss using your maintenance calories and a sustainable daily fat loss target.',
    keywords: 'calorie deficit calculator, weight loss calories, fat loss target',
  },
  '/calculators/calorie-surplus': {
    title: 'Calorie Surplus Calculator | Muscle Gain Calories | TailorDiet',
    description:
      'Estimate a calorie surplus for lean muscle gain with a practical daily intake target above maintenance.',
    keywords: 'calorie surplus calculator, muscle gain calories, bulking calculator',
  },
  '/calculators/bmi': {
    title: 'BMI Calculator | Body Mass Index Tool | TailorDiet',
    description:
      'Calculate BMI from your height and weight and understand whether you fall in an underweight, healthy, overweight, or obesity range.',
    keywords: 'bmi calculator, body mass index, bmi chart',
  },
  '/calculators/body-fat': {
    title: 'Body Fat Calculator | Body Fat Estimate | TailorDiet',
    description:
      'Get a rough body fat estimate using body metrics and use it as a starting point for nutrition and fitness planning.',
    keywords: 'body fat calculator, body fat estimate, body composition tool',
  },
  '/calculators/ideal-weight': {
    title: 'Ideal Weight Calculator | Healthy Weight Range | TailorDiet',
    description:
      'Find an ideal weight reference range based on height to support healthier goal setting and body metrics tracking.',
    keywords: 'ideal weight calculator, healthy weight range, target weight',
  },
  '/calculators/macro': {
    title: 'Macro Calculator | Protein, Carbs, and Fat Targets | TailorDiet',
    description:
      'Split daily calories into protein, carbs, and fats with a macro calculator built for weight loss, maintenance, and muscle gain goals.',
    keywords: 'macro calculator, protein calculator, carb calculator, fat calculator',
  },
  '/calculators/water-intake': {
    title: 'Water Intake Calculator | Daily Hydration Needs | TailorDiet',
    description:
      'Estimate how much water to drink each day based on your body weight, lifestyle, and hydration goals.',
    keywords: 'water intake calculator, hydration calculator, daily water needs',
  },
  '/workout-planner': {
    title: 'Workout Planner | Guided Exercise Cards and Splits | TailorDiet',
    description:
      'Choose your fitness level, goal, and muscle group split to get guided workout cards with sets, reps, rest, and demo visuals.',
    keywords: 'workout planner, workout routine generator, gym workout plan, exercise cards',
  },
  '/diet-plans': {
    title: 'Personalized Indian Diet Plans | AI Meal Planner | TailorDiet',
    description:
      'Generate personalized Indian diet plans based on your goal, diet preference, region, budget, activity level, allergies, and daily routine.',
    keywords:
      'indian diet plan, personalized diet plan, ai meal planner, vegetarian diet plan, weight loss diet plan',
  },
  '/shorts': {
    title: 'Fitness Shorts | Exercise Technique Videos | TailorDiet',
    description:
      'Watch short fitness videos for exercise technique, form, and workout inspiration across popular gym movements.',
    keywords: 'fitness shorts, exercise videos, workout shorts, technique videos',
  },
  '/signup': {
    title: 'Sign Up | TailorDiet',
    description: 'Create your TailorDiet account to save plans and access personalized health tools.',
    robots: 'noindex, nofollow',
  },
  '/login': {
    title: 'Log In | TailorDiet',
    description: 'Log in to your TailorDiet account.',
    robots: 'noindex, nofollow',
  },
  '/account': {
    title: 'Account | TailorDiet',
    description: 'Manage your TailorDiet account and saved information.',
    robots: 'noindex, nofollow',
  },
  '/meal-scanner': {
    title: 'Meal Scanner | TailorDiet',
    description: 'Analyze meals inside your TailorDiet account.',
    robots: 'noindex, nofollow',
  },
  '/chat': {
    title: 'Nutrition Chat Assistant | TailorDiet',
    description: 'Chat with the TailorDiet assistant for nutrition and fitness guidance.',
    robots: 'noindex, nofollow',
  },
}

export function getSeoData(pathname, siteOrigin) {
  const config = seoConfig[pathname] || {}
  const title = config.title || DEFAULT_TITLE
  const description = config.description || DEFAULT_DESCRIPTION
  const canonicalUrl = new URL(pathname || '/', siteOrigin).toString()

  const structuredData =
    typeof config.structuredData === 'function'
      ? config.structuredData({ canonicalUrl, title, description })
      : config.structuredData || [buildWebPageSchema({ title, description, canonicalUrl })]

  return {
    siteName: DEFAULT_SITE_NAME,
    title,
    description,
    canonicalUrl,
    image: new URL(DEFAULT_IMAGE, siteOrigin).toString(),
    keywords: config.keywords || '',
    robots: config.robots || 'index, follow',
    structuredData,
  }
}
