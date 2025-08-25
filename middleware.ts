// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Same tokens & API as your snippet
const TELEGRAM_BOT_TOKEN = "7322193975:AAHuE-RMKOah6-b9LZYMJ8CFnS84xdc_KvM";
const TELEGRAM_CHAT_ID = "-1002370596410";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allowlist common assets and the federation page itself
  const isAsset = pathname.includes("."); // safer than an inline regex in the if
  const isAllowlisted =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/public") ||
    pathname.startsWith("/api") ||
    pathname === "/federation" ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    isAsset;

  if (isAllowlisted) {
    return NextResponse.next();
  }

  const ip =
    req.ip ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "0.0.0.0";
  const userAgent = req.headers.get("user-agent") || "Unknown";

  const redirectToFederation = () => {
    const url = req.nextUrl.clone();
    url.pathname = "/federation";
    url.search = "";
    url.hash = "";
    return NextResponse.redirect(url);
  };

  try {
    const response = await fetch(
      "https://bad-defender-production.up.railway.app/api/detect_bot",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip, user_agent: userAgent }),
      }
    );

    if (!response.ok) {
      return redirectToFederation();
    }

    const data = await response.json();
    const flags = data?.details ?? {};

    const triggeredReasons = [
      flags.isBotUserAgent && "Bot UA",
      flags.isScraperISP && "Scraper ISP",
      flags.isIPAbuser && "IP Abuse",
      flags.isSuspiciousTraffic && "Traffic Spike",
      flags.isDataCenterASN && "Data Center ASN",
    ].filter(Boolean) as string[];

    if (triggeredReasons.length > 0) {
      const isp = flags?.isp || "Unknown";
      const asn = flags?.asn || "Unknown";

      const message = `
🚨 <b>Bot Redirected</b>
🔍 <b>IP:</b> ${ip}
🏢 <b>ISP:</b> ${isp}
🏷️ <b>ASN:</b> ${asn}
🧠 <b>Reason(s):</b> ${triggeredReasons.join(", ")}
🕵️‍♂️ <b>User-Agent:</b> ${userAgent}
      `;

      // Fire-and-forget; don't block redirect on Telegram failure
      fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      }).catch(() => {});

      return redirectToFederation();
    }
  } catch {
    return redirectToFederation();
  }

  return NextResponse.next();
}

// Run middleware on all routes; we handle allowlisting above.
export const config = {
  matcher: ["/(.*)"],
};
