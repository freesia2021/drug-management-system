import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  boardsService, 
  boardGroupsService,
  type UpdateBoardConfigRequest 
} from '../../services';
import { boardKeys, boardGroupKeys } from './queryKeys';

// 게시판 목록 조회
export const useBoards = () => {
  return useQuery({
    queryKey: boardKeys.list(),
    queryFn: boardsService.getBoards,
    staleTime: 1000 * 60 * 10, // 10분간 fresh
  });
};

// 게시판 상세 조회
export const useBoardDetail = (boardId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: boardKeys.detail(boardId),
    queryFn: () => boardsService.getBoardDetail(boardId),
    enabled: enabled && !!boardId,
    staleTime: 1000 * 60 * 5, // 5분간 fresh
  });
};

// 게시판 공지사항 조회
export const useBoardNotices = (boardId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: boardKeys.notices(boardId),
    queryFn: () => boardsService.getBoardNotices(boardId),
    enabled: enabled && !!boardId,
    staleTime: 1000 * 60 * 5, // 5분간 fresh
  });
};

// 게시판 검색
export const useBoardSearch = (
  boardId: number,
  keyword: string,
  searchType: string = 'title',
  page: number = 0,
  size: number = 20,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: boardKeys.search(boardId, { keyword, searchType, page, size }),
    queryFn: () => boardsService.searchBoardArticles(boardId, keyword, searchType, page, size),
    enabled: enabled && !!boardId && !!keyword,
    staleTime: 1000 * 30, // 30초간 fresh
  });
};

// 게시판 설정 수정
export const useUpdateBoardConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, data }: { boardId: number; data: UpdateBoardConfigRequest }) =>
      boardsService.updateBoardConfig(boardId, data),
    onSuccess: (data, variables) => {
      // 게시판 상세 정보 무효화
      queryClient.invalidateQueries({ queryKey: boardKeys.detail(variables.boardId) });
      // 게시판 목록 무효화
      queryClient.invalidateQueries({ queryKey: boardKeys.lists() });
    },
  });
};

// === 게시판 그룹 관련 훅들 ===

// 게시판 그룹 목록 조회
export const useBoardGroups = () => {
  return useQuery({
    queryKey: boardGroupKeys.list(),
    queryFn: boardGroupsService.getBoardGroups,
    staleTime: 1000 * 60 * 10, // 10분간 fresh
  });
};

// 게시판 그룹 상세 조회
export const useBoardGroupDetail = (groupId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: boardGroupKeys.detail(groupId),
    queryFn: () => boardGroupsService.getBoardGroupDetail(groupId),
    enabled: enabled && !!groupId,
    staleTime: 1000 * 60 * 5, // 5분간 fresh
  });
};

// 게시판 그룹의 게시판 목록 조회
export const useBoardGroupBoards = (groupId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: boardGroupKeys.boards(groupId),
    queryFn: () => boardGroupsService.getBoardGroupBoards(groupId),
    enabled: enabled && !!groupId,
    staleTime: 1000 * 60 * 5, // 5분간 fresh
  });
};

// 게시판 그룹의 게시글 목록 조회
export const useBoardGroupArticles = (
  groupId: number,
  page: number = 0,
  size: number = 20,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: boardGroupKeys.articles(groupId, { page, size }),
    queryFn: () => boardGroupsService.getBoardGroupArticles(groupId, page, size),
    enabled: enabled && !!groupId,
    staleTime: 1000 * 60, // 1분간 fresh
  });
};

// 게시판 그룹 공지사항 조회
export const useBoardGroupNotices = (groupId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: boardGroupKeys.notices(groupId),
    queryFn: () => boardGroupsService.getBoardGroupNotices(groupId),
    enabled: enabled && !!groupId,
    staleTime: 1000 * 60 * 5, // 5분간 fresh
  });
};
