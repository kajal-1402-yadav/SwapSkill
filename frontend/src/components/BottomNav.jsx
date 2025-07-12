import { useLocation } from "react-router-dom"
import { Link } from "react-router-dom"
import { Home, MessageSquare, User } from "lucide-react"
import { logout } from '../lib/api';
import { useNavigate } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { href: "/home", icon: Home, label: "Home" },
    { href: "/requests", icon: MessageSquare, label: "Requests" },
    { href: "/profile", icon: User, label: "Profile" },
  ]

  const handleLogout = async () => {
    console.log("Logging out (user)");
    try {
      await logout();
    } catch (e) {}
    // Robustly clear cached auth state
    if (window.localStorage) {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("currentUser");
    }
    if (window.sessionStorage) {
      sessionStorage.clear();
    }
    if (window.queryClient) {
      window.queryClient.removeQueries && window.queryClient.removeQueries('auth');
    } else if (typeof window !== 'undefined' && window.__REACT_QUERY_CLIENT__) {
      window.__REACT_QUERY_CLIENT__.removeQueries('auth');
    }
    // Optionally, force reload to clear any lingering state
    // window.location.href = '/login';
    navigate('/login', { replace: true });
    window.location.href = '/login';
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = location.pathname === href;
          return (
            <Link
              key={href}
              to={href}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                isActive ? "text-indigo-600 bg-indigo-50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg text-red-600 hover:text-white hover:bg-red-500 transition-colors"
        >
          <span className="material-icons text-2xl">logout</span>
          <span className="text-xs font-medium">Logout</span>
        </button>
      </div>
    </nav>
  )
}
