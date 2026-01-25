'use client'

import { Lock, ShieldOff, LogIn } from 'lucide-react'
import Link from 'next/link'

interface PrivateProfileViewProps {
  reason: 'private' | 'blocked' | 'login_required'
  username: string
  avatar?: string | null
}

export function PrivateProfileView({ reason, username, avatar }: PrivateProfileViewProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Avatar placeholder */}
        <div className="mx-auto w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-6">
          {avatar ? (
            <img
              src={avatar}
              alt={username}
              className="w-full h-full rounded-full object-cover opacity-50"
            />
          ) : (
            <span className="text-4xl text-gray-400">
              {username.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Username */}
        <h1 className="text-xl font-semibold text-gray-900 mb-2">@{username}</h1>

        {/* Message based on reason */}
        {reason === 'private' && (
          <>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full mb-4">
              <Lock className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">Private Profile</span>
            </div>
            <p className="text-gray-500 mb-6">
              This user has set their profile to private. You can only view their profile if you have an existing conversation or booking with them.
            </p>
          </>
        )}

        {reason === 'blocked' && (
          <>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full mb-4">
              <ShieldOff className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-red-600">Profile Unavailable</span>
            </div>
            <p className="text-gray-500 mb-6">
              You cannot view this profile.
            </p>
          </>
        )}

        {reason === 'login_required' && (
          <>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
              <LogIn className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600">Sign In Required</span>
            </div>
            <p className="text-gray-500 mb-6">
              This user has set their profile to private. Sign in to see if you have access.
            </p>
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Link>
          </>
        )}

        {/* Back link */}
        <div className="mt-6">
          <Link
            href="/explore"
            className="text-green-600 hover:text-green-700 text-sm font-medium"
          >
            ← Back to Explore
          </Link>
        </div>
      </div>
    </div>
  )
}
