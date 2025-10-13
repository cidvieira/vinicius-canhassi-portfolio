import { Card, CardContent, CardHeader } from "@/components/Dashboard/ui/card"

export function SkeletonDashboard() {
  return (
    <>
        <Card>
            <CardHeader>
                <div className="w-48 h-6 bg-muted animate-pulse rounded"></div>
                <div className="w-1/3 h-4 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                        <div className="h-4 w-4 bg-muted animate-pulse rounded-full"></div>
                        <div className="w-80 h-4 bg-muted animate-pulse rounded"></div>
                    </div>
                    <div className="flex items-start space-x-2">
                       <div className="h-4 w-4 bg-muted animate-pulse rounded-full"></div>
                        <div className="w-80 h-4 bg-muted animate-pulse rounded"></div>
                    </div>
                    <div className="flex items-start space-x-2">
                        <div className="h-4 w-4 bg-muted animate-pulse rounded-full"></div>
                        <div className="w-80 h-4 bg-muted animate-pulse rounded"></div>
                    </div>
                </div>
            </CardContent>
        </Card>
        <div className="flex gap-6 flex-col md:flex-row justify-stretch">
            <div className="w-full">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="w-28 h-4 bg-muted animate-pulse rounded"></div>                        
                        <div className="h-4 w-4 bg-muted animate-pulse rounded-full"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-6 w-6 mb-1 bg-muted animate-pulse rounded-full"></div>
                        <div className="w-24 h-2 bg-muted animate-pulse rounded"></div> 
                    </CardContent>
                </Card>
            </div>

            <div className="w-full">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="w-28 h-4 bg-muted animate-pulse rounded"></div>                        
                        <div className="h-4 w-4 bg-muted animate-pulse rounded-full"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-6 w-6 mb-1 bg-muted animate-pulse rounded-full"></div>
                        <div className="w-24 h-2 bg-muted animate-pulse rounded"></div> 
                    </CardContent>
                </Card>
            </div>
            <div className="w-full">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="w-28 h-4 bg-muted animate-pulse rounded"></div>                        
                        <div className="h-4 w-4 bg-muted animate-pulse rounded-full"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-6 w-6 mb-1 bg-muted animate-pulse rounded-full"></div>
                        <div className="w-24 h-2 bg-muted animate-pulse rounded"></div> 
                    </CardContent>
                </Card>
            </div>
        </div>
    </>
  )
}