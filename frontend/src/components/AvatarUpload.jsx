"use client"

import { useState, useRef } from "react"
import { Upload, X, Check } from "lucide-react"
import { getAvatarUrl } from "../lib/utils"

export default function AvatarUpload({ currentAvatar, onUpload, className = "" }) {
  const [preview, setPreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif"]
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, or GIF)")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large. Maximum size is 5MB.")
      return
    }

    // Clear any previous errors
    setError(null)

    // Create a preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.length) return

    const file = fileInputRef.current.files[0]
    setIsUploading(true)
    setError(null)

    try {
      await onUpload(file)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      setPreview(null)
    } catch (err) {
      setError(err.response?.data?.error || "Failed to upload avatar")
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    setPreview(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
          {preview ? (
            <img src={preview || "/placeholder.svg"} alt="Avatar preview" className="w-full h-full object-cover" />
          ) : (
            <img
              src={getAvatarUrl(currentAvatar) || "/placeholder.svg?height=128&width=128"}
              alt="Current avatar"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <label
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors"
        >
          <Upload className="w-5 h-5" />
          <span className="sr-only">Upload avatar</span>
        </label>

        <input
          id="avatar-upload"
          type="file"
          accept="image/jpeg,image/png,image/gif"
          className="hidden"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {preview && (
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            {isUploading ? "Uploading..." : "Save"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isUploading}
            className="flex items-center gap-1 bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
