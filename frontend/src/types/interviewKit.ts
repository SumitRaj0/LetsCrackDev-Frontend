/**
 * Interview Kit Question Structure
 * Following the FINAL CONTENT STRUCTURE (APPROVED)
 */

export interface CoreConcept {
  /** 2-3 lines, plain technical language, no metaphors, no fluff */
  content: string
}

export interface HowItWorks {
  /** Bullets or short steps, runtime behavior focus */
  items: string[]
}

export interface InterviewReadyAnswer {
  /** 30-40 seconds continuous paragraph, calm confident tone */
  content: string
}

export interface VisualUnderstanding {
  /** Simple ASCII or clean conceptual diagram, optional */
  diagram?: string
  description?: string
}

export interface InterviewerLens {
  /** Collapsed by default, expandable section */
  followUpQuestions?: string[]
  edgeCases?: string[]
  whatIfScenarios?: string[]
}

export interface MistakesSection {
  /** Collapsed by default, expandable section */
  wrongMentalModels?: string[]
  redFlagAnswers?: string[]
  overEngineeringMistakes?: string[]
}

export interface InterviewQuestion {
  id: string
  title: string
  coreConcept: CoreConcept
  howItWorks: HowItWorks
  interviewReadyAnswer: InterviewReadyAnswer
  visualUnderstanding?: VisualUnderstanding
  interviewerLens?: InterviewerLens
  mistakes?: MistakesSection
}

export interface InterviewKit {
  serviceId: string
  serviceName: string
  questions: InterviewQuestion[]
}

