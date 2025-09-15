export interface SignResponse {
  code: string
  message: string
  token?: string
  expireDate?: number
}

export interface User {
  email: string
  nickname: string
}

export interface PostSummary {
  id: number
  title: string
  preview: string
  writer: string
  writeDatetime: string
  favoriteCount: number
  commentCount: number
  viewCount: number
  thumbnail?: string
}

export interface PostDetail {
  id: number
  title: string
  content: string
  writeDatetime: string
  writer: User
  images?: string[]
  favoriteCount: number
  commentCount: number
  viewCount: number
  comments: CommentItem[]
}

export interface CommentItem {
  id: number
  user: { nickname: string }
  content: string
  writeDatetime: string
}

export interface BoardListResponse {
  content: PostSummary[]
  page: number
  size: number
  total: number
}

export interface SignUpRequest {
  email: string
  password: string
  nickname: string
  telNumber: string
  address: string
  addressDetail: string
  profileImage?: string
}

export interface SignInRequest {
  email: string
  password: string
}

export interface CreatePostRequest {
  title: string
  content: string
  images?: string[]
}

export interface CreateCommentRequest {
  boardId: number
  content: string
}

export interface FavoriteRequest {
  boardId: number
}
