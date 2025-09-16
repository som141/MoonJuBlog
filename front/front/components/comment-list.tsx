import { CommentItem } from "./comment-item"
import type { CommentItem as CommentType } from "@/types"

interface CommentListProps {
  comments: CommentType[]
  loading?: boolean
}

export function CommentList({ comments, loading }: CommentListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">아직 댓글이 없습니다.</p>
        <p className="text-sm text-muted-foreground mt-1">첫 번째 댓글을 작성해보세요!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  )
}
