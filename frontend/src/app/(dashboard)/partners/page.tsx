'use client'

import { useState, useEffect } from 'react'
import { PartnerTable } from '@/components/modules/partners/PartnerTable'
import { PartnerService } from '@/services/partnerService'
import { Partner } from '@/types'
import { Plus, Download, Filter, Loader2 } from 'lucide-react'

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  useEffect(() => {
    fetchPartners()
  }, [])

  return (
    <div className="space-y-6">
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
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            <Plus size={18} className="mr-2" />
            Add Partner
          </button>
        </div>
      </header>

      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-sm">
          <input 
            type="text" 
            placeholder="Search partners..." 
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
        <PartnerTable partners={partners} />
      )}
    </div>
  )
}
