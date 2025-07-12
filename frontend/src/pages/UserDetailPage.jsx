"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "react-query"
import { Star, MapPin, Clock, ArrowLeft } from "lucide-react"
import { getUserDetail } from "../lib/api"
import { getAvatarUrl } from "../lib/utils"
import BottomNav from "../components/BottomNav"
import LoadingSpinner from "../components/LoadingSpinner"

export default function UserDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: userData, isLoading, error } = useQuery(["user", id], () => getUserDetail(id))

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error loading user</h2>
          <p className="text-gray-600">User not found or you don't have permission to view this profile.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const user = userData?.data || {}

  const handleRequestSwap = () => {
    navigate(`/request/${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">Profile Details</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start gap-4">
            <img
              src={getAvatarUrl(user.avatar) || "/placeholder.svg"}
              alt={user.full_name}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{user.full_name}</h2>
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

          <p className="text-gray-700 mt-4">{user.bio || "No bio provided."}</p>

          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div>
              <span className="font-medium text-gray-900">Experience:</span>
              <p className="text-gray-600">{user.experience_level || "Not specified"}</p>
            </div>
            <div>
              <span className="font-medium text-gray-900">Response Time:</span>
              <p className="text-gray-600">{user.response_time || "Not specified"}</p>
            </div>
          </div>
        </div>

        {/* Skills Offered */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills Offered</h3>
          <div className="flex flex-wrap gap-2">
            {user.skills_offered?.length > 0 ? (
              user.skills_offered.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No skills offered</p>
            )}
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills Wanted</h3>
          <div className="flex flex-wrap gap-2">
            {user.skills_wanted?.length > 0 ? (
              user.skills_wanted.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No skills wanted</p>
            )}
          </div>
        </div>

        {/* Request Button */}
        <button
          onClick={handleRequestSwap}
          className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Request Skill Swap
        </button>
      </main>

      <BottomNav />
    </div>
  )
}
