import { HiLockClosed } from 'react-icons/hi'
import { PiCertificateBold } from 'react-icons/pi'

const Footer = () => (
  <footer className="w-full bg-navy-50 border-t border-[#b0bfce]/60">
    <div className="flex items-center justify-between px-8 py-3 text-[9.5px] text-[#8a9db5] uppercase tracking-[0.12em] font-medium whitespace-nowrap">

      {/* Left — security badges */}
      <div className="flex items-center gap-5">
        <span className="flex items-center gap-1.5">
          <HiLockClosed className="w-[10px] h-[10px]" />
          SSL 256-Bit Encryption
        </span>
        <span className="flex items-center gap-1.5">
          <PiCertificateBold className="w-[10px] h-[10px]" />
          ISO 27001 Certified
        </span>
      </div>

      {/* Center — policy links */}
      <div className="flex items-center gap-6">
        <a href="#" className="hover:text-[#5a7a9a] transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-[#5a7a9a] transition-colors">Security Standards</a>
        <a href="#" className="hover:text-[#5a7a9a] transition-colors">Government Compliance</a>
      </div>

      {/* Right — copyright */}
      <span>© 2024 Enterprise Tax Portal. All Rights Reserved.</span>
    </div>
  </footer>
)

export default Footer
