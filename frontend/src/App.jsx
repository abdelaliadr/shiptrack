import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuthStore } from './store/authStore'

const roleHome = {
  BUSINESS: '/dashboard',
  AGENT: '/agent',
  ADMIN: '/admin',
}

// Visiting "/" sends you to the right place depending on login state
function HomeRedirect() {
  const token = useAuthStore((state) => state.token)
  const role = useAuthStore((state) => state.role)

  if (!token) return <Navigate to="/login" replace />
  return <Navigate to={roleHome[role] || '/login'} replace />
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected placeholder pages (replaced in the next days) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['BUSINESS']}>
            <h1 className="p-8 text-2xl">Business dashboard</h1>
          </ProtectedRoute>
        }
      />
      <Route
        path="/agent"
        element={
          <ProtectedRoute allowedRoles={['AGENT']}>
            <h1 className="p-8 text-2xl">Agent dashboard</h1>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <h1 className="p-8 text-2xl">Admin panel</h1>
          </ProtectedRoute>
        }
      />

      {/* Anything else */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}