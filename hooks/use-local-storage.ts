import { useState } from 'react';

type LocalStorage<T> = [T, (arg0: T) => void];

export default function useLocalStorage<T>(
  key: string,
  initialValue: T
): LocalStorage<T> {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        return initialValue;
      }
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T) => {
    try {
      const valueToStore = value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };
  return [storedValue, setValue];
}
