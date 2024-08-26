import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from "@heroicons/react/16/solid"
import { FC } from "react"

interface SliderArrows {
    onClick?: () => void
    type: 'next' | 'prev'
}

export const NextArrow: FC<SliderArrows> = (props) => {
    const { onClick, type } = props
    return (
        <div className="next absolute top-0 right-0 flex h-full z-50">
          <button
            onClick={onClick}
            className={`p-2`}
            aria-label="Próximo"
          >
            <ArrowRightCircleIcon className="size-4 md:size-8 text-white opacity-50 hover:text-secondary hover:opacity-100 transition-all" aria-hidden="true" />
          </button>
        </div>
    ) 
}

export const PrevArrow: FC<SliderArrows> = (props) => {
    const { onClick, type } = props
    return (
        <div className="prev absolute top-0 left-0 flex h-full z-50">
          <button
            onClick={onClick}
            className={`p-2`}
            aria-label="Anterior"
          >
            <ArrowLeftCircleIcon className="size-4 md:size-8 text-white opacity-50 hover:text-secondary hover:opacity-100 transition-all" aria-hidden="true" />
          </button>          
        </div>
    ) 
}