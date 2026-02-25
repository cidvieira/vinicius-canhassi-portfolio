import { Card, CardContent, CardFooter, CardHeader } from "@/components/Dashboard/ui/card"

interface ImageCountProps {
  imageCount: number
}

export function SkeletonDetailPage({ imageCount }:ImageCountProps) {
  return (
    <>
        <Card className="w-full">
              <CardHeader>
                  <div className="w-52 h-6 bg-muted animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-end gap-4">
                  <div className="w-full">
                    <div className="w-20 mb-2 h-6 bg-muted animate-pulse rounded"></div>
                    <div className="w-full h-9 bg-muted animate-pulse rounded"></div>
                  </div>
                  <div className="w-full">
                    <div className="w-20 mb-2 h-6 bg-muted animate-pulse rounded"></div>
                    <div className="w-full h-9 bg-muted animate-pulse rounded"></div>
                  </div>
                  <div className="w-44 h-8 bg-muted animate-pulse rounded"></div>
                </div>
              </CardContent>              
          </Card>

          <Card>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between w-full">
                <div className="w-44 h-8 bg-muted animate-pulse rounded"></div>
                <div className="w-56 h-8 bg-muted animate-pulse rounded"></div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-wrap flex-col md:flex-row gap-6 justify-between">                
            {Array.from({ length: imageCount }).map((_, index) => (
              <Card className="w-full md:w-[calc(100%_/_2_-_1.5rem)] aspect-square animate-pulse" key={index}>
                <div className="w-full h-full bg-muted animate-pulse rounded-xl"></div>
              </Card> 
            ))}
          </div>
          
          <Card>
              <CardHeader>
                  <div className="w-28 h-6 bg-muted animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                  <div className="w-full max-w-4xl h-4 bg-muted animate-pulse rounded"></div>
                  <div className="w-56 h-9 mt-2 bg-muted animate-pulse rounded"></div>
              </CardContent>
          </Card>
    </>
  )
}