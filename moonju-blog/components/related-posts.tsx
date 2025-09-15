import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, Heart } from "lucide-react"

interface RelatedPostsProps {
  currentPostId: number
}

// Mock related posts data
const relatedPosts = [
  {
    board_number: 2,
    title: "React 상태 관리의 모든 것",
    image: "/react-state-management.png",
    view_count: 203,
    favorite_count: 18,
    write_datetime: "2024-09-11T15:45:00",
  },
  {
    board_number: 3,
    title: "TypeScript 고급 타입 시스템 활용법",
    image: "/typescript-advanced-types.jpg",
    view_count: 189,
    favorite_count: 31,
    write_datetime: "2024-09-10T09:20:00",
  },
  {
    board_number: 4,
    title: "웹 성능 최적화 실전 가이드",
    image: "/placeholder.svg?key=performance",
    view_count: 156,
    favorite_count: 24,
    write_datetime: "2024-09-09T14:30:00",
  },
]

export function RelatedPosts({ currentPostId }: RelatedPostsProps) {
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-semibold mb-8 text-center">관련 글</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Link key={post.board_number} href={`/posts/${post.board_number}`}>
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="relative overflow-hidden rounded-t-lg">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  width={300}
                  height={160}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-balance mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.view_count}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {post.favorite_count}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
