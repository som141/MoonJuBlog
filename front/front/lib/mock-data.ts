import type { PostSummary, PostDetail, CommentItem } from "@/types"

export const mockPosts: PostSummary[] = [
  {
    id: 1,
    title: "Next.js 14와 App Router로 블로그 만들기",
    preview:
      "Next.js 14의 새로운 App Router를 사용해서 모던한 블로그를 만드는 방법을 알아보겠습니다. TypeScript와 TailwindCSS를 함께 사용하여...",
    writer: "개발자김씨",
    writeDatetime: "2025-01-15T10:30:00",
    favoriteCount: 24,
    commentCount: 8,
    viewCount: 156,
    thumbnail: "/nextjs-blog-development.jpg",
  },
  {
    id: 2,
    title: "React 19의 새로운 기능들",
    preview:
      "React 19에서 새롭게 추가된 기능들을 살펴보고, 실제 프로젝트에서 어떻게 활용할 수 있는지 알아보겠습니다. Server Components와...",
    writer: "리액트마스터",
    writeDatetime: "2025-01-14T15:45:00",
    favoriteCount: 18,
    commentCount: 12,
    viewCount: 203,
    thumbnail: "/react-19-features.jpg",
  },
  {
    id: 3,
    title: "TailwindCSS로 반응형 디자인 마스터하기",
    preview:
      "TailwindCSS의 유틸리티 클래스를 활용해서 아름답고 반응형인 웹사이트를 만드는 방법을 단계별로 설명합니다...",
    writer: "디자인구루",
    writeDatetime: "2025-01-13T09:20:00",
    favoriteCount: 31,
    commentCount: 6,
    viewCount: 289,
    thumbnail: "/tailwindcss-responsive-design.jpg",
  },
  {
    id: 4,
    title: "TypeScript 5.0 완벽 가이드",
    preview:
      "TypeScript 5.0의 새로운 기능들과 개선사항들을 자세히 살펴보고, 실무에서 바로 적용할 수 있는 팁들을 공유합니다...",
    writer: "타입스크립트전문가",
    writeDatetime: "2025-01-12T14:10:00",
    favoriteCount: 42,
    commentCount: 15,
    viewCount: 378,
    thumbnail: "/typescript-5-0-guide.jpg",
  },
  {
    id: 5,
    title: "웹 성능 최적화 실전 가이드",
    preview:
      "웹사이트의 로딩 속도를 개선하고 사용자 경험을 향상시키는 다양한 최적화 기법들을 실제 사례와 함께 소개합니다...",
    writer: "성능최적화전문가",
    writeDatetime: "2025-01-11T11:30:00",
    favoriteCount: 27,
    commentCount: 9,
    viewCount: 234,
    thumbnail: "/web-performance-optimization.png",
  },
  {
    id: 6,
    title: "모던 CSS 레이아웃 기법",
    preview:
      "CSS Grid와 Flexbox를 활용한 모던한 레이아웃 기법들을 배우고, 실제 프로젝트에 적용하는 방법을 알아보겠습니다...",
    writer: "CSS마스터",
    writeDatetime: "2025-01-10T16:45:00",
    favoriteCount: 19,
    commentCount: 7,
    viewCount: 167,
    thumbnail: "/modern-css-layout.jpg",
  },
]

export const mockComments: CommentItem[] = [
  {
    id: 1,
    user: { nickname: "댓글러" },
    content: "정말 유용한 정보네요! 감사합니다.",
    writeDatetime: "2025-01-15T11:00:00",
  },
  {
    id: 2,
    user: { nickname: "개발초보" },
    content: "초보자도 이해하기 쉽게 설명해주셔서 감사합니다. 따라해보겠습니다!",
    writeDatetime: "2025-01-15T11:30:00",
  },
  {
    id: 3,
    user: { nickname: "프론트엔드개발자" },
    content: "실무에서 바로 적용할 수 있는 내용이네요. 북마크 해둡니다.",
    writeDatetime: "2025-01-15T12:15:00",
  },
]

export const createMockPostDetail = (id: number): PostDetail => {
  const post = mockPosts.find((p) => p.id === id)
  if (!post) {
    throw new Error("Post not found")
  }

  return {
    ...post,
    content: `# ${post.title}

안녕하세요! 오늘은 ${post.title}에 대해 자세히 알아보겠습니다.

## 소개

${post.preview}

## 주요 내용

이 글에서는 다음과 같은 내용들을 다룰 예정입니다:

1. **기본 개념 이해하기**
   - 핵심 개념들을 쉽게 설명
   - 실제 사례를 통한 이해

2. **실습 예제**
   - 단계별 구현 과정
   - 코드 예제와 설명

3. **실무 적용 팁**
   - 프로젝트에서 활용하는 방법
   - 주의사항과 베스트 프랙티스

## 결론

이번 글을 통해 ${post.title}에 대한 이해를 높이셨기를 바랍니다. 
궁금한 점이 있으시면 언제든 댓글로 남겨주세요!

감사합니다. 😊`,
    writer: {
      email: "writer@example.com",
      nickname: post.writer,
    },
    images: post.thumbnail ? [post.thumbnail] : [],
    comments: mockComments,
  }
}
