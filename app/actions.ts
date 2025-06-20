"use server"

import { getSupabase } from "@/lib/supabase"
import type { StudioReservation } from "@/lib/supabase"

export async function createReservation(data: Omit<StudioReservation, "id" | "created_at">) {
  try {
    const supabase = getSupabase()

    const { data: reservation, error } = await supabase
      .from("reservations")
      .insert([
        {
          name: data.name,
          phone: data.phone,
          shooting_type: data.photo_types,
          date: data.shooting_month,
          referral_sources: data.referral_sources,
        },
      ])
      .select()

    if (error) {
      console.error("Supabase error:", error)
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      data: reservation,
    }
  } catch (error) {
    console.error("Unexpected error:", error)
    return {
      success: false,
      error: "예상치 못한 오류가 발생했습니다.",
    }
  }
}
