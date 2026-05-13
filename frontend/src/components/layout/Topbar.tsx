'use client'

import { Search, Bell, User } from 'lucide-react'

export function Topbar() {
  return (
    <header className="h-16 border-b bg-white dark:bg-slate-900 flex items-center justify-between px-8">
      <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-1.5 w-96">
        <Search size={18} className="text-slate-400" />
        <input 
          type="text" 
          placeholder="Search partners, leads..." 
          className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full outline-none"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">Admin User</p>
            <p className="text-xs text-slate-400 capitalize">Administrator</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  )
}
