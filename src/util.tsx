/**
 * Convert a formatted number string to a number according to german number
 * notation.
 *
 * Examples:
 *   - "1.000,00" -> 1000
 *   - "-10" -> -10
 *   - "-10-10" -> -1010
 *   - "1,30" -> 1.3
 *   - "aaa" -> NaN
 *   - "" -> NaN
 */
export function parseNumeric(value: string): number {
  const c: Record<string, number> = { ',': -1, '-': -1 };
  const tmp = value
    .replace(/[\,\.\-]/g, x => (c[x] && !++c[x] ? (x === ',' ? '.' : x) : ''))
    .replace(/[^0-9-\.]/g, '');
  return tmp === '' ? NaN : Number(tmp);
}

/**
 * Convert a number into german currency notation.
 * Example:
 *   1    -> 1,00
 *   1000 -> 1.000,00
 */

export function currency(num: any, decimals: number = 2): string {
  if (isNaN(num)) return '-,-- €';

  // Expect the user to explicitely round themselves. Otherwise we would
  // swallow real errors and we don't want to do that when real money is
  // involved ;)
  if (num % 1 !== 0 && num !== Number(num.toFixed(decimals))) {
    throw new Error(
      `Attempting to implicitely round ${num} to ${num.toFixed(decimals)}`,
    );
  }

  const s = Math.abs(num).toFixed(decimals);
  const len = s.length;
  const start = len % 3;

  let out = '';
  for (let i = 0; i < len; i++) {
    if (s[i] === '.') {
      out += ',' + s.slice(i + 1);
      break;
    } else if ((i + len - start * 2) % 3 === 0 && out !== '') {
      out += '.';
    }
    out += s[i];
  }

  return (num < 0 ? '-' : '') + out + ' €';
}

/**
 * Convert a `boolean` to "Ja" or "Nein"
 */
/* istanbul ignore next */
export function boolToWord(value: boolean) {
  return value ? 'Ja' : 'Nein';
}

/**
 * Format a `date` object to a human readable date format (DD.MM.YYYY)
 */
export function formatDate(date: Date) {
  const day = ('00' + date.getDate()).slice(-2);
  const month = ('00' + (date.getMonth() + 1)).slice(-2);
  return `${day}.${month}.${date.getFullYear()}`;
}

// We only ever need 1 canvas instance since we only ever measure synchronously
const context = document.createElement('canvas').getContext('2d')!;

/**
 * Measure the actual rendered with of the given string with the specified
 * font-family and font-size.
 */
export function measureText(text: string, font: string, size: number) {
  context.font = size + 'px ' + font;
  return context.measureText(text).width;
}

/**
 * Append a stylesheet to the document's <head>-tag and resolve once it is
 * loaded. This is only done in `production`-mode where each theme has a
 * dedicated css file.
 */
/* istanbul ignore next */
export function loadStylesheet(href = ''): Promise<void> {
  // During `development`-mode webpack doesn't write to disk.
  if (process.env.NODE_ENV !== 'production') {
    return Promise.resolve();
  }

  const stylesheet = document.createElement('link');
  stylesheet.type = 'text/css';
  stylesheet.rel = 'stylesheet';
  stylesheet.href = href;

  document.head.appendChild(stylesheet);

  return new Promise((resolve, reject) => {
    const validateLoad = (e: Event | ErrorEvent) => {
      return e.target !== null && !!(e.target as any).sheet.cssRules
        ? resolve()
        : reject(new Error(`Could not load Stylesheet ${href}`));
    };

    // We can not bind to onerror or onload directly because of browser
    // inconsistencies, see https://stackoverflow.com/a/30178511/7780607
    stylesheet.onload = validateLoad;
    stylesheet.onerror = validateLoad;
  });
}

// https://gist.github.com/gre/1650294
/* istanbul ignore next */
export const easeInCubic = (t: number) => t * t * t;
/* istanbul ignore next */
export const easeOutCubic = (t: number) => --t * t * t + 1;
/* istanbul ignore next */
export const inverseEaseInCubic = (t: number) => Math.pow(t, 1 / 3);

/** Clamp a value between 0..1 */
export const clamp = (x: number) => Math.max(0, Math.min(1, x));

/** Normalize delta against 0..1 range. Used to invert animations */
export const normalize = (x: number, delta: -1 | 1) => (delta < 0 ? 1 - x : x);

/* istanbul ignore next */
export const ease = (x: number) => 1 - Math.pow(1 - clamp(x), 4);

/* istanbul ignore next */
export const noop = () => undefined;

/* istanbul ignore next */
export const requestAnimationFrame = (
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  (window as any).mozRequestAnimationFrame ||
  (window as any).oRequestAnimationFrame ||
  (window as any).msRequestAnimationFrame ||
  noop
).bind(null);

/* istanbul ignore next */
export const cancelAnimationFrame = (
  window.cancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  (window as any).mozCancelAnimationFrame ||
  (window as any).oCancelAnimationFrame ||
  (window as any).msCancelAnimationFrame ||
  noop
).bind(null);

/**
 * Merge two objects and concatenate any arrays. Only use this for pure data
 * structures. Don't use this for models or a non-serializable structure.
 */
export function merge(a: Record<string, any>, b: Record<string, any>) {
  // tslint:disable-next-line:forin
  for (const i in b) {
    a[i] =
      b[i] instanceof Array && a[i] instanceof Array ? a[i].concat(b[i]) : b[i];
  }
  return a;
}
