/**
 * Service Detail Configurations
 * Central export for all service detail page configurations
 */

import { ServiceDetailConfig } from './serviceDetailConfig'
import { javascriptInterviewMasteryKitConfig } from './javascript-interview-mastery-kit'
import { atsResumeServiceConfig } from './ats-resume-service'
import { frontendReactInterviewPrepConfig } from './frontend-react-interview-preparation-kit'
import { nodeMasteryKitConfig } from './node-mastery-kit'
import { fullFrontendPrepKitConfig } from './full-frontend-preparation-kit'

export const serviceDetailConfigs: Record<string, ServiceDetailConfig> = {
  'javascript-interview-mastery-kit': javascriptInterviewMasteryKitConfig,
  'ats-resume-service': atsResumeServiceConfig,
  'frontend-react-interview-preparation-kit': frontendReactInterviewPrepConfig,
  'node-mastery-kit': nodeMasteryKitConfig,
  'full-frontend-preparation-kit': fullFrontendPrepKitConfig,
}

/**
 * Get service detail config by slug
 */
export function getServiceDetailConfig(slug: string): ServiceDetailConfig | null {
  return serviceDetailConfigs[slug] || null
}

export type { ServiceDetailConfig } from './serviceDetailConfig'

