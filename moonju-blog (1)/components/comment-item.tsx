import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { CommentItem as CommentType } from "@/types"

interface CommentItemProps {
  comment: CommentType
}

export function CommentItem({ comment }: CommentItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "방금 전"
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}일 전`
    } else {
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }
  }

  return (
    <div className="flex items-start space-x-3">
      <Avatar className="w-8 h-8">
        <AvatarFallback className="text-xs">{comment.user.nickname.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-medium text-sm">{comment.user.nickname}</span>
          <span className="text-xs text-muted-foreground">{formatDate(comment.writeDatetime)}</span>
        </div>
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{comment.content}</p>
      </div>
    </div>
  )
}
