'use client'

import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen topo-lines flex items-center justify-center py-12">
        <div className="max-w-md mx-auto px-4 text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-8xl font-bold text-[#4a7c2c] dark:text-green-400 mb-2">404</div>
            <div className="text-6xl mb-4">🌱</div>
          </div>

          {/* Message */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Looks like this plot hasn&apos;t been planted yet. The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8bc34a] to-[#6ba03f] text-white font-semibold rounded-lg hover:from-[#7cb342] hover:to-[#5a8f35] transition-all shadow-md"
            >
              <Home className="h-5 w-5" />
              Go Home
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-[#4a7c2c] dark:text-green-400 font-semibold rounded-lg border-2 border-[#8bc34a]/30 dark:border-gray-600 hover:bg-[#aed581]/10 dark:hover:bg-gray-700 transition-all"
            >
              <Search className="h-5 w-5" />
              Explore Plots
            </Link>
          </div>

          {/* Back Link */}
          <button
            onClick={() => typeof window !== 'undefined' && window.history.back()}
            className="mt-6 inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#4a7c2c] dark:hover:text-green-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </button>
        </div>
      </main>
      <Footer />
    </>
  )
}
