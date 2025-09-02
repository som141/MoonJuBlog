# 개요
**아키텍처**: Next.js(App Router, TypeScript) 프론트엔드 + Spring Boot 3.3(자바 17) 백엔드 + MySQL 8
- 인증: **Access 토큰(JWT) + Refresh 토큰(HTTP‑only 쿠키)**
- 배포: Docker 이미지 → (택1) Render/Railway/Fly.io/AWS Lightsail
- 에디터: Toast UI Editor (Markdown), 코드 하이라이트
- 이미지: 1) MVP: 백엔드 로컬 저장 2) 확장: S3 Pre‑signed URL
- SEO: Next.js 메타·OG, `sitemap.xml`, `rss.xml`

```
[Next.js] ──(HTTPS, fetch/axios)──> [Spring Boot API] ──> [MySQL]
         └──(CDN/Static)                                  ↑
                     이미지 업로드 → (로컬 or S3)          |
```

---

# 1) 백엔드(Spring Boot) 구성
## 1-1. Gradle 의존성
```gradle
plugins {
  id 'java'
  id 'org.springframework.boot' version '3.3.2'
  id 'io.spring.dependency-management' version '1.1.5'
}

group = 'blog.moonju'
version = '0.0.2-SNAPSHOT'
java { sourceCompatibility = '17' }

repositories { mavenCentral() }

dependencies {
  implementation 'org.springframework.boot:spring-boot-starter-web'
  implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
  implementation 'org.springframework.boot:spring-boot-starter-validation'
  implementation 'org.springframework.boot:spring-boot-starter-security'
  implementation 'io.jsonwebtoken:jjwt-api:0.11.5'
  runtimeOnly 'io.jsonwebtoken:jjwt-impl:0.11.5'
  runtimeOnly 'io.jsonwebtoken:jjwt-jackson:0.11.5'
  runtimeOnly 'com.mysql:mysql-connector-j'
  compileOnly 'org.projectlombok:lombok'
  annotationProcessor 'org.projectlombok:lombok'
  testImplementation 'org.springframework.boot:spring-boot-starter-test'
  testImplementation 'org.springframework.security:spring-security-test'
}

tasks.test { useJUnitPlatform() }
```

## 1-2. application.yml (프로파일 분리)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/moonju_blog?useSSL=false&serverTimezone=Asia/Seoul&characterEncoding=utf8
    username: root
    password: root
  jpa:
    hibernate:
      ddl-auto: update # prod: validate + Flyway 권장
    properties:
      hibernate.format_sql: true
server:
  port: 8080
  forward-headers-strategy: framework

jwt:
  issuer: moonju.blog
  access-token-validity-seconds: 1800 # 30m
  refresh-token-validity-seconds: 1209600 # 14d
  secret: ${JWT_SECRET:change-me}

app:
  cors:
    allowed-origins: http://localhost:3000,https://your-frontend-domain
    allowed-methods: GET,POST,PUT,DELETE,OPTIONS
    allowed-headers: Authorization,Content-Type
    allow-credentials: true

logging:
  level:
    org.hibernate.SQL: debug
```

## 1-3. 엔티티(자바)
```java
// User.java
@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Table(name="users")
public class User {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;
  @Column(unique=true, nullable=false) private String email;
  @Column(nullable=false) private String password; // BCrypt
  @Column(nullable=false) private String displayName;
  @Enumerated(EnumType.STRING) private Role role; // ADMIN, USER
  public enum Role { ADMIN, USER }
}
```

```java
// Post.java
@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Table(name="posts")
public class Post {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;
  @Column(nullable=false) private String title;
  @Column(unique=true, nullable=false) private String slug;
  @Lob @Column(columnDefinition="LONGTEXT") private String content; // MD 원문
  @Enumerated(EnumType.STRING) private Status status; // DRAFT, PUBLISHED
  private String coverImageUrl; private Long views;
  @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="author_id") private User author;
  private LocalDateTime createdAt; private LocalDateTime updatedAt;
  @PrePersist void pre(){ createdAt=LocalDateTime.now(); updatedAt=createdAt; views=0L; if(status==null)status=Status.DRAFT; }
  @PreUpdate void up(){ updatedAt=LocalDateTime.now(); }
  public enum Status { DRAFT, PUBLISHED }
}
```

## 1-4. DTO & 매퍼(권장)
```java
// dto/AuthDtos.java
public record RegisterReq(@NotBlank String email, @NotBlank String password, @NotBlank String displayName) {}
public record LoginReq(@NotBlank String email, @NotBlank String password) {}
public record TokenRes(String accessToken) {}
```

```java
// dto/PostDtos.java
public record PostCreateReq(@NotBlank String title, String content, String status, String coverImageUrl) {}
public record PostRes(Long id, String title, String slug, String content, String status, String coverImageUrl, String author, LocalDateTime createdAt) {}
```

## 1-5. 레포지토리
```java
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);
}

public interface PostRepository extends JpaRepository<Post, Long> {
  Optional<Post> findBySlugAndStatus(String slug, Post.Status status);
  @Query("SELECT p FROM Post p WHERE (LOWER(p.title) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(p.content) LIKE LOWER(CONCAT('%',:q,'%'))) AND p.status='PUBLISHED'")
  Page<Post> search(@Param("q") String q, Pageable pageable);
}
```

## 1-6. 시큐리티 & JWT
```java
// JwtTokenProvider.java
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {
  @Value("${jwt.secret}") private String secret;
  @Value("${jwt.issuer}") private String issuer;
  @Value("${jwt.access-token-validity-seconds}") private long accessValidity;

  public String createAccessToken(String subject, String role){
    Date now=new Date(); Date exp=new Date(now.getTime()+accessValidity*1000);
    return Jwts.builder()
      .setSubject(subject).claim("role", role).setIssuer(issuer)
      .setIssuedAt(now).setExpiration(exp)
      .signWith(Keys.hmacShaKeyFor(secret.getBytes()), SignatureAlgorithm.HS256)
      .compact();
  }
  public Jws<Claims> parse(String token){
    return Jwts.parserBuilder().setSigningKey(Keys.hmacShaKeyFor(secret.getBytes())).build().parseClaimsJws(token);
  }
}
```

```java
// SecurityConfig.java
@Configuration @EnableWebSecurity @RequiredArgsConstructor
public class SecurityConfig {
  private final TokenAuthFilter tokenAuthFilter;

  @Bean SecurityFilterChain chain(HttpSecurity http) throws Exception {
    http.csrf(csrf->csrf.disable())
      .cors(Customizer.withDefaults())
      .sessionManagement(sess->sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(auth->auth
        .requestMatchers(HttpMethod.GET, "/api/posts/**", "/api/seo/**").permitAll()
        .requestMatchers("/api/auth/**", "/actuator/health").permitAll()
        .requestMatchers("/api/admin/**").hasRole("ADMIN")
        .anyRequest().authenticated())
      .addFilterBefore(tokenAuthFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }

  @Bean CorsConfigurationSource corsConfigurationSource(@Value("${app.cors.allowed-origins}") String origins,
                                                        @Value("${app.cors.allowed-methods}") String methods,
                                                        @Value("${app.cors.allowed-headers}") String headers) {
    CorsConfiguration c = new CorsConfiguration();
    Arrays.stream(origins.split(",")).map(String::trim).forEach(c::addAllowedOriginPattern);
    Arrays.stream(methods.split(",")).map(String::trim).forEach(c::addAllowedMethod);
    Arrays.stream(headers.split(",")).map(String::trim).forEach(c::addAllowedHeader);
    c.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource s=new UrlBasedCorsConfigurationSource();
    s.registerCorsConfiguration("/**", c);
    return s;
  }
}
```

```java
// TokenAuthFilter.java
@Component @RequiredArgsConstructor
public class TokenAuthFilter extends OncePerRequestFilter {
  private final JwtTokenProvider jwt;
  private final UserRepository users;

  @Override protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws IOException, ServletException {
    String bearer = Optional.ofNullable(req.getHeader(HttpHeaders.AUTHORIZATION)).orElse("");
    if (bearer.startsWith("Bearer ")) {
      try {
        String token = bearer.substring(7);
        Claims c = jwt.parse(token).getBody();
        String email = c.getSubject(); String role=(String)c.get("role");
        User u = users.findByEmail(email).orElse(null);
        if (u!=null) {
          List<GrantedAuthority> auth = List.of(new SimpleGrantedAuthority("ROLE_"+role));
          UsernamePasswordAuthenticationToken at = new UsernamePasswordAuthenticationToken(email, null, auth);
          SecurityContextHolder.getContext().setAuthentication(at);
        }
      } catch (JwtException e) { /* ignore -> 익명 처리 */ }
    }
    chain.doFilter(req,res);
  }
}
```

## 1-7. 인증 컨트롤러(로그인/회원가입/리프레시)
```java
@RestController @RequestMapping("/api/auth") @RequiredArgsConstructor
public class AuthController {
  private final UserRepository users; private final PasswordEncoder enc; private final JwtTokenProvider jwt;

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody @Valid RegisterReq req){
    if (users.findByEmail(req.email()).isPresent()) return ResponseEntity.status(HttpStatus.CONFLICT).build();
    User u = User.builder().email(req.email()).password(enc.encode(req.password())).displayName(req.displayName()).role(User.Role.ADMIN).build();
    users.save(u);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/login")
  public ResponseEntity<TokenRes> login(@RequestBody @Valid LoginReq req, HttpServletResponse res){
    User u = users.findByEmail(req.email()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    if (!enc.matches(req.password(), u.getPassword())) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
    String access = jwt.createAccessToken(u.getEmail(), u.getRole().name());
    // Refresh 토큰은 실제로는 서명+DB/Redis 추적 권장. 여기선 단순 쿠키로 예시.
    ResponseCookie refresh = ResponseCookie.from("refresh_token", UUID.randomUUID().toString())
        .httpOnly(true).secure(true).path("/").maxAge(Duration.ofDays(14)).sameSite("None").build();
    res.addHeader(HttpHeaders.SET_COOKIE, refresh.toString());
    return ResponseEntity.ok(new TokenRes(access));
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(HttpServletResponse res){
    ResponseCookie del = ResponseCookie.from("refresh_token", "").httpOnly(true).secure(true).path("/").maxAge(0).sameSite("None").build();
    res.addHeader(HttpHeaders.SET_COOKIE, del.toString());
    return ResponseEntity.ok().build();
  }
}
```

## 1-8. 포스트 API
```java
@RestController @RequestMapping("/api/posts") @RequiredArgsConstructor
public class PostController {
  private final PostRepository posts; private final UserRepository users;

  @GetMapping
  public Page<PostRes> list(@RequestParam(required=false) String q, @PageableDefault(size=10, sort="createdAt", direction=Sort.Direction.DESC) Pageable pageable){
    Page<Post> page = (q==null||q.isBlank()) ? posts.findAll(pageable) : posts.search(q, pageable);
    return page.map(p -> new PostRes(p.getId(), p.getTitle(), p.getSlug(), p.getContent(), p.getStatus().name(), p.getCoverImageUrl(), p.getAuthor().getDisplayName(), p.getCreatedAt()));
  }

  @GetMapping("/{slug}")
  public PostRes detail(@PathVariable String slug){
    Post p = posts.findBySlugAndStatus(slug, Post.Status.PUBLISHED).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    return new PostRes(p.getId(), p.getTitle(), p.getSlug(), p.getContent(), p.getStatus().name(), p.getCoverImageUrl(), p.getAuthor().getDisplayName(), p.getCreatedAt());
  }

  @PostMapping("/admin") @PreAuthorize("hasRole('ADMIN')")
  public PostRes create(@RequestBody @Valid PostCreateReq req, Authentication auth){
    String email = (String) auth.getPrincipal();
    User u = users.findByEmail(email).orElseThrow();
    String slug = req.title().toLowerCase().replaceAll("[^a-z0-9]+","-").replaceAll("(^-|-$)","");
    Post p = posts.save(Post.builder().title(req.title()).slug(slug).content(req.content()).status(Post.Status.valueOf(Optional.ofNullable(req.status()).orElse("DRAFT"))).coverImageUrl(req.coverImageUrl()).author(u).build());
    return new PostRes(p.getId(), p.getTitle(), p.getSlug(), p.getContent(), p.getStatus().name(), p.getCoverImageUrl(), u.getDisplayName(), p.getCreatedAt());
  }
}
```

## 1-9. 파일 업로드(로컬 버전)
```java
@RestController @RequiredArgsConstructor
public class FileController {
  private final Path uploadDir = Paths.get("uploads");

  @PostMapping(value="/api/files", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
  @PreAuthorize("hasRole('ADMIN')")
  public Map<String,String> upload(@RequestPart("file") MultipartFile file) throws IOException {
    Files.createDirectories(uploadDir);
    String stored = UUID.randomUUID()+"_"+Objects.requireNonNull(file.getOriginalFilename());
    Path target = uploadDir.resolve(stored);
    Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
    return Map.of("url", "/uploads/"+stored);
  }
}
```

```yaml
# 정적 리소스 노출
spring:
  web:
    resources:
      static-locations: classpath:/static/, file:uploads/
```

---

# 2) 프론트엔드(Next.js) 구성
## 2-1. 초기화
```bash
npx create-next-app@latest moonju-blog-web --typescript --eslint --src-dir --app --tailwind --use-npm
cd moonju-blog-web
npm i @tanstack/react-query axios @toast-ui/editor @toast-ui/react-editor highlight.js
```

## 2-2. 환경변수
```
# .env.local
NEXT_PUBLIC_API_BASE=http://localhost:8080
```

## 2-3. Axios 인스턴스 & 인터셉터(ts)
```ts
// src/lib/axios.ts
import axios from 'axios';
export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_BASE, withCredentials: true });
api.interceptors.request.use(cfg => {
  const token = typeof window!== 'undefined' ? localStorage.getItem('access_token') : null;
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
```

## 2-4. React Query Provider
```tsx
// src/app/providers.tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
export default function Providers({ children }: { children: ReactNode }){
  const [qc] = useState(()=> new QueryClient());
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}
```

```tsx
// src/app/layout.tsx
import Providers from './providers';
import './globals.css';
export const metadata = { title: 'MoonJu Blog', description: 'Dev blog' };
export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="ko"><body><Providers>{children}</Providers></body></html>
  );
}
```

## 2-5. 글 목록 & 상세 페이지
```ts
// src/services/posts.ts
import { api } from '@/lib/axios';
export type Post = { id:number; title:string; slug:string; content:string; coverImageUrl?:string; author:string; createdAt:string };
export async function fetchPosts(q?:string, page=0){
  const { data } = await api.get(`/api/posts`, { params: { q, page } });
  return data; // Spring Page<PostRes>
}
export async function fetchPost(slug:string){
  const { data } = await api.get(`/api/posts/${slug}`); return data as Post;
}
```

```tsx
// src/app/page.tsx
'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '@/services/posts';
import Link from 'next/link';
export default function Home(){
  const { data } = useQuery({ queryKey:['posts'], queryFn:()=>fetchPosts() });
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Recent Posts</h1>
      <ul className="space-y-3">
        {data?.content?.map((p:any)=> (
          <li key={p.id} className="border p-4 rounded-xl">
            <Link href={`/posts/${p.slug}`} className="text-xl font-semibold">{p.title}</Link>
            <p className="text-sm opacity-70">{new Date(p.createdAt).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

```tsx
// src/app/posts/[slug]/page.tsx
'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchPost } from '@/services/posts';
import { useParams } from 'next/navigation';
import 'highlight.js/styles/default.css';
import hljs from 'highlight.js';
import { useEffect } from 'react';
export default function PostDetail(){
  const { slug } = useParams<{slug:string}>();
  const { data } = useQuery({ queryKey:['post', slug], queryFn:()=>fetchPost(slug) });
  useEffect(()=>{ hljs.highlightAll(); }, [data]);
  return (
    <article className="prose lg:prose-lg max-w-3xl mx-auto p-6">
      <h1>{data?.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: data?.content ?? '' }} />
    </article>
  );
}
```

> 서버에서 Markdown→HTML 렌더 중이라면 `content`는 HTML. 만약 프론트에서 렌더하려면 `marked` 등으로 MD→HTML 처리.

## 2-6. 로그인 & 토큰 저장
```ts
// src/services/auth.ts
import { api } from '@/lib/axios';
export async function login(email:string, password:string){
  const { data } = await api.post('/api/auth/login', { email, password });
  localStorage.setItem('access_token', data.accessToken);
}
```

```tsx
// src/app/login/page.tsx
'use client';
import { useState } from 'react';
import { login } from '@/services/auth';
import { useRouter } from 'next/navigation';
export default function Login(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const router = useRouter();
  return (
    <form className="max-w-md mx-auto p-6 space-y-3" onSubmit={async e=>{e.preventDefault(); await login(email,password); router.push('/admin/editor');}}>
      <h1 className="text-2xl font-bold">Login</h1>
      <input className="input" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="input" placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="btn">Sign in</button>
    </form>
  );
}
```

## 2-7. 관리자 에디터(Toast UI Editor)
```tsx
// src/app/admin/editor/page.tsx
'use client';
import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { api } from '@/lib/axios';
const Editor = dynamic(() => import('@toast-ui/react-editor').then(m=>m.Editor), { ssr:false });
export default function EditorPage(){
  const ref = useRef<any>(null);
  async function submit(){
    const md = ref.current?.getInstance().getMarkdown();
    await api.post('/api/posts/admin', { title: 'New Post', content: md, status: 'PUBLISHED' });
    alert('Saved');
  }
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-3">
      <Editor ref={ref} height="600px" initialEditType="markdown" previewStyle="vertical" />
      <button className="btn" onClick={submit}>Publish</button>
    </div>
  );
}
```

## 2-8. 업로드(프론트)
```ts
export async function uploadImage(file: File){
  const form = new FormData(); form.append('file', file);
  const { data } = await api.post('/api/files', form, { headers: { 'Content-Type': 'multipart/form-data' }});
  return data.url as string;
}
```

---

# 3) Docker & Compose
## 3-1. 백엔드 Dockerfile
```dockerfile
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
```

## 3-2. 프론트 Dockerfile
```dockerfile
# 1) Build stage
FROM node:20 AS build
WORKDIR /web
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2) Run stage
FROM node:20
WORKDIR /web
ENV NODE_ENV=production
COPY --from=build /web .
EXPOSE 3000
CMD ["npm","start"]
```

## 3-3. docker-compose.yml (개발)
```yaml
version: '3.9'
services:
  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: moonju_blog
      TZ: Asia/Seoul
    ports: ["3306:3306"]
    volumes: ["dbdata:/var/lib/mysql"]

  api:
    build: ./moonju-blog-api
    depends_on: [db]
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/moonju_blog?useSSL=false&serverTimezone=Asia/Seoul&characterEncoding=utf8
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: root
      JWT_SECRET: change-me
      APP_CORS_ALLOWED_ORIGINS: http://localhost:3000
    ports: ["8080:8080"]
    volumes: ["./moonju-blog-api/uploads:/app/uploads"]

  web:
    build: ./moonju-blog-web
    depends_on: [api]
    environment:
      NEXT_PUBLIC_API_BASE: http://localhost:8080
    ports: ["3000:3000"]
volumes:
  dbdata:
```

---

# 4) CI/CD (요약 템플릿)
## 4-1. 공통: GitHub Actions로 Docker Build & Push
```yaml
name: build-and-push
on: { push: { branches: [ main ] } }
jobs:
  api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: 'temurin', java-version: '17' }
      - name: Build API
        run: |
          cd moonju-blog-api
          ./gradlew clean build -x test
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with: { username: ${{ secrets.DOCKERHUB_USERNAME }}, password: ${{ secrets.DOCKERHUB_TOKEN }} }
      - uses: docker/build-push-action@v6
        with:
          context: ./moonju-blog-api
          push: true
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/moonju-blog-api:latest

  web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - name: Build Web
        run: |
          cd moonju-blog-web
          npm ci
          npm run build
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with: { username: ${{ secrets.DOCKERHUB_USERNAME }}, password: ${{ secrets.DOCKERHUB_TOKEN }} }
      - uses: docker/build-push-action@v6
        with:
          context: ./moonju-blog-web
          push: true
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/moonju-blog-web:latest
```

## 4-2. 배포 선택지
- **Render/Railway**: 각각 Web Service 2개(api/web) 생성 → 환경변수 등록 → 도메인 연결.
- **Fly.io**: `fly launch` 각각 앱 2개 생성, `fly volumes`(필요시) → `fly secrets set` 환경변수.
- **Lightsail/ECS**: Nginx 리버스 프록시로 `web:3000`, `api:8080` 라우팅, HTTPS는 Let’s Encrypt.

---

# 5) SEO & 피드(Next.js)
```ts
// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_API_BASE ?? '';
  const posts = await fetch(`${base}/api/posts?page=0`).then(r=>r.json());
  return posts.content.map((p:any)=> ({ url: `https://your-frontend-domain/posts/${p.slug}`, lastModified: p.createdAt }));
}
```

```ts
// src/app/rss/route.ts (Edge로 간단 피드)
export async function GET(){
  const base = process.env.NEXT_PUBLIC_API_BASE as string;
  const posts = await fetch(`${base}/api/posts?page=0`).then(r=>r.json());
  const items = posts.content.map((p:any)=>`<item><title>${p.title}</title><link>https://your-domain/posts/${p.slug}</link></item>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>MoonJu Blog</title>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' }});
}
```

---

# 6) 운영 체크리스트
- [ ] CORS 허용 도메인(prod) 정확히 지정, `withCredentials: true`
- [ ] Refresh 토큰: 서버 `HttpOnly; Secure; SameSite=None` 쿠키로 발급(도메인 일치)
- [ ] Access 토큰 만료 시 401 → 프론트에서 재로그인 or `/auth/refresh` 구현
- [ ] 업로드 디렉토리/버킷 권한
- [ ] DB 백업/마이그레이션(Flyway)
- [ ] 로그/헬스: `/actuator/health` 활성화

---

# 7) 7일 액션 플랜(분리형)
- **Day 1**: Next.js 앱 생성, 레이아웃/홈, React Query 세팅
- **Day 2**: Spring Boot API 프로젝트 생성, 엔티티/레포/리스트·상세 API
- **Day 3**: Security + JWT + 로그인/회원가입, CORS, 쿠키 설정
- **Day 4**: 관리자 에디터 + 글 생성/수정, 업로드 연동
- **Day 5**: SEO(sitemap, rss), 하이라이트, 페이징/검색
- **Day 6**: Dockerfile 2종, Compose(dev), 기본 테스트
- **Day 7**: 배포(Render/Fly/Lightsail), 도메인/HTTPS 연결

---

# 8) 다음 확장
- 태그/카테고리, 댓글(스팸 방지), Draft 공유 링크, 시리즈, 관련 글 추천, 프리뷰 이미지 자동 생성(OG 이미지 팩토리), Edge 캐싱(Pages/Fly), 이미지 S3 이전 및 CDN.

