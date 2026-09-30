import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { 
  articlesService,
  type CreateArticleRequest, 
  type UpdateArticleRequest, 
  type ScrapRequest, 
  type ReportRequest, 
  type PageParams 
} from '../../services';
import { articleKeys, commentKeys } from './queryKeys';

// 게시글 목록 조회 (일반 페이징)
export const useArticles = (
  boardId: number,
  params: PageParams = {},
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: articleKeys.list(boardId, params),
    queryFn: () => articlesService.getBoardArticles(boardId, params),
    enabled: enabled && !!boardId,
    staleTime: 1000 * 60, // 1분간 fresh
    refetchOnWindowFocus: true, // 윈도우 포커스 시 자동 refetch
    refetchOnMount: true, // 마운트 시 자동 refetch
  });
};

// 게시글 목록 조회 (무한 스크롤)
export const useInfiniteArticles = (
  boardId: number,
  params: Omit<PageParams, 'page'> = {},
  enabled: boolean = true
) => {
  return useInfiniteQuery({
    queryKey: articleKeys.list(boardId, params),
    queryFn: ({ pageParam = 0 }) =>
      articlesService.getBoardArticles(boardId, { ...params, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.last) return undefined;
      return lastPage.page + 1;
    },
    enabled: enabled && !!boardId,
    staleTime: 1000 * 60, // 1분간 fresh
  });
};

// 게시글 상세 조회
export const useArticle = (
  boardId: number,
  articleId: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: articleKeys.detail(boardId, articleId),
    queryFn: () => articlesService.getArticle(boardId, articleId),
    enabled: enabled && !!boardId && !!articleId,
    staleTime: 1000 * 60 * 5, // 5분간 fresh
  });
};

// 게시글 작성
export const useCreateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, data }: { boardId: number; data: CreateArticleRequest }) =>
      articlesService.createArticle(boardId, data),
    onSuccess: (data, variables) => {
      // 해당 게시판의 게시글 목록 무효화
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: articleKeys.list(variables.boardId) });
    },
  });
};

// 게시글 수정
export const useUpdateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      boardId, 
      articleId, 
      data 
    }: { 
      boardId: number; 
      articleId: number; 
      data: UpdateArticleRequest;
    }) => articlesService.updateArticle(boardId, articleId, data),
    onSuccess: (data, variables) => {
      // 게시글 상세 정보 업데이트
      queryClient.setQueryData(
        articleKeys.detail(variables.boardId, variables.articleId),
        data
      );
      // 게시글 목록 무효화
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
    },
  });
};

// 게시글 삭제
export const useDeleteArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, articleId }: { boardId: number; articleId: number }) =>
      articlesService.deleteArticle(boardId, articleId),
    onSuccess: (data, variables) => {
      // 게시글 상세 캐시 제거
      queryClient.removeQueries({
        queryKey: articleKeys.detail(variables.boardId, variables.articleId)
      });
      // 댓글 캐시 제거
      queryClient.removeQueries({
        queryKey: commentKeys.list(variables.boardId, variables.articleId)
      });
      // 게시글 목록 무효화
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
    },
  });
};

// 게시글 좋아요
export const useLikeArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, articleId }: { boardId: number; articleId: number }) =>
      articlesService.likeArticle(boardId, articleId),
    onSuccess: (data, variables) => {
      // 게시글 상세 정보 무효화 (좋아요 수 업데이트를 위해)
      queryClient.invalidateQueries({
        queryKey: articleKeys.detail(variables.boardId, variables.articleId)
      });
      // 좋아요한 사용자 목록 무효화
      queryClient.invalidateQueries({
        queryKey: articleKeys.likers(variables.boardId, variables.articleId)
      });
    },
  });
};

// 게시글 좋아요 취소
export const useUnlikeArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, articleId }: { boardId: number; articleId: number }) =>
      articlesService.unlikeArticle(boardId, articleId),
    onSuccess: (data, variables) => {
      // 게시글 상세 정보 무효화
      queryClient.invalidateQueries({
        queryKey: articleKeys.detail(variables.boardId, variables.articleId)
      });
      // 좋아요한 사용자 목록 무효화
      queryClient.invalidateQueries({
        queryKey: articleKeys.likers(variables.boardId, variables.articleId)
      });
    },
  });
};

// 게시글 신고
export const useReportArticle = () => {
  return useMutation({
    mutationFn: ({ 
      boardId, 
      articleId, 
      data 
    }: { 
      boardId: number; 
      articleId: number; 
      data: ReportRequest;
    }) => articlesService.reportArticle(boardId, articleId, data),
  });
};

// 게시글 스크랩
export const useScrapArticle = () => {
  return useMutation({
    mutationFn: ({ 
      boardId, 
      articleId, 
      data 
    }: { 
      boardId: number; 
      articleId: number; 
      data: ScrapRequest;
    }) => articlesService.scrapArticle(boardId, articleId, data),
  });
};

// 게시글 스크랩 수정
export const useUpdateScrapMemo = () => {
  return useMutation({
    mutationFn: ({ 
      boardId, 
      articleId, 
      data 
    }: { 
      boardId: number; 
      articleId: number; 
      data: ScrapRequest;
    }) => articlesService.updateScrapMemo(boardId, articleId, data),
  });
};

// 게시글 스크랩 삭제
export const useDeleteScrap = () => {
  return useMutation({
    mutationFn: ({ boardId, articleId }: { boardId: number; articleId: number }) =>
      articlesService.deleteScrap(boardId, articleId),
  });
};

// 이전/다음 게시글 정보 조회
export const useArticleNeighbor = (
  boardId: number,
  articleId: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: articleKeys.neighbor(boardId, articleId),
    queryFn: () => articlesService.getArticleNeighbor(boardId, articleId),
    enabled: enabled && !!boardId && !!articleId,
    staleTime: 1000 * 60 * 5, // 5분간 fresh
  });
};

// 게시글 좋아요한 사용자 목록
export const useArticleLikers = (
  boardId: number,
  articleId: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: articleKeys.likers(boardId, articleId),
    queryFn: () => articlesService.getArticleLikers(boardId, articleId),
    enabled: enabled && !!boardId && !!articleId,
    staleTime: 1000 * 60, // 1분간 fresh
  });
};

// 게시글 댓글 작성자 목록
export const useArticleCommenters = (
  boardId: number,
  articleId: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: articleKeys.commenters(boardId, articleId),
    queryFn: () => articlesService.getArticleCommenters(boardId, articleId),
    enabled: enabled && !!boardId && !!articleId,
    staleTime: 1000 * 60, // 1분간 fresh
  });
};

// 게시글 상태 변경
export const useUpdateArticleStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      boardId,
      articleId,
      status,
    }: {
      boardId: number;
      articleId: number;
      status: 'PENDING' | 'APPROVED' | 'REJECTED';
    }) => articlesService.updateArticleStatus(boardId, articleId, status),
    onSuccess: (data, variables) => {
      // 게시글 상세 정보 업데이트
      queryClient.setQueryData(
        articleKeys.detail(variables.boardId, variables.articleId),
        data
      );
      // 게시글 목록 무효화 (상태 변경 반영)
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: articleKeys.list(variables.boardId) });
    },
  });
};
