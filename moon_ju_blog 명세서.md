# MoonJu Blog 기능명세서 v2 (API 포함)

작성일: 2025-09-12 · 버전: 2.0 · 작성자: GPT-5 Thinking

---

## 0) 개요
- **목적**: 블로그 서비스(회원, 게시물, 이미지, 댓글, 좋아요, 검색어 로그)의 기능과 API 규격을 일관되게 정의한다.
- **범위**: 백엔드 REST API v1, 인증/인가(JWT), 데이터 모델(MySQL), 프론트 연동 규약, 비즈니스 규칙.
- **용어**: 게시물=Board, 사용자=User, 댓글=Comment, 좋아요=Favorite, 이미지=Image, 검색어 로그=SearchWord.

---

## 1) 시스템 개요
- **아키텍처**: Next.js(프론트) ⇄ Spring Boot(백엔드) ⇄ MySQL(DB)
- **인증**: JWT Access(Authorization: Bearer), Refresh(쿠키; 선택)
- **응답 포맷**: `application/json; charset=utf-8`
- **버전 경로**: `/api/v1/**`

---

## 2) 데이터 모델(요약)

### 2.1 사용자 `user`
- PK: `email VARCHAR(50)`
- 필수: `password(100)`, `nickname(20)`, `tel_number(20)`, `address(TEXT)`
- 선택: `address_detail(TEXT)`, `profile_image(TEXT)`

### 2.2 게시물 `board`
- PK: `board_number INT AUTO_INCREMENT`
- 필수: `title(255)`, `content(TEXT)`, `writer_email(FK user.email)`
- 기본값: `write_datetime NOW`, `favorite_count=0`, `comment_count=0`, `view_count=0`

### 2.3 댓글 `comment`
- PK: `comment_number INT AUTO_INCREMENT`
- FK: `board_number`→board, `user_email`→user
- 필수: `content`, `write_datetime NOW`

### 2.4 좋아요 `favorite`
- PK 복합: `(board_number, user_email)`

### 2.5 이미지 `image`
- PK: `image_id INT AUTO_INCREMENT`
- FK: `board_number`→board
- 필수: `image VARCHAR(1024)` (URL)

### 2.6 검색어 로그 `search_word`
- PK: `sequence INT AUTO_INCREMENT`
- `search_word VARCHAR(255)`
- `relation_word VARCHAR(255)` (선택)
- `relation BOOLEAN DEFAULT 0` (관련 검색어 여부)

> 외래키는 `ON DELETE CASCADE`(comment, favorite, image)로 게시물 삭제 시 관련 행 자동 제거.

---

## 3) 권한/보안
- 비로그인 가능: 공개 목록/상세 조회, 인기/최신/검색.
- 로그인 필요: 게시물/댓글 작성·수정·삭제, 좋아요, 프로필 수정.
- 인증: `Authorization: Bearer <access_token>`
- 비밀번호 저장: 단방향 해시(BCrypt) 권장.

---

## 4) API 카탈로그(요약)

| 그룹 | 메서드 | 경로 | 설명 |
|---|---|---|---|
| Auth | POST | `/api/v1/auth/register` | 회원가입 |
| Auth | POST | `/api/v1/auth/login` | 로그인(JWT 발급) |
| Auth | POST | `/api/v1/auth/logout` | 로그아웃(Refresh 쿠키 제거; 선택) |
| Users | GET | `/api/v1/users/{email}` | 유저 정보 조회 |
| Users | PATCH | `/api/v1/users/{email}` | 닉네임/프로필/연락처/주소 수정 |
| Users | GET | `/api/v1/users/{email}/boards` | 특정 유저의 게시물 목록 |
| Boards | GET | `/api/v1/boards` | 게시물 목록(검색/정렬/페이징) |
| Boards | GET | `/api/v1/boards/{boardNumber}` | 게시물 상세 + 작성자/이미지 |
| Boards | POST | `/api/v1/boards` | 게시물 작성 |
| Boards | PATCH | `/api/v1/boards/{boardNumber}` | 게시물 수정(제목/내용/이미지) |
| Boards | DELETE | `/api/v1/boards/{boardNumber}` | 게시물 삭제 |
| Boards | POST | `/api/v1/boards/{boardNumber}/views` | 조회수 +1(아이들포인트) |
| Images | GET | `/api/v1/boards/{boardNumber}/images` | 이미지 목록 |
| Images | POST | `/api/v1/boards/{boardNumber}/images` | 이미지 URL 등록(배치) |
| Images | DELETE | `/api/v1/images/{imageId}` | 특정 이미지 삭제 |
| Comments | GET | `/api/v1/boards/{boardNumber}/comments` | 댓글 목록(최신순) |
| Comments | POST | `/api/v1/boards/{boardNumber}/comments` | 댓글 작성(+카운트 반영) |
| Comments | DELETE | `/api/v1/comments/{commentNumber}` | 댓글 삭제(-카운트 반영) |
| Favorites | GET | `/api/v1/boards/{boardNumber}/favorites` | 좋아요한 유저 목록 |
| Favorites | POST | `/api/v1/boards/{boardNumber}/favorite` | 좋아요 추가(+카운트) |
| Favorites | DELETE | `/api/v1/boards/{boardNumber}/favorite` | 좋아요 취소(-카운트) |
| Search | GET | `/api/v1/boards/latest` | 최신 게시물 목록(오프셋/리밋) |
| Search | GET | `/api/v1/boards/trending` | 기간 내 상위 게시물 TOP N |
| Search | GET | `/api/v1/search` | 제목/내용 전체 검색 |
| SearchWord | POST | `/api/v1/search-words` | 검색어 로그 적재 |
| SearchWord | GET | `/api/v1/search-words/popular` | 인기 검색어 TOP N |
| SearchWord | GET | `/api/v1/search-words/{word}/relations` | 관련 검색어 TOP N |
| Files(선택) | POST | `/api/v1/files` | 파일 업로드(Multipart → URL 반환) |

---

## 5) 상세 API 명세

### 5.1 Auth
#### 5.1.1 회원가입
- **POST** `/api/v1/auth/register`
- **요청**
```json
{
  "email": "user@example.com",
  "password": "P@ssw0rd!",
  "nickname": "som",
  "tel_number": "010-0000-0000",
  "address": "경기도 용인시 수지구",
  "address_detail": "상세주소"
}
```
- **검증**: 이메일 형식, 비밀번호(최소8자), 닉네임·전화·주소 필수.
- **처리**: `user` INSERT, 이메일 중복 시 409.
- **응답** `201 Created`
```json
{ "email": "user@example.com" }
```

#### 5.1.2 로그인
- **POST** `/api/v1/auth/login`
- **요청**
```json
{ "email": "user@example.com", "password": "P@ssw0rd!" }
```
- **처리**: 자격 검증 → Access 토큰 발급(JWT). Refresh 쿠키(선택) 발급.
- **응답** `200 OK`
```json
{ "accessToken": "<JWT>" }
```

#### 5.1.3 로그아웃(선택)
- **POST** `/api/v1/auth/logout` → Refresh 쿠키 만료.

---

### 5.2 Users
#### 5.2.1 유저 정보 조회
- **GET** `/api/v1/users/{email}` (공개 프로필)
- **응답**
```json
{
  "email": "user@example.com",
  "nickname": "som",
  "tel_number": "010-0000-0000",
  "address": "경기도 용인시 수지구",
  "address_detail": "상세",
  "profile_image": "https://.../avatar.png"
}
```

#### 5.2.2 유저 정보 수정
- **PATCH** `/api/v1/users/{email}` (본인만)
- **요청(예)**
```json
{ "nickname": "새 닉네임", "profile_image": "https://.../me.png" }
```
- **처리**: 지정 필드만 업데이트.
- **응답** `200 OK`

#### 5.2.3 특정 유저 게시물 목록
- **GET** `/api/v1/users/{email}/boards?page=0&size=10&sort=write_datetime,desc`
- **응답 항목**: `board_number,title,content,write_datetime,favorite_count,comment_count,view_count,writer_nickname,writer_profile_image,image`(대표)

---

### 5.3 Boards
#### 5.3.1 게시물 목록
- **GET** `/api/v1/boards?q=키워드&page=0&size=10&sort=write_datetime,desc`
- **검색 기준**: `title LIKE %q% OR content LIKE %q%`
- **응답(예)**
```json
{
  "content": [
    {
      "board_number": 12,
      "title": "제목",
      "content": "내용 요약 or 첫 200자",
      "writer_email": "user@example.com",
      "writer_nickname": "som",
      "writer_profile_image": "https://...",
      "image": "https://.../cover.png",
      "favorite_count": 3,
      "comment_count": 1,
      "view_count": 10,
      "write_datetime": "2024-08-20T20:32:00"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 123
}
```

#### 5.3.2 게시물 상세
- **GET** `/api/v1/boards/{boardNumber}`
- **응답(예)**
```json
{
  "board_number": 12,
  "title": "제목",
  "content": "<HTML 또는 MD>",
  "write_datetime": "2024-08-20T20:32:00",
  "writer": { "email": "user@example.com", "nickname": "som", "profile_image": "https://..." },
  "images": ["https://.../1.png", "https://.../2.png"],
  "favorite_count": 3,
  "comment_count": 1,
  "view_count": 10
}
```

#### 5.3.3 게시물 작성
- **POST** `/api/v1/boards` (인증 필요)
- **요청**
```json
{ "title": "제목", "content": "내용", "images": ["https://.../1.png"] }
```
- **처리**: `board` INSERT → 이미지가 있으면 `image` 다건 INSERT.
- **응답** `201 Created`
```json
{ "board_number": 123 }
```

#### 5.3.4 게시물 수정
- **PATCH** `/api/v1/boards/{boardNumber}` (작성자만)
- **요청**
```json
{ "title": "수정제목", "content": "update content", "images": ["https://.../A.png", "https://.../B.png"] }
```
- **처리 규칙**: 이미지 전체 교체 시 `image WHERE board_number=?` 삭제 후 재삽입(트랜잭션).
- **응답** `200 OK`

#### 5.3.5 게시물 삭제
- **DELETE** `/api/v1/boards/{boardNumber}` (작성자/관리자)
- **처리**: `board` 삭제 → FK CASCADE로 댓글/좋아요/이미지 자동 삭제.

#### 5.3.6 조회수 증가(옵션)
- **POST** `/api/v1/boards/{boardNumber}/views`
- **처리**: `UPDATE board SET view_count=view_count+1 WHERE board_number=?`

---

### 5.4 Images
#### 5.4.1 이미지 목록
- **GET** `/api/v1/boards/{boardNumber}/images`
- **응답**
```json
[{ "image_id": 1, "image": "https://.../A.png" }]
```

#### 5.4.2 이미지 등록(배치)
- **POST** `/api/v1/boards/{boardNumber}/images`
- **요청**
```json
{ "images": ["https://.../A.png", "https://.../B.png"] }
```
- **응답** `201 Created`

#### 5.4.3 이미지 삭제
- **DELETE** `/api/v1/images/{imageId}` → 단건 삭제

#### 5.4.4 파일 업로드(선택)
- **POST** `/api/v1/files` (Multipart: `file`)
- **응답**
```json
{ "url": "/uploads/uuid_filename.png" }
```

---

### 5.5 Comments
#### 5.5.1 댓글 목록
- **GET** `/api/v1/boards/{boardNumber}/comments`
- **정렬**: `write_datetime DESC`
- **응답(예)**
```json
[
  {
    "comment_number": 9,
    "content": "hi",
    "write_datetime": "2023-08-11T20:12:00",
    "user": { "email": "som030029@gmail.com", "nickname": "som", "profile_image": "https://..." }
  }
]
```

#### 5.5.2 댓글 작성
- **POST** `/api/v1/boards/{boardNumber}/comments`
- **요청**
```json
{ "content": "댓글 내용" }
```
- **처리**: `comment` INSERT → `board.comment_count = comment_count + 1`
- **응답** `201 Created`

#### 5.5.3 댓글 삭제
- **DELETE** `/api/v1/comments/{commentNumber}` (작성자/관리자)
- **처리**: `comment` DELETE → `board.comment_count = comment_count - 1`

---

### 5.6 Favorites
#### 5.6.1 좋아요한 유저 목록
- **GET** `/api/v1/boards/{boardNumber}/favorites`
- **응답(예)**
```json
[
  { "email": "a@a.com", "nickname": "A", "profile_image": "https://..." },
  { "email": "b@b.com", "nickname": "B", "profile_image": "https://..." }
]
```

#### 5.6.2 좋아요 추가
- **POST** `/api/v1/boards/{boardNumber}/favorite`
- **처리**: `favorite(board_number,user_email)` INSERT → `board.favorite_count = favorite_count + 1`

#### 5.6.3 좋아요 취소
- **DELETE** `/api/v1/boards/{boardNumber}/favorite`
- **처리**: `favorite` DELETE → `board.favorite_count = favorite_count - 1`

---

### 5.7 Search & Feeds
#### 5.7.1 최신 게시물
- **GET** `/api/v1/boards/latest?offset=0&limit=10`
- **정렬**: `write_datetime DESC`

#### 5.7.2 트렌딩 TOP N
- **GET** `/api/v1/boards/trending?from=2024-08-19T00:00:00&to=2024-08-29T00:00:00&limit=3`
- **정렬 우선순위**: `favorite_count DESC, comment_count DESC, view_count DESC`

#### 5.7.3 검색(제목/내용)
- **GET** `/api/v1/search?q=검색어&page=0&size=10`
- **처리**: `title LIKE %q% OR content LIKE %q%`

#### 5.7.4 검색어 로그 적재
- **POST** `/api/v1/search-words`
- **요청**
```json
{ "search_word": "검색어", "relation_word": "연관어", "relation": true }
```

#### 5.7.5 인기 검색어 TOP N
- **GET** `/api/v1/search-words/popular?limit=15`
- **집계**: `relation=false` 기준 `search_word` COUNT DESC LIMIT N

#### 5.7.6 관련 검색어 TOP N
- **GET** `/api/v1/search-words/{word}/relations?limit=15`
- **집계**: `WHERE search_word=:word GROUP BY relation_word ORDER BY COUNT DESC`

---

## 6) 비즈니스 규칙
- **카운트 정합성**: 댓글/좋아요 추가·삭제 시 `board.comment_count`/`board.favorite_count` 동기 갱신(트랜잭션).
- **조회수 증가**: 별도 엔드포인트로 안전 증가(과다 증가 방지 위해 IP/세션 쿨다운 선택).
- **이미지 교체**: 전체 교체 시 기존 `image` 삭제 후 일괄 삽입.
- **삭제 전이**: 게시물 삭제 시 댓글/좋아요/이미지는 FK CASCADE로 자동 삭제.

---

## 7) 페이징/정렬 규약
- 요청: `page(0-base)`, `size(기본 10)`, `sort=field,(asc|desc)`
- 응답: `content[], page, size, totalElements`

---

## 8) 오류/상태 코드
- `400 Bad Request` 검증 실패(형식, 누락)
- `401 Unauthorized` 토큰 누락/만료/무효
- `403 Forbidden` 소유자 아님
- `404 Not Found` 리소스 없음
- `409 Conflict` 중복(이메일, 좋아요 중복 등)
- `422 Unprocessable Entity` 비즈니스 규칙 위반(예: 중복 좋아요 방지)
- `500 Internal Server Error` 서버 오류

응답 예시(오류):
```json
{ "code": "EMAIL_DUPLICATED", "message": "이미 사용 중인 이메일입니다." }
```

---

## 9) 보안/운영 체크리스트
- CORS 허용 도메인 지정, `withCredentials` 설정.
- 쿠키(Refresh) `HttpOnly; Secure; SameSite=None` 권장.
- 비밀번호 해시(BCrypt), 과도한 요청 Rate Limit.
- 로그/모니터링: `/actuator/health` (선택), 감사 로그.

---

## 10) 환경 변수(예시)
- `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`, `JWT_ACCESS_TTL`, `JWT_REFRESH_TTL`
- `APP_CORS_ALLOWED_ORIGINS`

---

## 11) 변경 이력
- v2 (2025-09-12): 데이터 모델 기반 전체 API 재정의, 검색어·트렌딩·최신 리스트 추가, 이미지 교체 규칙 명시.

