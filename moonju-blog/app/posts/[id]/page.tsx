"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CommentSection } from "@/components/comment-section"
import { RelatedPosts } from "@/components/related-posts"
import { Heart, MessageCircle, Eye, Calendar, Share2, Bookmark, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock post data
const mockPost = {
  board_number: 1,
  title: "Next.js 14와 함께하는 모던 웹 개발",
  content: `
    <h2>Next.js 14의 새로운 기능들</h2>
    <p>Next.js 14가 출시되면서 웹 개발 생태계에 많은 변화가 있었습니다. 이번 버전에서는 특히 성능 향상과 개발자 경험 개선에 중점을 두었습니다.</p>
    
    <h3>주요 업데이트 사항</h3>
    <ul>
      <li><strong>Turbopack 안정화</strong>: 개발 서버 시작 시간이 최대 53% 단축되었습니다.</li>
      <li><strong>Server Actions 개선</strong>: 더욱 안정적이고 빠른 서버 액션을 제공합니다.</li>
      <li><strong>Partial Prerendering</strong>: 정적 콘텐츠와 동적 콘텐츠를 효율적으로 결합합니다.</li>
    </ul>

    <h3>App Router의 활용</h3>
    <p>App Router는 Next.js 13에서 도입된 새로운 라우팅 시스템으로, React Server Components를 기반으로 합니다. 이를 통해 더 나은 성능과 사용자 경험을 제공할 수 있습니다.</p>

    <pre><code>// app/page.tsx
export default function HomePage() {
  return (
    &lt;div&gt;
      &lt;h1&gt;Welcome to Next.js 14&lt;/h1&gt;
    &lt;/div&gt;
  )
}</code></pre>

    <h3>성능 최적화 팁</h3>
    <p>Next.js 14를 사용할 때 성능을 최적화하는 몇 가지 방법을 소개합니다:</p>
    <ol>
      <li>이미지 최적화를 위해 next/image 컴포넌트를 적극 활용하세요.</li>
      <li>동적 임포트를 사용하여 코드 스플리팅을 구현하세요.</li>
      <li>Server Components와 Client Components를 적절히 분리하세요.</li>
    </ol>

    <p>이러한 기능들을 통해 더욱 효율적이고 성능이 뛰어난 웹 애플리케이션을 개발할 수 있습니다.</p>
  `,
  writer: {
    email: "developer@example.com",
    nickname: "개발자김씨",
    profile_image: "/developer-avatar.png",
  },
  images: ["/nextjs-development.png"],
  favorite_count: 124,
  comment_count: 28,
  view_count: 1560,
  write_datetime: "2024-09-12T10:30:00",
  tags: ["Next.js", "React", "웹개발", "프론트엔드"],
}

export default function PostDetailPage() {
  const params = useParams()
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(mockPost.favorite_count)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: mockPost.title,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("링크가 클립보드에 복사되었습니다!")
    }
  }

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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          {/* Post Header */}
          <header className="mb-8">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {mockPost.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-balance mb-6">{mockPost.title}</h1>

            {/* Author and Meta Info */}
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Link href={`/users/${mockPost.writer.email}`}>
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={mockPost.writer.profile_image || "/placeholder.svg"}
                      alt={mockPost.writer.nickname}
                    />
                    <AvatarFallback>{mockPost.writer.nickname[0]}</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link
                    href={`/users/${mockPost.writer.email}`}
                    className="font-semibold hover:text-primary transition-colors"
                  >
                    {mockPost.writer.nickname}
                  </Link>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(mockPost.write_datetime)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {mockPost.view_count.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant={isLiked ? "default" : "outline"}
                  size="sm"
                  onClick={handleLike}
                  className={isLiked ? "text-red-500 border-red-500" : ""}
                >
                  <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                  {likeCount}
                </Button>

                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {mockPost.comment_count}
                </Button>

                <Button variant="outline" size="sm" onClick={() => setIsBookmarked(!isBookmarked)}>
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                </Button>

                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>신고하기</DropdownMenuItem>
                    <DropdownMenuItem>링크 복사</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Featured Image */}
            {mockPost.images.length > 0 && (
              <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
                <Image
                  src={mockPost.images[0] || "/placeholder.svg"}
                  alt={mockPost.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </header>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none mb-12" dangerouslySetInnerHTML={{ __html: mockPost.content }} />

          {/* Post Footer */}
          <footer className="border-t pt-8 mb-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">이 글이 도움이 되었나요?</span>
                <Button variant={isLiked ? "default" : "outline"} size="sm" onClick={handleLike}>
                  <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                  좋아요 {likeCount}
                </Button>
              </div>

              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                공유하기
              </Button>
            </div>
          </footer>

          {/* Author Bio */}
          <div className="bg-card rounded-lg p-6 mb-12">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={mockPost.writer.profile_image || "/placeholder.svg"} alt={mockPost.writer.nickname} />
                <AvatarFallback>{mockPost.writer.nickname[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{mockPost.writer.nickname}</h3>
                <p className="text-muted-foreground mb-4">
                  프론트엔드 개발자로 10년간 일하며 React, Next.js, TypeScript를 주로 다룹니다. 새로운 기술을 배우고
                  공유하는 것을 좋아합니다.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/users/${mockPost.writer.email}`}>프로필 보기</Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    팔로우
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments */}
          <CommentSection postId={mockPost.board_number} />
        </article>

        {/* Related Posts */}
        <RelatedPosts currentPostId={mockPost.board_number} />
      </main>

      <Footer />
    </div>
  )
}
