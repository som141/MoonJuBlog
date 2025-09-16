"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { FormField, FormTextarea } from "@/components/form-field"
import { createCommentSchema, type CreateCommentFormData } from "@/lib/validations"
import { isAuthenticated } from "@/lib/auth"
import api from "@/lib/api"
import { toast } from "sonner"

interface CommentFormProps {
  postId: number
  onCommentAdded: () => void
}

export function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const authenticated = isAuthenticated()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<CreateCommentFormData>({
    resolver: zodResolver(createCommentSchema),
    mode: "onChange",
  })

  const onSubmit = async (data: CreateCommentFormData) => {
    if (!authenticated) {
      toast.error("로그인이 필요합니다.")
      return
    }

    setIsLoading(true)
    try {
      await api.post("/comment", {
        boardId: postId,
        content: data.content,
      })

      toast.success("댓글이 작성되었습니다.")
      reset()
      onCommentAdded()
    } catch (error: any) {
      const message = error.response?.data?.message || "댓글 작성 중 오류가 발생했습니다."
      setError("root", { message })
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!authenticated) {
    return (
      <div className="text-center py-8 bg-muted/50 rounded-lg">
        <p className="text-muted-foreground">
          댓글을 작성하려면{" "}
          <a href="/signin" className="text-primary hover:underline">
            로그인
          </a>
          이 필요합니다.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="댓글 작성" error={errors.content?.message}>
        <FormTextarea
          placeholder="댓글을 입력하세요..."
          error={!!errors.content}
          className="min-h-[100px]"
          {...register("content")}
        />
      </FormField>

      {errors.root && (
        <div className="text-sm text-destructive p-3 bg-destructive/10 rounded-lg">{errors.root.message}</div>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "작성 중..." : "댓글 작성"}
        </Button>
      </div>
    </form>
  )
}
