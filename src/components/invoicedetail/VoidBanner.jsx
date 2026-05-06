const VoidBanner = () => (
  <div className="bg-[#1e3a5f] rounded-2xl px-7 py-6 flex items-center justify-between gap-6">
    <div>
      <p className="text-white font-bold text-lg">Need to Void?</p>
      <p className="text-blue-200 text-xs mt-1">Request a credit note for this invoice if corrections are required.</p>
    </div>
    <button className="flex-shrink-0 border border-white/40 text-white text-xs font-bold tracking-widest uppercase
                       px-5 py-2.5 rounded-xl hover:bg-white/10 transition-colors">
      Initiate Void
    </button>
  </div>
)

export default VoidBanner
