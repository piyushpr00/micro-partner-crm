'use client'

import { Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Settings size={28} className="text-slate-600 dark:text-slate-400" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold mb-1">Environment</h2>
          <p className="text-sm text-slate-500 mb-4">Connection details for this deployment.</p>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Supabase URL</span>
              <span className="font-mono text-slate-700 dark:text-slate-300 truncate max-w-xs">
                {process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'Not set'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">API URL</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {process.env.NEXT_PUBLIC_API_URL ?? 'Not set'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold mb-1">About</h2>
          <p className="text-sm text-slate-500">SkillCircle Micro-Partner CRM — built with Next.js, Express, and Supabase.</p>
        </div>
      </div>
    </div>
  )
}
