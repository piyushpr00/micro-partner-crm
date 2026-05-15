'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { LeadTable } from '@/components/modules/leads/LeadTable'
import { LeadForm } from '@/components/modules/leads/LeadForm'
import { Lead } from '@/types'
import { Plus, Loader2 } from 'lucide-react'

export default function PortalLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [partnerId, setPartnerId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const fetchLeads = useCallback(async (pid: string) => {
    const supabase = createClient()
    setIsLoading(true)
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('partner_id', pid)
      .order('created_at', { ascending: false })
    if (!error) setLeads(data ?? [])
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: partner } = await supabase
        .from('partners')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (partner?.id) {
        setPartnerId(partner.id)
        fetchLeads(partner.id)
      } else {
        setIsLoading(false)
      }
    }
    init()
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

  const handleCreate = async (data: any) => {
    if (!partnerId) return
    setIsSubmitting(true)
    setSubmitError(null)
    const supabase = createClient()
    const { error } = await supabase
      .from('leads')
      .insert([{ ...data, partner_id: partnerId }])
    if (error) {
      setSubmitError(error.message)
    } else {
      await fetchLeads(partnerId)
      setIsFormOpen(false)
    }
    setIsSubmitting(false)
  }

  const handleUpdate = async (data: any) => {
    if (!editingLead || !partnerId) return
    setIsSubmitting(true)
    setSubmitError(null)
    const supabase = createClient()
    const { error } = await supabase
      .from('leads')
      .update(data)
      .eq('id', editingLead.id)
    if (error) {
      setSubmitError(error.message)
    } else {
      await fetchLeads(partnerId)
      setIsFormOpen(false)
      setEditingLead(undefined)
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lead?') || !partnerId) return
    const supabase = createClient()
    const { error } = await supabase.from('leads').delete().eq('id', id)
    if (!error) fetchLeads(partnerId)
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#041B4D' }}>My Leads</h1>
          <p className="text-slate-500">Manage leads you have submitted.</p>
        </div>
        <button
          onClick={() => { setEditingLead(undefined); setSubmitError(null); setIsFormOpen(true) }}
          disabled={!partnerId}
          className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50 transition-colors shadow-sm"
          style={{ background: '#F4C400', color: '#041B4D' }}
        >
          <Plus size={18} className="mr-2" />
          New Lead
        </button>
      </header>

      {!partnerId && !isLoading && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
          Your account is not linked to a partner record yet. Please contact an admin to set up your partner profile.
        </div>
      )}

      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          Error saving lead: {submitError}
        </div>
      )}

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-1 max-w-sm px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:border-[#041B4D]"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg text-sm outline-none focus:border-[#041B4D]"
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

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin" size={32} style={{ color: '#F4C400' }} />
        </div>
      ) : (
        <LeadTable
          leads={filteredLeads}
          onEdit={lead => { setEditingLead(lead); setSubmitError(null); setIsFormOpen(true) }}
          onDelete={handleDelete}
        />
      )}

      {isFormOpen && partnerId && (
        <LeadForm
          initialData={editingLead ?? { partner_id: partnerId }}
          onSubmit={editingLead ? handleUpdate : handleCreate}
          onCancel={() => { setIsFormOpen(false); setEditingLead(undefined) }}
          isSubmitting={isSubmitting}
          hidePartnerField
        />
      )}
    </div>
  )
}
