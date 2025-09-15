"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { isAuthenticated, removeToken } from "@/lib/auth"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    setAuthenticated(isAuthenticated())
  }, [])

  const handleSignOut = () => {
    removeToken()
    setAuthenticated(false)
    window.location.href = "/"
  }

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            MoonJuBlog
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              홈
            </Link>
            <Link href="/board" className="text-foreground hover:text-primary transition-colors">
              게시판
            </Link>
            {authenticated && (
              <Link href="/write" className="text-foreground hover:text-primary transition-colors">
                글쓰기
              </Link>
            )}
            {authenticated ? (
              <Button onClick={handleSignOut} variant="outline" size="sm">
                로그아웃
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/signin">
                  <Button variant="outline" size="sm">
                    로그인
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">회원가입</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} aria-label="메뉴 토글">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-foreground hover:text-primary transition-colors px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                홈
              </Link>
              <Link
                href="/board"
                className="text-foreground hover:text-primary transition-colors px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                게시판
              </Link>
              {authenticated && (
                <Link
                  href="/write"
                  className="text-foreground hover:text-primary transition-colors px-2 py-1"
                  onClick={() => setIsOpen(false)}
                >
                  글쓰기
                </Link>
              )}
              {authenticated ? (
                <Button
                  onClick={() => {
                    handleSignOut()
                    setIsOpen(false)
                  }}
                  variant="outline"
                  size="sm"
                  className="w-fit"
                >
                  로그아웃
                </Button>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link href="/signin" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" size="sm" className="w-fit bg-transparent">
                      로그인
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    <Button size="sm" className="w-fit">
                      회원가입
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
