import { Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const popularSearches = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "CSS",
  "Node.js",
  "웹개발",
  "프론트엔드",
  "백엔드",
  "API",
]

export function PopularSearches() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Search className="h-5 w-5 text-secondary" />
          인기 검색어
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {popularSearches.map((search, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="cursor-pointer hover:bg-secondary hover:text-secondary-foreground transition-colors"
            >
              {search}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
