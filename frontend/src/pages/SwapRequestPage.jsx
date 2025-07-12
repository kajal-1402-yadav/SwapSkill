"use client"

import { useState } from "react" // Import useEffect
import { useParams, useNavigate, Link } from "react-router-dom" // Use useNavigate from react-router-dom
import { useQuery, useMutation, useQueryClient } from "react-query" // Import useQuery, useMutation, useQueryClient
import BottomNav from "../components/BottomNav"
import { ArrowLeft } from "lucide-react"
import { getUserDetail, getUserSkills, createSwapRequest } from "../lib/api" // Import API functions
import LoadingSpinner from "../components/LoadingSpinner" // Import LoadingSpinner

export default function SwapRequestPage() {
  const params = useParams()
  const navigate = useNavigate()
  const userId = Number.parseInt(params.id)
  const queryClient = useQueryClient()

  // Fetch target user details
  const {
    data: targetUserData,
    isLoading: isLoadingTargetUser,
    error: targetUserError,
  } = useQuery(["user", userId], () => getUserDetail(userId))

  // Fetch current user's offered skills
  const {
    data: currentUserSkillsData,
    isLoading: isLoadingCurrentUserSkills,
    error: currentUserSkillsError,
  } = useQuery("currentUserSkills", () => getUserSkills())

  const [formData, setFormData] = useState({
    skillOfferedId: "", // Changed to ID
    skillWantedId: "", // Changed to ID
    message: "",
    duration: "",
    preferredTime: "",
  })

  const [errors, setErrors] = useState({})

  const createSwapMutation = useMutation(createSwapRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries("receivedRequests") // Invalidate received requests
      queryClient.invalidateQueries("sentRequests") // Invalidate sent requests (if implemented)
      alert("Swap request sent successfully!")
      navigate("/home")
    },
    onError: (error) => {
      console.error("Failed to send swap request:", error.response?.data || error)
      setErrors(error.response?.data || { general: "Failed to send swap request. Please try again." })
    },
  })

  const validateForm = () => {
    const newErrors = {}

    if (!formData.skillOfferedId) newErrors.skillOfferedId = "Please select a skill to offer"
    if (!formData.skillWantedId) newErrors.skillWantedId = "Please select a skill you want"
    if (!formData.message.trim()) newErrors.message = "Please include a message"
    if (!formData.duration) newErrors.duration = "Please specify session duration"
    if (!formData.preferredTime) newErrors.preferredTime = "Please specify your preferred time"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      createSwapMutation.mutate({
        to_user_id: userId,
        skill_offered_id: Number.parseInt(formData.skillOfferedId),
        skill_wanted_id: Number.parseInt(formData.skillWantedId),
        message: formData.message,
        duration: formData.duration,
        preferred_time: formData.preferredTime,
      })
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  if (isLoadingTargetUser || isLoadingCurrentUserSkills) {
    return <LoadingSpinner />
  }

  if (targetUserError || currentUserSkillsError) {
    console.error("Target user error:", targetUserError)
    console.error("Current user skills error:", currentUserSkillsError)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error loading data</h2>
          <p className="text-gray-600">Failed to load user or skills data.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (targetUserError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error loading user</h2>
          <p className="text-gray-600">User not found or an error occurred.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const targetUser = targetUserData?.data || {}
  // UserSkillListView returns array directly, not wrapped in data property
  const currentUserOfferedSkills = Array.isArray(currentUserSkillsData) 
    ? currentUserSkillsData.filter((s) => s.skill_type === "offered") 
    : []
  const targetUserOfferedSkills = targetUser.skills_offered_details || [] // Assuming backend provides details

  const hasOfferedSkills = currentUserOfferedSkills.length > 0;
  const hasTargetSkills = Array.isArray(targetUser.skills_offered) && targetUser.skills_offered.length > 0;

  // Debug logging
  console.log("currentUserSkillsData:", currentUserSkillsData)
  console.log("currentUserOfferedSkills:", currentUserOfferedSkills)
  console.log("targetUser:", targetUser)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">Request Skill Swap</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Target User Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Requesting swap with {targetUser.full_name}</h2>
          <div className="text-sm text-gray-600">
            <p>They offer: {targetUser.skills_offered?.join(", ") || "N/A"}</p>
            <p>They want: {targetUser.skills_wanted?.join(", ") || "N/A"}</p>
          </div>
        </div>

        {/* Request Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            {/* Skill to Offer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skill you want to offer *</label>
              {!hasOfferedSkills && (
                <div className="mb-2 text-red-600 text-sm">
                  You have no skills to offer. <Link to="/edit-profile" className="text-blue-600 underline">Add skills</Link> in your profile.
                </div>
              )}
              <select
                value={formData.skillOfferedId}
                onChange={(e) => handleInputChange("skillOfferedId", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.skillOfferedId ? "border-red-500" : "border-gray-300"
                }`}
                disabled={!hasOfferedSkills}
              >
                <option value="">Select a skill to offer</option>
                {currentUserOfferedSkills.map((userSkill) => (
                  <option key={userSkill.id} value={userSkill.skill}>
                    {userSkill.skill_name}
                  </option>
                ))}
              </select>
              {errors.skillOfferedId && <p className="text-red-500 text-sm mt-1">{errors.skillOfferedId}</p>}
            </div>

            {/* Skill Wanted */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skill you want to learn *</label>
              {!hasTargetSkills && (
                <div className="mb-2 text-red-600 text-sm">
                  The other user has no skills to offer. Try another user.
                </div>
              )}
              <select
                value={formData.skillWantedId}
                onChange={(e) => handleInputChange("skillWantedId", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.skillWantedId ? "border-red-500" : "border-gray-300"
                }`}
                disabled={!hasTargetSkills}
              >
                <option value="">Select a skill to learn</option>
                {Array.isArray(targetUser.skills_offered) ? targetUser.skills_offered.map((skillName, index) => {
                  const skillDetail = targetUserOfferedSkills.find((s) => s.name === skillName);
                  return (
                    <option key={index} value={skillDetail?.id || skillName}>
                      {skillName}
                    </option>
                  );
                }) : null}
              </select>
              {errors.skillWantedId && <p className="text-red-500 text-sm mt-1">{errors.skillWantedId}</p>}
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
              disabled={createSwapMutation.isLoading}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {createSwapMutation.isLoading ? "Sending Request..." : "Send Swap Request"}
            </button>
          </div>
        </form>
      </main>

      <BottomNav />
    </div>
  )
}
