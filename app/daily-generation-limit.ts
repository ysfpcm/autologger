export const DAILY_GENERATION_LIMIT = 7;
export const GENERATION_STORAGE_KEY = 'autologger-daily-generations';

type GenerationCount = { date: string; count: number };

export function createDailyGenerationLimit(storage: Storage | null, now = () => new Date()) {
  let cached: GenerationCount | null = null;

  const read = () => {
    const date = now();
    const today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    if (cached?.date !== today) {
      cached = { date: today, count: 0 };
    }

    if (storage) {
      try {
        const value = storage.getItem(GENERATION_STORAGE_KEY);
        let saved: GenerationCount | null = null;
        try {
          saved = value ? JSON.parse(value) : null;
        } catch {
          saved = null;
        }
        cached = saved?.date === today && Number.isInteger(saved.count) && saved.count >= 0
          ? { date: today, count: Math.min(saved.count, DAILY_GENERATION_LIMIT) }
          : { date: today, count: 0 };
      } catch {
        storage = null;
      }
    }

    return cached;
  };

  return {
    remaining() {
      return DAILY_GENERATION_LIMIT - read().count;
    },
    consume() {
      const current = read();
      if (current.count >= DAILY_GENERATION_LIMIT) return null;
      cached = { ...current, count: current.count + 1 };
      if (storage) {
        try {
          storage.setItem(GENERATION_STORAGE_KEY, JSON.stringify(cached));
        } catch {
          storage = null;
        }
      }
      return DAILY_GENERATION_LIMIT - cached.count;
    }
  };
}
