"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "react-query"
import { Eye, EyeOff } from "lucide-react"
import { login } from "../lib/api"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user", // Add role to form state
  })
  const [errors, setErrors] = useState({})

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const loginMutation = useMutation(login, {
    onSuccess: async (data, variables) => {
      console.log("Login successful:", data)
      try {
        const user = data.data.user;
        // Check if the selected role matches the user's actual role
        if (user.role !== variables.role && !(variables.role === "admin" && (user.is_admin || user.is_staff || user.is_superuser))) {
          setErrors({ general: "You do not have the selected role. Please select the correct role." })
          return;
        }
        // Set the auth data directly in the cache
        queryClient.setQueryData("auth", {
          authenticated: true,
          user
        })
        // Role-based redirect
        if (user.is_admin || user.is_staff || user.is_superuser || user.role === "admin") {
          navigate("/admin", { replace: true })
        } else {
          navigate("/home", { replace: true })
        }
      } catch (error) {
        console.error("Error during login redirect:", error)
        navigate("/home", { replace: true })
      }
    },
    onError: (error) => {
      console.error("Login error:", error)
      if (error.response?.data) {
        setErrors(error.response.data)
      } else {
        setErrors({ general: "Login failed. Please try again." })
      }
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrors({})
    loginMutation.mutate(formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-indigo-600">
            SkillSwap
          </Link>
          <h2 className="mt-4 text-2xl font-semibold text-gray-900">Welcome back</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errors.general}</div>
          )}

          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your email"
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isLoading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
          >
            {loginMutation.isLoading ? "Signing In..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
