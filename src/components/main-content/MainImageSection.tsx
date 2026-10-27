'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { NewsItem } from '../../types';

interface MainImageSectionProps {
  mainNews: NewsItem;
  sideNews: NewsItem;
  /** 히어로 우측에 배치할 패널 (퀵메뉴 등) */
  aside?: React.ReactNode;
}

const SLIDE_INTERVAL = 6000;

const MainImageSection: React.FC<MainImageSectionProps> = ({ mainNews, aside }) => {
  // 히어로 배경 슬라이드
  const slides = [
    { imageUrl: mainNews.imageUrl, caption: mainNews.title },
    { imageUrl: '/images/carousel/carousel1.jpeg', caption: '법과학연구센터 연구 현장' },
    { imageUrl: '/images/carousel/carousel2.jpeg', caption: '법과학연구센터 연구 현장' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const move = (step: number) => setCurrentIndex((prev) => (prev + step + slides.length) % slides.length);
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section className="relative overflow-hidden bg-navy-deep" aria-label="메인 비주얼">
      {/* 배경 슬라이드 */}
      {slides.map((slide, index) => (
        <div
          key={slide.imageUrl}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1200ms] ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${slide.imageUrl})` }}
          aria-hidden={index !== currentIndex}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b45]/95 via-[#15295f]/85 to-[#1d3994]/40" />

      <div className="site-container relative grid lg:grid-cols-[1fr_400px] gap-10 py-14 md:py-20">
        {/* 메인 카피 */}
        <div className="flex flex-col justify-center text-white">
          <p className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full border border-white/25 bg-white/10 text-xs font-semibold tracking-[0.16em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8fb2ff]" />
            Forensic Toxicology Data System
          </p>
          <h2 className="mt-6 text-[32px] md:text-[44px] font-bold leading-[1.25] tracking-tight">
            법과학 독성물질 연구자료를
            <br />
            <span className="text-[#a9c1ff]">하나의 시스템</span>에서 관리합니다
          </h2>
          <p className="mt-5 max-w-xl text-[16px] md:text-[17px] leading-relaxed text-white/75">
            연구승인부터 연구일지, 시료·자료관리, 연구성과까지
            <br className="hidden md:block" />
            연구 전 과정을 안전하고 체계적으로 지원합니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/research-journal"
              className="inline-flex items-center gap-2 h-12 px-6 rounded bg-royal text-[15px] font-semibold hover:bg-blue-400 transition-colors"
            >
              연구일지 바로가기
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link
              href="/intro"
              className="inline-flex items-center h-12 px-6 rounded border border-white/40 text-[15px] font-semibold hover:bg-white/10 transition-colors"
            >
              센터소개
            </Link>
          </div>

          {/* 슬라이드 컨트롤 */}
          <div className="mt-12 flex items-center gap-4 text-sm">
            <span className="font-semibold tabular-nums">
              {pad(currentIndex + 1)} <span className="text-white/40">/ {pad(slides.length)}</span>
            </span>
            <div className="flex-1 max-w-[160px] h-[2px] bg-white/20">
              <div
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${((currentIndex + 1) / slides.length) * 100}%` }}
              />
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => move(-1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/15" aria-label="이전 슬라이드">
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsPlaying((p) => !p)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/15"
                aria-label={isPlaying ? '슬라이드 정지' : '슬라이드 재생'}
              >
                {isPlaying ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
              </button>
              <button onClick={() => move(1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/15" aria-label="다음 슬라이드">
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
            <span className="hidden md:inline text-white/50 truncate">{slides[currentIndex].caption}</span>
          </div>
        </div>

        {aside && <div className="flex items-center">{aside}</div>}
      </div>
    </section>
  );
};

export default MainImageSection;
