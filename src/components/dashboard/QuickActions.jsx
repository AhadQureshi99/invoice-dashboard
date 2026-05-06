import {
  HiOutlineShieldCheck,
  HiOutlinePencilAlt,
  HiOutlineUpload,
  HiOutlineDownload,
} from 'react-icons/hi'

const actions = [
  { icon: HiOutlineShieldCheck, label: 'Verify Invoice', bg: 'bg-emerald-500' },
  { icon: HiOutlinePencilAlt,   label: 'Create Draft',   bg: 'bg-blue-500'    },
  { icon: HiOutlineUpload,      label: 'Upload',          bg: 'bg-red-500'     },
  { icon: HiOutlineDownload,    label: 'Verify Invoice',  bg: 'bg-teal-500'    },
]

const QuickActions = () => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
    <p className="text-sm font-bold text-[#1e3a5f] mb-4">Quick Actions</p>
    <div className="grid grid-cols-2 gap-3">
      {actions.map(({ icon: Icon, label, bg }) => (
        <button
          key={`${label}-${bg}`}
          className="flex flex-col items-center justify-center gap-2.5 py-5
                     border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <div className={`w-11 h-11 rounded-full ${bg} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-medium text-gray-700">{label}</span>
        </button>
      ))}
    </div>
  </div>
)

export default QuickActions
