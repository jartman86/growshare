'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SAMPLE_PESTS_DISEASES } from '@/lib/resources-data'
import {
  Bug,
  ShieldAlert,
  ArrowLeft,
  Search,
  AlertTriangle,
  Leaf,
  CheckCircle,
  X,
} from 'lucide-react'

export default function PestsDiseasesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'All' | 'Pest' | 'Disease'>('All')
  const [severityFilter, setSeverityFilter] = useState<'All' | 'Low' | 'Moderate' | 'High'>('All')

  const filteredIssues = SAMPLE_PESTS_DISEASES.filter((issue) => {
    const matchesSearch =
      searchQuery === '' ||
      issue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.affectedPlants.some((plant) => plant.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesType = typeFilter === 'All' || issue.type === typeFilter
    const matchesSeverity = severityFilter === 'All' || issue.severity === severityFilter

    return matchesSearch && matchesType && matchesSeverity
  })

  const hasActiveFilters = typeFilter !== 'All' || severityFilter !== 'All' || searchQuery !== ''

  const clearFilters = () => {
    setTypeFilter('All')
    setSeverityFilter('All')
    setSearchQuery('')
  }

  const stats = {
    totalIssues: SAMPLE_PESTS_DISEASES.length,
    pests: SAMPLE_PESTS_DISEASES.filter((i) => i.type === 'Pest').length,
    diseases: SAMPLE_PESTS_DISEASES.filter((i) => i.type === 'Disease').length,
    high: SAMPLE_PESTS_DISEASES.filter((i) => i.severity === 'High').length,
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'High':
        return 'bg-red-100 text-red-700 border-red-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-white hover:text-orange-200 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Resources
            </Link>
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-4">
                <Bug className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Pest & Disease Guide</h1>
              <p className="text-xl text-orange-100 max-w-2xl mx-auto">
                Identify and treat common garden pests and diseases organically
              </p>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-2xl font-bold">{stats.totalIssues}</p>
                  <p className="text-sm text-orange-100">Total Issues</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-2xl font-bold">{stats.pests}</p>
                  <p className="text-sm text-orange-100">Pests</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-2xl font-bold">{stats.diseases}</p>
                  <p className="text-sm text-orange-100">Diseases</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-2xl font-bold">{stats.high}</p>
                  <p className="text-sm text-orange-100">High Severity</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Search & Filters */}
          <div className="bg-white rounded-xl border p-6 mb-8">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by pest/disease name or affected plant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mr-2">Type:</label>
                <div className="inline-flex gap-2">
                  <button
                    onClick={() => setTypeFilter('All')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      typeFilter === 'All'
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setTypeFilter('Pest')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      typeFilter === 'Pest'
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Pests
                  </button>
                  <button
                    onClick={() => setTypeFilter('Disease')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      typeFilter === 'Disease'
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Diseases
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mr-2">Severity:</label>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="All">All</option>
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="ml-auto flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  <X className="h-4 w-4" />
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Issues Grid */}
          {filteredIssues.length > 0 ? (
            <>
              <div className="mb-4">
                <p className="text-gray-600">
                  {filteredIssues.length === SAMPLE_PESTS_DISEASES.length ? (
                    <>Showing all {filteredIssues.length} issues</>
                  ) : (
                    <>
                      Found {filteredIssues.length} issue{filteredIssues.length !== 1 ? 's' : ''}
                    </>
                  )}
                </p>
              </div>

              <div className="space-y-6">
                {filteredIssues.map((issue) => (
                  <div key={issue.id} className="bg-white rounded-xl border overflow-hidden">
                    {/* Header */}
                    <div className="grid md:grid-cols-3 gap-6 p-6">
                      {/* Image */}
                      <div className="relative">
                        <img
                          src={issue.image}
                          alt={issue.name}
                          className="w-full h-48 md:h-full object-cover rounded-lg"
                        />
                        <div className="absolute top-3 right-3">
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(
                              issue.severity
                            )}`}
                          >
                            {issue.severity} Severity
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className={`p-2 rounded-lg ${
                              issue.type === 'Pest' ? 'bg-orange-100' : 'bg-red-100'
                            }`}
                          >
                            {issue.type === 'Pest' ? (
                              <Bug className="h-6 w-6 text-orange-600" />
                            ) : (
                              <ShieldAlert className="h-6 w-6 text-red-600" />
                            )}
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900">{issue.name}</h2>
                            <span
                              className={`text-sm font-medium ${
                                issue.type === 'Pest' ? 'text-orange-600' : 'text-red-600'
                              }`}
                            >
                              {issue.type}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4">{issue.description}</p>

                        {/* Affected Plants */}
                        <div className="mb-4">
                          <p className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Leaf className="h-4 w-4 text-green-600" />
                            Commonly Affects:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {issue.affectedPlants.map((plant, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                              >
                                {plant}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Season */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-semibold">Most Active:</span>
                          <span>{issue.season.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Details */}
                    <div className="border-t bg-gray-50">
                      <div className="grid md:grid-cols-3 gap-6 p-6">
                        {/* Symptoms */}
                        <div>
                          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            Symptoms
                          </h3>
                          <ul className="space-y-2">
                            {issue.symptoms.map((symptom, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-yellow-600 mt-1">•</span>
                                <span>{symptom}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Prevention */}
                        <div>
                          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-blue-600" />
                            Prevention
                          </h3>
                          <ul className="space-y-2">
                            {issue.prevention.map((method, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <span>{method}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Organic Treatments */}
                        <div>
                          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Leaf className="h-5 w-5 text-green-600" />
                            Organic Treatments
                          </h3>
                          <ul className="space-y-2">
                            {issue.organicTreatments.map((treatment, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{treatment}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl border p-12 text-center">
              <Bug className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No issues found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or search query.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Helpful Tips */}
          <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="font-bold text-green-900 mb-4">🌿 Integrated Pest Management (IPM) Principles</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-green-800">
              <div>
                <p className="font-semibold mb-2">1. Prevention First</p>
                <ul className="space-y-1">
                  <li>• Choose resistant varieties</li>
                  <li>• Maintain healthy soil</li>
                  <li>• Proper spacing for air flow</li>
                  <li>• Rotate crops annually</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">2. Monitor Regularly</p>
                <ul className="space-y-1">
                  <li>• Inspect plants weekly</li>
                  <li>• Check undersides of leaves</li>
                  <li>• Identify issues early</li>
                  <li>• Keep garden journal</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">3. Encourage Beneficials</p>
                <ul className="space-y-1">
                  <li>• Plant flowers for pollinators</li>
                  <li>• Ladybugs eat aphids</li>
                  <li>• Birds control caterpillars</li>
                  <li>• Avoid broad-spectrum pesticides</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">4. Least Toxic First</p>
                <ul className="space-y-1">
                  <li>• Hand-pick pests when possible</li>
                  <li>• Try water spray first</li>
                  <li>• Use targeted organic controls</li>
                  <li>• Reserve chemicals as last resort</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
