"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, Phone, MapPin, Camera, Save, Eye, Heart, MessageCircle } from "lucide-react"

// Mock user data
const mockUser = {
  email: "user@example.com",
  nickname: "블로거김씨",
  tel_number: "010-1234-5678",
  address: "서울특별시 강남구",
  address_detail: "테헤란로 123",
  profile_image: "/diverse-user-avatars.png",
  bio: "프론트엔드 개발자로 일하며 새로운 기술을 배우고 공유하는 것을 좋아합니다. React, Next.js, TypeScript를 주로 다루고 있습니다.",
  joinDate: "2024-01-15",
  stats: {
    posts: 12,
    followers: 156,
    following: 89,
    totalViews: 2340,
    totalLikes: 456,
  },
}

const mockUserPosts = [
  {
    board_number: 1,
    title: "Next.js 14와 함께하는 모던 웹 개발",
    view_count: 156,
    favorite_count: 24,
    comment_count: 8,
    write_datetime: "2024-09-12T10:30:00",
  },
  {
    board_number: 2,
    title: "React 상태 관리의 모든 것",
    view_count: 203,
    favorite_count: 18,
    comment_count: 12,
    write_datetime: "2024-09-11T15:45:00",
  },
]

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nickname: mockUser.nickname,
    tel_number: mockUser.tel_number,
    address: mockUser.address,
    address_detail: mockUser.address_detail,
    bio: mockUser.bio,
    profile_image: mockUser.profile_image,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Mock image upload
      const imageUrl = URL.createObjectURL(file)
      setFormData((prev) => ({
        ...prev,
        profile_image: imageUrl,
      }))
    }
  }

  const handleSave = async () => {
    setIsLoading(true)

    // Mock API call
    setTimeout(() => {
      console.log("Profile updated:", formData)
      setIsLoading(false)
      setIsEditing(false)
      alert("프로필이 업데이트되었습니다!")
    }, 1000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Profile Image */}
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={formData.profile_image || "/placeholder.svg"} alt={formData.nickname} />
                    <AvatarFallback className="text-2xl">{formData.nickname[0]}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="absolute bottom-0 right-0">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="profile-image-upload"
                      />
                      <label
                        htmlFor="profile-image-upload"
                        className="flex items-center justify-center w-10 h-10 bg-secondary text-secondary-foreground rounded-full cursor-pointer hover:bg-secondary/90 transition-colors"
                      >
                        <Camera className="h-4 w-4" />
                      </label>
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold">{formData.nickname}</h1>
                      <p className="text-muted-foreground">{mockUser.email}</p>
                    </div>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            취소
                          </Button>
                          <Button onClick={handleSave} disabled={isLoading}>
                            <Save className="h-4 w-4 mr-2" />
                            {isLoading ? "저장 중..." : "저장"}
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => setIsEditing(true)}>프로필 편집</Button>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-muted-foreground mb-4">{formData.bio}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-secondary">{mockUser.stats.posts}</p>
                      <p className="text-sm text-muted-foreground">게시글</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-secondary">{mockUser.stats.followers}</p>
                      <p className="text-sm text-muted-foreground">팔로워</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-secondary">{mockUser.stats.following}</p>
                      <p className="text-sm text-muted-foreground">팔로잉</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-secondary">{mockUser.stats.totalViews.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">총 조회수</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-secondary">{mockUser.stats.totalLikes}</p>
                      <p className="text-sm text-muted-foreground">총 좋아요</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Tabs */}
          <Tabs defaultValue="posts" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="posts">내 게시글</TabsTrigger>
              <TabsTrigger value="settings">계정 설정</TabsTrigger>
              <TabsTrigger value="activity">활동 내역</TabsTrigger>
            </TabsList>

            {/* Posts Tab */}
            <TabsContent value="posts" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">내 게시글 ({mockUserPosts.length})</h2>
                <Button asChild>
                  <a href="/write">새 글 작성</a>
                </Button>
              </div>

              <div className="space-y-4">
                {mockUserPosts.map((post) => (
                  <Card key={post.board_number} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors">
                            <a href={`/posts/${post.board_number}`}>{post.title}</a>
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {post.view_count}
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              {post.favorite_count}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              {post.comment_count}
                            </div>
                            <span>{formatDate(post.write_datetime)}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={`/posts/${post.board_number}/edit`}>수정</a>
                          </Button>
                          <Button variant="outline" size="sm">
                            삭제
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>개인정보 설정</CardTitle>
                  <CardDescription>프로필 정보를 수정할 수 있습니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Email (Read-only) */}
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input id="email" value={mockUser.email} disabled className="pl-10 bg-muted" />
                    </div>
                  </div>

                  {/* Nickname */}
                  <div className="space-y-2">
                    <Label htmlFor="nickname">닉네임</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="nickname"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="tel_number">전화번호</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="tel_number"
                        name="tel_number"
                        value={formData.tel_number}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address">주소</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="pl-10 min-h-[60px]"
                      />
                    </div>
                  </div>

                  {/* Address Detail */}
                  <div className="space-y-2">
                    <Label htmlFor="address_detail">상세 주소</Label>
                    <Input
                      id="address_detail"
                      name="address_detail"
                      value={formData.address_detail}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">자기소개</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      placeholder="자신을 소개해주세요..."
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="min-h-[100px]"
                    />
                  </div>

                  <Button onClick={handleSave} disabled={isLoading} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "저장 중..." : "변경사항 저장"}
                  </Button>
                </CardContent>
              </Card>

              {/* Password Change */}
              <Card>
                <CardHeader>
                  <CardTitle>비밀번호 변경</CardTitle>
                  <CardDescription>보안을 위해 정기적으로 비밀번호를 변경해주세요.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">현재 비밀번호</Label>
                    <Input id="current-password" type="password" placeholder="현재 비밀번호를 입력하세요" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">새 비밀번호</Label>
                    <Input id="new-password" type="password" placeholder="새 비밀번호를 입력하세요" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">새 비밀번호 확인</Label>
                    <Input id="confirm-password" type="password" placeholder="새 비밀번호를 다시 입력하세요" />
                  </div>
                  <Button className="w-full">비밀번호 변경</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>활동 통계</CardTitle>
                  <CardDescription>가입일: {formatDate(mockUser.joinDate)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-card rounded-lg border">
                      <p className="text-2xl font-bold text-secondary">{mockUser.stats.posts}</p>
                      <p className="text-sm text-muted-foreground">작성한 글</p>
                    </div>
                    <div className="text-center p-4 bg-card rounded-lg border">
                      <p className="text-2xl font-bold text-secondary">{mockUser.stats.totalViews.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">총 조회수</p>
                    </div>
                    <div className="text-center p-4 bg-card rounded-lg border">
                      <p className="text-2xl font-bold text-secondary">{mockUser.stats.totalLikes}</p>
                      <p className="text-sm text-muted-foreground">받은 좋아요</p>
                    </div>
                    <div className="text-center p-4 bg-card rounded-lg border">
                      <p className="text-2xl font-bold text-secondary">89</p>
                      <p className="text-sm text-muted-foreground">작성한 댓글</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>최근 활동</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-card rounded-lg border">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">새 글을 작성했습니다: "Next.js 14와 함께하는 모던 웹 개발"</p>
                        <p className="text-xs text-muted-foreground">2시간 전</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-card rounded-lg border">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">댓글을 작성했습니다</p>
                        <p className="text-xs text-muted-foreground">5시간 전</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-card rounded-lg border">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">글에 좋아요를 받았습니다</p>
                        <p className="text-xs text-muted-foreground">1일 전</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
