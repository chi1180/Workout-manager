// Onboarding questions data
export const ONBOARDING_QUESTIONS = [
  {
    id: "q1",
    question: "First, tell us about your current exercise habits!",
    options: [
      {
        value: "none",
        label: "I barely exercise... but I want to start!",
        emoji: "🌱",
      },
      {
        value: "light",
        label: "I exercise 1-2 times a week, just a little",
        emoji: "🙂",
      },
      {
        value: "regular",
        label: "I exercise 3+ times a week consistently!",
        emoji: "💪",
      },
    ],
  },
  {
    id: "q2",
    question: "What's your main training goal?",
    options: [
      {
        value: "health",
        label: "General health and fitness improvement",
        emoji: "🌿",
      },
      {
        value: "weight",
        label: "Weight loss and body toning",
        emoji: "🔥",
      },
      {
        value: "muscle",
        label: "Muscle building and strength gain",
        emoji: "🏋️",
      },
      {
        value: "other",
        label: "I have other goals",
        emoji: "✨",
      },
    ],
  },
  {
    id: "q3",
    question: "How much time can you dedicate to training each day?",
    options: [
      {
        value: "5-10",
        label: "5-10 minutes works for me!",
        emoji: "⏱️",
      },
      {
        value: "10-20",
        label: "10-20 minutes is doable!",
        emoji: "🙂",
      },
      {
        value: "20-30",
        label: "I can do 20-30 minutes!",
        emoji: "💪",
      },
      {
        value: "30plus",
        label: "30+ minutes, let's go!",
        emoji: "🔥",
      },
    ],
  },
  {
    id: "q4",
    question: "What equipment do you have access to?",
    options: [
      {
        value: "none",
        label: "No equipment (bodyweight exercises only)",
        emoji: "🙌",
      },
      {
        value: "dumbbell",
        label: "I have dumbbells or basic equipment",
        emoji: "🏋️",
      },
      {
        value: "gym",
        label: "I have gym access!",
        emoji: "🏟️",
      },
    ],
  },
  {
    id: "q5",
    question: "Any injuries or movements to avoid?",
    options: [
      {
        value: "none",
        label: "No limitations, anything goes!",
        emoji: "👍",
      },
      {
        value: "low-impact",
        label: "Avoid high-impact movements like jumping",
        emoji: "🦵",
      },
      {
        value: "upper-limit",
        label: "Need to limit upper body exercises",
        emoji: "🤲",
      },
      {
        value: "lower-limit",
        label: "Need to limit lower body exercises",
        emoji: "🦶",
      },
    ],
  },
  {
    id: "q6",
    question: "What time of day do you prefer to exercise?",
    options: [
      {
        value: "morning",
        label: "Morning - start the day fresh!",
        emoji: "🌅",
      },
      {
        value: "day",
        label: "Afternoon - easiest for me",
        emoji: "🌤️",
      },
      {
        value: "night",
        label: "Evening - consistent routine",
        emoji: "🌙",
      },
    ],
  },
];

// Generate dummy training plan based on user profile
export const generateDummyTrainingPlan = (userProfile) => {
  const { q1, q2, q3, q4, q5 } = userProfile;

  // Determine exercise difficulty and type based on fitness level
  const isBeginnerOrLight = q1 === "none" || q1 === "light";
  const hasEquipment = q4 === "dumbbell" || q4 === "gym";
  const needsLowImpact = q5 === "low-impact";

  // Base exercises for different profiles
  const exercises = [];

  // Warm-up (always included)
  exercises.push({
    id: "warmup",
    name: "Warm-up",
    duration: "3 min",
    description: "Light stretching and dynamic joint preparation",
    category: "warmup",
  });

  // Core exercises based on profile
  if (q2 === "health" || isBeginnerOrLight) {
    // Health/Beginner friendly exercises
    if (!needsLowImpact) {
      exercises.push({
        id: "ex1",
        name: "Squats",
        duration: "10 reps × 3 sets",
        description: "Basic lower body training. Keep knees behind toes",
        category: "lower",
      });
    } else {
      exercises.push({
        id: "ex1",
        name: "Wall Sit",
        duration: "30 sec × 3 sets",
        description: "Hold sitting position against wall. Low knee impact",
        category: "lower",
      });
    }

    exercises.push({
      id: "ex2",
      name: "Plank",
      duration: "20 sec × 3 sets",
      description: "Core strengthening fundamental exercise",
      category: "core",
    });

    exercises.push({
      id: "ex3",
      name: "Push-ups (knee variation OK)",
      duration: "8 reps × 3 sets",
      description: "Upper body foundation strength training",
      category: "upper",
    });
  } else if (q2 === "weight") {
    // Weight loss focused
    if (!needsLowImpact) {
      exercises.push({
        id: "ex1",
        name: "Burpees",
        duration: "10 reps × 3 sets",
        description: "Full-body cardio exercise. High fat-burning effect",
        category: "cardio",
      });
    } else {
      exercises.push({
        id: "ex1",
        name: "Mountain Climbers",
        duration: "20 sec × 3 sets",
        description: "Cardio and core strengthening combined",
        category: "cardio",
      });
    }

    exercises.push({
      id: "ex2",
      name: "Jumping Jacks",
      duration: "30 sec × 3 sets",
      description: "Raise heart rate for fat burning",
      category: "cardio",
    });

    exercises.push({
      id: "ex3",
      name: "Plank",
      duration: "30 sec × 3 sets",
      description: "Strengthen core for increased metabolism",
      category: "core",
    });

    exercises.push({
      id: "ex4",
      name: "Squat Jumps",
      duration: "10 reps × 3 sets",
      description: "Strengthen lower body and cardio simultaneously",
      category: "cardio",
    });
  } else if (q2 === "muscle") {
    // Muscle building focused
    if (hasEquipment) {
      exercises.push({
        id: "ex1",
        name: "Dumbbell Squats",
        duration: "12 reps × 4 sets",
        description: "Squats with dumbbells. Increase load for muscle growth",
        category: "lower",
      });

      exercises.push({
        id: "ex2",
        name: "Dumbbell Bench Press",
        duration: "10 reps × 4 sets",
        description: "Target chest muscles intensively",
        category: "upper",
      });

      exercises.push({
        id: "ex3",
        name: "Dumbbell Rows",
        duration: "12 reps × 4 sets",
        description: "Strengthen back muscles",
        category: "upper",
      });
    } else {
      exercises.push({
        id: "ex1",
        name: "Push-ups",
        duration: "15 reps × 4 sets",
        description: "Train chest, shoulders, and arms - fundamental exercise",
        category: "upper",
      });

      exercises.push({
        id: "ex2",
        name: "Bulgarian Split Squats",
        duration: "12 reps × 3 sets (each leg)",
        description: "High-load single-leg squats",
        category: "lower",
      });

      exercises.push({
        id: "ex3",
        name: "Pike Push-ups",
        duration: "10 reps × 3 sets",
        description: "Focus on shoulder development",
        category: "upper",
      });
    }

    exercises.push({
      id: "ex4",
      name: "Plank",
      duration: "45 sec × 3 sets",
      description: "Improve core stability",
      category: "core",
    });
  }

  // Cool down (always included)
  exercises.push({
    id: "cooldown",
    name: "Cool Down",
    duration: "3 min",
    description: "Stretch muscles and promote recovery",
    category: "cooldown",
  });

  return {
    id: "plan-" + Date.now(),
    name: generatePlanName(q2),
    description: generatePlanDescription(q2, q3),
    exercises,
    createdAt: new Date().toISOString(),
    userProfile,
  };
};

const generatePlanName = (goal) => {
  const names = {
    health: "Health & Fitness Foundation Plan",
    weight: "Fat Burning Exercise Program",
    muscle: "Strength Building Training",
    other: "Custom Training Plan",
  };
  return names[goal] || "Personalized Plan";
};

const generatePlanDescription = (goal, time) => {
  const timeMap = {
    "5-10": "Quick",
    "10-20": "Efficient",
    "20-30": "Thorough",
    "30plus": "Comprehensive",
  };

  const timeText = timeMap[time] || "";

  const goalMap = {
    health:
      "program aimed at healthy body building and basic fitness improvement",
    weight: "program aimed at fat burning and body toning",
    muscle: "program aimed at strength building and muscle growth",
    other: "program to support your goal achievement",
  };

  return `${timeText} ${goalMap[goal] || ""}. Consistent practice yields steady results!`;
};
