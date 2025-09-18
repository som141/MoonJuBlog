"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { PageShell } from "@/components/page-shell"
import { PostList } from "@/components/post-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus } from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"
import { toast } from "sonner"
import { isAuthenticated } from "@/lib/auth"
import type { BoardListResponse, PostSummary } from "@/types"
import { mockPosts } from "@/lib/mock-data"

export default function BoardPage() {
  const [posts, setPosts] = useState<PostSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("latest")
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [authenticated, setAuthenticated] = useState(false)

  const searchParams = useSearchParams()

  useEffect(() => {
    setAuthenticated(isAuthenticated())
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [currentPage, sortBy])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: "12",
        ...(searchQuery && { q: searchQuery }),
        ...(sortBy !== "latest" && { sort: sortBy }),
      })

      const response = await api.get<BoardListResponse>(`/boards?${params}`)
      setPosts(response.data.content)
      setTotalPages(Math.ceil(response.data.total / 12))
    } catch (error: any) {
      console.warn("API not available, using mock data:", error.message)
      let filteredPosts = [...mockPosts]

      // Apply search filter
      if (searchQuery) {
        filteredPosts = filteredPosts.filter(
          (post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.preview.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      }

      // Apply sorting
      if (sortBy === "popular") {
        filteredPosts.sort((a, b) => b.favoriteCount - a.favoriteCount)
      } else if (sortBy === "views") {
        filteredPosts.sort((a, b) => b.viewCount - a.viewCount)
      } else {
        filteredPosts.sort((a, b) => new Date(b.writeDatetime).getTime() - new Date(a.writeDatetime).getTime())
      }

      // Apply pagination
      const startIndex = currentPage * 12
      const endIndex = startIndex + 12
      setPosts(filteredPosts.slice(startIndex, endIndex))
      setTotalPages(Math.ceil(filteredPosts.length / 12))

      if (currentPage === 0 && process.env.NODE_ENV === "development") {
        toast.info("개발 모드: 목업 데이터를 사용중입니다.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(0)
    fetchPosts()
  }

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-balance">게시판</h1>
            <p className="text-muted-foreground mt-2">다양한 이야기를 나누어보세요</p>
          </div>
          {authenticated && (
            <Link href="/write">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                글쓰기
              </Button>
            </Link>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="제목이나 내용으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">검색</Button>
          </form>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="정렬 기준" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">최신순</SelectItem>
              <SelectItem value="popular">인기순</SelectItem>
              <SelectItem value="views">조회순</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Post List */}
        <PostList posts={posts} loading={loading} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-12">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
            >
              이전
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum + 1}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
            >
              다음
            </Button>
          </div>
        )}
      </div>
    </PageShell>
  )
}
