import { Card, CardContent } from "@/components/Dashboard/ui/card"

interface ProjectCountProps {
  projectCount: number
}

export function SkeletonCard({ projectCount }:ProjectCountProps) {
  return (
    <div className="flex flex-wrap flex-col md:flex-row gap-6 justify-between">
      {Array.from({ length: projectCount }).map((_, index) => (
        <Card className="w-full md:w-[calc(100%_/_2_-_1.5rem)]" key={index}>
          <CardContent className="p-0">
            <div className="w-full h-48 bg-muted animate-pulse rounded-t-lg"></div>
            <div className="p-4 space-y-2">
              <div className="w-3/4 h-6 bg-muted animate-pulse rounded"></div>
              <div className="w-1/2 h-4 bg-muted animate-pulse rounded"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>   
  )
}