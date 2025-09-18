"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageShell } from "@/components/page-shell"
import { FormField, FormInput } from "@/components/form-field"
import { signUpSchema, type SignUpFormData } from "@/lib/validations"
import { setToken } from "@/lib/auth"
import api from "@/lib/api"
import { toast } from "sonner"
import type { SignResponse } from "@/types"

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  })

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true)
    try {
      const response = await api.post<SignResponse>("/api/signUp", data)

      if (response.data.code === "su") {
        if (response.data.token) {
          setToken(response.data.token)
          toast.success("회원가입이 완료되었습니다!")
          router.push("/")
          router.refresh()
        } else {
          toast.success("회원가입이 완료되었습니다! 로그인해주세요.")
          router.push("/signin")
        }
      } else {
        setError("root", { message: response.data.message || "회원가입에 실패했습니다." })
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "회원가입 중 오류가 발생했습니다."
      setError("root", { message })
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageShell>
      <div className="container max-w-md mx-auto px-4 py-16">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
            <CardDescription>MoonJuBlog 계정을 만들어보세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField label="이메일" error={errors.email?.message} required>
                <FormInput
                  type="email"
                  placeholder="이메일을 입력하세요"
                  error={!!errors.email}
                  {...register("email")}
                />
              </FormField>

              <FormField label="비밀번호" error={errors.password?.message} required>
                <FormInput
                  type="password"
                  placeholder="8자 이상 입력하세요"
                  error={!!errors.password}
                  {...register("password")}
                />
              </FormField>

              <FormField label="닉네임" error={errors.nickname?.message} required>
                <FormInput
                  type="text"
                  placeholder="닉네임을 입력하세요"
                  error={!!errors.nickname}
                  {...register("nickname")}
                />
              </FormField>

              <FormField label="전화번호" error={errors.telNumber?.message} required>
                <FormInput
                  type="tel"
                  placeholder="010-1234-5678"
                  error={!!errors.telNumber}
                  {...register("telNumber")}
                />
              </FormField>

              <FormField label="주소" error={errors.address?.message} required>
                <FormInput
                  type="text"
                  placeholder="주소를 입력하세요"
                  error={!!errors.address}
                  {...register("address")}
                />
              </FormField>

              <FormField label="상세주소" error={errors.addressDetail?.message} required>
                <FormInput
                  type="text"
                  placeholder="상세주소를 입력하세요"
                  error={!!errors.addressDetail}
                  {...register("addressDetail")}
                />
              </FormField>

              <FormField label="프로필 이미지 URL" error={errors.profileImage?.message}>
                <FormInput
                  type="url"
                  placeholder="https://example.com/image.jpg (선택사항)"
                  error={!!errors.profileImage}
                  {...register("profileImage")}
                />
              </FormField>

              {errors.root && (
                <div className="text-sm text-destructive text-center p-3 bg-destructive/10 rounded-lg">
                  {errors.root.message}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "가입 중..." : "회원가입"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                이미 계정이 있으신가요?{" "}
                <Link href="/signin" className="text-primary hover:underline font-medium">
                  로그인
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
