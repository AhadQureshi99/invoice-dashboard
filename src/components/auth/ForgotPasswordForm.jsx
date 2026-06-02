import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiArrowLeft } from 'react-icons/hi'
import { useAuth } from '../../lib/AuthContext'

// Must match the "Email OTP Length" configured in Supabase
// (Authentication → Email provider settings). Default is 6.
const OTP_LENGTH = 6

const inputClass = `w-full pr-4 py-3 text-sm border border-gray-200 rounded-lg
  placeholder:text-gray-400 text-gray-800
  focus:outline-none focus:ring-2 focus:ring-navy-700/20 focus:border-navy-700 transition-colors`

const Label = ({ children }) => (
  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
    {children}
  </label>
)

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-[15px] h-[15px]" />
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${inputClass} pl-10 !pr-10`}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {show ? <HiOutlineEyeOff className="w-[16px] h-[16px]" /> : <HiOutlineEye className="w-[16px] h-[16px]" />}
      </button>
    </div>
  )
}

const OtpInput = ({ value, onChange, disabled, length = OTP_LENGTH }) => {
  const refs = useRef([])

  const handleChange = (i) => (e) => {
    const d = e.target.value.replace(/\D/g, '').slice(-1)
    const arr = value.split('')
    while (arr.length < length) arr.push('')
    arr[i] = d
    onChange(arr.join('').slice(0, length))
    if (d && i < length - 1) refs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i) => (e) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus()
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const txt = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, length)
    onChange(txt)
    refs.current[Math.min(txt.length, length - 1)]?.focus()
  }

  return (
    <div className="flex gap-2 justify-between" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={value[i] || ''}
          onChange={handleChange(i)}
          onKeyDown={handleKeyDown(i)}
          className="w-full aspect-square min-w-0 text-center text-lg font-semibold border border-gray-200 rounded-lg
                     text-gray-800 focus:outline-none focus:ring-2 focus:ring-navy-700/20 focus:border-navy-700
                     transition-colors disabled:opacity-60"
        />
      ))}
    </div>
  )
}

const ForgotPasswordForm = () => {
  const { sendPasswordOtp, verifyPasswordOtp, updatePassword, signOut } = useAuth()
  const navigate = useNavigate()

  const [step, setStep]       = useState('request') // 'request' | 'reset'
  const [email, setEmail]     = useState('')
  const [otp, setOtp]         = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg]         = useState(null)

  const handleSendCode = async (e) => {
    e?.preventDefault()
    setMsg(null)
    if (!email) return setMsg({ kind: 'err', text: 'Please enter your email address.' })
    setLoading(true)
    const { error } = await sendPasswordOtp(email.trim())
    setLoading(false)
    if (error) return setMsg({ kind: 'err', text: error.message })
    setStep('reset')
    setMsg({ kind: 'ok', text: `We sent a ${OTP_LENGTH}-digit verification code to ${email}.` })
  }

  const handleReset = async (e) => {
    e?.preventDefault()
    setMsg(null)
    if (otp.length !== OTP_LENGTH) return setMsg({ kind: 'err', text: `Enter the full ${OTP_LENGTH}-digit code.` })
    if (password.length < 6)     return setMsg({ kind: 'err', text: 'Password must be at least 6 characters.' })
    if (password !== confirm)    return setMsg({ kind: 'err', text: 'Passwords do not match.' })

    setLoading(true)
    const { error: vErr } = await verifyPasswordOtp(email.trim(), otp)
    if (vErr) {
      setLoading(false)
      return setMsg({ kind: 'err', text: 'Invalid or expired code. Please try again.' })
    }
    const { error: uErr } = await updatePassword(password)
    setLoading(false)
    if (uErr) return setMsg({ kind: 'err', text: uErr.message })

    await signOut()
    navigate('/login', { state: { resetSuccess: true } })
  }

  return (
    <div className="w-full md:w-[58%] bg-white px-8 md:px-10 py-10 md:py-11 flex flex-col justify-center">

      <h2 className="text-[1.65rem] font-bold text-gray-900 leading-tight">
        {step === 'request' ? 'Forgot Password' : 'Reset Password'}
      </h2>
      <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
        {step === 'request'
          ? `Enter your registered email and we will send you a ${OTP_LENGTH}-digit verification code.`
          : `Enter the ${OTP_LENGTH}-digit code sent to your email and choose a new password.`}
      </p>

      {step === 'request' ? (
        <form onSubmit={handleSendCode} className="mt-8 flex flex-col gap-5">
          <div>
            <Label>Email Address</Label>
            <div className="relative">
              <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-[15px] h-[15px]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.gov"
                className={`${inputClass} pl-10`}
                required
              />
            </div>
          </div>

          {msg && (
            <div className={`text-xs font-medium rounded-lg px-3 py-2 border ${
              msg.kind === 'ok'
                ? 'text-green-700 bg-green-50 border-green-100'
                : 'text-red-600 bg-red-50 border-red-100'
            }`}>
              {msg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-navy-900 hover:bg-navy-950 text-white text-xs
                       font-semibold uppercase tracking-[0.18em] rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? 'Sending…' : 'Send Verification Code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleReset} className="mt-8 flex flex-col gap-5">
          <div>
            <Label>{OTP_LENGTH}-Digit Code</Label>
            <OtpInput value={otp} onChange={setOtp} disabled={loading} />
          </div>

          <div>
            <Label>New Password</Label>
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          <div>
            <Label>Confirm New Password</Label>
            <PasswordInput value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" />
          </div>

          {msg && (
            <div className={`text-xs font-medium rounded-lg px-3 py-2 border ${
              msg.kind === 'ok'
                ? 'text-green-700 bg-green-50 border-green-100'
                : 'text-red-600 bg-red-50 border-red-100'
            }`}>
              {msg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-navy-900 hover:bg-navy-950 text-white text-xs
                       font-semibold uppercase tracking-[0.18em] rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? 'Resetting…' : 'Reset Password'}
          </button>

          <button
            type="button"
            onClick={handleSendCode}
            disabled={loading}
            className="text-xs font-semibold text-navy-900 hover:underline disabled:opacity-60 w-fit mx-auto"
          >
            Didn&apos;t get a code? Resend
          </button>
        </form>
      )}

      <hr className="my-6 border-gray-200" />

      <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm text-navy-900 font-bold hover:underline transition-colors">
        <HiArrowLeft className="w-4 h-4" />
        Back to Login
      </Link>
    </div>
  )
}

export default ForgotPasswordForm
