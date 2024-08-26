"use client"

import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from "@heroicons/react/16/solid"
import { XMarkIcon } from "@heroicons/react/24/outline"
import Image from 'next/image'
import Slider from "react-slick";
import s from "./s.module.css"
import { NextArrow, PrevArrow } from './SliderArrows'

interface SlideItemProps {
  medias: string[];
  isOpen: boolean;
  onClose: () => void;
  category: string;
  title: string;
}

const PortfolioSlider: React.FC<SlideItemProps> = ({ medias, isOpen, onClose, category, title }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: true,
    appendDots: (dots: boolean ) => (
      <ul style={{display: `${category === "Vídeo" ? "none" : "block"}`}}> {dots} </ul>
    ),
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow type="next" />,
    prevArrow: <PrevArrow type="prev" />,
    
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={`fixed top-0 left-0 w-screen h-screen flex flex-col justify-center items-center z-40 transition-all`}>

      <div
        onClick={onClose}
        className={`fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-90 z-40 transition-all`}>        
      </div>

      <div className={`relative max-w-96 sm:max-w-sm md:max-w-2xl mx-4 lg:mx-0 z-50 transition-all`}>

        <Slider {...settings}  ref={sliderRef} className={category === "Vídeo" ? "video" : ""}>
          {medias.map((media, index) => (
            <div key={index}>
              {category === "Vídeo" ? (          
                  <video
                    src={media}
                    controls
                    autoPlay
                  ></video>
                ) : (
              <Image
                src={media}
                alt={`${category} ${title} ${index + 1}`}
                className=""
                width={1000}
                height={800}
              />
            )} 
            </div>
          ))}
        </Slider>
          
        
        <button
          className="absolute -top-10 right-0 md:-right-10"
          onClick={onClose}
        >
          <XMarkIcon className="size-10 text-white opacity-50 hover:text-secondary hover:opacity-100 transition-all" aria-hidden="true" />
        </button>
      </div>
      
    </div>
  );
};
export default PortfolioSlider;