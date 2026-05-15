'use client'

import { Search, Bell, User } from 'lucide-react'

export function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
      {/* Search */}
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 w-80 focus-within:border-[#041B4D] focus-within:ring-2 focus-within:ring-[#041B4D]/10 transition-all">
        <Search size={16} className="text-slate-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search partners, leads..."
          className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none text-slate-700 placeholder:text-slate-400"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors">
          <Bell size={20} className="text-slate-500" />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white"
            style={{ background: '#F4C400' }}
          />
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-200" />

        {/* User */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">Admin User</p>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm group-hover:scale-105 transition-transform"
            style={{ background: '#041B4D', color: '#F4C400' }}
          >
            <User size={18} />
          </div>
        </div>
      </div>
    </header>
  )
}
