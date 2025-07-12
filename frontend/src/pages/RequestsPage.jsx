"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "react-query" // Add useQueryClient
import BottomNav from "../components/BottomNav"
import { Clock, Check, X, User } from "lucide-react"
import { getReceivedRequests, updateRequestStatus } from "../lib/api" // Import API functions
import LoadingSpinner from "../components/LoadingSpinner" // Import LoadingSpinner
import { formatDate, getAvatarUrl } from "../lib/utils" // Import utility functions

export default function SwapRequestsPage() {
  const [filter, setFilter] = useState("all")
  const queryClient = useQueryClient()

  const {
    data: requestsData,
    isLoading,
    error,
  } = useQuery(
    ["receivedRequests", filter],
    () => getReceivedRequests({ status: filter === "all" ? undefined : filter }),
    {
      // Keep previous data while fetching new data for different filters
      keepPreviousData: true,
    },
  )

  const updateStatusMutation = useMutation(
    ({ id, status }) => updateRequestStatus(id, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("receivedRequests") // Invalidate to refetch requests
      },
      onError: (err) => {
        console.error("Failed to update request status:", err)
        alert("Failed to update request status. Please try again.")
      },
    },
  )

  const handleAccept = (requestId) => {
    updateStatusMutation.mutate({ id: requestId, status: "accepted" })
  }

  const handleReject = (requestId) => {
    updateStatusMutation.mutate({ id: requestId, status: "rejected" })
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error loading swap requests</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    )
  }

  // Backend returns array directly, not wrapped in data property
  const requests = Array.isArray(requestsData) ? requestsData : []

  const getStatusColor = (status) => {
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

  const getStatusIcon = (status) => {
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
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                filter === status ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== "all" && (
                <span className="ml-1">({Array.isArray(requestsData) ? requestsData.filter((req) => req.status === status).length : 0})</span>
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {requests.length === 0 ? (
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
            {requests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={getAvatarUrl(request.from_user.avatar) || "/placeholder.svg"} // Use getAvatarUrl
                    alt={request.from_user.full_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{request.from_user.full_name}</h3>
                        <p className="text-sm text-gray-500">{formatDate(request.created_at)}</p> {/* Use formatDate */}
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
                          {request.skill_offered.name}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Wants:</span>
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {request.skill_wanted.name}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Duration:</span>
                        <span className="ml-2 text-gray-600">{request.duration}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Time:</span>
                        <span className="ml-2 text-gray-600">{request.preferred_time}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{request.message}</p>

                    {request.status === "pending" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAccept(request.id)}
                          disabled={updateStatusMutation.isLoading}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                        >
                          {updateStatusMutation.isLoading ? "Accepting..." : "Accept"}
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          disabled={updateStatusMutation.isLoading}
                          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                        >
                          {updateStatusMutation.isLoading ? "Rejecting..." : "Reject"}
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
