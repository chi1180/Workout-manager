import { useState, useEffect } from "react";
import {
  Circle,
  CheckCircle2,
  Flame,
  Calendar,
  Sparkles,
  Trophy,
} from "lucide-react";
import { storage, activityDB, dateUtils } from "../utils/storage";
import { router } from "../utils/router";

export default function Dashboard() {
  const [trainingPlan, setTrainingPlan] = useState(null);
  const [todayActivity, setTodayActivity] = useState(null);
  const [completedExercises, setCompletedExercises] = useState(new Set());
  const [streak, setStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [weekProgress, setWeekProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const todayString = dateUtils.getTodayString();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);

    const plan = storage.getTrainingPlan();
    setTrainingPlan(plan);

    const activity = await activityDB.getActivity(todayString);
    if (activity) {
      setTodayActivity(activity);
      setCompletedExercises(new Set(activity.completedExercises || []));
    } else {
      const newActivity = {
        date: todayString,
        exercises: plan?.exercises || [],
        completedExercises: [],
        allCompleted: false,
      };
      await activityDB.saveActivity(newActivity);
      setTodayActivity(newActivity);
    }

    await calculateStreak();
    await loadWeekProgress();

    setIsLoading(false);
  };

  const calculateStreak = async () => {
    const allActivities = await activityDB.getAllActivities();
    const sortedActivities = allActivities
      .filter((a) => a.allCompleted)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    let currentStreak = 0;
    let checkDate = new Date();

    for (let i = 0; i < 365; i++) {
      const dateStr = dateUtils.formatDate(checkDate);
      const activity = sortedActivities.find((a) => a.date === dateStr);

      if (activity && activity.allCompleted) {
        currentStreak++;
      } else if (dateStr !== todayString) {
        break;
      }

      checkDate.setDate(checkDate.getDate() - 1);
    }

    setStreak(currentStreak);
  };

  const loadWeekProgress = async () => {
    const today = new Date();
    const weekDays = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = dateUtils.formatDate(date);
      const activity = await activityDB.getActivity(dateStr);

      weekDays.push({
        date: dateStr,
        dayName: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
          date.getDay()
        ],
        completed: activity?.allCompleted || false,
        isToday: dateStr === todayString,
      });
    }

    setWeekProgress(weekDays);
  };

  const handleToggleExercise = async (exerciseId) => {
    const newCompleted = new Set(completedExercises);

    if (newCompleted.has(exerciseId)) {
      newCompleted.delete(exerciseId);
    } else {
      newCompleted.add(exerciseId);
    }

    setCompletedExercises(newCompleted);

    const totalExercises = trainingPlan?.exercises?.length || 0;
    const allCompleted = newCompleted.size === totalExercises;

    const updatedActivity = {
      ...todayActivity,
      completedExercises: Array.from(newCompleted),
      allCompleted,
      lastUpdated: new Date().toISOString(),
    };

    await activityDB.saveActivity(updatedActivity);
    setTodayActivity(updatedActivity);

    if (allCompleted && !todayActivity?.allCompleted) {
      setShowCelebration(true);
      await calculateStreak();
      await loadWeekProgress();
      setTimeout(() => setShowCelebration(false), 5000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-notion-bg-secondary dark:bg-notion-bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-notion-blue border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-notion-text-secondary dark:text-notion-text-secondary-dark text-sm">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!trainingPlan) {
    return (
      <div className="min-h-screen bg-notion-bg-secondary dark:bg-notion-bg-dark flex items-center justify-center p-6">
        <div className="notion-card max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-notion-blue-bg dark:bg-notion-blue-bg-dark rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-notion-blue" />
          </div>
          <h2 className="text-xl font-semibold text-notion-text dark:text-notion-text-dark mb-2">
            No Training Plan
          </h2>
          <p className="text-notion-text-secondary dark:text-notion-text-secondary-dark text-sm mb-6">
            Please complete the setup first
          </p>
          <button
            onClick={() => router.navigate("/onboarding")}
            className="btn-primary"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  const totalExercises = trainingPlan.exercises.length;
  const completedCount = completedExercises.size;
  const progressPercent = (completedCount / totalExercises) * 100;
  const allCompleted = todayActivity?.allCompleted || false;

  return (
    <div className="min-h-screen bg-notion-bg-secondary dark:bg-notion-bg-dark">
      {/* Header */}
      <div className="bg-notion-bg dark:bg-notion-bg-secondary-dark border-b border-notion-border dark:border-notion-border-dark">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-notion-text dark:text-notion-text-dark mb-1">
                Today's Workout
              </h1>
              <p className="text-notion-text-secondary dark:text-notion-text-secondary-dark text-sm">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "long",
                })}
              </p>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-notion-yellow-bg dark:bg-notion-yellow-bg-dark rounded-lg">
                <Flame className="w-4 h-4 text-notion-yellow" />
                <span className="text-sm font-semibold text-notion-yellow">
                  {streak} day streak
                </span>
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="notion-card-flat">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-notion-text dark:text-notion-text-dark">
                Progress
              </span>
              <span className="text-sm text-notion-text-secondary dark:text-notion-text-secondary-dark">
                {completedCount} / {totalExercises}
              </span>
            </div>
            <div className="w-full bg-notion-border dark:bg-notion-border-dark rounded-full h-2 overflow-hidden">
              <div
                className="bg-notion-blue h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* Training Plan Info */}
        <div className="notion-card-flat">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-notion-purple-bg dark:bg-notion-purple-bg-dark rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-notion-purple" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-notion-text dark:text-notion-text-dark mb-1">
                {trainingPlan.name}
              </h2>
              <p className="text-sm text-notion-text-secondary dark:text-notion-text-secondary-dark">
                {trainingPlan.description}
              </p>
            </div>
          </div>
        </div>

        {/* All Completed Message */}
        {allCompleted && (
          <div className="notion-card-flat bg-notion-green-bg dark:bg-notion-green-bg-dark border-notion-green/30">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-notion-green/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-notion-green" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-notion-green mb-0.5">
                  Amazing! Today's Training Complete!
                </h3>
                <p className="text-sm text-notion-green/80">
                  Consistency is key. Keep it up tomorrow!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Exercises List */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-notion-text-secondary dark:text-notion-text-secondary-dark uppercase tracking-wide flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Today's Exercises
          </h3>

          <div className="space-y-2">
            {trainingPlan.exercises.map((exercise) => {
              const isCompleted = completedExercises.has(exercise.id);
              return (
                <button
                  key={exercise.id}
                  onClick={() => handleToggleExercise(exercise.id)}
                  className={`w-full exercise-card text-left ${
                    isCompleted ? "exercise-card-completed" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-notion-green" />
                      ) : (
                        <Circle className="w-5 h-5 text-notion-text-secondary dark:text-notion-text-secondary-dark" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h4
                          className={`font-medium ${
                            isCompleted
                              ? "line-through text-notion-text-secondary dark:text-notion-text-secondary-dark"
                              : "text-notion-text dark:text-notion-text-dark"
                          }`}
                        >
                          {exercise.name}
                        </h4>
                        <span
                          className={`flex-shrink-0 text-xs font-medium px-2 py-1 rounded ${
                            isCompleted
                              ? "bg-notion-green-bg dark:bg-notion-green-bg-dark text-notion-green"
                              : "bg-notion-blue-bg dark:bg-notion-blue-bg-dark text-notion-blue"
                          }`}
                        >
                          {exercise.duration}
                        </span>
                      </div>
                      <p
                        className={`text-sm ${
                          isCompleted
                            ? "text-notion-text-secondary/60 dark:text-notion-text-secondary-dark/60"
                            : "text-notion-text-secondary dark:text-notion-text-secondary-dark"
                        }`}
                      >
                        {exercise.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Week Progress */}
        <div className="notion-card-flat">
          <h3 className="text-sm font-semibold text-notion-text dark:text-notion-text-dark mb-4">
            Weekly Progress
          </h3>
          <div className="flex gap-2">
            {weekProgress.map((day) => (
              <div key={day.date} className="flex-1 text-center">
                <div className="text-xs text-notion-text-secondary dark:text-notion-text-secondary-dark mb-2">
                  {day.dayName}
                </div>
                <div
                  className={`w-full h-10 rounded-md transition-all ${
                    day.completed
                      ? "bg-notion-green"
                      : day.isToday
                        ? "bg-notion-blue-bg dark:bg-notion-blue-bg-dark border-2 border-notion-blue"
                        : "bg-notion-border dark:bg-notion-border-dark"
                  }`}
                >
                  {day.completed && (
                    <div className="flex items-center justify-center h-full">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-fade-in">
          <div className="notion-card max-w-md w-full text-center animate-scale-in">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-semibold text-notion-text dark:text-notion-text-dark mb-2">
              Congratulations!
            </h3>
            <p className="text-notion-text-secondary dark:text-notion-text-secondary-dark mb-4">
              You've completed today's training!
            </p>
            <div className="inline-flex items-center gap-2 bg-notion-yellow-bg dark:bg-notion-yellow-bg-dark px-6 py-3 rounded-lg">
              <Flame className="w-5 h-5 text-notion-yellow" />
              <span className="font-semibold text-notion-yellow">
                {streak} day streak
              </span>
            </div>
          </div>

          {/* Confetti Animation */}
          <div className="fixed inset-0 pointer-events-none z-40">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute text-2xl animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-20px`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              >
                {
                  ["🎉", "✨", "🌟", "⭐", "💪", "🔥"][
                    Math.floor(Math.random() * 6)
                  ]
                }
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
