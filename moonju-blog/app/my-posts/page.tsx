"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, Eye, Heart, MessageCircle, Calendar, MoreHorizontal, Edit, Trash2 } from "lucide-react"

// Mock user posts data
const mockMyPosts = [
  {
    board_number: 1,
    title: "Next.js 14와 함께하는 모던 웹 개발",
    content: "Next.js 14의 새로운 기능들과 App Router를 활용한 효율적인 웹 개발 방법에 대해 알아보겠습니다.",
    view_count: 1560,
    favorite_count: 124,
    comment_count: 28,
    write_datetime: "2024-09-12T10:30:00",
    status: "published",
    tags: ["Next.js", "React", "웹개발"],
  },
  {
    board_number: 2,
    title: "React 상태 관리의 모든 것",
    content:
      "useState부터 Zustand, Redux까지 React 애플리케이션에서 상태를 효과적으로 관리하는 방법들을 비교 분석해보겠습니다.",
    view_count: 1203,
    favorite_count: 98,
    comment_count: 42,
    write_datetime: "2024-09-11T15:45:00",
    status: "published",
    tags: ["React", "상태관리", "JavaScript"],
  },
  {
    board_number: 5,
    title: "TypeScript 고급 패턴 완전 정복",
    content: "실무에서 자주 사용되는 TypeScript 고급 패턴들을 정리해보았습니다.",
    view_count: 0,
    favorite_count: 0,
    comment_count: 0,
    write_datetime: "2024-09-13T09:00:00",
    status: "draft",
    tags: ["TypeScript", "고급패턴"],
  },
]

export default function MyPostsPage() {
  const [posts, setPosts] = useState(mockMyPosts)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge variant="default">발행됨</Badge>
      case "draft":
        return <Badge variant="secondary">임시저장</Badge>
      default:
        return <Badge variant="outline">알 수 없음</Badge>
    }
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || post.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleDeletePost = (postId: number) => {
    if (confirm("정말로 이 글을 삭제하시겠습니까?")) {
      setPosts((prev) => prev.filter((post) => post.board_number !== postId))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">내 게시글</h1>
              <p className="text-muted-foreground">
                총 {posts.length}개의 글 • 발행됨 {posts.filter((p) => p.status === "published").length}개 • 임시저장{" "}
                {posts.filter((p) => p.status === "draft").length}개
              </p>
            </div>
            <Button asChild>
              <Link href="/write">새 글 작성</Link>
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="제목이나 내용으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  {filterStatus === "all" ? "전체" : filterStatus === "published" ? "발행됨" : "임시저장"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>전체</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("published")}>발행됨</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("draft")}>임시저장</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <Card key={post.board_number} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Title and Status */}
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold truncate">
                            {post.status === "published" ? (
                              <Link
                                href={`/posts/${post.board_number}`}
                                className="hover:text-primary transition-colors"
                              >
                                {post.title}
                              </Link>
                            ) : (
                              <span className="text-muted-foreground">{post.title}</span>
                            )}
                          </h3>
                          {getStatusBadge(post.status)}
                        </div>

                        {/* Content Preview */}
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{post.content}</p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Stats and Date */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(post.write_datetime)}
                          </div>
                          {post.status === "published" && (
                            <>
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {post.view_count.toLocaleString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="h-4 w-4" />
                                {post.favorite_count}
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-4 w-4" />
                                {post.comment_count}
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/posts/${post.board_number}/edit`}>
                            <Edit className="h-4 w-4 mr-1" />
                            수정
                          </Link>
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {post.status === "published" && (
                              <DropdownMenuItem asChild>
                                <Link href={`/posts/${post.board_number}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  보기
                                </Link>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem asChild>
                              <Link href={`/posts/${post.board_number}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                수정
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeletePost(post.board_number)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || filterStatus !== "all"
                      ? "검색 조건에 맞는 글이 없습니다."
                      : "아직 작성한 글이 없습니다."}
                  </p>
                  <Button asChild>
                    <Link href="/write">첫 번째 글 작성하기</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Load More */}
          {filteredPosts.length > 0 && (
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                더 많은 글 보기
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
