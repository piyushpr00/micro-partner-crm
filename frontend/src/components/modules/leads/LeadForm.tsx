'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Lead, COMMISSION_SLABS } from '@/types'
import { X } from 'lucide-react'

const leadSchema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  source: z.string().optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'] as const),
  course_type: z.enum(['3_months', '4_months', '6_months', '11_months_diploma'] as const).optional(),
  notes: z.string().optional(),
  partner_id: z.string().min(1, 'Partner is required'),
})

type LeadFormValues = z.infer<typeof leadSchema>

interface LeadFormProps {
  initialData?: Partial<Lead>
  onSubmit: (data: LeadFormValues) => void
  onCancel: () => void
  isSubmitting?: boolean
  hidePartnerField?: boolean
}

export function LeadForm({ initialData, onSubmit, onCancel, isSubmitting, hidePartnerField }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      first_name: initialData?.first_name || '',
      last_name: initialData?.last_name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      source: initialData?.source || '',
      status: initialData?.status || 'new',
      course_type: initialData?.course_type || '3_months',
      notes: initialData?.notes || '',
      partner_id: initialData?.partner_id || '',
    },
  })

  const selectedCourse = watch('course_type')
  const slab = COMMISSION_SLABS.find(s => s.course_type === selectedCourse)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-bold">{initialData?.id ? 'Edit Lead' : 'Add New Lead'}</h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-500">First Name</label>
              <input
                {...register('first_name')}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-800 dark:border-slate-700"
              />
              {errors.first_name && <p className="text-xs text-red-500">{errors.first_name.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-500">Last Name</label>
              <input
                {...register('last_name')}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-800 dark:border-slate-700"
              />
              {errors.last_name && <p className="text-xs text-red-500">{errors.last_name.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-500">Email</label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-800 dark:border-slate-700"
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-500">Phone</label>
              <input
                {...register('phone')}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-800 dark:border-slate-700"
              />
            </div>
          </div>

          {/* Course Type — determines commission slab */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-500">Course Interested In</label>
            <select
              {...register('course_type')}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-800 dark:border-slate-700"
            >
              {COMMISSION_SLABS.map(s => (
                <option key={s.course_type} value={s.course_type}>
                  {s.label} — {s.rate}% commission
                </option>
              ))}
            </select>
            {slab && (
              <p className="text-xs text-blue-600 font-medium">
                Commission: {slab.rate}% on deal value (₹{(10000 * slab.rate / 100).toLocaleString('en-IN')} per ₹10,000 deal)
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-500">Status</label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-800 dark:border-slate-700"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
                <option value="closed_won">Closed Won</option>
                <option value="closed_lost">Closed Lost</option>
              </select>
            </div>
            {hidePartnerField ? (
              <input type="hidden" {...register('partner_id')} />
            ) : (
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-slate-500">Partner ID</label>
                <input
                  {...register('partner_id')}
                  placeholder="Partner UUID"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-800 dark:border-slate-700"
                />
                {errors.partner_id && <p className="text-xs text-red-500">{errors.partner_id.message}</p>}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-500">Source</label>
            <input
              {...register('source')}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-800 dark:border-slate-700"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-500">Remarks / Notes</label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-800 dark:border-slate-700"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
