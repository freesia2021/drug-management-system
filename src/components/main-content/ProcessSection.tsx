import React from 'react';
import Link from 'next/link';
import {
  ClipboardDocumentCheckIcon,
  PencilSquareIcon,
  BeakerIcon,
  BookOpenIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const STEPS = [
  { Icon: PencilSquareIcon, title: '연구일지 작성', description: '연구 수행 내용과 사용 장비를 기록하고 승인을 요청합니다.', href: '/research-journal/write' },
  { Icon: ClipboardDocumentCheckIcon, title: '연구승인', description: '제출된 연구일지를 관리자가 검토·승인합니다.', href: '/research-journal' },
  { Icon: BeakerIcon, title: '자료관리', description: '시료와 분석자료를 체계적으로 등록·보관합니다.', href: '/materials' },
  { Icon: BookOpenIcon, title: '연구성과', description: '연구 결과물과 발간자료를 공유합니다.', href: '/publications' },
];

const ProcessSection: React.FC = () => (
  <section className="bg-white py-16 md:py-20" aria-labelledby="process-title">
    <div className="site-container">
      <div className="text-center">
        <p className="section-eyebrow">Process</p>
        <h2 id="process-title" className="section-title mt-2">연구관리 프로세스</h2>
        <p className="mt-3 text-[15px] text-gray-500">연구 시작부터 성과 공유까지, 한 곳에서 이어지는 연구관리 흐름입니다.</p>
      </div>

      <ol className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STEPS.map(({ Icon, title, description, href }, index) => (
          <li key={title}>
            <Link
              href={href}
              className="group relative flex h-full flex-col rounded-xl border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-royal hover:shadow-card-hover"
            >
              <span className="absolute right-6 top-5 text-[40px] font-bold leading-none text-blue-50 group-hover:text-blue-100 transition-colors">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-navy to-royal text-white">
                <Icon className="w-7 h-7" />
              </span>
              <h3 className="mt-6 text-lg font-bold text-ink">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">{description}</p>
              <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-royal">
                바로가기
                <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default ProcessSection;
