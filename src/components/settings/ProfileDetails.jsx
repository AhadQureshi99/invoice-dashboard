const ProfileDetails = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <p className="text-sm font-bold text-[#1e3a5f]">Profile Details</p>
      <button className="border border-gray-300 rounded-lg px-4 py-1.5 text-xs font-semibold text-gray-700
                         hover:bg-gray-50 transition-colors">
        Edit
      </button>
    </div>

    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-1.5">Full Name</p>
        <div className="border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 bg-[#fafbfc]">
          Khawaja Muhammad Asif
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-1.5">Email Address</p>
        <div className="border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 bg-[#fafbfc]">
          k.asif@enterprise-tax.gov.pk
        </div>
      </div>
      <div>
        <p className="text-xs font-bold text-gray-700 mb-1.5">NTN (National Tax Number)</p>
        <div className="border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 bg-[#fafbfc]">
          7284910-5
        </div>
      </div>
    </div>
  </div>
)

export default ProfileDetails
