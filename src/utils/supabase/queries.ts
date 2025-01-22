import { SupabaseClient } from "@supabase/supabase-js"
import { cache } from "react"

export const getUser = cache(async (supabase: SupabaseClient) => {
  const { data } = await supabase.auth.getUser()
  return data.user
})

export const getUserDetails = cache(async (supabase: SupabaseClient) => {
  const { data: userDetails } = await supabase.from("users").select("*").single()
  return userDetails
})
