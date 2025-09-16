import { z } from "zod"

export const signInSchema = z.object({
  email: z.string().min(1, "이메일을 입력해주세요").email("올바른 이메일 형식을 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
})

export const signUpSchema = z.object({
  email: z.string().min(1, "이메일을 입력해주세요").email("올바른 이메일 형식을 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요").min(8, "비밀번호는 8자 이상이어야 합니다"),
  nickname: z
    .string()
    .min(1, "닉네임을 입력해주세요")
    .min(2, "닉네임은 2자 이상이어야 합니다")
    .max(20, "닉네임은 20자 이하여야 합니다"),
  telNumber: z.string().min(1, "전화번호를 입력해주세요").min(10, "올바른 전화번호를 입력해주세요"),
  address: z.string().min(1, "주소를 입력해주세요"),
  addressDetail: z.string().min(1, "상세주소를 입력해주세요"),
  profileImage: z.string().url("올바른 URL 형식을 입력해주세요").optional().or(z.literal("")),
})

export const createPostSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  content: z.string().min(1, "내용을 입력해주세요"),
  images: z.array(z.string().url("올바른 URL 형식을 입력해주세요")).optional(),
})

export const createCommentSchema = z.object({
  content: z.string().min(1, "댓글 내용을 입력해주세요"),
})

export type SignInFormData = z.infer<typeof signInSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>
export type CreatePostFormData = z.infer<typeof createPostSchema>
export type CreateCommentFormData = z.infer<typeof createCommentSchema>
