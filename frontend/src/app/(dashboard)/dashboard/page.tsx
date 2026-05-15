'use client'

import { useState, useEffect } from 'react'
import { PerformanceChart } from '@/components/modules/analytics/PerformanceChart'
import { WalletCard } from '@/components/modules/analytics/WalletCard'
import { Leaderboard } from '@/components/modules/analytics/Leaderboard'
import { WalletService, AnalyticsService } from '@/services/partnerService'
import { Loader2, Users, IndianRupee, Clock, TrendingUp } from 'lucide-react'
import { formatINR, PAYOUT_TIMELINE_DAYS } from '@/types'

const kpiStyle = [
  { bg: '#041B4D', text: '#F4C400', sub: 'rgba(255,255,255,0.5)' },
  { bg: '#0B2E6D', text: '#FFCC00', sub: 'rgba(255,255,255,0.5)' },
  { bg: '#F4C400', text: '#041B4D', sub: 'rgba(4,27,77,0.5)' },
]

export default function DashboardPage() {
  const [wallet, setWallet] = useState<any>(null)
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        const [lbData, statsData] = await Promise.all([
          WalletService.getLeaderboard(),
          AnalyticsService.getGlobalStats()
        ])
        setLeaderboard(lbData)
        setAnalytics(statsData)
        setWallet({
          balance: 425000,
          total_earned: 1570000,
          payouts: [
            { amount: 50000, status: 'completed', created_at: new Date().toISOString() },
            { amount: 120000, status: 'pending', created_at: new Date().toISOString() }
          ]
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} style={{ color: '#F4C400' }} />
      </div>
    )
  }

  const kpis = [
    { label: 'Total Leads', value: analytics?.total_leads ?? 0, sub: 'Global activity', icon: Users },
    { label: 'Avg. Deal Value', value: formatINR(10000), sub: 'Per closed deal', icon: IndianRupee },
    { label: 'Payout Timeline', value: `${PAYOUT_TIMELINE_DAYS}d`, sub: 'From request date', icon: Clock },
  ]

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#041B4D' }}>
            Partner Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Track performance, manage earnings, and submit leads.</p>
        </div>
        <div
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
          style={{ background: '#F4C400', color: '#041B4D' }}
        >
          <TrendingUp size={16} />
          Live Data
        </div>
      </header>

      {wallet && (
        <WalletCard
          balance={wallet.balance}
          totalEarned={wallet.total_earned}
          payouts={wallet.payouts}
        />
      )}

      {/* KPI cards */}
      <div className="grid gap-5 md:grid-cols-3">
        {kpis.map((kpi, i) => {
          const s = kpiStyle[i]!
          return (
            <div
              key={kpi.label}
              className="p-6 rounded-2xl shadow-lg"
              style={{ background: s.bg }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: s.sub }}>
                  {kpi.label}
                </p>
                <kpi.icon size={18} style={{ color: s.text, opacity: 0.8 }} />
              </div>
              <p className="text-3xl font-bold" style={{ color: s.text }}>{kpi.value}</p>
              <p className="text-xs mt-1" style={{ color: s.sub }}>{kpi.sub}</p>
            </div>
          )
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-[420px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold" style={{ color: '#041B4D' }}>Conversion Performance</h3>
              <select
                className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-[#041B4D]"
                style={{ color: '#041B4D' }}
              >
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
            <PerformanceChart />
          </div>
        </div>

        <div className="lg:col-span-1">
          <Leaderboard data={leaderboard} />
        </div>
      </div>
    </div>
  )
}
