import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/classNames'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  rounded?: 'default' | 'full'
}

/**
 * Standardized Button component following modern design system
 *
 * Variants:
 * - primary: Solid indigo/purple gradient button
 * - secondary: Solid gray button
 * - outline: Outlined button
 * - ghost: Transparent button
 * - gradient: Full gradient button (indigo to purple)
 *
 * Sizes: sm, md, lg
 * Rounded: default (rounded-lg) or full (rounded-full)
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', rounded = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
          // Rounded variants
          rounded === 'default' && 'rounded-lg',
          rounded === 'full' && 'rounded-full',
          // Size variants
          size === 'sm' && 'px-3 py-1.5 text-sm',
          size === 'md' && 'px-4 py-2 text-sm',
          size === 'lg' && 'px-6 py-3 text-base',
          // Variant styles
          variant === 'primary' &&
            'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-sm hover:shadow-md hover:shadow-indigo-500/50 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600',
          variant === 'secondary' &&
            'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
          variant === 'outline' &&
            'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
          variant === 'ghost' &&
            'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
          variant === 'gradient' &&
            'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 shadow-sm hover:shadow-md',
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
