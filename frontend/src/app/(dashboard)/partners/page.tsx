'use client'

import { useState, useEffect } from 'react'
import { PartnerTable } from '@/components/modules/partners/PartnerTable'
import { PartnerForm } from '@/components/modules/partners/PartnerForm'
import { PartnerService } from '@/services/partnerService'
import { Partner } from '@/types'
import { Plus, Download, Filter, Loader2 } from 'lucide-react'

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [search, setSearch] = useState('')

  const fetchPartners = async () => {
    try {
      setIsLoading(true)
      const data = await PartnerService.getAllPartners()
      setPartners(data)
    } catch (error) {
      console.error('Error fetching partners:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchPartners() }, [])

  const handleAddPartner = async (data: any) => {
    try {
      setIsSubmitting(true)
      await PartnerService.createPartner(data)
      setShowForm(false)
      await fetchPartners()
    } catch (error) {
      console.error('Error creating partner:', error)
    } finally {
      setIsSubmitting(false)
    }
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
          onCancel={() => setShowForm(false)}
          isSubmitting={isSubmitting}
        />
      )}

      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partner Directory</h1>
          <p className="text-slate-500">Manage and track your SkillCircle micro partners.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Download size={18} className="mr-2" />
            Export
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
            style={{ background: '#F4C400', color: '#041B4D' }}
          >
            <Plus size={18} className="mr-2" />
            Add Partner
          </button>
        </div>
      </header>

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
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : (
        <PartnerTable partners={filtered} onRefresh={fetchPartners} />
      )}
    </div>
  )
}
