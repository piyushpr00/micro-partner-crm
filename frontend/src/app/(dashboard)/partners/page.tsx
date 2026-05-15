'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PartnerTable } from '@/components/modules/partners/PartnerTable'
import { PartnerForm } from '@/components/modules/partners/PartnerForm'
import { Partner } from '@/types'
import { Plus, Download, Filter, Loader2 } from 'lucide-react'

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const fetchPartners = useCallback(async () => {
    const supabase = createClient()
    setIsLoading(true)
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setSubmitError(`Fetch error: ${error.code} — ${error.message}`)
    else setPartners(data ?? [])
    setIsLoading(false)
  }, [])

  useEffect(() => { fetchPartners() }, [fetchPartners])

  const handleAddPartner = async (data: any) => {
    setIsSubmitting(true)
    setSubmitError(null)
    const supabase = createClient()
    const { error } = await supabase.from('partners').insert([data])
    if (error) {
      setSubmitError(error.message)
    } else {
      setShowForm(false)
      await fetchPartners()
    }
    setIsSubmitting(false)
  }

  const filtered = partners.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.company_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.region || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {showForm && (
        <PartnerForm
          onSubmit={handleAddPartner}
          onCancel={() => { setShowForm(false); setSubmitError(null) }}
          isSubmitting={isSubmitting}
        />
      )}

      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#041B4D' }}>Partner Directory</h1>
          <p className="text-slate-500">Manage and track your SkillCircle micro partners.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Download size={18} className="mr-2" />
            Export
          </button>
          <button
            onClick={() => { setSubmitError(null); setShowForm(true) }}
            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
            style={{ background: '#F4C400', color: '#041B4D' }}
          >
            <Plus size={18} className="mr-2" />
            Add Partner
          </button>
        </div>
      </header>

      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          Error saving partner: {submitError}
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, company, region..."
            className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-900 dark:border-slate-800"
          />
        </div>
        <button className="inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <Filter size={18} className="mr-2" />
          Filters
        </button>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin" size={32} style={{ color: '#F4C400' }} />
        </div>
      ) : (
        <PartnerTable partners={filtered} onRefresh={fetchPartners} />
      )}
    </div>
  )
}
