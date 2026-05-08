import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi'

const InputField = ({ id, label, type, value, onChange, placeholder, icon: Icon, rightLabel }) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <label
        htmlFor={id}
        className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest"
      >
        {label}
      </label>
      {rightLabel}
    </div>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-[15px] h-[15px]" />
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-lg
                   placeholder:text-gray-400 text-gray-800
                   focus:outline-none focus:ring-2 focus:ring-navy-700/20 focus:border-navy-700
                   transition-colors"
        required
      />
    </div>
  </div>
)

const LoginForm = () => {
  const [email,      setEmail]      = useState('')
  const [password,   setPassword]   = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Authentication logic goes here
  }

  return (
    <div className="w-full md:w-[58%] bg-white px-8 md:px-10 py-10 md:py-11 flex flex-col justify-center">

      {/* Heading */}
      <h2 className="text-[1.65rem] font-bold text-gray-900 leading-tight">Login</h2>
      <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
        Enter your credentials to access your organization dashboard.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">

        {/* Email */}
        <InputField
          id="email"
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@organization.gov"
          icon={HiOutlineMail}
        />

        {/* Password */}
        <InputField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          icon={HiOutlineLockClosed}
          rightLabel={
            <button
              type="button"
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-700
                         uppercase tracking-widest transition-colors"
            >
              Forgot Password?
            </button>
          }
        />

        {/* Remember me */}
        <label className="flex items-center gap-2.5 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded accent-navy-900 cursor-pointer"
          />
          <span className="text-sm text-gray-600 select-none">
            Keep me logged in for 30 days
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3.5 bg-navy-900 hover:bg-navy-950 text-white text-xs
                     font-semibold uppercase tracking-[0.18em] rounded-lg transition-colors"
        >
          Continue
        </button>
      </form>

      {/* Divider */}
      <hr className="my-6 border-gray-200" />

      {/* Register link */}
      <div className="text-center">
        <p className="text-sm text-gray-500">Don&apos;t have an enterprise account?</p>
        <Link to="/register" className="text-sm text-navy-900 font-bold hover:underline transition-colors">
          Contact Administrator
        </Link>
      </div>
    </div>
  )
}

export default LoginForm
