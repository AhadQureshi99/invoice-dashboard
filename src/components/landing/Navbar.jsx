import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'Features',  to: '/#features'  },
  { label: 'About',     to: '/about'       },
  { label: 'Solutions', to: '/#solutions'  },
]

const Navbar = () => {
  const { pathname } = useLocation()

  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-0 select-none">
          <span className="text-[#1e3a5f] font-bold text-lg tracking-tight">uds</span>
          <span className="text-green-500 font-bold text-lg tracking-tight">pak</span>
        </Link>

        {/* Center nav links */}
        <div className="flex items-center gap-8">
          {navLinks.map(({ label, to }) => {
            const active = to === '/about' ? pathname === '/about' : false
            return (
              <Link
                key={label}
                to={to}
                className={`text-sm font-medium transition-colors pb-0.5 ${
                  active
                    ? 'text-[#1e3a5f] border-b-2 border-[#1e3a5f]'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-[#1e3a5f] hover:bg-[#0f2040] text-white text-sm font-semibold
                       px-4 py-2 rounded-lg transition-colors"
          >
            Request Demo
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
