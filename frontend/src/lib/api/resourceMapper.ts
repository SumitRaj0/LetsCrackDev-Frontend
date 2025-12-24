/**
 * Resource Mapper
 * Converts backend resource format to frontend format
 */

import { Resource as BackendResource } from './resources.api'
import { Resource as FrontendResource } from '@/modules/resources/types'

/**
 * Convert backend resource to frontend format
 */
export function mapBackendResourceToFrontend(backendResource: BackendResource): FrontendResource {
  // Map category to categorySlug (convert to lowercase, replace spaces with hyphens)
  const categorySlug = backendResource.category.toLowerCase().replace(/\s+/g, '-')
  
  // Map difficulty to rating (for display purposes)
  const difficultyToRating: Record<string, number> = {
    beginner: 4.0,
    intermediate: 4.5,
    advanced: 5.0,
  }
  
  return {
    id: backendResource._id,
    title: backendResource.title,
    description: backendResource.description,
    category: backendResource.category,
    categorySlug,
    url: backendResource.link,
    createdAt: backendResource.createdAt,
    rating: difficultyToRating[backendResource.difficulty] || 4.0,
    tags: backendResource.tags,
    savedCount: 0, // Backend doesn't have this, default to 0
  }
}

