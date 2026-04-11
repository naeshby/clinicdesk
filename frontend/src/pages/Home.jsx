import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const SERVICES = [
  { icon: '🩺', label: 'General Consultation' },
  { icon: '🦷', label: 'Dental Care' },
  { icon: '👶', label: 'Paediatrics' },
  { icon: '🩻', label: 'Diagnostics' },
  { icon: '💊', label: 'Follow-up Visit' },
]

const PAIN_POINTS = [
  {
    before: 'WhatsApp chaos',
    after: 'Structured bookings',
    desc: 'Patients book directly through a form — no more chasing messages across threads or losing details in a chat.',
  },
  {
    before: 'Manual register',
    after: 'Digital lead record',
    desc: 'Every appointment is automatically saved with name, phone, email, and service type — nothing falls through.',
  },
  {
    before: 'Zero follow-up',
    after: 'Admin dashboard',
    desc: 'Your staff can see every pending appointment, mark no-shows, and export the full patient lead list in one click.',
  },
]

const STEPS = [
  { step: '01', title: 'Patient books online', desc: 'They fill in their name, phone, email, preferred date and time, and consultation type. Takes under 60 seconds from any phone.' },
  { step: '02', title: 'Lead is captured instantly', desc: 'The appointment appears in your admin dashboard the moment it is submitted — no manual entry, no missed messages.' },
  { step: '03', title: 'Your team follows up', desc: 'Staff see all Pending appointments, confirm them, mark no-shows, and export the full list for weekly reviews.' },
]

export default function Home() {
  useEffect(() => {
    document.title = 'ClinicDesk — Online Appointment Booking for Small Clinics'
  }, [])

  return (
    <div className="min-h-screen bg-cream font-body">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-display text-xl font-bold text-ink">
            Clinic<span className="text-brand-600">Desk</span>
          </span>
          <Link to="/book" className="btn-primary text-xs px-5 py-2.5">
            Book Appointment
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-100 rounded-full opacity-30 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold px-4 py-2 rounded-full mb-8 opacity-0 animate-fade-up"
            style={{ animationDelay: '0s', animationFillMode: 'forwards' }}
          >
            <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
            Built for small clinics — no IT team required
          </div>

          <h1
            className="font-display text-5xl md:text-7xl text-ink leading-tight mb-6 opacity-0 animate-fade-up"
            style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
          >
            Stop losing patients
            <br />
            <span className="italic text-brand-700">to WhatsApp and paper.</span>
          </h1>

          <p
            className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10 opacity-0 animate-fade-up"
            style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
          >
            Small clinics lose 20–30% of potential appointments to missed messages, forgotten call-backs, and registers with no follow-up system. ClinicDesk replaces that with a simple online booking page, automatic lead capture, and a dashboard your receptionist can use today.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-up"
            style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
          >
            <Link to="/book" className="btn-primary px-8 py-4 text-base">
              Book an Appointment →
            </Link>
            <a href="+918264768346" className="btn-outline px-8 py-4 text-base">
              Call the Clinic
            </a>
          </div>
        </div>
      </section>

      {/* Problem vs Solution strip */}
      <section className="py-20 px-6 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-semibold tracking-widest uppercase text-slate-400 mb-12">
            What changes when you use ClinicDesk
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {PAIN_POINTS.map(({ before, after, desc }) => (
              <div key={before} className="card p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className="text-xs font-semibold bg-red-50 text-red-600 px-2.5 py-1 rounded-full line-through decoration-red-400">
                    {before}
                  </span>
                  <span className="text-slate-300 text-sm">to</span>
                  <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                    {after}
                  </span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation types */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs font-semibold tracking-widest uppercase text-slate-400 mb-10">
            Consultation types patients can book
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
            {SERVICES.map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-3 group cursor-default">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center text-2xl group-hover:bg-brand-100 group-hover:scale-110 transition-all duration-200">
                  {icon}
                </div>
                <span className="text-xs font-medium text-ink text-center leading-tight">{label}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-400 mt-8">
            Service types are fully customisable — update them to match your clinic's actual offerings.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl text-ink mb-4">How it works</h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto">
              From a patient booking online to your receptionist confirming it — the whole loop is handled automatically.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map(({ step, title, desc }) => (
              <div key={step} className="card p-8 hover:shadow-md transition-shadow duration-300">
                <p className="font-mono text-4xl font-bold text-brand-200 mb-4">{step}</p>
                <h3 className="font-display text-xl text-ink mb-3">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-14 px-6 bg-brand-800">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { stat: '20–30%', label: 'of clinic appointments lost to untracked leads and missed follow-ups' },
            { stat: '60 sec', label: 'for a patient to book from any phone — no app, no account needed' },
            { stat: '0 registers', label: 'to maintain — every booking is stored, searchable, and exportable' },
          ].map(({ stat, label }) => (
            <div key={stat}>
              <p className="font-display text-4xl font-bold text-white mb-2">{stat}</p>
              <p className="text-blue-200 text-sm leading-relaxed">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6 bg-ink">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl text-white mb-4">
            Ready to replace the WhatsApp group?
          </h2>
          <p className="text-slate-400 text-base mb-10 leading-relaxed">
            Give your patients a proper booking page and give your staff a dashboard that actually tracks who needs follow-up.
          </p>
          <Link to="/book" className="inline-flex items-center gap-2 bg-accent hover:bg-amber-400 text-ink font-semibold text-sm px-8 py-4 rounded-lg transition-all duration-200 active:scale-95 shadow-lg">
            Book an Appointment Now →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-slate-100 bg-cream">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display text-lg font-bold text-ink">
            Clinic<span className="text-brand-600">Desk</span>
          </span>
          <p className="text-slate-400 text-xs">
            © {new Date().getFullYear()} ClinicDesk. Appointment and lead management for small clinics.
          </p>
          <Link to="/book" className="text-xs text-brand-600 hover:underline font-medium">
            Book Appointment
          </Link>
        </div>
      </footer>
    </div>
  )
}
