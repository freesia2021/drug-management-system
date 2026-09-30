import { api, ApiResponse, PageResponse, PageParams } from './api';
import { FileResponse, ReportRequest } from './articles';

// 댓글 관련 타입 정의
export interface CommentResponse {
  id: number;
  articleId: number;
  boardId: number;
  authorId: string;
  parentCommentId?: number;
  content: string;
  likeCount: number;
  replyCount: number;
  reportCount: number;
  createdAt: string;
  updatedAt: string;
  files?: FileResponse[];
}

export interface CreateCommentRequest {
  content: string;
  parentCommentId?: number;
  fileIds?: number[];
}

export interface UpdateCommentRequest {
  content: string;
  fileIds?: number[];
}

// 댓글 API 서비스
export const commentsService = {
  // 댓글 목록 조회
  getArticleComments: async (
    boardId: number,
    articleId: number,
    params: PageParams = {}
  ): Promise<PageResponse<CommentResponse>> => {
    const response = await api.get(
      `/boards/${boardId}/articles/${articleId}/comments`,
      { params }
    );
    return response.data;
  },

  // 댓글 상세 조회
  getComment: async (
    boardId: number,
    articleId: number,
    commentId: number
  ): Promise<CommentResponse> => {
    const response = await api.get(
      `/boards/${boardId}/articles/${articleId}/comments/${commentId}`
    );
    return response.data;
  },

  // 댓글 작성
  createComment: async (
    boardId: number,
    articleId: number,
    data: CreateCommentRequest
  ): Promise<CommentResponse> => {
    const response = await api.post(
      `/boards/${boardId}/articles/${articleId}/comments`,
      data
    );
    return response.data;
  },

  // 댓글 수정
  updateComment: async (
    boardId: number,
    articleId: number,
    commentId: number,
    data: UpdateCommentRequest
  ): Promise<CommentResponse> => {
    const response = await api.put(
      `/boards/${boardId}/articles/${articleId}/comments/${commentId}`,
      data
    );
    return response.data;
  },

  // 댓글 삭제
  deleteComment: async (
    boardId: number,
    articleId: number,
    commentId: number
  ): Promise<void> => {
    await api.delete(`/boards/${boardId}/articles/${articleId}/comments/${commentId}`);
  },

  // 댓글 좋아요
  likeComment: async (
    boardId: number,
    articleId: number,
    commentId: number
  ): Promise<void> => {
    await api.post(`/boards/${boardId}/articles/${articleId}/comments/${commentId}/like`);
  },

  // 댓글 좋아요 취소
  unlikeComment: async (
    boardId: number,
    articleId: number,
    commentId: number
  ): Promise<void> => {
    await api.delete(`/boards/${boardId}/articles/${articleId}/comments/${commentId}/like`);
  },

  // 댓글 신고
  reportComment: async (
    boardId: number,
    articleId: number,
    commentId: number,
    data: ReportRequest
  ): Promise<void> => {
    await api.post(
      `/boards/${boardId}/articles/${articleId}/comments/${commentId}/report`,
      data
    );
  },

  // 댓글 좋아요한 사용자 목록
  getCommentLikers: async (
    boardId: number,
    articleId: number,
    commentId: number
  ): Promise<string[]> => {
    const response = await api.get(
      `/boards/${boardId}/articles/${articleId}/comments/${commentId}/likers`
    );
    return response.data;
  },
};
