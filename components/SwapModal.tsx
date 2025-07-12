"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

interface SwapModalProps {
  isOpen: boolean
  onClose: () => void
  targetUser: {
    name: string
    skillsOffered: string[]
    skillsWanted: string[]
  }
  currentUserSkills: string[]
}

export default function SwapModal({ isOpen, onClose, targetUser, currentUserSkills }: SwapModalProps) {
  const [formData, setFormData] = useState({
    skillOffered: "",
    skillWanted: "",
    message: "",
    duration: "",
    preferredTime: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Swap request:", formData)
    alert("Swap request sent!")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Request Skill Swap</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Requesting swap with <strong>{targetUser.name}</strong>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skill you want to offer</label>
            <select
              value={formData.skillOffered}
              onChange={(e) => setFormData((prev) => ({ ...prev, skillOffered: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select a skill</option>
              {currentUserSkills.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skill you want to learn</label>
            <select
              value={formData.skillWanted}
              onChange={(e) => setFormData((prev) => ({ ...prev, skillWanted: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select a skill</option>
              {targetUser.skillsOffered.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Session duration</label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select duration</option>
              <option value="30min">30 minutes</option>
              <option value="1hour">1 hour</option>
              <option value="1.5hours">1.5 hours</option>
              <option value="2hours">2 hours</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred time</label>
            <select
              value={formData.preferredTime}
              onChange={(e) => setFormData((prev) => ({ ...prev, preferredTime: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select time</option>
              <option value="weekday-morning">Weekday Morning</option>
              <option value="weekday-evening">Weekday Evening</option>
              <option value="weekend">Weekend</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
              rows={3}
              placeholder="Introduce yourself and explain your interest..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
