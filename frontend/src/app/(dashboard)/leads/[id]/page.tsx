'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { LeadService } from '@/services/leadService'
import { Lead } from '@/types'
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  User, 
  Tag, 
  MessageSquare,
  Clock,
  Loader2,
  Edit
} from 'lucide-react'
import Link from 'next/link'

export default function LeadDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [lead, setLead] = useState<Lead | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLead = async () => {
      try {
        setIsLoading(true)
        const data = await LeadService.getLeadById(id as string)
        setLead(data)
      } catch (error) {
        console.error('Error fetching lead:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLead()
  }, [id])

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-bold">Lead not found</h3>
        <Link href="/leads" className="text-blue-600 hover:underline mt-4 inline-block">
          Return to directory
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Leads
        </button>
        <button className="flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
          <Edit size={16} className="mr-2" />
          Edit Lead
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
                {lead.first_name[0]}{lead.last_name[0]}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{lead.first_name} {lead.last_name}</h1>
                <p className="text-slate-500 flex items-center">
                  <Tag size={14} className="mr-1.5" />
                  {lead.source || 'Direct Source'}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
              {lead.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="p-8 grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <section>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center text-slate-600 dark:text-slate-300">
                  <Mail size={18} className="mr-3 text-slate-400" />
                  {lead.email}
                </div>
                {lead.phone && (
                  <div className="flex items-center text-slate-600 dark:text-slate-300">
                    <Phone size={18} className="mr-3 text-slate-400" />
                    {lead.phone}
                  </div>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Metadata</h3>
              <div className="space-y-3">
                <div className="flex items-center text-slate-600 dark:text-slate-300">
                  <Calendar size={18} className="mr-3 text-slate-400" />
                  Created: {new Date(lead.created_at).toLocaleString()}
                </div>
                <div className="flex items-center text-slate-600 dark:text-slate-300">
                  <Clock size={18} className="mr-3 text-slate-400" />
                  Last Updated: {new Date(lead.updated_at).toLocaleString()}
                </div>
                <div className="flex items-center text-slate-600 dark:text-slate-300">
                  <User size={18} className="mr-3 text-slate-400" />
                  Assigned Partner: {(lead as any).partners?.name || 'Unassigned'}
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Remarks & Notes</h3>
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg min-h-[150px] relative">
                <MessageSquare size={16} className="absolute top-4 right-4 text-slate-400" />
                <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                  {lead.notes || 'No remarks added yet for this lead.'}
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
