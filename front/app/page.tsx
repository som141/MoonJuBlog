"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PageShell } from "@/components/page-shell"
import { PostList } from "@/components/post-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, TrendingUp, Users, BookOpen, ArrowRight } from "lucide-react"
import { isAuthenticated } from "@/lib/auth"
import api from "@/lib/api"
import { toast } from "sonner"
import type { PostSummary, BoardListResponse } from "@/types"
import { mockPosts } from "@/lib/mock-data"

export default function HomePage() {
  const [recentPosts, setRecentPosts] = useState<PostSummary[]>([])
  const [popularPosts, setPopularPosts] = useState<PostSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    setAuthenticated(isAuthenticated())
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      // Fetch recent posts
      const recentResponse = await api.get<BoardListResponse>("/boards?page=0&size=6&sort=latest")
      setRecentPosts(recentResponse.data.content)

      // Fetch popular posts
      const popularResponse = await api.get<BoardListResponse>("/boards?page=0&size=3&sort=popular")
      setPopularPosts(popularResponse.data.content)
    } catch (error: any) {
      console.warn("API not available, using mock data:", error.message)
      setRecentPosts(mockPosts.slice(0, 6))
      setPopularPosts(mockPosts.slice(0, 3).sort((a, b) => b.favoriteCount - a.favoriteCount))

      if (process.env.NODE_ENV === "development") {
        toast.info(
          "개발 모드: 목업 데이터를 사용중입니다. API 서버를 연결하려면 NEXT_PUBLIC_API_BASE_URL을 설정하세요.",
        )
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/board?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <PageShell>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-balance mb-6">
            <span className="text-primary">MoonJu</span>Blog
          </h1>
          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto leading-relaxed">
            다양한 이야기를 나누고, 새로운 인사이트를 발견하는 공간입니다. 지금 바로 여러분의 생각을 공유해보세요.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="관심있는 주제를 검색해보세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-base"
              />
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/board">
              <Button size="lg" className="w-full sm:w-auto">
                게시글 둘러보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            {authenticated ? (
              <Link href="/write">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                  글쓰기
                </Button>
              </Link>
            ) : (
              <Link href="/signup">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                  회원가입
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-2xl">1,000+</CardTitle>
                <CardDescription>게시글</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-2xl">500+</CardTitle>
                <CardDescription>활성 사용자</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-2xl">10,000+</CardTitle>
                <CardDescription>월간 조회수</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Posts Section */}
      {popularPosts.length > 0 && (
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">인기 게시글</h2>
                <p className="text-muted-foreground">많은 사람들이 관심을 가진 글들을 확인해보세요</p>
              </div>
              <Link href="/board?sort=popular">
                <Button variant="outline">
                  더보기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">
                      <Link href={`/board/${post.id}`} className="hover:text-primary transition-colors">
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-3">{post.preview}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{post.writer}</span>
                      <span>{post.favoriteCount} 좋아요</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">최신 게시글</h2>
              <p className="text-muted-foreground">새로 올라온 따끈따끈한 이야기들</p>
            </div>
            <Link href="/board">
              <Button variant="outline">
                전체보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <PostList posts={recentPosts} loading={loading} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-balance">지금 바로 시작해보세요</h2>
          <p className="text-lg text-muted-foreground mb-8 text-balance">
            MoonJuBlog에서 여러분만의 특별한 이야기를 들려주세요. 다른 사람들과 소통하며 새로운 인사이트를 얻어보세요.
          </p>
          {!authenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  무료로 시작하기
                </Button>
              </Link>
              <Link href="/signin">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                  로그인
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  )
}
