import { api, ApiResponse } from './api';

// 인증 관련 타입 정의
export interface LoginRequest {
  id: string;
  password: string;
  autoLogin?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  id: string;
  username: string;
  password: string;
  email: string;
  nickname: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

// 인증 API 서비스
export const authService = {
  // 로그인
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  // 로그아웃
  logout: async (refreshToken: string): Promise<ApiResponse<void>> => {
    const response = await api.post('/auth/logout', { refreshToken });
    return response.data;
  },

  // 토큰 갱신
  refreshToken: async (data: RefreshTokenRequest): Promise<ApiResponse<TokenResponse>> => {
    const response = await api.post('/auth/refresh', data);
    return response.data;
  },

  // 회원가입
  register: async (data: RegisterRequest): Promise<ApiResponse<any>> => {
    const response = await api.post('/accounts', data);
    return response.data;
  },

  // ID 중복 체크
  checkIdExists: async (userId: string): Promise<ApiResponse<boolean>> => {
    const response = await api.get(`/accounts/${userId}/exists`);
    return response.data;
  },
};
