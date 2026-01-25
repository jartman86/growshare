'use client'

import { useState } from 'react'
import {
  FileText,
  Download,
  Eye,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Printer
} from 'lucide-react'

interface LeaseDocumentProps {
  bookingId: string
  leaseUrl?: string | null
  bookingStatus: string
  isOwner: boolean
}

export function LeaseDocument({
  bookingId,
  leaseUrl,
  bookingStatus,
  isOwner,
}: LeaseDocumentProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(leaseUrl || null)

  const canViewLease = ['APPROVED', 'ACTIVE', 'COMPLETED'].includes(bookingStatus)

  const handleGenerateLease = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch(`/api/bookings/${bookingId}/lease`, {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate lease')
      }

      const data = await response.json()
      setGeneratedUrl(data.leaseUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePrint = () => {
    if (generatedUrl) {
      const printWindow = window.open(generatedUrl, '_blank')
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print()
        }
      }
    }
  }

  if (!canViewLease) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-3 text-gray-500">
          <FileText className="h-5 w-5" />
          <span className="text-sm">
            Lease agreement will be available after booking is approved
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="h-5 w-5 text-green-600" />
          Lease Agreement
        </h3>
        {generatedUrl && (
          <span className="text-xs text-green-600 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Generated
          </span>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {generatedUrl ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            The lease agreement has been generated for this booking. You can view,
            print, or download it below.
          </p>

          <div className="flex flex-wrap gap-2">
            <a
              href={generatedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <Eye className="h-4 w-4" />
              View Lease
              <ExternalLink className="h-3 w-3" />
            </a>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>

            <a
              href={`${generatedUrl}&download=true`}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              Download
            </a>
          </div>
        </div>
      ) : isOwner ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Generate the official lease agreement for this booking. This document
            includes all the terms and conditions agreed upon by both parties.
          </p>

          <button
            onClick={handleGenerateLease}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Generate Lease Agreement
              </>
            )}
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-600">
          The landowner will generate the lease agreement for this booking.
          You'll be able to view and download it once it's ready.
        </p>
      )}
    </div>
  )
}
