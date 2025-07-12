import { Link } from "react-router-dom"
import { useQuery } from "react-query"
import { Edit, Star, MapPin, Clock, Settings } from "lucide-react"
import { getProfile } from "../lib/api"
import { getAvatarUrl } from "../lib/utils"
import BottomNav from "../components/BottomNav"
import LoadingSpinner from "../components/LoadingSpinner"

export default function ProfilePage() {
  const { data: profileData, isLoading } = useQuery("profile", getProfile)

  if (isLoading) {
    return <LoadingSpinner />
  }

  const user = profileData?.data || {}

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <Link to="/edit-profile" className="p-2 hover:bg-gray-100 rounded-lg">
            <Edit className="w-5 h-5 text-gray-600" />
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start gap-4">
            <img
              src={getAvatarUrl(user.avatar) || "/placeholder.svg"}
              alt={user.full_name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{user.full_name}</h2>
              <p className="text-gray-600">{user.email}</p>

              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {user.location || "Location not set"}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  {user.rating}
                </div>
              </div>

              <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                {user.availability || "Availability not set"}
              </div>
            </div>
          </div>

          <p className="text-gray-700 mt-4">{user.bio || "No bio provided yet."}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{user.completed_swaps || 0}</div>
            <div className="text-sm text-gray-600">Completed Swaps</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{user.rating || 0}</div>
            <div className="text-sm text-gray-600">Rating</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{user.skills_offered?.length || 0}</div>
            <div className="text-sm text-gray-600">Skills Offered</div>
          </div>
        </div>

        {/* Skills Offered */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Skills I Offer</h3>
            <Link to="/edit-profile" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              Edit
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.skills_offered?.length > 0 ? (
              user.skills_offered.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No skills added yet</p>
            )}
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Skills I Want to Learn</h3>
            <Link to="/edit-profile" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              Edit
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.skills_wanted?.length > 0 ? (
              user.skills_wanted.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No skills added yet</p>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Experience:</span>
              <span className="text-gray-600">{user.experience_level || "Not specified"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Response Time:</span>
              <span className="text-gray-600">{user.response_time || "Not specified"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Member Since:</span>
              <span className="text-gray-600">
                {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Not available"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            to="/edit-profile"
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-center block"
          >
            Edit Profile
          </Link>

          <button className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
