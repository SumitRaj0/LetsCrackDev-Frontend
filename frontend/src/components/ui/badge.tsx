import { HTMLAttributes } from 'react'
import { cn } from '@/utils/classNames'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
}

/**
 * Standardized Badge component for labels, tags, and status indicators
 *
 * Variants:
 * - default: Gray
 * - primary: Indigo
 * - success: Green
 * - warning: Yellow
 * - error: Red
 * - info: Blue
 */
export function Badge({ className, variant = 'default', size = 'md', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium',
        size === 'sm' && 'px-2 py-0.5 text-xs',
        size === 'md' && 'px-2.5 py-1 text-xs',
        variant === 'default' && 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
        variant === 'primary' &&
          'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
        variant === 'success' &&
          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
        variant === 'warning' &&
          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
        variant === 'error' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
        variant === 'info' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        'rounded-full',
        className
      )}
      {...props}
    />
  )
}
