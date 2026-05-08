export const USE_MOCKS = (import.meta.env.VITE_USE_MOCKS ?? 'true') === 'true';

const DEFAULT_DELAY_MS = 180;

export function withMockDelay(value, delayMs = DEFAULT_DELAY_MS) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), delayMs);
  });
}
