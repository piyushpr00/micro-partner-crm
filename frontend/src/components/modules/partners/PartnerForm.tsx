'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Partner } from '@/types'
import { X } from 'lucide-react'

const partnerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company_name: z.string().optional(),
  region: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending'] as const),
  commission_rate: z.preprocess((v) => parseFloat(String(v)), z.number().min(0).max(100)),
})

type PartnerFormValues = z.infer<typeof partnerSchema>

interface PartnerFormProps {
  initialData?: Partial<Partner>
  onSubmit: (data: PartnerFormValues) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function PartnerForm({ initialData, onSubmit, onCancel, isSubmitting }: PartnerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      company_name: initialData?.company_name || '',
      region: initialData?.region || '',
      status: initialData?.status || 'active',
      commission_rate: initialData?.commission_rate ?? 10,
    },
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-bold">{initialData?.id ? 'Edit Partner' : 'Add New Partner'}</h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-500">Full Name</label>
              <input
                {...register('name')}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-800 dark:border-slate-700"
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-500">Email</label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-800 dark:border-slate-700"
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-500">Phone</label>
              <input
                {...register('phone')}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-800 dark:border-slate-700"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-500">Company / Institute</label>
              <input
                {...register('company_name')}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-800 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-500">Region / City</label>
              <input
                {...register('region')}
                placeholder="e.g. Mumbai"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-800 dark:border-slate-700"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-500">Status</label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-800 dark:border-slate-700"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-500">
              Override Commission Rate (%) — leave at 10 to use course-based slabs
            </label>
            <input
              {...register('commission_rate')}
              type="number"
              min="0"
              max="100"
              step="0.5"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-800 dark:border-slate-700"
            />
            {errors.commission_rate && <p className="text-xs text-red-500">{errors.commission_rate.message}</p>}
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
              {isSubmitting ? 'Saving...' : 'Save Partner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
