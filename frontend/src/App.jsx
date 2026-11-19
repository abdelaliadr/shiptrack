import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuthStore } from './store/authStore'
import { ROLE_HOME } from './constants/roles'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import MyShipments from './pages/MyShipments'
import CreateShipment from './pages/CreateShipment'

// Visiting "/" sends you to the right place depending on login state
function HomeRedirect() {
  const token = useAuthStore((state) => state.token)
  const role = useAuthStore((state) => state.role)

  if (!token) return <Navigate to="/login" replace />
  return <Navigate to={ROLE_HOME[role] || '/login'} replace />
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* BUSINESS area: one ProtectedRoute + Layout wraps all three pages */}
<Route
  element={
    <ProtectedRoute allowedRoles={['BUSINESS']}>
      <Layout />
    </ProtectedRoute>
  }
>
  <Route path="/dashboard" element={<Dashboard />} />
<Route path="/shipments" element={<MyShipments />} />
<Route path="/shipments/new" element={<CreateShipment />} />
</Route>
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