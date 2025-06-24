"use client"

import type React from "react"
import { useState, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "lucide-react"
import { createReservation } from "./actions"

interface FormData {
  name: string
  phone: string
  photoTypes: string[]
  shootingMonth: string
  privacyConsent: boolean
  referralSources: string[]
}

interface MonthOption {
  value: string
  label: string
}

export default function FamilyPhotoEvent() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    photoTypes: [],
    shootingMonth: "",
    privacyConsent: false,
    referralSources: [],
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const contactFormRef = useRef<HTMLDivElement>(null)

  const photoTypeOptions = [
    { id: "가족사진", label: "가족사진 (5인 이하)" },
    { id: "대가족사진", label: "대가족사진 (6인 이상)" },
    { id: "리마인드웨딩", label: "리마인드웨딩" },
    { id: "장수사진", label: "장수사진" },
    { id: "칠순&팔순 상차림", label: "칠순&팔순 상차림" },
  ]

  const referralSourceOptions = [
    { id: "naver", label: "네이버" },
    { id: "blog", label: "블로그" },
    { id: "instagram", label: "인스타그램" },
    { id: "google", label: "구글" },
    { id: "kakao", label: "카카오" },
    { id: "friend", label: "지인소개" },
  ]

  // 현재 연월을 기준으로 12개월 생성
  const monthOptions = useMemo((): MonthOption[] => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() // 0-11
    const options: MonthOption[] = []

    for (let i = 0; i < 12; i++) {
      const targetDate = new Date(currentYear, currentMonth + i, 1)
      const year = targetDate.getFullYear()
      const month = targetDate.getMonth() + 1 // 1-12

      const value = `${year}-${month.toString().padStart(2, "0")}`
      const label = `${year}년 ${month}월`

      options.push({ value, label })
    }

    return options
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const result = await createReservation({
        name: formData.name,
        phone: formData.phone,
        photo_types: formData.photoTypes,
        shooting_month: formData.shootingMonth,
        privacy_consent: formData.privacyConsent,
        referral_sources: formData.referralSources,
      })

      if (result.success) {
        console.log("Reservation created:", result.data)
        setIsSubmitted(true)

        setTimeout(() => {
          setIsSubmitted(false)
          setFormData({
            name: "",
            phone: "",
            photoTypes: [],
            shootingMonth: "",
            privacyConsent: false,
            referralSources: [],
          })
        }, 3000)
      } else {
        setSubmitError(result.error || "예약 접수 중 오류가 발생했습니다.")
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitError("예약 접수 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handlePhotoTypeChange = (photoType: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      photoTypes: prev.photoTypes.includes(photoType)
        ? prev.photoTypes.filter((type: string) => type !== photoType)
        : [...prev.photoTypes, photoType],
    }))
  }

  const handleReferralSourceChange = (source: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      referralSources: prev.referralSources.includes(source)
        ? prev.referralSources.filter((s: string) => s !== source)
        : [...prev.referralSources, source],
    }))
  }

  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      privacyConsent: e.target.checked,
    })
  }

  const scrollToContactForm = () => {
    contactFormRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-pink-50">
      {/* Floating Button */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50">
        <button
          onClick={scrollToContactForm}
          className="flex flex-col items-center justify-center bg-gradient-to-r from-amber-500 to-orange-500 text-white p-2 md:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Calendar className="w-4 h-4 md:w-6 md:h-6 mb-0.5 md:mb-1" />
          <span className="text-[10px] md:text-xs font-bold whitespace-nowrap">예약문의</span>
        </button>
      </div>

      {/* Hero Section with Template Design */}
      <section className="relative">
        <div className="bg-gradient-to-br from-amber-100 via-orange-100 to-pink-100 px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-medium text-amber-800 mb-6">
              SPECIAL EVENT
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight">
              가족사진
              <br />
              <span className="text-amber-600">촬영 EVENT</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              소중한 가족과 함께하는 특별한 순간을
              <br />
              아름답게 담아드립니다
            </p>
          </div>
        </div>

        {/* Main Family Photo */}
        <div className="max-w-6xl mx-auto px-4 -mt-8">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <img src="/template.png" alt="가족사진 메인" className="w-full h-auto object-contain mx-auto" />
          </div>
        </div>
      </section>

      {/* Family Story Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">가족의 사랑이 담긴 순간을 기억하세요</h2>
          <p className="text-lg text-gray-600 mb-12 leading-relaxed">
            시간이 흘러도 변하지 않는 가족의 사랑을 사진으로 남겨보세요.
            <br />
            전문 포토그래퍼가 여러분의 소중한 추억을 아름답게 담아드립니다.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section
        ref={contactFormRef}
        className="py-20 px-4 bg-gradient-to-br from-amber-100 via-orange-100 to-pink-100 scroll-mt-16"
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">지금 바로 예약하세요</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              소중한 가족사진 촬영을 위해 연락처를 남겨주세요.
              <br />
              전문 상담사가 빠른 시간 내에 연락드리겠습니다.
            </p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">문의가 접수되었습니다!</h3>
                  <p className="text-gray-600 text-lg">
                    빠른 시간 내에 연락드려 상담을 도와드리겠습니다.
                    <br />
                    감사합니다.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <Label htmlFor="name" className="text-lg font-medium text-gray-700 mb-2 block">
                      성함 *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="성함을 입력해주세요"
                      className="h-14 text-lg border-2 border-gray-200 focus:border-amber-400 rounded-xl"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-lg font-medium text-gray-700 mb-2 block">
                      연락처 *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="010-0000-0000"
                      className="h-14 text-lg border-2 border-gray-200 focus:border-amber-400 rounded-xl"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label className="text-lg font-medium text-gray-700 mb-4 block">촬영 종류 * (중복 선택 가능)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {photoTypeOptions.map((option) => (
                        <div key={option.id} className="flex items-center gap-3">
                          <input
                            id={option.id}
                            type="checkbox"
                            checked={formData.photoTypes.includes(option.id)}
                            onChange={() => handlePhotoTypeChange(option.id)}
                            className="w-5 h-5 text-amber-600 border-2 border-gray-300 rounded focus:ring-amber-500"
                            disabled={isSubmitting}
                          />
                          <Label htmlFor={option.id} className="text-sm text-gray-700 cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {formData.photoTypes.length === 0 && (
                      <p className="text-sm text-red-500 mt-2">촬영 종류를 하나 이상 선택해주세요.</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-lg font-medium text-gray-700 mb-4 block">어떻게 알게 되셨나요? (중복 선택 가능)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {referralSourceOptions.map((option) => (
                        <div key={option.id} className="flex items-center gap-3">
                          <input
                            id={option.id}
                            type="checkbox"
                            checked={formData.referralSources.includes(option.id)}
                            onChange={() => handleReferralSourceChange(option.id)}
                            className="w-5 h-5 text-amber-600 border-2 border-gray-300 rounded focus:ring-amber-500"
                            disabled={isSubmitting}
                          />
                          <Label htmlFor={option.id} className="text-sm text-gray-700 cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="shootingMonth" className="text-lg font-medium text-gray-700 mb-2 block">
                      촬영 예정월 *
                    </Label>
                    <select
                      id="shootingMonth"
                      name="shootingMonth"
                      required
                      value={formData.shootingMonth}
                      onChange={handleInputChange}
                      className="w-full h-14 text-lg border-2 border-gray-200 focus:border-amber-400 rounded-xl px-4 bg-white"
                      disabled={isSubmitting}
                    >
                      <option value="">촬영 예정월을 선택해주세요</option>
                      {monthOptions.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      id="privacy"
                      name="privacy"
                      type="checkbox"
                      required
                      checked={formData.privacyConsent}
                      onChange={handlePrivacyChange}
                      className="mt-1 w-5 h-5 text-amber-600 border-2 border-gray-300 rounded focus:ring-amber-500"
                      disabled={isSubmitting}
                    />
                    <Label htmlFor="privacy" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
                      개인정보 수집 및 이용에 동의합니다. *
                      <br />
                      <span className="text-xs text-gray-500">
                        수집항목: 성명, 연락처, 촬영종류, 촬영예정월 | 이용목적: 상담 및 예약 안내 | 보유기간: 상담 완료
                        후 1년
                      </span>
                    </Label>
                  </div>

                  {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-red-600 text-sm">{submitError}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={formData.photoTypes.length === 0 || isSubmitting}
                    className="w-full h-16 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "접수 중..." : "지금 예약 문의하기"}
                  </Button>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    개인정보는 상담 목적으로만 사용되며, 안전하게 보호됩니다.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Studio Info */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">스튜디오 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">📍 위치</h3>
              <p className="text-gray-600">
                전라남도 순천시 조례동 1823-5
                <br />
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">📞 연락처</h3>
              <p className="text-gray-600">
                전화: 061-721-4800
                <br />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Family Photo Studio</h3>
          <p className="text-gray-400 mb-6 text-lg">가족의 소중한 순간을 아름답게 담아드립니다</p>
          <div className="flex flex-col md:flex-row justify-center gap-4 text-sm text-gray-400">
            <span>사업자등록번호: 416-10-35417</span>
            <span className="hidden md:inline">|</span>
            <span>대표: 남유행</span>
            <span className="hidden md:inline">|</span>
            <span>주소: 전라남도 순천시 조례동 1823-5</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
