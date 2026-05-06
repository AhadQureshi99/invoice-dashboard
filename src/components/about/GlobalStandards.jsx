import { HiOutlineDatabase, HiOutlineLockClosed, HiOutlineDesktopComputer } from 'react-icons/hi'

const standards = [
  {
    icon: HiOutlineDatabase,
    title: 'Data Sovereignty',
    desc: 'We ensure that data remains within jurisdictional borders, complying with regional storage regulations and sovereign privacy laws.',
  },
  {
    icon: HiOutlineLockClosed,
    title: 'SSL Encryption',
    desc: 'All transmissions are protected by 256-bit AES encryption, ensuring end-to-end security between your systems and our compliance hub.',
  },
  {
    icon: HiOutlineDesktopComputer,
    title: '24/7 Monitoring',
    desc: 'Our Network Operations Center (NOC) operates around the clock, utilizing AI-driven threat detection to prevent unauthorized access.',
  },
]

const GlobalStandards = () => (
  <section className="w-full bg-[#f0f2f5] py-16">
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-10">
        <h2 className="text-[1.5rem] font-bold text-[#1e3a5f]">
          Global Standards, Local Compliance
        </h2>
        <p className="mt-3 text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
          Operating within government-integrated ecosystems requires unwavering adherence to
          technical protocols.
        </p>
      </div>

      <div className="flex gap-5">
        {standards.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex-1 bg-white border border-gray-200 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-[#1e3a5f] flex items-center justify-center mb-5">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-[#1e3a5f] font-bold text-[0.95rem] mb-2">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default GlobalStandards
