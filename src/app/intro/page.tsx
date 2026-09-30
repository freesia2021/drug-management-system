'use client';

import React from 'react';
import Image from 'next/image';
import { useAtom } from 'jotai';
import Header from '../../components/header/Header';
import Navigation from '../../components/navigation/Navigation';
import Footer from '../../components/footer/Footer';
import { 
  navItemsAtom, 
  footerLinksAtom, 
  footerButtonsAtom,
  siteConfigAtom 
} from '../../store';

const IntroPage: React.FC = () => {
  // Jotai atoms에서 공용 데이터 가져오기
  const [navItems] = useAtom(navItemsAtom);
  const [footerLinks] = useAtom(footerLinksAtom);
  const [footerButtons] = useAtom(footerButtonsAtom);
  const [siteConfig] = useAtom(siteConfigAtom);

  const handleNavClick = () => {
    // 네비게이션 클릭 핸들러
  };

  // 멤버 이미지 경로 (영문 파일명 사용)
  const memberImages = [
    { name: '임희정', position: '법과학연구센터장', subPosition: '연구관', src: '/images/members/lim-heejeong-director.jpg' },
    { name: '김한별', position: '경감', subPosition: '', src: '/images/members/kim-hanbyeol-inspector.png' },
    { name: '이연희', position: '경장', subPosition: '', src: '/images/members/lee-yeonhee-sergeant.jpg' },
    { name: '정유진', position: '공업주사보', subPosition: '', src: '/images/members/jung-yujin-technician.jpg' },
    { name: '류아름', position: '공업주사보', subPosition: '', src: '/images/members/ryu-areum-technician.jpg' },
    { name: '권도경', position: '연구원', subPosition: '', src: '/images/members/kwon-dogyeong-researcher.jpg' },
    { name: '박시영', position: '인턴연구원', subPosition: '', src: '/images/members/park-siyoung-intern.jpg' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 배경 */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-white opacity-60 -z-10" />
      
      {/* 헤더 */}
      <Header title={siteConfig.title} />
      
      {/* 네비게이션 */}
      <Navigation items={navItems} onItemClick={handleNavClick} />
      
      {/* 메인 콘텐츠 */}
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">센터소개</h2>
            <div className="h-1 w-20 bg-blue-600 mb-8"></div>
          </div>

          {/* 센터 소개 섹션 */}
          <div className="space-y-12">
            {/* 센터 소개 */}
            <section className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-500">
                법과학연구센터 소개
              </h3>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  법과학연구센터는 선진 과학기술을 활용하여 범죄현장 증거를 분석하고, 
                  수사 실무에 적용 가능한 혁신적인 법과학 기술을 개발하는 전문기관입니다.
                </p>
                <p>
                  2022년 11월 경찰청 R&D 사업의 성과로 KOLAS 국제 공인 시험기관 인증을 취득하였으며, 
                  기술개발, 시범운영, 현장검증이 연계된 &quot;One-Stop&quot; 법과학 지원 시스템을 구축하여 
                  차세대 법과학 기술 발전을 선도하고 있습니다.
                </p>
                <p>
                  화재·폭발 분석, 기체수사, 냄새 기반 개체 식별 등 다양한 분야에서 
                  최첨단 법과학 기술을 연구·개발하여 과학수사의 정확성과 효율성을 향상시키고 있습니다.
                </p>
              </div>
            </section>

            {/* 연구분야 */}
            <section className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-500">
                연구분야
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex gap-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-2xl text-white">🔥</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">화재 분석</h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      Fire Investigation
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-2xl text-white">👃</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">기체수사</h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      Scent Evidence Investigation
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-2xl text-white">👆</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">지문 분석</h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      Fingerprint Analysis
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-2xl text-white">🧬</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">유전자 분석</h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      DNA Analysis
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-2xl text-white">🩸</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">혈흔형태 분석</h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      Bloodstain Pattern Analysis
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-2xl text-white">💊</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">마약/독성물질</h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      Illicit Drug/Toxicology
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 주요 연구 사업 */}
            <section className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-500">
                주요 연구 사업
              </h3>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
                  <h4 className="text-xl font-bold text-blue-900 mb-3">
                    과학치안 공공연구성과 실용화 촉진 사업
                  </h4>
                  <p className="text-gray-700 mb-4">
                    과학기술정보통신부-경찰청 공동 사업으로, 과학치안 분야의 공공연구성과를 
                    실용화하여 현장에 적용 가능한 기술로 발전시키는 것을 목표로 합니다.
                  </p>
                  <div className="space-y-3 mt-4">
                    <div className="bg-white rounded p-4">
                      <h5 className="font-semibold text-gray-900 mb-2">
                        과학치안 수요발굴 지원연구 (2023년)
                      </h5>
                      <p className="text-gray-700 text-sm mb-2">
                        테이프 접착면 지문현출 시료개발 기술사업화 사전연구
                      </p>
                      <p className="text-gray-600 text-xs">
                        참여기관: 서울경찰청, 치안정책연구소, 협성대학교
                      </p>
                    </div>
                    <div className="bg-white rounded p-4">
                      <h5 className="font-semibold text-gray-900 mb-2">
                        단기 치안 R&D 기술실용화 (2025-2027년)
                      </h5>
                      <p className="text-gray-700 text-sm mb-2">
                        테이프 접착면 잠재지문 현출용 신규 형광 시약의 현장 실용화 기술 개발
                      </p>
                      <p className="text-gray-600 text-xs">
                        참여기관: (주)루츠램, 협성대학교, 치안정책연구소, 과학기술사업화진흥원
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 연구시설 */}
            <section className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-500">
                연구시설
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-6 border-2 border-blue-200">
                  <h4 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">⚗️</span>
                    질량분석실
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    Mass Spectrometry Lab
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    정밀한 물질 분석을 위한 질량분석 장비를 보유한 전문 실험실입니다.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-6 border-2 border-blue-200">
                  <h4 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">🔬</span>
                    동위원소분석실
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    Isotope Analysis Lab
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    동위원소 비율 분석을 통한 정밀 감정이 가능한 첨단 실험실입니다.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-6 border-2 border-blue-200">
                  <h4 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">🧬</span>
                    유전자분석실
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    DNA Analysis Lab
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    생물안전작업대와 유전자 분석 장비를 갖춘 전문 유전자 분석 시설입니다.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-6 border-2 border-blue-200">
                  <h4 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">🔬</span>
                    세포배양실
                  </h4>
                    <p className="text-gray-700 leading-relaxed">
                    Cell Culture Lab
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    세포 배양 및 생물학적 실험을 위한 무균 환경이 구축된 실험실입니다.
                  </p>
                </div>
              </div>
            </section>

            {/* 주요 연구성과 */}
            <section className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-500">
                주요 연구성과
              </h3>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-l-4 border-blue-600">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">
                    테이프 접착면 잠재지문 현출용 신규 형광 시약 개발
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">신규 시약의 특징</h5>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold">✓</span>
                          <span>우수한 현출 성능: 강한 형광 반응, 특징점 보존</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold">✓</span>
                          <span>손쉬운 적용 편의성: 간단한 침지 및 세척 방법</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold">✓</span>
                          <span>인체건강 안전성: 안전한 용매, 저독성 물질</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold">✓</span>
                          <span>현장 도입 실용성: 장기 보관 안정성, 저비용</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">연구개발 결과</h5>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 font-bold">•</span>
                          <span>10,000% 이상 대조비 달성</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 font-bold">•</span>
                          <span>수초 이내 처리 가능한 고속 처리</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 font-bold">•</span>
                          <span>100% 수용액 기반 친환경 시약</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 font-bold">•</span>
                          <span>6개월 이상 유효성 보장</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-blue-100 rounded">
                    <p className="text-sm text-gray-700">
                      <strong>접착면 지문의 가치:</strong> 접착성으로 인해 맨손 지문이 쉽게 남고, 
                      접착 상태에서 오염과 손상을 방지하며, 신속하고 정확한 개인 식별이 가능합니다. 
                      증거능력 인정이 용이하고 증명력이 높은 핵심적 증거입니다.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 비전 */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">비전</h3>
              <p className="text-xl leading-relaxed mb-4">
                과학수사의 정확성과 효율성을 향상시키는 
                <span className="font-bold"> 대한민국 최고의 법과학 연구기관</span>
              </p>
              <p className="text-lg leading-relaxed opacity-90">
                KOLAS 국제 공인 시험기관으로서 신뢰할 수 있는 법과학 분석 서비스를 제공하고, 
                차세대 법과학 기술 개발을 통해 과학수사 발전에 기여합니다.
              </p>
            </section>

            {/* 주요 연혁 */}
            <section className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-500">
                주요 연혁
              </h3>
              <div className="space-y-4">
                <div className="flex gap-6 items-start border-l-4 border-blue-600 pl-4 py-2">
                  <div className="flex-shrink-0 w-28 text-lg font-bold text-blue-600">
                    2025-2027
                  </div>
                  <div className="flex-1 text-gray-700">
                    단기 치안 R&D 기술실용화 사업 추진 (테이프 접착면 잠재지문 현출용 신규 형광 시약 개발)
                  </div>
                </div>
                <div className="flex gap-6 items-start border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex-shrink-0 w-28 text-lg font-bold text-blue-600">
                    2023
                  </div>
                  <div className="flex-1 text-gray-700">
                    과학치안 수요발굴 지원연구 수행 (테이프 접착면 지문현출 시료개발 기술사업화 사전연구)
                  </div>
                </div>
                <div className="flex gap-6 items-start border-l-4 border-blue-400 pl-4 py-2">
                  <div className="flex-shrink-0 w-28 text-lg font-bold text-blue-600">
                    2022.11
                  </div>
                  <div className="flex-1 text-gray-700">
                    KOLAS 국제 공인 시험기관 인증 취득 (경찰청 R&D 사업 성과)
                  </div>
                </div>
                <div className="flex gap-6 items-start border-l-4 border-blue-300 pl-4 py-2">
                  <div className="flex-shrink-0 w-28 text-lg font-bold text-blue-600">
                    2020.01
                  </div>
                  <div className="flex-1 text-gray-700">
                    독성물질 자료관리 시스템 개소
                  </div>
                </div>
              </div>
            </section>

            {/* 조직 구성 */}
            <section className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-500">
                조직 구성
              </h3>
              <p className="text-lg text-gray-700 mb-8">
                체계적인 조직 구성으로 전문적인 연구 활동을 수행하고 있습니다.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {memberImages.map((member, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-4 border-4 border-blue-200 shadow-lg">
                      <Image
                        src={member.src}
                        alt={`${member.name} ${member.position}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 text-center mb-1">
                      {member.name}
                    </h4>
                    <p className="text-sm text-gray-600 text-center">
                      {member.position}
                    </p>
                    {member.subPosition && (
                      <p className="text-xs text-gray-500 text-center mt-1">
                        {member.subPosition}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      
      {/* 푸터 */}
      <Footer
        title={siteConfig.title}
        links={footerLinks}
        buttons={footerButtons}
        address={siteConfig.address}
        contact={siteConfig.contact}
        copyright={siteConfig.copyright}
      />
    </div>
  );
};

export default IntroPage;

