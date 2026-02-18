"use client"

import React, { useEffect, useRef } from 'react';
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from 'next/image';
import Slider from "react-slick";
import { NextArrow, PrevArrow } from './SliderArrows';
import type { ArtProject, VideoProject } from "@/types/portfolio";
import { getEmbedUrl, isDirectVideoFile, isVerticalVideo } from '@/lib/video-utils';

type Project = ArtProject | VideoProject;

interface SlideItemProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const PortfolioSlider: React.FC<SlideItemProps> = ({ project, isOpen, onClose }) => {
  const sliderRef = useRef<Slider>(null);
  const isArt = 'images' in project;
  const medias = isArt ? project.images.map(img => img.url) : [project.videoUrl];
  const category = isArt ? project.subtitle : 'Vídeo';
  const title = project.title;
  
  const settings = {
    dots: true,
    appendDots: (dots: React.ReactNode) => (<ul style={{ display: !isArt ? "none" : "block" }}>{dots}</ul>),
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

  if (!isOpen) return null;

  return (
    <div className={`fixed top-0 left-0 w-screen h-screen flex flex-col justify-center items-center z-40 transition-all`}>
      <div onClick={onClose} className={`fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-90 z-40 transition-all`}></div>
      <div className={`relative z-50 transition-all ${isArt ? 'w-full max-w-96 sm:max-w-sm md:max-w-2xl xl:max-w-[720px] mx-4 lg:mx-0' : 'h-[85vh] max-w-max mx-auto'}`}>
        {isArt ? (
          <Slider {...settings} ref={sliderRef}>
            {medias.map((mediaUrl, index) => (
              <div key={index}>
                <Image src={mediaUrl} alt={`${category} ${title} ${index + 1}`} width={1000} height={800} />
              </div>
            ))}
          </Slider>
        ) : (
          <div key={medias[0]} className="h-[85vh] flex items-center justify-center rounded-lg overflow-hidden">
            {isDirectVideoFile(medias[0]) ? (
              <video 
                src={medias[0]} 
                controls 
                autoPlay 
                muted
                playsInline
                className="h-full w-auto max-w-full rounded-lg shadow-2xl"
                style={{ maxHeight: '85vh' }}
              />
            ) : (
              <iframe
                src={getEmbedUrl(medias[0])}
                title={title}
                className={`h-full w-auto rounded-lg shadow-2xl transition-all ${isVerticalVideo(medias[0]) ? 'aspect-[9/16]' : 'aspect-video'}`}
                style={{ maxHeight: '85vh', maxWidth: '100vw' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                frameBorder="0"
              ></iframe>
            )}
          </div>
        )}
        <button className="absolute -top-10 right-0 md:-right-10" onClick={onClose}>
          <XMarkIcon className="size-10 text-white opacity-50 hover:text-secondary hover:opacity-100 transition-all" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default PortfolioSlider;