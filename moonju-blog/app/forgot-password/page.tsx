"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Mock forgot password API call
    setTimeout(() => {
      console.log("Forgot password request for:", email)
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1000)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl">이메일을 확인하세요</CardTitle>
              <CardDescription>비밀번호 재설정 링크를 {email}로 보내드렸습니다.</CardDescription>
            </CardHeader>

            <CardContent className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">이메일이 도착하지 않았나요? 스팸 폴더를 확인해보세요.</p>
              <Button variant="outline" onClick={() => setIsSubmitted(false)} className="w-full">
                다른 이메일로 다시 시도
              </Button>
            </CardContent>

            <CardFooter>
              <Link href="/login" className="w-full">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  로그인으로 돌아가기
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">MJ</span>
            </div>
            <span className="font-bold text-2xl text-foreground">MoonJu</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">비밀번호 찾기</CardTitle>
            <CardDescription className="text-center">
              가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "전송 중..." : "재설정 링크 보내기"}
              </Button>
            </form>
          </CardContent>

          <CardFooter>
            <Link href="/login" className="w-full">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                로그인으로 돌아가기
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
