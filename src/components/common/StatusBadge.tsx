'use client'

import { InvestigationStatus, ConfidenceLevel } from '@/types'
import { CheckCircle2, Clock, AlertCircle, XCircle, Zap } from 'lucide-react'

interface StatusBadgeProps {
  status: InvestigationStatus
  variant?: 'default' | 'compact'
}

export function StatusBadge({ status, variant = 'default' }: StatusBadgeProps) {
  const statusConfig: Record<InvestigationStatus, {
    label: string
    color: string
    icon: React.ReactNode
  }> = {
    draft: {
      label: 'Draft',
      color: 'bg-slate-100 text-slate-700',
      icon: <Clock size={16} />,
    },
    uploaded: {
      label: 'Uploaded',
      color: 'bg-blue-50 text-blue-700',
      icon: <CheckCircle2 size={16} />,
    },
    analyzing: {
      label: 'Analyzing',
      color: 'bg-blue-50 text-blue-700',
      icon: <Zap size={16} />,
    },
    searching: {
      label: 'Searching',
      color: 'bg-blue-50 text-blue-700',
      icon: <Zap size={16} />,
    },
    ranking: {
      label: 'Ranking',
      color: 'bg-blue-50 text-blue-700',
      icon: <Zap size={16} />,
    },
    verifying: {
      label: 'Verifying',
      color: 'bg-blue-50 text-blue-700',
      icon: <Zap size={16} />,
    },
    completed: {
      label: 'Completed',
      color: 'bg-emerald-50 text-emerald-700',
      icon: <CheckCircle2 size={16} />,
    },
    failed: {
      label: 'Failed',
      color: 'bg-rose-50 text-rose-700',
      icon: <XCircle size={16} />,
    },
  }

  const config = statusConfig[status]

  if (variant === 'compact') {
    return (
      <span className={`text-xs font-medium px-2 py-1 rounded ${config.color}`}>
        {config.label}
      </span>
    )
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${config.color} font-medium text-sm`}>
      {config.icon}
      {config.label}
    </div>
  )
}

interface ConfidenceBadgeProps {
  confidence: number
  variant?: 'default' | 'compact' | 'large'
}

export function ConfidenceBadge({ confidence, variant = 'default' }: ConfidenceBadgeProps) {
  const percentage = Math.round(confidence * 100)
  
  let levelColor = ''
  let levelLabel = ''
  
  if (confidence >= 0.85) {
    levelColor = 'bg-emerald-50 text-emerald-700'
    levelLabel = 'High confidence'
  } else if (confidence >= 0.6) {
    levelColor = 'bg-amber-50 text-amber-700'
    levelLabel = 'Moderate confidence'
  } else {
    levelColor = 'bg-rose-50 text-rose-700'
    levelLabel = 'Low confidence'
  }

  if (variant === 'large') {
    return (
      <div className="text-center">
        <div className={`inline-block mb-3 px-4 py-2 rounded-lg ${levelColor} font-medium text-sm`}>
          {levelLabel}
        </div>
        <div className="text-5xl font-bold text-slate-900 mb-2">{percentage}%</div>
        <p className="text-slate-600">Confidence Score</p>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <span className={`px-2.5 py-1 rounded text-xs font-medium ${levelColor}`}>
          {percentage}%
        </span>
      </div>
    )
  }

  return (
    <div className={`px-3 py-2 rounded-lg ${levelColor} font-medium`}>
      <p className="text-sm">{levelLabel}</p>
      <p className="text-2xl font-bold">{percentage}%</p>
    </div>
  )
}

interface SimilarityScoreProps {
  similarity: number
  layout?: 'vertical' | 'horizontal'
}

export function SimilarityScore({ similarity, layout = 'vertical' }: SimilarityScoreProps) {
  const percentage = Math.round(similarity * 100)
  
  if (layout === 'horizontal') {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-600">Similarity:</span>
        <span className="font-semibold text-slate-900">{percentage}%</span>
      </div>
    )
  }

  return (
    <div className="text-center">
      <p className="text-xs text-slate-600 mb-1">Similarity</p>
      <p className="text-lg font-bold text-slate-900">{percentage}%</p>
    </div>
  )
}
