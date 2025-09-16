import { PostCard } from "./post-card"
import { PostListSkeleton } from "./skeletons"
import type { PostSummary } from "@/types"

interface PostListProps {
  posts: PostSummary[]
  loading?: boolean
}

export function PostList({ posts, loading }: PostListProps) {
  if (loading) {
    return <PostListSkeleton />
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-muted-foreground">
          <p className="text-lg font-medium">게시글이 없습니다</p>
          <p className="text-sm mt-2">첫 번째 게시글을 작성해보세요!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
