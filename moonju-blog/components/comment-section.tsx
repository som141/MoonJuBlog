"use client"

import { useState } from "react"
import { MessageCircle, Heart, Reply, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Comment {
  comment_number: number
  content: string
  write_datetime: string
  user: {
    email: string
    nickname: string
    profile_image: string
  }
  likes: number
  isLiked: boolean
}

interface CommentSectionProps {
  postId: number
}

// Mock comments data
const mockComments: Comment[] = [
  {
    comment_number: 1,
    content:
      "정말 유익한 글이네요! Next.js 14의 새로운 기능들에 대해 잘 정리해주셔서 감사합니다. 특히 Turbopack 부분이 인상적이었어요.",
    write_datetime: "2024-09-12T11:30:00",
    user: {
      email: "reader1@example.com",
      nickname: "프론트엔드러버",
      profile_image: "/diverse-user-avatars.png",
    },
    likes: 5,
    isLiked: false,
  },
  {
    comment_number: 2,
    content: "App Router 사용하면서 겪었던 어려움들이 많았는데, 이 글을 보니 해결책이 보이네요. 감사합니다!",
    write_datetime: "2024-09-12T12:15:00",
    user: {
      email: "developer2@example.com",
      nickname: "개발초보",
      profile_image: "/diverse-user-avatars.png",
    },
    likes: 3,
    isLiked: true,
  },
  {
    comment_number: 3,
    content:
      "Server Components와 Client Components 구분하는 부분에서 질문이 있습니다. 실제 프로젝트에서는 어떤 기준으로 나누시나요?",
    write_datetime: "2024-09-12T13:45:00",
    user: {
      email: "curious@example.com",
      nickname: "궁금한개발자",
      profile_image: "/diverse-user-avatars.png",
    },
    likes: 2,
    isLiked: false,
  },
]

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyingTo, setReplyingTo] = useState<number | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "방금 전"
    if (diffInHours < 24) return `${diffInHours}시간 전`
    return date.toLocaleDateString("ko-KR")
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)

    // Mock API call
    setTimeout(() => {
      const comment: Comment = {
        comment_number: comments.length + 1,
        content: newComment,
        write_datetime: new Date().toISOString(),
        user: {
          email: "current@user.com",
          nickname: "현재사용자",
          profile_image: "/diverse-user-avatars.png",
        },
        likes: 0,
        isLiked: false,
      }

      setComments((prev) => [comment, ...prev])
      setNewComment("")
      setIsSubmitting(false)
    }, 500)
  }

  const handleLikeComment = (commentId: number) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.comment_number === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            }
          : comment,
      ),
    )
  }

  return (
    <section className="space-y-6">
      {/* Comments Header */}
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-secondary" />
        <h2 className="text-2xl font-semibold">댓글 {comments.length}개</h2>
      </div>

      {/* Comment Form */}
      <div className="space-y-4">
        <Textarea
          placeholder="댓글을 작성해주세요..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="flex justify-end">
          <Button onClick={handleSubmitComment} disabled={!newComment.trim() || isSubmitting}>
            {isSubmitting ? "작성 중..." : "댓글 작성"}
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.comment_number} className="flex gap-4">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={comment.user.profile_image || "/placeholder.svg"} alt={comment.user.nickname} />
              <AvatarFallback>{comment.user.nickname[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              {/* Comment Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{comment.user.nickname}</span>
                  <span className="text-sm text-muted-foreground">{formatDate(comment.write_datetime)}</span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>신고하기</DropdownMenuItem>
                    <DropdownMenuItem>차단하기</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Comment Content */}
              <p className="text-sm leading-relaxed">{comment.content}</p>

              {/* Comment Actions */}
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLikeComment(comment.comment_number)}
                  className={comment.isLiked ? "text-red-500" : ""}
                >
                  <Heart className={`h-4 w-4 mr-1 ${comment.isLiked ? "fill-current" : ""}`} />
                  {comment.likes}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(replyingTo === comment.comment_number ? null : comment.comment_number)}
                >
                  <Reply className="h-4 w-4 mr-1" />
                  답글
                </Button>
              </div>

              {/* Reply Form */}
              {replyingTo === comment.comment_number && (
                <div className="mt-4 space-y-2">
                  <Textarea
                    placeholder={`${comment.user.nickname}님에게 답글을 작성해주세요...`}
                    className="min-h-[80px]"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>
                      취소
                    </Button>
                    <Button size="sm">답글 작성</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Load More Comments */}
      {comments.length > 0 && (
        <div className="text-center">
          <Button variant="outline">더 많은 댓글 보기</Button>
        </div>
      )}
    </section>
  )
}
