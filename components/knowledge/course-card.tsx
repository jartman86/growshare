'use client'

import Link from 'next/link'
import { Course } from '@/lib/course-data'
import { Clock, Users, Star, Award, BookOpen, DollarSign } from 'lucide-react'

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/knowledge/${course.id}`}>
      <div className="bg-white rounded-xl border hover:shadow-lg transition-all cursor-pointer overflow-hidden group h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {course.certification && (
            <div className="absolute top-3 right-3">
              <div className="px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                <Award className="h-3 w-3" />
                Certificate
              </div>
            </div>
          )}
          {course.price === 0 && (
            <div className="absolute top-3 left-3">
              <div className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-semibold shadow-lg">
                FREE
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Category & Difficulty */}
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
              {course.category}
            </span>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
              {course.difficulty}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">{course.description}</p>

          {/* Instructor */}
          <div className="flex items-center gap-2 mb-4">
            {course.instructorAvatar && (
              <img
                src={course.instructorAvatar}
                alt={course.instructor}
                className="w-6 h-6 rounded-full"
              />
            )}
            <span className="text-sm text-gray-700">{course.instructor}</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-t pt-4">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <BookOpen className="h-4 w-4" />
              <span>{course.lessons} lessons</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>{course.enrolled.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{course.rating}</span>
              <span className="text-gray-500">({course.reviews})</span>
            </div>
          </div>

          {/* Price & Points */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              {course.price === 0 ? (
                <span className="text-xl font-bold text-green-600">Free</span>
              ) : (
                <div>
                  <span className="text-2xl font-bold text-gray-900">${course.price}</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Earn</div>
              <div className="text-sm font-bold text-blue-600">+{course.points} pts</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
