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
        <Loader2 className="animate-spin" size={32} style={{ color: '#F4C400' }} />
      </div>
    )
  }

  const kpis = [
    {
      label: 'Total Leads', value: leads.length, sub: 'All time',
      icon: Users, bg: '#041B4D', text: '#F4C400', subColor: 'rgba(255,255,255,0.5)',
    },
    {
      label: 'Active Pipeline', value: activeLeads.length, sub: 'In progress',
      icon: TrendingUp, bg: '#0B2E6D', text: '#FFCC00', subColor: 'rgba(255,255,255,0.5)',
    },
    {
      label: 'Est. Commission', value: formatINR(totalCommission), sub: `${closedWon.length} deals closed`,
      icon: IndianRupee, bg: '#F4C400', text: '#041B4D', subColor: 'rgba(4,27,77,0.5)',
    },
    {
      label: 'Payout In', value: `${PAYOUT_TIMELINE_DAYS}d`, sub: 'From request',
      icon: Clock, bg: 'white', text: '#041B4D', subColor: '#94a3b8', border: true,
    },
  ]

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#041B4D' }}>
          {partnerName ? `Welcome, ${partnerName} 👋` : 'My Dashboard'}
        </h1>
        <p className="text-slate-500 mt-1">Your leads, commissions, and performance at a glance.</p>
      </header>

      {/* KPI cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map(kpi => (
          <div
            key={kpi.label}
            className="p-6 rounded-2xl shadow-sm"
            style={{
              background: kpi.bg,
              border: kpi.border ? '1px solid #e2e8f0' : 'none',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <p
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: kpi.subColor }}
              >
                {kpi.label}
              </p>
              <kpi.icon size={18} style={{ color: kpi.text, opacity: 0.7 }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: kpi.text }}>{kpi.value}</p>
            <p className="text-xs mt-1" style={{ color: kpi.subColor }}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent leads */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: '#e2e8f0' }}
        >
          <h2 className="font-bold text-base" style={{ color: '#041B4D' }}>Recent Leads</h2>
          {leads.length > 0 && (
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: '#F4C400', color: '#041B4D' }}
            >
              {leads.length} total
            </span>
          )}
        </div>

        {leads.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
              style={{ background: '#F4C400' }}
            >
              <Users size={22} style={{ color: '#041B4D' }} />
            </div>
            <p className="font-semibold text-slate-700">No leads yet</p>
            <p className="text-sm text-slate-400 mt-1">Go to My Leads to add your first one.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#F8FAFF' }}>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Course</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Commission</th>
              </tr>
            </thead>
            <tbody>
              {leads.slice(0, 5).map((lead, i) => {
                const slab = COMMISSION_SLABS.find(s => s.course_type === lead.course_type)
                return (
                  <tr
                    key={lead.id}
                    className="border-t transition-colors hover:bg-slate-50"
                    style={{ borderColor: '#f1f5f9' }}
                  >
                    <td className="px-6 py-3.5 font-semibold text-slate-800">
                      {lead.first_name} {lead.last_name}
                    </td>
                    <td className="px-6 py-3.5 text-slate-500 text-xs">{slab?.label ?? '—'}</td>
                    <td className="px-6 py-3.5">
                      <span
                        className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize"
                        style={
                          lead.status === 'closed_won'
                            ? { background: '#dcfce7', color: '#166534' }
                            : lead.status === 'closed_lost'
                            ? { background: '#fee2e2', color: '#991b1b' }
                            : { background: 'rgba(244,196,0,0.15)', color: '#041B4D' }
                        }
                      >
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-xs" style={{ color: '#041B4D' }}>
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
