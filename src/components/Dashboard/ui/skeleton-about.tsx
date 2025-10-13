import { Card, CardContent, CardHeader } from "@/components/Dashboard/ui/card"

export function SkeletonAbout() {
  return (
    <>
        <Card>
            <CardHeader>                
                <div className="w-40 h-6 bg-muted animate-pulse rounded"></div>
                <div className="w-80 h-4 mt-2 bg-muted animate-pulse rounded-md"></div>
            </CardHeader>
            <CardContent>
                <div className="w-full min-h-[400px] bg-muted animate-pulse rounded"></div>
                <div className="flex items-center justify-between mt-3">
                    <div className="w-28 h-6 bg-muted animate-pulse rounded"></div>
                    <div className="flex flex-col gap-2">
                        <div className="w-44 h-9 mt-2 bg-muted animate-pulse rounded"></div>
                        <div className="w-28 h-3 bg-muted animate-pulse rounded"></div>
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <div className="w-40 h-6 bg-muted animate-pulse rounded"></div>
                <div className="w-80 h-4 mt-2 bg-muted animate-pulse rounded-md"></div>
            </CardHeader>
            <CardContent>
                <div className="w-full h-6 bg-muted animate-pulse rounded"></div>
                <div className="w-full h-6 bg-muted animate-pulse rounded"></div>
                <div className="w-full h-6 bg-muted animate-pulse rounded"></div>
                <div className="w-full h-6 bg-muted animate-pulse rounded"></div>
                <div className="w-full h-6 bg-muted animate-pulse rounded"></div>                
                <div className="w-full h-6 bg-muted animate-pulse rounded"></div>                
            </CardContent>
        </Card>
    </>
  )
}