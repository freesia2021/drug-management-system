import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { 
  commentsService,
  type CreateCommentRequest, 
  type UpdateCommentRequest, 
  type ReportRequest,
  type PageParams 
} from '../../services';
import { commentKeys, articleKeys } from './queryKeys';

// 댓글 목록 조회 (일반 페이징)
export const useComments = (
  boardId: number,
  articleId: number,
  params: PageParams = {},
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: commentKeys.list(boardId, articleId, params),
    queryFn: () => commentsService.getArticleComments(boardId, articleId, params),
    enabled: enabled && !!boardId && !!articleId,
    staleTime: 1000 * 30, // 30초간 fresh
  });
};

// 댓글 목록 조회 (무한 스크롤)
export const useInfiniteComments = (
  boardId: number,
  articleId: number,
  params: Omit<PageParams, 'page'> = {},
  enabled: boolean = true
) => {
  return useInfiniteQuery({
    queryKey: commentKeys.list(boardId, articleId, params),
    queryFn: ({ pageParam = 0 }) =>
      commentsService.getArticleComments(boardId, articleId, { ...params, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.last) return undefined;
      return lastPage.page + 1;
    },
    enabled: enabled && !!boardId && !!articleId,
    staleTime: 1000 * 30, // 30초간 fresh
  });
};

// 댓글 상세 조회
export const useComment = (
  boardId: number,
  articleId: number,
  commentId: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: commentKeys.detail(boardId, articleId, commentId),
    queryFn: () => commentsService.getComment(boardId, articleId, commentId),
    enabled: enabled && !!boardId && !!articleId && !!commentId,
    staleTime: 1000 * 60 * 5, // 5분간 fresh
  });
};

// 댓글 작성
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      boardId, 
      articleId, 
      data 
    }: { 
      boardId: number; 
      articleId: number; 
      data: CreateCommentRequest;
    }) => commentsService.createComment(boardId, articleId, data),
    onSuccess: (data, variables) => {
      // 댓글 목록 무효화
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.lists()
      });
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.list(variables.boardId, variables.articleId)
      });
      
      // 게시글의 댓글 수 업데이트를 위해 게시글 정보 무효화
      queryClient.invalidateQueries({
        queryKey: articleKeys.detail(variables.boardId, variables.articleId)
      });
      
      // 게시글 댓글 작성자 목록 무효화
      queryClient.invalidateQueries({
        queryKey: articleKeys.commenters(variables.boardId, variables.articleId)
      });
    },
  });
};

// 댓글 수정
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      boardId, 
      articleId, 
      commentId, 
      data 
    }: { 
      boardId: number; 
      articleId: number; 
      commentId: number;
      data: UpdateCommentRequest;
    }) => commentsService.updateComment(boardId, articleId, commentId, data),
    onSuccess: (data, variables) => {
      // 댓글 상세 정보 업데이트
      queryClient.setQueryData(
        commentKeys.detail(variables.boardId, variables.articleId, variables.commentId),
        data
      );
      
      // 댓글 목록 무효화
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.list(variables.boardId, variables.articleId)
      });
    },
  });
};

// 댓글 삭제
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      boardId, 
      articleId, 
      commentId 
    }: { 
      boardId: number; 
      articleId: number; 
      commentId: number;
    }) => commentsService.deleteComment(boardId, articleId, commentId),
    onSuccess: (data, variables) => {
      // 댓글 상세 캐시 제거
      queryClient.removeQueries({
        queryKey: commentKeys.detail(variables.boardId, variables.articleId, variables.commentId)
      });
      
      // 댓글 목록 무효화
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.list(variables.boardId, variables.articleId)
      });
      
      // 게시글의 댓글 수 업데이트를 위해 게시글 정보 무효화
      queryClient.invalidateQueries({
        queryKey: articleKeys.detail(variables.boardId, variables.articleId)
      });
      
      // 게시글 댓글 작성자 목록 무효화
      queryClient.invalidateQueries({
        queryKey: articleKeys.commenters(variables.boardId, variables.articleId)
      });
    },
  });
};

// 댓글 좋아요
export const useLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      boardId, 
      articleId, 
      commentId 
    }: { 
      boardId: number; 
      articleId: number; 
      commentId: number;
    }) => commentsService.likeComment(boardId, articleId, commentId),
    onSuccess: (data, variables) => {
      // 댓글 상세 정보 무효화 (좋아요 수 업데이트를 위해)
      queryClient.invalidateQueries({
        queryKey: commentKeys.detail(variables.boardId, variables.articleId, variables.commentId)
      });
      
      // 댓글 목록 무효화
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.list(variables.boardId, variables.articleId)
      });
      
      // 댓글 좋아요한 사용자 목록 무효화
      queryClient.invalidateQueries({
        queryKey: commentKeys.likers(variables.boardId, variables.articleId, variables.commentId)
      });
    },
  });
};

// 댓글 좋아요 취소
export const useUnlikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      boardId, 
      articleId, 
      commentId 
    }: { 
      boardId: number; 
      articleId: number; 
      commentId: number;
    }) => commentsService.unlikeComment(boardId, articleId, commentId),
    onSuccess: (data, variables) => {
      // 댓글 상세 정보 무효화
      queryClient.invalidateQueries({
        queryKey: commentKeys.detail(variables.boardId, variables.articleId, variables.commentId)
      });
      
      // 댓글 목록 무효화
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.list(variables.boardId, variables.articleId)
      });
      
      // 댓글 좋아요한 사용자 목록 무효화
      queryClient.invalidateQueries({
        queryKey: commentKeys.likers(variables.boardId, variables.articleId, variables.commentId)
      });
    },
  });
};

// 댓글 신고
export const useReportComment = () => {
  return useMutation({
    mutationFn: ({ 
      boardId, 
      articleId, 
      commentId, 
      data 
    }: { 
      boardId: number; 
      articleId: number; 
      commentId: number;
      data: ReportRequest;
    }) => commentsService.reportComment(boardId, articleId, commentId, data),
  });
};

// 댓글 좋아요한 사용자 목록
export const useCommentLikers = (
  boardId: number,
  articleId: number,
  commentId: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: commentKeys.likers(boardId, articleId, commentId),
    queryFn: () => commentsService.getCommentLikers(boardId, articleId, commentId),
    enabled: enabled && !!boardId && !!articleId && !!commentId,
    staleTime: 1000 * 60, // 1분간 fresh
  });
};
