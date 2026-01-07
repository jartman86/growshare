import Link from 'next/link'
import { ArrowRight, MapIcon, Users, BookOpen, ShoppingBag, Award, TrendingUp } from 'lucide-react'
import { Header } from '@/components/layout/header-new'
import { Footer } from '@/components/layout/footer'

export default function HomePage() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Transform Land Into
              <span className="block text-green-600">Living Opportunity</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              GrowShare is more than a marketplace—it's an agricultural engagement ecosystem where
              land becomes playable territory, farming becomes visible progress, and community becomes cooperative gameplay.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/explore"
                className="inline-flex items-center justify-center rounded-lg bg-green-600 px-8 py-3 text-base font-medium text-white hover:bg-green-700 transition-colors"
              >
                Explore Plots
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/list-plot"
                className="inline-flex items-center justify-center rounded-lg border-2 border-green-600 px-8 py-3 text-base font-medium text-green-600 hover:bg-green-50 transition-colors"
              >
                List Your Land
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
              <div>
                <p className="text-3xl font-bold text-gray-900">1,200+</p>
                <p className="mt-1 text-sm text-gray-600">Active Plots</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">850+</p>
                <p className="mt-1 text-sm text-gray-600">Growers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">45+</p>
                <p className="mt-1 text-sm text-gray-600">States</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">2M+</p>
                <p className="mt-1 text-sm text-gray-600">lbs Harvested</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Everything You Need to Grow</h2>
            <p className="mt-4 text-lg text-gray-600">
              From finding land to selling produce, GrowShare powers your agricultural journey
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1: Interactive Map */}
            <div className="group relative rounded-2xl border border-gray-200 p-8 hover:border-green-500 hover:shadow-lg transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <MapIcon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Interactive Map</h3>
              <p className="mt-2 text-gray-600">
                Explore available plots on our satellite-hybrid map. Filter by soil type, water access,
                USDA zone, and more. Discover your perfect growing space.
              </p>
            </div>

            {/* Feature 2: Gamification */}
            <div className="group relative rounded-2xl border border-gray-200 p-8 hover:border-green-500 hover:shadow-lg transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Achievement System</h3>
              <p className="mt-2 text-gray-600">
                Earn badges, level up, and track your farming journey. From "First Harvest" to
                "Master Grower"—your progress is visible and rewarding.
              </p>
            </div>

            {/* Feature 3: Crop Journal */}
            <div className="group relative rounded-2xl border border-gray-200 p-8 hover:border-green-500 hover:shadow-lg transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Crop Journal</h3>
              <p className="mt-2 text-gray-600">
                Document your growing journey with photos, notes, and harvest tracking.
                Build a personal record and share your progress with the community.
              </p>
            </div>

            {/* Feature 4: Knowledge Hub */}
            <div className="group relative rounded-2xl border border-gray-200 p-8 hover:border-green-500 hover:shadow-lg transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Knowledge Hub</h3>
              <p className="mt-2 text-gray-600">
                Access expert courses on soil health, regenerative practices, pest management, and more.
                Earn certifications that build trust with landowners.
              </p>
            </div>

            {/* Feature 5: Co-op Marketplace */}
            <div className="group relative rounded-2xl border border-gray-200 p-8 hover:border-green-500 hover:shadow-lg transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Trading Post</h3>
              <p className="mt-2 text-gray-600">
                Sell your harvest directly to consumers, restaurants, and institutions.
                Pre-orders, subscriptions, and cooperative selling made simple.
              </p>
            </div>

            {/* Feature 6: Community */}
            <div className="group relative rounded-2xl border border-gray-200 p-8 hover:border-green-500 hover:shadow-lg transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Thriving Community</h3>
              <p className="mt-2 text-gray-600">
                Connect with mentors, share knowledge in forums, organize work parties,
                and build lasting relationships with fellow growers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">
              Getting started is easy—whether you're a landowner or grower
            </p>
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            {/* For Landowners */}
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900">For Landowners</h3>
              <div className="mt-8 space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-white font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">List Your Land</h4>
                    <p className="mt-1 text-gray-600">
                      Create listings with photos, soil data, and amenities. Set your terms and pricing.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-white font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Review Applications</h4>
                    <p className="mt-1 text-gray-600">
                      See grower profiles, certifications, and references. Choose who works your land.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-white font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Earn & Engage</h4>
                    <p className="mt-1 text-gray-600">
                      Receive passive income while staying connected to your land's farming journey.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Growers */}
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900">For Growers</h3>
              <div className="mt-8 space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Find Your Plot</h4>
                    <p className="mt-1 text-gray-600">
                      Search our map, filter by location and features, and request plots that match your needs.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Build Your Profile</h4>
                    <p className="mt-1 text-gray-600">
                      Complete courses, earn certifications, and showcase your farming journey.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Grow & Sell</h4>
                    <p className="mt-1 text-gray-600">
                      Track your crops, earn achievements, and sell your harvest through our marketplace.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              Ready to Start Your Agricultural Journey?
            </h2>
            <p className="mt-4 text-lg text-green-100">
              Join thousands of landowners and growers building the future of local food.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/explore"
                className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-base font-medium text-green-600 hover:bg-gray-100 transition-colors"
              >
                Find Land to Farm
              </Link>
              <Link
                href="/list-plot"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-3 text-base font-medium text-white hover:bg-green-700 transition-colors"
              >
                Share Your Land
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
