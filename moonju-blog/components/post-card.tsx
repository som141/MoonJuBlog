import Link from "next/link"
import Image from "next/image"
import { Heart, MessageCircle, Eye, Calendar } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface Post {
  board_number: number
  title: string
  content: string
  writer_email: string
  writer_nickname: string
  writer_profile_image: string
  image: string
  favorite_count: number
  comment_count: number
  view_count: number
  write_datetime: string
}

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const truncateContent = (content: string, maxLength = 120) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden rounded-t-lg">
        <Link href={`/posts/${post.board_number}`}>
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            width={400}
            height={200}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      <CardContent className="p-6">
        <Link href={`/posts/${post.board_number}`}>
          <h3 className="text-xl font-semibold text-balance mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="text-muted-foreground text-pretty mb-4 line-clamp-3">{truncateContent(post.content)}</p>

        {/* Author Info */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.writer_profile_image || "/placeholder.svg"} alt={post.writer_nickname} />
            <AvatarFallback>{post.writer_nickname[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">{post.writer_nickname}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDate(post.write_datetime)}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-6 py-4 border-t bg-card/50">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {post.view_count}
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {post.comment_count}
            </div>
          </div>

          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
            <Heart className="h-4 w-4 mr-1" />
            {post.favorite_count}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
