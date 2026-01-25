'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageUpload } from '@/components/ui/image-upload'
import {
  BookOpen,
  Loader2,
  Save,
  ArrowLeft,
  DollarSign,
  Award,
  Info,
  Plus,
  GripVertical,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Video,
  FileText,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react'

const CATEGORIES = [
  { value: 'SOIL_SCIENCE', label: 'Soil Science' },
  { value: 'CROP_GUIDES', label: 'Crop Guides' },
  { value: 'PEST_MANAGEMENT', label: 'Pest Management' },
  { value: 'FARMING_METHODS', label: 'Farming Methods' },
  { value: 'ANIMAL_HUSBANDRY', label: 'Animal Husbandry' },
  { value: 'BUSINESS_LEGAL', label: 'Business & Legal' },
  { value: 'CLIMATE_ADAPTATION', label: 'Climate Adaptation' },
]

const LEVELS = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
  { value: 'EXPERT', label: 'Expert' },
]

const ACCESS_TYPES = [
  { value: 'FREE', label: 'Free', description: 'Anyone can enroll for free' },
  { value: 'ONE_TIME', label: 'One-Time Purchase', description: 'Students pay once for lifetime access' },
  { value: 'SUBSCRIPTION', label: 'Subscription Only', description: 'Only available to subscribers' },
  { value: 'BOTH', label: 'Both', description: 'Available for purchase or via subscription' },
]

interface CourseModule {
  id: string
  title: string
  description: string | null
  content: string
  videoUrl: string | null
  order: number
}

interface Course {
  id: string
  title: string
  description: string
  category: string
  level: string
  thumbnailUrl: string | null
  accessType: string
  price: number | null
  includeInSubscription: boolean
  isCertification: boolean
  certificateName: string | null
  isPublished: boolean
  modules: CourseModule[]
  _count: {
    progress: number
    purchases: number
  }
}

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('error')
  const [course, setCourse] = useState<Course | null>(null)
  const [activeTab, setActiveTab] = useState<'details' | 'modules'>('details')

  // Module editing state
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null)
  const [moduleFormData, setModuleFormData] = useState({
    title: '',
    description: '',
    content: '',
    videoUrl: '',
  })
  const [showModuleForm, setShowModuleForm] = useState(false)
  const [savingModule, setSavingModule] = useState(false)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'BEGINNER',
    thumbnailUrl: '',
    accessType: 'FREE',
    price: '',
    includeInSubscription: false,
    isCertification: false,
    certificateName: '',
  })

  useEffect(() => {
    fetchCourse()
  }, [id])

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/instructor/courses/${id}`)
      if (response.ok) {
        const data = await response.json()
        setCourse(data.course)
        setFormData({
          title: data.course.title,
          description: data.course.description,
          category: data.course.category,
          level: data.course.level,
          thumbnailUrl: data.course.thumbnailUrl || '',
          accessType: data.course.accessType,
          price: data.course.price?.toString() || '',
          includeInSubscription: data.course.includeInSubscription,
          isCertification: data.course.isCertification,
          certificateName: data.course.certificateName || '',
        })
      } else if (response.status === 404) {
        router.push('/instructor')
      }
    } catch (error) {
      console.error('Error fetching course:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')

    try {
      const response = await fetch(`/api/instructor/courses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? parseFloat(formData.price) : null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Course saved successfully')
        setMessageType('success')
        setCourse(prev => prev ? { ...prev, ...data.course } : null)
      } else {
        setMessage(data.error || 'Failed to save course')
        setMessageType('error')
      }
    } catch (error) {
      setMessage('An error occurred while saving')
      setMessageType('error')
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    setPublishing(true)
    setMessage('')

    try {
      const method = course?.isPublished ? 'DELETE' : 'POST'
      const response = await fetch(`/api/instructor/courses/${id}/publish`, {
        method,
      })

      const data = await response.json()

      if (response.ok) {
        const action = course?.isPublished ? 'unpublished' : 'published'
        setMessage(`Course ${action} successfully`)
        setMessageType('success')
        setCourse(prev => prev ? { ...prev, isPublished: !prev.isPublished } : null)
      } else {
        if (data.errors) {
          setMessage(data.errors.join('. '))
        } else {
          setMessage(data.error || 'Failed to update publish status')
        }
        setMessageType('error')
      }
    } catch (error) {
      setMessage('An error occurred')
      setMessageType('error')
    } finally {
      setPublishing(false)
    }
  }

  const handleAddModule = () => {
    setEditingModule(null)
    setModuleFormData({
      title: '',
      description: '',
      content: '',
      videoUrl: '',
    })
    setShowModuleForm(true)
  }

  const handleEditModule = (module: CourseModule) => {
    setEditingModule(module)
    setModuleFormData({
      title: module.title,
      description: module.description || '',
      content: module.content,
      videoUrl: module.videoUrl || '',
    })
    setShowModuleForm(true)
  }

  const handleSaveModule = async () => {
    setSavingModule(true)
    setMessage('')

    try {
      const url = editingModule
        ? `/api/instructor/courses/${id}/modules/${editingModule.id}`
        : `/api/instructor/courses/${id}/modules`

      const response = await fetch(url, {
        method: editingModule ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moduleFormData),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(editingModule ? 'Module updated' : 'Module added')
        setMessageType('success')
        setShowModuleForm(false)
        fetchCourse() // Refresh course data
      } else {
        setMessage(data.error || 'Failed to save module')
        setMessageType('error')
      }
    } catch (error) {
      setMessage('An error occurred while saving module')
      setMessageType('error')
    } finally {
      setSavingModule(false)
    }
  }

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module?')) return

    try {
      const response = await fetch(`/api/instructor/courses/${id}/modules/${moduleId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setMessage('Module deleted')
        setMessageType('success')
        fetchCourse()
      } else {
        const data = await response.json()
        setMessage(data.error || 'Failed to delete module')
        setMessageType('error')
      }
    } catch (error) {
      setMessage('An error occurred')
      setMessageType('error')
    }
  }

  const toggleModuleExpanded = (moduleId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev)
      if (next.has(moduleId)) {
        next.delete(moduleId)
      } else {
        next.add(moduleId)
      }
      return next
    })
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </main>
        <Footer />
      </>
    )
  }

  if (!course) {
    return null
  }

  const showPriceField = formData.accessType === 'ONE_TIME' || formData.accessType === 'BOTH'

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Back Button & Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.push('/instructor')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>

            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                course.isPublished
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
              }`}>
                {course.isPublished ? 'Published' : 'Draft'}
              </span>
              <button
                onClick={handlePublish}
                disabled={publishing}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  course.isPublished
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {publishing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : course.isPublished ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Publish
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Students</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{course._count.progress}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Purchases</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{course._count.purchases}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Modules</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{course.modules.length}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b dark:border-gray-700">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 px-1 font-medium border-b-2 transition-colors ${
                activeTab === 'details'
                  ? 'text-green-600 dark:text-green-400 border-green-600 dark:border-green-400'
                  : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Course Details
            </button>
            <button
              onClick={() => setActiveTab('modules')}
              className={`pb-3 px-1 font-medium border-b-2 transition-colors ${
                activeTab === 'modules'
                  ? 'text-green-600 dark:text-green-400 border-green-600 dark:border-green-400'
                  : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Modules ({course.modules.length})
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              messageType === 'success'
                ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-400'
            }`}>
              {message}
            </div>
          )}

          {activeTab === 'details' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Edit Course
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      minLength={5}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Course Description *
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      minLength={50}
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {formData.description.length}/50 minimum characters
                    </p>
                  </div>

                  {/* Category & Level */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Category *
                      </label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="">Select a category</option>
                        {CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Difficulty Level
                      </label>
                      <select
                        id="level"
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        {LEVELS.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Thumbnail */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Course Thumbnail
                    </label>
                    <ImageUpload
                      value={formData.thumbnailUrl ? [formData.thumbnailUrl] : []}
                      onChange={(urls) => setFormData({ ...formData, thumbnailUrl: urls[0] || '' })}
                      maxImages={1}
                      folder="growshare/courses"
                    />
                  </div>

                  {/* Pricing */}
                  <div className="border-t dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Pricing
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Access Type *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {ACCESS_TYPES.map((type) => (
                            <label
                              key={type.value}
                              className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                formData.accessType === type.value
                                  ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                              }`}
                            >
                              <input
                                type="radio"
                                name="accessType"
                                value={type.value}
                                checked={formData.accessType === type.value}
                                onChange={(e) => setFormData({ ...formData, accessType: e.target.value })}
                                className="sr-only"
                              />
                              <span className="font-medium text-gray-900 dark:text-white">{type.label}</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {type.description}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {showPriceField && (
                        <div>
                          <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Price (USD) *
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <input
                              type="number"
                              id="price"
                              value={formData.price}
                              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                              className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              placeholder="49.99"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            You&apos;ll receive 90% of each sale
                          </p>
                        </div>
                      )}

                      {(formData.accessType === 'SUBSCRIPTION' || formData.accessType === 'BOTH') && (
                        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-blue-800 dark:text-blue-300">
                            This course will be available to all GrowShare subscribers.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Certification */}
                  <div className="border-t dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Certification
                    </h3>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isCertification}
                        onChange={(e) => setFormData({ ...formData, isCertification: e.target.checked })}
                        className="mt-1 rounded text-green-600 focus:ring-green-500"
                      />
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          Issue Certificate on Completion
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Students will receive a downloadable certificate
                        </p>
                      </div>
                    </label>

                    {formData.isCertification && (
                      <div className="mt-4">
                        <label htmlFor="certificateName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Certificate Name
                        </label>
                        <input
                          type="text"
                          id="certificateName"
                          value={formData.certificateName}
                          onChange={(e) => setFormData({ ...formData, certificateName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="e.g., Certified Organic Soil Specialist"
                        />
                      </div>
                    )}
                  </div>

                  {/* Save Button */}
                  <div className="pt-4">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'modules' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Course Modules
                  </CardTitle>
                  <button
                    onClick={handleAddModule}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Module
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                {course.modules.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      No modules yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Add your first module to start building your course
                    </p>
                    <button
                      onClick={handleAddModule}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                      Add First Module
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {course.modules.map((module, index) => (
                      <div
                        key={module.id}
                        className="border dark:border-gray-700 rounded-lg overflow-hidden"
                      >
                        <div
                          className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 cursor-pointer"
                          onClick={() => toggleModuleExpanded(module.id)}
                        >
                          <GripVertical className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          <span className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-semibold text-sm">
                            {index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 dark:text-white truncate">
                              {module.title}
                            </h4>
                            {module.description && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {module.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {module.videoUrl && (
                              <Video className="h-4 w-4 text-blue-500" />
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditModule(module)
                              }}
                              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                              <Edit3 className="h-4 w-4 text-gray-500" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteModule(module.id)
                              }}
                              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                            {expandedModules.has(module.id) ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                        {expandedModules.has(module.id) && (
                          <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-900">
                            <div className="prose dark:prose-invert max-w-none text-sm">
                              {module.content || <span className="text-gray-400 italic">No content yet</span>}
                            </div>
                            {module.videoUrl && (
                              <div className="mt-4">
                                <a
                                  href={module.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                >
                                  <Video className="h-4 w-4" />
                                  View Video
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Module Form Modal */}
      {showModuleForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingModule ? 'Edit Module' : 'Add Module'}
                </h2>
                <button
                  onClick={() => setShowModuleForm(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="moduleTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Module Title *
                  </label>
                  <input
                    type="text"
                    id="moduleTitle"
                    value={moduleFormData.title}
                    onChange={(e) => setModuleFormData({ ...moduleFormData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="e.g., Introduction to Soil Types"
                  />
                </div>

                <div>
                  <label htmlFor="moduleDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    id="moduleDescription"
                    value={moduleFormData.description}
                    onChange={(e) => setModuleFormData({ ...moduleFormData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Brief description of what this module covers"
                  />
                </div>

                <div>
                  <label htmlFor="moduleContent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Content
                  </label>
                  <textarea
                    id="moduleContent"
                    value={moduleFormData.content}
                    onChange={(e) => setModuleFormData({ ...moduleFormData, content: e.target.value })}
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
                    placeholder="Write your lesson content here. You can use Markdown for formatting."
                  />
                </div>

                <div>
                  <label htmlFor="moduleVideo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Video URL (Optional)
                  </label>
                  <input
                    type="url"
                    id="moduleVideo"
                    value={moduleFormData.videoUrl}
                    onChange={(e) => setModuleFormData({ ...moduleFormData, videoUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="https://..."
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    YouTube, Vimeo, or direct video URL
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSaveModule}
                    disabled={savingModule || !moduleFormData.title.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {savingModule ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        {editingModule ? 'Update Module' : 'Add Module'}
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowModuleForm(false)}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
