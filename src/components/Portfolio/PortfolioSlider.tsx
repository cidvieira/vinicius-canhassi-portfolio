"use client"

import React, { useState } from 'react';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from "@heroicons/react/16/solid"
import { XMarkIcon } from "@heroicons/react/24/outline"

interface SlideItemProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  category: string;
  title: string;
}

const PortfolioSlider: React.FC<SlideItemProps> = ({ images, isOpen, onClose, category, title }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex flex-col justify-center items-center z-40 transition-all"
    >
      <div
        onClick={onClose}
        className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-90 z-40 transition-all"
      ></div>

      <div className="relative max-w-2xl mx-4 lg:mx-0 z-50">
        <img
          src={images[currentImageIndex]}
          alt={`${category} ${title} ${currentImageIndex + 1}`}
        />

        <div className="absolute top-0 left-0 flex h-full">
          <button
            onClick={handlePreviousImage}
            disabled={currentImageIndex === 0}
            className={`p-2 ${currentImageIndex === 0 ? 'invisible' : 'visible'}`}
          >
            <ArrowLeftCircleIcon className="size-4 md:size-8 text-white opacity-50 hover:text-secondary hover:opacity-100 transition-all" aria-hidden="true" />
          </button>          
        </div>

        <div className="absolute top-0 right-0 flex h-full">
          <button
            onClick={handleNextImage}
            disabled={currentImageIndex === images.length - 1}
            className={`p-2 ${currentImageIndex === images.length - 1 ? 'invisible' : 'visible'}`}
          >
            <ArrowRightCircleIcon className="size-4 md:size-8 text-white opacity-50 hover:text-secondary hover:opacity-100 transition-all" aria-hidden="true" />
          </button>
        </div>
        
        <button
          className="absolute -top-10 right-0 md:-right-10"
          onClick={onClose}
        >
          <XMarkIcon className="size-10 text-white opacity-50 hover:text-secondary hover:opacity-100 transition-all" aria-hidden="true" />
        </button>
      </div>

      <div className="flex justify-center mt-6 z-50 cursor-pointer">
        {images.map((_, index) => (
          <span
            key={index}
            className={`size-2 md:size-3 rounded-full mx-1 md:mx-2 hover:bg-secondary transition-all 
              ${index === currentImageIndex ? "bg-secondary bg-opacity-100" : "bg-white bg-opacity-50"}`}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};
export default PortfolioSlider;