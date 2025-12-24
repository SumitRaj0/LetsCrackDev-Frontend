interface PageHeroProps {
  title: string
  description: string
  className?: string
}

/**
 * Standardized PageHero component that works with gradient background
 * Provides consistent page headers across all pages
 */
export function PageHero({ title, description, className = '' }: PageHeroProps) {
  return (
    <section className={`pt-24 pb-12 md:pt-28 md:pb-16 ${className}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </section>
  )
}
