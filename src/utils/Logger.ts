/**
 * Simple Logger utility that respects the environment.
 * Silences logs during test execution (NODE_ENV === 'test').
 */
export const Logger = {
  log: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'test') {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'test') {
      // eslint-disable-next-line no-console
      console.warn(...args);
    }
  },

  error: (...args: any[]) => {
    // We usually want to see errors even in tests, 
    // but you can wrap this if it becomes too noisy.
    // eslint-disable-next-line no-console
    console.error(...args);
  },

  info: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'test') {
      // eslint-disable-next-line no-console
      console.info(...args);
    }
  }
};

export default Logger;
