import React, { forwardRef } from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'warning' | 'info' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant style
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /**
   * Button size
   * @default 'medium'
   */
  size?: ButtonSize;
  /**
   * Button content
   */
  children: React.ReactNode;
}

/**
 * Button component from the design system
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="medium" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'medium', className = '', children, disabled, ...props }, ref) => {
    const classNames = [
      'ds-button',
      `ds-button--${variant}`,
      `ds-button--${size}`,
      disabled && 'ds-button--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={classNames}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
