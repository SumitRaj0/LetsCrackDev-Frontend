import { Resource } from '@/modules/resources/types'
import { ResourceCard } from '@/modules/resources/components/ResourceCard'

interface VirtualizedResourceGridProps {
  resources: Resource[]
  columnCount?: number
  itemWidth?: number
  itemHeight?: number
  containerHeight?: number
}

export function VirtualizedResourceGrid({ resources }: VirtualizedResourceGridProps) {
  if (resources.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 dark:text-gray-400">No resources found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {resources.map(resource => (
        <div key={resource.id} className="p-3">
          <ResourceCard resource={resource} />
        </div>
      ))}
    </div>
  )
}
