import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ListingForm } from '@/components/list-plot/listing-form'
import { MapPin, CheckCircle } from 'lucide-react'

export default function ListPlotPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-10 w-10" />
              <h1 className="text-4xl font-bold">List Your Land</h1>
            </div>
            <p className="text-green-100 text-lg">
              Share your land with growers and earn passive income while stewarding your property
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Why List on GrowShare?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Earn Income</h3>
                  <p className="text-sm text-blue-800">
                    Turn unused land into steady monthly revenue
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Vetted Growers</h3>
                  <p className="text-sm text-blue-800">
                    Review profiles, certifications, and references
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Stay Connected</h3>
                  <p className="text-sm text-blue-800">
                    Watch your land produce food for your community
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl border shadow-sm p-8">
            <ListingForm />
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
