'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  UserPlus,
  Wallet,
  LogOut,
  ChevronLeft,
  Menu,
} from 'lucide-react'
import { useState } from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { createClient } from '@/lib/supabase/client'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const navItems = [
  { label: 'Dashboard', href: '/portal/dashboard', icon: LayoutDashboard },
  { label: 'My Leads', href: '/portal/leads', icon: UserPlus },
  { label: 'My Wallet', href: '/portal/wallet', icon: Wallet },
]

export function PartnerSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className={cn(
      'h-screen bg-slate-900 text-white transition-all duration-300 flex flex-col',
      isCollapsed ? 'w-20' : 'w-64'
    )}>
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <div>
            <span className="text-xl font-bold tracking-tight">SkillCircle</span>
            <p className="text-xs text-blue-400 font-medium mt-0.5">Partner Portal</p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-4 p-3 rounded-lg transition-colors group',
                isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )}
            >
              <item.icon size={22} className={cn(isActive ? 'text-white' : 'group-hover:text-white')} />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-4 p-3 rounded-lg text-slate-400 hover:bg-red-900/20 hover:text-red-400 transition-colors w-full',
            isCollapsed ? 'justify-center' : ''
          )}
        >
          <LogOut size={22} />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
