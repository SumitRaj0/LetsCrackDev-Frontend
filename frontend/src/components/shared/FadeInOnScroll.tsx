import { useEffect, useRef, useState, ReactNode } from 'react'

interface FadeInOnScrollProps {
  children: ReactNode
  delay?: number
  className?: string
}

/**
 * FadeInOnScroll component - Generic wrapper for scroll-triggered animations
 *
 * Effect: start at opacity: 0; translateY(12px);, animate to opacity: 1; translateY(0);
 * Duration: ~400ms with optional stagger delay
 *
 * Adjust animation duration/intensity in the className below
 */
export function FadeInOnScroll({ children, delay = 0, className = '' }: FadeInOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [delay])

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      } ${className}`}
    >
      {children}
    </div>
  )
}
