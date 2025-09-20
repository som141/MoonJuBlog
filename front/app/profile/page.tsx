"use client"

import { useState, useEffect } from "react"
import { PageShell } from "@/components/page-shell"
import { AuthGuard } from "@/components/auth-guard"
import { PostList } from "@/components/post-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BookOpen, Heart, Eye, Edit } from "lucide-react"
import { removeToken } from "@/lib/auth"
import api from "@/lib/api"
import { toast } from "sonner"
import type { PostSummary, BoardListResponse, User as UserType } from "@/types"

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [myPosts, setMyPosts] = useState<PostSummary[]>([])
  const [likedPosts, setLikedPosts] = useState<PostSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [postsLoading, setPostsLoading] = useState(false)

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    setLoading(true)
    try {
      // Note: This endpoint would need to be implemented in the backend
      // For now, we'll use mock data based on the token
      const mockUser: UserType = {
        email: "user@example.com",
        nickname: "사용자",
      }
      setUser(mockUser)

      // Fetch user's posts
      await fetchMyPosts()
    } catch (error: any) {
      toast.error("프로필 정보를 불러오는데 실패했습니다.")
      console.error("Failed to fetch user profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMyPosts = async () => {
    setPostsLoading(true)
    try {
      // Note: This would need backend support to filter by user
      const response = await api.get<BoardListResponse>("/board?page=0&size=10")
      setMyPosts(response.data.content)
    } catch (error: any) {
      console.error("Failed to fetch user posts:", error)
    } finally {
      setPostsLoading(false)
    }
  }

  const handleSignOut = () => {
    removeToken()
    toast.success("로그아웃되었습니다.")
    window.location.href = "/"
  }

  if (loading) {
    return (
      <PageShell>
        <AuthGuard>
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="animate-pulse space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-muted rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-muted rounded w-32"></div>
                  <div className="h-4 bg-muted rounded w-48"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-24 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </AuthGuard>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <AuthGuard>
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="text-2xl">{user?.nickname?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{user?.nickname || "사용자"}</h1>
              <p className="text-muted-foreground mb-4">{user?.email}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  프로필 수정
                </Button>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  로그아웃
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">작성한 글</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{myPosts.length}</div>
                <p className="text-xs text-muted-foreground">총 게시글 수</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">받은 좋아요</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{myPosts.reduce((sum, post) => sum + post.favoriteCount, 0)}</div>
                <p className="text-xs text-muted-foreground">누적 좋아요 수</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">총 조회수</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{myPosts.reduce((sum, post) => sum + post.viewCount, 0)}</div>
                <p className="text-xs text-muted-foreground">누적 조회수</p>
              </CardContent>
            </Card>
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue="posts" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="posts">내가 쓴 글</TabsTrigger>
              <TabsTrigger value="liked">좋아요한 글</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">내가 작성한 게시글</h2>
                <p className="text-sm text-muted-foreground">총 {myPosts.length}개</p>
              </div>
              <PostList posts={myPosts} loading={postsLoading} />
            </TabsContent>

            <TabsContent value="liked" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">좋아요한 게시글</h2>
                <p className="text-sm text-muted-foreground">총 {likedPosts.length}개</p>
              </div>
              <PostList posts={likedPosts} loading={postsLoading} />
              {likedPosts.length === 0 && !postsLoading && (
                <div className="text-center py-16">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">아직 좋아요한 게시글이 없습니다.</p>
                  <p className="text-sm text-muted-foreground mt-1">마음에 드는 글에 좋아요를 눌러보세요!</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </AuthGuard>
    </PageShell>
  )
}
