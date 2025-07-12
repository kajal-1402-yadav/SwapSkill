"use client"
import { useParams, useRouter } from "next/navigation"
import BottomNav from "@/components/BottomNav"
import { Star, MapPin, Clock, ArrowLeft } from "lucide-react"

// Mock user data (same as in home page)
const mockUsers = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: "/placeholder.svg?height=150&width=150",
    skillsOffered: ["React", "JavaScript", "UI/UX Design"],
    skillsWanted: ["Python", "Data Science", "Machine Learning"],
    availability: "Weekends",
    rating: 4.8,
    location: "San Francisco, CA",
    bio: "Frontend developer with 5 years of experience. Passionate about creating beautiful and functional user interfaces. Looking to expand into data science and machine learning.",
    experience: "5+ years",
    responseTime: "Usually responds within 2 hours",
  },
  {
    id: 2,
    name: "Mike Rodriguez",
    avatar: "/placeholder.svg?height=150&width=150",
    skillsOffered: ["Python", "Django", "Data Analysis"],
    skillsWanted: ["React", "Frontend Development", "Mobile Development"],
    availability: "Evenings",
    rating: 4.9,
    location: "Austin, TX",
    bio: "Data scientist and backend developer. Love working with Python and analyzing complex datasets. Interested in learning modern frontend frameworks.",
    experience: "7+ years",
    responseTime: "Usually responds within 1 hour",
  },
]

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = Number.parseInt(params.id as string)

  const user = mockUsers.find((u) => u.id === userId) || mockUsers[0]

  const handleRequestSwap = () => {
    router.push(`/request/${userId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
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
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
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

          <p className="text-gray-700 mt-4">{user.bio}</p>

          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div>
              <span className="font-medium text-gray-900">Experience:</span>
              <p className="text-gray-600">{user.experience}</p>
            </div>
            <div>
              <span className="font-medium text-gray-900">Response Time:</span>
              <p className="text-gray-600">{user.responseTime}</p>
            </div>
          </div>
        </div>

        {/* Skills Offered */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills Offered</h3>
          <div className="flex flex-wrap gap-2">
            {user.skillsOffered.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills Wanted</h3>
          <div className="flex flex-wrap gap-2">
            {user.skillsWanted.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
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
