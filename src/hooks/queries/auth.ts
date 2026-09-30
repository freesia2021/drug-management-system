import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { jwtDecode } from 'jwt-decode';
import { 
  authService, 
  setAuthToken, 
  removeAuthToken,
  type LoginRequest, 
  type RegisterRequest, 
  type RefreshTokenRequest 
} from '../../services';
import { authKeys } from './queryKeys';

// 인증 상태 atom (jotai)
import { atomWithStorage } from 'jotai/utils';

interface AuthUser {
  id: string;
  username: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

export const authUserAtom = atomWithStorage<AuthUser | null>('authUser', null);

// 로그인 mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  const [, setAuthUser] = useAtom(authUserAtom);

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (response) => {
      const { accessToken, refreshToken } = response.data;
      
      // 토큰 저장
      setAuthToken(accessToken);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      // JWT 토큰 디코딩하여 사용자 정보 추출
      let userId = '';
      let username = '';
      let email = '';
      
      try {
        const decodedAccessToken: any = jwtDecode(accessToken);
        const decodedRefreshToken = jwtDecode(refreshToken);
        
        console.log('=== 로그인 성공 - 토큰 정보 ===');
        console.log('Access Token 디코딩 결과:', decodedAccessToken);
        console.log('Refresh Token 디코딩 결과:', decodedRefreshToken);
        // roles 정보 확인
        if (decodedAccessToken.roles) {
          console.log('Roles 정보:', decodedAccessToken.roles);
        } else if (decodedAccessToken.role) {
          console.log('Role 정보:', decodedAccessToken.role);
        } else {
          console.log('Roles 정보가 토큰에 포함되어 있지 않습니다.');
        }
        console.log('================================');
        
        // JWT 토큰에서 사용자 정보 추출 (일반적인 JWT 필드명)
        userId = decodedAccessToken.sub || decodedAccessToken.userId || decodedAccessToken.id || '';
        username = decodedAccessToken.username || decodedAccessToken.name || '';
        email = decodedAccessToken.email || '';
        
        // 사용자 ID를 localStorage에도 저장 (빠른 접근을 위해)
        if (userId) {
          localStorage.setItem('userId', userId);
        }
      } catch (error) {
        console.error('토큰 디코딩 실패:', error);
      }
      
      // 사용자 정보 저장
      const user: AuthUser = {
        id: userId,
        username,
        email,
        accessToken,
        refreshToken,
      };
      
      setAuthUser(user);
      
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

// 로그아웃 mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  const [, setAuthUser] = useAtom(authUserAtom);

  return useMutation({
    mutationFn: (refreshToken: string) => authService.logout(refreshToken),
    onSuccess: () => {
      // 토큰 및 사용자 정보 제거
      removeAuthToken();
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('tokenExpiry');
      localStorage.removeItem('userId');
      setAuthUser(null);
      
      // 모든 쿼리 캐시 클리어
      queryClient.clear();
    },
    onError: (error) => {
      // 에러가 발생해도 로컬 정보는 제거
      removeAuthToken();
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('tokenExpiry');
      localStorage.removeItem('userId');
      setAuthUser(null);
      queryClient.clear();
    },
  });
};

// 회원가입 mutation
export const useRegister = () => {
  return useMutation({
    mutationFn: authService.register,
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });
};

// ID 중복 체크 query
export const useCheckIdExists = (userId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: authKeys.checkId(userId),
    queryFn: () => authService.checkIdExists(userId),
    enabled: enabled && !!userId,
    staleTime: 1000 * 60 * 5, // 5분간 fresh
  });
};

// 토큰 갱신 mutation
export const useRefreshToken = () => {
  const [authUser, setAuthUser] = useAtom(authUserAtom);

  return useMutation({
    mutationFn: authService.refreshToken,
    onSuccess: (response) => {
      const { accessToken, refreshToken } = response.data;
      
      // 새 토큰 저장 (setAuthToken이 만료시간도 자동 저장)
      setAuthToken(accessToken);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      // 사용자 정보 업데이트
      if (authUser) {
        setAuthUser({
          ...authUser,
          accessToken,
          refreshToken,
        });
      }
    },
    onError: (error) => {
      // 리프레시 실패 시 로그아웃
      removeAuthToken();
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('tokenExpiry');
      localStorage.removeItem('userId');
      setAuthUser(null);
      window.location.href = '/login';
    },
  });
};

// 인증 상태 확인 hook
export const useAuth = () => {
  const [authUser] = useAtom(authUserAtom);
  
  return {
    user: authUser,
    isAuthenticated: !!authUser?.accessToken,
    isLoading: false, // 필요시 로딩 상태 추가
  };
};

// 로그인 필요 시 리다이렉트 hook
export const useRequireAuth = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated && typeof window !== 'undefined') {
    window.location.href = '/login';
  }
  
  return isAuthenticated;
};
