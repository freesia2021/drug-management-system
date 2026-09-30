'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { useLogout } from '../../hooks/queries/auth';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const logoutMutation = useLogout();

  useEffect(() => {
    // 로그인 상태 확인
    const checkAuth = () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const tokenExpiry = localStorage.getItem('tokenExpiry');
      
      // 토큰 만료 확인
      if (tokenExpiry) {
        const expiryTime = parseInt(tokenExpiry, 10) * 1000;
        const currentTime = Date.now();
        
        if (currentTime >= expiryTime) {
          // 토큰 만료됨
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('tokenExpiry');
          setIsLoggedIn(false);
          setUserName('');
          return;
        }
      }
      
      if (accessToken && refreshToken) {
        setIsLoggedIn(true);
        
        // Access Token에서 사용자 이름 추출
        try {
          const decoded = jwtDecode(accessToken) as any;
          setUserName(decoded.username || decoded.nickname || '사용자');
        } catch (error) {
          console.error('토큰 디코딩 실패:', error);
          setUserName('사용자');
        }
      } else {
        setIsLoggedIn(false);
        setUserName('');
      }
    };

    checkAuth();
    // 페이지가 다시 포커스될 때마다 체크
    window.addEventListener('focus', checkAuth);
    return () => window.removeEventListener('focus', checkAuth);
  }, []);

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleLogout = async () => {
    if (!confirm('로그아웃 하시겠습니까?')) {
      return;
    }

    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await logoutMutation.mutateAsync(refreshToken);
      } else {
        // 토큰이 없어도 로컬 스토리지 정리
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiry');
      }
      setIsLoggedIn(false);
      router.push('/login');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // 실패해도 로컬 정보 제거
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiry');
      setIsLoggedIn(false);
      router.push('/login');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-28">
          {/* 빈 공간 (좌측 정렬 유지) */}
          <div className="flex-1"></div>
          
          {/* 제목 (중앙) */}
          <h1 className="text-3xl lg:text-4xl font-bold text-blue-900 text-center flex-1">
            {title}
          </h1>
          
          {/* 로그인 버튼 (우측) */}
          <div className="flex-1 flex justify-end items-center gap-3">
            {isLoggedIn ? (
              <div className="flex flex-col items-end gap-1">
                <span className="text-sm text-gray-700 font-medium">
                  {userName}님 환영합니다.
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs text-gray-500 hover:text-gray-700 hover:underline transition-colors"
                >
                  [로그아웃]
                </button>
              </div>
            ) : (
              <button
                onClick={handleLoginClick}
                className="px-6 py-2 bg-blue-900 text-white text-sm font-medium rounded hover:bg-blue-800 transition-colors"
              >
                로그인
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
