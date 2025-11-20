import { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  Download,
  Upload,
  Trash2,
  User,
  Moon,
  Sun,
  RefreshCw,
  Check,
  Info,
} from "lucide-react";
import { storage, activityDB } from "../utils/storage";
import { router } from "../utils/router";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const loadSettings = () => {
    const profile = storage.getUserProfile();
    setUserProfile(profile);

    const isDark = storage.getDarkMode();
    setDarkMode(isDark);
  };

  const handleToggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    storage.setDarkMode(newMode);
  };

  const handleExportData = async () => {
    try {
      const localData = storage.exportData();
      const activities = await activityDB.exportData();

      const exportData = {
        version: "1.0",
        exportDate: new Date().toISOString(),
        localStorage: localData,
        activities: activities,
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `workout-manager-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showSuccessMessage("データをエクスポートしました");
    } catch (error) {
      console.error("Export error:", error);
      alert("エクスポートに失敗しました");
    }
  };

  const handleImportData = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.version || !data.localStorage || !data.activities) {
        throw new Error("Invalid data format");
      }

      storage.importData(data.localStorage);
      await activityDB.importData(data.activities);

      showSuccessMessage("データをインポートしました");

      setTimeout(() => {
        loadSettings();
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Import error:", error);
      alert("インポートに失敗しました。ファイル形式を確認してください。");
    }

    event.target.value = "";
  };

  const handleResetProfile = () => {
    storage.setOnboardingComplete(false);
    router.navigate("/onboarding");
  };

  const handleResetAllData = async () => {
    try {
      storage.clearAll();
      await activityDB.clearAll();

      showSuccessMessage("すべてのデータをリセットしました");

      setTimeout(() => {
        router.navigate("/onboarding");
      }, 1500);
    } catch (error) {
      console.error("Reset error:", error);
      alert("リセットに失敗しました");
    }

    setShowResetConfirm(false);
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getAnswerLabel = (questionId, value) => {
    const labels = {
      q1: {
        none: "初心者",
        light: "軽く運動",
        regular: "定期的に運動",
      },
      q2: {
        health: "健康づくり",
        weight: "ダイエット",
        muscle: "筋力アップ",
        other: "その他",
      },
      q3: {
        "5-10": "5〜10分",
        "10-20": "10〜20分",
        "20-30": "20〜30分",
        "30plus": "30分以上",
      },
      q4: {
        none: "器具なし",
        dumbbell: "ダンベル等",
        gym: "ジム",
      },
      q5: {
        none: "制限なし",
        "low-impact": "低衝撃",
        "upper-limit": "上半身制限",
        "lower-limit": "下半身制限",
      },
      q6: {
        morning: "朝",
        day: "昼〜夕方",
        night: "夜",
      },
    };

    return labels[questionId]?.[value] || value;
  };

  return (
    <div className="min-h-screen bg-notion-bg-secondary dark:bg-notion-bg-dark">
      {/* Header */}
      <div className="bg-notion-bg dark:bg-notion-bg-secondary-dark border-b border-notion-border dark:border-notion-border-dark">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-semibold text-notion-text dark:text-notion-text-dark mb-1 flex items-center gap-2">
            <SettingsIcon className="w-6 h-6" />
            設定
          </h1>
          <p className="text-notion-text-secondary dark:text-notion-text-secondary-dark text-sm">
            アプリの設定とデータ管理
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* User Profile */}
        {userProfile && (
          <div className="notion-card-flat">
            <h2 className="text-sm font-semibold text-notion-text dark:text-notion-text-dark mb-4 flex items-center gap-2">
              <User className="w-4 h-4" />
              プロファイル
            </h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center p-3 bg-notion-bg-secondary dark:bg-notion-hover-dark rounded-lg">
                <span className="text-sm text-notion-text-secondary dark:text-notion-text-secondary-dark">
                  運動習慣
                </span>
                <span className="text-sm font-medium text-notion-text dark:text-notion-text-dark">
                  {getAnswerLabel("q1", userProfile.q1)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-notion-bg-secondary dark:bg-notion-hover-dark rounded-lg">
                <span className="text-sm text-notion-text-secondary dark:text-notion-text-secondary-dark">
                  目的
                </span>
                <span className="text-sm font-medium text-notion-text dark:text-notion-text-dark">
                  {getAnswerLabel("q2", userProfile.q2)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-notion-bg-secondary dark:bg-notion-hover-dark rounded-lg">
                <span className="text-sm text-notion-text-secondary dark:text-notion-text-secondary-dark">
                  トレーニング時間
                </span>
                <span className="text-sm font-medium text-notion-text dark:text-notion-text-dark">
                  {getAnswerLabel("q3", userProfile.q3)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-notion-bg-secondary dark:bg-notion-hover-dark rounded-lg">
                <span className="text-sm text-notion-text-secondary dark:text-notion-text-secondary-dark">
                  器具
                </span>
                <span className="text-sm font-medium text-notion-text dark:text-notion-text-dark">
                  {getAnswerLabel("q4", userProfile.q4)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-notion-bg-secondary dark:bg-notion-hover-dark rounded-lg">
                <span className="text-sm text-notion-text-secondary dark:text-notion-text-secondary-dark">
                  制限
                </span>
                <span className="text-sm font-medium text-notion-text dark:text-notion-text-dark">
                  {getAnswerLabel("q5", userProfile.q5)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-notion-bg-secondary dark:bg-notion-hover-dark rounded-lg">
                <span className="text-sm text-notion-text-secondary dark:text-notion-text-secondary-dark">
                  好みの時間帯
                </span>
                <span className="text-sm font-medium text-notion-text dark:text-notion-text-dark">
                  {getAnswerLabel("q6", userProfile.q6)}
                </span>
              </div>
            </div>

            <button
              onClick={handleResetProfile}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              プロファイルを再設定
            </button>
          </div>
        )}

        {/* Appearance */}
        <div className="notion-card-flat">
          <h2 className="text-sm font-semibold text-notion-text dark:text-notion-text-dark mb-4">
            外観
          </h2>

          <button
            onClick={handleToggleDarkMode}
            className="w-full flex items-center justify-between p-3 bg-notion-bg-secondary dark:bg-notion-hover-dark rounded-lg notion-hover"
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-notion-bg dark:bg-notion-bg-secondary-dark rounded-md flex items-center justify-center">
                {darkMode ? (
                  <Moon className="w-4 h-4 text-notion-text dark:text-notion-text-dark" />
                ) : (
                  <Sun className="w-4 h-4 text-notion-text dark:text-notion-text-dark" />
                )}
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-notion-text dark:text-notion-text-dark">
                  ダークモード
                </div>
                <div className="text-xs text-notion-text-secondary dark:text-notion-text-secondary-dark">
                  {darkMode ? "オン" : "オフ"}
                </div>
              </div>
            </div>
            <div
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                darkMode
                  ? "bg-notion-blue"
                  : "bg-notion-border dark:bg-notion-border-dark"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </div>
          </button>
        </div>

        {/* Data Management */}
        <div className="notion-card-flat">
          <h2 className="text-sm font-semibold text-notion-text dark:text-notion-text-dark mb-4">
            データ管理
          </h2>

          <div className="space-y-2">
            <button
              onClick={handleExportData}
              className="w-full flex items-center justify-between p-3 bg-notion-bg-secondary dark:bg-notion-hover-dark rounded-lg notion-hover"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-notion-blue-bg dark:bg-notion-blue-bg-dark rounded-md flex items-center justify-center">
                  <Download className="w-4 h-4 text-notion-blue" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-notion-text dark:text-notion-text-dark">
                    データをエクスポート
                  </div>
                  <div className="text-xs text-notion-text-secondary dark:text-notion-text-secondary-dark">
                    バックアップファイルをダウンロード
                  </div>
                </div>
              </div>
            </button>

            <label className="w-full flex items-center justify-between p-3 bg-notion-bg-secondary dark:bg-notion-hover-dark rounded-lg notion-hover cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-notion-green-bg dark:bg-notion-green-bg-dark rounded-md flex items-center justify-center">
                  <Upload className="w-4 h-4 text-notion-green" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-notion-text dark:text-notion-text-dark">
                    データをインポート
                  </div>
                  <div className="text-xs text-notion-text-secondary dark:text-notion-text-secondary-dark">
                    バックアップファイルから復元
                  </div>
                </div>
              </div>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center justify-between p-3 bg-notion-red-bg dark:bg-notion-red-bg-dark rounded-lg hover:bg-notion-red-bg/80 dark:hover:bg-notion-red-bg-dark/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-notion-red/10 rounded-md flex items-center justify-center">
                  <Trash2 className="w-4 h-4 text-notion-red" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-notion-red">
                    すべてのデータをリセット
                  </div>
                  <div className="text-xs text-notion-red/70">
                    全ての設定と履歴を削除
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="notion-card-flat">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-shrink-0 w-10 h-10 bg-notion-purple-bg dark:bg-notion-purple-bg-dark rounded-lg flex items-center justify-center">
              <Info className="w-5 h-5 text-notion-purple" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-notion-text dark:text-notion-text-dark">
                ワークアウトマネージャー
              </h2>
              <p className="text-xs text-notion-text-secondary dark:text-notion-text-secondary-dark">
                Version 1.0.0
              </p>
            </div>
          </div>
          <p className="text-xs text-notion-text-secondary dark:text-notion-text-secondary-dark">
            健康的な運動習慣を継続するためのアプリケーション
          </p>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-fade-in">
          <div className="notion-card max-w-md w-full animate-scale-in">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-notion-red-bg dark:bg-notion-red-bg-dark rounded-xl mb-4">
                <Trash2 className="w-6 h-6 text-notion-red" />
              </div>
              <h3 className="text-xl font-semibold text-notion-text dark:text-notion-text-dark mb-2">
                本当にリセットしますか？
              </h3>
              <p className="text-sm text-notion-text-secondary dark:text-notion-text-secondary-dark">
                この操作は取り消せません。すべてのプロファイル、トレーニング履歴、設定が削除されます。
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="btn-secondary flex-1"
              >
                キャンセル
              </button>
              <button
                onClick={handleResetAllData}
                className="flex-1 bg-notion-red hover:bg-notion-red/90 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-scale-in">
          <div className="notion-card px-4 py-3 flex items-center gap-2 shadow-notion-hover">
            <div className="flex-shrink-0 w-5 h-5 bg-notion-green rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
            <span className="text-sm font-medium text-notion-text dark:text-notion-text-dark">
              {successMessage}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
