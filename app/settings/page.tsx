'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { PrivacySettings } from '@/components/settings/privacy-settings'
import { VerificationStatus } from '@/components/profile/verification-status'
import { useTheme } from '@/lib/theme-context'
import { Settings, Shield, UserCheck, Bell, CreditCard, Loader2, Palette, Sun, Moon, Monitor } from 'lucide-react'

type SettingsTab = 'privacy' | 'verification' | 'notifications' | 'billing' | 'appearance'

interface UserVerification {
  isVerified: boolean
  isPhoneVerified: boolean
  phoneVerifiedAt: string | null
  isIdVerified: boolean
  idVerifiedAt: string | null
  phoneNumber: string | null
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('privacy')
  const [verification, setVerification] = useState<UserVerification | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    fetchVerificationStatus()
  }, [])

  const fetchVerificationStatus = async () => {
    try {
      const response = await fetch('/api/verification/id')
      if (response.ok) {
        const data = await response.json()
        setVerification({
          isVerified: data.email?.verified || false,
          isPhoneVerified: data.phone?.verified || false,
          phoneVerifiedAt: data.phone?.verifiedAt || null,
          isIdVerified: data.id?.verified || false,
          idVerifiedAt: data.id?.verifiedAt || null,
          phoneNumber: data.phone?.number || null,
        })
      }
    } catch (error) {
      console.error('Error fetching verification status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'privacy' as const, label: 'Privacy', icon: Shield },
    { id: 'verification' as const, label: 'Verification', icon: UserCheck },
    { id: 'appearance' as const, label: 'Appearance', icon: Palette },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'billing' as const, label: 'Billing', icon: CreditCard },
  ]

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
              <nav className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-sm p-2 space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${
                        activeTab === tab.id ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'
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
                isLoading ? (
                  <div className="bg-white rounded-lg border shadow-sm p-6 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                  </div>
                ) : (
                  <VerificationStatus
                    showActions={true}
                    isEmailVerified={verification?.isVerified}
                    isPhoneVerified={verification?.isPhoneVerified}
                    phoneVerifiedAt={verification?.phoneVerifiedAt}
                    isIdVerified={verification?.isIdVerified}
                    idVerifiedAt={verification?.idVerifiedAt}
                    phoneNumber={verification?.phoneNumber}
                  />
                )
              )}

              {activeTab === 'appearance' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Palette className="h-6 w-6 text-green-600 dark:text-green-400" />
                    Appearance
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Choose how GrowShare looks to you. Select a theme below.
                  </p>

                  <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setTheme('light')}
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                          theme === 'light'
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <Sun className={`h-6 w-6 ${
                          theme === 'light' ? 'text-green-600' : 'text-gray-400 dark:text-gray-500'
                        }`} />
                        <span className={`text-sm font-medium ${
                          theme === 'light' ? 'text-green-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          Light
                        </span>
                      </button>

                      <button
                        onClick={() => setTheme('dark')}
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                          theme === 'dark'
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <Moon className={`h-6 w-6 ${
                          theme === 'dark' ? 'text-green-600' : 'text-gray-400 dark:text-gray-500'
                        }`} />
                        <span className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-green-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          Dark
                        </span>
                      </button>

                      <button
                        onClick={() => setTheme('system')}
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                          theme === 'system'
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <Monitor className={`h-6 w-6 ${
                          theme === 'system' ? 'text-green-600' : 'text-gray-400 dark:text-gray-500'
                        }`} />
                        <span className={`text-sm font-medium ${
                          theme === 'system' ? 'text-green-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          System
                        </span>
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {theme === 'system'
                        ? 'GrowShare will automatically match your device\'s appearance settings.'
                        : theme === 'dark'
                        ? 'Dark mode is easier on the eyes in low-light environments.'
                        : 'Light mode provides the classic GrowShare look.'}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Bell className="h-6 w-6 text-green-600 dark:text-green-400" />
                    Notification Preferences
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Notification settings coming soon. Currently, you'll receive email notifications for important updates like booking requests, messages, and reviews.
                  </p>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
                    Billing & Payments
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
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
