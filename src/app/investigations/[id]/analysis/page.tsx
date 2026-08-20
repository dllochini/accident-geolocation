'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AppLayout } from '@/components/layout/AppLayout'
import { apiClient } from '@/lib/api/client'
import { Investigation } from '@/types'
import { CheckCircle2, Zap } from 'lucide-react'

const analysisStages = [
  { step: 1, label: 'Image uploaded', duration: 0 },
  { step: 2, label: 'Image quality checked', duration: 800 },
  { step: 3, label: 'Visual features extracted', duration: 1600 },
  { step: 4, label: 'Geographic features analyzed', duration: 2400 },
  { step: 5, label: 'Searching reference imagery', duration: 4000 },
  { step: 6, label: 'Ranking candidate locations', duration: 5600 },
  { step: 7, label: 'Verifying geographic match', duration: 7000 },
]

export default function AnalysisPage() {
  const params = useParams()
  const router = useRouter()
  const investigationId = params.id as string

  const [investigation, setInvestigation] = useState<Investigation | null>(null)
  const [completedSteps, setCompletedSteps] = useState<number>(0)
  const [progress, setProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Start analysis
  useEffect(() => {
    const startAnalysis = async () => {
      try {
        const inv = await apiClient.getInvestigation(investigationId)
        setInvestigation(inv)

        if (inv.status === 'uploaded') {
          await apiClient.analyzeImage(investigationId)
        }
      } catch (error) {
        console.error('Failed to start analysis:', error)
      } finally {
        setIsLoading(false)
      }
    }

    startAnalysis()
  }, [investigationId])

  // Monitor analysis progress
  useEffect(() => {
    if (isLoading) return

    const pollStatus = setInterval(async () => {
      try {
        const inv = await apiClient.getInvestigation(investigationId)
        setInvestigation(inv)

        const statusToStep: Record<string, number> = {
          uploaded: 1,
          analyzing: 2,
          searching: 5,
          ranking: 6,
          verifying: 7,
          completed: 7,
        }

        const step = statusToStep[inv.status] || 0
        setCompletedSteps(step)

        const statusToProgress: Record<string, number> = {
          uploaded: 15,
          analyzing: 30,
          searching: 55,
          ranking: 70,
          verifying: 85,
          completed: 100,
        }

        setProgress(statusToProgress[inv.status] || 0)

        const messages: Record<string, string> = {
          uploaded: 'Starting analysis...',
          analyzing: 'Extracting visual features from the accident image...',
          searching: 'Searching geotagged reference imagery database...',
          ranking: 'Ranking candidate locations by similarity...',
          verifying: 'Verifying geographic match and confidence...',
          completed: 'Analysis complete!',
        }

        setCurrentMessage(messages[inv.status] || '')

        if (inv.status === 'completed') {
          clearInterval(pollStatus)
          // Redirect to results after a brief delay
          await new Promise(resolve => setTimeout(resolve, 1000))
          router.push(`/investigations/${investigationId}`)
        }
      } catch (error) {
        console.error('Failed to check status:', error)
      }
    }, 500)

    return () => clearInterval(pollStatus)
  }, [isLoading, investigationId, router])

  return (
    <AppLayout>
      <div className="page-container flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Analyzing Accident Scene
            </h1>
            <p className="text-slate-600">
              {investigation?.id}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-600">Analysis Progress</span>
              <span className="text-sm font-bold text-indigo-600">{progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-600 to-indigo-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Current Message */}
          <div className="text-center mb-12">
            <p className="text-lg text-slate-600 font-medium">
              {currentMessage || 'Starting analysis...'}
            </p>
          </div>

          {/* Processing Stages */}
          <div className="space-y-3">
            {analysisStages.map((stage) => {
              const isCompleted = stage.step <= completedSteps
              const isActive = stage.step === completedSteps

              return (
                <div
                  key={stage.step}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                    isCompleted
                      ? 'bg-emerald-50 border border-emerald-200'
                      : isActive
                      ? 'bg-indigo-50 border border-indigo-200'
                      : 'bg-slate-50 border border-slate-200'
                  }`}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                        <CheckCircle2 size={20} className="text-white" />
                      </div>
                    ) : isActive ? (
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center animate-pulse">
                        <Zap size={20} className="text-white" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
                        <span className="text-slate-600 font-medium text-sm">
                          {stage.step}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Label */}
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        isCompleted || isActive
                          ? 'text-slate-900'
                          : 'text-slate-500'
                      }`}
                    >
                      {stage.label}
                    </p>
                  </div>

                  {/* Status */}
                  {isCompleted && (
                    <span className="text-emerald-600 text-sm font-medium">
                      Done
                    </span>
                  )}
                  {isActive && (
                    <span className="text-indigo-600 text-sm font-medium">
                      Processing
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Info Card */}
          <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>How it works:</strong> The system extracts visual features from your accident image,
              searches a database of geotagged reference imagery, and ranks candidate locations based on visual similarity.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
