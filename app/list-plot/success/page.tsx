import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CheckCircle, Home, Bell, Users, ArrowRight } from 'lucide-react'

export default function ListingSuccessPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Listing Submitted Successfully!
            </h1>
            <p className="text-lg text-gray-600">
              Your plot listing is now under review
            </p>
          </div>

          {/* What's Next */}
          <div className="bg-white rounded-xl border shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What Happens Next?</h2>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                    <span className="text-xl font-bold text-blue-600">1</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Listing Review (24-48 hours)
                  </h3>
                  <p className="text-gray-600">
                    Our team will review your listing to ensure it meets our quality standards
                    and community guidelines. We'll contact you if we need any additional
                    information.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                    <span className="text-xl font-bold text-green-600">2</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Listing Goes Live</h3>
                  <p className="text-gray-600">
                    Once approved, your plot will appear on our interactive map and search
                    results. Growers in your area will be able to discover and request to rent
                    your land.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full">
                    <span className="text-xl font-bold text-purple-600">3</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Receive Booking Requests
                  </h3>
                  <p className="text-gray-600">
                    When growers are interested, they'll send booking requests. You'll receive
                    email notifications and can review their profiles, experience, and
                    references before approving.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full">
                    <span className="text-xl font-bold text-orange-600">4</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Start Earning</h3>
                  <p className="text-gray-600">
                    Once you approve a grower, they'll complete payment through our secure
                    system, and you'll start receiving monthly rental income. Easy!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition-all group"
              >
                <Home className="h-6 w-6 text-gray-600 group-hover:text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">View Dashboard</h3>
                  <p className="text-sm text-gray-600">Track your listing status</p>
                </div>
              </Link>

              <Link
                href="/settings/notifications"
                className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition-all group"
              >
                <Bell className="h-6 w-6 text-gray-600 group-hover:text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Notification Settings</h3>
                  <p className="text-sm text-gray-600">Manage alert preferences</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-3">
              💡 Tips While You Wait
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Add photos:</strong> Listings with high-quality photos get 3x more
                  booking requests
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Complete your profile:</strong> A detailed landowner profile builds
                  trust with growers
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Explore other listings:</strong> See what successful plots in your
                  area look like
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Join the community:</strong> Connect with other landowners in our
                  forums
                </span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
            >
              <Users className="h-5 w-5" />
              Explore the GrowShare Community
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
