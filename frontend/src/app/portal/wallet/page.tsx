'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { COMMISSION_SLABS, PAYOUT_TIMELINE_DAYS, formatINR, type Lead } from '@/types'
import { Loader2, IndianRupee, TrendingUp, Clock, CheckCircle2 } from 'lucide-react'

export default function PortalWalletPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: partner } = await supabase
        .from('partners')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (partner?.id) {
        const { data: leadData } = await supabase
          .from('leads')
          .select('*')
          .eq('partner_id', partner.id)
        setLeads(leadData ?? [])
      }

      setIsLoading(false)
    }
    load()
  }, [])

  const closedWon = leads.filter(l => l.status === 'closed_won')
  const totalCommission = closedWon.reduce((sum, l) => {
    const rate = COMMISSION_SLABS.find(s => s.course_type === l.course_type)?.rate ?? 10
    return sum + 10000 * rate / 100
  }, 0)
  const pendingCommission = leads
    .filter(l => l.status !== 'closed_won' && l.status !== 'closed_lost')
    .reduce((sum, l) => {
      const rate = COMMISSION_SLABS.find(s => s.course_type === l.course_type)?.rate ?? 10
      return sum + 10000 * rate / 100
    }, 0)

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">My Wallet</h1>
        <p className="text-slate-500">Your commission earnings and payout summary.</p>
      </header>

      {/* Summary cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl shadow-lg">
          <div className="flex items-center gap-2 mb-4 opacity-80">
            <IndianRupee size={18} />
            <span className="text-sm font-semibold uppercase tracking-wider">Total Earned</span>
          </div>
          <p className="text-3xl font-bold">{formatINR(totalCommission)}</p>
          <p className="text-sm opacity-70 mt-1">{closedWon.length} deals closed</p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-amber-600">
            <TrendingUp size={18} />
            <span className="text-sm font-semibold uppercase tracking-wider">Potential</span>
          </div>
          <p className="text-3xl font-bold text-amber-600">{formatINR(pendingCommission)}</p>
          <p className="text-sm text-slate-400 mt-1">From active pipeline</p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-purple-600">
            <Clock size={18} />
            <span className="text-sm font-semibold uppercase tracking-wider">Payout Timeline</span>
          </div>
          <p className="text-3xl font-bold text-purple-600">{PAYOUT_TIMELINE_DAYS} days</p>
          <p className="text-sm text-slate-400 mt-1">From payout request</p>
        </div>
      </div>

      {/* Closed Won breakdown */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-slate-50 dark:bg-slate-800 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-green-600" />
          <h2 className="font-semibold">Closed Won — Commission Breakdown</h2>
        </div>
        {closedWon.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-400 italic">
            No closed deals yet. Keep working those leads!
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Lead</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Course</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Rate</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-700">
              {closedWon.map(lead => {
                const slab = COMMISSION_SLABS.find(s => s.course_type === lead.course_type)
                const commission = 10000 * (slab?.rate ?? 10) / 100
                return (
                  <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                    <td className="px-6 py-3 font-medium">{lead.first_name} {lead.last_name}</td>
                    <td className="px-6 py-3 text-slate-500">{slab?.label ?? '—'}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        (slab?.rate ?? 10) >= 15 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {slab?.rate ?? 10}%
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right font-semibold text-green-600">
                      {formatINR(commission)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot className="border-t bg-slate-50 dark:bg-slate-800">
              <tr>
                <td colSpan={3} className="px-6 py-3 font-semibold text-slate-700 dark:text-slate-300">Total</td>
                <td className="px-6 py-3 text-right font-bold text-green-700 dark:text-green-400">
                  {formatINR(totalCommission)}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </section>
    </div>
  )
}
