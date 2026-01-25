import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  Flag,
  Settings,
  ArrowLeft,
  Shield,
} from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm">Back to site</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                ADMIN
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-4rem)] p-4">
          <nav className="space-y-1">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Users className="h-5 w-5" />
              <span className="font-medium">Users</span>
            </Link>
            <Link
              href="/admin/verifications"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Shield className="h-5 w-5" />
              <span className="font-medium">Verifications</span>
            </Link>
            <Link
              href="/admin/moderation"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Flag className="h-5 w-5" />
              <span className="font-medium">Moderation</span>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span className="font-medium">Settings</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
