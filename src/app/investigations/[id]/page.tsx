'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { AppLayout } from '@/components/layout/AppLayout'
import { Investigation } from '@/types'
import { apiClient } from '@/lib/api/client'
import { StatusBadge, ConfidenceBadge, SimilarityScore } from '@/components/common/StatusBadge'
import { MapPin, Copy, Download, ArrowLeft, Map as MapIcon } from 'lucide-react'
import { useState as useLocalState } from 'react'

export default function InvestigationPage() {
  const params = useParams()
  const investigationId = params.id as string

  const [investigation, setInvestigation] = useState<Investigation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCandidate, setSelectedCandidate] = useLocalState(0)
  const [copiedCoord, setCopiedCoord] = useLocalState<string | null>(null)

  useEffect(() => {
    const loadInvestigation = async () => {
      try {
        const data = await apiClient.getInvestigation(investigationId)
        setInvestigation(data)
      } catch (error) {
        console.error('Failed to load investigation:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadInvestigation()
  }, [investigationId])

  const handleCopyCoords = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCoord(text)
      setTimeout(() => setCopiedCoord(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="page-container flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="w-12 h-12 bg-slate-200 rounded-lg animate-pulse mx-auto mb-4" />
            <p className="text-slate-600">Loading investigation...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!investigation) {
    return (
      <AppLayout>
        <div className="page-container text-center py-12">
          <p className="text-slate-600">Investigation not found.</p>
        </div>
      </AppLayout>
    )
  }

  const results = investigation.results
  const candidate = results?.candidates[selectedCandidate]

  return (
    <AppLayout>
      <div className="page-container pb-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/investigations" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1 mb-4">
            <ArrowLeft size={16} />
            Back to Investigations
          </Link>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Investigation Results</h1>
              <p className="text-slate-600 mt-1 font-mono text-sm">{investigationId}</p>
            </div>
            <StatusBadge status={investigation.status} />
          </div>
        </div>

        {/* Main Results Grid */}
        {results ? (
          <>
            {/* Primary Result Section */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Original Image */}
              <div className="card overflow-hidden">
                <div className="bg-slate-100 aspect-square">
                  {investigation.image?.url ? (
                    <img
                      src={investigation.image.url}
                      alt="Accident scene"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-slate-500 mb-1">ACCIDENT IMAGE</p>
                  <p className="text-sm font-medium text-slate-900">
                    {investigation.image?.fileName || 'Unknown file'}
                  </p>
                  {investigation.image?.fileSize && (
                    <p className="text-xs text-slate-500 mt-1">
                      {(investigation.image.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                  )}
                </div>
              </div>

              {/* Predicted Location */}
              <div className="space-y-6">
                {/* Confidence Score */}
                <div className="card p-8">
                  <ConfidenceBadge confidence={results.confidence} variant="large" />
                </div>

                {/* Location Details */}
                <div className="card p-8">
                  <p className="text-xs text-slate-500 mb-4 font-medium">MOST LIKELY LOCATION</p>
                  <p className="text-3xl font-bold text-slate-900 mb-1">
                    {results.location.city}, {results.location.state}
                  </p>
                  <p className="text-slate-600 mb-6">{results.location.country}</p>

                  {/* Coordinates */}
                  <div className="space-y-3 pt-6 border-t border-slate-200">
                    <p className="text-xs font-medium text-slate-500 mb-3">COORDINATES</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">Latitude</p>
                          <p className="font-mono text-sm font-medium text-slate-900">
                            {results.location.latitude.toFixed(4)}° N
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleCopyCoords(
                              `${results.location.latitude.toFixed(4)}, ${results.location.longitude.toFixed(4)}`
                            )
                          }
                          className="text-slate-400 hover:text-slate-600 transition-colors"
                          title="Copy coordinates"
                        >
                          <Copy size={18} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">Longitude</p>
                          <p className="font-mono text-sm font-medium text-slate-900">
                            {results.location.longitude.toFixed(4)}° E
                          </p>
                        </div>
                      </div>
                    </div>

                    {copiedCoord && (
                      <p className="text-xs text-emerald-600 font-medium mt-2">✓ Copied to clipboard</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Reference Imagery */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="section-title mb-1">Similar Reference Imagery</h2>
                  <p className="section-subtitle">
                    Images retrieved by the geolocation model from the reference database.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {results.candidates.map((cand, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCandidate(idx)}
                    className={`card overflow-hidden transition-all transform hover:scale-105 ${
                      selectedCandidate === idx ? 'ring-2 ring-indigo-600' : ''
                    }`}
                  >
                    <div className="bg-slate-100 aspect-square">
                      <img
                        src={cand.imageUrl}
                        alt={`Reference ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <SimilarityScore similarity={cand.similarity} layout="vertical" />
                      <p className="text-xs text-slate-600 mt-3 font-medium">
                        {cand.location.city}
                      </p>
                      <p className="text-xs text-slate-500">
                        {cand.location.state}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Alternative Locations */}
            {results.candidates.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="section-title mb-0">Alternative Locations</h2>
                </div>

                <div className="grid gap-3">
                  {results.candidates.map((cand, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedCandidate(idx)}
                      className={`card p-6 text-left transition-all hover:shadow-card-hover ${
                        selectedCandidate === idx ? 'ring-2 ring-indigo-600' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-slate-400">#{cand.rank}</span>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {cand.location.city}, {cand.location.state}
                            </p>
                            <p className="text-xs text-slate-500">{cand.location.country}</p>
                          </div>
                        </div>
                        <ConfidenceBadge confidence={cand.confidence} variant="compact" />
                      </div>

                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Similarity</p>
                          <p className="font-semibold text-slate-900">
                            {Math.round(cand.similarity * 100)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Latitude</p>
                          <p className="font-mono text-xs text-slate-900">
                            {cand.location.latitude.toFixed(4)}°
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Longitude</p>
                          <p className="font-mono text-xs text-slate-900">
                            {cand.location.longitude.toFixed(4)}°
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Location Evidence */}
            {results.evidence.length > 0 && (
              <div className="card mb-12">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="section-title mb-0">Location Evidence</h2>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {results.evidence.map((evidence, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                      >
                        <span className="font-medium text-slate-900">
                          {evidence.label}
                        </span>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded ${
                            evidence.strength === 'strong'
                              ? 'bg-emerald-100 text-emerald-700'
                              : evidence.strength === 'moderate'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-300 text-slate-700'
                          }`}
                        >
                          {evidence.strength === 'strong'
                            ? 'Strong'
                            : evidence.strength === 'moderate'
                            ? 'Moderate'
                            : 'Weak'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <button className="flex-1 btn-secondary flex items-center justify-center gap-2">
                <MapIcon size={20} />
                View on Map
              </button>
              <button className="flex-1 btn-secondary flex items-center justify-center gap-2">
                <Download size={20} />
                Export Report
              </button>
            </div>
          </>
        ) : (
          <div className="card p-12 text-center">
            <p className="text-slate-600 mb-6">
              This investigation has not been analyzed yet.
            </p>
            {investigation.status === 'uploaded' && (
              <Link href={`/investigations/${investigationId}/analysis`} className="btn-primary">
                Start Analysis
              </Link>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
