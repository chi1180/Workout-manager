# Workout Manager 💪

A modern web application to help you maintain a healthy exercise routine.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Deploy](https://github.com/yourusername/workout-manager/actions/workflows/deploy.yml/badge.svg)

## ✨ Features

- 🎯 **Personalized Training Plans**: Customized based on your exercise habits, goals, and available time.
- 📊 **Progress Tracking**: Visualize your annual activity with a GitHub-style heatmap.
- 🔥 **Streak Management**: Keep your motivation high by tracking consecutive days.
- 🌙 **Dark Mode Support**: Eye-friendly dark theme.
- 📱 **Responsive Design**: Designed with a mobile-first approach.
- 💾 **Offline Support**: Data persistence with IndexedDB and localStorage.
- 🎉 **Fun Animations**: Celebrations on completion to support your journey.
- 📦 **Single HTML File**: Easily hostable on GitHub Pages.

## 🚀 Demo

[View Live Demo](#) (Add link after deploying to GitHub Pages)

## 🛠️ Tech Stack

- **Framework**: React 19 (Functional Components + Hooks)
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **Routing**: Custom Hash Router
- **Data Storage**:
  - LocalStorage (User Settings)
  - IndexedDB (Activity History)

## 📦 Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/workout-manager.git
cd workout-manager

# Install dependencies
cd app
npm install

# Start the development server
npm run dev
```

The development server will start at `http://localhost:5173`.

## 🏗️ Build

```bash
# Production build
cd app
npm run build
```

After the build, `dist/index.html` will be generated as a single HTML file.
You can deploy this file directly to a web server.

## 🌐 GitHub Pages Deployment

This project includes an automatic deployment workflow for GitHub Actions.

### Setup Instructions

1. Go to "Pages" in your GitHub repository settings.
2. Set the source to "GitHub Actions".
3. Pushing to the `main` branch will trigger automatic deployment.

### Troubleshooting

**If you encounter cache errors:**

Make sure your workflow file (`.github/workflows/deploy.yml`) is configured correctly:

```yaml
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: app/node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('app/package-lock.json') }}
```

For more details, see [DEPLOYMENT.md](DEPLOYMENT.md).

Or, deploy manually:

```bash
cd app
npm run build

# Deploy the contents of the dist directory to the gh-pages branch
npm install -g gh-pages
gh-pages -d dist
```

## 📱 Screens

### 1. Onboarding (`/#/onboarding`)

A question flow displayed on first use. It collects user's exercise habits, goals, available time, etc., to generate a personalized training plan.

### 2. Dashboard (`/#/dashboard`)

- Today's training menu
- Progress display
- Streak counter
- Weekly progress bar
- Exercise checklist

### 3. History (`/#/history`)

- GitHub-style annual activity heatmap
- Statistics (total days, current streak, longest streak)
- Detailed monthly records

### 4. Settings (`/#/settings`)

- Profile review and reset
- Dark mode toggle
- Data export/import
- Data reset

## 💾 Data Structure

### LocalStorage

```javascript
{
  workout_user_profile: {
    q1: "none",           // Exercise habit level
    q2: "health",         // Training purpose
    q3: "10-20",          // Available time
    q4: "none",           // Available equipment
    q5: "none",           // Limitations
    q6: "morning",        // Preferred time of day
    createdAt: "2025-11-20T00:00:00.000Z"
  },
  workout_training_plan: {
    id: "plan-xxx",
    name: "Basic Health Plan",
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

## 🔮 Future Features

- [ ] **AI Integration**: Full-fledged training plan generation using the Gemini API
- [ ] **Notifications**: Training reminders
- [ ] **Social Features**: Share streaks with friends
- [ ] **Custom Exercises**: Add your own exercises
- [ ] **Weekly/Monthly Reports**: More detailed analysis and insights
- [ ] **Multi-language Support**: Support for other languages like English
- [ ] **PWA Conversion**: Full offline functionality and installability

## 🤖 Gemini API Integration

Currently, this project uses dummy data, but you can integrate the Gemini API to generate personalized training plans with AI.

### Integration Steps

1. Get an API key from Google AI Studio.
2. Create a `.env.local` file:

```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

3. Create `src/utils/ai.js` to implement the Gemini API client.
4. Replace `generateDummyTrainingPlan` in `src/utils/questions.js` with AI generation.

### Sample Implementation

```javascript
// src/utils/ai.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateTrainingPlan(userProfile) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
You are a professional fitness trainer.
Please create a personalized training plan based on the following user profile:

Exercise Habit: ${userProfile.q1}
Goal: ${userProfile.q2}
Available Time: ${userProfile.q3}
Equipment: ${userProfile.q4}
Limitations: ${userProfile.q5}
Preferred Time of Day: ${userProfile.q6}

Please return the response in JSON format with the following structure:
{
  "name": "Plan Name",
  "description": "Plan Description",
  "exercises": [
    {
      "id": "ex1",
      "name": "Exercise Name",
      "duration": "Reps or sets",
      "description": "Detailed description",
      "category": "warmup|cardio|upper|lower|core|cooldown"
    }
  ]
}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Parse JSON
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  throw new Error("Failed to parse AI response");
}
```

## 🧪 Testing

```bash
# Unit Tests (To be implemented)
npm run test

# E2E Tests (To be implemented)
npm run test:e2e
```

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📚 Documentation

- [QUICKSTART.md](QUICKSTART.md) - Quick Start Guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Detailed Deployment Guide

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👤 Author

Your Name

- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgements

- [Lucide](https://lucide.dev/) - Beautiful icon set
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [React](https://react.dev/) - The UI library
- [Vite](https://vitejs.dev/) - Next generation frontend tooling

---

If you like this project, please give it a star! ⭐
