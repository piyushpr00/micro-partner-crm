'use client'

import { Lead } from '@/types'
import { MoreHorizontal, Mail, Phone, Calendar, Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface LeadTableProps {
  leads: Lead[]
  onEdit: (lead: Lead) => void
  onDelete: (id: string) => void
}

const statusStyles = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-purple-100 text-purple-800',
  qualified: 'bg-indigo-100 text-indigo-800',
  proposal: 'bg-yellow-100 text-yellow-800',
  negotiation: 'bg-orange-100 text-orange-800',
  closed_won: 'bg-green-100 text-green-800',
  closed_lost: 'bg-red-100 text-red-800',
}

export function LeadTable({ leads, onEdit, onDelete }: LeadTableProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 dark:bg-slate-800 border-b">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Lead Name</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date Added</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900 dark:text-white">{lead.first_name} {lead.last_name}</span>
                  <span className="text-xs text-slate-500">{lead.source || 'Direct Source'}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyles[lead.status]}`}>
                  {lead.status.replace('_', ' ')}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1 text-xs text-slate-500">
                  <div className="flex items-center">
                    <Mail size={12} className="mr-1.5" />
                    {lead.email}
                  </div>
                  {lead.phone && (
                    <div className="flex items-center">
                      <Phone size={12} className="mr-1.5" />
                      {lead.phone}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center text-sm text-slate-500">
                  <Calendar size={14} className="mr-1.5" />
                  {new Date(lead.created_at).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4 text-right relative">
                <button 
                  onClick={() => setActiveMenu(activeMenu === lead.id ? null : lead.id)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <MoreHorizontal size={18} />
                </button>

                {activeMenu === lead.id && (
                  <div className="absolute right-6 top-12 bg-white dark:bg-slate-800 border rounded-lg shadow-lg z-10 w-36 py-1 overflow-hidden">
                    <Link 
                      href={`/leads/${lead.id}`}
                      className="flex items-center gap-2 px-4 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 w-full text-left"
                    >
                      <Eye size={14} /> View Details
                    </Link>
                    <button 
                      onClick={() => {
                        onEdit(lead)
                        setActiveMenu(null)
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 w-full text-left"
                    >
                      <Edit size={14} /> Edit Lead
                    </button>
                    <button 
                      onClick={() => {
                        onDelete(lead.id)
                        setActiveMenu(null)
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                    >
                      <Trash2 size={14} /> Delete Lead
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
          {leads.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                No leads found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
