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
        'bg-white dark:bg-gray-800 rounded-xl transition-shadow duration-150',
        'border border-gray-200 dark:border-gray-700',
        variant === 'default' && 'shadow-sm',
        variant === 'elevated' && 'shadow-md',
        variant === 'outlined' && '',
        hover && 'hover:shadow-md',
        className
      )}
      {...props}
    />
  )
}
