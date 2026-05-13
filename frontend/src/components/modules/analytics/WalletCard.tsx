'use client'

import { Wallet, ArrowUpRight, Clock, CheckCircle2 } from 'lucide-react'

interface WalletCardProps {
  balance: number
  totalEarned: number
  payouts: any[]
}

export function WalletCard({ balance, totalEarned, payouts }: WalletCardProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
              <Wallet size={24} />
            </div>
            <button className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors">
              Withdraw
            </button>
          </div>
          <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">Available Balance</p>
          <h2 className="text-4xl font-bold mt-1">${balance.toLocaleString()}</h2>
          <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs font-medium uppercase">Total Earnings</p>
              <p className="text-xl font-bold">${totalEarned.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-xs font-medium uppercase">Active Payouts</p>
              <p className="text-xl font-bold">{payouts.filter(p => p.status === 'pending').length}</p>
            </div>
          </div>
        </div>
        {/* Background Decorative Circles */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border shadow-sm flex flex-col">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="font-bold text-lg">Recent Transactions</h3>
          <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
        </div>
        <div className="flex-1 overflow-y-auto divide-y dark:divide-slate-800">
          {payouts.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm italic py-12">
              No transactions yet.
            </div>
          ) : (
            payouts.map((payout, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    payout.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {payout.status === 'completed' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Payout Request</p>
                    <p className="text-xs text-slate-500">{new Date(payout.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="font-bold text-slate-900 dark:text-white">-${payout.amount}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
