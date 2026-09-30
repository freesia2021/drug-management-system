import { QueryClient } from '@tanstack/react-query';

// React Query 클라이언트 설정
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5분 동안 데이터를 fresh로 간주
      staleTime: 1000 * 60 * 5,
      // 5분 동안 캐시 유지
      gcTime: 1000 * 60 * 5,
      // 에러 발생 시 재시도 횟수
      retry: (failureCount, error: any) => {
        // 401, 403, 404 에러는 재시도하지 않음
        if (error?.response?.status === 401 || 
            error?.response?.status === 403 || 
            error?.response?.status === 404) {
          return false;
        }
        // 최대 3번까지 재시도
        return failureCount < 3;
      },
      // 재시도 지연 시간 (exponential backoff)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // 윈도우 포커스 시 자동 refetch 비활성화
      refetchOnWindowFocus: false,
    },
    mutations: {
      // 에러 발생 시 재시도 횟수
      retry: 1,
      // 재시도 지연 시간
      retryDelay: 1000,
    },
  },
});

// 개발 환경에서 Query Client 디버깅
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).__REACT_QUERY_CLIENT__ = queryClient;
}
