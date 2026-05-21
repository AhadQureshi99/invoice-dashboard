const AboutStory = () => (
  <section className="w-full bg-white py-16">
    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10 md:gap-14">

      {/* Left — text */}
      <div className="flex-1 min-w-0">
        <h2 className="text-[1.4rem] font-bold text-[#0e5f4f] leading-snug mb-5">
          Built for the Future of Fiscal Tech
        </h2>
        <div className="flex flex-col gap-4 text-gray-500 text-sm leading-relaxed">
          <p>
            TaxGuard Compliance began with a simple observation: the tools used for tax
            filing had not evolved as quickly as the regulations themselves. Organizations
            were struggling to keep up with shifting mandates using legacy software.
          </p>
          <p>
            Our leadership team — comprised of former policy advisors, cloud architects, and
            financial analysts — set out to build a platform that doesn't just record data,
            but actively manages compliance risk.
          </p>
          <p>
            Today, we serve thousands of enterprises and work closely with government
            agencies to ensure that our technology serves as the reliable backbone for
            modern tax operations.
          </p>
        </div>
      </div>

      {/* Right — image */}
      <div className="flex-1 min-w-0 rounded-2xl overflow-hidden shadow-xl h-[280px]">
        <img
          src="/hero image.png"
          alt="Our team"
          className="w-full h-full object-cover object-center"
        />
      </div>
    </div>
  </section>
)

export default AboutStory
