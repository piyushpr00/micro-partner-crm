import { PerformanceChart } from '@/components/modules/analytics/PerformanceChart'
import { WalletCard } from '@/components/modules/analytics/WalletCard'
import { Leaderboard } from '@/components/modules/analytics/Leaderboard'

const mockLeaderboard = [
  { id: '1', name: 'John Doe', company: 'JD Consulting', conversions: 45, total_earned: 12500 },
  { id: '2', name: 'Sarah Smith', company: 'Smith Partners', conversions: 38, total_earned: 9800 },
  { id: '3', name: 'Mike Johnson', company: 'Johnson Group', conversions: 32, total_earned: 8200 },
  { id: '4', name: 'Emily Davis', company: 'Davis LLC', conversions: 28, total_earned: 7100 },
  { id: '5', name: 'Chris Wilson', company: 'Wilson & Co', conversions: 24, total_earned: 6300 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Partner Dashboard</h1>
        <p className="text-slate-500">Track your performance, manage earnings, and submit leads.</p>
      </header>

      <WalletCard 
        balance={4250.00} 
        totalEarned={15700.00} 
        payouts={[
          { amount: 500, status: 'completed', created_at: '2024-05-10T10:00:00Z' },
          { amount: 1200, status: 'pending', created_at: '2024-05-12T14:30:00Z' }
        ]} 
      />

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
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Lead Conversion</p>
              <h3 className="text-2xl font-bold text-blue-600">18.4%</h3>
              <p className="text-xs text-green-600 font-medium mt-1">↑ 2.1% from last month</p>
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
          <Leaderboard data={mockLeaderboard} />
        </div>
      </div>
    </div>
  )
}
