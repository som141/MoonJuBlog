"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ImagePlus, X, Save, Eye } from "lucide-react"

export default function WritePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [] as string[],
    images: [] as string[],
  })
  const [newTag, setNewTag] = useState("")
  const [isPreview, setIsPreview] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      // Mock image upload - in real app, upload to server
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }))
    }
  }

  const removeImage = (imageToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== imageToRemove),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Mock API call
    setTimeout(() => {
      console.log("Post submitted:", formData)
      setIsLoading(false)
      router.push("/posts/1") // Redirect to the new post
    }, 1000)
  }

  const handleSaveDraft = () => {
    console.log("Draft saved:", formData)
    alert("임시저장되었습니다!")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">새 글 작성</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setIsPreview(!isPreview)}>
                <Eye className="h-4 w-4 mr-2" />
                {isPreview ? "편집" : "미리보기"}
              </Button>
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="h-4 w-4 mr-2" />
                임시저장
              </Button>
            </div>
          </div>

          {!isPreview ? (
            /* Edit Mode */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">제목 *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="글 제목을 입력하세요"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="text-lg"
                  required
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>태그</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="태그를 입력하고 Enter를 누르세요"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag}>
                    추가
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div className="space-y-2">
                <Label>이미지</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="flex flex-col items-center justify-center cursor-pointer">
                    <ImagePlus className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">클릭하여 이미지를 업로드하세요</p>
                  </label>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0"
                          onClick={() => removeImage(image)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">내용 *</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="글 내용을 입력하세요..."
                  value={formData.content}
                  onChange={handleInputChange}
                  className="min-h-[400px] resize-none"
                  required
                />
                <p className="text-sm text-muted-foreground">Markdown 문법을 사용할 수 있습니다.</p>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  취소
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "발행 중..." : "발행하기"}
                </Button>
              </div>
            </form>
          ) : (
            /* Preview Mode */
            <Card>
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="text-3xl">{formData.title || "제목을 입력하세요"}</CardTitle>
              </CardHeader>
              <CardContent>
                {formData.images.length > 0 && (
                  <div className="mb-6">
                    <img
                      src={formData.images[0] || "/placeholder.svg"}
                      alt="Featured"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="prose max-w-none">
                  {formData.content ? (
                    <pre className="whitespace-pre-wrap font-sans">{formData.content}</pre>
                  ) : (
                    <p className="text-muted-foreground">내용을 입력하세요...</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
