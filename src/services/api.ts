import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';

// API 기본 설정
const API_BASE_URL = '/api/orbit';

// Axios 인스턴스 생성
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 갱신 중 여부를 추적하는 변수
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 토큰 관리
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};

const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', token);
    
    // 토큰의 만료 시간 저장
    try {
      const decoded = jwtDecode(token) as any;
      if (decoded.exp) {
        localStorage.setItem('tokenExpiry', decoded.exp.toString());
      }
    } catch (error) {
      console.error('토큰 디코딩 실패:', error);
    }
  }
};

const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiry');
  }
};

// 토큰 만료 확인 (5분 전에 미리 갱신)
const isTokenExpiringSoon = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const expiry = localStorage.getItem('tokenExpiry');
  if (!expiry) return false;
  
  const expiryTime = parseInt(expiry, 10) * 1000; // 초를 밀리초로 변환
  const currentTime = Date.now();
  const fiveMinutes = 5 * 60 * 1000; // 5분
  
  return expiryTime - currentTime < fiveMinutes;
};

// 토큰 만료 확인 (완전 만료)
const isTokenExpired = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const expiry = localStorage.getItem('tokenExpiry');
  if (!expiry) return false;
  
  const expiryTime = parseInt(expiry, 10) * 1000;
  const currentTime = Date.now();
  
  return currentTime >= expiryTime;
};

// 토큰 갱신
const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken,
    });
    
    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
    
    // 새 토큰 저장
    setAuthToken(accessToken);
    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken);
    }
    
    return accessToken;
  } catch (error) {
    console.error('토큰 갱신 실패:', error);
    removeAuthToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw error;
  }
};

// Request 인터셉터 - 토큰 만료 확인 및 자동 갱신
api.interceptors.request.use(
  async (config) => {
    // 완전 만료된 경우 로그인 페이지로 이동
    if (isTokenExpired()) {
      removeAuthToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(new Error('Token expired'));
    }
    
    // 토큰이 곧 만료되는 경우 (5분 이내) 갱신 시도
    if (isTokenExpiringSoon()) {
      if (isRefreshing) {
        // 이미 갱신 중이면 대기
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (config.headers) {
              config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }
      
      isRefreshing = true;
      
      try {
        const newToken = await refreshAccessToken();
        isRefreshing = false;
        processQueue(null, newToken);
        
        if (config.headers && newToken) {
          config.headers.Authorization = `Bearer ${newToken}`;
        }
      } catch (error) {
        isRefreshing = false;
        processQueue(error, null);
        return Promise.reject(error);
      }
    } else {
      // 토큰이 유효하면 기존 토큰 사용
      const token = getAuthToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response 인터셉터 - 401 에러 처리
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // 401 에러이고 아직 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 이미 갱신 중이면 대기
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        isRefreshing = false;
        processQueue(null, newToken);

        // 원래 요청 재시도
        if (originalRequest.headers && newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        // Refresh 실패 시 로그인 페이지로 이동
        removeAuthToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// 공통 API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

// 페이징 응답 타입
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// 페이징 파라미터 타입
export interface PageParams {
  page?: number;
  size?: number;
  sort?: string[];
}

// 에러 핸들러
export const handleApiError = (error: AxiosError): string => {
  if (error.response?.data) {
    const errorData = error.response.data as any;
    return errorData.message || '오류가 발생했습니다.';
  }
  return error.message || '네트워크 오류가 발생했습니다.';
};

export { setAuthToken, removeAuthToken };
