import { GitHubIcon, LinkedInIcon, TwitterIcon } from '@/components/ui/icons/SocialIcons'
import { SOCIAL_LINKS } from '@/lib/constants'

interface SocialLinksProps {
  variant?: 'default' | 'compact'
  className?: string
}

export function SocialLinks({ variant = 'default', className = '' }: SocialLinksProps) {
  const iconClass = variant === 'compact' ? 'w-4 h-4' : 'w-5 h-5'
  const containerClass = variant === 'compact' ? 'w-8 h-8' : 'w-10 h-10'

  return (
    <div className={`flex gap-3 ${className}`}>
      <a
        href={SOCIAL_LINKS.github}
        target="_blank"
        rel="noopener noreferrer"
        className={`${containerClass} bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 text-white`}
        aria-label="GitHub"
      >
        <GitHubIcon className={`${iconClass} text-white`} />
      </a>
      <a
        href={SOCIAL_LINKS.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className={`${containerClass} bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 text-white`}
        aria-label="LinkedIn"
      >
        <LinkedInIcon className={`${iconClass} text-white`} />
      </a>
      <a
        href={SOCIAL_LINKS.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className={`${containerClass} bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 text-white`}
        aria-label="Twitter"
      >
        <TwitterIcon className={`${iconClass} text-white`} />
      </a>
    </div>
  )
}
