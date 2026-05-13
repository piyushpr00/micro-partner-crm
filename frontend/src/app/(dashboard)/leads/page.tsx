'use client'

import { useState, useEffect } from 'react'
import { LeadTable } from '@/components/modules/leads/LeadTable'
import { LeadForm } from '@/components/modules/leads/LeadForm'
import { ImportModal } from '@/components/modules/leads/ImportModal'
import { LeadService } from '@/services/leadService'
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

  const fetchLeads = async () => {
    try {
      setIsLoading(true)
      const data = await LeadService.getAllLeads()
      setLeads(data)
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  useEffect(() => {
    let result = leads
    if (statusFilter !== 'all') {
      result = result.filter(lead => lead.status === statusFilter)
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(lead => 
        `${lead.first_name} ${lead.last_name}`.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query)
      )
    }
    setFilteredLeads(result)
  }, [statusFilter, searchQuery, leads])

  const handleCreateLead = async (data: any) => {
    try {
      setIsSubmitting(true)
      await LeadService.createLead(data)
      await fetchLeads()
      setIsFormOpen(false)
    } catch (error) {
      console.error('Error creating lead:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateLead = async (data: any) => {
    if (!editingLead) return
    try {
      setIsSubmitting(true)
      await LeadService.updateLead(editingLead.id, data)
      await fetchLeads()
      setIsFormOpen(false)
      setEditingLead(undefined)
    } catch (error) {
      console.error('Error updating lead:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return
    try {
      await LeadService.deleteLead(id)
      await fetchLeads()
    } catch (error) {
      console.error('Error deleting lead:', error)
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead Management</h1>
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
            onClick={() => {
              setEditingLead(undefined)
              setIsFormOpen(true)
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={18} className="mr-2" />
            New Lead
          </button>
        </div>
      </header>

      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-sm">
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-900 dark:border-slate-800"
          />
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : (
        <LeadTable 
          leads={filteredLeads} 
          onEdit={(lead) => {
            setEditingLead(lead)
            setIsFormOpen(true)
          }}
          onDelete={handleDeleteLead}
        />
      )}

      {isFormOpen && (
        <LeadForm
          initialData={editingLead}
          onSubmit={editingLead ? handleUpdateLead : handleCreateLead}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingLead(undefined)
          }}
          isSubmitting={isSubmitting}
        />
      )}

      {isImportOpen && (
        <ImportModal
          onClose={() => setIsImportOpen(false)}
          onSuccess={() => {
            fetchLeads()
            setIsImportOpen(false)
          }}
        />
      )}
    </div>
  )
}
