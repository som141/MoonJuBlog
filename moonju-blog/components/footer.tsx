import Link from "next/link"
import { Github, Twitter, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-card/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">MJ</span>
              </div>
              <span className="font-bold text-lg">MoonJu Blog</span>
            </div>
            <p className="text-muted-foreground text-sm">
              생각을 나누고 소통하는 블로그 플랫폼입니다. 당신의 이야기를 세상과 공유해보세요.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">빠른 링크</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  홈
                </Link>
              </li>
              <li>
                <Link href="/trending" className="text-muted-foreground hover:text-primary transition-colors">
                  트렌딩
                </Link>
              </li>
              <li>
                <Link href="/latest" className="text-muted-foreground hover:text-primary transition-colors">
                  최신글
                </Link>
              </li>
              <li>
                <Link href="/write" className="text-muted-foreground hover:text-primary transition-colors">
                  글쓰기
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">고객지원</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-primary transition-colors">
                  도움말
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  문의하기
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  이용약관
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold mb-4">소셜 미디어</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 MoonJu Blog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
