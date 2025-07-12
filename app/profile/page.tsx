"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import BottomNav from "@/components/BottomNav"
import { Edit, Star, MapPin, Clock, Settings } from "lucide-react"

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg?height=120&width=120",
    skillsOffered: ["React", "JavaScript", "Node.js", "CSS"],
    skillsWanted: ["Python", "Data Science", "Machine Learning", "Django"],
    availability: "Weekends",
    rating: 4.7,
    location: "San Francisco, CA",
    bio: "Full-stack developer with a passion for creating amazing web experiences. Always eager to learn new technologies and share knowledge with others.",
    experience: "4+ years",
    responseTime: "Usually responds within 3 hours",
    completedSwaps: 12,
    memberSince: "January 2023",
  })

  useEffect(() => {
    // In a real app, this would fetch the current user's data
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      const user = JSON.parse(userData)
      setCurrentUser((prev) => ({ ...prev, ...user }))
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <Link href="/edit-profile" className="p-2 hover:bg-gray-100 rounded-lg">
            <Edit className="w-5 h-5 text-gray-600" />
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start gap-4">
            <img
              src={currentUser.avatar || "/placeholder.svg"}
              alt={currentUser.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{currentUser.name}</h2>
              <p className="text-gray-600">{currentUser.email}</p>

              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {currentUser.location}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  {currentUser.rating}
                </div>
              </div>

              <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                {currentUser.availability}
              </div>
            </div>
          </div>

          <p className="text-gray-700 mt-4">{currentUser.bio}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{currentUser.completedSwaps}</div>
            <div className="text-sm text-gray-600">Completed Swaps</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{currentUser.rating}</div>
            <div className="text-sm text-gray-600">Rating</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{currentUser.skillsOffered.length}</div>
            <div className="text-sm text-gray-600">Skills Offered</div>
          </div>
        </div>

        {/* Skills Offered */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Skills I Offer</h3>
            <Link href="/edit-profile" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              Edit
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentUser.skillsOffered.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Skills I Want to Learn</h3>
            <Link href="/edit-profile" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              Edit
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentUser.skillsWanted.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Experience:</span>
              <span className="text-gray-600">{currentUser.experience}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Response Time:</span>
              <span className="text-gray-600">{currentUser.responseTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Member Since:</span>
              <span className="text-gray-600">{currentUser.memberSince}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/edit-profile"
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
