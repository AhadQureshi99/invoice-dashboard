import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineMail } from 'react-icons/hi'

const InputField = ({ id, label, type = 'text', value, onChange, placeholder, icon: Icon }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5"
    >
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-[14px] h-[14px]" />
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full ${Icon ? 'pl-9' : 'pl-4'} pr-4 py-2.5 text-sm border border-gray-200 rounded-lg
                   placeholder:text-gray-400 text-gray-800
                   focus:outline-none focus:ring-2 focus:ring-navy-700/20 focus:border-navy-700
                   transition-colors`}
      />
    </div>
  </div>
)

const RegisterForm = () => {
  const [fields, setFields] = useState({
    idType:       '',
    credential:   '',
    entityName:   '',
    email:        '',
    password:     '',
    confirmPass:  '',
  })
  const [agreed, setAgreed] = useState(false)

  const set = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    // Registration logic goes here
  }

  return (
    <div className="w-full md:w-[58%] bg-white px-8 md:px-10 py-9 flex flex-col justify-center overflow-y-auto">

      {/* Heading */}
      <h2 className="text-[1.65rem] font-bold text-gray-900 leading-tight">Create New Account</h2>
      <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
        Enter your official credentials to register for the Invoice Management System.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">

        {/* Row 1 — 2 columns */}
        <div className="grid grid-cols-2 gap-4">
          <InputField
            id="idType"
            label="Identification Type"
            value={fields.idType}
            onChange={set('idType')}
            placeholder="National Tax Number (NTN)"
            icon={HiOutlineMail}
          />
          <InputField
            id="credential"
            label="Credential Number"
            value={fields.credential}
            onChange={set('credential')}
            placeholder="XXXXXXX-X"
          />
        </div>

        {/* Legal entity — full width */}
        <InputField
          id="entityName"
          label="Legal Entity Name / Full Name"
          value={fields.entityName}
          onChange={set('entityName')}
          placeholder="As per official registration"
        />

        {/* Email — full width */}
        <InputField
          id="email"
          label="Official Contact Email"
          type="email"
          value={fields.email}
          onChange={set('email')}
          placeholder="name@organization.gov.pk"
        />

        {/* Row 2 — 2 columns passwords */}
        <div className="grid grid-cols-2 gap-4">
          <InputField
            id="password"
            label="Access Password"
            type="password"
            value={fields.password}
            onChange={set('password')}
            placeholder="••••••••"
          />
          <InputField
            id="confirmPass"
            label="Confirm Password"
            type="password"
            value={fields.confirmPass}
            onChange={set('confirmPass')}
            placeholder="••••••••"
          />
        </div>

        {/* Terms checkbox */}
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded accent-navy-900 flex-shrink-0 cursor-pointer"
          />
          <span className="text-sm text-gray-600 leading-relaxed">
            I certify that the information provided is accurate and I agree to the
            Institutional{' '}
            <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-blue-600 font-semibold hover:underline">Data Handling Policies.</a>
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3.5 bg-navy-900 hover:bg-navy-950 text-white text-sm
                     font-semibold rounded-lg transition-colors mt-1"
        >
          Complete Registration
        </button>
      </form>

      {/* Divider */}
      <hr className="my-5 border-gray-200" />

      {/* Login link */}
      <div className="text-center">
        <p className="text-sm text-gray-500">Already have an authorized account?</p>
        <Link
          to="/"
          className="text-sm text-navy-900 font-bold hover:underline transition-colors"
        >
          Login to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default RegisterForm
