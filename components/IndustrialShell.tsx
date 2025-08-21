'use client'
import { motion } from 'framer-motion'
import { Shield, ScanLine, LogIn } from 'lucide-react'
import Link from 'next/link'

export default function IndustrialShell({
  title,
  subtitle,
  children
}: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundColor: '#0077be', // Ocean blue
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'><path fill='%230066aa' fill-opacity='1' d='M0,160L60,160C120,160,240,160,360,154.7C480,149,600,139,720,133.3C840,128,960,128,1080,122.7C1200,117,1320,107,1380,101.3L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z'></path></svg>")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="card max-w-xl w-full p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-metal-line/50" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-metal-line/50" />
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-metal-glow/50 to-transparent animate-flicker" />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-metal-glow" />
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        </div>

        {subtitle && <p className="text-sm text-white/60 mb-6">{subtitle}</p>}
        <div className="relative">{children}</div>

        <div className="mt-6 text-xs text-white/40 flex items-center gap-2">
          <ScanLine className="w-4 h-4" />
          <span>Industry build. </span>
          <span className="ml-auto inline-flex items-center gap-1">
            <LogIn className="w-3 h-3" />
            <Link className="underline hover:opacity-80" href="/">Email phase</Link>
          </span>
        </div>
      </motion.div>
    </div>
  )
}
