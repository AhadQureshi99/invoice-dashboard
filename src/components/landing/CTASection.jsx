import { Link } from 'react-router-dom'

const CTASection = () => (
  <section className="w-full bg-white py-20">
    <div className="max-w-6xl mx-auto px-6 text-center">
      <h2 className="text-[1.6rem] font-bold text-[#0e5f4f]">
        Start your compliant journey today.
      </h2>
      <p className="mt-3 text-gray-500 text-sm max-w-md mx-auto">
        Join over 1,200 enterprises using TaxGuard to manage their FBR compliance effortlessly.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/register"
          className="bg-[#0e5f4f] hover:bg-[#083f33] text-white text-sm font-semibold
                     px-6 py-2.5 rounded-lg transition-colors"
        >
          Get Started Now
        </Link>
        <button
          className="border border-gray-300 hover:border-gray-400 text-gray-700
                     text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
        >
          View Pricing
        </button>
      </div>
    </div>
  </section>
)

export default CTASection
