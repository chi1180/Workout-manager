import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Sparkles, Check } from "lucide-react";
import {
  ONBOARDING_QUESTIONS,
  generateDummyTrainingPlan,
} from "../utils/questions";
import { storage } from "../utils/storage";
import { router } from "../utils/router";

export default function Onboarding() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState("forward");
  const [isGenerating, setIsGenerating] = useState(false);

  const totalQuestions = ONBOARDING_QUESTIONS.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleSelectOption = (value) => {
    const questionId = ONBOARDING_QUESTIONS[currentQuestion].id;
    setAnswers({
      ...answers,
      [questionId]: value,
    });
  };

  const handleNext = () => {
    const questionId = ONBOARDING_QUESTIONS[currentQuestion].id;

    // Check if current question is answered
    if (!answers[questionId]) {
      return;
    }

    if (currentQuestion < totalQuestions - 1) {
      setDirection("forward");
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setIsAnimating(false);
      }, 200);
    } else {
      // Complete onboarding
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setDirection("backward");
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion - 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  const handleComplete = async () => {
    setIsGenerating(true);

    // Save user profile
    const userProfile = {
      ...answers,
      createdAt: new Date().toISOString(),
    };
    storage.setUserProfile(userProfile);

    // Generate training plan
    const trainingPlan = generateDummyTrainingPlan(answers);
    storage.setTrainingPlan(trainingPlan);

    // Mark onboarding as complete
    storage.setOnboardingComplete(true);

    // Simulate AI generation delay
    setTimeout(() => {
      setIsGenerating(false);
      router.navigate("/dashboard");
    }, 2000);
  };

  const question = ONBOARDING_QUESTIONS[currentQuestion];
  const selectedValue = answers[question.id];
  const canProceed = !!selectedValue;

  return (
    <div className="min-h-screen bg-notion-bg-secondary dark:bg-notion-bg-dark flex flex-col">
      {/* Header */}
      <div className="border-b border-notion-border dark:border-notion-border-dark bg-notion-bg dark:bg-notion-bg-secondary-dark">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold text-notion-text dark:text-notion-text-dark">
              セットアップ
            </h1>
            <div className="text-sm text-notion-text-secondary dark:text-notion-text-secondary-dark font-medium">
              {currentQuestion + 1} / {totalQuestions}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-notion-border dark:bg-notion-border-dark rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-notion-blue h-1.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
        <div className="max-w-2xl w-full">
          <div
            className={`transition-all duration-200 ${
              isAnimating
                ? direction === "forward"
                  ? "opacity-0 translate-y-4"
                  : "opacity-0 -translate-y-4"
                : "opacity-100 translate-y-0"
            }`}
          >
            {/* Question */}
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold text-notion-text dark:text-notion-text-dark mb-3">
                {question.question}
              </h2>
              <p className="text-notion-text-secondary dark:text-notion-text-secondary-dark">
                あなたに最適なトレーニングプランを作成するために教えてください
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option) => {
                const isSelected = selectedValue === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelectOption(option.value)}
                    className={`w-full option-card text-left ${
                      isSelected ? "option-card-selected" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl flex-shrink-0">
                        {option.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-notion-text dark:text-notion-text-dark">
                          {option.label}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="flex-shrink-0 w-5 h-5 bg-notion-blue rounded-full flex items-center justify-center">
                          <Check
                            className="w-3 h-3 text-white"
                            strokeWidth={3}
                          />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-notion-border dark:border-notion-border-dark bg-notion-bg dark:bg-notion-bg-secondary-dark">
        <div className="max-w-3xl mx-auto px-6 py-4 flex gap-3">
          {currentQuestion > 0 ? (
            <button
              onClick={handleBack}
              className="btn-secondary flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              戻る
            </button>
          ) : (
            <div className="flex-shrink-0 w-20" />
          )}

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {currentQuestion === totalQuestions - 1 ? (
              <>
                完了
                <Sparkles className="w-4 h-4" />
              </>
            ) : (
              <>
                次へ
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generating Modal */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-fade-in">
          <div className="notion-card max-w-md w-full text-center animate-scale-in">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-notion-blue-bg dark:bg-notion-blue-bg-dark rounded-2xl mb-4">
                <Sparkles className="w-8 h-8 text-notion-blue animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold text-notion-text dark:text-notion-text-dark mb-2">
                プランを作成中...
              </h3>
              <p className="text-notion-text-secondary dark:text-notion-text-secondary-dark text-sm">
                あなたの回答を分析して、最適なトレーニングプランを生成しています
              </p>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <div
                className="w-2 h-2 bg-notion-blue rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-2 h-2 bg-notion-blue rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-2 h-2 bg-notion-blue rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
