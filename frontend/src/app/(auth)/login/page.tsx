'use client'

import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Loader2, ArrowRight, TrendingUp, Users, IndianRupee } from 'lucide-react'

const highlights = [
  { icon: Users,        text: 'Manage your entire partner network' },
  { icon: TrendingUp,   text: 'Track leads through every pipeline stage' },
  { icon: IndianRupee,  text: 'Automatic commission calculations in INR' },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error

        const userId = data.user?.id
        if (userId) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single()

          const role = profile?.role ?? 'partner'
          router.push(role === 'admin' || role === 'leader' ? '/dashboard' : '/portal/dashboard')
        } else {
          router.push('/dashboard')
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/api/auth/callback`,
          }
        })
        if (error) throw error
        alert('Check your email for the confirmation link!')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg, #041B4D 0%, #0B2E6D 100%)' }}
      >
        {/* Logo */}
        <Image
          src="/logo-white.png"
          alt="SkillCircle"
          width={180}
          height={52}
          className="object-contain"
          priority
        />

        {/* Hero text */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Grow your network.<br />
              <span style={{ color: '#F4C400' }}>Track every rupee.</span>
            </h1>
            <p className="text-white/60 text-lg">
              The all-in-one CRM built for SkillCircle micro-partners to manage leads, commissions, and payouts.
            </p>
          </div>

          <ul className="space-y-4">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(244,196,0,0.15)' }}
                >
                  <Icon size={16} style={{ color: '#F4C400' }} />
                </div>
                <span className="text-white/80 text-sm">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p className="text-white/30 text-xs">© 2025 SkillCircle. All rights reserved.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden">
            <Image
              src="/logo-dark.png"
              alt="SkillCircle"
              width={160}
              height={46}
              className="object-contain"
              priority
            />
          </div>

          <div>
            <h2 className="text-3xl font-bold" style={{ color: '#041B4D' }}>
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-slate-500 mt-1 text-sm">
              {mode === 'login'
                ? 'Sign in to your CRM dashboard'
                : 'Join as a SkillCircle micro-partner'}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm outline-none transition-all focus:border-[#041B4D] focus:ring-2 focus:ring-[#041B4D]/10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm outline-none transition-all focus:border-[#041B4D] focus:ring-2 focus:ring-[#041B4D]/10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 group transition-all disabled:opacity-60 shadow-lg"
              style={{ background: '#F4C400', color: '#041B4D', boxShadow: '0 4px 20px rgba(244,196,0,0.35)' }}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-sm text-slate-500 hover:text-[#041B4D] transition-colors font-medium"
            >
              {mode === 'login'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
