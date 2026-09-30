import { api, ApiResponse, PageResponse, PageParams } from './api';

// 게시글 관련 타입 정의
export interface ArticleResponse {
  id: number;
  boardId: number;
  authorId: string;
  title: string;
  content: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  reportCount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  statusChangedAt?: string;
  statusChangedBy?: string;
  createdAt: string;
  updatedAt: string;
  files?: FileResponse[];
}

export interface FileResponse {
  id: number;
  targetType: 'ARTICLE' | 'COMMENT' | 'STANDALONE';
  targetId: number;
  originalFilename: string;
  storedFilename: string;
  filePath: string;
  fileSize: number;
  contentType: string;
  uploaderId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleRequest {
  title: string;
  content: string;
  fileIds?: number[];
}

export interface UpdateArticleRequest {
  title: string;
  content: string;
  fileIds?: number[];
}

export interface ArticleNeighborResponse {
  prev?: {
    id: number;
    title: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
  };
  next?: {
    id: number;
    title: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
  };
}

export interface ScrapRequest {
  memo?: string;
}

export interface ReportRequest {
  reason: string;
}

// 게시글 API 서비스
export const articlesService = {
  // 게시글 목록 조회
  getBoardArticles: async (
    boardId: number,
    params: PageParams = {}
  ): Promise<PageResponse<ArticleResponse>> => {
    const response = await api.get(`/boards/${boardId}/articles`, { params });
    return response.data;
  },

  // 게시글 상세 조회
  getArticle: async (boardId: number, articleId: number): Promise<ArticleResponse> => {
    const response = await api.get(`/boards/${boardId}/articles/${articleId}`);
    return response.data;
  },

  // 게시글 작성
  createArticle: async (
    boardId: number,
    data: CreateArticleRequest
  ): Promise<ArticleResponse> => {
    const response = await api.post(`/boards/${boardId}/articles`, data);
    return response.data;
  },

  // 게시글 수정
  updateArticle: async (
    boardId: number,
    articleId: number,
    data: UpdateArticleRequest
  ): Promise<ArticleResponse> => {
    const response = await api.put(`/boards/${boardId}/articles/${articleId}`, data);
    return response.data;
  },

  // 게시글 삭제
  deleteArticle: async (boardId: number, articleId: number): Promise<void> => {
    await api.delete(`/boards/${boardId}/articles/${articleId}`);
  },

  // 게시글 좋아요
  likeArticle: async (boardId: number, articleId: number): Promise<void> => {
    await api.post(`/boards/${boardId}/articles/${articleId}/like`);
  },

  // 게시글 좋아요 취소
  unlikeArticle: async (boardId: number, articleId: number): Promise<void> => {
    await api.delete(`/boards/${boardId}/articles/${articleId}/like`);
  },

  // 게시글 신고
  reportArticle: async (
    boardId: number,
    articleId: number,
    data: ReportRequest
  ): Promise<void> => {
    await api.post(`/boards/${boardId}/articles/${articleId}/report`, data);
  },

  // 게시글 스크랩
  scrapArticle: async (
    boardId: number,
    articleId: number,
    data: ScrapRequest
  ): Promise<void> => {
    await api.post(`/boards/${boardId}/articles/${articleId}/scrap`, data);
  },

  // 게시글 스크랩 수정
  updateScrapMemo: async (
    boardId: number,
    articleId: number,
    data: ScrapRequest
  ): Promise<void> => {
    await api.put(`/boards/${boardId}/articles/${articleId}/scrap`, data);
  },

  // 게시글 스크랩 삭제
  deleteScrap: async (boardId: number, articleId: number): Promise<void> => {
    await api.delete(`/boards/${boardId}/articles/${articleId}/scrap`);
  },

  // 이전/다음 게시글 정보 조회
  getArticleNeighbor: async (
    boardId: number,
    articleId: number
  ): Promise<ArticleNeighborResponse> => {
    const response = await api.get(`/boards/${boardId}/articles/${articleId}/neighbor`);
    return response.data;
  },

  // 게시글 좋아요한 사용자 목록
  getArticleLikers: async (boardId: number, articleId: number): Promise<string[]> => {
    const response = await api.get(`/boards/${boardId}/articles/${articleId}/likers`);
    return response.data;
  },

  // 게시글 댓글 작성자 목록
  getArticleCommenters: async (boardId: number, articleId: number): Promise<string[]> => {
    const response = await api.get(`/boards/${boardId}/articles/${articleId}/commenters`);
    return response.data;
  },

  // 게시글 상태 변경
  updateArticleStatus: async (
    boardId: number,
    articleId: number,
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
  ): Promise<ArticleResponse> => {
    const response = await api.put(`/boards/${boardId}/articles/${articleId}/status`, null, {
      params: { status },
    });
    return response.data;
  },
};
