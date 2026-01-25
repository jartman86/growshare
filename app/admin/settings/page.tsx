'use client'

import { useState } from 'react'
import {
  Settings,
  Globe,
  Mail,
  CreditCard,
  Bell,
  Shield,
  Database,
  Save,
  Loader2,
  CheckCircle
} from 'lucide-react'

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-600 mt-1">Configure global platform settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : saved ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-green-600" />
          General Settings
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Platform Name
            </label>
            <input
              type="text"
              defaultValue="GrowShare"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Support Email
            </label>
            <input
              type="email"
              defaultValue="support@growshare.com"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="maintenance"
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="maintenance" className="text-sm text-gray-700">
              Enable maintenance mode (site will be inaccessible to non-admins)
            </label>
          </div>
        </div>
      </div>

      {/* Email Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Mail className="h-5 w-5 text-green-600" />
          Email Settings
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SendGrid API Key
            </label>
            <input
              type="password"
              defaultValue="••••••••••••••••"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Email Address
            </label>
            <input
              type="email"
              defaultValue="noreply@growshare.com"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Payment Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-green-600" />
          Payment Settings
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Platform Fee (%)
            </label>
            <input
              type="number"
              defaultValue="10"
              min="0"
              max="50"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Percentage taken from each transaction
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Payout ($)
            </label>
            <input
              type="number"
              defaultValue="25"
              min="1"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="stripe-test"
              defaultChecked
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="stripe-test" className="text-sm text-gray-700">
              Use Stripe test mode
            </label>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-green-600" />
          Notification Settings
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">New User Notifications</p>
              <p className="text-sm text-gray-500">Email admins when new users sign up</p>
            </div>
            <input
              type="checkbox"
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Booking Notifications</p>
              <p className="text-sm text-gray-500">Email admins for high-value bookings</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Report Notifications</p>
              <p className="text-sm text-gray-500">Email admins when content is reported</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          Security Settings
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Require Email Verification</p>
              <p className="text-sm text-gray-500">Users must verify email before booking</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Require Phone Verification</p>
              <p className="text-sm text-gray-500">Users must verify phone before listing</p>
            </div>
            <input
              type="checkbox"
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Login Attempts
            </label>
            <input
              type="number"
              defaultValue="5"
              min="3"
              max="10"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Database Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Database className="h-5 w-5 text-green-600" />
          System Information
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Database</p>
            <p className="font-medium">PostgreSQL</p>
          </div>
          <div>
            <p className="text-gray-500">Environment</p>
            <p className="font-medium">Development</p>
          </div>
          <div>
            <p className="text-gray-500">Next.js Version</p>
            <p className="font-medium">16.1.1</p>
          </div>
          <div>
            <p className="text-gray-500">Node Version</p>
            <p className="font-medium">v20.x</p>
          </div>
        </div>
      </div>
    </div>
  )
}
