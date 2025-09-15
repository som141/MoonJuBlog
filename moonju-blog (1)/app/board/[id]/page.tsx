"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageShell } from "@/components/page-shell"
import { PostDetailSkeleton } from "@/components/skeletons"
import { LikeButton } from "@/components/like-button"
import { CommentList } from "@/components/comment-list"
import { CommentForm } from "@/components/comment-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, MessageCircle, Calendar, User } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"
import type { PostDetail } from "@/types"
import { createMockPostDetail } from "@/lib/mock-data"

export default function PostDetailPage() {
  const [post, setPost] = useState<PostDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [commentsLoading, setCommentsLoading] = useState(false)
  const params = useParams()
  const router = useRouter()
  const postId = Number.parseInt(params.id as string)

  useEffect(() => {
    if (postId) {
      fetchPost()
    }
  }, [postId])

  const fetchPost = async () => {
    setLoading(true)
    try {
      const response = await api.get<PostDetail>(`/board/${postId}`)
      setPost(response.data)
    } catch (error: any) {
      console.warn("API not available, using mock data:", error.message)
      try {
        const mockPost = createMockPostDetail(postId)
        setPost(mockPost)

        if (process.env.NODE_ENV === "development") {
          toast.info("개발 모드: 목업 데이터를 사용중입니다.")
        }
      } catch (mockError) {
        toast.error("게시글을 찾을 수 없습니다.")
        router.push("/board")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCommentAdded = () => {
    // Refresh post to get updated comments
    fetchPost()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <PageShell>
        <PostDetailSkeleton />
      </PageShell>
    )
  }

  if (!post) {
    return (
      <PageShell>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">게시글을 찾을 수 없습니다</h1>
          <Button onClick={() => router.push("/board")}>게시판으로 돌아가기</Button>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          뒤로가기
        </Button>

        {/* Post Header */}
        <article className="space-y-6">
          <header className="space-y-4">
            <h1 className="text-3xl font-bold text-balance leading-tight">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span className="font-medium">{post.writer.nickname}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.writeDatetime)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{post.viewCount}회</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{post.commentCount}개</span>
              </div>
            </div>
          </header>

          {/* Post Content */}
          <div className="prose prose-slate max-w-none">
            <div className="text-base leading-relaxed whitespace-pre-wrap break-words">{post.content}</div>
          </div>

          {/* Post Images */}
          {post.images && post.images.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">첨부 이미지</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {post.images.map((image, index) => (
                  <div key={index} className="aspect-video overflow-hidden rounded-lg border">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`게시글 이미지 ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Like Button */}
          <div className="flex items-center justify-between py-6 border-t border-b">
            <LikeButton postId={post.id} initialCount={post.favoriteCount} className="text-base px-6 py-3" />
            <div className="text-sm text-muted-foreground">이 글이 도움이 되었다면 좋아요를 눌러주세요!</div>
          </div>

          {/* Comments Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">댓글 {post.commentCount}개</h2>
            </div>

            <CommentForm postId={post.id} onCommentAdded={handleCommentAdded} />

            <div className="border-t pt-6">
              <CommentList comments={post.comments} loading={commentsLoading} />
            </div>
          </section>
        </article>
      </div>
    </PageShell>
  )
}
