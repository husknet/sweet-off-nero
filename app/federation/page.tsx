import IndustrialShell from "@/components/IndustrialShell";
import Link from "next/link";


export const dynamic = "force-static"; // ensure static HTML
export const metadata = {
title: "Network Check",
description: "Please verify your connection and try again.",
};


export default function FederationPage() {
return (
<IndustrialShell
title="Network check needed"
subtitle="We couldn’t complete your request from this network"
>
<div className="max-w-md mx-auto text-center space-y-4">
<p className="text-white/80">
We couldn’t reach all required services from your connection. This can
happen with VPNs, proxies, ad‑blockers, or strict firewalls.
</p>
<ul className="text-left text-white/70 list-disc list-inside space-y-1">
<li>Temporarily disable VPN/proxy and ad‑blockers</li>
<li>Verify your device date & time settings</li>
<li>Ensure your firewall allows outgoing HTTPS</li>
<li>Reload the page after adjustments</li>
</ul>
<div className="flex items-center justify-center gap-3 pt-2">
<Link href="/" className="btn-primary px-4 py-2 rounded-xl">
Try again
</Link>
<Link href="/loading" className="underline">
Troubleshoot
</Link>
</div>
</div>
</IndustrialShell>
);
}
