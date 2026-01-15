import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapIcon, Users, BookOpen, ShoppingBag, Award, TrendingUp, CheckCircle } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function HomePage() {
  return (
    <>
      <Header />

      {/* Hero Section with Photo Background */}
      <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 z-10"></div>
        <Image
          src="/images/aerial-farm.jpg"
          alt="Aerial view of agricultural plots"
          fill
          className="object-cover"
          priority
        />

        {/* Content */}
        <div className="relative z-20 h-full flex items-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl leading-tight">
                Transform Land Into
                <span className="block text-[#a7d46c] mt-2">Living Opportunity</span>
              </h1>
              <p className="mt-8 text-xl text-gray-100 leading-relaxed max-w-2xl">
                Connect landowners with passionate growers. Build sustainable communities.
                Grow food, earn income, and cultivate the future of agriculture.
              </p>
              <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/explore"
                  className="inline-flex items-center justify-center rounded-md bg-[#5a7f3a] px-8 py-4 text-lg font-semibold text-white hover:bg-[#4a6f2a] transition-all shadow-lg hover:shadow-xl"
                >
                  Explore Available Land
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/list-plot"
                  className="inline-flex items-center justify-center rounded-md bg-white px-8 py-4 text-lg font-semibold text-[#5a7f3a] hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
                >
                  List Your Property
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4 max-w-2xl">
                <div>
                  <p className="text-4xl font-bold text-white">1,200+</p>
                  <p className="mt-1 text-sm text-gray-200">Active Plots</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-white">850+</p>
                  <p className="mt-1 text-sm text-gray-200">Growers</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-white">45+</p>
                  <p className="mt-1 text-sm text-gray-200">States</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-white">2M+</p>
                  <p className="mt-1 text-sm text-gray-200">lbs Harvested</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900">Everything You Need to Grow</h2>
            <p className="mt-4 text-xl text-gray-600">
              From finding land to selling produce, GrowShare powers your agricultural journey
            </p>
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1: Interactive Map */}
            <div className="group relative rounded-xl bg-gray-50 p-8 hover:bg-gray-100 transition-all">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#5a7f3a] text-white">
                <MapIcon className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Interactive Map</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Explore available plots on our satellite-hybrid map. Filter by soil type, water access,
                USDA zone, and more.
              </p>
            </div>

            {/* Feature 2: Gamification */}
            <div className="group relative rounded-xl bg-gray-50 p-8 hover:bg-gray-100 transition-all">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#8b6f47] text-white">
                <Award className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Achievement System</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Earn badges, level up, and track your farming journey. From "First Harvest" to
                "Master Grower"—your progress is visible.
              </p>
            </div>

            {/* Feature 3: Crop Journal */}
            <div className="group relative rounded-xl bg-gray-50 p-8 hover:bg-gray-100 transition-all">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#6b8e5a] text-white">
                <TrendingUp className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Crop Journal</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Document your growing journey with photos, notes, and harvest tracking.
                Build a personal record of your success.
              </p>
            </div>

            {/* Feature 4: Knowledge Hub */}
            <div className="group relative rounded-xl bg-gray-50 p-8 hover:bg-gray-100 transition-all">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#a67c52] text-white">
                <BookOpen className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Knowledge Hub</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Access expert courses on soil health, regenerative practices, pest management, and more.
                Earn certifications that build trust.
              </p>
            </div>

            {/* Feature 5: Trading Post */}
            <div className="group relative rounded-xl bg-gray-50 p-8 hover:bg-gray-100 transition-all">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#7a9b5f] text-white">
                <ShoppingBag className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Trading Post</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Sell your harvest directly to consumers, restaurants, and institutions.
                Pre-orders and subscriptions made simple.
              </p>
            </div>

            {/* Feature 6: Community */}
            <div className="group relative rounded-xl bg-gray-50 p-8 hover:bg-gray-100 transition-all">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#5a7f3a] text-white">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Thriving Community</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Connect with mentors, share knowledge in forums, organize work parties,
                and build lasting relationships with growers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - With Photo Background */}
      <section className="relative py-24 overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/70 z-10"></div>
        <Image
          src="/images/raised-beds.jpg"
          alt="Raised bed gardens with growing vegetables"
          fill
          className="object-cover"
        />

        <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white">How It Works</h2>
            <p className="mt-4 text-xl text-gray-200">
              Getting started is easy—whether you're a landowner or grower
            </p>
          </div>

          <div className="mt-20 grid gap-12 lg:grid-cols-2">
            {/* For Landowners */}
            <div className="rounded-xl bg-white/95 backdrop-blur-sm p-10 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <MapIcon className="h-7 w-7 text-[#5a7f3a]" />
                For Landowners
              </h3>
              <div className="mt-8 space-y-6">
                <div className="flex gap-5">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#5a7f3a] text-white font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">List Your Land</h4>
                    <p className="mt-2 text-gray-600 leading-relaxed">
                      Create listings with photos, soil data, and amenities. Set your terms and pricing.
                    </p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#6b8e5a] text-white font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">Review Applications</h4>
                    <p className="mt-2 text-gray-600 leading-relaxed">
                      See grower profiles, certifications, and references. Choose who works your land.
                    </p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#7a9b5f] text-white font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">Earn & Engage</h4>
                    <p className="mt-2 text-gray-600 leading-relaxed">
                      Receive passive income while staying connected to your land's farming journey.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Growers */}
            <div className="rounded-xl bg-white/95 backdrop-blur-sm p-10 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="h-7 w-7 text-[#5a7f3a]" />
                For Growers
              </h3>
              <div className="mt-8 space-y-6">
                <div className="flex gap-5">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#5a7f3a] text-white font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">Find Your Plot</h4>
                    <p className="mt-2 text-gray-600 leading-relaxed">
                      Browse plots, check soil types, water access, and location. Apply to properties that fit your needs.
                    </p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#6b8e5a] text-white font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">Start Growing</h4>
                    <p className="mt-2 text-gray-600 leading-relaxed">
                      Get approved, sign agreements, and begin cultivating. Track progress and earn achievements.
                    </p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#7a9b5f] text-white font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">Harvest & Sell</h4>
                    <p className="mt-2 text-gray-600 leading-relaxed">
                      Use our marketplace to sell produce, build your reputation, and grow your farming business.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-gray-900">Trusted by Growers & Landowners</h2>
            <p className="mt-4 text-xl text-gray-600">
              See what our community members are saying
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-1 text-yellow-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                "GrowShare changed everything for us. We found the perfect plot within weeks and
                the community support has been incredible."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                <div>
                  <p className="font-semibold text-gray-900">Sarah Martinez</p>
                  <p className="text-sm text-gray-600">Urban Farmer, Portland</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-1 text-yellow-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                "As a landowner, I love seeing my property put to good use. The rental income
                is great, and the growers are respectful and professional."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                <div>
                  <p className="font-semibold text-gray-900">Robert Chen</p>
                  <p className="text-sm text-gray-600">Landowner, Vermont</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-1 text-yellow-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                "The marketplace feature helped me connect directly with restaurants.
                I've doubled my revenue in just one season!"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                <div>
                  <p className="font-semibold text-gray-900">Emily Rodriguez</p>
                  <p className="text-sm text-gray-600">Market Gardener, California</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#5a7f3a] to-[#4a6f2a]"></div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            Ready to Start Growing?
          </h2>
          <p className="mt-6 text-xl text-gray-100">
            Join thousands of growers and landowners building the future of sustainable agriculture.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-md bg-white px-8 py-4 text-lg font-semibold text-[#5a7f3a] hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center justify-center rounded-md border-2 border-white px-8 py-4 text-lg font-semibold text-white hover:bg-white/10 transition-all"
            >
              Browse Plots
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
