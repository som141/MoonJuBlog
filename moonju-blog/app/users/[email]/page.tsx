"use client"

import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Mail, UserPlus, MessageCircle } from "lucide-react"

// Mock user data
const mockUserProfile = {
  email: "developer@example.com",
  nickname: "개발자김씨",
  tel_number: "010-1234-5678",
  address: "서울특별시 강남구",
  address_detail: "테헤란로 123",
  profile_image: "/developer-avatar.png",
  bio: "프론트엔드 개발자로 10년간 일하며 React, Next.js, TypeScript를 주로 다룹니다. 새로운 기술을 배우고 공유하는 것을 좋아합니다.",
  joinDate: "2024-01-15",
  stats: {
    posts: 15,
    followers: 234,
    following: 156,
    totalViews: 4560,
    totalLikes: 789,
  },
  tags: ["React", "Next.js", "TypeScript", "JavaScript", "웹개발"],
}

const mockUserPosts = [
  {
    board_number: 1,
    title: "Next.js 14와 함께하는 모던 웹 개발",
    content: "Next.js 14의 새로운 기능들과 App Router를 활용한 효율적인 웹 개발 방법에 대해 알아보겠습니다.",
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
    board_number: 4,
    title: "웹 성능 최적화 실전 가이드",
    content: "실제 프로젝트에서 적용할 수 있는 웹 성능 최적화 기법들을 소개합니다.",
    writer_email: "developer@example.com",
    writer_nickname: "개발자김씨",
    writer_profile_image: "/developer-avatar.png",
    image: "/placeholder.svg?key=performance",
    favorite_count: 31,
    comment_count: 12,
    view_count: 289,
    write_datetime: "2024-09-09T14:30:00",
  },
]

export default function UserProfilePage() {
  const params = useParams()
  const userEmail = params.email as string

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* User Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-start gap-8">
                {/* Profile Image and Basic Info */}
                <div className="flex flex-col items-center text-center lg:text-left">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage
                      src={mockUserProfile.profile_image || "/placeholder.svg"}
                      alt={mockUserProfile.nickname}
                    />
                    <AvatarFallback className="text-2xl">{mockUserProfile.nickname[0]}</AvatarFallback>
                  </Avatar>

                  <div className="space-y-2">
                    <Button className="w-full">
                      <UserPlus className="h-4 w-4 mr-2" />
                      팔로우
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      메시지
                    </Button>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="flex-1">
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">{mockUserProfile.nickname}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {mockUserProfile.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {mockUserProfile.address}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(mockUserProfile.joinDate)} 가입
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4 leading-relaxed">{mockUserProfile.bio}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {mockUserProfile.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-secondary">{mockUserProfile.stats.posts}</p>
                      <p className="text-sm text-muted-foreground">게시글</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-secondary">{mockUserProfile.stats.followers}</p>
                      <p className="text-sm text-muted-foreground">팔로워</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-secondary">{mockUserProfile.stats.following}</p>
                      <p className="text-sm text-muted-foreground">팔로잉</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-secondary">
                        {mockUserProfile.stats.totalViews.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">총 조회수</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-secondary">{mockUserProfile.stats.totalLikes}</p>
                      <p className="text-sm text-muted-foreground">총 좋아요</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Posts */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                {mockUserProfile.nickname}님의 게시글 ({mockUserPosts.length})
              </h2>
            </div>

            {mockUserPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockUserPosts.map((post) => (
                  <PostCard key={post.board_number} post={post} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground mb-4">아직 작성한 글이 없습니다.</p>
                </CardContent>
              </Card>
            )}

            {/* Load More */}
            {mockUserPosts.length > 0 && (
              <div className="text-center">
                <Button variant="outline" size="lg">
                  더 많은 글 보기
                </Button>
              </div>
            )}
          </div>

          {/* Activity Summary */}
          <Card className="mt-12">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">활동 요약</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-card rounded-lg border">
                  <p className="text-xl font-bold text-secondary">15</p>
                  <p className="text-sm text-muted-foreground">이번 달 작성글</p>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border">
                  <p className="text-xl font-bold text-secondary">89</p>
                  <p className="text-sm text-muted-foreground">이번 달 댓글</p>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border">
                  <p className="text-xl font-bold text-secondary">234</p>
                  <p className="text-sm text-muted-foreground">이번 달 좋아요</p>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border">
                  <p className="text-xl font-bold text-secondary">1.2k</p>
                  <p className="text-sm text-muted-foreground">이번 달 조회수</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
