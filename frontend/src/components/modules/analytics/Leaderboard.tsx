'use client'

import { Trophy, Medal, Award } from 'lucide-react'
import { formatINR } from '@/types'

interface LeaderboardProps {
  data: any[]
}

export function Leaderboard({ data }: LeaderboardProps) {
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="text-yellow-500" size={20} />
      case 1: return <Medal className="text-slate-400" size={20} />
      case 2: return <Medal className="text-amber-600" size={20} />
      default: return <span className="text-slate-400 font-bold w-5 text-center">{index + 1}</span>
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border shadow-sm overflow-hidden">
      <div className="p-6 border-b bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Award className="text-blue-600" />
          Partner Leaderboard
        </h3>
        <span className="text-xs font-semibold text-slate-500 uppercase">Top 10 Performers</span>
      </div>
      <div className="divide-y dark:divide-slate-800">
        {data.map((partner, idx) => (
          <div key={partner.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <div className="flex items-center gap-4">
              <div className="flex justify-center w-8">
                {getRankIcon(idx)}
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-blue-600">
                {partner.name[0]}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{partner.name}</p>
                <p className="text-xs text-slate-500">{partner.company || 'Individual Partner'}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-blue-600">{partner.conversions} Deals</p>
              <p className="text-xs text-slate-500">{formatINR(partner.total_earned)} earned</p>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="p-12 text-center text-slate-400 italic text-sm">
            No rankings available yet.
          </div>
        )}
      </div>
    </div>
  )
}
