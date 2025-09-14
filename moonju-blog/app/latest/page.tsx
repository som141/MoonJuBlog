import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PostCard } from "@/components/post-card"
import { Clock, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock latest posts data
const latestPosts = [
  {
    board_number: 10,
    title: "웹 접근성을 고려한 UI/UX 디자인 가이드",
    content:
      "모든 사용자가 웹사이트를 편리하게 이용할 수 있도록 하는 웹 접근성의 중요성과 실제 구현 방법에 대해 알아보겠습니다. WCAG 가이드라인부터 실무 적용 사례까지 상세히 다루어보겠습니다.",
    writer_email: "ux@example.com",
    writer_nickname: "UX디자이너",
    writer_profile_image: "/diverse-user-avatars.png",
    image: "/placeholder.svg?key=ui-ux",
    favorite_count: 12,
    comment_count: 3,
    view_count: 89,
    write_datetime: "2024-09-12T16:45:00",
  },
  {
    board_number: 9,
    title: "CSS Grid와 Flexbox 완벽 마스터하기",
    content:
      "현대 웹 레이아웃의 핵심인 CSS Grid와 Flexbox를 언제, 어떻게 사용해야 하는지 실제 예제와 함께 알아보겠습니다. 반응형 디자인부터 복잡한 레이아웃까지 모든 것을 다룹니다.",
    writer_email: "css@example.com",
    writer_nickname: "CSS마법사",
    writer_profile_image: "/diverse-user-avatars.png",
    image: "/placeholder.svg?key=css-grid",
    favorite_count: 8,
    comment_count: 5,
    view_count: 156,
    write_datetime: "2024-09-12T14:20:00",
  },
  {
    board_number: 8,
    title: "Node.js 성능 최적화 실전 가이드",
    content:
      "Node.js 애플리케이션의 성능을 향상시키는 다양한 기법들을 소개합니다. 메모리 관리, 비동기 처리 최적화, 클러스터링 등 실무에서 바로 적용할 수 있는 방법들을 다룹니다.",
    writer_email: "nodejs@example.com",
    writer_nickname: "백엔드개발자",
    writer_profile_image: "/diverse-user-avatars.png",
    image: "/placeholder.svg?key=nodejs",
    favorite_count: 15,
    comment_count: 7,
    view_count: 234,
    write_datetime: "2024-09-12T11:30:00",
  },
  {
    board_number: 7,
    title: "GraphQL vs REST API: 언제 무엇을 선택할까?",
    content:
      "GraphQL과 REST API의 장단점을 비교하고, 프로젝트 상황에 따라 어떤 것을 선택해야 하는지에 대한 가이드를 제공합니다. 실제 사용 사례와 성능 비교도 포함되어 있습니다.",
    writer_email: "api@example.com",
    writer_nickname: "API설계자",
    writer_profile_image: "/diverse-user-avatars.png",
    image: "/placeholder.svg?key=graphql",
    favorite_count: 22,
    comment_count: 11,
    view_count: 345,
    write_datetime: "2024-09-12T09:15:00",
  },
]

export default function LatestPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="h-8 w-8 text-secondary" />
            <h1 className="text-4xl font-bold text-balance">최신 포스트</h1>
          </div>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            방금 올라온 따끈따끈한 새 글들을 만나보세요. 최신 트렌드와 기술 동향을 놓치지 마세요.
          </p>
        </div>

        {/* Filter and Sort Options */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">총 {latestPosts.length}개의 글</span>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  정렬
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>최신순</DropdownMenuItem>
                <DropdownMenuItem>인기순</DropdownMenuItem>
                <DropdownMenuItem>조회수순</DropdownMenuItem>
                <DropdownMenuItem>댓글순</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Latest Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestPosts.map((post) => (
            <PostCard key={post.board_number} post={post} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            더 많은 최신 글 보기
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 p-8 bg-card rounded-lg border">
          <h3 className="text-lg font-semibold mb-4 text-center">오늘의 활동</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-secondary">12</p>
              <p className="text-sm text-muted-foreground">새 글</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">48</p>
              <p className="text-sm text-muted-foreground">새 댓글</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">156</p>
              <p className="text-sm text-muted-foreground">새 좋아요</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">23</p>
              <p className="text-sm text-muted-foreground">활성 사용자</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
