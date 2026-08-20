'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/layout/AppLayout'
import { Investigation, InvestigationStatus } from '@/types'
import { apiClient } from '@/lib/api/client'
import { StatusBadge, ConfidenceBadge } from '@/components/common/StatusBadge'
import { Plus, Search, ExternalLink, Trash2 } from 'lucide-react'

export default function InvestigationsPage() {
  const router = useRouter()
  const [investigations, setInvestigations] = useState<Investigation[]>([])
  const [filteredInvestigations, setFilteredInvestigations] = useState<Investigation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<InvestigationStatus | 'all'>('all')
  const [filterConfidence, setFilterConfidence] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  useEffect(() => {
    const loadInvestigations = async () => {
      try {
        const data = await apiClient.listInvestigations()
        setInvestigations(data)
      } catch (error) {
        console.error('Failed to load investigations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadInvestigations()
  }, [])

  // Filter investigations
  useEffect(() => {
    let filtered = investigations

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        inv =>
          inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inv.caseInfo.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(inv => inv.status === filterStatus)
    }

    // Confidence filter
    if (filterConfidence !== 'all' && inv.results) {
      const confidence = inv.results.confidence
      filtered = filtered.filter(inv => {
        if (!inv.results) return false
        const conf = inv.results.confidence

        if (filterConfidence === 'high') return conf >= 0.85
        if (filterConfidence === 'medium') return conf >= 0.6 && conf < 0.85
        if (filterConfidence === 'low') return conf < 0.6

        return true
      })
    }

    setFilteredInvestigations(filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ))
  }, [investigations, searchQuery, filterStatus, filterConfidence])

  const statusOptions: Array<{ value: InvestigationStatus | 'all', label: string }> = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'uploaded', label: 'Uploaded' },
    { value: 'analyzing', label: 'Analyzing' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
  ]

  const confidenceOptions = [
    { value: 'all', label: 'All Confidence' },
    { value: 'high', label: 'High (≥85%)' },
    { value: 'medium', label: 'Medium (60-84%)' },
    { value: 'low', label: 'Low (<60%)' },
  ]

  return (
    <AppLayout>
      <div className="page-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Investigations</h1>
            <p className="text-slate-600 mt-1">Manage and review all accident investigations.</p>
          </div>
          <Link href="/investigations/new" className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            New Investigation
          </Link>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by case ID or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-base pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as InvestigationStatus | 'all')}
                className="input-base"
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Confidence Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Confidence
              </label>
              <select
                value={filterConfidence}
                onChange={(e) => setFilterConfidence(e.target.value as 'all' | 'high' | 'medium' | 'low')}
                className="input-base"
              >
                {confidenceOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="card">
          <div className="p-6 border-b border-slate-200">
            <p className="text-sm font-medium text-slate-900">
              {filteredInvestigations.length} of {investigations.length} investigations
            </p>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 bg-slate-200 rounded-lg animate-pulse mx-auto mb-4" />
              <p className="text-slate-600">Loading investigations...</p>
            </div>
          ) : filteredInvestigations.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-600 mb-4">No investigations found.</p>
              {investigations.length === 0 && (
                <Link href="/investigations/new" className="btn-primary">
                  Create Your First Investigation
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-6 py-3 font-semibold text-slate-900 text-sm">
                      Case ID
                    </th>
                    <th className="text-left px-6 py-3 font-semibold text-slate-900 text-sm">
                      Created
                    </th>
                    <th className="text-left px-6 py-3 font-semibold text-slate-900 text-sm">
                      Description
                    </th>
                    <th className="text-left px-6 py-3 font-semibold text-slate-900 text-sm">
                      Location
                    </th>
                    <th className="text-left px-6 py-3 font-semibold text-slate-900 text-sm">
                      Confidence
                    </th>
                    <th className="text-left px-6 py-3 font-semibold text-slate-900 text-sm">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 font-semibold text-slate-900 text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvestigations.map(investigation => (
                    <tr
                      key={investigation.id}
                      className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-sm font-semibold text-slate-900">
                        {investigation.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(investigation.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                        {investigation.caseInfo.description || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {investigation.results
                          ? `${investigation.results.location.city}, ${investigation.results.location.state}`
                          : '—'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {investigation.results ? (
                          <ConfidenceBadge confidence={investigation.results.confidence} variant="compact" />
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={investigation.status} variant="compact" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/investigations/${investigation.id}`}
                            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                          >
                            <ExternalLink size={16} />
                          </Link>
                          <button
                            className="text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete investigation"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
