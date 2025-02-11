// src/hooks/usePersistState.js
import { useState, useEffect, useCallback } from "react";

const DB_NAME = "TrainingLogDB";
const STORE_NAME = "persistedState";
const DB_VERSION = 1;

let dbInstance = null;

const getDB = async () => {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

const getValue = async (key) => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

const setValue = async (key, value) => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(value, key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

export function usePersistState(key, defaultValue) {
  const [state, setState] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial state from IndexedDB
  useEffect(() => {
    let mounted = true;

    const loadState = async () => {
      try {
        const storedValue = await getValue(key);
        if (mounted) {
          if (storedValue !== undefined && storedValue !== null) {
            setState(storedValue);
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error loading persisted state:", err);
        if (mounted) {
          setError(err);
          setIsLoading(false);
        }
      }
    };

    loadState();

    return () => {
      mounted = false;
    };
  }, [key]);

  // Persist state changes to IndexedDB
  const setPersistedState = useCallback(
    async (newValue) => {
      try {
        const valueToStore =
          typeof newValue === "function" ? newValue(state) : newValue;

        setState(valueToStore);
        await setValue(key, valueToStore);
      } catch (err) {
        console.error("Error saving persisted state:", err);
        setError(err);
      }
    },
    [key, state]
  );

  return [state, setPersistedState, isLoading, error];
}

export async function clearPersistedState(key) {
  try {
    const db = await getDB();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    if (key) {
      await store.delete(key);
    } else {
      await store.clear();
    }
  } catch (error) {
    console.error("Error clearing persisted state:", error);
    throw error;
  }
}
