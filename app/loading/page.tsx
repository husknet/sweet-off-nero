'use client'
import IndustrialShell from '@/components/IndustrialShell'

export default function LoadingTrap() {
  return (
    <IndustrialShell title="System Check" subtitle="Please wait while we calibrate sensors…">
      <div className="aspect-video w-full rounded-xl overflow-hidden border border-metal-line bg-metal-800 grid place-items-center">
        <img src="/industrial-loader.gif" alt="Loading" className="w-full h-full object-cover" />
      </div>
      <p className="text-xs text-white/40 mt-4">If you’re seeing this indefinitely, you might be a bot. 🤖</p>
    </IndustrialShell>
  )
}
