'use client'

import { useState } from 'react'
import { HarvestModal } from './harvest-modal'
import { Scale } from 'lucide-react'
import { JournalEntry } from '@/lib/journal-data'

interface EntryDetailClientProps {
  entry: JournalEntry
}

export function EntryDetailClient({ entry }: EntryDetailClientProps) {
  const [isHarvestModalOpen, setIsHarvestModalOpen] = useState(false)

  // Only show the harvest button if the entry is in GROWING status and hasn't been harvested yet
  const canRecordHarvest =
    (entry.status === 'GROWING' || entry.status === 'PLANTED') && !entry.harvestAmount

  if (!canRecordHarvest) {
    return null
  }

  return (
    <>
      <button
        onClick={() => setIsHarvestModalOpen(true)}
        className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-orange-700 hover:to-yellow-700 transition-all shadow-lg flex items-center justify-center gap-2 mb-6"
      >
        <Scale className="h-5 w-5" />
        Record Harvest
      </button>

      <HarvestModal
        isOpen={isHarvestModalOpen}
        onClose={() => setIsHarvestModalOpen(false)}
        cropName={entry.cropName}
        entryId={entry.id}
      />
    </>
  )
}
