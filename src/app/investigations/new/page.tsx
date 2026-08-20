'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AppLayout } from '@/components/layout/AppLayout'
import { apiClient } from '@/lib/api/client'
import { ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react'

const investigationSchema = z.object({
  accidentDate: z.string().min(1, 'Accident date is required'),
  accidentTime: z.string().optional(),
  description: z.string().optional(),
  referenceNumber: z.string().optional(),
})

type InvestigationFormData = z.infer<typeof investigationSchema>

export default function NewInvestigationPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<'info' | 'upload'>('info')
  const [investigationId, setInvestigationId] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InvestigationFormData>({
    resolver: zodResolver(investigationSchema),
  })

  const onSubmitInfo = async (data: InvestigationFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const investigation = await apiClient.createInvestigation(data)
      setInvestigationId(investigation.id)
      setCurrentStep('upload')
    } catch (err) {
      setError('Failed to create investigation. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileSelect = (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload JPG, PNG, or WEBP.')
      return
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      setError('File is too large. Maximum size is 10 MB.')
      return
    }

    setUploadedFile(file)
    setError(null)
  }

  const handleDragDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleUploadClick = async () => {
    if (!uploadedFile || !investigationId) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i)
        await new Promise(resolve => setTimeout(resolve, 50))
      }

      await apiClient.uploadImage(investigationId, uploadedFile)
      setUploadProgress(100)

      // Wait a moment then redirect to analysis
      await new Promise(resolve => setTimeout(resolve, 300))
      router.push(`/investigations/${investigationId}/analysis`)
    } catch (err) {
      setError('Failed to upload image. Please try again.')
      setUploadProgress(0)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppLayout>
      <div className="page-container max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">New Investigation</h1>
          <p className="text-slate-600 mt-1">Create a new accident investigation case.</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
              currentStep === 'info' || investigationId
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {investigationId ? <CheckCircle2 size={20} /> : '1'}
          </div>

          <div
            className={`flex-1 h-1 rounded transition-all ${
              investigationId ? 'bg-indigo-600' : 'bg-slate-200'
            }`}
          />

          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
              currentStep === 'upload' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}
          >
            2
          </div>
        </div>

        {/* Step 1: Case Information */}
        {currentStep === 'info' && (
          <div className="card p-8 mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Case Information</h2>

            <form onSubmit={handleSubmit(onSubmitInfo)} className="space-y-6">
              {/* Accident Date */}
              <div>
                <label htmlFor="accidentDate" className="block text-sm font-medium text-slate-900 mb-2">
                  Accident Date *
                </label>
                <input
                  id="accidentDate"
                  type="date"
                  {...register('accidentDate')}
                  className="input-base"
                  disabled={isSubmitting}
                />
                {errors.accidentDate && (
                  <p className="text-rose-600 text-sm mt-1">{errors.accidentDate.message}</p>
                )}
              </div>

              {/* Accident Time */}
              <div>
                <label htmlFor="accidentTime" className="block text-sm font-medium text-slate-900 mb-2">
                  Accident Time (Optional)
                </label>
                <input
                  id="accidentTime"
                  type="time"
                  {...register('accidentTime')}
                  className="input-base"
                  disabled={isSubmitting}
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-900 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  {...register('description')}
                  placeholder="Describe the accident scene, vehicles involved, and any relevant details..."
                  className="input-base resize-none h-32"
                  disabled={isSubmitting}
                />
              </div>

              {/* Reference Number */}
              <div>
                <label htmlFor="referenceNumber" className="block text-sm font-medium text-slate-900 mb-2">
                  Police Reference Number (Optional)
                </label>
                <input
                  id="referenceNumber"
                  type="text"
                  {...register('referenceNumber')}
                  placeholder="e.g., POL-2026-1234"
                  className="input-base"
                  disabled={isSubmitting}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                Continue to Image Upload
                <ChevronRight size={20} />
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Image Upload */}
        {currentStep === 'upload' && investigationId && (
          <div className="space-y-6">
            {/* Upload Zone */}
            <div className="card">
              <div className="p-12">
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDragDrop}
                  className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer"
                >
                  <input
                    type="file"
                    id="image-upload"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                    disabled={isSubmitting}
                  />

                  <label htmlFor="image-upload" className="cursor-pointer block">
                    <div className="mb-4">
                      <svg
                        className="w-16 h-16 mx-auto text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold text-slate-900 mb-1">
                      Upload accident image
                    </p>
                    <p className="text-slate-600 mb-4">
                      Drag and drop an image here or browse files.
                    </p>
                    <span className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700">
                      Browse Files
                    </span>
                  </label>

                  <p className="text-xs text-slate-500 mt-4">
                    Supported formats: JPG, PNG, WEBP (max 10 MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700">
                <AlertCircle size={20} className="flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* File Preview */}
            {uploadedFile && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">Preview</h3>
                  <button
                    type="button"
                    onClick={() => setUploadedFile(null)}
                    className="text-sm text-slate-600 hover:text-slate-900 font-medium"
                  >
                    Change File
                  </button>
                </div>

                <div className="bg-slate-100 rounded-lg overflow-hidden mb-4">
                  <img
                    src={URL.createObjectURL(uploadedFile)}
                    alt="Preview"
                    className="w-full h-80 object-cover"
                  />
                </div>

                <div className="space-y-2 text-sm text-slate-600">
                  <p>
                    <strong>File:</strong> {uploadedFile.name}
                  </p>
                  <p>
                    <strong>Size:</strong>{' '}
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <p>
                    <strong>Type:</strong> {uploadedFile.type}
                  </p>
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="card p-6">
                <p className="text-sm font-medium text-slate-900 mb-3">
                  Uploading... {uploadProgress}%
                </p>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep('info')
                  setUploadedFile(null)
                }}
                disabled={isSubmitting}
                className="flex-1 btn-secondary"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleUploadClick}
                disabled={!uploadedFile || isSubmitting || uploadProgress > 0}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                Analyze Location
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
