'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AppLayout } from '@/components/layout/AppLayout'
import { Investigation, InvestigationStatus } from '@/types'
import { apiClient } from '@/lib/api/client'
import { StatusBadge, ConfidenceBadge } from '@/components/common/StatusBadge'
import { Plus, ExternalLink } from 'lucide-react'

function StatCard({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: 'slate' | 'emerald' | 'blue' | 'amber'
}) {
  const colorMap = {
    slate: 'bg-slate-50 text-slate-900 border-slate-200',
    emerald: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    blue: 'bg-blue-50 text-blue-900 border-blue-200',
    amber: 'bg-amber-50 text-amber-900 border-amber-200',
  }

  return (
    <div className={`card border-2 p-6 ${colorMap[color]}`}>
      <p className="text-sm font-medium opacity-75 mb-2">{label}</p>
      <p className="text-4xl font-bold">{value}</p>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [investigations, setInvestigations] = useState<Investigation[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  // Calculate stats
  const stats = {
    total: investigations.length,
    completed: investigations.filter(i => i.status === 'completed').length,
    processing: investigations.filter(
      i => ['analyzing', 'searching', 'ranking', 'verifying'].includes(i.status)
    ).length,
    needsReview: investigations.filter(
      i => i.status === 'completed' && i.results && i.results.confidence < 0.6
    ).length,
  }

  const recentInvestigations = investigations.slice(0, 10)

  return (
    <AppLayout>
      <div className="page-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">
              Monitor and review accident location investigations.
            </p>
          </div>
          <Link
            href="/investigations/new"
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            New Investigation
          </Link>
        </div>

        {/* Stats */}
        <div className="grid-auto-fit mb-8">
          <StatCard label="Total Investigations" value={stats.total} color="slate" />
          <StatCard label="Completed" value={stats.completed} color="emerald" />
          <StatCard label="Processing" value={stats.processing} color="blue" />
          <StatCard label="Needs Review" value={stats.needsReview} color="amber" />
        </div>

        {/* Recent Investigations */}
        <div className="card">
          <div className="p-6 border-b border-slate-200">
            <h2 className="section-title mb-0">Recent Investigations</h2>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 bg-slate-200 rounded-lg animate-pulse mx-auto mb-4" />
              <p className="text-slate-600">Loading investigations...</p>
            </div>
          ) : recentInvestigations.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-600 mb-4">No investigations yet.</p>
              <Link href="/investigations/new" className="btn-primary">
                Create Your First Investigation
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left px-6 py-3 font-semibold text-slate-900 text-sm">
                      Case ID
                    </th>
                    <th className="text-left px-6 py-3 font-semibold text-slate-900 text-sm">
                      Created
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
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvestigations.map(investigation => (
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
                        <Link
                          href={`/investigations/${investigation.id}`}
                          className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1"
                        >
                          View
                          <ExternalLink size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* View All Link */}
        {investigations.length > 10 && (
          <div className="text-center mt-6">
            <Link href="/investigations" className="btn-ghost">
              View All Investigations
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
