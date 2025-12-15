/**
 * Design System Color Palette
 * 
 * Each color has base, light, and dark variants for use across light and dark themes.
 */
export const palette = {
  white: {
    base: '#ffffff',
    light: '#ffffff',
    dark: '#f5f5f5',
  },
  black: {
    base: '#000000',
    light: '#1a1a1a',
    dark: '#000000',
  },
  green: {
    base: '#22c55e',
    light: '#4ade80',
    dark: '#16a34a',
  },
  blue: {
    base: '#3b82f6',
    light: '#60a5fa',
    dark: '#2563eb',
  },
  purple: {
    base: '#a855f7',
    light: '#c084fc',
    dark: '#9333ea',
  },
  yellow: {
    base: '#eab308',
    light: '#facc15',
    dark: '#ca8a04',
  },
  orange: {
    base: '#f97316',
    light: '#fb923c',
    dark: '#ea580c',
  },
  gray: {
    base: '#6b7280',
    light: '#9ca3af',
    dark: '#4b5563',
  },
  red: {
    base: '#ef4444',
    light: '#f87171',
    dark: '#dc2626',
  },
} as const;

export type ColorName = keyof typeof palette;
export type ColorVariant = 'base' | 'light' | 'dark';
export type ColorValue = typeof palette[ColorName][ColorVariant];

/**
 * Get a color value from the palette
 */
export function getColor(color: ColorName, variant: ColorVariant = 'base'): ColorValue {
  return palette[color][variant];
}

/**
 * Get a color token name for CSS variable usage
 */
export function getColorToken(color: ColorName, variant: ColorVariant = 'base'): string {
  return `--ds-color-${color}-${variant}`;
}
