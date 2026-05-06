const AboutHero = () => (
  <section className="relative w-full min-h-[320px] flex items-end overflow-hidden">
    {/* Background image */}
    <img
      src="/hero image.png"
      alt=""
      className="absolute inset-0 w-full h-full object-cover object-center"
    />
    {/* Dark overlay */}
    <div className="absolute inset-0 bg-[#0f2040]/75" />

    {/* Content */}
    <div className="relative z-10 max-w-6xl mx-auto px-8 pb-14 pt-16">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400 mb-4">
        Our Identity
      </p>
      <h1 className="text-white text-[1.95rem] font-bold leading-[1.2] max-w-xl">
        Our mission is to simplify government tax compliance through secure,
        high-performance technology.
      </h1>
      <p className="mt-5 text-slate-400 text-sm leading-relaxed max-w-lg">
        At TaxGuard Compliance, we bridge the gap between complex legislative requirements
        and digital financial operations, ensuring precision in every filing and absolute
        security for every record.
      </p>
    </div>
  </section>
)

export default AboutHero
