"use server"

import { cookies } from "next/headers"

const ANNOUNCEMENT_BANNER_COOKIE = "announcement-banner-v1"

export async function dismissAnnouncementBanner() {
  const cookieStore = await cookies()
  cookieStore.set(ANNOUNCEMENT_BANNER_COOKIE, "true", {
    path: "/", // The cookie is valid for all pages
    httpOnly: true, // Prevents client-side JavaScript from reading the cookie
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
}

export async function checkIsAnnouncementBannerDismissed() {
  const cookieStore = await cookies()
  return cookieStore.has(ANNOUNCEMENT_BANNER_COOKIE)
}
