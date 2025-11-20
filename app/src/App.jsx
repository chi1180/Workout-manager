import { useEffect, useState } from "react";
import { router } from "./utils/router";
import { storage, activityDB } from "./utils/storage";
import Navigation from "./components/Navigation";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Settings from "./pages/Settings";

function App() {
  const [currentRoute, setCurrentRoute] = useState("/");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize app
    initializeApp();

    // Setup router listener
    const handleRouteChange = (path) => {
      setCurrentRoute(path);
    };

    router.addListener(handleRouteChange);

    return () => {
      router.removeListener(handleRouteChange);
    };
  }, []);

  const initializeApp = async () => {
    // Initialize IndexedDB
    await activityDB.init();

    // Apply dark mode
    const isDark = storage.getDarkMode();
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Check if onboarding is complete
    const onboardingComplete = storage.getOnboardingComplete();

    if (!onboardingComplete) {
      router.replace("/onboarding");
    } else {
      const currentPath = router.getCurrentPath();
      if (currentPath === "/" || currentPath === "") {
        router.replace("/dashboard");
      }
    }

    setIsInitialized(true);
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-notion-bg-secondary dark:bg-notion-bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-notion-blue border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-notion-text-secondary dark:text-notion-text-secondary-dark text-sm">
            Initializing...
          </p>
        </div>
      </div>
    );
  }

  // Render current route
  const renderPage = () => {
    switch (currentRoute) {
      case "/onboarding":
        return <Onboarding />;
      case "/dashboard":
        return <Dashboard />;
      case "/history":
        return <History />;
      case "/settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const showNavigation = currentRoute !== "/onboarding";

  return (
    <div className="min-h-screen bg-notion-bg-secondary dark:bg-notion-bg-dark">
      {renderPage()}
      {showNavigation && <Navigation />}
      {showNavigation && <div className="h-14" />}
    </div>
  );
}

export default App;
