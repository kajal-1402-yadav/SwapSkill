"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import BottomNav from "@/components/BottomNav"
import { ArrowLeft, Plus, X } from "lucide-react"

// Available skills for selection
const availableSkills = [
  "React",
  "JavaScript",
  "Python",
  "Node.js",
  "CSS",
  "HTML",
  "TypeScript",
  "Vue.js",
  "Angular",
  "Django",
  "Flask",
  "Express.js",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "GraphQL",
  "REST APIs",
  "Git",
  "Docker",
  "AWS",
  "Azure",
  "GCP",
  "Machine Learning",
  "Data Science",
  "AI",
  "UI/UX Design",
  "Figma",
  "Photoshop",
  "Illustrator",
  "Mobile Development",
  "iOS",
  "Android",
  "React Native",
  "Flutter",
  "DevOps",
  "CI/CD",
  "Testing",
  "Agile",
  "Scrum",
  "Project Management",
]

export default function EditProfilePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    availability: "",
    skillsOffered: [] as string[],
    skillsWanted: [] as string[],
    experience: "",
    responseTime: "",
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [showSkillsOfferedDropdown, setShowSkillsOfferedDropdown] = useState(false)
  const [showSkillsWantedDropdown, setShowSkillsWantedDropdown] = useState(false)

  useEffect(() => {
    // Load current user data
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      const user = JSON.parse(userData)
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        location: user.location || "",
        availability: user.availability || "",
        skillsOffered: user.skillsOffered || [],
        skillsWanted: user.skillsWanted || [],
        experience: user.experience || "",
        responseTime: user.responseTime || "",
      })
    }
  }, [])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.bio.trim()) newErrors.bio = "Bio is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.availability) newErrors.availability = "Availability is required"
    if (formData.skillsOffered.length === 0) newErrors.skillsOffered = "At least one skill offered is required"
    if (formData.skillsWanted.length === 0) newErrors.skillsWanted = "At least one skill wanted is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Save to localStorage (in real app, this would be an API call)
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
      const updatedUser = { ...currentUser, ...formData }
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      alert("Profile updated successfully!")
      router.push("/profile")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const addSkill = (skill: string, type: "offered" | "wanted") => {
    const field = type === "offered" ? "skillsOffered" : "skillsWanted"
    if (!formData[field].includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], skill],
      }))
    }
    if (type === "offered") setShowSkillsOfferedDropdown(false)
    else setShowSkillsWantedDropdown(false)
  }

  const removeSkill = (skill: string, type: "offered" | "wanted") => {
    const field = type === "offered" ? "skillsOffered" : "skillsWanted"
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((s) => s !== skill),
    }))
  }

  const getAvailableSkills = (type: "offered" | "wanted") => {
    const currentSkills = type === "offered" ? formData.skillsOffered : formData.skillsWanted
    return availableSkills.filter((skill) => !currentSkills.includes(skill))
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">Edit Profile</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio *</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
                    errors.bio ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Tell others about yourself and your experience"
                />
                {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.location ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="City, State/Country"
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Availability</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">When are you available? *</label>
              <select
                value={formData.availability}
                onChange={(e) => handleInputChange("availability", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.availability ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select your availability</option>
                <option value="Weekdays">Weekdays</option>
                <option value="Weekends">Weekends</option>
                <option value="Evenings">Evenings</option>
                <option value="Mornings">Mornings</option>
                <option value="Flexible">Flexible</option>
              </select>
              {errors.availability && <p className="text-red-500 text-sm mt-1">{errors.availability}</p>}
            </div>
          </div>

          {/* Skills Offered */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills I Offer</h2>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSkillsOfferedDropdown(!showSkillsOfferedDropdown)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-left flex items-center justify-between"
              >
                <span className="text-gray-500">Add a skill you can teach</span>
                <Plus className="w-5 h-5 text-gray-400" />
              </button>

              {showSkillsOfferedDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {getAvailableSkills("offered").map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkill(skill, "offered")}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {formData.skillsOffered.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill, "offered")}
                    className="hover:bg-green-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            {errors.skillsOffered && <p className="text-red-500 text-sm mt-1">{errors.skillsOffered}</p>}
          </div>

          {/* Skills Wanted */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills I Want to Learn</h2>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSkillsWantedDropdown(!showSkillsWantedDropdown)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-left flex items-center justify-between"
              >
                <span className="text-gray-500">Add a skill you want to learn</span>
                <Plus className="w-5 h-5 text-gray-400" />
              </button>

              {showSkillsWantedDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {getAvailableSkills("wanted").map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkill(skill, "wanted")}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {formData.skillsWanted.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill, "wanted")}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            {errors.skillsWanted && <p className="text-red-500 text-sm mt-1">{errors.skillsWanted}</p>}
          </div>

          {/* Additional Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <select
                  value={formData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select experience level</option>
                  <option value="Beginner">Beginner (0-1 years)</option>
                  <option value="Intermediate">Intermediate (2-4 years)</option>
                  <option value="Advanced">Advanced (5+ years)</option>
                  <option value="Expert">Expert (10+ years)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Response Time</label>
                <select
                  value={formData.responseTime}
                  onChange={(e) => handleInputChange("responseTime", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select typical response time</option>
                  <option value="Usually responds within 1 hour">Within 1 hour</option>
                  <option value="Usually responds within 3 hours">Within 3 hours</option>
                  <option value="Usually responds within 24 hours">Within 24 hours</option>
                  <option value="Usually responds within 2-3 days">Within 2-3 days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </main>

      <BottomNav />
    </div>
  )
}
