import { api, ApiResponse, PageResponse, PageParams } from './api';

// 사용자 관련 타입 정의
export interface UserResponse {
  id: string;
  username: string;
  email: string;
  nickname: string;
  isNicknameUsed: boolean;
  nicknameImageUrl?: string;
  isSignatureUsed: boolean;
  signature?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DELETED';
  articleCount: number;
  commentCount: number;
  likeCount: number;
  loginCount: number;
  lastLoginAt?: string;
  createdAt: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  nickname?: string;
  isNicknameUsed?: boolean;
  nicknameImageUrl?: string;
  isSignatureUsed?: boolean;
  signature?: string;
}

export interface NicknameHistoryResponse {
  id: number;
  userId: string;
  nickname: string;
  changedAt: string;
}

// 사용자 API 서비스
export const usersService = {
  // 회원 목록 조회
  getMembers: async (params: PageParams = {}): Promise<ApiResponse<PageResponse<UserResponse>>> => {
    const response = await api.get('/members', { params });
    return response.data;
  },

  // 회원 상세 정보 조회
  getMemberDetail: async (userId: string): Promise<ApiResponse<UserResponse>> => {
    const response = await api.get(`/members/${userId}`);
    return response.data;
  },

  // 회원 닉네임 이력 조회
  getMemberNicknames: async (userId: string): Promise<ApiResponse<NicknameHistoryResponse[]>> => {
    const response = await api.get(`/members/${userId}/nicknames`);
    return response.data;
  },

  // 회원이 작성한 게시글 목록
  getMemberArticles: async (
    userId: string,
    params: PageParams = {}
  ): Promise<ApiResponse<PageResponse<any>>> => {
    const response = await api.get(`/members/${userId}/articles`, { params });
    return response.data;
  },

  // 회원이 작성한 댓글 목록
  getMemberComments: async (
    userId: string,
    params: PageParams = {}
  ): Promise<ApiResponse<PageResponse<any>>> => {
    const response = await api.get(`/members/${userId}/comments`, { params });
    return response.data;
  },

  // 내 계정 정보 조회
  getMyAccount: async (userId: string): Promise<ApiResponse<UserResponse>> => {
    const response = await api.get(`/accounts/${userId}`);
    return response.data;
  },

  // 내 계정 정보 수정
  updateMyAccount: async (
    userId: string,
    data: UpdateUserRequest
  ): Promise<ApiResponse<UserResponse>> => {
    const response = await api.put(`/accounts/${userId}`, data);
    return response.data;
  },

  // 회원 탈퇴
  deleteMyAccount: async (userId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/accounts/${userId}`);
    return response.data;
  },

  // 내가 작성한 게시글 목록
  getMyArticles: async (
    userId: string,
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<PageResponse<any>>> => {
    const response = await api.get(`/accounts/${userId}/articles`, {
      params: { page, size }
    });
    return response.data;
  },

  // 내가 작성한 댓글 목록
  getMyComments: async (
    userId: string,
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<PageResponse<any>>> => {
    const response = await api.get(`/accounts/${userId}/comments`, {
      params: { page, size }
    });
    return response.data;
  },

  // 내가 좋아요한 게시글 목록
  getMyLikedArticles: async (
    userId: string,
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<PageResponse<any>>> => {
    const response = await api.get(`/accounts/${userId}/likes/articles`, {
      params: { page, size }
    });
    return response.data;
  },

  // 내가 좋아요한 댓글 목록
  getMyLikedComments: async (
    userId: string,
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<PageResponse<any>>> => {
    const response = await api.get(`/accounts/${userId}/likes/comments`, {
      params: { page, size }
    });
    return response.data;
  },

  // 내 스크랩 목록
  getMyScraps: async (
    userId: string,
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<PageResponse<any>>> => {
    const response = await api.get(`/accounts/${userId}/scraps`, {
      params: { page, size }
    });
    return response.data;
  },

  // 내가 신고한 게시글 목록
  getMyReportedArticles: async (
    userId: string,
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<PageResponse<any>>> => {
    const response = await api.get(`/accounts/${userId}/reports/articles`, {
      params: { page, size }
    });
    return response.data;
  },

  // 내가 신고한 댓글 목록
  getMyReportedComments: async (
    userId: string,
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<PageResponse<any>>> => {
    const response = await api.get(`/accounts/${userId}/reports/comments`, {
      params: { page, size }
    });
    return response.data;
  },
};
