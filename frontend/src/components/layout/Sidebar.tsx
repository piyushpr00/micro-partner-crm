'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Settings,
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
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Partners',  href: '/partners',  icon: Users },
  { label: 'Leads',     href: '/leads',     icon: UserPlus },
  { label: 'Settings',  href: '/settings',  icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside
      style={{ background: 'linear-gradient(180deg, #041B4D 0%, #0B2E6D 100%)' }}
      className={cn(
        'h-screen text-white transition-all duration-300 flex flex-col shadow-2xl',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="px-5 py-5 flex items-center justify-between border-b border-white/10">
        {!isCollapsed && (
          <Image
            src="/logo-white.png"
            alt="SkillCircle"
            width={140}
            height={40}
            className="object-contain"
            priority
          />
        )}
        {isCollapsed && (
          <Image
            src="/logo-white.png"
            alt="SkillCircle"
            width={32}
            height={32}
            className="object-contain"
            priority
          />
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg transition-colors hover:bg-white/10 ml-auto"
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {!isCollapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 px-3 mb-3">
            Navigation
          </p>
        )}
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative',
                isActive
                  ? 'shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
              style={isActive ? { background: '#F4C400', color: '#041B4D' } : {}}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                  style={{ background: '#041B4D', opacity: 0.3 }}
                />
              )}
              <item.icon size={20} className={cn('flex-shrink-0', isActive ? '' : 'group-hover:text-white')} />
              {!isCollapsed && (
                <span className={cn('font-semibold text-sm', isActive ? 'text-[#041B4D]' : '')}>
                  {item.label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/50 hover:text-red-300 hover:bg-red-500/10 transition-all w-full',
            isCollapsed ? 'justify-center' : ''
          )}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!isCollapsed && <span className="font-semibold text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
