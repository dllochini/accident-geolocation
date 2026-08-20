'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAuth } from '@/contexts/AuthContext'
import { Bell, Palette, Lock, HelpCircle } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState({
    analysisComplete: true,
    lowConfidence: true,
    weeklyReport: false,
  })
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light')

  return (
    <AppLayout>
      <div className="page-container max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-1">Manage your preferences and account settings.</p>
        </div>

        {/* Profile Section */}
        <div className="card mb-8">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Profile</h2>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Full Name
              </label>
              <input
                type="text"
                defaultValue={user?.name || ''}
                className="input-base"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                defaultValue={user?.email || ''}
                className="input-base"
                disabled
              />
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button className="btn-secondary">Change Password</button>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="card mb-8">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Bell size={20} className="text-indigo-600" />
              <h2 className="text-xl font-semibold text-slate-900">Notifications</h2>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Analysis Complete</p>
                <p className="text-sm text-slate-600">Notify when image analysis completes</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.analysisComplete}
                onChange={(e) =>
                  setNotifications({ ...notifications, analysisComplete: e.target.checked })
                }
                className="rounded"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div>
                <p className="font-medium text-slate-900">Low Confidence Alerts</p>
                <p className="text-sm text-slate-600">Notify on results with low confidence scores</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.lowConfidence}
                onChange={(e) =>
                  setNotifications({ ...notifications, lowConfidence: e.target.checked })
                }
                className="rounded"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div>
                <p className="font-medium text-slate-900">Weekly Report</p>
                <p className="text-sm text-slate-600">Receive a weekly summary of investigations</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.weeklyReport}
                onChange={(e) =>
                  setNotifications({ ...notifications, weeklyReport: e.target.checked })
                }
                className="rounded"
              />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="card mb-8">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Palette size={20} className="text-indigo-600" />
              <h2 className="text-xl font-semibold text-slate-900">Appearance</h2>
            </div>
          </div>

          <div className="p-6">
            <label className="block text-sm font-medium text-slate-900 mb-3">
              Theme
            </label>
            <div className="space-y-2">
              {(['light', 'dark', 'auto'] as const).map((t) => (
                <label key={t} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="theme"
                    value={t}
                    checked={theme === t}
                    onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'auto')}
                    className="rounded"
                  />
                  <span className="text-sm text-slate-900 capitalize">{t}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* API & Integrations */}
        <div className="card mb-8">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Lock size={20} className="text-indigo-600" />
              <h2 className="text-xl font-semibold text-slate-900">API & Integrations</h2>
            </div>
          </div>

          <div className="p-6">
            <p className="text-sm text-slate-600 mb-4">
              Manage API keys and third-party integrations.
            </p>
            <button className="btn-secondary">Manage API Keys</button>
          </div>
        </div>

        {/* Help & Support */}
        <div className="card">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <HelpCircle size={20} className="text-indigo-600" />
              <h2 className="text-xl font-semibold text-slate-900">Help & Support</h2>
            </div>
          </div>

          <div className="p-6 space-y-3">
            <p className="text-sm text-slate-600">
              <strong>Version:</strong> 0.1.0
            </p>
            <p className="text-sm text-slate-600">
              <strong>API Endpoint:</strong> /api/v1
            </p>
            <div className="pt-4 space-x-3">
              <a href="#" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                Documentation
              </a>
              <a href="#" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                Report Issue
              </a>
              <a href="#" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                Contact Support
              </a>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button className="btn-primary">Save Changes</button>
        </div>
      </div>
    </AppLayout>
  )
}
