import { Link } from "react-router-dom"
import { ArrowRight, Users, Star, Calendar } from "lucide-react"
import { useQuery } from "react-query"
import { checkAuth } from "../lib/api"

export default function LandingPage() {
  const { data: authData } = useQuery("auth", checkAuth, {
    retry: false,
    refetchOnWindowFocus: false,
  })

  const isAuthenticated = authData?.authenticated || false

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="px-4 py-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-600">SkillSwap</div>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <Link to="/home" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Exchange Skills,
            <span className="text-indigo-600"> Build Community</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with people who want to learn what you know, and learn what they know. Trade skills, share
            knowledge, and grow together.
          </p>

          <Link
            to={isAuthenticated ? "/home" : "/register"}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Find Your Match</h3>
            <p className="text-gray-600">Browse profiles and find people with complementary skills</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality Connections</h3>
            <p className="text-gray-600">Connect with rated and verified skill sharers</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
            <p className="text-gray-600">Set your availability and schedule swaps that work for you</p>
          </div>
        </div>
      </main>
    </div>
  )
}
