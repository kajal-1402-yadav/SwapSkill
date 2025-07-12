"use client"

import { useState, useEffect } from "react"
import UserCard from "@/components/UserCard"
import BottomNav from "@/components/BottomNav"
import { Search } from "lucide-react"

// Mock data
const mockUsers = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: "/placeholder.svg?height=100&width=100",
    skillsOffered: ["React", "JavaScript", "UI/UX Design"],
    skillsWanted: ["Python", "Data Science", "Machine Learning"],
    availability: "Weekends",
    rating: 4.8,
    location: "San Francisco, CA",
  },
  {
    id: 2,
    name: "Mike Rodriguez",
    avatar: "/placeholder.svg?height=100&width=100",
    skillsOffered: ["Python", "Django", "Data Analysis"],
    skillsWanted: ["React", "Frontend Development", "Mobile Development"],
    availability: "Evenings",
    rating: 4.9,
    location: "Austin, TX",
  },
  {
    id: 3,
    name: "Emily Johnson",
    avatar: "/placeholder.svg?height=100&width=100",
    skillsOffered: ["Graphic Design", "Photoshop", "Branding"],
    skillsWanted: ["Web Development", "CSS", "Animation"],
    availability: "Flexible",
    rating: 4.7,
    location: "New York, NY",
  },
  {
    id: 4,
    name: "David Kim",
    avatar: "/placeholder.svg?height=100&width=100",
    skillsOffered: ["Mobile Development", "Swift", "iOS"],
    skillsWanted: ["Backend Development", "Node.js", "Databases"],
    availability: "Weekdays",
    rating: 4.6,
    location: "Seattle, WA",
  },
  {
    id: 5,
    name: "Lisa Wang",
    avatar: "/placeholder.svg?height=100&width=100",
    skillsOffered: ["Data Science", "Machine Learning", "Statistics"],
    skillsWanted: ["Web Development", "JavaScript", "React"],
    availability: "Weekends",
    rating: 4.9,
    location: "Boston, MA",
  },
  {
    id: 6,
    name: "Alex Thompson",
    avatar: "/placeholder.svg?height=100&width=100",
    skillsOffered: ["Digital Marketing", "SEO", "Content Strategy"],
    skillsWanted: ["Web Analytics", "Data Visualization", "Python"],
    availability: "Evenings",
    rating: 4.5,
    location: "Denver, CO",
  },
]

export default function HomePage() {
  const [users, setUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 4

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.skillsOffered.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.skillsWanted.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Discover Skills</h1>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </header>

      {/* User Grid */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-6">
          {currentUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No users found matching your search.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg border ${
                  currentPage === page
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
