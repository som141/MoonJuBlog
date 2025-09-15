import Link from "next/link"
import { TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const trendingPosts = [
  { id: 1, title: "Next.js 14 새로운 기능들", views: 1250 },
  { id: 2, title: "React Server Components 완벽 가이드", views: 980 },
  { id: 3, title: "TypeScript 5.0 업데이트 소식", views: 856 },
  { id: 4, title: "Tailwind CSS 실무 활용법", views: 743 },
  { id: 5, title: "웹 성능 최적화 베스트 프랙티스", views: 692 },
]

export function TrendingPosts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-secondary" />
          트렌딩 포스트
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {trendingPosts.map((post, index) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors group"
          >
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary/10 text-secondary text-sm font-semibold flex items-center justify-center">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">조회수 {post.views.toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
