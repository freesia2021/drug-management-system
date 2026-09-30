import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * 인증 체크 훅
 * 토큰이 없거나 만료된 경우 로그인 페이지로 리다이렉트
 */
export const useAuthCheck = () => {
  const router = useRouter();

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === 'undefined') return;

    const checkAuth = () => {
      const accessToken = localStorage.getItem('accessToken');
      const tokenExpiry = localStorage.getItem('tokenExpiry');

      // 토큰이 없는 경우
      if (!accessToken) {
        console.log('🔒 토큰이 없습니다. 로그인 페이지로 이동합니다.');
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
  }, [router]);
};

/**
 * 로그인 상태 확인 (리다이렉트 없이)
 */
export const useIsAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;

  const accessToken = localStorage.getItem('accessToken');
  const tokenExpiry = localStorage.getItem('tokenExpiry');

  if (!accessToken) return false;

  if (tokenExpiry) {
    const expiryTime = parseInt(tokenExpiry, 10) * 1000;
    const currentTime = Date.now();
    return currentTime < expiryTime;
  }

  return true;
};

