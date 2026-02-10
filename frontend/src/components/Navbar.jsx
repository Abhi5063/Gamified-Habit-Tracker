import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Home, Table, BarChart3, LogOut, Cpu } from 'lucide-react'

function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/habits', label: 'Habit Table', icon: Table },
    { path: '/analysis', label: 'Analysis', icon: BarChart3 },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
                <Cpu className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Habit<span className="text-primary">Flow</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${isActive(item.path)
                      ? 'bg-primary/20 text-white shadow-lg shadow-primary/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <Icon size={18} className={isActive(item.path) ? 'text-primary' : ''} />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Signed in as</p>
              <p className="text-sm font-medium text-gray-300">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 bg-surface/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 pb-0">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-item ${active ? 'text-white' : 'text-gray-500'}`}
              >
                <div className={`p-2 rounded-xl transition-all duration-300 ${active ? 'bg-primary/20 text-primary shadow-lg shadow-primary/20 scale-110' : 'hover:bg-white/5'}`}>
                  <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                </div>
              </Link>
            )
          })}
          <button
            onClick={logout}
            className="mobile-nav-item text-gray-500 hover:text-danger"
          >
            <div className="p-2 rounded-xl hover:bg-danger/10 transition-all">
              <LogOut size={20} />
            </div>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
