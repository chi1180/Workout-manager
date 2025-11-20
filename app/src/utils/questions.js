// Onboarding questions data
export const ONBOARDING_QUESTIONS = [
  {
    id: "q1",
    question: "まずはあなたの今の運動習慣を教えてください！",
    options: [
      {
        value: "none",
        label: "ほぼ運動してない…これから始めたい！",
        emoji: "🌱",
      },
      {
        value: "light",
        label: "週に1〜2回、少しだけ動いてるよ",
        emoji: "🙂",
      },
      {
        value: "regular",
        label: "週3回以上の運動を続けている！",
        emoji: "💪",
      },
    ],
  },
  {
    id: "q2",
    question: "あなたのトレーニングの目的はどれが近い？",
    options: [
      {
        value: "health",
        label: "まずは健康づくり・体力アップしたい",
        emoji: "🌿",
      },
      {
        value: "weight",
        label: "ダイエット・体を引き締めたい",
        emoji: "🔥",
      },
      {
        value: "muscle",
        label: "筋力アップを目指したい！",
        emoji: "🏋️",
      },
      {
        value: "other",
        label: "その他の目的があるよ",
        emoji: "✨",
      },
    ],
  },
  {
    id: "q3",
    question: "1日に使えそうなトレーニング時間はどれくらい？",
    options: [
      {
        value: "5-10",
        label: "5〜10分くらいならいける！",
        emoji: "⏱️",
      },
      {
        value: "10-20",
        label: "10〜20分なら大丈夫！",
        emoji: "🙂",
      },
      {
        value: "20-30",
        label: "20〜30分しっかりできる！",
        emoji: "💪",
      },
      {
        value: "30plus",
        label: "30分以上やりたい！",
        emoji: "🔥",
      },
    ],
  },
  {
    id: "q4",
    question: "使える器具や環境を教えてね！",
    options: [
      {
        value: "none",
        label: "とくに器具なし（自重トレ中心）",
        emoji: "🙌",
      },
      {
        value: "dumbbell",
        label: "ダンベルなどの簡単な器具があるよ",
        emoji: "🏋️",
      },
      {
        value: "gym",
        label: "ジムに通えるよ！",
        emoji: "🏟️",
      },
    ],
  },
  {
    id: "q5",
    question: "ケガや痛みなど、避けたい動きはある？",
    options: [
      {
        value: "none",
        label: "特にないよ！何でもOK！",
        emoji: "👍",
      },
      {
        value: "low-impact",
        label: "ジャンプなど衝撃の強い動きは避けたい",
        emoji: "🦵",
      },
      {
        value: "upper-limit",
        label: "腕・肩まわりの負荷は抑えたい",
        emoji: "🤲",
      },
      {
        value: "lower-limit",
        label: "脚・膝まわりの負荷は抑えたい",
        emoji: "🦶",
      },
    ],
  },
  {
    id: "q6",
    question: "運動するならどの時間帯が好き？",
    options: [
      {
        value: "morning",
        label: "朝にスッキリ動きたい！",
        emoji: "🌅",
      },
      {
        value: "day",
        label: "昼〜夕方が一番やりやすい",
        emoji: "🌤️",
      },
      {
        value: "night",
        label: "夜にコツコツ続けたい",
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
    name: "ウォーミングアップ",
    duration: "3分",
    description: "軽いストレッチと関節の動的準備運動",
    category: "warmup",
  });

  // Core exercises based on profile
  if (q2 === "health" || isBeginnerOrLight) {
    // Health/Beginner friendly exercises
    if (!needsLowImpact) {
      exercises.push({
        id: "ex1",
        name: "スクワット",
        duration: "10回 × 3セット",
        description: "基本的な下半身トレーニング。膝がつま先より前に出ないように注意",
        category: "lower",
      });
    } else {
      exercises.push({
        id: "ex1",
        name: "ウォールシット",
        duration: "30秒 × 3セット",
        description: "壁に背中をつけて座る姿勢をキープ。膝への負担が少ない",
        category: "lower",
      });
    }

    exercises.push({
      id: "ex2",
      name: "プランク",
      duration: "20秒 × 3セット",
      description: "体幹を鍛える基本エクササイズ",
      category: "core",
    });

    exercises.push({
      id: "ex3",
      name: "プッシュアップ（膝つき可）",
      duration: "8回 × 3セット",
      description: "上半身の基礎筋力トレーニング",
      category: "upper",
    });
  } else if (q2 === "weight") {
    // Weight loss focused
    if (!needsLowImpact) {
      exercises.push({
        id: "ex1",
        name: "バーピー",
        duration: "10回 × 3セット",
        description: "全身を使った有酸素運動。脂肪燃焼効果が高い",
        category: "cardio",
      });
    } else {
      exercises.push({
        id: "ex1",
        name: "マウンテンクライマー",
        duration: "20秒 × 3セット",
        description: "有酸素運動とコア強化を同時に",
        category: "cardio",
      });
    }

    exercises.push({
      id: "ex2",
      name: "ジャンピングジャック",
      duration: "30秒 × 3セット",
      description: "心拍数を上げて脂肪燃焼",
      category: "cardio",
    });

    exercises.push({
      id: "ex3",
      name: "プランク",
      duration: "30秒 × 3セット",
      description: "コアを鍛えて代謝アップ",
      category: "core",
    });

    exercises.push({
      id: "ex4",
      name: "スクワットジャンプ",
      duration: "10回 × 3セット",
      description: "下半身と心肺機能を同時に強化",
      category: "cardio",
    });
  } else if (q2 === "muscle") {
    // Muscle building focused
    if (hasEquipment) {
      exercises.push({
        id: "ex1",
        name: "ダンベルスクワット",
        duration: "12回 × 4セット",
        description: "ダンベルを持ってスクワット。負荷を高めて筋肥大を促進",
        category: "lower",
      });

      exercises.push({
        id: "ex2",
        name: "ダンベルベンチプレス",
        duration: "10回 × 4セット",
        description: "胸筋を集中的に鍛える",
        category: "upper",
      });

      exercises.push({
        id: "ex3",
        name: "ダンベルロウ",
        duration: "12回 × 4セット",
        description: "背中の筋肉を強化",
        category: "upper",
      });
    } else {
      exercises.push({
        id: "ex1",
        name: "プッシュアップ",
        duration: "15回 × 4セット",
        description: "胸・肩・腕を鍛える基本種目",
        category: "upper",
      });

      exercises.push({
        id: "ex2",
        name: "ブルガリアンスクワット",
        duration: "12回 × 3セット（片足ずつ）",
        description: "片足で行う高負荷スクワット",
        category: "lower",
      });

      exercises.push({
        id: "ex3",
        name: "パイクプッシュアップ",
        duration: "10回 × 3セット",
        description: "肩を重点的に鍛える",
        category: "upper",
      });
    }

    exercises.push({
      id: "ex4",
      name: "プランク",
      duration: "45秒 × 3セット",
      description: "コアの安定性を高める",
      category: "core",
    });
  }

  // Cool down (always included)
  exercises.push({
    id: "cooldown",
    name: "クールダウン",
    duration: "3分",
    description: "ストレッチで筋肉をほぐし、疲労回復を促進",
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
    health: "健康づくり基礎プラン",
    weight: "脂肪燃焼エクササイズ",
    muscle: "筋力アップトレーニング",
    other: "カスタムトレーニングプラン",
  };
  return names[goal] || "パーソナライズドプラン";
};

const generatePlanDescription = (goal, time) => {
  const timeMap = {
    "5-10": "短時間",
    "10-20": "効率的な",
    "20-30": "しっかり",
    "30plus": "本格的な",
  };

  const timeText = timeMap[time] || "";

  const goalMap = {
    health: "健康的な体づくりと基礎体力の向上を目指す",
    weight: "脂肪燃焼と引き締まった体づくりを目指す",
    muscle: "筋力アップと筋肥大を目指す",
    other: "あなたの目標達成をサポートする",
  };

  return `${timeText}${goalMap[goal] || ""}プログラムです。継続することで着実に結果が出ます！`;
};
