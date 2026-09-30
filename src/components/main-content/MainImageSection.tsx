'use client';

import React, { useState, useEffect } from 'react';
import { NewsItem } from '../../types';

interface MainImageSectionProps {
  mainNews: NewsItem;
  sideNews: NewsItem;
}

const MainImageSection: React.FC<MainImageSectionProps> = ({ mainNews, sideNews }) => {
  // 캐러셀 이미지 목록
  const carouselImages = [
    '/images/carousel/carousel1.jpeg',
    '/images/carousel/carousel2.jpeg',
  ];

  // 현재 표시할 이미지 인덱스
  const [currentIndex, setCurrentIndex] = useState(0);

  // 5초마다 이미지 전환
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 5000); // 5초

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 mb-6 justify-center">
      {/* 메인 이미지 */}
      <div className="relative w-full lg:w-[846px] h-[388px] rounded-lg overflow-hidden">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${mainNews.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="text-white">
              <div className="text-lg font-semibold mb-2">
                {mainNews.date}
              </div>
              <div className="text-3xl lg:text-4xl font-bold leading-tight">
                {mainNews.title}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 사이드 이미지 캐러셀 */}
      <div className="relative w-full lg:w-[424px] h-[388px] rounded-lg overflow-hidden">
        <div className="relative w-full h-full">
          {carouselImages.map((imageUrl, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${imageUrl})` }}
              />
            </div>
          ))}
        </div>
        {/* 인디케이터 */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`이미지 ${index + 1}로 이동`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainImageSection;
