import { Card } from "@/components/Dashboard/ui/card"

interface ProjectCountProps {
  projectCount: number
}

export function SkeletonListItem({ projectCount }:ProjectCountProps) {
  return (
    <>
      {Array.from({ length: projectCount }).map((_, index) => (
        <Card className="w-full p-4" key={index}>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-muted animate-pulse rounded-md"></div>
            <div className="flex-1 space-y-2">
              <div className="w-1/2 h-5 bg-muted animate-pulse rounded"></div>
              <div className="w-3/4 h-4 bg-muted animate-pulse rounded"></div>
            </div>
            <div className="w-24 h-8 bg-muted animate-pulse rounded-md"></div>
          </div>
        </Card>
      ))}
    </>
  )
}