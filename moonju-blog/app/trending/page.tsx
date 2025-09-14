import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PostCard } from "@/components/post-card"
import { TrendingUp, Calendar, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock trending posts data
const trendingPosts = [
  {
    board_number: 1,
    title: "Next.js 14와 함께하는 모던 웹 개발",
    content:
      "Next.js 14의 새로운 기능들과 App Router를 활용한 효율적인 웹 개발 방법에 대해 알아보겠습니다. Server Components와 Client Components의 차이점부터 시작해서 실제 프로젝트에 적용하는 방법까지 상세히 다루어보겠습니다.",
    writer_email: "developer@example.com",
    writer_nickname: "개발자김씨",
    writer_profile_image: "/developer-avatar.png",
    image: "/nextjs-development.png",
    favorite_count: 124,
    comment_count: 28,
    view_count: 1560,
    write_datetime: "2024-09-12T10:30:00",
  },
  {
    board_number: 2,
    title: "React 상태 관리의 모든 것",
    content:
      "useState부터 Zustand, Redux까지 React 애플리케이션에서 상태를 효과적으로 관리하는 방법들을 비교 분석해보겠습니다. 각각의 장단점과 사용 사례를 실제 코드 예제와 함께 살펴보겠습니다.",
    writer_email: "react@example.com",
    writer_nickname: "리액트마스터",
    writer_profile_image: "/react-developer.png",
    image: "/react-state-management.png",
    favorite_count: 98,
    comment_count: 42,
    view_count: 1203,
    write_datetime: "2024-09-11T15:45:00",
  },
  {
    board_number: 3,
    title: "TypeScript 고급 타입 시스템 활용법",
    content:
      "Generic, Conditional Types, Template Literal Types 등 TypeScript의 고급 기능들을 실무에서 어떻게 활용할 수 있는지 살펴보겠습니다. 복잡한 타입 정의부터 유틸리티 타입 활용까지 다양한 예제로 설명합니다.",
    writer_email: "typescript@example.com",
    writer_nickname: "타입스크립트전문가",
    writer_profile_image: "/typescript-expert.jpg",
    image: "/typescript-advanced-types.jpg",
    favorite_count: 156,
    comment_count: 36,
    view_count: 1890,
    write_datetime: "2024-09-10T09:20:00",
  },
]

const trendingStats = [
  { label: "총 조회수", value: "4,653", icon: Eye },
  { label: "총 좋아요", value: "378", icon: TrendingUp },
  { label: "활성 작성자", value: "24", icon: Calendar },
]

export default function TrendingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="h-8 w-8 text-secondary" />
            <h1 className="text-4xl font-bold text-balance">트렌딩 포스트</h1>
          </div>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            지금 가장 인기 있는 글들을 확인해보세요. 많은 사람들이 읽고 좋아하는 콘텐츠를 놓치지 마세요.
          </p>
        </div>

        {/* Trending Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {trendingStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-secondary/10 mr-4">
                  <stat.icon className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Time Period Filter */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-sm font-medium">기간:</span>
          <div className="flex gap-2">
            <Badge variant="default" className="cursor-pointer">
              오늘
            </Badge>
            <Badge variant="outline" className="cursor-pointer">
              이번 주
            </Badge>
            <Badge variant="outline" className="cursor-pointer">
              이번 달
            </Badge>
            <Badge variant="outline" className="cursor-pointer">
              전체
            </Badge>
          </div>
        </div>

        {/* Trending Posts */}
        <div className="space-y-8">
          {trendingPosts.map((post, index) => (
            <div key={post.board_number} className="relative">
              {/* Ranking Badge */}
              <div className="absolute -left-4 top-4 z-10">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary text-white font-bold text-sm shadow-lg">
                  {index + 1}
                </div>
              </div>

              {/* Post Card with enhanced styling for trending */}
              <div className="ml-8">
                <PostCard post={post} />
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">
            더 많은 트렌딩 포스트 보기
          </button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
