'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { PrivacySettings } from '@/components/settings/privacy-settings'
import { VerificationStatus } from '@/components/profile/verification-status'
import { Settings, Shield, UserCheck, Bell, CreditCard } from 'lucide-react'

type SettingsTab = 'privacy' | 'verification' | 'notifications' | 'billing'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('privacy')

  const tabs = [
    { id: 'privacy' as const, label: 'Privacy', icon: Shield },
    { id: 'verification' as const, label: 'Verification', icon: UserCheck },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'billing' as const, label: 'Billing', icon: CreditCard },
  ]

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="garden-gradient-vibrant topo-dense text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2d5016]/20 to-transparent"></div>
          <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Settings className="h-8 w-8 drop-shadow-md" />
              <h1 className="text-3xl font-bold drop-shadow-lg">Settings</h1>
            </div>
            <p className="mt-2 text-green-100">
              Manage your account preferences and privacy
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 gap-8">
            {/* Sidebar Navigation */}
            <div className="col-span-12 md:col-span-3">
              <nav className="bg-white rounded-lg border shadow-sm p-2 space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-green-50 text-green-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${
                        activeTab === tab.id ? 'text-green-600' : 'text-gray-400'
                      }`} />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Main Content */}
            <div className="col-span-12 md:col-span-9">
              {activeTab === 'privacy' && <PrivacySettings />}

              {activeTab === 'verification' && (
                <VerificationStatus showActions={true} />
              )}

              {activeTab === 'notifications' && (
                <div className="bg-white rounded-lg border shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Bell className="h-6 w-6 text-green-600" />
                    Notification Preferences
                  </h2>
                  <p className="text-gray-600">
                    Notification settings coming soon. Currently, you'll receive email notifications for important updates like booking requests, messages, and reviews.
                  </p>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="bg-white rounded-lg border shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="h-6 w-6 text-green-600" />
                    Billing & Payments
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Manage your payment methods and view your transaction history.
                  </p>
                  <a
                    href="/api/stripe/portal"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Open Stripe Portal
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
