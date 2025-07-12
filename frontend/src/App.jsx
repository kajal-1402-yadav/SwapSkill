import { Routes, Route, Navigate } from "react-router-dom"
import { useQuery } from "react-query"
import { checkAuth } from "./lib/api"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import HomePage from "./pages/HomePage"
import UserDetailPage from "./pages/UserDetailPage"
import SwapRequestPage from "./pages/SwapRequestPage"
import RequestsPage from "./pages/RequestsPage"
import ProfilePage from "./pages/ProfilePage"
import EditProfilePage from "./pages/EditProfilePage"
import LoadingSpinner from "./components/LoadingSpinner"
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const { data: authData, isLoading, refetch, error } = useQuery("auth", checkAuth, {
    retry: 3,
    retryDelay: 1000,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: true,
    refetchOnReconnect: true,
    onSuccess: (data) => {
      console.log("Auth query success:", data)
    },
    onError: (error) => {
      console.error("Auth query error:", error)
    },
  })

  if (isLoading) {
    return <LoadingSpinner />
  }

  const isAuthenticated = authData?.authenticated || false;
  const user = authData?.user;
  const isAdmin = user && (user.is_admin || user.is_staff || user.is_superuser);

  // Redirect logic after login
  // If on /login and authenticated, redirect to /admin if admin, else /home
  if (window.location.pathname === "/login" && isAuthenticated) {
    if (isAdmin) {
      window.location.replace("/admin");
    } else {
      window.location.replace("/home");
    }
    return null;
  }

  console.log("App - authData:", authData)
  console.log("App - isAuthenticated:", isAuthenticated)
  console.log("App - isLoading:", isLoading)
  console.log("App - error:", error)
  console.log("App - current pathname:", window.location.pathname)
  console.log("App - cookies:", document.cookie)
  
  // Check if session cookie exists
  const sessionCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("sessionid="))
  console.log("App - session cookie:", sessionCookie)

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={isAuthenticated ? (isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/home" replace />) : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/home" replace /> : <RegisterPage />} />

      {/* Admin Dashboard - admin only */}
      <Route path="/admin" element={isAuthenticated && isAdmin ? <AdminDashboard /> : <Navigate to="/home" replace />} />

      {/* Protected Routes */}
      <Route path="/home" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />} />
      <Route path="/user/:id" element={isAuthenticated ? <UserDetailPage /> : <Navigate to="/login" replace />} />
      <Route path="/request/:id" element={isAuthenticated ? <SwapRequestPage /> : <Navigate to="/login" replace />} />
      <Route path="/requests" element={isAuthenticated ? <RequestsPage /> : <Navigate to="/login" replace />} />
      <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />} />
      <Route path="/edit-profile" element={isAuthenticated ? <EditProfilePage /> : <Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
