import { HiOutlineOfficeBuilding, HiOutlineShieldCheck } from 'react-icons/hi'
import { HiOutlineCheckBadge } from 'react-icons/hi2'
import { PiCertificateBold } from 'react-icons/pi'

const partners = [
  { icon: HiOutlineOfficeBuilding, label: 'FBR' },
  { icon: HiOutlineShieldCheck,    label: 'PRAL' },
  { icon: HiOutlineCheckBadge,     label: 'SOC2 TYPE II' },
  { icon: PiCertificateBold,       label: 'ISO 27001' },
]

const PartnersSection = () => (
  <section className="w-full bg-[#f0f2f5] border-y border-gray-200 py-10">
    <div className="max-w-6xl mx-auto px-6">
      <p className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-7">
        Institutional Partnerships &amp; Certifications
      </p>
      <div className="flex items-center justify-center gap-16 flex-wrap">
        {partners.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2.5 text-gray-400">
            <Icon className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-wide">{label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default PartnersSection
