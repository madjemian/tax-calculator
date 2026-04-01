/**
 * Simple Logger utility that respects the environment.
 * Silences logs during test execution (NODE_ENV === 'test').
 */
export const Logger = {
  log: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(...args);
    }
  },
  
  warn: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'test') {
      console.warn(...args);
    }
  },

  error: (...args: unknown[]) => {
    // We usually want to see errors even in tests, 
    // but you can wrap this if it becomes too noisy.
    console.error(...args);
  },

  info: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'test') {
      console.info(...args);
    }
  }
};

export default Logger;
