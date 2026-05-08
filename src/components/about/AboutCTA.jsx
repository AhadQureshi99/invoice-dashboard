import { Link } from 'react-router-dom'

const AboutCTA = () => (
  <section className="w-full bg-[#07275a] py-16">
    <div className="max-w-6xl mx-auto px-6 text-center">
      <h2 className="text-white text-[1.6rem] font-bold">
        Ready to secure your compliance?
      </h2>
      <p className="mt-3 text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
        Join the institutions that trust UDSPak for their mission-critical tax operations.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/register"
          className="bg-white hover:bg-gray-50 text-[#1e3a5f] text-sm font-semibold
                     px-6 py-2.5 rounded-lg transition-colors"
        >
          Schedule a Consultation
        </Link>
        <button
          className="border border-white/40 hover:border-white/70 text-white
                     text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
        >
          View Security Standards
        </button>
      </div>
    </div>
  </section>
)

export default AboutCTA
