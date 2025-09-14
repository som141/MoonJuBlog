"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PostCard } from "@/components/post-card"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock search results
const mockSearchResults = [
  {
    board_number: 1,
    title: "Next.js 14와 함께하는 모던 웹 개발",
    content: "Next.js 14의 새로운 기능들과 App Router를 활용한 효율적인 웹 개발 방법에 대해 알아보겠습니다.",
    writer_email: "developer@example.com",
    writer_nickname: "개발자김씨",
    writer_profile_image: "/developer-avatar.png",
    image: "/nextjs-development.png",
    favorite_count: 24,
    comment_count: 8,
    view_count: 156,
    write_datetime: "2024-09-12T10:30:00",
  },
  {
    board_number: 2,
    title: "React 상태 관리의 모든 것",
    content:
      "useState부터 Zustand, Redux까지 React 애플리케이션에서 상태를 효과적으로 관리하는 방법들을 비교 분석해보겠습니다.",
    writer_email: "react@example.com",
    writer_nickname: "리액트마스터",
    writer_profile_image: "/react-developer.png",
    image: "/react-state-management.png",
    favorite_count: 18,
    comment_count: 12,
    view_count: 203,
    write_datetime: "2024-09-11T15:45:00",
  },
]

const popularSearches = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "CSS",
  "Node.js",
  "웹개발",
  "프론트엔드",
  "백엔드",
  "API",
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState(mockSearchResults)
  const [isLoading, setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState("relevance")

  useEffect(() => {
    const query = searchParams.get("q")
    if (query) {
      setSearchQuery(query)
      performSearch(query)
    }
  }, [searchParams])

  const performSearch = async (query: string) => {
    setIsLoading(true)
    // Mock search API call
    setTimeout(() => {
      // Filter results based on query (mock implementation)
      const filtered = mockSearchResults.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.content.toLowerCase().includes(query.toLowerCase()),
      )
      setSearchResults(filtered)
      setIsLoading(false)
    }, 500)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      performSearch(searchQuery)
      // Update URL with search query
      window.history.pushState({}, "", `/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handlePopularSearch = (term: string) => {
    setSearchQuery(term)
    performSearch(term)
    window.history.pushState({}, "", `/search?q=${encodeURIComponent(term)}`)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    window.history.pushState({}, "", "/search")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-center mb-6">검색</h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="search"
                placeholder="검색어를 입력하세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 h-12 text-lg"
              />
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button type="submit" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? "검색 중..." : "검색"}
            </Button>
          </form>

          {/* Popular Searches */}
          {!searchQuery && (
            <div>
              <h3 className="text-lg font-semibold mb-4">인기 검색어</h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-secondary hover:text-secondary-foreground transition-colors"
                    onClick={() => handlePopularSearch(term)}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-semibold mb-2">"{searchQuery}" 검색 결과</h2>
                <p className="text-muted-foreground">총 {searchResults.length}개의 결과를 찾았습니다</p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    정렬
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortBy("relevance")}>관련도순</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("date")}>최신순</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("popularity")}>인기순</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Results Grid */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">검색 중...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {searchResults.map((post) => (
                  <PostCard key={post.board_number} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">검색 결과가 없습니다</h3>
                <p className="text-muted-foreground mb-6">다른 검색어로 시도해보시거나 인기 검색어를 참고해보세요.</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {popularSearches.slice(0, 5).map((term, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-secondary hover:text-secondary-foreground transition-colors"
                      onClick={() => handlePopularSearch(term)}
                    >
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Load More */}
            {searchResults.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  더 많은 검색 결과 보기
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
