"use server"

import { getSupabase } from "@/lib/supabase"
import type { StudioReservation } from "@/lib/supabase"
import { sendKakaoNotification, sendKakaoNotificationToCustomer } from "@/utils/kakao"

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

    // 카카오 알림톡 전송
    try {
      const kakaoData = {
        name: data.name,
        phone: data.phone,
        date: data.shooting_month,
        time: "", // 시간 정보가 없으므로 빈 문자열
        shootingType: data.photo_types.join(", "), // 배열을 문자열로 변환
        people: 0, // 인원 정보가 없으므로 0
        referralSources: data.referral_sources, // 유입경로 추가
      }

      // 스튜디오에 알림톡 전송
      const studioNotification = await sendKakaoNotification(kakaoData)
      if (!studioNotification.success) {
        console.error("스튜디오 알림톡 전송 실패:", studioNotification.error)
      }

      // 고객에게 알림톡 전송
      const customerNotification = await sendKakaoNotificationToCustomer(kakaoData)
      if (!customerNotification.success) {
        console.error("고객 알림톡 전송 실패:", customerNotification.error)
      }

      console.log("알림톡 전송 완료")
    } catch (kakaoError) {
      console.error("카카오 알림톡 전송 중 오류:", kakaoError)
      // 알림톡 실패해도 예약은 성공으로 처리
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
