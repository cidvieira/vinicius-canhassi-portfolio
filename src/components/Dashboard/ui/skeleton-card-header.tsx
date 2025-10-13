interface ButtonVissibleProps {
  addNewBtn: "hidden" | "block"
  backToProjectsBtn: "hidden" | "block"    
}

export function SkeletonCardHeader({ addNewBtn, backToProjectsBtn }:ButtonVissibleProps ) {
  return (
    <>
        <div className={`w-44 h-8 bg-muted animate-pulse rounded-md fixed top-4 right-4 sm:right-6 lg:right-12 z-50 ${backToProjectsBtn}`}></div>
        <div className="flex flex-col gap-2 sm:flex-row items-start sm:items-center justify-between">
          <div>
              <div className="w-96 h-9 bg-muted animate-pulse rounded-md"></div>
              <div className="w-80 h-6 mt-2 bg-muted animate-pulse rounded-md"></div>
          </div>
          <div className={`w-56 h-9 bg-muted animate-pulse rounded-md ${addNewBtn}`}></div>
      </div>
    </>
  )
}