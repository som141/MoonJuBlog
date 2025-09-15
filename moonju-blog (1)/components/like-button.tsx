"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { isAuthenticated } from "@/lib/auth"
import api from "@/lib/api"
import { toast } from "sonner"

interface LikeButtonProps {
  postId: number
  initialCount: number
  initialLiked?: boolean
  className?: string
}

export function LikeButton({ postId, initialCount, initialLiked = false, className }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    setAuthenticated(isAuthenticated())
  }, [])

  const handleToggleLike = async () => {
    if (!authenticated) {
      toast.error("로그인이 필요합니다.")
      return
    }

    setLoading(true)
    try {
      await api.post("/favorite", { boardId: postId })

      setLiked(!liked)
      setCount((prev) => (liked ? prev - 1 : prev + 1))

      toast.success(liked ? "좋아요를 취소했습니다." : "좋아요를 눌렀습니다.")
    } catch (error: any) {
      toast.error("좋아요 처리 중 오류가 발생했습니다.")
      console.error("Failed to toggle like:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={liked ? "default" : "outline"}
      size="sm"
      onClick={handleToggleLike}
      disabled={loading}
      className={cn(
        "flex items-center gap-2 transition-all",
        liked && "bg-red-500 hover:bg-red-600 text-white",
        className,
      )}
    >
      <Heart className={cn("h-4 w-4 transition-all", liked && "fill-current")} />
      <span>{count}</span>
    </Button>
  )
}
