import { useEffect } from "react"
import { useAuthStore } from "./stores/authStore"
import api from "./lib/api"

function App() {
  const setAuth = useAuthStore((state) => state.setAuth)
  const logout = useAuthStore((state) => state.logout)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    api.get("/auth/user/", { withCredentials: true })
      .then((res) => {
        console.log("Session check user data:", res.data)
        setAuth(res.data)
      })
      .catch(() => logout())
  }, [])

  // Use isAuthenticated for routing/UI
}