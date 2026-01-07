import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { EntryForm } from '@/components/journal/entry-form'
import { BookOpen, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewJournalEntryPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link
              href="/dashboard/journal"
              className="inline-flex items-center gap-2 text-green-100 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Journal
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="h-10 w-10" />
              <h1 className="text-4xl font-bold">New Journal Entry</h1>
            </div>
            <p className="text-green-100 text-lg">
              Document your crop's journey and earn points for your progress
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl border p-8">
            {/* Points Reminder */}
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  +10
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">
                    Earn Points for Documenting Your Journey
                  </h3>
                  <p className="text-sm text-green-700">
                    Each journal entry earns you 10 points. Keep tracking your crops to
                    level up and unlock badges!
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <EntryForm mode="create" />
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-blue-900 mb-3">📝 Journal Entry Tips</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  <strong>Be specific:</strong> Include details about what you observe -
                  leaf color, plant height, flowering stage, etc.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  <strong>Track changes:</strong> Note any differences from your last entry
                  to track growth patterns
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  <strong>Record challenges:</strong> Document pests, diseases, or weather
                  issues to learn for next season
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  <strong>Note your actions:</strong> Keep track of fertilizing, pruning,
                  staking, or other interventions
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  <strong>Update regularly:</strong> Weekly entries help you catch problems
                  early and celebrate progress
                </span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
