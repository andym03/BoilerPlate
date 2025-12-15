/**
 * Design System
 * 
 * Main export point for the design system.
 * 
 * @example
 * ```tsx
 * import { Button, palette, getColor } from '@/design_system';
 * ```
 */

// Export colors and color utilities
export { palette, getColor, getColorToken } from './colors';
export type { ColorName, ColorVariant, ColorValue } from './colors';

// Export components
export { Button } from './components';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components';
