"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageShell } from "@/components/page-shell"
import { AuthGuard } from "@/components/auth-guard"
import { FormField, FormInput, FormTextarea } from "@/components/form-field"
import { createPostSchema, type CreatePostFormData } from "@/lib/validations"
import { Plus, X } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"

export default function WritePage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    mode: "onChange",
    defaultValues: {
      images: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  })

  const onSubmit = async (data: CreatePostFormData) => {
    setIsLoading(true)
    try {
      const response = await api.post("/boards", {
        title: data.title,
        content: data.content,
        images: data.images?.filter((img) => img.trim() !== "") || [],
      })

      toast.success("게시글이 성공적으로 작성되었습니다!")
      router.push(`/board/${response.data.boardId || ""}`)
    } catch (error: any) {
      const message = error.response?.data?.message || "게시글 작성 중 오류가 발생했습니다."
      setError("root", { message })
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageShell>
      <AuthGuard>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">새 게시글 작성</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FormField label="제목" error={errors.title?.message} required>
                  <FormInput
                    type="text"
                    placeholder="게시글 제목을 입력하세요"
                    error={!!errors.title}
                    {...register("title")}
                  />
                </FormField>

                <FormField label="내용" error={errors.content?.message} required>
                  <FormTextarea
                    placeholder="게시글 내용을 입력하세요"
                    error={!!errors.content}
                    className="min-h-[300px]"
                    {...register("content")}
                  />
                </FormField>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">이미지 URL</label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append("")}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      이미지 추가
                    </Button>
                  </div>

                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <FormInput
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        error={!!errors.images?.[index]}
                        {...register(`images.${index}` as const)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => remove(index)}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {errors.images && <p className="text-sm text-destructive">올바른 URL 형식을 입력해주세요</p>}
                </div>

                {errors.root && (
                  <div className="text-sm text-destructive text-center p-3 bg-destructive/10 rounded-lg">
                    {errors.root.message}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                    취소
                  </Button>
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? "작성 중..." : "게시글 작성"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </AuthGuard>
    </PageShell>
  )
}
