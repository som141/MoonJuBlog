"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = isAuthenticated()
      setAuthenticated(isAuth)

      if (!isAuth) {
        router.push("/signin")
      }
    }

    checkAuth()
  }, [router])

  if (authenticated === null) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">로딩 중...</p>
          </div>
        </div>
      )
    )
  }

  if (!authenticated) {
    return null
  }

  return <>{children}</>
}
