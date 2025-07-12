"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { Search } from "lucide-react"
import { getUsers } from "../lib/api"
import UserCard from "../components/UserCard"
import BottomNav from "../components/BottomNav"
import LoadingSpinner from "../components/LoadingSpinner"

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const queryClient = useQueryClient();
  const authData = queryClient.getQueryData("auth");
  const isAuthenticated = authData?.authenticated;

  const {
    data: usersData,
    isLoading,
    error,
  } = useQuery(
    ["users", { search: searchTerm, page: currentPage }],
    () => getUsers({ search: searchTerm, page: currentPage }),
    {
      keepPreviousData: true,
      retry: 3,
      retryDelay: 1000,
      enabled: !!isAuthenticated, // Only fetch if authenticated
    },
  )

  if (isLoading && !usersData) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error loading users</h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    )
  }

  const users = usersData?.data?.results || []
  const totalPages = Math.ceil((usersData?.data?.count || 0) / 10)

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
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </header>

      {/* User Grid */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {isLoading ? "Loading users..." : "No users found matching your search."}
            </p>
            {error && (
              <p className="text-red-500 text-sm mt-2">
                Error: {error.response?.data?.detail || error.message}
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              {users.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>

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

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
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
                  )
                })}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
