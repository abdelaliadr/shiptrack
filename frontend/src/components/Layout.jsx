import { NavLink, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useLogout } from '../hooks/useAuth'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', end: true },
  { to: '/shipments', label: 'My shipments', end: true },
  { to: '/shipments/new', label: 'New shipment' },
]

export default function Layout() {
  const name = useAuthStore((state) => state.name)
  const logout = useLogout()

  const linkClass = ({ isActive }) =>
    `block px-4 py-2.5 rounded-2xl text-sm font-semibold transition-colors ${
      isActive ? 'bg-brand text-white' : 'text-muted hover:bg-brand-soft'
    }`

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-line flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-brand">Shiptrack</h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-line">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-9 h-9 rounded-full bg-brand-soft text-brand font-bold flex items-center justify-center">
              {name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-semibold truncate">{name}</span>
          </div>
          <button onClick={logout} className="btn-ghost w-full text-left text-red-600 hover:bg-red-50">
            Log out
          </button>
        </div>
      </aside>

      {/* Page content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}