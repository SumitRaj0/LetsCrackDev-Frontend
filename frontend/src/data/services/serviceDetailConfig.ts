/**
 * Service Detail Configuration Types
 * Defines the structure for service detail page content
 */

export interface ServiceDetailSection {
  title: string
  content: string | string[]
  type?: 'text' | 'list' | 'badges' | 'grid'
}

export interface ServiceDetailConfig {
  slug: string
  subtitle?: string
  whatIsThis?: {
    title: string
    paragraphs: string[]
  }
  whoIsThisFor?: {
    title: string
    items: string[]
  }
  whatYouGet?: {
    title: string
    items: Array<{
      emoji?: string
      title: string
      description?: string
      subItems?: string[]
      additionalText?: string
    }>
  }
  topicsCovered?: {
    title: string
    items: string[]
  }
  howIsDifferent?: {
    title: string
    notThese: string[]
    these: string[]
    closingText?: string
  }
  customSections?: ServiceDetailSection[]
}

