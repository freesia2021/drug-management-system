import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  usersService,
  type UpdateUserRequest, 
  type PageParams 
} from '../../services';
import { userKeys } from './queryKeys';

// 회원 목록 조회
export const useMembers = (params: PageParams = {}, enabled: boolean = true) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => usersService.getMembers(params),
    enabled,
    staleTime: 1000 * 60 * 5, // 5분간 fresh
  });
};

// 회원 상세 정보 조회
export const useMemberDetail = (userId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => usersService.getMemberDetail(userId),
    enabled: enabled && !!userId,
    staleTime: 1000 * 60 * 5, // 5분간 fresh
  });
};

// 회원 닉네임 이력 조회
export const useMemberNicknames = (userId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: userKeys.nicknames(userId),
    queryFn: () => usersService.getMemberNicknames(userId),
    enabled: enabled && !!userId,
    staleTime: 1000 * 60 * 10, // 10분간 fresh
  });
};

// 회원이 작성한 게시글 목록
export const useMemberArticles = (
  userId: string,
  params: PageParams = {},
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: userKeys.articles(userId, params),
    queryFn: () => usersService.getMemberArticles(userId, params),
    enabled: enabled && !!userId,
    staleTime: 1000 * 60, // 1분간 fresh
  });
};

// 회원이 작성한 댓글 목록
export const useMemberComments = (
  userId: string,
  params: PageParams = {},
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: userKeys.comments(userId, params),
    queryFn: () => usersService.getMemberComments(userId, params),
    enabled: enabled && !!userId,
    staleTime: 1000 * 60, // 1분간 fresh
  });
};

// 내 계정 정보 조회
export const useMyAccount = (userId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: userKeys.myAccount(userId),
    queryFn: () => usersService.getMyAccount(userId),
    enabled: enabled && !!userId,
    staleTime: 1000 * 60 * 5, // 5분간 fresh
  });
};

// 내 계정 정보 수정
export const useUpdateMyAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserRequest }) =>
      usersService.updateMyAccount(userId, data),
    onSuccess: (data, variables) => {
      // 내 계정 정보 업데이트
      queryClient.setQueryData(userKeys.myAccount(variables.userId), data);
      
      // 회원 상세 정보 무효화
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.userId) });
      
      // 회원 목록 무효화
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

// 회원 탈퇴
export const useDeleteMyAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => usersService.deleteMyAccount(userId),
    onSuccess: (data, userId) => {
      // 모든 사용자 관련 캐시 제거
      queryClient.removeQueries({ queryKey: userKeys.all });
      
      // 로그아웃 처리 (토큰 제거 등)
      // 이 부분은 auth 훅과 연동 필요
    },
  });
};

// 내가 작성한 게시글 목록
export const useMyArticles = (
  userId: string,
  page: number = 0,
  size: number = 20,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: userKeys.myArticles(userId, { page, size }),
    queryFn: () => usersService.getMyArticles(userId, page, size),
    enabled: enabled && !!userId,
    staleTime: 1000 * 60, // 1분간 fresh
  });
};

// 내가 작성한 댓글 목록
export const useMyComments = (
  userId: string,
  page: number = 0,
  size: number = 20,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: userKeys.myComments(userId, { page, size }),
    queryFn: () => usersService.getMyComments(userId, page, size),
    enabled: enabled && !!userId,
    staleTime: 1000 * 60, // 1분간 fresh
  });
};

// 내가 좋아요한 게시글 목록
export const useMyLikedArticles = (
  userId: string,
  page: number = 0,
  size: number = 20,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: userKeys.myLikedArticles(userId, { page, size }),
    queryFn: () => usersService.getMyLikedArticles(userId, page, size),
    enabled: enabled && !!userId,
    staleTime: 1000 * 60, // 1분간 fresh
  });
};

// 내가 좋아요한 댓글 목록
export const useMyLikedComments = (
  userId: string,
  page: number = 0,
  size: number = 20,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: userKeys.myLikedComments(userId, { page, size }),
    queryFn: () => usersService.getMyLikedComments(userId, page, size),
    enabled: enabled && !!userId,
    staleTime: 1000 * 60, // 1분간 fresh
  });
};

// 내 스크랩 목록
export const useMyScraps = (
  userId: string,
  page: number = 0,
  size: number = 20,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: userKeys.myScraps(userId, { page, size }),
    queryFn: () => usersService.getMyScraps(userId, page, size),
    enabled: enabled && !!userId,
    staleTime: 1000 * 60, // 1분간 fresh
  });
};

// 내가 신고한 게시글 목록
export const useMyReportedArticles = (
  userId: string,
  page: number = 0,
  size: number = 20,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: userKeys.myReportedArticles(userId, { page, size }),
    queryFn: () => usersService.getMyReportedArticles(userId, page, size),
    enabled: enabled && !!userId,
    staleTime: 1000 * 60, // 1분간 fresh
  });
};

// 내가 신고한 댓글 목록
export const useMyReportedComments = (
  userId: string,
  page: number = 0,
  size: number = 20,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: userKeys.myReportedComments(userId, { page, size }),
    queryFn: () => usersService.getMyReportedComments(userId, page, size),
    enabled: enabled && !!userId,
    staleTime: 1000 * 60, // 1분간 fresh
  });
};
