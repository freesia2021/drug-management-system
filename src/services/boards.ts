import { api, ApiResponse } from './api';

// 게시판 관련 타입 정의
export interface BoardResponse {
  id: number;
  name: string;
  shortName: string;
  config: string;
  createdAt: string;
}

export interface BoardGroupResponse {
  id: number;
  name: string;
  shortName: string;
  config: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateBoardConfigRequest {
  name: string;
  shortName: string;
  config: string;
}

// 게시판 API 서비스
export const boardsService = {
  // 게시판 목록 조회
  getBoards: async (): Promise<ApiResponse<BoardResponse[]>> => {
    const response = await api.get('/boards');
    return response.data;
  },

  // 게시판 상세 조회
  getBoardDetail: async (boardId: number): Promise<ApiResponse<BoardResponse>> => {
    const response = await api.get(`/boards/${boardId}`);
    return response.data;
  },

  // 게시판 설정 수정
  updateBoardConfig: async (
    boardId: number, 
    data: UpdateBoardConfigRequest
  ): Promise<ApiResponse<BoardResponse>> => {
    const response = await api.put(`/boards/${boardId}/configs`, data);
    return response.data;
  },

  // 게시판 공지사항 조회
  getBoardNotices: async (boardId: number): Promise<ApiResponse<any[]>> => {
    const response = await api.get(`/boards/${boardId}/notices`);
    return response.data;
  },

  // 게시판 검색
  searchBoardArticles: async (
    boardId: number,
    keyword: string,
    searchType: string = 'title',
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<any>> => {
    const response = await api.get(`/boards/${boardId}/search`, {
      params: { keyword, searchType, page, size }
    });
    return response.data;
  },
};

// 게시판 그룹 API 서비스
export const boardGroupsService = {
  // 게시판 그룹 목록 조회
  getBoardGroups: async (): Promise<ApiResponse<BoardGroupResponse[]>> => {
    const response = await api.get('/boardGroups');
    return response.data;
  },

  // 게시판 그룹 상세 조회
  getBoardGroupDetail: async (groupId: number): Promise<ApiResponse<BoardGroupResponse>> => {
    const response = await api.get(`/boardGroups/${groupId}`);
    return response.data;
  },

  // 게시판 그룹의 게시판 목록 조회
  getBoardGroupBoards: async (groupId: number): Promise<ApiResponse<BoardResponse[]>> => {
    const response = await api.get(`/boardGroups/${groupId}/boards`);
    return response.data;
  },

  // 게시판 그룹의 게시글 목록 조회
  getBoardGroupArticles: async (
    groupId: number,
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<any>> => {
    const response = await api.get(`/boardGroups/${groupId}/articles`, {
      params: { page, size }
    });
    return response.data;
  },

  // 게시판 그룹 공지사항 조회
  getBoardGroupNotices: async (groupId: number): Promise<ApiResponse<any[]>> => {
    const response = await api.get(`/boardGroups/${groupId}/notices`);
    return response.data;
  },
};
