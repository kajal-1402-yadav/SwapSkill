"use client"

import { useState } from "react"
import BottomNav from "@/components/BottomNav"
import { Clock, Check, X, User } from "lucide-react"

// Mock requests data
const mockRequests = [
  {
    id: 1,
    fromUser: {
      name: "Emily Johnson",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    skillOffered: "Graphic Design",
    skillWanted: "React",
    message:
      "Hi! I'd love to learn React from you. I have 3 years of experience in graphic design and would be happy to help you with any design projects.",
    duration: "1 hour",
    preferredTime: "Weekend Evening",
    status: "pending",
    createdAt: "2 hours ago",
  },
  {
    id: 2,
    fromUser: {
      name: "David Kim",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    skillOffered: "Mobile Development",
    skillWanted: "JavaScript",
    message:
      "Hello! I'm an iOS developer looking to expand into web development. I can teach you Swift and mobile app development in exchange for JavaScript fundamentals.",
    duration: "1.5 hours",
    preferredTime: "Weekday Evening",
    status: "pending",
    createdAt: "1 day ago",
  },
  {
    id: 3,
    fromUser: {
      name: "Lisa Wang",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    skillOffered: "Data Science",
    skillWanted: "UI/UX Design",
    message:
      "I'm a data scientist interested in learning UI/UX design principles. I can help you with Python, machine learning, or data analysis.",
    duration: "2 hours",
    preferredTime: "Weekend Morning",
    status: "accepted",
    createdAt: "3 days ago",
  },
]

export default function SwapRequestsPage() {
  const [requests, setRequests] = useState(mockRequests)
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all")

  const handleAccept = (requestId: number) => {
    setRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, status: "accepted" } : req)))
  }

  const handleReject = (requestId: number) => {
    setRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, status: "rejected" } : req)))
  }

  const filteredRequests = requests.filter((req) => filter === "all" || req.status === filter)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "accepted":
        return <Check className="w-4 h-4" />
      case "rejected":
        return <X className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Swap Requests</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {["all", "pending", "accepted", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                filter === status ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== "all" && (
                <span className="ml-1">({requests.filter((req) => req.status === status).length})</span>
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-500">
              {filter === "all" ? "You don't have any swap requests yet." : `No ${filter} requests found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={request.fromUser.avatar || "/placeholder.svg"}
                    alt={request.fromUser.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{request.fromUser.name}</h3>
                        <p className="text-sm text-gray-500">{request.createdAt}</p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}
                      >
                        {getStatusIcon(request.status)}
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Offers:</span>
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          {request.skillOffered}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Wants:</span>
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {request.skillWanted}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Duration:</span>
                        <span className="ml-2 text-gray-600">{request.duration}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Time:</span>
                        <span className="ml-2 text-gray-600">{request.preferredTime}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{request.message}</p>

                    {request.status === "pending" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAccept(request.id)}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {request.status === "accepted" && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-green-800 text-sm font-medium">
                          ✅ Request accepted! You can now coordinate the skill swap session.
                        </p>
                      </div>
                    )}

                    {request.status === "rejected" && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-800 text-sm font-medium">❌ Request rejected.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
