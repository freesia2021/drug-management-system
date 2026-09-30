import React from 'react';
import { FooterLink, FooterButton } from '../../types';

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
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-11">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          {/* 왼쪽 영역 */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-blue-900 mb-2">
              {title}
            </h3>
            
            {/* 링크들 */}
            <div className="flex flex-wrap gap-5 mb-2">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-xs font-bold text-gray-900 hover:text-blue-900 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
            
            {/* 주소 및 연락처 */}
            <div className="text-xs text-gray-900 leading-relaxed">
              <div className="mb-1">{address}</div>
              <div className="mb-1">{contact}</div>
              <div className="mb-1">
                홈페이지에 게시된 이메일 주소가 자동수집되는 것을 거부하며, 
                이를 위반 시 처벌될 수 있음을 양지하여 주시기 바랍니다.
              </div>
              <div>{copyright}</div>
            </div>
          </div>

          {/* 오른쪽 영역 - 버튼들 */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-4">
              {buttons.map((button, index) => (
                <button
                  key={index}
                  onClick={button.onClick}
                  className="bg-white border border-gray-200 rounded px-3 py-2 text-xs font-semibold text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  {button.icon && <span>{button.icon}</span>}
                  <span>{button.label}</span>
                  {button.arrow && <span className="text-xs">▼</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
