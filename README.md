# ワークアウトマネージャー 💪

健康的な運動習慣を継続するための、モダンなWebアプリケーションです。

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ 特徴

- 🎯 **パーソナライズされたトレーニングプラン**: あなたの運動習慣、目標、利用可能な時間に基づいてカスタマイズ
- 📊 **進捗トラッキング**: GitHubスタイルのヒートマップで年間の活動を視覚化
- 🔥 **ストリーク管理**: 連続記録を追跡してモチベーションを維持
- 🌙 **ダークモード対応**: 目に優しいダークテーマ
- 📱 **レスポンシブデザイン**: モバイルファーストで設計
- 💾 **オフライン対応**: IndexedDBとlocalStorageでデータを永続化
- 🎉 **楽しいアニメーション**: 達成時のセレブレーションで継続をサポート
- 📦 **単一HTMLファイル**: GitHub Pagesで簡単にホスト可能

## 🚀 デモ

[ライブデモを見る](#) (GitHub Pagesにデプロイ後にリンクを追加)

## 🛠️ 技術スタック

- **フレームワーク**: React 19 (関数コンポーネント + Hooks)
- **ビルドツール**: Vite 7
- **スタイリング**: Tailwind CSS 3
- **アイコン**: Lucide React
- **ルーティング**: カスタムハッシュルーター
- **データストレージ**:
  - LocalStorage (ユーザー設定)
  - IndexedDB (アクティビティ履歴)

## 📦 インストール

### 必要要件

- Node.js 18以上
- npm または yarn

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/workout-manager.git
cd workout-manager

# 依存関係をインストール
cd app
npm install

# 開発サーバーを起動
npm run dev
```

開発サーバーは `http://localhost:5173` で起動します。

## 🏗️ ビルド

```bash
# プロダクションビルド
cd app
npm run build
```

ビルド後、`dist/index.html` が単一HTMLファイルとして生成されます。
このファイルをそのままWebサーバーにデプロイできます。

## 🌐 GitHub Pagesへのデプロイ

このプロジェクトにはGitHub Actions用の自動デプロイワークフローが含まれています。

### セットアップ手順

1. GitHubリポジトリの設定で「Pages」に移動
2. Source を「GitHub Actions」に設定
3. `main` ブランチにプッシュすると自動的にデプロイされます

または、手動でデプロイ:

```bash
cd app
npm run build

# distディレクトリの内容をgh-pagesブランチにデプロイ
```

## 📱 画面構成

### 1. オンボーディング (`/#/onboarding`)
初回利用時に表示される質問フロー。ユーザーの運動習慣、目標、利用可能な時間などを収集し、パーソナライズされたトレーニングプランを生成します。

### 2. ダッシュボード (`/#/dashboard`)
- 今日のトレーニングメニュー
- 進捗状況の表示
- ストリークカウンター
- 週間進捗バー
- エクササイズのチェックリスト

### 3. 履歴 (`/#/history`)
- GitHubスタイルの年間アクティビティヒートマップ
- 統計情報（総日数、現在のストリーク、最長記録）
- 月別の詳細記録

### 4. 設定 (`/#/settings`)
- プロファイルの確認と再設定
- ダークモード切り替え
- データのエクスポート/インポート
- データリセット

## 💾 データ構造

### LocalStorage

```javascript
{
  workout_user_profile: {
    q1: "none",           // 運動習慣レベル
    q2: "health",         // トレーニング目的
    q3: "10-20",          // 利用可能時間
    q4: "none",           // 利用可能器具
    q5: "none",           // 制限事項
    q6: "morning",        // 好みの時間帯
    createdAt: "2025-11-20T00:00:00.000Z"
  },
  workout_training_plan: {
    id: "plan-xxx",
    name: "健康づくり基礎プラン",
    description: "...",
    exercises: [...]
  }
}
```

### IndexedDB (activities)

```javascript
{
  date: "2025-11-20",
  exercises: [...],
  completedExercises: ["ex1", "ex2"],
  allCompleted: true,
  lastUpdated: "2025-11-20T10:30:00.000Z"
}
```

## 🔮 今後の予定機能

- [ ] **AI統合**: Gemini APIを使用した本格的なトレーニングプラン生成
- [ ] **通知機能**: トレーニングリマインダー
- [ ] **ソーシャル機能**: 友達とストリークを共有
- [ ] **カスタムエクササイズ**: 独自のエクササイズを追加
- [ ] **週次・月次レポート**: より詳細な分析とインサイト
- [ ] **多言語対応**: 英語など他言語のサポート
- [ ] **PWA化**: オフラインでの完全動作とインストール可能に

## 🤖 Gemini API統合

現在はダミーデータを使用していますが、Gemini APIを統合してAIによるパーソナライズされたトレーニングプランを生成できます。

### 統合手順

1. Google AI StudioでAPIキーを取得
2. `.env.local`ファイルを作成:

```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

3. `src/utils/ai.js`を作成してGemini APIクライアントを実装
4. `src/utils/questions.js`の`generateDummyTrainingPlan`をAI生成に置き換え

### サンプル実装

```javascript
// src/utils/ai.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateTrainingPlan(userProfile) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
あなたはプロのフィットネストレーナーです。
以下のユーザープロファイルに基づいて、パーソナライズされたトレーニングプランを作成してください：

運動習慣: ${userProfile.q1}
目的: ${userProfile.q2}
利用可能時間: ${userProfile.q3}
器具: ${userProfile.q4}
制限: ${userProfile.q5}
好みの時間帯: ${userProfile.q6}

JSON形式で以下の構造で返してください：
{
  "name": "プラン名",
  "description": "プランの説明",
  "exercises": [
    {
      "id": "ex1",
      "name": "エクササイズ名",
      "duration": "回数またはセット数",
      "description": "詳細な説明",
      "category": "warmup|cardio|upper|lower|core|cooldown"
    }
  ]
}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // JSONをパース
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  throw new Error("Failed to parse AI response");
}
```

## 🧪 テスト

```bash
# ユニットテスト（実装予定）
npm run test

# E2Eテスト（実装予定）
npm run test:e2e
```

## 🤝 コントリビューション

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 👤 作成者

あなたの名前
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 謝辞

- [Lucide](https://lucide.dev/) - 美しいアイコンセット
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファーストCSSフレームワーク
- [React](https://react.dev/) - UIライブラリ
- [Vite](https://vitejs.dev/) - 高速ビルドツール

---

⭐️ このプロジェクトが気に入ったらスターをお願いします！
