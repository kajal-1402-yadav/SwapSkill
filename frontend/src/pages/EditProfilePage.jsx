"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { ArrowLeft } from "lucide-react"
import { getProfile, updateProfile, uploadAvatar, getSkills, getUserSkills, addUserSkill, deleteUserSkill } from "../lib/api"
import BottomNav from "../components/BottomNav"
import AvatarUpload from "../components/AvatarUpload"
import LoadingSpinner from "../components/LoadingSpinner"

export default function EditProfilePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: profileData, isLoading } = useQuery("profile", getProfile)

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    bio: "",
    location: "",
    availability: "",
    experience_level: "",
    response_time: "",
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (profileData?.data) {
      const { first_name, last_name, bio, location, availability, experience_level, response_time } = profileData.data
      setFormData({
        first_name: first_name || "",
        last_name: last_name || "",
        bio: bio || "",
        location: location || "",
        availability: availability || "",
        experience_level: experience_level || "",
        response_time: response_time || "",
      })
    }
  }, [profileData])

  const updateProfileMutation = useMutation(updateProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries("profile")
      queryClient.invalidateQueries("auth")
      navigate("/profile")
    },
    onError: (error) => {
      if (error.response?.data) {
        setErrors(error.response.data)
      } else {
        setErrors({ general: "Failed to update profile" })
      }
    },
  })

  const avatarMutation = useMutation(uploadAvatar, {
    onSuccess: () => {
      queryClient.invalidateQueries("profile")
      queryClient.invalidateQueries("auth")
    },
  })

  // --- Skill Management ---
  const { data: allSkillsData } = useQuery("skills", getSkills)
  const { data: userSkillsData, refetch: refetchUserSkills } = useQuery("userSkills", getUserSkills)
  const addSkillMutation = useMutation(addUserSkill, { onSuccess: refetchUserSkills, onError: (e) => { console.error('Add skill error:', e) } })
  const deleteSkillMutation = useMutation(deleteUserSkill, { onSuccess: refetchUserSkills, onError: (e) => { console.error('Delete skill error:', e) } })

  // Debug logging
  console.log('allSkillsData:', allSkillsData)
  console.log('userSkillsData:', userSkillsData)

  // Helper: Robustly extract skills array from API response
  function extractArray(data) {
    if (Array.isArray(data)) return data
    if (data && Array.isArray(data.results)) return data.results
    if (data && Array.isArray(data.data)) return data.data
    return []
  }

  const allSkills = extractArray(allSkillsData)
  const userSkills = extractArray(userSkillsData)
  const offeredSkills = userSkills.filter((s) => s.skill_type === "offered")
  const wantedSkills = userSkills.filter((s) => s.skill_type === "wanted")

  // Add skill handlers (now using skill ID)
  const handleAddSkill = (skillId, type) => {
    const skill = allSkills.find((s) => s.id === Number(skillId))
    if (!skill) return
    addSkillMutation.mutate({ skill_name: skill.name, skill_type: type, proficiency_level: "beginner" })
  }

  const handleRemoveSkill = (userSkillId) => {
    deleteSkillMutation.mutate(userSkillId)
  }

  // Helper: Get available skills for dropdowns (exclude already added)
  const offeredSkillIds = new Set(offeredSkills.map((s) => s.skill))
  const wantedSkillIds = new Set(wantedSkills.map((s) => s.skill))
  const availableOfferedSkills = allSkills.filter((s) => !offeredSkillIds.has(s.id))
  const availableWantedSkills = allSkills.filter((s) => !wantedSkillIds.has(s.id))

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrors({})
    updateProfileMutation.mutate(formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleAvatarUpload = async (file) => {
    return avatarMutation.mutateAsync(file)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">Edit Profile</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errors.general}</div>
        )}

        {/* Avatar Upload */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h2>
          <AvatarUpload currentAvatar={profileData?.data?.avatar} onUpload={handleAvatarUpload} className="mb-2" />
          <p className="text-sm text-gray-500 text-center">Upload a profile picture (JPEG, PNG, or GIF, max 5MB)</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.first_name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your first name"
                    required
                  />
                  {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.last_name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your last name"
                    required
                  />
                  {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
                    errors.bio ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Tell others about yourself and your experience"
                />
                {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">When are you available?</label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.availability ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select your availability</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
                <option value="evenings">Evenings</option>
                <option value="mornings">Mornings</option>
                <option value="flexible">Flexible</option>
              </select>
              {errors.availability && <p className="text-red-500 text-sm mt-1">{errors.availability}</p>}
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <select
                  name="experience_level"
                  value={formData.experience_level}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select experience level</option>
                  <option value="beginner">Beginner (0-1 years)</option>
                  <option value="intermediate">Intermediate (2-4 years)</option>
                  <option value="advanced">Advanced (5+ years)</option>
                  <option value="expert">Expert (10+ years)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Response Time</label>
                <select
                  name="response_time"
                  value={formData.response_time}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select typical response time</option>
                  <option value="1hour">Within 1 hour</option>
                  <option value="3hours">Within 3 hours</option>
                  <option value="24hours">Within 24 hours</option>
                  <option value="2-3days">Within 2-3 days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Skills I Offer */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills I Offer</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {offeredSkills.map((userSkill) => {
                const skill = allSkills.find((s) => s.id === userSkill.skill)
                return (
                  <span key={userSkill.id} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {skill ? skill.name : userSkill.skill_name}
                    <button type="button" onClick={() => handleRemoveSkill(userSkill.id)} className="hover:bg-green-200 rounded-full p-0.5">&times;</button>
                  </span>
                )
              })}
            </div>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => { if (e.target.value) { handleAddSkill(e.target.value, "offered"); e.target.value = "" } }}
              defaultValue=""
            >
              <option value="">Add a skill you can teach</option>
              {availableOfferedSkills.map((skill) => (
                <option key={skill.id} value={skill.id}>{skill.name}</option>
              ))}
            </select>
          </div>

          {/* Skills I Want to Learn */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills I Want to Learn</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {wantedSkills.map((userSkill) => {
                const skill = allSkills.find((s) => s.id === userSkill.skill)
                return (
                  <span key={userSkill.id} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {skill ? skill.name : userSkill.skill_name}
                    <button type="button" onClick={() => handleRemoveSkill(userSkill.id)} className="hover:bg-blue-200 rounded-full p-0.5">&times;</button>
                  </span>
                )
              })}
            </div>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => { if (e.target.value) { handleAddSkill(e.target.value, "wanted"); e.target.value = "" } }}
              defaultValue=""
            >
              <option value="">Add a skill you want to learn</option>
              {availableWantedSkills.map((skill) => (
                <option key={skill.id} value={skill.id}>{skill.name}</option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateProfileMutation.isLoading}
              className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {updateProfileMutation.isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </main>

      <BottomNav />
    </div>
  )
}
