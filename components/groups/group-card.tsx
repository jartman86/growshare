import Link from 'next/link'
import { LocalGroup, formatGroupMemberCount } from '@/lib/groups-data'
import { Users, MapPin, Calendar, TrendingUp, Lock, CheckCircle } from 'lucide-react'

interface GroupCardProps {
  group: LocalGroup
  showJoinButton?: boolean
}

export function GroupCard({ group, showJoinButton = true }: GroupCardProps) {
  const activityPercentage = Math.round((group.activeMembers / group.memberCount) * 100)

  return (
    <Link
      href={`/groups/${group.slug}`}
      className="block bg-white rounded-xl border hover:shadow-lg transition-all overflow-hidden group"
    >
      {/* Cover Image */}
      <div className="relative h-40 bg-gray-200 overflow-hidden">
        <img
          src={group.coverImage}
          alt={group.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Location Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-900 flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {group.location.city}, {group.location.state}
        </div>
        {/* Privacy Badge */}
        {!group.isPublic && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-gray-900/80 backdrop-blur-sm rounded-full text-sm font-medium text-white flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Private
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Group Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
          {group.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {group.description}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-gray-900">
              {formatGroupMemberCount(group.memberCount)}
            </span>
            <span className="text-gray-600">members</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-gray-900">{activityPercentage}%</span>
            <span className="text-gray-600">active</span>
          </div>
          {group.upcomingEvents && group.upcomingEvents > 0 && (
            <div className="flex items-center gap-2 text-sm col-span-2">
              <Calendar className="h-4 w-4 text-orange-600" />
              <span className="font-semibold text-gray-900">{group.upcomingEvents}</span>
              <span className="text-gray-600">
                upcoming event{group.upcomingEvents !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {group.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {group.tags.length > 3 && (
            <span className="px-2 py-1 text-gray-500 text-xs">
              +{group.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Leaders */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex -space-x-2">
            {group.leaders.slice(0, 3).map((leader) => (
              <img
                key={leader.id}
                src={leader.avatar}
                alt={leader.name}
                className="w-8 h-8 rounded-full border-2 border-white"
                title={leader.name}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">
            Led by {group.leaders[0].name}
            {group.leaders.length > 1 && ` +${group.leaders.length - 1}`}
          </span>
        </div>

        {/* Join Button */}
        {showJoinButton && (
          <button
            onClick={(e) => {
              e.preventDefault()
              // TODO: Handle join group
              alert(`Joining ${group.name}`)
            }}
            className={`w-full py-2 rounded-lg font-semibold transition-colors ${
              group.requiresApproval
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {group.requiresApproval ? (
              <>
                <CheckCircle className="h-4 w-4 inline mr-1" />
                Request to Join
              </>
            ) : (
              'Join Group'
            )}
          </button>
        )}
      </div>
    </Link>
  )
}
