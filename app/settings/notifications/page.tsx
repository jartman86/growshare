import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { EmailPreferencesForm } from '@/components/settings/email-preferences'
import { NotificationPreferencesForm } from '@/components/settings/notification-preferences'
import { ArrowLeft, Bell, Mail } from 'lucide-react'
import Link from 'next/link'

export default function NotificationSettingsPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Link */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Bell className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Settings</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Manage how and when you receive notifications from GrowShare.
            </p>
          </div>

          {/* In-App Notifications */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">In-App Notifications</h2>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <NotificationPreferencesForm />
            </div>
          </div>

          {/* Email Notifications */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Email Notifications</h2>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <EmailPreferencesForm />
            </div>
          </div>

          {/* Additional Info */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">About Notifications</h3>
            <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
              <li>• Important account and security emails will always be sent</li>
              <li>• You can unsubscribe from any email using the link at the bottom</li>
              <li>• In-app notifications appear in the bell icon in the header</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
