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
import { signInSchema, type SignInFormData } from "@/lib/validations"
import { setToken } from "@/lib/auth"
import api from "@/lib/api"
import { toast } from "sonner"
import type { SignResponse } from "@/types"

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true)
    try {
      const response = await api.post<SignResponse>("/signIn", data)

      if (response.data.code === "su" && response.data.token) {
        setToken(response.data.token)
        toast.success("로그인에 성공했습니다!")
        router.push("/")
        router.refresh()
      } else {
        setError("root", { message: response.data.message || "로그인에 실패했습니다." })
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "로그인 중 오류가 발생했습니다."
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
            <CardTitle className="text-2xl font-bold">로그인</CardTitle>
            <CardDescription>MoonJuBlog에 오신 것을 환영합니다</CardDescription>
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
                  placeholder="비밀번호를 입력하세요"
                  error={!!errors.password}
                  {...register("password")}
                />
              </FormField>

              {errors.root && (
                <div className="text-sm text-destructive text-center p-3 bg-destructive/10 rounded-lg">
                  {errors.root.message}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "로그인 중..." : "로그인"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                계정이 없으신가요?{" "}
                <Link href="/signup" className="text-primary hover:underline font-medium">
                  회원가입
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
