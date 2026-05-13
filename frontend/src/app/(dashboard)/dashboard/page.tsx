'use client'

import { useState, useEffect } from 'react'
import { PerformanceChart } from '@/components/modules/analytics/PerformanceChart'
import { WalletCard } from '@/components/modules/analytics/WalletCard'
import { Leaderboard } from '@/components/modules/analytics/Leaderboard'
import { WalletService, AnalyticsService } from '@/services/partnerService'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const [wallet, setWallet] = useState<any>(null)
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        // For prototype, we'll fetch leaderboard and global stats
        // In a real app, you'd fetch the specific partner's wallet based on their auth session
        const [lbData, statsData] = await Promise.all([
          WalletService.getLeaderboard(),
          AnalyticsService.getGlobalStats()
        ])
        setLeaderboard(lbData)
        setAnalytics(statsData)
        
        // Mock wallet for now since we need a partner ID
        setWallet({
          balance: 4250.00,
          total_earned: 15700.00,
          payouts: [
            { amount: 500, status: 'completed', created_at: new Date().toISOString() },
            { amount: 1200, status: 'pending', created_at: new Date().toISOString() }
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
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Partner Dashboard</h1>
        <p className="text-slate-500">Track your performance, manage earnings, and submit leads.</p>
      </header>

      {wallet && (
        <WalletCard 
          balance={wallet.balance} 
          totalEarned={wallet.total_earned} 
          payouts={wallet.payouts} 
        />
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border shadow-sm p-8 flex flex-col h-[450px]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold">Conversion Performance</h3>
              <select className="text-sm border-none bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-1.5 focus:ring-0 outline-none">
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
            <PerformanceChart />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Leads</p>
              <h3 className="text-2xl font-bold text-blue-600">{analytics?.total_leads || 0}</h3>
              <p className="text-xs text-green-600 font-medium mt-1">Global activity</p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Avg. Deal Value</p>
              <h3 className="text-2xl font-bold text-indigo-600">$1,250</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Stable vs last month</p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Payout Frequency</p>
              <h3 className="text-2xl font-bold text-purple-600">14 Days</h3>
              <p className="text-xs text-blue-600 font-medium mt-1">Faster than average</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Leaderboard data={leaderboard} />
        </div>
      </div>
    </div>
  )
}
