import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Heart, MessageCircle, Eye } from "lucide-react"
import type { PostSummary } from "@/types"

interface PostCardProps {
  post: PostSummary
}

export function PostCard({ post }: PostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Link href={`/board/${post.id}`}>
      <Card className="h-full hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer group">
        {post.thumbnail && (
          <div className="aspect-video overflow-hidden rounded-t-lg">
            <img
              src={post.thumbnail || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}
        <CardHeader className="pb-3">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">{post.preview}</p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{post.writer}</span>
              <span>•</span>
              <span>{formatDate(post.writeDatetime)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span>{post.favoriteCount}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span>{post.commentCount}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{post.viewCount}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
