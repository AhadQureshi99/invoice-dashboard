const ServiceStatusBadge = () => (
  <div className="fixed bottom-12 right-5 z-50 flex items-center gap-2 bg-white rounded-full
                  px-3.5 py-2 shadow-lg border border-gray-100
                  text-[9px] font-semibold uppercase tracking-[0.14em] text-gray-500">
    <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
    Service Status: Operational
  </div>
)

export default ServiceStatusBadge
