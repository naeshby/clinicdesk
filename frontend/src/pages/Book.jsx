import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const SERVICE_OPTIONS = [
  'General Consultation',
  'Dental Care',
  'Paediatrics / Child Health',
  'Diagnostics / Lab Test',
  'Follow-up Visit',
  'Other',
]

const TIME_SLOTS = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM', '06:00 PM',
]

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const initialForm = {
  name: '',
  phone: '',
  email: '',
  preferred_date: '',
  preferred_time: '',
  service_type: '',
}

export default function Book() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    document.title = 'Book an Appointment — ClinicDesk'
  }, [])

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Patient name is required.'
    if (!form.phone.trim()) e.phone = 'Phone number is required.'
    else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.phone.trim())) e.phone = 'Enter a valid phone number.'
    if (!form.email.trim()) e.email = 'Email address is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.'
    if (!form.preferred_date) e.preferred_date = 'Please select a date.'
    else {
      const chosen = new Date(form.preferred_date)
      const today = new Date(); today.setHours(0,0,0,0)
      if (chosen < today) e.preferred_date = 'Date cannot be in the past.'
    }
    if (!form.preferred_time) e.preferred_time = 'Please select a preferred time slot.'
    if (!form.service_type) e.service_type = 'Please select a consultation type.'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    setServerError('')
    try {
      const res = await fetch(`${API_URL}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')
      setSuccess(true)
      setForm(initialForm)
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'appointment_booked', { service: form.service_type })
      }
    } catch (err) {
      setServerError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const todayStr = new Date().toISOString().split('T')[0]

  if (success) {
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="card max-w-md w-full p-10 text-center animate-fade-up">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
              ✅
            </div>
            <h2 className="font-display text-3xl text-ink mb-3">Request Received</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              Your appointment request has been submitted successfully. Our clinic team will call you within a few hours to confirm the slot.
            </p>
            <p className="text-xs text-slate-400 mb-8">
              Please keep your phone accessible. If you need to reach us sooner, call the clinic directly.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setSuccess(false)}
                className="btn-primary w-full justify-center"
              >
                Book Another Appointment
              </button>
              <Link to="/" className="btn-outline w-full justify-center">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream font-body">
      <NavBar />

      <div className="max-w-2xl mx-auto px-6 py-28">
        <div className="mb-10 opacity-0 animate-fade-up" style={{ animationFillMode: 'forwards' }}>
          <Link to="/" className="text-xs text-brand-600 hover:underline font-medium inline-flex items-center gap-1 mb-4">
            ← Back to Home
          </Link>
          <h1 className="font-display text-4xl text-ink mb-3">Book an Appointment</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Fill in your details below. Our team will confirm your slot by phone within a few hours. No account or app needed.
          </p>
        </div>

        {/* Trust note */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-8 opacity-0 animate-fade-up" style={{ animationDelay: '0.05s', animationFillMode: 'forwards' }}>
          <span className="text-blue-500 mt-0.5">🔒</span>
          <p className="text-xs text-blue-700 leading-relaxed">
            Your information is only used to confirm your appointment. We do not share patient details with any third party.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div
            className="card p-8 space-y-6 opacity-0 animate-fade-up"
            style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
          >
            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                {serverError}
              </div>
            )}

            <Field label="Patient Full Name" error={errors.name}>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Ramesh Kumar"
                className={`input-field ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`}
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Phone Number" error={errors.phone}>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className={`input-field ${errors.phone ? 'border-red-400 focus:ring-red-400' : ''}`}
                />
              </Field>
              <Field label="Email Address" error={errors.email}>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="patient@example.com"
                  className={`input-field ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Preferred Date" error={errors.preferred_date}>
                <input
                  type="date"
                  name="preferred_date"
                  value={form.preferred_date}
                  min={todayStr}
                  onChange={handleChange}
                  className={`input-field ${errors.preferred_date ? 'border-red-400 focus:ring-red-400' : ''}`}
                />
              </Field>
              <Field label="Preferred Time Slot" error={errors.preferred_time}>
                <select
                  name="preferred_time"
                  value={form.preferred_time}
                  onChange={handleChange}
                  className={`input-field ${errors.preferred_time ? 'border-red-400 focus:ring-red-400' : ''}`}
                >
                  <option value="">Select a time slot</option>
                  {TIME_SLOTS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Consultation Type" error={errors.service_type}>
              <select
                name="service_type"
                value={form.service_type}
                onChange={handleChange}
                className={`input-field ${errors.service_type ? 'border-red-400 focus:ring-red-400' : ''}`}
              >
                <option value="">Select consultation type</option>
                {SERVICE_OPTIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : 'Request Appointment →'}
            </button>

            <p className="text-center text-xs text-slate-400">
              Our team will call you to confirm. Slots are subject to availability.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold text-ink">
          Clinic<span className="text-brand-600">Desk</span>
        </Link>
        <Link to="/" className="text-sm text-slate-400 hover:text-ink font-medium transition-colors">
          ← Home
        </Link>
      </div>
    </nav>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-ink tracking-wide mb-1.5 uppercase">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  )
}
