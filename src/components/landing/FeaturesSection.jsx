import { HiOutlineRefresh, HiOutlineShieldCheck } from 'react-icons/hi'
import { HiOutlineSquares2X2 } from 'react-icons/hi2'

const features = [
  {
    icon: HiOutlineRefresh,
    title: 'Real-time Verification',
    desc: 'Directly integrated with FBR API for instantaneous invoice status validation and legal compliance checks.',
  },
  {
    icon: HiOutlineSquares2X2,
    title: 'Bulk Processing',
    desc: 'Optimized engine capable of handling up to 500 invoices per batch with zero downtime and automated error detection.',
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Audit-Ready Security',
    desc: 'Fully SOC2 compliant and ISO certified infrastructure ensuring your financial data is protected by institutional-grade encryption.',
  },
]

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="flex-1 border border-gray-200 rounded-xl p-6 bg-white">
    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
      <Icon className="w-5 h-5 text-gray-500" />
    </div>
    <h3 className="text-[#1e3a5f] font-semibold text-[0.95rem] mb-2">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
  </div>
)

const FeaturesSection = () => (
  <section id="features" className="w-full bg-white py-16">
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-10">
        <h2 className="text-[1.6rem] font-bold text-[#1e3a5f]">Precision Built Features</h2>
        <p className="mt-2 text-gray-500 text-sm">
          High-density compliance tools for large scale operations.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-6">
        {features.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </div>
  </section>
)

export default FeaturesSection
