import { Home, History, Settings } from "lucide-react";
import { router } from "../utils/router";
import { useEffect, useState } from "react";

export default function Navigation() {
  const [currentPath, setCurrentPath] = useState("/dashboard");

  useEffect(() => {
    const handleRouteChange = (path) => {
      setCurrentPath(path);
    };

    router.addListener(handleRouteChange);

    return () => {
      router.removeListener(handleRouteChange);
    };
  }, []);

  const navItems = [
    {
      path: "/dashboard",
      label: "Home",
      icon: Home,
    },
    {
      path: "/history",
      label: "History",
      icon: History,
    },
    {
      path: "/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  const handleNavigate = (path) => {
    router.navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-notion-bg dark:bg-notion-bg-secondary-dark border-t border-notion-border dark:border-notion-border-dark z-40 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
      <div className="max-w-4xl mx-auto px-2">
        <div className="flex justify-around items-center h-14">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 relative ${
                  isActive
                    ? "text-notion-blue"
                    : "text-notion-text-secondary dark:text-notion-text-secondary-dark hover:text-notion-text dark:hover:text-notion-text-dark"
                }`}
              >
                <Icon
                  className={`w-5 h-5 mb-0.5 transition-transform ${
                    isActive ? "" : ""
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={`text-xs transition-all ${
                    isActive ? "font-semibold" : "font-medium"
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-notion-blue rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
