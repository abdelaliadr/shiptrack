import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

// Where each role lands by default
const roleHome = {
  BUSINESS: '/dashboard',
  AGENT: '/agent',
  ADMIN: '/admin',
}

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = useAuthStore((state) => state.token)
  const role = useAuthStore((state) => state.role)

  // 1. Not logged in -> go to login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // 2. Logged in but wrong role -> send them to their own home page
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={roleHome[role] || '/login'} replace />
  }

  // 3. All good -> show the page
  return children
}