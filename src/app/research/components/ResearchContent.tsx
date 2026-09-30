import React from 'react';
import Image from 'next/image';

const ResearchContent: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-24">
        {/* 왼쪽 이미지 */}
        <div className="flex-shrink-0">
          <div className="relative w-80 h-[550px] lg:w-96 lg:h-[656px] rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/images/research-main.png"
              alt="연구승인 메인 이미지"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* 오른쪽 콘텐츠 */}
        <div className="flex-1 max-w-2xl">
          {/* 제목 섹션 */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative w-5 h-5 flex-shrink-0">
                <Image
                  src="/images/research-icon.png"
                  alt="연구승인 아이콘"
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-blue-900">
                용역연구
              </h2>
            </div>
          </div>

          {/* 설명 섹션 */}
          <div className="space-y-6 mb-20">
            <p className="text-xl lg:text-2xl font-bold text-gray-900 leading-relaxed">
              &ldquo;용역연구는 중장기 치안정책 개발을 위한 연구소 중점사업으로서<br />
              지정과제와 자유과제가 있습니다.&rdquo;
            </p>

            <div className="space-y-4 text-base text-gray-800 leading-8">
              <p>
                지정과제는 경찰청 국ㆍ관 및 지방청으로부터 연구제안서를 취합하여 
                연구자를 공모, 선정하여 수행합니다.
              </p>
              <p>
                자유과제는 응모자가 제안한 치안정책관련 연구주제 중에서 
                선정하여 수행합니다.
              </p>
              
              <div className="pt-4">
                <p>
                  용역연구과제 응모자가 제출한 연구계획서를 치안정책연구소의 
                  &lsquo;정책연구용역 심사위원회&rsquo;에서
                </p>
                <p>
                  심사하여 연구수행자를 선정한 후, 경찰청 정책자문위원회에서 
                  연구과제를 승인하여 결정합니다.
                </p>
              </div>

              <div className="pt-4">
                <p>
                  연구 결과는 &lsquo;치안논총&rsquo;과 개별보고서로 발간하고 있으며,
                </p>
                <p>
                  치안정책연구소 홈페이지에서 다운 받아 보실 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* 버튼 섹션 */}
          <div>
            <button className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-lg lg:text-xl px-8 py-3 lg:px-10 lg:py-4 rounded border border-gray-400 transition-colors duration-200 shadow-md">
              용역연구보고서 보러가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchContent;
