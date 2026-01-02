import { memo, useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { InterviewQuestion } from '@/types/interviewKit'
import { getInterviewKitQuestions } from '@/lib/api'
import { useErrorHandler } from '@/contexts/ErrorContext'

const COMPLETED_KEY_PREFIX = 'interviewKit:completedQuestionIds'

function safeParseStringArray(value: string | null): string[] | null {
  if (!value) return null
  try {
    const parsed = JSON.parse(value) as unknown
    if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) return parsed
    return null
  } catch {
    return null
  }
}

function useInterviewKitProgress(storageKey: string) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const parsed = safeParseStringArray(localStorage.getItem(storageKey))
    if (parsed) setCompletedIds(new Set(parsed))
  }, [storageKey])

  const toggleCompleted = useCallback(
    (id: string) => {
      setCompletedIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        try {
          localStorage.setItem(storageKey, JSON.stringify(Array.from(next)))
        } catch {
          // ignore
        }
        return next
      })
    },
    [storageKey],
  )

  const resetProgress = useCallback(() => {
    setCompletedIds(new Set())
    try {
      localStorage.removeItem(storageKey)
    } catch {
      // ignore
    }
  }, [storageKey])

  return { completedIds, toggleCompleted, resetProgress }
}

const SidebarQuestionButton = memo(function SidebarQuestionButton(props: {
  id: string
  title: string
  isActive: boolean
  isDone: boolean
  onClick: (id: string) => void
}) {
  const { id, title, isActive, isDone, onClick } = props

  return (
    <button
      onClick={() => onClick(id)}
      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
        isActive
          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-300 font-medium'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex-1">
          {id}. {title}
        </span>
        {isDone && (
          <span className="text-[10px] px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
            Done
          </span>
        )}
      </div>
    </button>
  )
})

export default function InterviewKitViewer() {
  const { serviceId } = useParams<{ serviceId: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { handleError } = useErrorHandler()
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('1')
  const [questions, setQuestions] = useState<InterviewQuestion[]>([])
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)
  const [expandedSections, setExpandedSections] = useState<{
    interviewerLens: boolean
    mistakes: boolean
  }>({
    interviewerLens: false,
    mistakes: false,
  })
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const [copied, setCopied] = useState(false)

  const progressStorageKey = `${COMPLETED_KEY_PREFIX}:${serviceId || 'unknown-service'}`
  const { completedIds, toggleCompleted, resetProgress } = useInterviewKitProgress(progressStorageKey)

  // Fetch questions from API (production: do not bundle paid content in frontend)
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!serviceId) return
      try {
        setIsLoadingQuestions(true)
        setAccessDenied(false)
        const res = await getInterviewKitQuestions(serviceId)
        if (res.success) {
          setQuestions(res.data.kit.questions || [])
        }
      } catch (err: any) {
        if (err?.status === 403) {
          setAccessDenied(true)
        } else {
          handleError(err, {
            showToast: true,
            logError: true,
            context: { component: 'InterviewKitViewer', action: 'fetchQuestions' },
          })
        }
      } finally {
        setIsLoadingQuestions(false)
      }
    }

    fetchQuestions()
  }, [handleError, serviceId])

  const stableQuestions: InterviewQuestion[] = useMemo(() => questions, [questions])
  const questionById = useMemo(() => {
    const map = new Map<string, InterviewQuestion>()
    for (const q of stableQuestions) map.set(q.id, q)
    return map
  }, [stableQuestions])

  const selectedIndex = useMemo(() => {
    const idx = stableQuestions.findIndex((q) => q.id === selectedQuestionId)
    return idx >= 0 ? idx : 0
  }, [stableQuestions, selectedQuestionId])

  const currentQuestion = stableQuestions[selectedIndex] ?? stableQuestions[0]

  const filteredQuestions = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    if (!q) return stableQuestions
    return stableQuestions.filter((item) => item.title.toLowerCase().includes(q) || item.id === q)
  }, [stableQuestions, deferredQuery])

  const toggleSection = useCallback((section: 'interviewerLens' | 'mistakes') => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }, [])

  // Initialize selection from URL (q=ID) and completion from localStorage
  useEffect(() => {
    const qParam = searchParams.get('q')
    if (qParam && questionById.has(qParam)) {
      setSelectedQuestionId(qParam)
    } else if (stableQuestions.length > 0) {
      setSelectedQuestionId(stableQuestions[0].id)
    }
  }, [questionById, stableQuestions, searchParams])

  // Keep URL in sync with selected question
  useEffect(() => {
    if (!selectedQuestionId) return
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('q', selectedQuestionId)
      return next
    })
  }, [selectedQuestionId, setSearchParams])

  // Scroll to top when question changes
  const handleQuestionChange = useCallback((id: string) => {
    setSelectedQuestionId(id)
    setExpandedSections({ interviewerLens: false, mistakes: false })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const completedCount = completedIds.size

  const copyAnswer = useCallback(async () => {
    if (!currentQuestion) return
    try {
      await navigator.clipboard.writeText(currentQuestion.interviewReadyAnswer.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      // Clipboard can fail on insecure origins or blocked permissions; ignore to keep flow smooth.
    }
  }, [currentQuestion])

  if (isLoadingQuestions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="p-8 max-w-lg w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Required</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This Interview Kit is premium content. Please purchase the service to unlock access.
          </p>
          {serviceId && (
            <Button
              variant="primary"
              className="w-full"
              onClick={() => navigate(`/premium/service/${serviceId}`)}
            >
              Go to Purchase Page
            </Button>
          )}
          <Button variant="outline" className="w-full mt-3" onClick={() => navigate('/premium')}>
            Browse Premium
          </Button>
        </Card>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-lg w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Questions Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We could not load the interview questions for this kit.
          </p>
          <Button variant="primary" className="w-full" onClick={() => navigate('/premium')}>
            Back to Premium
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      {/* Header - Fixed below navbar */}
      <div className="sticky top-16 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <Button variant="ghost" onClick={() => navigate('/dashboard')} size="sm">
                ← Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  JavaScript Interview Mastery Kit
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Question {selectedIndex + 1} of {stableQuestions.length} • Completed {completedCount}/{stableQuestions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="primary">Premium Content</Badge>
              <Button
                variant={completedIds.has(currentQuestion.id) ? 'primary' : 'outline'}
                size="sm"
                onClick={() => toggleCompleted(currentQuestion.id)}
              >
                {completedIds.has(currentQuestion.id) ? 'Completed' : 'Mark Completed'}
              </Button>
              <Button variant="ghost" size="sm" onClick={resetProgress}>
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Question Navigation */}
          <div className="lg:col-span-1">
            <Card className="p-4 sticky top-32 max-h-[calc(100vh-8rem)] flex flex-col">
              <div className="flex items-center justify-between mb-3 gap-2">
                <h2 className="font-semibold text-gray-900 dark:text-white">Questions</h2>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {filteredQuestions.length}/{stableQuestions.length}
                </span>
              </div>

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search (e.g. 'event loop' or '31')"
                className="w-full mb-3 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <div className="space-y-1 overflow-y-auto flex-1 pr-2">
                {filteredQuestions.map((q) => (
                  <SidebarQuestionButton
                    key={q.id}
                    id={q.id}
                    title={q.title}
                    isActive={q.id === currentQuestion.id}
                    isDone={completedIds.has(q.id)}
                    onClick={handleQuestionChange}
                  />
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Question Title */}
            <Card className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                    Question {selectedIndex + 1} / {stableQuestions.length}
                  </p>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {currentQuestion.title}
                  </h2>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleCompleted(currentQuestion.id)}
                >
                  {completedIds.has(currentQuestion.id) ? 'Completed' : 'Mark Completed'}
                </Button>
              </div>
            </Card>

            {/* 1. Core Concept */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                1. Core Concept (What It Is)
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {currentQuestion.coreConcept.content}
              </p>
            </Card>

            {/* 2. How It Works */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                2. How It Works (Mechanism / Flow)
              </h3>
              <ul className="space-y-3">
                {currentQuestion.howItWorks.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-indigo-600 dark:text-indigo-400 mt-1 font-semibold">
                      {index + 1}.
                    </span>
                    <span className="text-gray-700 dark:text-gray-300 flex-1">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* 3. Interview-Ready Answer */}
            <Card className="p-6 bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  3. Interview-Ready Answer (30–40 seconds)
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm">
                    Most Important
                  </Badge>
                  <Button variant="outline" size="sm" onClick={copyAnswer}>
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {currentQuestion.interviewReadyAnswer.content}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 italic">
                This is what you should say verbatim during the interview. Practice this until it
                flows naturally.
              </p>
            </Card>

            {/* 4. Visual Understanding (Optional) */}
            {currentQuestion.visualUnderstanding && (
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  4. Visual Understanding
                </h3>
                {currentQuestion.visualUnderstanding.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {currentQuestion.visualUnderstanding.description}
                  </p>
                )}
                {currentQuestion.visualUnderstanding.diagram && (
                  <div className="bg-gray-900 dark:bg-black rounded-lg p-6 font-mono text-sm text-green-400 overflow-x-auto">
                    <pre className="whitespace-pre-wrap">
                      {currentQuestion.visualUnderstanding.diagram}
                    </pre>
                  </div>
                )}
              </Card>
            )}

            {/* 5. Interviewer Lens (Collapsed) */}
            {currentQuestion.interviewerLens && (
              <Card className="p-6">
                <button
                  onClick={() => toggleSection('interviewerLens')}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    5. Interviewer Lens (Collapsed / Optional)
                  </h3>
                  <svg
                    className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
                      expandedSections.interviewerLens ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {expandedSections.interviewerLens && (
                  <div className="mt-4 space-y-4">
                    {currentQuestion.interviewerLens.followUpQuestions &&
                      currentQuestion.interviewerLens.followUpQuestions.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            Common Follow-Up Questions
                          </h4>
                          <ul className="space-y-2">
                            {currentQuestion.interviewerLens.followUpQuestions.map((q, index) => (
                              <li
                                key={index}
                                className="text-gray-700 dark:text-gray-300 flex items-start gap-2"
                              >
                                <span className="text-indigo-600 dark:text-indigo-400 mt-1">•</span>
                                <span>{q}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {currentQuestion.interviewerLens.edgeCases &&
                      currentQuestion.interviewerLens.edgeCases.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            Edge Cases
                          </h4>
                          <ul className="space-y-2">
                            {currentQuestion.interviewerLens.edgeCases.map((case_, index) => (
                              <li
                                key={index}
                                className="text-gray-700 dark:text-gray-300 flex items-start gap-2"
                              >
                                <span className="text-indigo-600 dark:text-indigo-400 mt-1">•</span>
                                <span>{case_}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {currentQuestion.interviewerLens.whatIfScenarios &&
                      currentQuestion.interviewerLens.whatIfScenarios.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            "What If" Scenarios
                          </h4>
                          <ul className="space-y-2">
                            {currentQuestion.interviewerLens.whatIfScenarios.map((scenario, index) => (
                              <li
                                key={index}
                                className="text-gray-700 dark:text-gray-300 flex items-start gap-2"
                              >
                                <span className="text-indigo-600 dark:text-indigo-400 mt-1">•</span>
                                <span>{scenario}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                )}
              </Card>
            )}

            {/* 6. Mistakes Interviewers Look For (Collapsed) */}
            {currentQuestion.mistakes && (
              <Card className="p-6">
                <button
                  onClick={() => toggleSection('mistakes')}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    6. Mistakes Interviewers Look For (Collapsed / Optional)
                  </h3>
                  <svg
                    className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
                      expandedSections.mistakes ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {expandedSections.mistakes && (
                  <div className="mt-4 space-y-4">
                    {currentQuestion.mistakes.wrongMentalModels &&
                      currentQuestion.mistakes.wrongMentalModels.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            Wrong Mental Models
                          </h4>
                          <ul className="space-y-2">
                            {currentQuestion.mistakes.wrongMentalModels.map((mistake, index) => (
                              <li
                                key={index}
                                className="text-gray-700 dark:text-gray-300 flex items-start gap-2"
                              >
                                <span className="text-red-600 dark:text-red-400 mt-1">✗</span>
                                <span>{mistake}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {currentQuestion.mistakes.redFlagAnswers &&
                      currentQuestion.mistakes.redFlagAnswers.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            Red-Flag Answers
                          </h4>
                          <ul className="space-y-2">
                            {currentQuestion.mistakes.redFlagAnswers.map((answer, index) => (
                              <li
                                key={index}
                                className="text-gray-700 dark:text-gray-300 flex items-start gap-2"
                              >
                                <span className="text-red-600 dark:text-red-400 mt-1">✗</span>
                                <span>{answer}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {currentQuestion.mistakes.overEngineeringMistakes &&
                      currentQuestion.mistakes.overEngineeringMistakes.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            Over-Engineering Mistakes
                          </h4>
                          <ul className="space-y-2">
                            {currentQuestion.mistakes.overEngineeringMistakes.map((mistake, index) => (
                              <li
                                key={index}
                                className="text-gray-700 dark:text-gray-300 flex items-start gap-2"
                              >
                                <span className="text-red-600 dark:text-red-400 mt-1">✗</span>
                                <span>{mistake}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                )}
              </Card>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => {
                  if (selectedIndex > 0) {
                    handleQuestionChange(stableQuestions[selectedIndex - 1].id)
                  }
                }}
                disabled={selectedIndex === 0}
              >
                ← Previous
              </Button>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {selectedIndex + 1} / {stableQuestions.length}
              </span>
              <Button
                variant="primary"
                onClick={() => {
                  if (selectedIndex < stableQuestions.length - 1) {
                    handleQuestionChange(stableQuestions[selectedIndex + 1].id)
                  }
                }}
                disabled={selectedIndex === stableQuestions.length - 1}
              >
                Next →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

