import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi'

const navLinks = [
  { label: 'Features',  to: '/#features'  },
  { label: 'About',     to: '/about'       },
  { label: 'Solutions', to: '/#solutions'  },
]

const Navbar = () => {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <nav className="w-full bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center select-none">
          <img src="/logo.png" alt="UDSPak" className="h-12 w-auto" />
        </Link>

        {/* Center nav links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, to }) => {
            const active = to === '/about' ? pathname === '/about' : false
            return (
              <Link
                key={label}
                to={to}
                className={`text-sm font-medium transition-colors pb-0.5 ${
                  active
                    ? 'text-[#0e5f4f] border-b-2 border-[#0e5f4f]'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* Right actions — hidden on mobile */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-[#0e5f4f] hover:bg-[#083f33] text-white text-sm font-semibold
                       px-4 py-2 rounded-lg transition-colors"
          >
            Request Demo
          </Link>
        </div>

        {/* Hamburger — mobile only */}
        <button
          className="md:hidden p-2 rounded-lg text-[#0e5f4f] hover:bg-gray-100 transition-colors"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {open ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-4">
          {navLinks.map(({ label, to }) => (
            <Link key={label} to={to} onClick={() => setOpen(false)}
              className="text-sm font-medium text-gray-600 hover:text-gray-900">{label}</Link>
          ))}
          <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
            <Link to="/login" onClick={() => setOpen(false)}
              className="text-sm font-medium text-gray-700">Login</Link>
            <Link to="/register" onClick={() => setOpen(false)}
              className="bg-[#0e5f4f] hover:bg-[#083f33] text-white text-sm font-semibold px-4 py-2 rounded-lg text-center">
              Request Demo
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
