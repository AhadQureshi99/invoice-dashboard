import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineMail, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'
import { useAuth } from '../../lib/AuthContext'

const InputField = ({ id, label, type = 'text', value, onChange, placeholder, icon: Icon }) => {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (show ? 'text' : 'password') : type

  return (
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
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-9' : 'pl-4'} ${isPassword ? 'pr-10' : 'pr-4'} py-2.5 text-sm border border-gray-200 rounded-lg
                     placeholder:text-gray-400 text-gray-800
                     focus:outline-none focus:ring-2 focus:ring-navy-700/20 focus:border-navy-700
                     transition-colors`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {show ? <HiOutlineEyeOff className="w-[15px] h-[15px]" /> : <HiOutlineEye className="w-[15px] h-[15px]" />}
          </button>
        )}
      </div>
    </div>
  )
}

const RegisterForm = () => {
  const { signUp } = useAuth()
  const navigate   = useNavigate()
  const [fields, setFields] = useState({
    idType:       'NTN',
    credential:   '',
    entityName:   '',
    email:        '',
    password:     '',
    confirmPass:  '',
  })
  const [agreed,  setAgreed]  = useState(false)
  const [error,   setError]   = useState(null)
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!agreed)                              return setError('You must accept the terms.')
    if (fields.password !== fields.confirmPass) return setError('Passwords do not match.')
    if (fields.password.length < 6)            return setError('Password must be at least 6 characters.')

    setLoading(true)
    const { error: err } = await signUp(fields.email, fields.password, {
      id_type:        fields.idType,
      credential_no:  fields.credential,
      entity_name:    fields.entityName,
      role:           'admin',
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    navigate('/dashboard')
  }

  return (
    <div className="w-full md:w-[58%] bg-white px-8 md:px-10 py-9 flex flex-col justify-center overflow-y-auto">

      <h2 className="text-[1.65rem] font-bold text-gray-900 leading-tight">Create New Account</h2>
      <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
        Enter your official credentials to register for the Invoice Management System.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">

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

        <InputField
          id="entityName"
          label="Legal Entity Name / Full Name"
          value={fields.entityName}
          onChange={set('entityName')}
          placeholder="As per official registration"
        />

        <InputField
          id="email"
          label="Official Contact Email"
          type="email"
          value={fields.email}
          onChange={set('email')}
          placeholder="name@organization.gov.pk"
        />

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
            <a href="#" className="text-[#0e5f4f] hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-[#0e5f4f] font-semibold hover:underline">Data Handling Policies.</a>
          </span>
        </label>

        {error && (
          <div className="text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-navy-900 hover:bg-navy-950 text-white text-sm
                     font-semibold rounded-lg transition-colors mt-1 disabled:opacity-60"
        >
          {loading ? 'Registering…' : 'Complete Registration'}
        </button>
      </form>

      <hr className="my-5 border-gray-200" />

      <div className="text-center">
        <p className="text-sm text-gray-500">Already have an authorized account?</p>
        <Link
          to="/login"
          className="text-sm text-navy-900 font-bold hover:underline transition-colors"
        >
          Login to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default RegisterForm