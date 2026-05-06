import { HiOutlineOfficeBuilding, HiOutlineShieldCheck } from 'react-icons/hi'
import { HiOutlineWrenchScrewdriver } from 'react-icons/hi2'

const AboutWhy = () => (
  <section className="w-full bg-white py-14">
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="text-[1.4rem] font-bold text-[#07275a] mb-6">Why UDSPak?</h2>

      {/* Row 1 */}
      <div className="flex gap-4 mb-4">

        {/* Institutional Heritage — large left */}
        <div className="flex-[2] border border-gray-200 rounded-2xl p-6 flex flex-col gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
            <HiOutlineOfficeBuilding className="w-5 h-5 text-gray-500" />
          </div>
          <h3 className="text-[#07275a] font-bold text-[0.95rem]">Institutional Heritage</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Born from decades of expertise in fiscal policy and regulatory frameworks, our
            platform is built by veterans of the tax industry who understand the gravity of
            compliance.
          </p>
          {/* Inline image */}
          <div className="mt-2 rounded-xl overflow-hidden h-[160px]">
            <img
              src="/hero image.png"
              alt="Heritage"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Technical Precision — dark right */}
        <div className="flex-1 bg-[#07275a] rounded-2xl p-6 flex flex-col">
          <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center mb-3">
            <HiOutlineWrenchScrewdriver className="w-5 h-5" style={{ color: '#9eef9a' }} />
          </div>
          <h3 className="text-white font-bold text-[0.95rem] mb-2">Technical Precision</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Our calculation engine is audited quarterly by external experts to guarantee
            100% accuracy against the latest tax codes and government mandates.
          </p>
          {/* Push uptime to bottom */}
          <div className="flex-1" />
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.08] mt-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              Uptime Guarantee
            </span>
            <span className="font-bold text-sm" style={{ color: '#9eef9a' }}>99.98%</span>
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="flex gap-4">

        {/* Security First */}
        <div className="flex-1 border border-gray-200 rounded-2xl p-6">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center mb-3">
            <HiOutlineShieldCheck className="w-5 h-5 text-gray-500" />
          </div>
          <h3 className="text-[#07275a] font-bold text-[0.95rem] mb-2">Security First</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Zero-trust architecture ensures that your sensitive financial data is
            fragmented, encrypted, and accessible only to authorized personnel.
          </p>
        </div>

        {/* SOC2 Type II */}
        <div className="flex-[2] border border-gray-200 rounded-2xl p-6 flex items-start justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-[#07275a] font-bold text-[0.95rem] mb-2">SOC2 Type II Certified</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              We undergo rigorous annual audits to maintain the highest industry standards
              for security, availability, and confidentiality.
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl border border-gray-200 flex items-center justify-center flex-shrink-0">
            <HiOutlineShieldCheck className="w-6 h-6 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  </section>
)

export default AboutWhy
