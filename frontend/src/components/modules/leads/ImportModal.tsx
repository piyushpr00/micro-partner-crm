'use client'

import { useState, useRef } from 'react'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { X, Upload, Check, AlertCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ImportModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function ImportModal({ onClose, onSuccess }: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [data, setData] = useState<any[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [step, setStep] = useState<'upload' | 'mapping' | 'progress' | 'result'>('upload')
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const expectedFields = ['first_name', 'last_name', 'email', 'phone', 'source', 'partner_id']

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      parseFile(selectedFile)
    }
  }

  const parseFile = (file: File) => {
    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setData(results.data)
          setHeaders(Object.keys(results.data[0] || {}))
          autoMap(Object.keys(results.data[0] || {}))
          setStep('mapping')
        }
      })
    } else {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json(worksheet)
        setData(json)
        setHeaders(Object.keys(json[0] || {}))
        autoMap(Object.keys(json[0] || {}))
        setStep('mapping')
      }
      reader.readAsArrayBuffer(file)
    }
  }

  const autoMap = (fileHeaders: string[]) => {
    const newMapping: Record<string, string> = {}
    expectedFields.forEach(field => {
      const match = fileHeaders.find(h => h.toLowerCase().replace(/[\s_]/g, '') === field.replace(/[\s_]/g, ''))
      if (match) newMapping[field] = match
    })
    setMapping(newMapping)
  }

  const handleImport = async () => {
    setStep('progress')
    const mappedData = data.map(row => {
      const lead: any = {}
      Object.entries(mapping).forEach(([field, fileHeader]) => {
        lead[field] = row[fileHeader]
      })
      lead.status = 'new'
      return lead
    })

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch('http://localhost:5000/api/bulk/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ leads: mappedData })
      })

      const result = await response.json()
      setResult(result)
      setStep('result')
      if (result.success > 0) onSuccess()
    } catch (error) {
      console.error('Import failed:', error)
      setStep('upload')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b flex items-center justify-between shrink-0">
          <h3 className="text-lg font-bold">Bulk Import Leads</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 'upload' && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-12 text-center cursor-pointer hover:border-blue-500 transition-colors"
            >
              <Upload className="mx-auto text-slate-400 mb-4" size={48} />
              <p className="text-lg font-medium">Click to upload CSV or Excel file</p>
              <p className="text-sm text-slate-500 mt-2">Maximum file size: 10MB</p>
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".csv, .xlsx, .xls" 
                className="hidden" 
                onChange={handleFileChange}
              />
            </div>
          )}

          {step === 'mapping' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex gap-3 text-sm text-blue-700 dark:text-blue-300">
                <AlertCircle size={20} className="shrink-0" />
                <p>We've automatically mapped some fields. Please review and manually map any missing fields.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-xs font-semibold text-slate-500 uppercase">Database Field</div>
                <div className="text-xs font-semibold text-slate-500 uppercase">File Header</div>
                {expectedFields.map(field => (
                  <div key={field} className="contents">
                    <div className="flex items-center text-sm font-medium capitalize">
                      {field.replace('_', ' ')}
                      {field === 'email' || field === 'first_name' ? <span className="text-red-500 ml-1">*</span> : null}
                    </div>
                    <select 
                      value={mapping[field] || ''} 
                      onChange={(e) => setMapping({...mapping, [field]: e.target.value})}
                      className="px-3 py-2 border rounded-lg text-sm dark:bg-slate-800 dark:border-slate-700 outline-none"
                    >
                      <option value="">Select Header</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'progress' && (
            <div className="text-center py-12 space-y-6">
              <Loader2 className="animate-spin text-blue-600 mx-auto" size={48} />
              <div>
                <p className="text-lg font-medium">Processing Import...</p>
                <p className="text-sm text-slate-500 mt-2">This may take a few moments depending on the file size.</p>
              </div>
            </div>
          )}

          {step === 'result' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl text-center">
                  <p className="text-2xl font-bold text-green-600">{result.success}</p>
                  <p className="text-xs text-green-700 uppercase font-semibold">Success</p>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-xl text-center">
                  <p className="text-2xl font-bold text-yellow-600">{result.duplicates}</p>
                  <p className="text-xs text-yellow-700 uppercase font-semibold">Duplicates</p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl text-center">
                  <p className="text-2xl font-bold text-red-600">{result.errors}</p>
                  <p className="text-xs text-red-700 uppercase font-semibold">Errors</p>
                </div>
              </div>

              {result.details.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 text-xs font-semibold uppercase text-slate-500 border-b">
                    Import Details
                  </div>
                  <div className="max-h-48 overflow-y-auto divide-y">
                    {result.details.map((detail: any, idx: number) => (
                      <div key={idx} className="px-4 py-3 text-sm flex items-center justify-between">
                        <span className="font-medium">{detail.email}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${detail.status === 'duplicate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                          {detail.message}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 shrink-0">
          {step === 'mapping' && (
            <>
              <button 
                onClick={() => setStep('upload')}
                className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-white dark:hover:bg-slate-800 transition-colors"
              >
                Back
              </button>
              <button 
                onClick={handleImport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Start Import
              </button>
            </>
          )}
          {step === 'result' && (
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-lg text-sm font-medium transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
