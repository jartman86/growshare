import Link from 'next/link'
import { ArrowRight, MapIcon, Users, BookOpen, ShoppingBag, Award, TrendingUp } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function HomePage() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden garden-gradient-light topo-contour">
        <div className="absolute inset-0 topo-organic opacity-30"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/80 to-transparent"></div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-[#2d5016] sm:text-5xl md:text-6xl drop-shadow-sm">
              Transform Land Into
              <span className="block text-[#4a7c2c] mt-2">Living Opportunity</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[#4a3f35] font-medium drop-shadow-sm">
              GrowShare is more than a marketplace—it's an agricultural engagement ecosystem where
              land becomes playable territory, farming becomes visible progress, and community becomes cooperative gameplay.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/explore"
                className="inline-flex items-center justify-center rounded-lg bg-[#4a7c2c] px-8 py-3 text-base font-medium text-white hover:bg-[#2d5016] transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Explore Plots
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/list-plot"
                className="inline-flex items-center justify-center rounded-lg border-2 border-[#4a7c2c] px-8 py-3 text-base font-medium text-[#4a7c2c] hover:bg-[#4a7c2c] hover:text-white transition-all shadow-md hover:shadow-lg"
              >
                List Your Land
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-md">
                <p className="text-3xl font-bold text-[#4a7c2c]">1,200+</p>
                <p className="mt-1 text-sm text-[#4a3f35] font-medium">Active Plots</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-md">
                <p className="text-3xl font-bold text-[#4a7c2c]">850+</p>
                <p className="mt-1 text-sm text-[#4a3f35] font-medium">Growers</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-md">
                <p className="text-3xl font-bold text-[#4a7c2c]">45+</p>
                <p className="mt-1 text-sm text-[#4a3f35] font-medium">States</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-md">
                <p className="text-3xl font-bold text-[#4a7c2c]">2M+</p>
                <p className="mt-1 text-sm text-[#4a3f35] font-medium">lbs Harvested</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative topo-bg">
        <div className="absolute inset-0 garden-texture opacity-20"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#2d5016]">Everything You Need to Grow</h2>
            <p className="mt-4 text-lg text-[#4a3f35]">
              From finding land to selling produce, GrowShare powers your agricultural journey
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1: Interactive Map */}
            <div className="group relative rounded-2xl border-2 border-[#aed581]/30 bg-white/80 backdrop-blur-sm p-8 hover:border-[#4a7c2c] hover:shadow-xl transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#6ba03f] to-[#4a7c2c] text-white shadow-md">
                <MapIcon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-[#2d5016]">Interactive Map</h3>
              <p className="mt-2 text-[#4a3f35]">
                Explore available plots on our satellite-hybrid map. Filter by soil type, water access,
                USDA zone, and more. Discover your perfect growing space.
              </p>
            </div>

            {/* Feature 2: Gamification */}
            <div className="group relative rounded-2xl border-2 border-[#b19cd9]/30 bg-white/80 backdrop-blur-sm p-8 hover:border-[#9c4dcc] hover:shadow-xl transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#b19cd9] to-[#9c4dcc] text-white shadow-md">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-[#2d5016]">Achievement System</h3>
              <p className="mt-2 text-[#4a3f35]">
                Earn badges, level up, and track your farming journey. From "First Harvest" to
                "Master Grower"—your progress is visible and rewarding.
              </p>
            </div>

            {/* Feature 3: Crop Journal */}
            <div className="group relative rounded-2xl border-2 border-[#87ceeb]/30 bg-white/80 backdrop-blur-sm p-8 hover:border-[#457b9d] hover:shadow-xl transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#a8dadc] to-[#457b9d] text-white shadow-md">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-[#2d5016]">Crop Journal</h3>
              <p className="mt-2 text-[#4a3f35]">
                Document your growing journey with photos, notes, and harvest tracking.
                Build a personal record and share your progress with the community.
              </p>
            </div>

            {/* Feature 4: Knowledge Hub */}
            <div className="group relative rounded-2xl border-2 border-[#ffb703]/30 bg-white/80 backdrop-blur-sm p-8 hover:border-[#fb8500] hover:shadow-xl transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#ffb703] to-[#fb8500] text-white shadow-md">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-[#2d5016]">Knowledge Hub</h3>
              <p className="mt-2 text-[#4a3f35]">
                Access expert courses on soil health, regenerative practices, pest management, and more.
                Earn certifications that build trust with landowners.
              </p>
            </div>

            {/* Feature 5: Co-op Marketplace */}
            <div className="group relative rounded-2xl border-2 border-[#ef233c]/30 bg-white/80 backdrop-blur-sm p-8 hover:border-[#ef233c] hover:shadow-xl transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#ef233c] to-[#d62828] text-white shadow-md">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-[#2d5016]">Trading Post</h3>
              <p className="mt-2 text-[#4a3f35]">
                Sell your harvest directly to consumers, restaurants, and institutions.
                Pre-orders, subscriptions, and cooperative selling made simple.
              </p>
            </div>

            {/* Feature 6: Community */}
            <div className="group relative rounded-2xl border-2 border-[#8bc34a]/30 bg-white/80 backdrop-blur-sm p-8 hover:border-[#6ba03f] hover:shadow-xl transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#8bc34a] to-[#6ba03f] text-white shadow-md">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-[#2d5016]">Thriving Community</h3>
              <p className="mt-2 text-[#4a3f35]">
                Connect with mentors, share knowledge in forums, organize work parties,
                and build lasting relationships with fellow growers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative topo-contour bg-gradient-to-br from-[#f4e4c1] via-[#aed581]/20 to-[#a8dadc]/30">
        <div className="absolute inset-0 leaf-pattern opacity-30"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#2d5016]">How It Works</h2>
            <p className="mt-4 text-lg text-[#4a3f35]">
              Getting started is easy—whether you're a landowner or grower
            </p>
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            {/* For Landowners */}
            <div className="rounded-2xl bg-white/90 backdrop-blur-sm p-8 shadow-lg border-2 border-[#d4a574]/30">
              <h3 className="text-2xl font-bold text-[#2d5016] flex items-center gap-2">
                <MapIcon className="h-6 w-6 text-[#4a7c2c]" />
                For Landowners
              </h3>
              <div className="mt-8 space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6ba03f] to-[#4a7c2c] text-white font-bold shadow-md">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2d5016]">List Your Land</h4>
                    <p className="mt-1 text-[#4a3f35]">
                      Create listings with photos, soil data, and amenities. Set your terms and pricing.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8bc34a] to-[#6ba03f] text-white font-bold shadow-md">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2d5016]">Review Applications</h4>
                    <p className="mt-1 text-[#4a3f35]">
                      See grower profiles, certifications, and references. Choose who works your land.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#aed581] to-[#8bc34a] text-white font-bold shadow-md">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2d5016]">Earn & Engage</h4>
                    <p className="mt-1 text-[#4a3f35]">
                      Receive passive income while staying connected to your land's farming journey.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Growers */}
            <div className="rounded-2xl bg-white/90 backdrop-blur-sm p-8 shadow-lg border-2 border-[#87ceeb]/30">
              <h3 className="text-2xl font-bold text-[#2d5016] flex items-center gap-2">
                <Users className="h-6 w-6 text-[#457b9d]" />
                For Growers
              </h3>
              <div className="mt-8 space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#a8dadc] to-[#457b9d] text-white font-bold shadow-md">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2d5016]">Find Your Plot</h4>
                    <p className="mt-1 text-[#4a3f35]">
                      Search our map, filter by location and features, and request plots that match your needs.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#87ceeb] to-[#6ba3b8] text-white font-bold shadow-md">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2d5016]">Build Your Profile</h4>
                    <p className="mt-1 text-[#4a3f35]">
                      Complete courses, earn certifications, and showcase your farming journey.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6ba3b8] to-[#457b9d] text-white font-bold shadow-md">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2d5016]">Grow & Sell</h4>
                    <p className="mt-1 text-[#4a3f35]">
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
      <section className="relative py-16 garden-gradient-vibrant overflow-hidden">
        <div className="absolute inset-0 topo-contour opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2d5016]/20 to-transparent"></div>
          <div className="absolute inset-0 leaf-pattern opacity-10"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">
              Ready to Start Your Agricultural Journey?
            </h2>
            <p className="mt-4 text-lg text-[#f4e4c1] drop-shadow-md font-medium">
              Join thousands of landowners and growers building the future of local food.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/explore"
                className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-base font-medium text-[#4a7c2c] hover:bg-[#f4e4c1] transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Find Land to Farm
              </Link>
              <Link
                href="/list-plot"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-3 text-base font-medium text-white hover:bg-[#2d5016] transition-all shadow-md hover:shadow-lg"
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
