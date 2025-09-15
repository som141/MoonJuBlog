"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Search, Filter } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock favorite posts data
const mockFavoritePosts = [
  {
    board_number: 2,
    title: "React 상태 관리의 모든 것",
    content:
      "useState부터 Zustand, Redux까지 React 애플리케이션에서 상태를 효과적으로 관리하는 방법들을 비교 분석해보겠습니다.",
    writer_email: "react@example.com",
    writer_nickname: "리액트마스터",
    writer_profile_image: "/react-developer.png",
    image: "/react-state-management.png",
    favorite_count: 98,
    comment_count: 42,
    view_count: 1203,
    write_datetime: "2024-09-11T15:45:00",
    favorited_at: "2024-09-12T08:30:00",
  },
  {
    board_number: 3,
    title: "TypeScript 고급 타입 시스템 활용법",
    content:
      "Generic, Conditional Types, Template Literal Types 등 TypeScript의 고급 기능들을 실무에서 어떻게 활용할 수 있는지 살펴보겠습니다.",
    writer_email: "typescript@example.com",
    writer_nickname: "타입스크립트전문가",
    writer_profile_image: "/typescript-expert.jpg",
    image: "/typescript-advanced-types.jpg",
    favorite_count: 156,
    comment_count: 36,
    view_count: 1890,
    write_datetime: "2024-09-10T09:20:00",
    favorited_at: "2024-09-11T14:20:00",
  },
  {
    board_number: 6,
    title: "CSS Grid와 Flexbox 완벽 마스터하기",
    content:
      "현대 웹 레이아웃의 핵심인 CSS Grid와 Flexbox를 언제, 어떻게 사용해야 하는지 실제 예제와 함께 알아보겠습니다.",
    writer_email: "css@example.com",
    writer_nickname: "CSS마법사",
    writer_profile_image: "/diverse-user-avatars.png",
    image: "/placeholder.svg?key=css-grid",
    favorite_count: 67,
    comment_count: 23,
    view_count: 892,
    write_datetime: "2024-09-08T16:30:00",
    favorited_at: "2024-09-09T10:15:00",
  },
]

export default function FavoritesPage() {
  const [favoritePosts, setFavoritePosts] = useState(mockFavoritePosts)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("favorited_at")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "오늘"
    if (diffInDays === 1) return "어제"
    if (diffInDays < 7) return `${diffInDays}일 전`
    return date.toLocaleDateString("ko-KR")
  }

  const filteredPosts = favoritePosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.writer_nickname.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "favorited_at":
        return new Date(b.favorited_at).getTime() - new Date(a.favorited_at).getTime()
      case "write_datetime":
        return new Date(b.write_datetime).getTime() - new Date(a.write_datetime).getTime()
      case "popularity":
        return b.favorite_count - a.favorite_count
      case "views":
        return b.view_count - a.view_count
      default:
        return 0
    }
  })

  const handleRemoveFavorite = (postId: number) => {
    setFavoritePosts((prev) => prev.filter((post) => post.board_number !== postId))
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="h-8 w-8 text-red-500 fill-current" />
              <h1 className="text-4xl font-bold text-balance">좋아요한 글</h1>
            </div>
            <p className="text-xl text-muted-foreground text-pretty">
              마음에 들어 저장한 글들을 모아보세요. 총 {favoritePosts.length}개의 글을 좋아요했습니다.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="제목, 내용, 작성자로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  {sortBy === "favorited_at"
                    ? "좋아요한 순"
                    : sortBy === "write_datetime"
                      ? "최신순"
                      : sortBy === "popularity"
                        ? "인기순"
                        : "조회수순"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("favorited_at")}>좋아요한 순</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("write_datetime")}>최신순</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("popularity")}>인기순</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("views")}>조회수순</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Favorites List */}
          <div className="space-y-6">
            {sortedPosts.length > 0 ? (
              sortedPosts.map((post) => (
                <div key={post.board_number} className="relative">
                  {/* Favorited Date */}
                  <div className="text-sm text-muted-foreground mb-2">{formatDate(post.favorited_at)}에 좋아요함</div>

                  {/* Post Card with Remove Button */}
                  <div className="relative group">
                    <PostCard post={post} />

                    {/* Remove from Favorites Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveFavorite(post.board_number)}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
                    >
                      <Heart className="h-4 w-4 mr-1 fill-current text-red-500" />
                      좋아요 취소
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {searchQuery ? "검색 결과가 없습니다" : "아직 좋아요한 글이 없습니다"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery ? "다른 검색어로 시도해보세요." : "마음에 드는 글에 좋아요를 눌러보세요."}
                  </p>
                  {!searchQuery && (
                    <Button asChild>
                      <a href="/">글 둘러보기</a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Load More */}
          {sortedPosts.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                더 많은 좋아요한 글 보기
              </Button>
            </div>
          )}

          {/* Quick Stats */}
          {favoritePosts.length > 0 && (
            <Card className="mt-12">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-center">좋아요 통계</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-secondary">{favoritePosts.length}</p>
                    <p className="text-sm text-muted-foreground">총 좋아요</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary">
                      {new Set(favoritePosts.map((p) => p.writer_email)).size}
                    </p>
                    <p className="text-sm text-muted-foreground">작성자 수</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary">
                      {Math.round(
                        favoritePosts.reduce((sum, p) => sum + p.view_count, 0) / favoritePosts.length,
                      ).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">평균 조회수</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary">
                      {
                        favoritePosts.filter(
                          (p) => new Date(p.favorited_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000,
                        ).length
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">이번 주 좋아요</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
