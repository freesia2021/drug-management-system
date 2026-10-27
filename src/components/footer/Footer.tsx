'use client';

import React from 'react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { FooterLink, FooterButton } from '../../types';
import { BrandEmblem } from '../brand/BrandLogo';

interface FooterProps {
  title: string;
  links: FooterLink[];
  buttons: FooterButton[];
  address: string;
  contact: string;
  copyright: string;
}

const Footer: React.FC<FooterProps> = ({
  title,
  links,
  buttons,
  address,
  contact,
  copyright
}) => {
  return (
    <footer className="mt-auto bg-navy-ink text-white/60">
      {/* 정책 링크 + 바로가기 */}
      <div className="border-b border-white/10">
        <div className="site-container flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-5">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((link, index) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-white ${
                    index === 0 ? 'text-[#8fb2ff] font-semibold' : 'text-white/80'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2">
            {buttons.map((button) => (
              <button
                key={button.label}
                onClick={button.onClick}
                className="flex items-center justify-between gap-6 min-w-[150px] h-10 px-4 rounded border border-white/15 bg-white/5 text-[13px] text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                <span>{button.label}</span>
                {button.arrow ? <ChevronUpIcon className="w-3.5 h-3.5" /> : button.icon && <span aria-hidden="true">{button.icon}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 기관 정보 */}
      <div className="site-container flex flex-col md:flex-row gap-6 md:gap-10 py-9">
        <div className="flex items-center gap-3 shrink-0">
          <BrandEmblem className="w-10 h-10" light />
          <div className="leading-tight">
            <p className="text-[11px] text-white/50">법과학연구센터</p>
            <p className="text-lg font-bold text-white">{title}</p>
          </div>
        </div>
        <address className="not-italic text-[13px] leading-[1.9]">
          <p>{address}</p>
          <p>{contact}</p>
          <p>홈페이지에 게시된 이메일 주소가 자동수집되는 것을 거부하며, 이를 위반 시 처벌될 수 있음을 양지하여 주시기 바랍니다.</p>
          <p className="mt-2 text-white/40">{copyright}</p>
        </address>
      </div>
    </footer>
  );
};

export default Footer;
