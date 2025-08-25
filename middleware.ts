import { NextResponse } from "next/server";
/\.[^/]+$/.test(pathname) // any file with an extension
) {
return NextResponse.next();
}


const ip =
req.ip ||
req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
"0.0.0.0";
const userAgent = req.headers.get("user-agent") || "Unknown";


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
const deniedUrl = req.nextUrl.clone();
deniedUrl.pathname = "/federation"; // redirect to friendly static page
return NextResponse.redirect(deniedUrl);
}


const data = await response.json();
const flags = data.details || {};


const suspiciousFlags: Record<string, boolean> = {
"Bot UA": !!flags.isBotUserAgent,
"Scraper ISP": !!flags.isScraperISP,
"IP Abuse": !!flags.isIPAbuser,
"Traffic Spike": !!flags.isSuspiciousTraffic,
"Data Center ASN": !!flags.isDataCenterASN,
};


const triggeredReasons = Object.entries(suspiciousFlags)
.filter(([, val]) => val)
.map(([key]) => key);


const isSuspicious = triggeredReasons.length > 0;


if (isSuspicious) {
const isp = flags?.isp || "Unknown";
const asn = flags?.asn || "Unknown";


const message = `\n🚨 <b>Bot Redirected</b>\n🔍 <b>IP:</b> ${ip}\n🏢 <b>ISP:</b> ${isp}\n🏷️ <b>ASN:</b> ${asn}\n🧠 <b>Reason(s):</b> ${triggeredReasons.join(", ")}\n🕵️‍♂️ <b>User-Agent:</b> ${userAgent}\n `;


try {
await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
chat_id: TELEGRAM_CHAT_ID,
text: message,
parse_mode: "HTML",
}),
});
} catch (telegramError) {
console.error("Failed to send Telegram alert:", telegramError);
}


const deniedUrl = req.nextUrl.clone();
deniedUrl.pathname = "/federation";
return NextResponse.redirect(deniedUrl);
}
} catch (error) {
console.error("Bot detection error:", error);
const deniedUrl = req.nextUrl.clone();
deniedUrl.pathname = "/federation";
return NextResponse.redirect(deniedUrl);
}


return NextResponse.next();
}


export const config = {
// Run on most paths; we still have allowlist checks above
matcher: [
"/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api|federation).*)",
],
};
