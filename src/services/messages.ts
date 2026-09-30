import { api, ApiResponse } from './api';

// 메시지 관련 타입 정의
export interface MessageResponse {
  id: number;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface SendMessageRequest {
  content: string;
}

// 메모 관련 타입 정의
export interface MemoResponse {
  id: number;
  userId: string;
  targetUserId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMemoRequest {
  content: string;
}

// 메시지 API 서비스
export const messagesService = {
  // 쪽지 목록 조회
  getMessages: async (userId: string): Promise<ApiResponse<MessageResponse[]>> => {
    const response = await api.get(`/messages/${userId}`);
    return response.data;
  },

  // 특정 사용자와의 쪽지 목록 조회
  getMessagesWithTarget: async (
    userId: string,
    targetUserId: string
  ): Promise<ApiResponse<MessageResponse[]>> => {
    const response = await api.get(`/messages/${userId}/${targetUserId}`);
    return response.data;
  },

  // 쪽지 보내기
  sendMessage: async (
    userId: string,
    targetUserId: string,
    data: SendMessageRequest
  ): Promise<ApiResponse<MessageResponse>> => {
    const response = await api.post(`/messages/${userId}/${targetUserId}`, data);
    return response.data;
  },

  // 특정 사용자와의 쪽지 삭제
  deleteMessages: async (userId: string, targetUserId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/messages/${userId}/${targetUserId}`);
    return response.data;
  },
};

// 메모 API 서비스
export const memosService = {
  // 메모 목록 조회
  getMemos: async (userId: string): Promise<ApiResponse<MemoResponse[]>> => {
    const response = await api.get(`/memo/${userId}`);
    return response.data;
  },

  // 메모 저장
  createMemo: async (
    userId: string,
    targetUserId: string,
    data: CreateMemoRequest
  ): Promise<ApiResponse<MemoResponse>> => {
    const response = await api.post(`/memo/${userId}/${targetUserId}`, data);
    return response.data;
  },

  // 메모 수정
  updateMemo: async (
    userId: string,
    targetUserId: string,
    data: CreateMemoRequest
  ): Promise<ApiResponse<MemoResponse>> => {
    const response = await api.put(`/memo/${userId}/${targetUserId}`, data);
    return response.data;
  },

  // 메모 삭제
  deleteMemo: async (userId: string, targetUserId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/memo/${userId}/${targetUserId}`);
    return response.data;
  },
};
