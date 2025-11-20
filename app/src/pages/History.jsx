import { useState, useEffect } from "react";
import {
  Calendar,
  TrendingUp,
  Trophy,
  Flame,
  Award,
  ChevronDown,
} from "lucide-react";
import { activityDB, dateUtils } from "../utils/storage";

export default function History() {
  const [activities, setActivities] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [stats, setStats] = useState({
    totalDays: 0,
    currentStreak: 0,
    longestStreak: 0,
    completionRate: 0,
    thisMonthDays: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);

    const allActivities = await activityDB.getAllActivities();
    setActivities(allActivities);

    const heatmap = generateHeatmapData(allActivities);
    setHeatmapData(heatmap);

    const statistics = calculateStats(allActivities);
    setStats(statistics);

    setIsLoading(false);
  };

  const generateHeatmapData = (activities) => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);

    const activityMap = new Map(
      activities.map((a) => [a.date, a.allCompleted]),
    );

    const heatmap = [];
    let currentWeek = [];
    let currentDate = new Date(startDate);

    const dayOfWeek = currentDate.getDay();
    currentDate.setDate(currentDate.getDate() - dayOfWeek);

    for (let i = 0; i < 371; i++) {
      const dateStr = dateUtils.formatDate(currentDate);
      const isCompleted = activityMap.get(dateStr) || false;
      const isToday = dateStr === dateUtils.getTodayString();
      const isFuture = currentDate > today;

      currentWeek.push({
        date: dateStr,
        completed: isCompleted,
        isToday,
        isFuture,
      });

      if (currentWeek.length === 7) {
        heatmap.push([...currentWeek]);
        currentWeek = [];
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return heatmap;
  };

  const calculateStats = (activities) => {
    const completedActivities = activities.filter((a) => a.allCompleted);
    const sortedActivities = [...completedActivities].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );

    const totalDays = completedActivities.length;

    let currentStreak = 0;
    let checkDate = new Date();
    for (let i = 0; i < 365; i++) {
      const dateStr = dateUtils.formatDate(checkDate);
      const activity = sortedActivities.find((a) => a.date === dateStr);

      if (activity && activity.allCompleted) {
        currentStreak++;
      } else if (dateStr !== dateUtils.getTodayString()) {
        break;
      }

      checkDate.setDate(checkDate.getDate() - 1);
    }

    let longestStreak = 0;
    let tempStreak = 0;
    const allDates = dateUtils.getLast365Days();
    const completedDates = new Set(completedActivities.map((a) => a.date));

    for (const date of allDates) {
      if (completedDates.has(date)) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const thisMonthDays = completedActivities.filter((a) => {
      const date = new Date(a.date);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    }).length;

    const last30Days = allDates.slice(-30);
    const completed30Days = last30Days.filter((date) =>
      completedDates.has(date),
    ).length;
    const completionRate = Math.round((completed30Days / 30) * 100);

    return {
      totalDays,
      currentStreak,
      longestStreak,
      completionRate,
      thisMonthDays,
    };
  };

  const getMonthlyActivities = () => {
    return activities
      .filter((a) => {
        const date = new Date(a.date);
        return (
          date.getMonth() === selectedMonth &&
          date.getFullYear() === selectedYear &&
          a.allCompleted
        );
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const getIntensityClass = (completed) => {
    if (completed) {
      return "bg-notion-green hover:bg-notion-green/80";
    }
    return "bg-notion-border dark:bg-notion-border-dark hover:bg-notion-hover dark:hover:bg-notion-hover-dark";
  };

  const monthlyActivities = getMonthlyActivities();

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

  return (
    <div className="min-h-screen bg-notion-bg-secondary dark:bg-notion-bg-dark">
      {/* Header */}
      <div className="bg-notion-bg dark:bg-notion-bg-secondary-dark border-b border-notion-border dark:border-notion-border-dark">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-semibold text-notion-text dark:text-notion-text-dark mb-1">
            History
          </h1>
          <p className="text-notion-text-secondary dark:text-notion-text-secondary-dark text-sm">
            Review your progress and achievements
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="notion-card-flat text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-notion-blue-bg dark:bg-notion-blue-bg-dark rounded-lg mb-2">
              <Calendar className="w-5 h-5 text-notion-blue" />
            </div>
            <div className="text-2xl font-semibold text-notion-text dark:text-notion-text-dark mb-1">
              {stats.totalDays}
            </div>
            <div className="text-xs text-notion-text-secondary dark:text-notion-text-secondary-dark">
              Total Training Days
            </div>
          </div>

          <div className="notion-card-flat text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-notion-yellow-bg dark:bg-notion-yellow-bg-dark rounded-lg mb-2">
              <Flame className="w-5 h-5 text-notion-yellow" />
            </div>
            <div className="text-2xl font-semibold text-notion-text dark:text-notion-text-dark mb-1">
              {stats.currentStreak}
            </div>
            <div className="text-xs text-notion-text-secondary dark:text-notion-text-secondary-dark">
              Current Streak
            </div>
          </div>

          <div className="notion-card-flat text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-notion-purple-bg dark:bg-notion-purple-bg-dark rounded-lg mb-2">
              <Trophy className="w-5 h-5 text-notion-purple" />
            </div>
            <div className="text-2xl font-semibold text-notion-text dark:text-notion-text-dark mb-1">
              {stats.longestStreak}
            </div>
            <div className="text-xs text-notion-text-secondary dark:text-notion-text-secondary-dark">
              Longest Streak
            </div>
          </div>

          <div className="notion-card-flat text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-notion-green-bg dark:bg-notion-green-bg-dark rounded-lg mb-2">
              <TrendingUp className="w-5 h-5 text-notion-green" />
            </div>
            <div className="text-2xl font-semibold text-notion-text dark:text-notion-text-dark mb-1">
              {stats.completionRate}%
            </div>
            <div className="text-xs text-notion-text-secondary dark:text-notion-text-secondary-dark">
              Completion Rate (30 days)
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <div className="notion-card-flat">
          <h2 className="text-sm font-semibold text-notion-text dark:text-notion-text-dark mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Annual Activity
          </h2>

          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Month labels */}
              <div className="flex gap-0.5 mb-2 ml-6">
                {Array.from({ length: 53 }, (_, weekIdx) => {
                  const weekDate = new Date();
                  weekDate.setDate(weekDate.getDate() - 364 + weekIdx * 7);
                  const isFirstWeekOfMonth = weekDate.getDate() <= 7;
                  const monthName = weekDate.toLocaleDateString("en-US", {
                    month: "short",
                  });
                  return isFirstWeekOfMonth ? (
                    <div
                      key={weekIdx}
                      className="text-xs text-notion-text-secondary dark:text-notion-text-secondary-dark"
                      style={{ width: "12px" }}
                    >
                      {monthName}
                    </div>
                  ) : (
                    <div key={weekIdx} style={{ width: "12px" }} />
                  );
                })}
              </div>

              {/* Day labels and heatmap */}
              <div className="flex gap-0.5">
                {/* Day of week labels */}
                <div className="flex flex-col gap-0.5 text-xs text-notion-text-secondary dark:text-notion-text-secondary-dark justify-around pr-1">
                  <div className="h-3">Mon</div>
                  <div className="h-3"></div>
                  <div className="h-3">Wed</div>
                  <div className="h-3"></div>
                  <div className="h-3">Fri</div>
                  <div className="h-3"></div>
                  <div className="h-3"></div>
                </div>

                {/* Heatmap grid */}
                <div className="flex gap-0.5">
                  {heatmapData.map((week, weekIdx) => (
                    <div key={weekIdx} className="flex flex-col gap-0.5">
                      {week.map((day, dayIdx) => (
                        <div
                          key={`${weekIdx}-${dayIdx}`}
                          className={`w-3 h-3 rounded-sm transition-all cursor-pointer ${
                            day.isFuture
                              ? "bg-transparent"
                              : day.isToday
                                ? "ring-2 ring-notion-blue ring-offset-1 " +
                                  getIntensityClass(day.completed)
                                : getIntensityClass(day.completed)
                          }`}
                          title={`${day.date}: ${day.completed ? "Completed" : "Not completed"}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-2 mt-4 text-xs text-notion-text-secondary dark:text-notion-text-secondary-dark">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-notion-border dark:bg-notion-border-dark rounded-sm" />
                  <div className="w-3 h-3 bg-notion-green/30 rounded-sm" />
                  <div className="w-3 h-3 bg-notion-green/60 rounded-sm" />
                  <div className="w-3 h-3 bg-notion-green rounded-sm" />
                </div>
                <span>More</span>
              </div>
</system_warning>
            </div>
          </div>
        </div>

        {/* Monthly Detail */}
        <div className="notion-card-flat">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-notion-text dark:text-notion-text-dark flex items-center gap-2">
              <Award className="w-4 h-4" />
              Monthly Details
            </h2>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="appearance-none pl-3 pr-8 py-1.5 text-sm border border-notion-border dark:border-notion-border-dark rounded-md bg-notion-bg dark:bg-notion-bg-secondary-dark text-notion-text dark:text-notion-text-dark focus:outline-none focus:ring-2 focus:ring-notion-blue/20 cursor-pointer"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>
                      {new Date(2000, i, 1).toLocaleDateString("en-US", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-notion-text-secondary dark:text-notion-text-secondary-dark pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="appearance-none pl-3 pr-8 py-1.5 text-sm border border-notion-border dark:border-notion-border-dark rounded-md bg-notion-bg dark:bg-notion-bg-secondary-dark text-notion-text dark:text-notion-text-dark focus:outline-none focus:ring-2 focus:ring-notion-blue/20 cursor-pointer"
                >
                  {Array.from({ length: 3 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-notion-text-secondary dark:text-notion-text-secondary-dark pointer-events-none" />
              </div>
            </div>
          </div>

          {monthlyActivities.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-notion-bg-secondary dark:bg-notion-hover-dark rounded-lg mb-3">
                <Calendar className="w-6 h-6 text-notion-text-secondary dark:text-notion-text-secondary-dark" />
              </div>
              <p className="text-notion-text-secondary dark:text-notion-text-secondary-dark text-sm">
                No training records for this month
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-4 p-4 bg-notion-green-bg dark:bg-notion-green-bg-dark rounded-lg">
                <div className="text-2xl font-semibold text-notion-green mb-0.5">
                  {monthlyActivities.length} days
                </div>
                <div className="text-sm text-notion-green/80">
                  Training completed!
                </div>
              </div>

              <div className="space-y-2">
                {monthlyActivities.map((activity) => {
                  const date = new Date(activity.date);
                  const completedCount =
                    activity.completedExercises?.length || 0;
                  const totalCount = activity.exercises?.length || 0;

                  return (
                    <div
                      key={activity.date}
                      className="flex items-center gap-3 p-3 bg-notion-bg-secondary dark:bg-notion-hover-dark rounded-lg notion-hover"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-notion-green-bg dark:bg-notion-green-bg-dark rounded-lg flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-notion-green" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-notion-text dark:text-notion-text-dark text-sm">
                          {date.toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            weekday: "short",
                          })}
                        </div>
                        <div className="text-xs text-notion-text-secondary dark:text-notion-text-secondary-dark">
                          {completedCount} / {totalCount} exercises completed
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-xs font-medium text-notion-green px-2 py-1 bg-notion-green-bg dark:bg-notion-green-bg-dark rounded">
                        Completed
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
