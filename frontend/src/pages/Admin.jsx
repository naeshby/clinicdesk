import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const STATUS_OPTIONS = ['Pending', 'Completed', 'No-show']
const FILTER_OPTIONS = ['All', ...STATUS_OPTIONS]

const STATUS_STYLES = {
  Pending:   'status-pending',
  Completed: 'status-completed',
  'No-show': 'status-noshow',
}

const STATUS_ICONS = {
  Pending:   '⏳',
  Completed: '✅',
  'No-show': '❌',
}

export default function Admin() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('All')
  const [updatingId, setUpdatingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    document.title = 'Admin Dashboard — ClinicDesk'
  }, [])

  const fetchAppointments = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = filter !== 'All' ? `?status=${encodeURIComponent(filter)}` : ''
      const res = await fetch(`${API_URL}/api/appointments${params}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load appointments.')
      setAppointments(data.appointments || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => { fetchAppointments() }, [fetchAppointments])

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id)
    try {
      const res = await fetch(`${API_URL}/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Update failed.')
      setAppointments(prev =>
        prev.map(a => a.id === id ? { ...a, status: newStatus } : a)
      )
    } catch (err) {
      alert('Error updating status: ' + err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete appointment for "${name}"? This cannot be undone.`)) return
    setDeletingId(id)
    try {
      const res = await fetch(`${API_URL}/api/appointments/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed.')
      setAppointments(prev => prev.filter(a => a.id !== id))
    } catch (err) {
      alert('Error deleting: ' + err.message)
    } finally {
      setDeletingId(null)
    }
  }

  const handleExport = () => {
    window.open(`${API_URL}/api/appointments/export`, '_blank')
  }

  // Counts from all currently loaded appointments
  const counts = appointments.reduce(
    (acc, a) => {
      acc.total++
      if (a.status === 'Pending') acc.pending++
      else if (a.status === 'Completed') acc.completed++
      else if (a.status === 'No-show') acc.noshow++
      return acc
    },
    { total: 0, pending: 0, completed: 0, noshow: 0 }
  )

  // Client-side search on top of server-side filter
  const filtered = appointments.filter(a => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      a.name?.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q) ||
      a.phone?.toLowerCase().includes(q) ||
      a.service_type?.toLowerCase().includes(q)
    )
  })

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  }

  const formatCreatedAt = (ts) => {
    if (!ts) return '—'
    return new Date(ts).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 font-body">
      {/* Top Bar */}
      <header className="bg-ink border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="font-display text-lg font-bold text-white">
              Clinic<span className="text-brand-400">Desk</span>
            </Link>
            <span className="text-slate-600 text-sm">|</span>
            <span className="text-slate-400 text-sm font-medium">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchAppointments}
              className="text-slate-400 hover:text-white text-xs font-medium transition-colors px-3 py-1.5 rounded border border-slate-700 hover:border-slate-500"
            >
              ↻ Refresh
            </button>
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 bg-accent hover:bg-amber-400 text-ink text-xs font-semibold px-4 py-1.5 rounded transition-all"
            >
              ↓ Export CSV
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Leads', value: counts.total, color: 'text-ink', bg: 'bg-white' },
            { label: 'Pending', value: counts.pending, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Completed', value: counts.completed, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'No-shows', value: counts.noshow, color: 'text-red-600', bg: 'bg-red-50' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`${bg} rounded-xl border border-slate-100 p-5`}>
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1">{label}</p>
              <p className={`text-3xl font-display font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filters + Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex gap-2 flex-wrap">
            {FILTER_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all border ${
                  filter === opt
                    ? 'bg-brand-700 text-white border-brand-700'
                    : 'bg-white text-ink-muted border-slate-200 hover:border-brand-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="sm:ml-auto">
            <input
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search name, email, phone..."
              className="input-field w-full sm:w-64 text-xs py-2"
            />
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48 gap-3 text-ink-muted text-sm">
              <span className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              Loading appointments...
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-48 text-center px-6">
              <p className="text-red-600 text-sm font-medium mb-3">{error}</p>
              <button onClick={fetchAppointments} className="btn-primary text-xs px-4 py-2">
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center px-6">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-ink text-sm font-medium">No appointments found</p>
              <p className="text-ink-muted text-xs mt-1">
                {searchQuery ? 'Try a different search term.' : 'Appointments will appear here once booked.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {['Name', 'Contact', 'Service', 'Date & Time', 'Submitted', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-ink-muted uppercase tracking-wide px-5 py-3.5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((appt, i) => (
                    <tr
                      key={appt.id}
                      className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${
                        deletingId === appt.id ? 'opacity-40' : ''
                      }`}
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-ink text-sm">{appt.name}</p>
                        <p className="text-xs text-ink-muted mt-0.5">#{i + 1}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs text-ink">{appt.email}</p>
                        <p className="text-xs text-ink-muted mt-0.5">{appt.phone}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-block bg-brand-50 text-brand-700 text-xs font-medium px-2.5 py-1 rounded-full">
                          {appt.service_type}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs font-medium text-ink">{formatDate(appt.preferred_date)}</p>
                        <p className="text-xs text-ink-muted mt-0.5">{appt.preferred_time}</p>
                      </td>
                      <td className="px-5 py-4 text-xs text-ink-muted whitespace-nowrap">
                        {formatCreatedAt(appt.created_at)}
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={appt.status}
                          disabled={updatingId === appt.id}
                          onChange={e => handleStatusChange(appt.id, e.target.value)}
                          className={`text-xs border rounded-lg px-2.5 py-1.5 font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all disabled:opacity-60 ${
                            appt.status === 'Pending'
                              ? 'bg-amber-50 border-amber-200 text-amber-800'
                              : appt.status === 'Completed'
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                              : 'bg-red-50 border-red-200 text-red-700'
                          }`}
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{STATUS_ICONS[s]} {s}</option>
                          ))}
                        </select>
                        {updatingId === appt.id && (
                          <span className="ml-2 inline-block w-3 h-3 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleDelete(appt.id, appt.name)}
                          disabled={deletingId === appt.id}
                          className="text-xs text-red-500 hover:text-red-700 font-medium hover:underline disabled:opacity-50 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table footer */}
          {!loading && !error && filtered.length > 0 && (
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-ink-muted">
                Showing <span className="font-semibold text-ink">{filtered.length}</span> of {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
              </p>
              <button
                onClick={handleExport}
                className="text-xs text-brand-600 hover:underline font-medium"
              >
                Download as CSV ↓
              </button>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-ink-muted">
          Admin access — <Link to="/" className="text-brand-600 hover:underline">Return to site</Link>
        </p>
      </main>
    </div>
  )
}
