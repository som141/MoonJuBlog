# MoonJuBlog

모던한 한국어 블로그 플랫폼 - React + Next.js + TypeScript + TailwindCSS

## 기능

- 🔐 **사용자 인증**: 회원가입, 로그인, 로그아웃
- 📝 **게시글 관리**: 작성, 조회, 목록, 검색, 정렬
- 💬 **댓글 시스템**: 댓글 작성 및 조회
- ❤️ **좋아요 기능**: 게시글 좋아요/취소
- 👤 **프로필 페이지**: 사용자 정보 및 작성글 관리
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- 🌙 **다크모드**: 라이트/다크 테마 지원

## 기술 스택

- **Frontend**: React 19, Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS, shadcn/ui
- **Forms**: react-hook-form, zod
- **HTTP Client**: axios
- **Icons**: lucide-react

## 설치 및 실행

### 1. 의존성 설치

\`\`\`bash
npm install
# 또는
pnpm install
# 또는
yarn install
\`\`\`

### 2. 환경변수 설정

`.env.example` 파일을 `.env.local`로 복사하고 필요한 값을 설정하세요:

\`\`\`bash
cp .env.example .env.local
\`\`\`

### 3. 개발 서버 실행

\`\`\`bash
npm run dev
# 또는
pnpm dev
# 또는
yarn dev
\`\`\`

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

\`\`\`
src/
├── app/                    # Next.js App Router 페이지
│   ├── (auth)/            # 인증 관련 페이지
│   ├── board/             # 게시판 페이지
│   └── profile/           # 프로필 페이지
├── components/            # React 컴포넌트
│   ├── ui/               # shadcn/ui 컴포넌트
│   └── ...               # 커스텀 컴포넌트
├── lib/                  # 유틸리티 함수
├── types/                # TypeScript 타입 정의
└── hooks/                # 커스텀 훅
\`\`\`

## API 연동

백엔드 API 서버가 필요합니다. 다음 엔드포인트들이 구현되어야 합니다:

- `POST /api/signUp` - 회원가입
- `POST /api/signIn` - 로그인
- `GET /api/board` - 게시글 목록
- `GET /api/board/{id}` - 게시글 상세
- `POST /api/board` - 게시글 작성
- `POST /api/comment` - 댓글 작성
- `POST /api/favorite` - 좋아요 토글

자세한 API 스펙은 `types/index.ts` 파일을 참고하세요.

## 배포

### Vercel 배포

1. GitHub에 코드를 푸시합니다
2. [Vercel](https://vercel.com)에서 프로젝트를 import합니다
3. 환경변수를 설정합니다
4. 배포합니다

### 기타 플랫폼

Next.js는 다양한 플랫폼에 배포할 수 있습니다:
- Netlify
- AWS Amplify
- Railway
- 기타 Node.js 지원 플랫폼

## 개발 가이드

### 컴포넌트 작성

- shadcn/ui 컴포넌트를 기반으로 작성
- TypeScript 타입 안전성 유지
- 반응형 디자인 고려

### 스타일링

- TailwindCSS 유틸리티 클래스 사용
- 시맨틱 디자인 토큰 활용
- 다크모드 지원

### 폼 처리

- react-hook-form + zod 조합 사용
- 클라이언트 사이드 검증 구현
- 에러 처리 및 사용자 피드백

## 라이선스

MIT License
