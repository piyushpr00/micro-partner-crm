import { PartnerTable } from '@/components/modules/partners/PartnerTable'
import { Plus, Download, Filter } from 'lucide-react'

// Mock data for initial rendering
const mockPartners = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    company_name: 'JD Consulting',
    status: 'active',
    region: 'North America',
    commission_rate: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    company_name: 'Smith Partners',
    status: 'pending',
    region: 'Europe',
    commission_rate: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
] as any[]

export default function PartnersPage() {
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

      <PartnerTable partners={mockPartners} />
    </div>
  )
}
