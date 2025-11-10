export function getURL(path = ""): string {
  const rawBase = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  const base = normalizeBase(rawBase)
  return new URL(path, base).toString()
}

function normalizeBase(raw: string): string {
  let url = raw.trim()

  // Add protocol if missing. Use http for localhost, https otherwise.
  if (!/^https?:\/\//i.test(url)) {
    const isLocal = /^localhost(?::\d+)?(\/|$)/i.test(url)
    url = `${isLocal ? "http" : "https"}://${url}`
  }

  // Ensure trailing slash so URL(base, path) works consistently
  if (!url.endsWith("/")) url += "/"

  return url
}
