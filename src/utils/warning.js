import { exists, isFunction } from './identification';

let codeCache = {};

export function warning(message, code, level = 'warn') {
  // This ensures that each warning type is only logged out one time
  if (code) {
    if (codeCache[code]) {
      return;
    }

    codeCache[code] = true;
  }

  if (exists(exists) && isFunction(console[level])) {
    console[level](message);
  }

  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
  } catch (e) {
    // Intentionally blank
  }
}

export function resetCodeCache() {
  codeCache = {};
}
