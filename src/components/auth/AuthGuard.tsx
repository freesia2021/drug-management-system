'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
}

// 로그인 없이 접근 가능한 공개 경로
const PUBLIC_PATHS = ['/login', '/register', '/terms'];

/**
 * 전역 인증 가드 컴포넌트
 * 로그인이 필요한 페이지를 보호합니다.
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 공개 경로는 인증 체크 건너뛰기
    if (PUBLIC_PATHS.includes(pathname)) {
      return;
    }

    // 클라이언트 사이드에서만 실행
    if (typeof window === 'undefined') return;

    const checkAuth = () => {
      const accessToken = localStorage.getItem('accessToken');
      const tokenExpiry = localStorage.getItem('tokenExpiry');

      // 토큰이 없는 경우
      if (!accessToken) {
        console.log('🔒 인증이 필요합니다. 로그인 페이지로 이동합니다.');
        router.push('/login');
        return;
      }

      // 토큰 만료 확인
      if (tokenExpiry) {
        const expiryTime = parseInt(tokenExpiry, 10) * 1000;
        const currentTime = Date.now();

        if (currentTime >= expiryTime) {
          console.log('🔒 토큰이 만료되었습니다. 로그인 페이지로 이동합니다.');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('tokenExpiry');
          router.push('/login');
          return;
        }
      }
    };

    checkAuth();
  }, [pathname, router]);

  return <>{children}</>;
};

export default AuthGuard;

