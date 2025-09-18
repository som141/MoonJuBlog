export function Footer() {
  return (
    <footer className="bg-muted border-t border-border mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-muted-foreground text-sm">© 2025 MoonJuBlog. 모든 권리 보유.</p>
          <div className="mt-4 flex justify-center space-x-6">
            <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              개인정보처리방침
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              이용약관
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              문의하기
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
