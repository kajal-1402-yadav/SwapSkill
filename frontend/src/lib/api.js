import axios from "axios"

const API_BASE_URL = "http://localhost:8000/api"

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for session authentication
  headers: {
    "Content-Type": "application/json",
  },
})

// Get CSRF token for POST requests
export const getCSRFToken = async () => {
  try {
    const response = await axios.get("http://localhost:8000/admin/", { withCredentials: true })
    const csrfToken = response.headers["set-cookie"]
      ?.find((cookie) => cookie.startsWith("csrftoken="))
      ?.split("=")[1]
      ?.split(";")[0]
    return csrfToken
  } catch (error) {
    return null
  }
}

// Add CSRF token to requests
api.interceptors.request.use(
  async (config) => {
    console.log("API request:", config.method, config.url)
    console.log("API request cookies:", document.cookie)
    
    if (["post", "put", "patch", "delete"].includes(config.method)) {
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1]

      if (csrfToken) {
        config.headers["X-CSRFToken"] = csrfToken
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log("API response:", response.config.method, response.config.url, response.status)
    console.log("API response data:", response.data)
    return response
  },
  (error) => {
    console.error("API error:", error.config?.method, error.config?.url, error.response?.status)
    console.error("API error data:", error.response?.data)
    return Promise.reject(error)
  },
)

// Auth API calls
export const register = (userData) => api.post("/auth/register/", userData)
export const login = (credentials) => api.post("/auth/login/", credentials)
export const logout = () => api.post("/auth/logout/")
export const checkAuth = () => {
  console.log("checkAuth called - cookies:", document.cookie)
  return api.get("/auth/check/")
}
export const getProfile = () => api.get("/auth/profile/")
export const updateProfile = (data) => api.patch("/auth/profile/update/", data)

// New function for avatar upload
export const uploadAvatar = (file) => {
  const formData = new FormData()
  formData.append("avatar", file)

  return api.post("/auth/profile/avatar/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

// Users API calls
export const getUsers = (params) => api.get("/auth/users/", { params })
export const getUserDetail = (id) => api.get(`/auth/users/${id}/`)

// Skills API calls
export const getSkills = () => api.get("/skills/")
export const getUserSkills = () => api.get("/skills/user-skills/")
export const addUserSkill = (data) => api.post("/skills/user-skills/", data)
export const deleteUserSkill = (id) => api.delete(`/skills/user-skills/${id}/delete/`)

// Swaps API calls
export const getSwapRequests = (params) => api.get("/swaps/requests/", { params })
export const createSwapRequest = (data) => api.post("/swaps/requests/", data)
export const getReceivedRequests = (params) => api.get("/swaps/requests/received/", { params })
export const updateRequestStatus = (id, status) => api.patch(`/swaps/requests/${id}/status/`, { status })

export default api
