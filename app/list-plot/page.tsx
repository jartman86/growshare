import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ListingForm } from '@/components/list-plot/listing-form'
import { MapPin, CheckCircle } from 'lucide-react'

export default function ListPlotPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen topo-lines">
        {/* Hero Section */}
        <div className="garden-gradient-vibrant topo-dense text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2d5016]/20 to-transparent"></div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-10 w-10 drop-shadow-md" />
              <h1 className="text-4xl font-bold drop-shadow-lg">List Your Land</h1>
            </div>
            <p className="text-[#f4e4c1] text-lg drop-shadow-md font-medium">
              Share your land with growers and earn passive income while stewarding your property
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gradient-to-br from-[#a8dadc]/30 to-[#87ceeb]/20 border-2 border-[#87ceeb]/30 rounded-xl p-6 mb-8 shadow-md">
            <h2 className="text-xl font-bold text-[#2d5016] mb-4">Why List on GrowShare?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-[#4a7c2c] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-[#2d5016] mb-1">Earn Income</h3>
                  <p className="text-sm text-[#4a3f35]">
                    Turn unused land into steady monthly revenue
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-[#4a7c2c] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-[#2d5016] mb-1">Vetted Growers</h3>
                  <p className="text-sm text-[#4a3f35]">
                    Review profiles, certifications, and references
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-[#4a7c2c] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-[#2d5016] mb-1">Stay Connected</h3>
                  <p className="text-sm text-[#4a3f35]">
                    Watch your land produce food for your community
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 shadow-md p-8">
            <ListingForm />
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
