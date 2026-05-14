'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { COMMISSION_SLABS, PAYOUT_TIMELINE_DAYS, formatINR, type Lead } from '@/types'
import { Loader2, TrendingUp, Users, IndianRupee, Clock } from 'lucide-react'

export default function PartnerDashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [partnerName, setPartnerName] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Look up partner record by user_id
      const { data: partner } = await supabase
        .from('partners')
        .select('id, name')
        .eq('user_id', user.id)
        .single()

      if (partner) {
        setPartnerName(partner.name)
        const { data: leadData } = await supabase
          .from('leads')
          .select('*')
          .eq('partner_id', partner.id)
          .order('created_at', { ascending: false })
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
  const activeLeads = leads.filter(l => l.status !== 'closed_won' && l.status !== 'closed_lost')

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
        <h1 className="text-3xl font-bold tracking-tight">
          {partnerName ? `Welcome, ${partnerName}` : 'My Dashboard'}
        </h1>
        <p className="text-slate-500 mt-1">Your leads, commissions, and performance at a glance.</p>
      </header>

      {/* KPI cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users size={18} className="text-blue-600" />
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Leads</p>
          </div>
          <h3 className="text-3xl font-bold text-blue-600">{leads.length}</h3>
          <p className="text-xs text-slate-400 mt-1">All time</p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp size={18} className="text-green-600" />
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Leads</p>
          </div>
          <h3 className="text-3xl font-bold text-green-600">{activeLeads.length}</h3>
          <p className="text-xs text-slate-400 mt-1">In pipeline</p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <IndianRupee size={18} className="text-indigo-600" />
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Est. Commission</p>
          </div>
          <h3 className="text-2xl font-bold text-indigo-600">{formatINR(totalCommission)}</h3>
          <p className="text-xs text-slate-400 mt-1">{closedWon.length} deals closed</p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Clock size={18} className="text-purple-600" />
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Payout In</p>
          </div>
          <h3 className="text-3xl font-bold text-purple-600">{PAYOUT_TIMELINE_DAYS}d</h3>
          <p className="text-xs text-slate-400 mt-1">From request</p>
        </div>
      </div>

      {/* Recent leads */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-slate-50 dark:bg-slate-800">
          <h2 className="font-semibold">Recent Leads</h2>
        </div>
        {leads.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-400 italic">
            No leads yet. Go to My Leads to add your first one.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Course</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-700">
              {leads.slice(0, 5).map(lead => {
                const slab = COMMISSION_SLABS.find(s => s.course_type === lead.course_type)
                return (
                  <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                    <td className="px-6 py-3 font-medium">{lead.first_name} {lead.last_name}</td>
                    <td className="px-6 py-3 text-slate-500">{slab?.label ?? '—'}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        lead.status === 'closed_won'  ? 'bg-green-100 text-green-800' :
                        lead.status === 'closed_lost' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-600 dark:text-slate-300">
                      {slab ? `${slab.rate}% · ${formatINR(10000 * slab.rate / 100)}/₹10k` : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
