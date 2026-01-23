import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { EmailPreferencesForm } from '@/components/settings/email-preferences'
import { ArrowLeft, Bell } from 'lucide-react'
import Link from 'next/link'

export default function NotificationSettingsPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Link */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Bell className="h-6 w-6 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
            </div>
            <p className="text-gray-600">
              Choose which email notifications you'd like to receive from GrowShare.
            </p>
          </div>

          {/* Settings Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <EmailPreferencesForm />
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-900 mb-2">About Email Notifications</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Important account and security emails will always be sent</li>
              <li>• You can unsubscribe from any email using the link at the bottom</li>
              <li>• In-app notifications are separate from email settings</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
