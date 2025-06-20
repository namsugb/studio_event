import { createClient } from "@supabase/supabase-js"

// Check if environment variables are available and provide fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Create a singleton instance of the Supabase client
let supabaseInstance: ReturnType<typeof createClient> | null = null

export function getSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing. Please check your environment variables.")
    throw new Error("Supabase configuration is incomplete. Check your environment variables.")
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  }

  return supabaseInstance
}

export type StudioReservation = {
  id?: number
  name: string
  phone: string
  photo_types: string[]
  shooting_month: string
  privacy_consent: boolean
  referral_sources: string[]
  created_at?: string
}
