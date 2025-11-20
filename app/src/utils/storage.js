// LocalStorage utilities for user profile
export const STORAGE_KEYS = {
  USER_PROFILE: 'workout_user_profile',
  ONBOARDING_COMPLETE: 'workout_onboarding_complete',
  DARK_MODE: 'workout_dark_mode',
  TRAINING_PLAN: 'workout_training_plan',
};

// LocalStorage operations
export const storage = {
  getUserProfile: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading user profile:', error);
      return null;
    }
  },

  setUserProfile: (profile) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  },

  getOnboardingComplete: () => {
    return localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE) === 'true';
  },

  setOnboardingComplete: (complete) => {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, complete.toString());
  },

  getDarkMode: () => {
    const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    if (saved !== null) {
      return saved === 'true';
    }
    // Default to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  },

  setDarkMode: (enabled) => {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, enabled.toString());
  },

  getTrainingPlan: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRAINING_PLAN);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading training plan:', error);
      return null;
    }
  },

  setTrainingPlan: (plan) => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRAINING_PLAN, JSON.stringify(plan));
    } catch (error) {
      console.error('Error saving training plan:', error);
    }
  },

  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  },

  exportData: () => {
    const data = {};
    Object.entries(STORAGE_KEYS).forEach(([key, value]) => {
      const item = localStorage.getItem(value);
      if (item) {
        try {
          data[key] = JSON.parse(item);
        } catch {
          data[key] = item;
        }
      }
    });
    return data;
  },

  importData: (data) => {
    Object.entries(data).forEach(([key, value]) => {
      const storageKey = STORAGE_KEYS[key];
      if (storageKey) {
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(storageKey, stringValue);
      }
    });
  },
};

// IndexedDB utilities for activity history
const DB_NAME = 'WorkoutManagerDB';
const DB_VERSION = 1;
const STORE_NAME = 'activities';

let db = null;

const openDB = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open database'));
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = database.createObjectStore(STORE_NAME, { keyPath: 'date' });
        objectStore.createIndex('date', 'date', { unique: true });
        objectStore.createIndex('allCompleted', 'allCompleted', { unique: false });
      }
    };
  });
};

export const activityDB = {
  init: async () => {
    try {
      await openDB();
      return true;
    } catch (error) {
      console.error('Error initializing database:', error);
      return false;
    }
  },

  saveActivity: async (activity) => {
    try {
      const database = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.put(activity);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(new Error('Failed to save activity'));
      });
    } catch (error) {
      console.error('Error saving activity:', error);
      return false;
    }
  },

  getActivity: async (date) => {
    try {
      const database = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.get(date);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(new Error('Failed to get activity'));
      });
    } catch (error) {
      console.error('Error getting activity:', error);
      return null;
    }
  },

  getAllActivities: async () => {
    try {
      const database = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.getAll();

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(new Error('Failed to get all activities'));
      });
    } catch (error) {
      console.error('Error getting all activities:', error);
      return [];
    }
  },

  getActivitiesInRange: async (startDate, endDate) => {
    try {
      const database = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly');
        const objectStore = transaction.objectStore(STORE_NAME);
        const index = objectStore.index('date');
        const range = IDBKeyRange.bound(startDate, endDate);
        const request = index.getAll(range);

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(new Error('Failed to get activities in range'));
      });
    } catch (error) {
      console.error('Error getting activities in range:', error);
      return [];
    }
  },

  deleteActivity: async (date) => {
    try {
      const database = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.delete(date);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(new Error('Failed to delete activity'));
      });
    } catch (error) {
      console.error('Error deleting activity:', error);
      return false;
    }
  },

  clearAll: async () => {
    try {
      const database = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.clear();

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(new Error('Failed to clear activities'));
      });
    } catch (error) {
      console.error('Error clearing activities:', error);
      return false;
    }
  },

  exportData: async () => {
    try {
      const activities = await activityDB.getAllActivities();
      return activities;
    } catch (error) {
      console.error('Error exporting activities:', error);
      return [];
    }
  },

  importData: async (activities) => {
    try {
      for (const activity of activities) {
        await activityDB.saveActivity(activity);
      }
      return true;
    } catch (error) {
      console.error('Error importing activities:', error);
      return false;
    }
  },
};

// Date utilities
export const dateUtils = {
  formatDate: (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  getTodayString: () => {
    return dateUtils.formatDate(new Date());
  },

  parseDate: (dateString) => {
    return new Date(dateString);
  },

  getDaysInRange: (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(dateUtils.formatDate(new Date(d)));
    }

    return days;
  },

  getLast365Days: () => {
    const today = new Date();
    const last365 = new Date(today);
    last365.setDate(last365.getDate() - 365);
    return dateUtils.getDaysInRange(last365, today);
  },

  isToday: (dateString) => {
    return dateString === dateUtils.getTodayString();
  },
};
