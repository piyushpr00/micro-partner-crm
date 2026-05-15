'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { LeadTable } from '@/components/modules/leads/LeadTable'
import { LeadForm } from '@/components/modules/leads/LeadForm'
import { ImportModal } from '@/components/modules/leads/ImportModal'
import { Lead } from '@/types'
import { Plus, Filter, Loader2, Upload } from 'lucide-react'

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const fetchLeads = useCallback(async () => {
    const supabase = createClient()
    setIsLoading(true)
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setLeads(data ?? [])
    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  useEffect(() => {
    let result = leads
    if (statusFilter !== 'all') result = result.filter(l => l.status === statusFilter)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(l =>
        `${l.first_name} ${l.last_name}`.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q)
      )
    }
    setFilteredLeads(result)
  }, [statusFilter, searchQuery, leads])

  const handleCreateLead = async (data: any) => {
    setIsSubmitting(true)
    setSubmitError(null)
    const supabase = createClient()
    const { error } = await supabase.from('leads').insert([data])
    if (error) {
      setSubmitError(error.message)
    } else {
      await fetchLeads()
      setIsFormOpen(false)
    }
    setIsSubmitting(false)
  }

  const handleUpdateLead = async (data: any) => {
    if (!editingLead) return
    setIsSubmitting(true)
    setSubmitError(null)
    const supabase = createClient()
    const { error } = await supabase.from('leads').update(data).eq('id', editingLead.id)
    if (error) {
      setSubmitError(error.message)
    } else {
      await fetchLeads()
      setIsFormOpen(false)
      setEditingLead(undefined)
    }
    setIsSubmitting(false)
  }

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return
    const supabase = createClient()
    const { error } = await supabase.from('leads').delete().eq('id', id)
    if (!error) fetchLeads()
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#041B4D' }}>Lead Management</h1>
          <p className="text-slate-500">Track and convert potential leads into successful partners.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsImportOpen(true)}
            className="inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Upload size={18} className="mr-2" />
            Import
          </button>
          <button
            onClick={() => { setEditingLead(undefined); setSubmitError(null); setIsFormOpen(true) }}
            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
            style={{ background: '#F4C400', color: '#041B4D' }}
          >
            <Plus size={18} className="mr-2" />
            New Lead
          </button>
        </div>
      </header>

      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          Error saving lead: {submitError}
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-900 dark:border-slate-800"
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-900 dark:border-slate-800"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="closed_won">Closed Won</option>
            <option value="closed_lost">Closed Lost</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin" size={32} style={{ color: '#F4C400' }} />
        </div>
      ) : (
        <LeadTable
          leads={filteredLeads}
          onEdit={lead => { setEditingLead(lead); setSubmitError(null); setIsFormOpen(true) }}
          onDelete={handleDeleteLead}
        />
      )}

      {isFormOpen && (
        <LeadForm
          initialData={editingLead}
          onSubmit={editingLead ? handleUpdateLead : handleCreateLead}
          onCancel={() => { setIsFormOpen(false); setEditingLead(undefined) }}
          isSubmitting={isSubmitting}
        />
      )}

      {isImportOpen && (
        <ImportModal
          onClose={() => setIsImportOpen(false)}
          onSuccess={() => { fetchLeads(); setIsImportOpen(false) }}
        />
      )}
    </div>
  )
}
