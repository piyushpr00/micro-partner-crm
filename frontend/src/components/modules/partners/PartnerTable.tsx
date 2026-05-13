'use client'

import { Partner } from '@/types'
import { MoreHorizontal, Mail, Phone, MapPin } from 'lucide-react'

interface PartnerTableProps {
  partners: Partner[]
}

export function PartnerTable({ partners }: PartnerTableProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 dark:bg-slate-800 border-b">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Partner</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Region</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Commission</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {partners.map((partner) => (
            <tr key={partner.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900 dark:text-white">{partner.name}</span>
                  <span className="text-xs text-slate-500">{partner.company_name}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                  partner.status === 'active' ? 'bg-green-100 text-green-800' :
                  partner.status === 'inactive' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {partner.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center text-sm text-slate-500">
                  <MapPin size={14} className="mr-1.5" />
                  {partner.region || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm font-medium">{partner.commission_rate}%</span>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                  <MoreHorizontal size={18} />
                </button>
              </td>
            </tr>
          ))}
          {partners.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                No partners found in the directory.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
