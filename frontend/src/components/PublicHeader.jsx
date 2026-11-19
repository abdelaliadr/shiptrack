import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { ROLE_HOME } from '../constants/roles'

export default function PublicHeader() {
  const token = useAuthStore((state) => state.token)
  const role = useAuthStore((state) => state.role)

  return (
    <header className="bg-white border-b border-line">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/track" className="text-xl font-bold text-brand">
          Shiptrack
        </Link>

        {token ? (
          <Link to={ROLE_HOME[role] || '/login'} className="btn-ghost">
            Back to my dashboard
          </Link>
        ) : (
          <Link to="/login" className="btn-ghost">
            Log in
          </Link>
        )}
      </div>
    </header>
  )
}