import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PostCard } from "@/components/post-card"
import { TrendingPosts } from "@/components/trending-posts"
import { PopularSearches } from "@/components/popular-searches"
import { Button } from "@/components/ui/button"
import { TrendingUp, Clock, Search } from "lucide-react"

// Mock data - 실제로는 API에서 가져올 데이터
const mockPosts = [
  {
    board_number: 1,
    title: "Next.js 14와 함께하는 모던 웹 개발",
    content:
      "Next.js 14의 새로운 기능들과 App Router를 활용한 효율적인 웹 개발 방법에 대해 알아보겠습니다. Server Components와 Client Components의 차이점부터 시작해서...",
    writer_email: "developer@example.com",
    writer_nickname: "개발자김씨",
    writer_profile_image: "/developer-avatar.png",
    image: "/nextjs-development.png",
    favorite_count: 24,
    comment_count: 8,
    view_count: 156,
    write_datetime: "2024-09-12T10:30:00",
  },
  {
    board_number: 2,
    title: "React 상태 관리의 모든 것",
    content:
      "useState부터 Zustand, Redux까지 React 애플리케이션에서 상태를 효과적으로 관리하는 방법들을 비교 분석해보겠습니다...",
    writer_email: "react@example.com",
    writer_nickname: "리액트마스터",
    writer_profile_image: "/react-developer.png",
    image: "/react-state-management.png",
    favorite_count: 18,
    comment_count: 12,
    view_count: 203,
    write_datetime: "2024-09-11T15:45:00",
  },
  {
    board_number: 3,
    title: "TypeScript 고급 타입 시스템 활용법",
    content:
      "Generic, Conditional Types, Template Literal Types 등 TypeScript의 고급 기능들을 실무에서 어떻게 활용할 수 있는지 살펴보겠습니다...",
    writer_email: "typescript@example.com",
    writer_nickname: "타입스크립트전문가",
    writer_profile_image: "/typescript-expert.jpg",
    image: "/typescript-advanced-types.jpg",
    favorite_count: 31,
    comment_count: 6,
    view_count: 189,
    write_datetime: "2024-09-10T09:20:00",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-12 mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
            당신의{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">이야기</span>를
            <br />
            세상과 나누세요
          </h1>
          <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
            MoonJu Blog에서 생각을 글로 표현하고, 다른 사람들과 소통하며, 새로운 아이디어를 발견해보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              글쓰기 시작하기
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              둘러보기
            </Button>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filter Tabs */}
            <div className="flex items-center gap-4 mb-6 border-b">
              <Button variant="ghost" className="border-b-2 border-primary text-primary rounded-none">
                <TrendingUp className="h-4 w-4 mr-2" />
                트렌딩
              </Button>
              <Button variant="ghost" className="text-muted-foreground rounded-none">
                <Clock className="h-4 w-4 mr-2" />
                최신
              </Button>
              <Button variant="ghost" className="text-muted-foreground rounded-none">
                <Search className="h-4 w-4 mr-2" />
                검색
              </Button>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockPosts.map((post) => (
                <PostCard key={post.board_number} post={post} />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                더 많은 글 보기
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <TrendingPosts />
            <PopularSearches />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
