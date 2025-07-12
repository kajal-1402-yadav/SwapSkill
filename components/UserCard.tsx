import Link from "next/link"
import { Star, MapPin, Clock } from "lucide-react"

interface User {
  id: number
  name: string
  avatar: string
  skillsOffered: string[]
  skillsWanted: string[]
  availability: string
  rating: number
  location: string
}

interface UserCardProps {
  user: User
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-16 h-16 rounded-full object-cover" />

        <div className="flex-1">
          <Link
            href={`/user/${user.id}`}
            className="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
          >
            {user.name}
          </Link>

          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {user.location}
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              {user.rating}
            </div>
          </div>

          <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            {user.availability}
          </div>
        </div>
      </div>

      {/* Skills Offered */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Offers:</h4>
        <div className="flex flex-wrap gap-1">
          {user.skillsOffered.slice(0, 3).map((skill, index) => (
            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
              {skill}
            </span>
          ))}
          {user.skillsOffered.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
              +{user.skillsOffered.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Skills Wanted */}
      <div className="mt-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Wants:</h4>
        <div className="flex flex-wrap gap-1">
          {user.skillsWanted.slice(0, 3).map((skill, index) => (
            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
              {skill}
            </span>
          ))}
          {user.skillsWanted.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
              +{user.skillsWanted.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* View Profile Button */}
      <Link
        href={`/user/${user.id}`}
        className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-center block"
      >
        View Profile
      </Link>
    </div>
  )
}
