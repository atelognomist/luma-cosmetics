// This is a temporary adapter simulating a real backend connection.
// It wraps localStorage in async operations to mimic HTTP requests.
// When the real backend is ready, this adapter will be replaced with fetch/axios calls.

const DELAY_MS = 200; // Simulate network latency

export async function dbGet<T>(key: string): Promise<T | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const data = localStorage.getItem(key);
        resolve(data ? JSON.parse(data) : null);
      } catch (err) {
        console.error("Corrupted localStorage data for key", key, err);
        resolve(null);
      }
    }, DELAY_MS);
  });
}

export async function dbSet<T>(key: string, value: T): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(value));
      resolve();
    }, DELAY_MS);
  });
}

export async function dbRemove(key: string): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.removeItem(key);
      resolve();
    }, DELAY_MS);
  });
}
