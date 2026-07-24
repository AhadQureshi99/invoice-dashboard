import { useState } from 'react'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi'
import Sidebar from './Sidebar'

/**
 * Shared layout for all dashboard pages.
 * Handles the responsive sidebar (hamburger on mobile, persistent on desktop).
 * Usage: wrap page content (topbar + main) as children.
 */
const DashboardLayout = ({ children }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#f0f4f8] overflow-hidden">

      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          no-print fixed top-0 left-0 h-full z-50 flex-shrink-0
          lg:static lg:z-auto lg:flex
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <Sidebar />
        {/* Close button — only rendered when open so it never peeks into viewport */}
        {open && (
          <button
            className="lg:hidden absolute top-4 -right-10 w-8 h-8 bg-white rounded-full shadow-md
                       flex items-center justify-center text-[#0e5f4f]"
            onClick={() => setOpen(false)}
          >
            <HiOutlineX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Mobile top bar with hamburger */}
        <div className="no-print lg:hidden flex items-center gap-3 px-4 py-2.5 bg-[#f0f4f8] border-b border-[#dce4ef] flex-shrink-0">
          <button
            className="p-1.5 rounded-lg bg-[#0e5f4f] text-white flex-shrink-0"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <HiOutlineMenu className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-[#0e5f4f]">FBR Invoice Manager</span>
        </div>

        {/* Page content (topbar hidden on mobile via lg:flex, main area) */}
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout
