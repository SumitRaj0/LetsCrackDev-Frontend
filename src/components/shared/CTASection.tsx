import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

interface CTASectionProps {
  title: string
  description: string
  primaryButton?: {
    text: string
    to: string
  }
  secondaryButton?: {
    text: string
    to: string
  }
  children?: ReactNode
}

/**
 * Standardized CTA Section component matching modern design system
 * Uses gradient background with white cards for contrast
 */
export function CTASection({
  title,
  description,
  primaryButton,
  secondaryButton,
  children,
}: CTASectionProps) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16 md:py-20">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl shadow-xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">{title}</h2>
          <p className="text-indigo-50 mb-6 max-w-2xl mx-auto text-lg leading-relaxed">
            {description}
          </p>
          {children}
          {(primaryButton || secondaryButton) && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {primaryButton && (
                <Link to={primaryButton.to}>
                  <Button
                    variant="primary"
                    size="lg"
                    className="!bg-white !text-indigo-600 hover:!bg-indigo-50 dark:!bg-white dark:!text-indigo-600 dark:hover:!bg-indigo-50"
                  >
                    {primaryButton.text}
                  </Button>
                </Link>
              )}
              {secondaryButton && (
                <Link to={secondaryButton.to}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="!bg-transparent !border-2 !border-white !text-white hover:!bg-white hover:!text-indigo-600 dark:!bg-transparent dark:!border-white dark:!text-white dark:hover:!bg-white dark:hover:!text-indigo-600"
                  >
                    {secondaryButton.text}
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
