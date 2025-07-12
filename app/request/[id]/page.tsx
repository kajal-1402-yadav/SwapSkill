"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import BottomNav from "@/components/BottomNav"
import { ArrowLeft } from "lucide-react"

// Mock current user skills
const currentUserSkills = ["React", "JavaScript", "CSS", "Node.js", "MongoDB"]

// Mock target user data
const mockUsers = [
  {
    id: 1,
    name: "Sarah Chen",
    skillsOffered: ["React", "JavaScript", "UI/UX Design"],
    skillsWanted: ["Python", "Data Science", "Machine Learning"],
  },
  {
    id: 2,
    name: "Mike Rodriguez",
    skillsOffered: ["Python", "Django", "Data Analysis"],
    skillsWanted: ["React", "Frontend Development", "Mobile Development"],
  },
]

export default function SwapRequestPage() {
  const params = useParams()
  const router = useRouter()
  const userId = Number.parseInt(params.id as string)

  const targetUser = mockUsers.find((u) => u.id === userId) || mockUsers[0]

  const [formData, setFormData] = useState({
    skillOffered: "",
    skillWanted: "",
    message: "",
    duration: "",
    preferredTime: "",
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.skillOffered) newErrors.skillOffered = "Please select a skill to offer"
    if (!formData.skillWanted) newErrors.skillWanted = "Please select a skill you want"
    if (!formData.message.trim()) newErrors.message = "Please include a message"
    if (!formData.duration) newErrors.duration = "Please specify session duration"
    if (!formData.preferredTime) newErrors.preferredTime = "Please specify your preferred time"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Mock request submission
      alert("Swap request sent successfully!")
      router.push("/home")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">Request Skill Swap</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Target User Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Requesting swap with {targetUser.name}</h2>
          <div className="text-sm text-gray-600">
            <p>They offer: {targetUser.skillsOffered.join(", ")}</p>
            <p>They want: {targetUser.skillsWanted.join(", ")}</p>
          </div>
        </div>

        {/* Request Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            {/* Skill to Offer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skill you want to offer *</label>
              <select
                value={formData.skillOffered}
                onChange={(e) => handleInputChange("skillOffered", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.skillOffered ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a skill to offer</option>
                {currentUserSkills.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
              {errors.skillOffered && <p className="text-red-500 text-sm mt-1">{errors.skillOffered}</p>}
            </div>

            {/* Skill Wanted */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skill you want to learn *</label>
              <select
                value={formData.skillWanted}
                onChange={(e) => handleInputChange("skillWanted", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.skillWanted ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a skill to learn</option>
                {targetUser.skillsOffered.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
              {errors.skillWanted && <p className="text-red-500 text-sm mt-1">{errors.skillWanted}</p>}
            </div>

            {/* Session Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred session duration *</label>
              <select
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.duration ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select duration</option>
                <option value="30min">30 minutes</option>
                <option value="1hour">1 hour</option>
                <option value="1.5hours">1.5 hours</option>
                <option value="2hours">2 hours</option>
                <option value="flexible">Flexible</option>
              </select>
              {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
            </div>

            {/* Preferred Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred time *</label>
              <select
                value={formData.preferredTime}
                onChange={(e) => handleInputChange("preferredTime", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.preferredTime ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select preferred time</option>
                <option value="weekday-morning">Weekday Morning</option>
                <option value="weekday-afternoon">Weekday Afternoon</option>
                <option value="weekday-evening">Weekday Evening</option>
                <option value="weekend-morning">Weekend Morning</option>
                <option value="weekend-afternoon">Weekend Afternoon</option>
                <option value="weekend-evening">Weekend Evening</option>
                <option value="flexible">Flexible</option>
              </select>
              {errors.preferredTime && <p className="text-red-500 text-sm mt-1">{errors.preferredTime}</p>}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Personal message *</label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                rows={4}
                placeholder="Introduce yourself and explain why you'd like to do this skill swap..."
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
                  errors.message ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Send Swap Request
            </button>
          </div>
        </form>
      </main>

      <BottomNav />
    </div>
  )
}
