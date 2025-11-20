// Simple hash-based router for single page application
export class HashRouter {
  constructor() {
    this.routes = {};
    this.currentPath = '';
    this.listeners = [];

    // Listen to hash changes
    window.addEventListener('hashchange', () => this.handleRouteChange());
    window.addEventListener('load', () => this.handleRouteChange());
  }

  // Register a route
  addRoute(path, callback) {
    this.routes[path] = callback;
  }

  // Get current path from hash
  getCurrentPath() {
    const hash = window.location.hash;
    return hash ? hash.slice(1) : '/';
  }

  // Navigate to a path
  navigate(path) {
    window.location.hash = path;
  }

  // Handle route changes
  handleRouteChange() {
    const newPath = this.getCurrentPath();

    if (newPath !== this.currentPath) {
      this.currentPath = newPath;
      this.notifyListeners(newPath);

      // Execute route callback if exists
      const callback = this.routes[newPath];
      if (callback) {
        callback(newPath);
      }
    }
  }

  // Add listener for route changes
  addListener(callback) {
    this.listeners.push(callback);
    // Immediately call with current path
    callback(this.currentPath || this.getCurrentPath());
  }

  // Remove listener
  removeListener(callback) {
    this.listeners = this.listeners.filter(cb => cb !== callback);
  }

  // Notify all listeners
  notifyListeners(path) {
    this.listeners.forEach(callback => callback(path));
  }

  // Replace current route without adding to history
  replace(path) {
    window.location.replace(`${window.location.pathname}${window.location.search}#${path}`);
    this.handleRouteChange();
  }
}

// Create singleton instance
export const router = new HashRouter();

// Helper function to get route parameters
export const getRouteParams = (path) => {
  const parts = path.split('?');
  if (parts.length < 2) return {};

  const params = {};
  const queryString = parts[1];
  const pairs = queryString.split('&');

  pairs.forEach(pair => {
    const [key, value] = pair.split('=');
    if (key) {
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
  });

  return params;
};

// Helper to build URL with params
export const buildRoute = (path, params = {}) => {
  const queryString = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  return queryString ? `${path}?${queryString}` : path;
};
