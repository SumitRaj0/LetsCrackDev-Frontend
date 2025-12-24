import { HTMLAttributes } from 'react'
import { cn } from '@/utils/classNames'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined'
  hover?: boolean
}

/**
 * Standardized Card component with modern styling
 *
 * Variants:
 * - default: Basic card with border and shadow
 * - elevated: Enhanced shadow for emphasis
 * - outlined: Border only, no shadow
 *
 * Hover: Adds hover animation (translate up, scale, shadow increase)
 */
export function Card({ className, variant = 'default', hover = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl transition-all duration-200 relative',
        'border border-gray-200 dark:border-gray-700',
        'before:absolute before:inset-0 before:rounded-xl before:pointer-events-none',
        'before:bg-gradient-to-br before:from-indigo-500/10 before:via-purple-500/10 before:to-pink-500/10',
        'dark:before:from-indigo-400/20 dark:before:via-purple-400/20 dark:before:to-pink-400/20',
        'before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300',
        variant === 'default' && 'shadow-sm',
        variant === 'elevated' && 'shadow-md',
        variant === 'outlined' && '',
        hover && 'hover:-translate-y-1 hover:shadow-xl hover:scale-105',
        'hover:border-indigo-300 dark:hover:border-indigo-600 hover:transition-colors',
        className
      )}
      {...props}
    />
  )
}
