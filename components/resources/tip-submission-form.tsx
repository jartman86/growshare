'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { X, Send, Loader2, Plus, Trash2 } from 'lucide-react'

type TipCategory = 'PLANTING_CALENDAR' | 'PEST_DISEASE' | 'COMPANION_PLANTING'

interface TipSubmissionFormProps {
  category: TipCategory
  onClose: () => void
  onSuccess?: () => void
}

export function TipSubmissionForm({ category, onClose, onSuccess }: TipSubmissionFormProps) {
  const { isSignedIn, user } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Common fields
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  // Planting calendar fields
  const [plantName, setPlantName] = useState('')
  const [usdaZone, setUsdaZone] = useState('')

  // Pest/disease fields
  const [pestName, setPestName] = useState('')
  const [treatment, setTreatment] = useState('')

  // Companion planting fields
  const [mainPlant, setMainPlant] = useState('')
  const [companions, setCompanions] = useState<string[]>([''])
  const [avoid, setAvoid] = useState<string[]>([''])

  if (!isSignedIn) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Sign In Required
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You need to sign in to submit a tip.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const payload: Record<string, unknown> = {
        category,
        title,
        content,
      }

      if (category === 'PLANTING_CALENDAR') {
        payload.plantName = plantName
        payload.usdaZone = usdaZone || undefined
      } else if (category === 'PEST_DISEASE') {
        payload.pestName = pestName
        payload.treatment = treatment
      } else if (category === 'COMPANION_PLANTING') {
        payload.mainPlant = mainPlant
        payload.companions = companions.filter(c => c.trim())
        payload.avoid = avoid.filter(a => a.trim())
      }

      const response = await fetch('/api/community-tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit tip')
      }

      setSuccess(true)
      setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit tip')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addCompanion = () => setCompanions([...companions, ''])
  const removeCompanion = (index: number) => setCompanions(companions.filter((_, i) => i !== index))
  const updateCompanion = (index: number, value: string) => {
    const newCompanions = [...companions]
    newCompanions[index] = value
    setCompanions(newCompanions)
  }

  const addAvoid = () => setAvoid([...avoid, ''])
  const removeAvoid = (index: number) => setAvoid(avoid.filter((_, i) => i !== index))
  const updateAvoid = (index: number, value: string) => {
    const newAvoid = [...avoid]
    newAvoid[index] = value
    setAvoid(newAvoid)
  }

  const getCategoryTitle = () => {
    switch (category) {
      case 'PLANTING_CALENDAR':
        return 'Planting Calendar Tip'
      case 'PEST_DISEASE':
        return 'Pest & Disease Tip'
      case 'COMPANION_PLANTING':
        return 'Companion Planting Tip'
    }
  }

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Tip Submitted!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Thank you for contributing! Your tip will be reviewed and published soon. You earned 5 points!
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Submit {getCategoryTitle()}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Give your tip a catchy title"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Category-specific fields */}
          {category === 'PLANTING_CALENDAR' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Plant Name *
                </label>
                <input
                  type="text"
                  value={plantName}
                  onChange={(e) => setPlantName(e.target.value)}
                  required
                  placeholder="e.g., Tomatoes, Peppers, Lettuce"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  USDA Zone (optional)
                </label>
                <input
                  type="text"
                  value={usdaZone}
                  onChange={(e) => setUsdaZone(e.target.value)}
                  placeholder="e.g., 5b, 7a, 10b"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </>
          )}

          {category === 'PEST_DISEASE' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pest or Disease Name *
                </label>
                <input
                  type="text"
                  value={pestName}
                  onChange={(e) => setPestName(e.target.value)}
                  required
                  placeholder="e.g., Aphids, Powdery Mildew, Tomato Hornworm"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Treatment/Solution *
                </label>
                <input
                  type="text"
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  required
                  placeholder="Brief treatment method"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </>
          )}

          {category === 'COMPANION_PLANTING' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Main Plant *
                </label>
                <input
                  type="text"
                  value={mainPlant}
                  onChange={(e) => setMainPlant(e.target.value)}
                  required
                  placeholder="e.g., Tomatoes"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Good Companions
                </label>
                {companions.map((companion, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={companion}
                      onChange={(e) => updateCompanion(index, e.target.value)}
                      placeholder="e.g., Basil"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    {companions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCompanion(index)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCompanion}
                  className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
                >
                  <Plus className="h-4 w-4" /> Add companion
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Plants to Avoid
                </label>
                {avoid.map((avoidPlant, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={avoidPlant}
                      onChange={(e) => updateAvoid(index, e.target.value)}
                      placeholder="e.g., Fennel"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    {avoid.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAvoid(index)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addAvoid}
                  className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
                >
                  <Plus className="h-4 w-4" /> Add plant to avoid
                </button>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Details *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
              placeholder="Share your knowledge, experience, and any helpful details..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Tip
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Tips are reviewed before publishing. You&apos;ll earn 5 points now and 15 more when approved!
          </p>
        </form>
      </div>
    </div>
  )
}
