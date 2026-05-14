'use client'

import { Settings, Percent, Clock, IndianRupee, Server } from 'lucide-react'
import { COMMISSION_SLABS, PAYOUT_TIMELINE_DAYS } from '@/types'

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-3xl space-y-8">
      <div className="flex items-center gap-3">
        <Settings size={28} className="text-slate-600 dark:text-slate-400" />
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-slate-500">Platform configuration for SkillCircle CRM</p>
        </div>
      </div>

      {/* Commission Slabs */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b bg-slate-50 dark:bg-slate-800 flex items-center gap-2">
          <Percent size={18} className="text-blue-600" />
          <h2 className="font-semibold">Commission Slabs</h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-500 mb-4">
            Commission is calculated based on the course type selected when a lead is added. Payout is triggered when a lead moves to <span className="font-semibold text-slate-700 dark:text-slate-300">Closed Won</span>.
          </p>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Course</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Commission Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Earn per ₹10,000</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-700">
                {COMMISSION_SLABS.map((slab) => (
                  <tr key={slab.course_type} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{slab.label}</td>
                    <td className="px-4 py-3 text-slate-500">{slab.duration_months} months</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        slab.rate >= 15
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {slab.rate}%
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                      ₹{(10000 * slab.rate / 100).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            * Diploma courses carry a higher slab (15%) to incentivise long-duration enrollments.
          </p>
        </div>
      </section>

      {/* Payout & Currency */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b bg-slate-50 dark:bg-slate-800 flex items-center gap-2">
          <Clock size={18} className="text-purple-600" />
          <h2 className="font-semibold">Payout & Currency</h2>
        </div>
        <div className="divide-y dark:divide-slate-700">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-slate-400" />
              <div>
                <p className="text-sm font-medium">Payout Timeline</p>
                <p className="text-xs text-slate-500">Days from payout request to transfer</p>
              </div>
            </div>
            <span className="text-lg font-bold text-purple-600">{PAYOUT_TIMELINE_DAYS} days</span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IndianRupee size={16} className="text-slate-400" />
              <div>
                <p className="text-sm font-medium">Currency</p>
                <p className="text-xs text-slate-500">All amounts displayed and paid in</p>
              </div>
            </div>
            <span className="text-lg font-bold text-green-600">INR (₹)</span>
          </div>
        </div>
      </section>

      {/* Environment */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b bg-slate-50 dark:bg-slate-800 flex items-center gap-2">
          <Server size={18} className="text-slate-500" />
          <h2 className="font-semibold">Environment</h2>
        </div>
        <div className="divide-y dark:divide-slate-700 text-sm">
          <div className="px-6 py-3 flex justify-between">
            <span className="text-slate-500">Supabase URL</span>
            <span className="font-mono text-slate-700 dark:text-slate-300 truncate max-w-xs">
              {process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'Not set'}
            </span>
          </div>
          <div className="px-6 py-3 flex justify-between">
            <span className="text-slate-500">API URL</span>
            <span className="font-mono text-slate-700 dark:text-slate-300">
              {process.env.NEXT_PUBLIC_API_URL ?? 'Not set'}
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
