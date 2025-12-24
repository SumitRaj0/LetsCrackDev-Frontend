import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/classNames'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  rounded?: 'default' | 'full'
}

/**
 * Standardized Input component matching search bar style
 *
 * Rounded variants:
 * - default: rounded-lg (for forms)
 * - full: rounded-full (for search-like inputs)
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, rounded = 'default', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'block w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent focus:scale-[1.02] focus:shadow-md',
          rounded === 'default' && 'rounded-lg',
          rounded === 'full' && 'rounded-full',
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'
