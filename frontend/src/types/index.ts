export interface User {
  id: number
  email: string
  username: string
  first_name: string
  last_name: string
  full_name: string
  bio: string
  location: string
  avatar?: string
  availability: string
  experience_level: string
  response_time: string
  rating: number
  completed_swaps: number
  created_at: string
  skills_offered?: string[]
  skills_wanted?: string[]
}

export interface Skill {
  id: number
  name: string
  category: string
  description: string
}

export interface UserSkill {
  id: number
  skill: number
  skill_name: string
  skill_category: string
  skill_type: "offered" | "wanted"
  proficiency_level: string
}

export interface SwapRequest {
  id: number
  from_user: User
  to_user: User
  skill_offered: Skill
  skill_wanted: Skill
  message: string
  duration: string
  preferred_time: string
  status: "pending" | "accepted" | "rejected" | "completed" | "cancelled"
  created_at: string
  updated_at: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  first_name: string
  last_name: string
  password: string
  password_confirm: string
}
