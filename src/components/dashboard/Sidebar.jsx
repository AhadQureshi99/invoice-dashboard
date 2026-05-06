import { Link, useLocation } from 'react-router-dom'
import {
  HiOutlineViewGrid,
  HiOutlineDocumentText,
  HiOutlineBadgeCheck,
  HiOutlineDocumentDuplicate,
  HiOutlineChartBar,
  HiOutlineBell,
  HiOutlineCog,
  HiOutlineQuestionMarkCircle,
  HiOutlineLogout,
} from 'react-icons/hi'

const navItems = [
  { icon: HiOutlineViewGrid,          label: 'Dashboard',      to: '/dashboard' },
  { icon: HiOutlineDocumentText,       label: 'Invoices',       to: '/dashboard/invoices' },
  { icon: HiOutlineBadgeCheck,         label: 'Verification',   to: '/dashboard/verification' },
  { icon: HiOutlineDocumentDuplicate,  label: 'Draft',          to: '/dashboard/draft' },
  { icon: HiOutlineChartBar,           label: 'Reports',        to: '/dashboard/reports' },
  { icon: HiOutlineBell,               label: 'Notifications',  to: '/dashboard/notifications' },
  { icon: HiOutlineCog,                label: 'Settings',       to: '/dashboard/settings' },
]

const bottomItems = [
  { icon: HiOutlineQuestionMarkCircle, label: 'Support', to: '/support' },
  { icon: HiOutlineLogout,             label: 'Logout',  to: '/login' },
]

const NavItem = ({ icon: Icon, label, to, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
      active
        ? 'bg-white/[0.14] text-white'
        : 'text-slate-300 hover:text-white hover:bg-white/[0.08]'
    }`}
  >
    <Icon className="w-[18px] h-[18px] flex-shrink-0" />
    {label}
  </Link>
)

const Sidebar = () => {
  const { pathname } = useLocation()

  return (
    <aside className="w-[220px] bg-[#1e3a5f] flex flex-col flex-shrink-0 h-screen sticky top-0 overflow-y-auto">

      {/* Logo */}
      <div className="px-5 pt-5 pb-4">
        <div className="bg-white rounded-xl px-3.5 py-2 inline-flex items-center select-none">
          <span className="text-[#1e3a5f] font-bold text-base tracking-tight">uds</span>
          <span className="text-green-500 font-bold text-base tracking-tight">pak</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5 pt-2">
        {navItems.map(({ icon, label, to }) => (
          <NavItem key={label} icon={icon} label={label} to={to} active={pathname === to} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-5 flex flex-col gap-0.5">
        {bottomItems.map(({ icon, label, to }) => (
          <NavItem key={label} icon={icon} label={label} to={to} active={false} />
        ))}
      </div>
    </aside>
  )
}

export default Sidebar
